create table if not exists public.product_reviews (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, tenant_id uuid not null, user_id uuid not null references auth.users(id) on delete cascade, rating integer not null check (rating between 1 and 5), comment text not null check (char_length(comment) between 3 and 500), created_at timestamptz not null default now());
alter table public.product_reviews enable row level security;
create policy "Product reviews are publicly readable" on public.product_reviews for select using (true);
create policy "Users can create their own product reviews" on public.product_reviews for insert to authenticated with check (auth.uid() = user_id);
