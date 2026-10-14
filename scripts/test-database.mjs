// Tests the database rules (supabase/schema.sql) in a real Postgres engine that runs in this process
// (PGlite, no server needed). It loads the schema twice (it must be safe to run again), then places
// orders and tries every kind of forbidden change as a visitor, a member and an admin.
// Run with: npm run db:test

import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../supabase", import.meta.url));
export const db = new PGlite();

// The parts of Supabase that the schema relies on.
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}');
  create or replace function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  create publication supabase_realtime;
  grant usage on schema public, auth to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
`);

async function run(label, sql) {
  try { await db.exec(sql); console.log("ok   ", label); }
  catch (e) { console.log("FAIL ", label, "->", e.message); process.exit(1); }
}
await run("schema.sql (first run)", readFileSync(`${root}/schema.sql`, "utf8"));
await run("schema.sql (second run, must be safe)", readFileSync(`${root}/schema.sql`, "utf8"));
await run("seed.sql", readFileSync(`${root}/seed.sql`, "utf8"));
await run("update-2026-10.sql", readFileSync(`${root}/update-2026-10.sql`, "utf8"));

const q = async (sql, params) => (await db.query(sql, params)).rows;
// quiet unless something is wrong
void ("tables:", (await q("select table_name from information_schema.tables where table_schema='public' order by 1")).map((r) => r.table_name).join(", "));


const results = [];
const check = (name, ok, detail = "") => { results.push(ok); console.log(ok ? "PASS" : "FAIL", name, ok ? "" : detail); };
const as = async (role, sub = "") => { await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${sub}', false); ${role === "postgres" ? "" : `set role ${role};`}`); };
const tryQ = async (sql, params) => { try { return { rows: (await db.query(sql, params)).rows }; } catch (e) { return { error: e.message }; } };

// ── set up as the owner
await as("postgres");
const admin = (await db.query("insert into auth.users (email) values ('admin@example.com') returning id")).rows[0].id;
const member = (await db.query("insert into auth.users (email) values ('member@example.com') returning id")).rows[0].id;
await db.exec(`update public.profiles set role = 'admin' where id = '${admin}'`);
const menu = (await db.query("select id, name_th from public.menu_items order by name_th limit 4")).rows;
const [a, b, c, d] = menu.map((m) => m.id);
await db.exec(`update public.menu_items set price = 60 where id = '${a}'; update public.menu_items set price = 45 where id = '${b}';
               update public.menu_items set price = 80, available = false where id = '${c}'; update public.menu_items set price = null where id = '${d}';`);
const items = (list) => JSON.stringify(list);
const place = (name, table, note, method, list) => tryQ("select public.place_order($1,$2,$3,$4,$5::jsonb) as r", [name, table, note, method, items(list)]);

// ── customers (anon)
await as("anon");
let r = await place("Somchai", null, "", "cash", [{ id: a, quantity: 1 }]);
check("ordering is refused while it is closed", r.error === "ordering_closed", r.error);

await as("postgres");
await db.exec("update public.shop_settings set ordering_open = true, promptpay_id = '', table_count = 5 where id = 1");
await as("anon");
r = await place("Somchai", 3, "less sweet", "promptpay", [{ id: a, quantity: 1 }]);
check("PromptPay is refused while no PromptPay ID is set", r.error === "promptpay_unavailable", r.error);

await as("postgres");
await db.exec("update public.shop_settings set promptpay_id = '0812345678' where id = 1");
await as("anon");
r = await place("Somchai", 3, "less sweet", "promptpay", [{ id: a, quantity: 2, price: 1, unit_price: 1 }, { id: b, quantity: 1 }]);
const order = r.rows?.[0]?.r;
check("a valid order is accepted", order && order.total === 165, JSON.stringify(r));
check("the total comes from the menu prices, not from the customer (2x60 + 45)", order?.total === 165);

r = await tryQ("select public.get_order($1) as o", [order.id]);
const got = r.rows?.[0]?.o;
check("get_order returns the order with its lines", got?.items?.length === 2 && got.total === 165 && got.status === "new" && got.paid === false, JSON.stringify(got));
check("get_order for an unknown id returns nothing", (await tryQ("select public.get_order(gen_random_uuid()) as o")).rows?.[0]?.o === null);

const before = async () => { await as("postgres"); const n = (await db.query("select count(*)::int n from public.orders")).rows[0].n; await as("anon"); return n; };
const n0 = await before();
for (const [name, args, expect] of [
  ["a sold-out item", ["N", null, "", "cash", [{ id: c, quantity: 1 }]], "item_unavailable"],
  ["an item with no price", ["N", null, "", "cash", [{ id: d, quantity: 1 }]], "item_unavailable"],
  ["an item that does not exist", ["N", null, "", "cash", [{ id: "00000000-0000-0000-0000-000000000000", quantity: 1 }]], "item_unavailable"],
  ["a sold-out item mixed with good ones", ["N", null, "", "cash", [{ id: a, quantity: 1 }, { id: c, quantity: 1 }]], "item_unavailable"],
  ["quantity 0", ["N", null, "", "cash", [{ id: a, quantity: 0 }]], "invalid_items"],
  ["quantity 21", ["N", null, "", "cash", [{ id: a, quantity: 21 }]], "invalid_items"],
  ["negative quantity", ["N", null, "", "cash", [{ id: a, quantity: -3 }]], "invalid_items"],
  ["the same item twice", ["N", null, "", "cash", [{ id: a, quantity: 1 }, { id: a, quantity: 1 }]], "invalid_items"],
  ["no items", ["N", null, "", "cash", []], "invalid_items"],
  ["a blank name", ["   ", null, "", "cash", [{ id: a, quantity: 1 }]], "invalid_name"],
  ["a 61 character name", ["x".repeat(61), null, "", "cash", [{ id: a, quantity: 1 }]], "invalid_name"],
  ["table 0", ["N", 0, "", "cash", [{ id: a, quantity: 1 }]], "invalid_table"],
  ["table 6 of 5", ["N", 6, "", "cash", [{ id: a, quantity: 1 }]], "invalid_table"],
  ["an unknown payment method", ["N", null, "", "card", [{ id: a, quantity: 1 }]], "invalid_method"],
]) {
  const res = await place(...args);
  check(`refused: ${name}`, res.error === expect, `${res.error ?? "accepted"}`);
}
const many = Array.from({ length: 31 }, () => ({ id: a, quantity: 1 }));
check("refused: 31 lines", (await place("N", null, "", "cash", many)).error === "invalid_items");
check("nothing was left behind by the refused orders", (await before()) === n0, `${await before()} vs ${n0}`);

// ── what an anonymous visitor must not be able to do
for (const [name, sql] of [
  ["read orders", "select * from public.orders"],
  ["read order lines", "select * from public.order_items"],
  ["insert an order directly", "insert into public.orders (customer_name, payment_method, total) values ('x','cash',0)"],
  ["insert an order line directly", `insert into public.order_items (order_id, name_th, unit_price, quantity) values ('${order.id}','x',1,1)`],
  ["mark an order paid", `update public.orders set paid_at = now() where id = '${order.id}'`],
  ["delete an order", `delete from public.orders where id = '${order.id}'`],
  ["change the shop settings", "update public.shop_settings set promptpay_id = '0999999999'"],
  ["change a menu price", `update public.menu_items set price = 1 where id = '${a}'`],
]) {
  const res = await tryQ(sql);
  check(`anon cannot ${name}`, Boolean(res.error) || res.rows.length === 0, JSON.stringify(res.rows));
}
check("anon can read the shop settings", ((await tryQ("select ordering_open, table_count from public.shop_settings")).rows?.length ?? 0) === 1);

// ── a signed-in member who is not an admin
await as("authenticated", member);
for (const [name, sql] of [
  ["read orders", "select * from public.orders"],
  ["mark an order paid", `update public.orders set paid_at = now() where id = '${order.id}' returning id`],
  ["delete an order", `delete from public.orders where id = '${order.id}' returning id`],
  ["change the shop settings", "update public.shop_settings set promptpay_id = '0999999999' returning id"],
  ["change a menu price", `update public.menu_items set price = 1 where id = '${a}' returning id`],
]) {
  const res = await tryQ(sql);
  check(`a member cannot ${name}`, Boolean(res.error) || res.rows.length === 0, JSON.stringify(res.rows));
}

// ── an admin
await as("authenticated", admin);
check("an admin can read orders", (await tryQ("select * from public.orders")).rows?.length === 1);
r = await tryQ(`update public.orders set status = 'confirmed' where id = '${order.id}' returning status`);
check("an admin can confirm an order", r.rows?.[0]?.status === "confirmed", JSON.stringify(r));
r = await tryQ(`update public.orders set paid_at = now() where id = '${order.id}' returning paid_at`);
check("an admin can mark it paid", Boolean(r.rows?.[0]?.paid_at), JSON.stringify(r));
await tryQ(`update public.order_items set quantity = 1 where order_id = '${order.id}' and unit_price = 60`);
check("changing a line recalculates the total (60 + 45)", (await tryQ(`select total from public.orders where id = '${order.id}'`)).rows?.[0]?.total === 105);
await tryQ(`delete from public.order_items where order_id = '${order.id}' and unit_price = 45`);
check("removing a line recalculates the total (60)", (await tryQ(`select total from public.orders where id = '${order.id}'`)).rows?.[0]?.total === 60);
check("the customer sees the confirmed and paid order", await (async () => { await as("anon"); const g = (await tryQ("select public.get_order($1) as o", [order.id])).rows?.[0]?.o; return g?.status === "confirmed" && g.paid === true && g.total === 60; })());

// the menu changing later does not change a taken order
await as("authenticated", admin);
await tryQ(`update public.menu_items set price = 999 where id = '${a}'`);
await as("anon");
check("a later menu price change does not change a taken order", (await tryQ("select public.get_order($1) as o", [order.id])).rows?.[0]?.o?.items?.[0]?.unit_price === 60);

await as("authenticated", admin);
r = await tryQ(`delete from public.orders where id = '${order.id}' returning id`);
check("an admin can delete an order, and its lines go with it", r.rows?.length === 1 && (await tryQ("select count(*)::int n from public.order_items")).rows?.[0]?.n === 0);

// ── sales
await as("postgres");
// Three paid orders on known Thailand days, one unpaid, one cancelled-but-paid.
const day = (d) => `${d}T05:00:00Z`; // 12:00 in Bangkok
const mkOrder = async (name, method, status, paidAt, lines) => {
  const o = (await db.query("insert into public.orders (customer_name, payment_method, status, paid_at) values ($1,$2,$3,$4) returning id", [name, method, status, paidAt])).rows[0].id;
  for (const [menuId, nameTh, price, qty] of lines) {
    await db.query("insert into public.order_items (order_id, menu_item_id, name_th, unit_price, quantity) values ($1,$2,$3,$4,$5)", [o, menuId, nameTh, price, qty]);
  }
};
await mkOrder("s1", "cash", "completed", day("2026-10-12"), [[a, "ลาเต้", 60, 2], [b, "อเมริกาโน่", 45, 1]]);       // 165
await mkOrder("s2", "promptpay", "completed", day("2026-10-12"), [[a, "ลาเต้", 60, 1]]);                            //  60
await mkOrder("s3", "cash", "completed", day("2026-10-13"), [[b, "อเมริกาโน่", 45, 4]]);                            // 180
await mkOrder("s4", "cash", "new", null, [[a, "ลาเต้", 60, 5]]);                                                     // unpaid: not a sale
await mkOrder("s5", "cash", "cancelled", day("2026-10-13"), [[a, "ลาเต้", 60, 9]]);                                  // cancelled: not a sale
await mkOrder("s6", "cash", "completed", "2026-10-12T18:30:00Z", [[b, "อเมริกาโน่", 45, 1]]);                       // 01:30 on the 13th in Bangkok

await as("authenticated", admin);
let rs = await tryQ("select * from public.sales_by_day('2026-10-01','2026-10-31')");
const byDay = Object.fromEntries((rs.rows ?? []).map((r) => [r.day instanceof Date ? r.day.toISOString().slice(0, 10) : String(r.day).slice(0, 10), r]));
check("sales: the 12th has 2 orders and 225 (165 cash + 60 PromptPay)", byDay["2026-10-12"]?.orders === 2 && byDay["2026-10-12"]?.revenue === 225 && byDay["2026-10-12"]?.cash === 165 && byDay["2026-10-12"]?.promptpay === 60, JSON.stringify(rs.rows));
check("sales: an order paid at 01:30 Bangkok time counts on the 13th, with the 180 one (225)", byDay["2026-10-13"]?.orders === 2 && byDay["2026-10-13"]?.revenue === 225, JSON.stringify(byDay["2026-10-13"]));
check("sales: unpaid and cancelled orders are not counted", Object.values(byDay).reduce((s, r) => s + r.revenue, 0) === 450);
check("sales: a range with nothing in it returns no rows", (await tryQ("select * from public.sales_by_day('2026-01-01','2026-01-31')")).rows?.length === 0);
rs = await tryQ("select * from public.top_items('2026-10-01','2026-10-31', 10)");
check("top items: ordered by quantity, only paid and not cancelled", rs.rows?.[0]?.name_th === "อเมริกาโน่" && rs.rows[0].quantity === 6 && rs.rows[1]?.name_th === "ลาเต้" && rs.rows[1].quantity === 3, JSON.stringify(rs.rows));
check("top items: the limit is honoured", (await tryQ("select * from public.top_items('2026-10-01','2026-10-31', 1)")).rows?.length === 1);

await as("authenticated", member);
check("a member cannot read the sales", Boolean((await tryQ("select * from public.sales_by_day('2026-10-01','2026-10-31')")).error));
check("a member cannot read the top items", Boolean((await tryQ("select * from public.top_items('2026-10-01','2026-10-31')")).error));
await as("anon");
check("a visitor cannot read the sales", Boolean((await tryQ("select * from public.sales_by_day('2026-10-01','2026-10-31')")).error));
check("a visitor cannot read the top items", Boolean((await tryQ("select * from public.top_items('2026-10-01','2026-10-31')")).error));

const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
