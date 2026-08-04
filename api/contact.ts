import { sendContactEmail, type ContactPayload } from '../server/contact-mail.js';

type ApiRequest = {
  method?: string;
  body?: ContactPayload;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: Record<string, unknown>) => void;
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const result = await sendContactEmail(request.body ?? {}, {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.CONTACT_FROM_EMAIL,
    });

    if (!result.ok) {
      response.status(result.status).json({ error: result.error });
      return;
    }

    response.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    response.status(500).json({ error: 'An unexpected error occurred.' });
  }
}
