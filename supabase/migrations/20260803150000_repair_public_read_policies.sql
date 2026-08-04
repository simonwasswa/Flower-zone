alter table public.site_sections enable row level security;
alter table public.occasions enable row level security;
alter table public.testimonials enable row level security;
alter table public.arrangements enable row level security;
alter table public.services enable row level security;
alter table public.gallery_items enable row level security;
alter table public.about_stories enable row level security;
alter table public.journey_steps enable row level security;

drop policy if exists "Published sections are public" on public.site_sections;
create policy "Published sections are public"
  on public.site_sections
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published occasions are public" on public.occasions;
create policy "Published occasions are public"
  on public.occasions
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published testimonials are public" on public.testimonials;
create policy "Published testimonials are public"
  on public.testimonials
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published arrangements are public" on public.arrangements;
create policy "Published arrangements are public"
  on public.arrangements
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published services are public" on public.services;
create policy "Published services are public"
  on public.services
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published gallery items are public" on public.gallery_items;
create policy "Published gallery items are public"
  on public.gallery_items
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published about stories are public" on public.about_stories;
create policy "Published about stories are public"
  on public.about_stories
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Published journey steps are public" on public.journey_steps;
create policy "Published journey steps are public"
  on public.journey_steps
  for select
  to anon, authenticated
  using (is_published = true);
