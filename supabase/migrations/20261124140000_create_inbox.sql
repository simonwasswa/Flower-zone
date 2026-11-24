-- Email inbox for the admin dashboard.
-- Inbound emails are written by the website's /api/inbound-email webhook using the service-role key (bypasses RLS).
-- The admin reads threads, marks them read/closed, and records replies through RLS as themselves.

create table if not exists public.inbox_threads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  customer_email text not null check (char_length(customer_email) <= 254),
  customer_name text check (char_length(customer_name) <= 200),
  subject text not null default '(no subject)' check (char_length(subject) <= 500),
  status text not null default 'open' check (status in ('open', 'closed')),
  unread_count integer not null default 0 check (unread_count >= 0)
);

create index if not exists inbox_threads_last_message_idx on public.inbox_threads (status, last_message_at desc);
create index if not exists inbox_threads_customer_idx on public.inbox_threads (lower(customer_email));

create table if not exists public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  thread_id uuid not null references public.inbox_threads (id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  -- Resend's id for the received or sent email; unique so webhook retries are ignored.
  resend_id text unique,
  -- RFC 5322 Message-ID, used to thread replies (In-Reply-To / References).
  message_id text,
  from_email text not null,
  from_name text,
  to_emails text[] not null default '{}',
  subject text,
  body_text text not null default '' check (char_length(body_text) <= 100000),
  attachments jsonb not null default '[]'::jsonb
);

create index if not exists inbox_messages_thread_idx on public.inbox_messages (thread_id, created_at);
create index if not exists inbox_messages_message_id_idx on public.inbox_messages (message_id);

alter table public.inbox_threads enable row level security;
alter table public.inbox_messages enable row level security;

revoke all on table public.inbox_threads from anon, authenticated;
revoke all on table public.inbox_messages from anon, authenticated;

grant select, delete on table public.inbox_threads to authenticated;
grant update (status, unread_count, last_message_at) on table public.inbox_threads to authenticated;
grant select on table public.inbox_messages to authenticated;
grant insert (thread_id, direction, resend_id, message_id, from_email, from_name, to_emails, subject, body_text)
  on table public.inbox_messages to authenticated;

drop policy if exists "Flower Zone admin can view inbox threads" on public.inbox_threads;
create policy "Flower Zone admin can view inbox threads"
  on public.inbox_threads for select to authenticated
  using ((select public.is_flower_zone_admin()));

drop policy if exists "Flower Zone admin can update inbox threads" on public.inbox_threads;
create policy "Flower Zone admin can update inbox threads"
  on public.inbox_threads for update to authenticated
  using ((select public.is_flower_zone_admin()))
  with check ((select public.is_flower_zone_admin()));

drop policy if exists "Flower Zone admin can delete inbox threads" on public.inbox_threads;
create policy "Flower Zone admin can delete inbox threads"
  on public.inbox_threads for delete to authenticated
  using ((select public.is_flower_zone_admin()));

drop policy if exists "Flower Zone admin can view inbox messages" on public.inbox_messages;
create policy "Flower Zone admin can view inbox messages"
  on public.inbox_messages for select to authenticated
  using ((select public.is_flower_zone_admin()));

-- Only outbound (reply) rows can be added by the admin; inbound rows come from the webhook.
drop policy if exists "Flower Zone admin can record replies" on public.inbox_messages;
create policy "Flower Zone admin can record replies"
  on public.inbox_messages for insert to authenticated
  with check ((select public.is_flower_zone_admin()) and direction = 'outbound');
