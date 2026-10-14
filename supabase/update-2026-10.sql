-- One-time update for a database that already holds the collection (October 2026).
-- Run this file once in the Supabase SQL editor. It is safe to run again: every step checks first.
-- A new project does not need it: schema.sql and seed.sql already include all of this.

-- ── 1. The "new" badge ───────────────────────────────────────
-- The "new" badge. Empty means automatic: shown for 30 days after the entry was added.
-- True always shows it and false never does. Entries that existed before the badge start without it.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'species' and column_name = 'is_new'
  ) then
    alter table public.species add column is_new boolean;
    update public.species set is_new = false;
  end if;
end $$;

-- ── 2. Photographs ───────────────────────────────────────────
-- The photographs that shipped with the site have been removed. Every other field is kept,
-- and photographs uploaded through the admin dashboard are not touched.
update public.species
set image = ''
where image like '/images/animals/%' or image like '/images/plants/%';

-- ── 3. Conservation status in the descriptions ───────────────
-- Removes the sentences that state the IUCN category. The rest of each description is kept.
update public.species
set
  body_th = btrim(
    regexp_replace(
      regexp_replace(
        replace(body_th, ' หลายชนิดถูกคุกคาม เช่น Puerto Rican Amazon (Amazona vittata) ซึ่ง IUCN จัดว่า Critically Endangered', ''),
        ' ?สถานะการอนุรักษ์: (?:Least Concern|Near Threatened|Vulnerable|Critically Endangered|Endangered) \(IUCN\)', '', 'g'
      ),
      ' ?สถานะ IUCN: (?:Least Concern|Near Threatened|Vulnerable|Critically Endangered|Endangered)(?: (?:เนื่องจาก|แต่)\S+)?', '', 'g'
    )
  ),
  body_en = btrim(
    regexp_replace(
      replace(body_en, ' Several species face serious conservation threats; the Puerto Rican Amazon is Critically Endangered.', ''),
      ' ?IUCN(?: status)?: [^.]*\.', '', 'g'
    )
  )
where body_th like '%IUCN%' or body_en like '%IUCN%' or body_en like '%Critically Endangered%';

-- ── 4. Visit counts (used by the admin dashboard in a later update) ──
-- How many browsers opened the site on each day (Thailand time). Shown to admins only.
create table if not exists public.visit_days (
  day date primary key,
  visitors integer not null default 0 check (visitors >= 0)
);

-- Adds one to today's count. The site calls it once per browser per day; nothing about the visitor is stored.
create or replace function public.record_visit()
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.visit_days (day, visitors)
  values ((now() at time zone 'Asia/Bangkok')::date, 1)
  on conflict (day) do update set visitors = public.visit_days.visitors + 1;
$$;

alter table public.visit_days enable row level security;
revoke all on public.visit_days from anon, authenticated;
grant select on public.visit_days to authenticated;
grant execute on function public.record_visit() to anon, authenticated;

drop policy if exists "Admins read visit counts" on public.visit_days;
create policy "Admins read visit counts" on public.visit_days
  for select to authenticated
  using (public.is_admin());
