-- Counters only: no enquiry text, email address or raw IP is stored.
begin;
create table if not exists public.landing_contact_limits (
  bucket text primary key,
  hits integer not null check (hits > 0),
  expires_at timestamptz not null
);
alter table public.landing_contact_limits enable row level security;
revoke all on public.landing_contact_limits from public, anon, authenticated;

create or replace function public.consume_landing_contact_limit(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_time_utc timestamptz := pg_catalog.clock_timestamp();
  ten_minutes bigint := floor(extract(epoch from current_time_utc) / 600);
  hour_bucket bigint := floor(extract(epoch from current_time_utc) / 3600);
  ip_bucket text := 'ip:' || p_ip_hash || ':' || ten_minutes::text;
  global_bucket text := 'global:' || hour_bucket::text;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid contact limit key';
  end if;
  -- Serialize this small contact-only counter across Edge instances.
  perform pg_catalog.pg_advisory_xact_lock(748291035);
  delete from public.landing_contact_limits where expires_at < current_time_utc;
  if exists (select 1 from public.landing_contact_limits where bucket = ip_bucket and hits >= 3)
    or exists (select 1 from public.landing_contact_limits where bucket = global_bucket and hits >= 60) then
    return false;
  end if;
  insert into public.landing_contact_limits as counters (bucket,hits,expires_at)
  values (ip_bucket,1,current_time_utc + interval '1 day'),(global_bucket,1,current_time_utc + interval '1 day')
  on conflict (bucket) do update set hits = counters.hits + 1;
  return true;
end;
$$;
revoke all on function public.consume_landing_contact_limit(text) from public, anon, authenticated;
grant execute on function public.consume_landing_contact_limit(text) to service_role;
commit;
