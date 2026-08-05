const recipientEmail = 'tendofiona@yahoo.com';

export type ContactPayload = {
  kind?: 'contact' | 'newsletter';
  name?: string;
  email?: string;
  occasion?: string;
  message?: string;
  website?: string;
};

export type MailConfig = {
  apiKey?: string;
  fromEmail?: string;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export async function sendContactEmail(payload: ContactPayload, config: MailConfig) {
  const kind = payload.kind === 'newsletter' ? 'newsletter' : 'contact';
  const name = clean(payload.name, 100);
  const email = clean(payload.email, 200).toLowerCase();
  const occasion = clean(payload.occasion, 100);
  const message = clean(payload.message, 3000);
  const website = clean(payload.website, 200);

  if (website) return { ok: true as const };

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false as const, status: 400, error: 'Please enter a valid email address.' };
  }

  if (kind === 'contact' && (!name || !message)) {
    return { ok: false as const, status: 400, error: 'Name and message are required.' };
  }

  if (!config.apiKey) {
    return { ok: false as const, status: 503, error: 'Email delivery is not configured yet.' };
  }

  const isNewsletter = kind === 'newsletter';
  const subject = isNewsletter
    ? `New Flower Zone mailing-list signup: ${email}`
    : `New Flower Zone inquiry from ${name}`;
  const text = isNewsletter
    ? `A visitor joined the Flower Zone mailing list.\n\nEmail: ${email}`
    : `Name: ${name}\nEmail: ${email}\nOccasion: ${occasion || 'Not specified'}\n\nMessage:\n${message}`;
  const html = isNewsletter
    ? `<h2>New mailing-list signup</h2><p><strong>Email:</strong> ${escapeHtml(email)}</p>`
    : `<h2>New Flower Zone inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Occasion:</strong> ${escapeHtml(occasion || 'Not specified')}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.fromEmail || 'Flower Zone <onboarding@resend.dev>',
      to: [recipientEmail],
      reply_to: email,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const providerError = await response.text();
    console.error('Resend email error:', providerError);
    return { ok: false as const, status: 502, error: 'We could not send your message. Please try again.' };
  }

  return { ok: true as const };
}
