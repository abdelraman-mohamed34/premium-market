create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  variant_id uuid,
  title text not null,
  image text not null,
  selected_color text,
  selected_size text,
  unit_price numeric(12,2) not null check (unit_price > 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now()
);
create index if not exists order_items_tenant_order_idx on public.order_items (tenant_id, order_id);
alter table public.order_items enable row level security;
drop policy if exists order_items_owner on public.order_items;
create policy order_items_owner on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and o.tenant_id = tenant_id and o.user_id = auth.uid()));

create or replace function public.checkout_cart(
  p_tenant_id uuid, p_items jsonb, p_shipping_address jsonb,
  p_payment_method public.payment_method, p_notes text default null
) returns table(order_id uuid, order_number text)
language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid := gen_random_uuid();
  v_order_number text := 'ORD-' || upper(substr(replace(v_order_id::text, '-', ''), 1, 10));
  v_subtotal numeric(12,2);
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;
  if not exists (select 1 from public.carts where tenant_id = p_tenant_id and user_id = v_user_id) then raise exception 'Cart not found'; end if;
  select coalesce(sum((item->>'price')::numeric * (item->>'quantity')::integer), 0) into v_subtotal from jsonb_array_elements(p_items) item;
  if v_subtotal <= 0 then raise exception 'Invalid order total'; end if;

  insert into public.orders (id, tenant_id, user_id, order_number, items, shipping_address, payment_method, subtotal, shipping_fee, discount_amount, total, notes)
  values (v_order_id, p_tenant_id, v_user_id, v_order_number, p_items, p_shipping_address, p_payment_method, v_subtotal, 0, 0, v_subtotal, nullif(trim(p_notes), ''));

  insert into public.order_items (tenant_id, order_id, product_id, variant_id, title, image, selected_color, selected_size, unit_price, quantity)
  select p_tenant_id, v_order_id, item->>'productId', nullif(item->>'variantId','')::uuid, item->>'title', item->>'image', item->>'selectedColor', item->>'selectedSize', (item->>'price')::numeric, (item->>'quantity')::integer
  from jsonb_array_elements(p_items) item;

  update public.carts set items = '[]'::jsonb, summary = '{"subtotal":0,"shippingFee":0,"discountAmount":0,"total":0}'::jsonb, updated_at = now() where tenant_id = p_tenant_id and user_id = v_user_id;
  return query select v_order_id, v_order_number;
end; $$;
revoke all on function public.checkout_cart(uuid,jsonb,jsonb,public.payment_method,text) from public;
grant execute on function public.checkout_cart(uuid,jsonb,jsonb,public.payment_method,text) to authenticated;
