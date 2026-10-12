begin read only;

select
  (select count(*) from public.profiles
   where registration_completed_at is not null
     and team_id is not null
     and coalesce(is_test_account, false) = false) as user_count,
  (select count(*) from public.attendances attendance
   join public.profiles profile on profile.id = attendance.user_id
   where attendance.verification_type = 'GPS'
     and profile.registration_completed_at is not null
     and profile.team_id is not null
     and coalesce(profile.is_test_account, false) = false) as attendance_count,
  (select coalesce(json_agg(procedure.proname), '[]'::json)
   from pg_catalog.pg_proc procedure
   join pg_catalog.pg_namespace schema on schema.oid = procedure.pronamespace
   where schema.nspname = 'public'
     and (procedure.proname like 'public_%count%' or procedure.proname like '%landing%')) as existing_aggregates;

commit;
