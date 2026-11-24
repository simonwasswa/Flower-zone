-- Customer support: tickets from the website's /support form, plus follow-up tracking for low survey ratings.
-- Visitors can submit a ticket; only the Flower Zone admin can read, update or delete them.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  topic text not null check (topic in ('order_problem', 'delivery', 'question', 'complaint', 'other')),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  customer_email text check (char_length(customer_email) <= 254),
  customer_phone text check (char_length(customer_phone) <= 40),
  message text not null check (char_length(message) between 1 and 4000),
  -- Customers must leave at least one way to reach them.
  constraint support_tickets_contact_check check (customer_email is not null or customer_phone is not null)
);

create index if not exists support_tickets_status_created_idx on public.support_tickets (status, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists support_tickets_touch_updated_at on public.support_tickets;
create trigger support_tickets_touch_updated_at
  before update on public.support_tickets
  for each row execute function public.touch_updated_at();

alter table public.support_tickets enable row level security;

-- Visitors may only insert the form columns (never status, id or timestamps), and cannot read anything back.
revoke all on table public.support_tickets from anon, authenticated;
grant insert (topic, customer_name, customer_email, customer_phone, message)
  on table public.support_tickets to anon, authenticated;
grant select, delete on table public.support_tickets to authenticated;
grant update (status) on table public.support_tickets to authenticated;

drop policy if exists "Anyone can submit a support ticket" on public.support_tickets;
create policy "Anyone can submit a support ticket"
  on public.support_tickets for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Flower Zone admin can view support tickets" on public.support_tickets;
create policy "Flower Zone admin can view support tickets"
  on public.support_tickets for select
  to authenticated
  using ((select public.is_flower_zone_admin()));

drop policy if exists "Flower Zone admin can update support tickets" on public.support_tickets;
create policy "Flower Zone admin can update support tickets"
  on public.support_tickets for update
  to authenticated
  using ((select public.is_flower_zone_admin()))
  with check ((select public.is_flower_zone_admin()));

drop policy if exists "Flower Zone admin can delete support tickets" on public.support_tickets;
create policy "Flower Zone admin can delete support tickets"
  on public.support_tickets for delete
  to authenticated
  using ((select public.is_flower_zone_admin()));

-- Low survey ratings (1–2 stars) need follow-up until the admin marks them resolved.
alter table public.survey_responses add column if not exists follow_up_resolved_at timestamptz;

grant update (follow_up_resolved_at) on table public.survey_responses to authenticated;

drop policy if exists "Flower Zone admin can update survey responses" on public.survey_responses;
create policy "Flower Zone admin can update survey responses"
  on public.survey_responses for update
  to authenticated
  using ((select public.is_flower_zone_admin()))
  with check ((select public.is_flower_zone_admin()));
