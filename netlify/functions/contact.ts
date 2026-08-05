import { sendContactEmail, type ContactPayload } from '../../server/contact-mail.js';

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Method not allowed.' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}') as ContactPayload;
    const result = await sendContactEmail(payload, {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.CONTACT_FROM_EMAIL,
    });

    return {
      statusCode: result.ok ? 200 : result.status,
      headers: jsonHeaders,
      body: JSON.stringify(result.ok ? { success: true } : { error: result.error }),
    };
  } catch (error) {
    console.error('Netlify contact function error:', error);
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'An unexpected error occurred.' }),
    };
  }
}
