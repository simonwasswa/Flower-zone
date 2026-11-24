// Saves /support and /feedback submissions to Supabase, then emails the studio (and confirms support requests to the customer).
// Runs on the server only, so the Resend key never reaches the browser.

const studioRecipients = ['simonwasswa33@gmail.com'];
const defaultFromEmail = 'Flower Zone <onboarding@resend.dev>';

export type CustomerMailConfig = {
  apiKey?: string;
  fromEmail?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  /** Address that receives into the admin inbox; customer confirmations reply here when set. */
  inboxEmail?: string;
};

export type CustomerResult = { ok: true } | { ok: false; status: number; error: string };

type Payload = Record<string, unknown>;

const SUPPORT_TOPICS: Record<string, string> = {
  order_problem: 'Problem with an order',
  delivery: 'Delivery question',
  question: 'General question',
  complaint: 'Complaint',
  other: 'Something else',
};
const SERVICES = ['birthday', 'romance', 'wedding', 'sympathy', 'surprise', 'other'];
const DELIVERY: Record<string, string> = { yes: 'On time', late: 'Late', not_delivered: 'Collected / no delivery' };
const RECOMMEND: Record<string, string> = { yes: 'Yes', maybe: 'Maybe', no: 'No' };

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function orNull(value: string) {
  return value || null;
}

function oneOf(value: unknown, allowed: string[]) {
  const text = clean(value, 40);
  return allowed.includes(text) ? text : null;
}

function rating(value: unknown) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c] as string);
}

function rowsHtml(rows: [string, string][]) {
  return rows
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function rowsText(rows: [string, string][]) {
  return rows.map(([label, value]) => `${label}: ${value}`).join('\n');
}

async function insertRow(table: string, row: Record<string, unknown>, config: CustomerMailConfig) {
  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error(`Cannot save to ${table}: Supabase URL or key is missing on the server.`);
    return false;
  }
  const response = await fetch(`${config.supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${config.supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!response.ok) {
    console.error(`Supabase insert into ${table} failed:`, await response.text());
    return false;
  }
  return true;
}

async function sendEmail(
  config: CustomerMailConfig,
  email: { to: string[]; subject: string; html: string; text: string; replyTo?: string },
) {
  if (!config.apiKey) {
    console.warn('RESEND_API_KEY is not set; skipping email:', email.subject);
    return;
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: config.fromEmail || defaultFromEmail,
        to: email.to,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });
    if (!response.ok) console.error('Resend email error:', await response.text());
  } catch (error) {
    console.error('Resend request failed:', error);
  }
}

export async function submitSupportRequest(payload: Payload, config: CustomerMailConfig): Promise<CustomerResult> {
  if (clean(payload.website, 200)) return { ok: true }; // honeypot: bots only

  const topic = oneOf(payload.topic, Object.keys(SUPPORT_TOPICS)) ?? 'other';
  const name = clean(payload.customer_name, 120);
  const email = clean(payload.customer_email, 254).toLowerCase();
  const phone = clean(payload.customer_phone, 40);
  const message = clean(payload.message, 4000);

  if (!name || !message) return { ok: false, status: 400, error: 'Please enter your name and message.' };
  if (!email && !phone) return { ok: false, status: 400, error: 'Please leave an email address or phone number so we can reply.' };
  if (email && !isEmail(email)) return { ok: false, status: 400, error: 'Please enter a valid email address.' };

  const saved = await insertRow('support_tickets', {
    topic,
    customer_name: name,
    customer_email: orNull(email),
    customer_phone: orNull(phone),
    message,
  }, config);
  if (!saved) return { ok: false, status: 502, error: 'We could not send your request. Please try again, or message us on WhatsApp.' };

  const rows: [string, string][] = [
    ['Topic', SUPPORT_TOPICS[topic]],
    ['Name', name],
    ['Email', email || 'Not given'],
    ['Phone / WhatsApp', phone || 'Not given'],
    ['Message', message],
  ];

  const emails = [
    sendEmail(config, {
      to: studioRecipients,
      replyTo: email || undefined,
      subject: `New support request: ${SUPPORT_TOPICS[topic]} from ${name}`,
      html: `<h2>New Flower Zone support request</h2>${rowsHtml(rows)}<p>Update its status in the admin dashboard under Support.</p>`,
      text: `New Flower Zone support request\n\n${rowsText(rows)}\n\nUpdate its status in the admin dashboard under Support.`,
    }),
  ];

  // Fixed wording only: never echo what the visitor typed into an email sent to an address they entered.
  if (email) {
    emails.push(sendEmail(config, {
      to: [email],
      replyTo: config.inboxEmail || studioRecipients[0],
      subject: 'We received your Flower Zone support request',
      html: '<p>Hello,</p><p>Thank you for contacting Flower Zone. We have received your support request and will get back to you within one business day.</p><p>For anything urgent, message us on WhatsApp: <a href="https://wa.me/256772262288">+256 772 262288</a>.</p><p>Warm regards,<br>The Flower Zone team</p>',
      text: 'Hello,\n\nThank you for contacting Flower Zone. We have received your support request and will get back to you within one business day.\n\nFor anything urgent, message us on WhatsApp: +256 772 262288.\n\nWarm regards,\nThe Flower Zone team',
    }));
  }

  await Promise.all(emails);
  return { ok: true };
}

export async function submitFeedback(payload: Payload, config: CustomerMailConfig): Promise<CustomerResult> {
  if (clean(payload.website, 200)) return { ok: true }; // honeypot: bots only

  const overall = rating(payload.overall_rating);
  if (!overall) return { ok: false, status: 400, error: 'Please choose an overall rating.' };

  const email = clean(payload.customer_email, 254).toLowerCase();
  if (email && !isEmail(email)) return { ok: false, status: 400, error: 'Please enter a valid email address.' };

  const row = {
    overall_rating: overall,
    flower_quality: rating(payload.flower_quality),
    service_used: oneOf(payload.service_used, SERVICES),
    delivery_on_time: oneOf(payload.delivery_on_time, Object.keys(DELIVERY)),
    would_recommend: oneOf(payload.would_recommend, Object.keys(RECOMMEND)),
    liked_most: orNull(clean(payload.liked_most, 2000)),
    improve: orNull(clean(payload.improve, 2000)),
    customer_name: orNull(clean(payload.customer_name, 120)),
    customer_email: orNull(email),
    can_quote: payload.can_quote === true,
  };

  const saved = await insertRow('survey_responses', row, config);
  if (!saved) return { ok: false, status: 502, error: 'We could not send your feedback. Please try again in a moment.' };

  const stars = '★'.repeat(overall) + '☆'.repeat(5 - overall);
  const lowRating = overall <= 2;
  const rows: [string, string][] = [
    ['Overall rating', `${stars} (${overall}/5)`],
    ['Flower quality', row.flower_quality ? `${row.flower_quality}/5` : 'Not answered'],
    ['Service', row.service_used ?? 'Not answered'],
    ['Delivery', row.delivery_on_time ? DELIVERY[row.delivery_on_time] : 'Not answered'],
    ['Would recommend', row.would_recommend ? RECOMMEND[row.would_recommend] : 'Not answered'],
    ['Loved most', row.liked_most ?? '—'],
    ['Could improve', row.improve ?? '—'],
    ['Name', row.customer_name ?? 'Anonymous'],
    ['Email', row.customer_email ?? 'Not given'],
    ['OK to quote on website', row.can_quote ? 'Yes' : 'No'],
  ];

  await sendEmail(config, {
    to: studioRecipients,
    replyTo: email || undefined,
    subject: `${lowRating ? '⚠️ Low rating — ' : ''}New feedback: ${overall}/5 from ${row.customer_name ?? 'a customer'}`,
    html: `<h2>New Flower Zone feedback</h2>${lowRating ? '<p style="color:#9a3412"><strong>This is a low rating and needs follow-up.</strong> Mark it resolved in the admin dashboard once you have contacted the customer.</p>' : ''}${rowsHtml(rows)}`,
    text: `New Flower Zone feedback\n\n${lowRating ? 'LOW RATING - needs follow-up.\n\n' : ''}${rowsText(rows)}`,
  });

  return { ok: true };
}

export function customerConfigFromEnv(env: Record<string, string | undefined>): CustomerMailConfig {
  return {
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.CONTACT_FROM_EMAIL,
    supabaseUrl: env.VITE_SUPABASE_URL,
    supabaseKey: env.VITE_SUPABASE_ANON_KEY,
    inboxEmail: env.INBOX_EMAIL,
  };
}

export const customerRoutes = {
  '/api/support': submitSupportRequest,
  '/api/feedback': submitFeedback,
} as const;
