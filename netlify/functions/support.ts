import { customerConfigFromEnv, submitSupportRequest } from '../../server/customer-mail.js';

type NetlifyEvent = { httpMethod: string; body: string | null };
type NetlifyResponse = { statusCode: number; headers?: Record<string, string>; body: string };

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }
  try {
    const result = await submitSupportRequest(JSON.parse(event.body || '{}'), customerConfigFromEnv(process.env));
    return {
      statusCode: result.ok ? 200 : result.status,
      headers: jsonHeaders,
      body: JSON.stringify(result.ok ? { success: true } : { error: result.error }),
    };
  } catch (error) {
    console.error('Netlify support function error:', error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: 'An unexpected error occurred.' }) };
  }
}
