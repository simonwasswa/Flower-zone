-- Customer feedback survey.
-- Visitors on the public website can submit a response; only the Flower Zone admin can read or delete them.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  overall_rating smallint not null check (overall_rating between 1 and 5),
  flower_quality smallint check (flower_quality between 1 and 5),
  service_used text check (service_used in ('birthday', 'romance', 'wedding', 'sympathy', 'surprise', 'other')),
  delivery_on_time text check (delivery_on_time in ('yes', 'late', 'not_delivered')),
  would_recommend text check (would_recommend in ('yes', 'maybe', 'no')),
  liked_most text check (char_length(liked_most) <= 2000),
  improve text check (char_length(improve) <= 2000),
  customer_name text check (char_length(customer_name) <= 120),
  customer_email text check (char_length(customer_email) <= 254),
  can_quote boolean not null default false
);

create index if not exists survey_responses_created_at_idx on public.survey_responses (created_at desc);

-- Same admin check used by the content tables (redefined here so this migration stands on its own).
create or replace function public.is_flower_zone_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'simonwasswa33@gmail.com';
$$;

revoke all on function public.is_flower_zone_admin() from public;
grant execute on function public.is_flower_zone_admin() to authenticated;

alter table public.survey_responses enable row level security;

-- Visitors may only insert the answer columns (never id or created_at), and cannot read anything back.
revoke all on table public.survey_responses from anon, authenticated;
grant insert (
  overall_rating, flower_quality, service_used, delivery_on_time, would_recommend,
  liked_most, improve, customer_name, customer_email, can_quote
) on table public.survey_responses to anon, authenticated;
grant select, delete on table public.survey_responses to authenticated;

drop policy if exists "Anyone can submit a survey response" on public.survey_responses;
create policy "Anyone can submit a survey response"
  on public.survey_responses for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Flower Zone admin can view survey responses" on public.survey_responses;
create policy "Flower Zone admin can view survey responses"
  on public.survey_responses for select
  to authenticated
  using ((select public.is_flower_zone_admin()));

drop policy if exists "Flower Zone admin can delete survey responses" on public.survey_responses;
create policy "Flower Zone admin can delete survey responses"
  on public.survey_responses for delete
  to authenticated
  using ((select public.is_flower_zone_admin()));
