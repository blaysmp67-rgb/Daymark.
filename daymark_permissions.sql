-- Daymark database permissions + settings update
alter table public.settings
add column if not exists accent_alpha double precision not null default 1;

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.settings to authenticated;
grant select, insert, update, delete on public.reminders to authenticated;
