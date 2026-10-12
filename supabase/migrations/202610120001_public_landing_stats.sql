begin;

create function public.public_landing_stats()
returns table (user_count bigint, attendance_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with members as (
    select profile.id
    from public.profiles profile
    where profile.registration_completed_at is not null
      and profile.team_id is not null
      and coalesce(profile.is_test_account, false) = false
  )
  select
    (select count(*) from members)::bigint,
    (select count(*)
     from public.attendances attendance
     join members on members.id = attendance.user_id
     where attendance.verification_type = 'GPS')::bigint;
$$;

revoke all on function public.public_landing_stats() from public, anon, authenticated;
grant execute on function public.public_landing_stats() to anon, authenticated;

comment on function public.public_landing_stats() is
  'Public aggregate counts for completed non-test members and their GPS stadium check-ins. No personal rows or locations are returned.';

notify pgrst, 'reload schema';
commit;
