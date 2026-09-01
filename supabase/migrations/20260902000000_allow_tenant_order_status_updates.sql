-- Permit active tenant members to update order status while preserving tenant isolation.
drop policy if exists orders_tenant_update on public.orders;
create policy orders_tenant_update
  on public.orders
  for update
  using (
    exists (
      select 1
      from public.tenant_memberships membership
      where membership.user_id = auth.uid()
        and membership.tenant_id = orders.tenant_id
        and upper(membership.status) = 'ACTIVE'
    )
  )
  with check (
    exists (
      select 1
      from public.tenant_memberships membership
      where membership.user_id = auth.uid()
        and membership.tenant_id = orders.tenant_id
        and upper(membership.status) = 'ACTIVE'
    )
  );
