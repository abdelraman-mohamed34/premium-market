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
  -- Metadata is user-controlled, so invalid UUIDs must not abort signup.
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
    id,
    email,
    full_name,
    avatar_url,
    tenant_id,
    role,
    status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    fallback_name,
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(meta_tenant_id, '00000000-0000-0000-0000-000000000000'::uuid),
    'customer'::public.user_role,
    'active'::public.account_status
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
