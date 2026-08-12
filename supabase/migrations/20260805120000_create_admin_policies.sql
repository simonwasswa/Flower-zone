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

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_sections',
    'occasions',
    'testimonials',
    'arrangements',
    'services',
    'gallery_items',
    'about_stories',
    'journey_steps'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);

    execute format('drop policy if exists "Flower Zone admin can view all" on public.%I', table_name);
    execute format(
      'create policy "Flower Zone admin can view all" on public.%I for select to authenticated using ((select public.is_flower_zone_admin()))',
      table_name
    );

    execute format('drop policy if exists "Flower Zone admin can create" on public.%I', table_name);
    execute format(
      'create policy "Flower Zone admin can create" on public.%I for insert to authenticated with check ((select public.is_flower_zone_admin()))',
      table_name
    );

    execute format('drop policy if exists "Flower Zone admin can update" on public.%I', table_name);
    execute format(
      'create policy "Flower Zone admin can update" on public.%I for update to authenticated using ((select public.is_flower_zone_admin())) with check ((select public.is_flower_zone_admin()))',
      table_name
    );

    execute format('drop policy if exists "Flower Zone admin can delete" on public.%I', table_name);
    execute format(
      'create policy "Flower Zone admin can delete" on public.%I for delete to authenticated using ((select public.is_flower_zone_admin()))',
      table_name
    );
  end loop;
end
$$;

drop policy if exists "Flower Zone admin can upload media" on storage.objects;
create policy "Flower Zone admin can upload media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (select public.is_flower_zone_admin())
  );

drop policy if exists "Flower Zone admin can update media" on storage.objects;
create policy "Flower Zone admin can update media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (select public.is_flower_zone_admin())
  )
  with check (
    bucket_id = 'media'
    and (select public.is_flower_zone_admin())
  );

drop policy if exists "Flower Zone admin can delete media" on storage.objects;
create policy "Flower Zone admin can delete media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (select public.is_flower_zone_admin())
  );
