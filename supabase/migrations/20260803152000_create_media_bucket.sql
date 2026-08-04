insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read access to media" on storage.objects;
create policy "Public read access to media"
  on storage.objects for select
  to public
  using (bucket_id = 'media');

drop policy if exists "Flower Zone admin can upload media" on storage.objects;
create policy "Flower Zone admin can upload media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (auth.jwt() ->> 'email') = 'simonwasswa33@gmail.com'
  );

drop policy if exists "Flower Zone admin can update media" on storage.objects;
create policy "Flower Zone admin can update media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (auth.jwt() ->> 'email') = 'simonwasswa33@gmail.com'
  )
  with check (
    bucket_id = 'media'
    and (auth.jwt() ->> 'email') = 'simonwasswa33@gmail.com'
  );

drop policy if exists "Flower Zone admin can delete media" on storage.objects;
create policy "Flower Zone admin can delete media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (auth.jwt() ->> 'email') = 'simonwasswa33@gmail.com'
  );
