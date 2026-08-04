# Flower Zone

Flower Zone is a React, TypeScript, Tailwind CSS, and Vite website for a Kampala-based floral studio.

## Development

```bash
pnpm install
pnpm run dev
```

The local site runs at `http://localhost:5173`.

## Email delivery

Contact-form inquiries and Exclusive Circle signups are sent to `simonwasswa33@gmail.com` through the server-side `/api/contact` endpoint. The API key is never included in browser code.

1. Create a Resend account using `simonwasswa33@gmail.com`.
2. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
3. Create `.env.local` from `.env.example`.
4. Set `RESEND_API_KEY` to the generated key.
5. Restart `pnpm run dev`.

For initial testing, `Flower Zone <onboarding@resend.dev>` can be used as the sender. Before sending to addresses other than the Resend account owner, verify a sending domain in Resend and set `CONTACT_FROM_EMAIL` to an address on that domain.

When deploying, add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` to the hosting provider's environment variables. The `api/contact.ts` file is ready for Vercel serverless deployment.

## Supabase content

The site connects to Supabase using `VITE_SUPABASE_URL` and the public `VITE_SUPABASE_ANON_KEY`. Most photography comes from published Supabase records. Relative media paths are resolved from the public `media` Storage bucket; absolute URLs stored in the database are used as-is. The rotating Hero slides, Client Stories video, Gallery video fallbacks, and Contact event-image fallback are intentionally kept as local/static exceptions.

The database schema and initial content are defined in:

```text
supabase/migrations/20260803132000_flower_zone_content.sql
```

Only public publishable credentials belong in `VITE_` variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side.

## Checks

```bash
pnpm run build
pnpm run lint
```
# Flower-zone
