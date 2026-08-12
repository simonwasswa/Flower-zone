# Flower Zone

Flower Zone is a React, TypeScript, Tailwind CSS, and Vite website for a Kampala-based floral studio.

## Development

```bash
pnpm install
pnpm run dev
```

The local site runs at `http://localhost:5173`.

## Email delivery

Contact-form inquiries and Exclusive Circle signups are sent to `tendofiona@yahoo.com` through the server-side `/api/contact` endpoint. The API key is never included in browser code.

1. Create a Resend account using `tendofiona@yahoo.com`.
2. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
3. Create `.env.local` from `.env.example`.
4. Set `RESEND_API_KEY` to the generated key.
5. Restart `pnpm run dev`.

For initial testing, `Flower Zone <onboarding@resend.dev>` can be used as the sender. Before sending to addresses other than the Resend account owner, verify a sending domain in Resend and set `CONTACT_FROM_EMAIL` to an address on that domain.

When deploying to Netlify, add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` under **Site configuration → Environment variables**, then redeploy. The Netlify function is in `netlify/functions/contact.ts`; `api/contact.ts` remains available for Vercel deployments.

## Supabase content

The site connects to Supabase using `VITE_SUPABASE_URL` and the public `VITE_SUPABASE_ANON_KEY`. Most photography comes from published Supabase records. Relative media paths are resolved from the public `media` Storage bucket; absolute URLs stored in the database are used as-is. The rotating Hero slides, Client Stories video, Gallery video fallbacks, and Contact event-image fallback are intentionally kept as local/static exceptions.

The database schema and initial content are defined in:

```text
supabase/migrations/20260803132000_flower_zone_content.sql
```

Only public publishable credentials belong in `VITE_` variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side.

## Admin dashboard

The protected content dashboard is available at `/admin`. It manages gallery items, services,
occasions, arrangements, testimonials, About stories, shared page sections, and journey steps.
Uploads are stored in the public Supabase `media` bucket.

To activate the dashboard:

1. In Supabase Authentication, create an email/password user for `simonwasswa33@gmail.com` and mark the email as confirmed.
2. Run `supabase/migrations/20260805120000_create_admin_policies.sql` in the Supabase SQL editor.
3. Sign in at `/admin` with that email and the password created in Supabase.

The administrator email is enforced both in the interface and by database Row Level Security.
Changing it requires updating `src/admin/AdminDashboard.tsx` and the admin-policy migration.

## Checks

```bash
pnpm run build
pnpm run lint
```
# Flower-zone
