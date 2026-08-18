insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values
('catalog-public','catalog-public',true,8388608,array['image/jpeg','image/png','image/webp']),
('order-references-private','order-references-private',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "public reads catalog objects" on storage.objects for select to anon, authenticated using (bucket_id='catalog-public');
create policy "admins insert catalog objects" on storage.objects for insert to authenticated with check (bucket_id='catalog-public' and public.is_admin());
create policy "admins update catalog objects" on storage.objects for update to authenticated using (bucket_id='catalog-public' and public.is_admin()) with check (bucket_id='catalog-public' and public.is_admin());
create policy "admins delete catalog objects" on storage.objects for delete to authenticated using (bucket_id='catalog-public' and public.is_admin());
create policy "admins read private order objects" on storage.objects for select to authenticated using (bucket_id='order-references-private' and public.is_admin());
create policy "admins insert private order objects" on storage.objects for insert to authenticated with check (bucket_id='order-references-private' and public.is_admin());
create policy "admins update private order objects" on storage.objects for update to authenticated using (bucket_id='order-references-private' and public.is_admin()) with check (bucket_id='order-references-private' and public.is_admin());
create policy "admins delete private order objects" on storage.objects for delete to authenticated using (bucket_id='order-references-private' and public.is_admin());
