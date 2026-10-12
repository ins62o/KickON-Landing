create role anon;
create role authenticated;
create role visitor;

create table public.profiles (
  id integer primary key,
  registration_completed_at timestamptz,
  team_id text,
  is_test_account boolean
);
create table public.attendances (
  id integer primary key,
  user_id integer references public.profiles(id),
  verification_type text
);
alter table public.profiles enable row level security;
alter table public.attendances enable row level security;
