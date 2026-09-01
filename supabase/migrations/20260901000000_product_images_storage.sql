insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do update set public = excluded.public;
drop policy if exists "Tenant users can read product images" on storage.objects;
create policy "Tenant users can read product images" on storage.objects for select to authenticated using (bucket_id = 'product-images' and (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id'));
drop policy if exists "Tenant users can upload product images" on storage.objects;
create policy "Tenant users can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id'));
