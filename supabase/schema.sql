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
  category text not null check (category in ('coffee', 'cocoa', 'tea', 'other', 'food', 'snack')),
  name_th text not null,
  name_en text not null default '',
  description_th text not null default '',
  description_en text not null default '',
  price integer check (price >= 0),
  image text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  -- False while the item is sold out: it stays on the menu, but cannot be ordered.
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Older databases: the same changes for a menu table that already exists.
alter table public.menu_items add column if not exists available boolean not null default true;
alter table public.menu_items drop constraint if exists menu_items_category_check;
alter table public.menu_items
  add constraint menu_items_category_check check (category in ('coffee', 'cocoa', 'tea', 'other', 'food', 'snack'));

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

-- How many browsers opened the site on each day (Thailand time). Shown to admins only.
create table if not exists public.visit_days (
  day date primary key,
  visitors integer not null default 0 check (visitors >= 0)
);

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

-- ── Ordering ─────────────────────────────────────────────────

-- Settings of the shop. There is always exactly one row. Ordering stays closed until an admin opens it.
create table if not exists public.shop_settings (
  id integer primary key default 1 check (id = 1),
  ordering_open boolean not null default false,
  -- The PromptPay number (10 digits, a phone number) or ID (13 digits) that customers pay to.
  promptpay_id text not null default '' check (promptpay_id ~ '^[0-9]*$' and char_length(promptpay_id) <= 15),
  -- How many tables have a QR code. Zero means ordering at the counter only.
  table_count integer not null default 0 check (table_count between 0 and 200),
  updated_at timestamptz not null default now()
);

insert into public.shop_settings (id) values (1) on conflict (id) do nothing;

-- One row per order. Customers never read or write this table: they place an order through
-- place_order() and read their own through get_order(), which needs the order's random id.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigint generated always as identity,
  customer_name text not null check (char_length(customer_name) between 1 and 60),
  table_no integer check (table_no between 1 and 200),
  note text not null default '' check (char_length(note) <= 200),
  payment_method text not null check (payment_method in ('promptpay', 'cash')),
  status text not null default 'new' check (status in ('new', 'confirmed', 'ready', 'completed', 'cancelled')),
  total integer not null default 0 check (total >= 0),
  -- Set by an admin once the money has arrived.
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- The lines of an order. The name and price are copied from the menu when the order is placed,
-- so changing the menu later does not change an order that has already been taken.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name_th text not null,
  name_en text not null default '',
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 50),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

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

drop trigger if exists shop_settings_touch_updated_at on public.shop_settings;
create trigger shop_settings_touch_updated_at
  before update on public.shop_settings
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- Keeps an order's total equal to the sum of its lines, whoever changes the lines.
create or replace function public.recompute_order_total()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.order_id, old.order_id);
begin
  update public.orders
  set total = coalesce((select sum(unit_price * quantity) from public.order_items where order_id = target), 0)
  where id = target;
  return null;
end;
$$;

drop trigger if exists order_items_recompute_total on public.order_items;
create trigger order_items_recompute_total
  after insert or update or delete on public.order_items
  for each row execute function public.recompute_order_total();

-- Places an order. Everything is checked here, and the prices come from the menu table,
-- never from the customer. If any line is refused the whole order is refused.
create or replace function public.place_order(
  p_name text,
  p_table integer,
  p_note text,
  p_method text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  shop public.shop_settings;
  item public.menu_items;
  line jsonb;
  qty integer;
  new_id uuid;
  new_no bigint;
  new_total integer;
  seen uuid[] := '{}';
begin
  select * into shop from public.shop_settings where id = 1;
  if not found or not shop.ordering_open then
    raise exception 'ordering_closed';
  end if;

  p_name := btrim(coalesce(p_name, ''));
  if char_length(p_name) < 1 or char_length(p_name) > 60 then
    raise exception 'invalid_name';
  end if;
  p_note := left(btrim(coalesce(p_note, '')), 200);

  if p_method is null or p_method not in ('promptpay', 'cash') then
    raise exception 'invalid_method';
  end if;
  if p_method = 'promptpay' and shop.promptpay_id = '' then
    raise exception 'promptpay_unavailable';
  end if;
  if p_table is not null and (p_table < 1 or p_table > shop.table_count) then
    raise exception 'invalid_table';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 30 then
    raise exception 'invalid_items';
  end if;

  -- A simple brake on floods: a human cannot place this many orders, so staff are never buried.
  if (select count(*) from public.orders where status = 'new' and created_at > now() - interval '10 minutes') >= 60 then
    raise exception 'too_many_orders';
  end if;

  insert into public.orders (customer_name, table_no, note, payment_method)
  values (p_name, p_table, p_note, p_method)
  returning id, order_no into new_id, new_no;

  for line in select * from jsonb_array_elements(p_items) loop
    qty := (line ->> 'quantity')::integer;
    select * into item from public.menu_items where id = (line ->> 'id')::uuid;

    if not found or not item.published or not item.available or item.price is null then
      raise exception 'item_unavailable';
    end if;
    if qty is null or qty < 1 or qty > 20 then
      raise exception 'invalid_items';
    end if;
    if item.id = any (seen) then
      raise exception 'invalid_items';
    end if;
    seen := seen || item.id;

    insert into public.order_items (order_id, menu_item_id, name_th, name_en, unit_price, quantity)
    values (new_id, item.id, item.name_th, item.name_en, item.price, qty);
  end loop;

  select total into new_total from public.orders where id = new_id;
  return jsonb_build_object('id', new_id, 'order_no', new_no, 'total', new_total);
end;
$$;

-- Reads one order by its random id, with its lines. The id is the only key: whoever placed the order
-- has it, and nobody can list or guess orders.
create or replace function public.get_order(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', o.id,
    'order_no', o.order_no,
    'customer_name', o.customer_name,
    'table_no', o.table_no,
    'note', o.note,
    'payment_method', o.payment_method,
    'status', o.status,
    'total', o.total,
    'paid', o.paid_at is not null,
    'created_at', o.created_at,
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'name_th', i.name_th,
            'name_en', i.name_en,
            'unit_price', i.unit_price,
            'quantity', i.quantity
          )
          order by i.created_at, i.name_th
        )
        from public.order_items i
        where i.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  from public.orders o
  where o.id = p_id;
$$;

-- ── Sales ────────────────────────────────────────────────────
-- An order counts as a sale once an admin has marked the money as received (paid_at) and it was not
-- cancelled. It belongs to the day it was paid, by Thailand's clock. Only admins can call these.

create or replace function public.sales_by_day(p_from date, p_to date)
returns table (day date, orders integer, revenue integer, cash integer, promptpay integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select
    (o.paid_at at time zone 'Asia/Bangkok')::date,
    count(*)::integer,
    coalesce(sum(o.total), 0)::integer,
    coalesce(sum(o.total) filter (where o.payment_method = 'cash'), 0)::integer,
    coalesce(sum(o.total) filter (where o.payment_method = 'promptpay'), 0)::integer
  from public.orders o
  where o.paid_at is not null
    and o.status <> 'cancelled'
    and (o.paid_at at time zone 'Asia/Bangkok')::date between p_from and p_to
  group by 1
  order by 1;
end;
$$;

create or replace function public.top_items(p_from date, p_to date, p_limit integer default 10)
returns table (name_th text, name_en text, quantity integer, revenue integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select
    i.name_th,
    max(i.name_en),
    sum(i.quantity)::integer,
    sum(i.unit_price * i.quantity)::integer
  from public.order_items i
  join public.orders o on o.id = i.order_id
  where o.paid_at is not null
    and o.status <> 'cancelled'
    and (o.paid_at at time zone 'Asia/Bangkok')::date between p_from and p_to
  group by i.name_th
  order by 3 desc, 4 desc, 1
  limit least(greatest(coalesce(p_limit, 10), 1), 50);
end;
$$;

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

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
revoke execute on function public.place_order(text, integer, text, text, jsonb) from public;
grant execute on function public.place_order(text, integer, text, text, jsonb) to anon, authenticated;
revoke execute on function public.sales_by_day(date, date) from public, anon;
grant execute on function public.sales_by_day(date, date) to authenticated;
revoke execute on function public.top_items(date, date, integer) from public, anon;
grant execute on function public.top_items(date, date, integer) to authenticated;
revoke execute on function public.get_order(uuid) from public;
grant execute on function public.get_order(uuid) to anon, authenticated;

-- ── Row level security ───────────────────────────────────────

alter table public.species enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.site_settings enable row level security;
alter table public.menu_items enable row level security;
alter table public.site_content enable row level security;
alter table public.farm_services enable row level security;
alter table public.shop_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

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
grant select on public.shop_settings to anon, authenticated;
grant update on public.shop_settings to authenticated;
-- Orders are for admins only. Customers go through place_order() and get_order().
revoke all on public.orders, public.order_items from anon, authenticated;
grant select, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;
grant insert, update, delete on public.farm_services to authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

alter table public.visit_days enable row level security;
revoke all on public.visit_days from anon, authenticated;
grant select on public.visit_days to authenticated;
grant execute on function public.record_visit() to anon, authenticated;

drop policy if exists "Admins read visit counts" on public.visit_days;
create policy "Admins read visit counts" on public.visit_days
  for select to authenticated
  using (public.is_admin());

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

drop policy if exists "Shop settings are public" on public.shop_settings;
create policy "Shop settings are public" on public.shop_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "Admins edit shop settings" on public.shop_settings;
create policy "Admins edit shop settings" on public.shop_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders" on public.orders
  for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins edit orders" on public.orders;
create policy "Admins edit orders" on public.orders
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete orders" on public.orders;
create policy "Admins delete orders" on public.orders
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "Admins read order lines" on public.order_items;
create policy "Admins read order lines" on public.order_items
  for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins add order lines" on public.order_items;
create policy "Admins add order lines" on public.order_items
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins edit order lines" on public.order_items;
create policy "Admins edit order lines" on public.order_items
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete order lines" on public.order_items;
create policy "Admins delete order lines" on public.order_items
  for delete to authenticated
  using (public.is_admin());

-- New orders reach the admin dashboard as they arrive (Supabase Realtime). Only admins can read the
-- table, so only admins receive them.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
     ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;

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
