begin;
  create policy "Authenticated users can upload"
  on storage.objects
  for insert
  with check (
    auth.role() = 'authenticated'
    AND bucket_id = 'avatars'
  );

  create policy "Owner can update/delete"
  on storage.objects
  for all
  using (
    auth.uid() = owner
    AND bucket_id = 'avatars'
  );

  create policy "Anyone can view avatars"
  on storage.objects
  for select
  using (
    bucket_id = 'avatars'
  );

commit;