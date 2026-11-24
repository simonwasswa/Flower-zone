import { handleInboundEmail, inboundConfigFromEnv } from '../../server/inbound-email.js';

type NetlifyEvent = {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  isBase64Encoded?: boolean;
};

const jsonHeaders = { 'Content-Type': 'application/json' };

/** Resend webhook for received emails (event: email.received). */
export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }
  try {
    // The signature covers the exact raw body, so never re-serialize it.
    const rawBody = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf8') : event.body ?? '';
    const headers = Object.fromEntries(Object.entries(event.headers).map(([key, value]) => [key.toLowerCase(), value]));
    const result = await handleInboundEmail(rawBody, headers, inboundConfigFromEnv(process.env));
    return { statusCode: result.status, headers: jsonHeaders, body: JSON.stringify(result.body) };
  } catch (error) {
    console.error('Inbound email function error:', error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: 'An unexpected error occurred.' }) };
  }
}
