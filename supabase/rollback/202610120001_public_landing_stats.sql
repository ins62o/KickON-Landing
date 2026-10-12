begin;
drop function public.public_landing_stats();
notify pgrst, 'reload schema';
commit;
