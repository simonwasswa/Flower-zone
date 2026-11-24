// Resend "email.received" webhook: verifies the signature, fetches the full email from Resend,
// and files it into the admin inbox (inbox_threads / inbox_messages) using the Supabase service-role key.
import { createHmac, timingSafeEqual } from 'node:crypto';

export type InboundConfig = {
  resendApiKey?: string;
  webhookSecret?: string;
  supabaseUrl?: string;
  serviceRoleKey?: string;
  inboxEmail?: string;
};

export type InboundResult = { status: number; body: Record<string, unknown> };

type Headers = Record<string, string | undefined>;

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;
const MAX_BODY_CHARS = 100_000;

export function inboundConfigFromEnv(env: Record<string, string | undefined>): InboundConfig {
  return {
    resendApiKey: env.RESEND_API_KEY,
    webhookSecret: env.RESEND_WEBHOOK_SECRET,
    supabaseUrl: env.VITE_SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    inboxEmail: env.INBOX_EMAIL,
  };
}

/** Resend signs webhooks with Svix: base64(HMAC-SHA256(secret, `${id}.${timestamp}.${body}`)). */
export function verifyWebhook(rawBody: string, headers: Headers, secret: string, now = Date.now()) {
  const id = headers['svix-id'];
  const timestamp = headers['svix-timestamp'];
  const signatures = headers['svix-signature'];
  if (!id || !timestamp || !signatures) return false;

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt) || Math.abs(now / 1000 - sentAt) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signatures.split(' ').some((entry) => {
    const [version, signature] = entry.split(',');
    if (version !== 'v1' || !signature) return false;
    const given = Buffer.from(signature, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

function parseAddress(value: string) {
  const match = value.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  return match
    ? { name: match[1].trim() || null, email: match[2].trim().toLowerCase() }
    : { name: null, email: value.trim().toLowerCase() };
}

export function htmlToText(html: string) {
  return html
    .replace(/<(style|script|head)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6]|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** "Re: Fwd: Hello" -> "hello", so replies land in the original conversation. */
export function normalizeSubject(subject: string) {
  return subject.replace(/^\s*((re|fwd?|aw|sv)\s*:\s*)+/i, '').trim().toLowerCase();
}

function messageIds(...values: (string | undefined)[]) {
  return values.flatMap((value) => value?.match(/<[^<>\s]+>/g) ?? []);
}

function supabaseClient(config: InboundConfig) {
  const base = `${config.supabaseUrl}/rest/v1`;
  const headers = {
    apikey: config.serviceRoleKey as string,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
  return async function request<T>(path: string, init: { method?: string; body?: unknown; prefer?: string } = {}) {
    const response = await fetch(`${base}/${path}`, {
      method: init.method ?? 'GET',
      headers: { ...headers, ...(init.prefer ? { Prefer: init.prefer } : {}) },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
    if (!response.ok) throw new Error(`Supabase ${init.method ?? 'GET'} ${path.split('?')[0]} failed: ${await response.text()}`);
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  };
}

type ReceivedEmail = {
  id: string;
  from: string;
  to?: string[];
  subject?: string | null;
  text?: string | null;
  html?: string | null;
  message_id?: string | null;
  headers?: Record<string, string>;
  attachments?: { id: string; filename?: string; content_type?: string; size?: number }[];
};

type Thread = { id: string; unread_count: number; subject: string };

export async function handleInboundEmail(rawBody: string, headers: Headers, config: InboundConfig): Promise<InboundResult> {
  if (!config.webhookSecret || !config.resendApiKey || !config.supabaseUrl || !config.serviceRoleKey) {
    console.error('Inbound email is not configured: need RESEND_WEBHOOK_SECRET, RESEND_API_KEY, VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    return { status: 503, body: { error: 'Inbound email is not configured.' } };
  }
  if (!verifyWebhook(rawBody, headers, config.webhookSecret)) {
    return { status: 401, body: { error: 'Invalid signature.' } };
  }

  const event = JSON.parse(rawBody) as { type?: string; data?: { email_id?: string } };
  if (event.type !== 'email.received' || !event.data?.email_id) return { status: 200, body: { ignored: true } };

  const emailResponse = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(event.data.email_id)}`, {
    headers: { Authorization: `Bearer ${config.resendApiKey}` },
  });
  if (!emailResponse.ok) {
    console.error('Could not fetch received email from Resend:', await emailResponse.text());
    return { status: 502, body: { error: 'Could not fetch email.' } }; // non-2xx makes Resend retry
  }
  const email = (await emailResponse.json()) as ReceivedEmail;

  const sender = parseAddress(email.from || '');
  if (!sender.email || (config.inboxEmail && sender.email === parseAddress(config.inboxEmail).email)) {
    return { status: 200, body: { ignored: true } }; // never file our own mail (avoids loops)
  }

  const db = supabaseClient(config);
  const subject = (email.subject || '(no subject)').slice(0, 500);
  const bodyText = (email.text?.trim() || (email.html ? htmlToText(email.html) : '')).slice(0, MAX_BODY_CHARS);

  // 1) Thread by In-Reply-To / References; 2) open thread from the same sender with the same subject; 3) new thread.
  let thread: Thread | null = null;
  const refs = messageIds(email.headers?.['in-reply-to'], email.headers?.['references']);
  if (refs.length) {
    const list = refs.map((ref) => `"${ref.replace(/"/g, '')}"`).join(',');
    const matches = await db<{ thread_id: string }[]>(`inbox_messages?select=thread_id&message_id=in.(${encodeURIComponent(list)})&limit=1`);
    if (matches?.[0]) {
      const found = await db<Thread[]>(`inbox_threads?select=id,unread_count,subject&id=eq.${matches[0].thread_id}`);
      thread = found?.[0] ?? null;
    }
  }
  if (!thread) {
    const candidates = await db<Thread[]>(
      `inbox_threads?select=id,unread_count,subject&customer_email=eq.${encodeURIComponent(sender.email)}&status=eq.open&order=last_message_at.desc&limit=10`,
    );
    thread = candidates?.find((t) => normalizeSubject(t.subject) === normalizeSubject(subject)) ?? null;
  }
  if (!thread) {
    const created = await db<Thread[]>('inbox_threads?select=id,unread_count,subject', {
      method: 'POST',
      prefer: 'return=representation',
      body: { customer_email: sender.email, customer_name: sender.name, subject, unread_count: 0 },
    });
    thread = created[0];
  }

  const inserted = await db<{ id: string }[]>('inbox_messages?on_conflict=resend_id&select=id', {
    method: 'POST',
    prefer: 'resolution=ignore-duplicates,return=representation',
    body: {
      thread_id: thread.id,
      direction: 'inbound',
      resend_id: email.id,
      message_id: email.message_id ?? null,
      from_email: sender.email,
      from_name: sender.name,
      to_emails: email.to ?? [],
      subject,
      body_text: bodyText,
      attachments: (email.attachments ?? []).map(({ id, filename, content_type, size }) => ({ id, filename, content_type, size })),
    },
  });
  if (!inserted?.length) return { status: 200, body: { duplicate: true } }; // Resend retried an email we already have

  await db(`inbox_threads?id=eq.${thread.id}`, {
    method: 'PATCH',
    body: { unread_count: thread.unread_count + 1, last_message_at: new Date().toISOString(), status: 'open' },
  });

  return { status: 200, body: { ok: true } };
}
