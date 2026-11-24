# Flower Zone

Flower Zone is a React, TypeScript, Tailwind CSS, and Vite website for a Kampala-based floral studio.

## Development

```bash
pnpm install
pnpm run dev
```

The local site runs at `http://localhost:5173`.

## Email delivery

All email is sent through Resend from server-side endpoints, so the API key is never included in browser code:

- `/api/contact`: Contact-form inquiries and Exclusive Circle signups, sent to `tendofiona@yahoo.com`.
- `/api/support`: requests from the `/support` page. They are saved to the `support_tickets` table, then emailed to `tendofiona@yahoo.com` and `simonwasswa33@gmail.com`. The customer gets a confirmation email if they gave an email address.
- `/api/feedback`: answers from the `/feedback` survey. They are saved to the `survey_responses` table, then emailed to both inboxes. 1–2 star ratings are flagged in the subject.

If Resend fails, support requests and survey answers are still saved.

1. Create a Resend account using `tendofiona@yahoo.com`.
2. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
3. Create `.env.local` from `.env.example`.
4. Set `RESEND_API_KEY` to the generated key.
5. Restart `pnpm run dev`.

For initial testing, `Flower Zone <onboarding@resend.dev>` can be used as the sender. Before sending to addresses other than the Resend account owner, verify a sending domain in Resend and set `CONTACT_FROM_EMAIL` to an address on that domain.

When deploying to Netlify, add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Site configuration → Environment variables**, then redeploy. The Netlify functions are in `netlify/functions/`; the matching `api/` handlers remain available for Vercel deployments.

## Supabase content

The site connects to Supabase using `VITE_SUPABASE_URL` and the public `VITE_SUPABASE_ANON_KEY`. Most photography comes from published Supabase records. Relative media paths are resolved from the public `media` Storage bucket; absolute URLs stored in the database are used as-is. The rotating Hero slides, Client Stories video, Gallery video fallbacks, and Contact event-image fallback are intentionally kept as local/static exceptions.

The database schema is defined in `supabase/migrations/`. Apply new migrations in the Supabase SQL editor or with `supabase db push`.

Only public publishable credentials belong in `VITE_` variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side.

## Admin dashboard

The admin dashboard is a separate project (`flower-zone-admin-dashboard`) and is not part of this website.
It reads and edits the same Supabase tables, including survey responses and support requests.
The database migrations it relies on live here in `supabase/migrations/`.

## Checks

```bash
pnpm run build
pnpm run lint
```
