-- Consolidate profile persistence onto the existing public.profiles table.
drop table if exists public.user_profiles cascade;

alter table public.profiles
  add column if not exists tenant_id uuid,
  add column if not exists role text default 'customer',
  add column if not exists status text default 'active',
  add column if not exists avatar_url text,
  add column if not exists full_name text,
  add column if not exists updated_at timestamptz default now();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner and tenant" on public.profiles;
create policy "Profiles are viewable by owner and tenant"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_tenant_id uuid;
  fallback_name text;
begin
  begin
    meta_tenant_id := (new.raw_user_meta_data->>'tenant_id')::uuid;
  exception when others then
    meta_tenant_id := null;
  end;

  fallback_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'User'
  );

  insert into public.profiles (
    id, email, full_name, avatar_url, tenant_id, role, status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    fallback_name,
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    meta_tenant_id,
    'customer',
    'active'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
