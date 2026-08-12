# Flower Zone Admin Dashboard

This is a standalone copy of the Flower Zone content dashboard. It connects to the same Supabase project as the public website, so saved and published records are read by the website automatically.

## Connect it to the website

1. Extract this ZIP.
2. Copy `.env.example` to `.env.local`.
3. Put the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values used by the public Flower Zone website into `.env.local`.
4. Set `VITE_PUBLIC_WEBSITE_URL` to the deployed public website URL.
5. In Supabase Authentication, create and confirm the user `simonwasswa33@gmail.com`.
6. Apply the SQL files in `supabase/migrations` if the media bucket and administrator policies have not already been installed.

The content tables must already exist in the connected Supabase project. This package includes the available access-policy and media-bucket migrations, but the original schema-creation migration is not present in the source repository.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and sign in with the Supabase administrator account.

## Deploy

Deploy this folder as a separate Netlify or Vercel project. Add all three `VITE_` values as deployment environment variables. The dashboard can live on a subdomain such as `admin.your-domain.com` while continuing to manage the same website content.

Do not put a Supabase service-role key in this project. It uses the public publishable key and relies on Supabase Row Level Security for protection.

## Managed content

- Gallery photos and videos
- Services and package inclusions
- Occasions
- Most Loved arrangements
- Testimonials
- About stories
- Shared page sections
- Journey steps
