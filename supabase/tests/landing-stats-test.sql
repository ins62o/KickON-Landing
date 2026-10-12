set role anon;
do $$
begin
  if (select row(user_count, attendance_count) from public.public_landing_stats()) <> row(0::bigint, 0::bigint) then
    raise exception 'Empty database must return zero counts';
  end if;
end;
$$;
reset role;

insert into public.profiles values
  (1, now(), 'incheon', false),
  (2, now(), 'ulsan', true),
  (3, null, 'incheon', false),
  (4, now(), null, false),
  (5, now(), 'busan-ipark', null);
insert into public.attendances values
  (1, 1, 'GPS'), (2, 1, 'GPS'), (3, 1, 'MANUAL'),
  (4, 2, 'GPS'), (5, 3, 'GPS'), (6, 4, 'GPS'), (7, 5, 'GPS');

set role anon;
do $$
begin
  if (select row(user_count, attendance_count) from public.public_landing_stats()) <> row(2::bigint, 3::bigint) then
    raise exception 'Must exclude test, incomplete and teamless members and manual records';
  end if;
  begin
    perform count(*) from public.profiles;
    raise exception 'Anonymous profile access must be blocked';
  exception when insufficient_privilege then null;
  end;
  begin
    perform count(*) from public.attendances;
    raise exception 'Anonymous attendance access must be blocked';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;

do $$
begin
  if not has_function_privilege('authenticated', 'public.public_landing_stats()', 'execute') then
    raise exception 'Authenticated callers must be allowed';
  end if;
  if has_function_privilege('visitor', 'public.public_landing_stats()', 'execute') then
    raise exception 'PUBLIC execute must be revoked';
  end if;
  if (select count(*) from public.profiles) <> 5 or (select count(*) from public.attendances) <> 7 then
    raise exception 'Aggregate calls must leave business rows unchanged';
  end if;
  if not (select prosecdef and provolatile = 's' and proconfig @> array['search_path=""']
          from pg_proc where oid = 'public.public_landing_stats()'::regprocedure) then
    raise exception 'Stable definer function must use an empty search path';
  end if;
end;
$$;
select 'PASS: count scope, empty state, RLS isolation, ACL, function configuration and unchanged rows' as result;
