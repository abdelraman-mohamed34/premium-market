-- Allow authenticated tenant members to create/read products even when the tenant JWT claim has not refreshed.
drop policy if exists tenant_memberships_self on public.tenant_memberships;
create policy tenant_memberships_self on public.tenant_memberships for select to authenticated
using (user_id = auth.uid());

drop policy if exists tenant_isolation on public.products;
drop policy if exists products_tenant_members_can_read on public.products;
drop policy if exists products_tenant_members_can_insert on public.products;
create policy products_tenant_members_can_read on public.products for select to authenticated
using (exists (select 1 from public.tenant_memberships m where m.user_id = auth.uid() and m.tenant_id = products.tenant_id and upper(m.status) = 'ACTIVE'));
create policy products_tenant_members_can_insert on public.products for insert to authenticated
with check (exists (select 1 from public.tenant_memberships m where m.user_id = auth.uid() and m.tenant_id = products.tenant_id and upper(m.status) = 'ACTIVE'));

-- Storage objects use a tenant-prefixed path: {tenant_id}/{uuid-filename}.
drop policy if exists "Tenant users can read product images" on storage.objects;
drop policy if exists "Tenant users can upload product images" on storage.objects;
create policy "Tenant users can read product images" on storage.objects for select to authenticated
using (bucket_id = 'product-images' and exists (select 1 from public.tenant_memberships m where m.user_id = auth.uid() and m.tenant_id::text = (storage.foldername(name))[1] and upper(m.status) = 'ACTIVE'));
create policy "Tenant users can upload product images" on storage.objects for insert to authenticated
with check (auth.role() = 'authenticated' and bucket_id = 'product-images' and exists (select 1 from public.tenant_memberships m where m.user_id = auth.uid() and m.tenant_id::text = (storage.foldername(name))[1] and upper(m.status) = 'ACTIVE'));
