-- Udomtong Farm database schema.
-- Run this once in the Supabase SQL editor, then run seed.sql to load the collection.
-- It is safe to run again: existing tables and data are kept.

-- ── Tables ───────────────────────────────────────────────────

create table if not exists public.species (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  type text not null check (type in ('animal', 'plant')),
  name_th text not null,
  name_en text not null,
  scientific_name text,
  status text check (status in ('LC', 'NT', 'VU', 'EN', 'CR')),
  summary_th text not null default '',
  summary_en text not null default '',
  body_th text not null default '',
  body_en text not null default '',
  image text not null default '',
  tags text[] not null default '{}',
  sources jsonb not null default '[]',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  species_id text not null references public.species (id) on delete cascade on update cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, species_id)
);

-- The café menu. Price is in whole baht and stays empty until the café has set one.
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('coffee', 'cocoa', 'tea', 'other')),
  name_th text not null,
  name_en text not null default '',
  description_th text not null default '',
  description_en text not null default '',
  price integer check (price >= 0),
  image text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact details shown on the site. There is always exactly one row.
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  phone text not null default '',
  facebook_url text not null default '',
  map_url text not null default '',
  address_th text not null default '',
  address_en text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, phone, facebook_url, map_url, address_th, address_en)
values (
  1,
  '0811733620',
  'https://www.facebook.com/profile.php?id=61584861394833',
  'https://maps.app.goo.gl/wZU3hkUTgYLfEhK38',
  'ตำบลห้วยบง อำเภอเมืองชัยภูมิ จังหวัดชัยภูมิ 36000',
  'Huai Bong, Mueang Chaiyaphum, Chaiyaphum 36000, Thailand'
)
on conflict (id) do nothing;

-- Activities (shown with a photo) and the price list. Price is in whole baht, zero means free,
-- and it stays empty until the farm has set one. 'unit' says what the price is for, e.g. 'per room'.
create table if not exists public.farm_services (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('activity', 'rate')),
  name_th text not null,
  name_en text not null default '',
  description_th text not null default '',
  description_en text not null default '',
  unit_th text not null default '',
  unit_en text not null default '',
  price integer check (price >= 0),
  image text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Texts an admin has changed (Admin → Site texts). The key says which text it is, e.g. 'visit.faqs.2.a'.
-- An empty value means the site shows its built-in text for that language.
create table if not exists public.site_content (
  key text primary key check (key ~ '^[a-z][A-Za-z0-9.]{0,79}$'),
  th text not null default '' check (char_length(th) <= 4000),
  en text not null default '' check (char_length(en) <= 4000),
  updated_at timestamptz not null default now()
);

-- ── Functions and triggers ───────────────────────────────────

-- True when the caller is an admin. Runs as the owner so policies on profiles can call it without recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists species_touch_updated_at on public.species;
create trigger species_touch_updated_at
  before update on public.species
  for each row execute function public.touch_updated_at();

drop trigger if exists menu_items_touch_updated_at on public.menu_items;
create trigger menu_items_touch_updated_at
  before update on public.menu_items
  for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

drop trigger if exists farm_services_touch_updated_at on public.farm_services;
create trigger farm_services_touch_updated_at
  before update on public.farm_services
  for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch_updated_at on public.site_content;
create trigger site_content_touch_updated_at
  before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Creates a profile for every new account, using the name from the member's Google account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets a member delete their own account. Their profile and saved list are removed with it.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ── Row level security ───────────────────────────────────────

alter table public.species enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.site_settings enable row level security;
alter table public.menu_items enable row level security;
alter table public.site_content enable row level security;
alter table public.farm_services enable row level security;

grant select on public.species to anon, authenticated;
grant insert, update, delete on public.species to authenticated;
grant select on public.profiles to authenticated;
-- Members may only edit their name. Roles are changed in the SQL editor (see the end of this file).
revoke update on public.profiles from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select on public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_items to authenticated;
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant select on public.farm_services to anon, authenticated;
grant insert, update, delete on public.farm_services to authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

drop policy if exists "Published species are public" on public.species;
create policy "Published species are public" on public.species
  for select to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "Admins add species" on public.species;
create policy "Admins add species" on public.species
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins edit species" on public.species;
create policy "Admins edit species" on public.species
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete species" on public.species;
create policy "Admins delete species" on public.species
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "Members read their profile" on public.profiles;
create policy "Members read their profile" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "Members edit their profile" on public.profiles;
create policy "Members edit their profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Members read their saved list" on public.favorites;
create policy "Members read their saved list" on public.favorites
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Members add to their saved list" on public.favorites;
create policy "Members add to their saved list" on public.favorites
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Members remove from their saved list" on public.favorites;
create policy "Members remove from their saved list" on public.favorites
  for delete to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Published menu items are public" on public.menu_items;
create policy "Published menu items are public" on public.menu_items
  for select to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "Admins add menu items" on public.menu_items;
create policy "Admins add menu items" on public.menu_items
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins edit menu items" on public.menu_items;
create policy "Admins edit menu items" on public.menu_items
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete menu items" on public.menu_items;
create policy "Admins delete menu items" on public.menu_items
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "Site settings are public" on public.site_settings;
create policy "Site settings are public" on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "Admins edit site settings" on public.site_settings;
create policy "Admins edit site settings" on public.site_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Published services are public" on public.farm_services;
create policy "Published services are public" on public.farm_services
  for select to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "Admins add services" on public.farm_services;
create policy "Admins add services" on public.farm_services
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins edit services" on public.farm_services;
create policy "Admins edit services" on public.farm_services
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete services" on public.farm_services;
create policy "Admins delete services" on public.farm_services
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "Site texts are public" on public.site_content;
create policy "Site texts are public" on public.site_content
  for select to anon, authenticated
  using (true);

drop policy if exists "Admins add site texts" on public.site_content;
create policy "Admins add site texts" on public.site_content
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins edit site texts" on public.site_content;
create policy "Admins edit site texts" on public.site_content
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete site texts" on public.site_content;
create policy "Admins delete site texts" on public.site_content
  for delete to authenticated
  using (public.is_admin());

-- ── Photo storage ────────────────────────────────────────────
-- One bucket holds every photograph. Café menu photos are kept under menu/ and activity photos under services/ inside it.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('species', 'species', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload species photos" on storage.objects;
create policy "Admins upload species photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'species' and public.is_admin());

drop policy if exists "Admins replace species photos" on storage.objects;
create policy "Admins replace species photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'species' and public.is_admin())
  with check (bucket_id = 'species' and public.is_admin());

drop policy if exists "Admins delete species photos" on storage.objects;
create policy "Admins delete species photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'species' and public.is_admin());

-- ── Admins ───────────────────────────────────────────────────
-- Sign in on the site with Google once, then make that account an admin by
-- running the line below with its email address. Repeat for each admin.
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
