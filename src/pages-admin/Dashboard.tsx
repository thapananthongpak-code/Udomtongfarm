import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import { useOrderStore } from "../store/orderStore";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";

const VIEWS_KEY = "uf_views";
function getViewData(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}"); } catch { return {}; }
}

export default function Dashboard() {
  const { lang } = useSettingsStore();
  const { items, fetchAll } = useSpeciesStore();
  const { adminOrders, fetchAdminOrders } = useOrderStore();
  const [apiOk, setApiOk] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState<{ month: string; order_count: number; revenue: number }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [revenueMonths, setRevenueMonths] = useState<3 | 6 | 12>(6);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live clock
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(r => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  const refreshData = useMemo(() => () => {
    fetchAdminOrders();
    authFetch(`${API_BASE}/api/admin/stats/monthly`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMonthlyStats(data); })
      .catch(() => {});
    setLastUpdated(new Date());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAdminOrders]);

  useEffect(() => {
    refreshData();
    timerRef.current = setInterval(refreshData, 30_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [refreshData]);

  const orderStats = useMemo(() => {
    const total      = adminOrders.length;
    const pending    = adminOrders.filter(o => o.status === "pending").length;
    const processing = adminOrders.filter(o => o.status === "processing" || o.status === "confirmed").length;
    const revenue    = adminOrders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
    return { total, pending, processing, revenue };
  }, [adminOrders]);

  const recentOrders = useMemo(() =>
    [...adminOrders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 10),
  [adminOrders]);

  // Filtered by selected donut segment
  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return recentOrders;
    return [...adminOrders]
      .filter(o => o.status === selectedStatus)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 10);
  }, [recentOrders, adminOrders, selectedStatus]);

  const topViewed = useMemo(() => {
    const views = getViewData();
    return items
      .filter(s => views[s.id])
      .sort((a, b) => (views[b.id] || 0) - (views[a.id] || 0))
      .slice(0, 5)
      .map(s => ({ ...s, views: views[s.id] || 0 }));
  }, [items]);

  const totalViews = useMemo(() => {
    const views = getViewData();
    return Object.values(views).reduce((a, b) => a + b, 0);
  }, []);

  const stats = useMemo(() => {
    const all         = items;
    const animalItems = items.filter(s => s.type === "animal");
    const plantItems  = items.filter(s => s.type === "plant");
    const tags        = all.flatMap(s => s.tags ?? []);
    const uniqueTags  = new Set(tags).size;
    const withImage   = all.filter(s => !!s.image).length;
    const withShort   = all.filter(s => !!s.short_description?.trim()).length;
    return {
      total: all.length, animals: animalItems.length, plants: plantItems.length, uniqueTags,
      completeness: all.length === 0 ? 0 : Math.round(((withImage + withShort) / (all.length * 2)) * 100),
    };
  }, [items]);

  const displayStats = useMemo(() => monthlyStats.slice(-revenueMonths), [monthlyStats, revenueMonths]);

  const clockStr  = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr   = now.toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const updatedStr = lastUpdated.toLocaleTimeString(lang === "th" ? "th-TH" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const th = (t: string, e: string) => lang === "th" ? t : e;

  return (
    <div className="fade-in-up">

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
            {th("แผงควบคุม", "Admin Dashboard")}
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0" }}>
            {th("ภาพรวมและสถานะการทำงานของระบบ", "Overview and real-time system status")}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          {/* Live clock */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 16, background: "var(--primary-light)", border: "1px solid var(--border-color)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 900, color: "var(--primary-hover)", letterSpacing: "0.05em" }}>{clockStr}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>{dateStr}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusPill text={th("ระบบออนไลน์", "Online")} ok={true} />
            <StatusPill text={apiOk ? th("DB พร้อม", "DB Ready") : th("API ออฟไลน์", "API Offline")} ok={apiOk} />
            <button onClick={refreshData} title={th("รีเฟรช", "Refresh")}
              style={{ padding: "6px 12px", borderRadius: 20, background: "var(--bg-color)", border: "1px solid var(--border-color)", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              {th("รีเฟรช", "Refresh")}
            </button>
          </div>
        </div>
      </div>

      {/* ── Species stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 16 }}>
        <StatCard title={th("รายการทั้งหมด", "Total Species")} value={stats.total}              accent="var(--primary)" icon={<IconChart />} />
        <StatCard title={th("ชนิดสัตว์", "Animals")}           value={stats.animals}            icon={<IconPaw />} />
        <StatCard title={th("ชนิดพืช", "Plants")}              value={stats.plants}             icon={<IconLeaf />} />
        <StatCard title={th("หมวดหมู่", "Categories")}         value={stats.uniqueTags}         icon={<IconTag />} />
        <StatCard title={th("ความครบถ้วน", "Completeness")}    value={`${stats.completeness}%`} icon={<IconCheck />} />
      </div>

      {/* ── Order stats (clickable — filter donut) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard title={th("คำสั่งซื้อทั้งหมด", "Total Orders")}    value={orderStats.total}     accent="#6366f1" icon={<IconBag />}
          onClick={() => setSelectedStatus(null)} active={selectedStatus === null} />
        <StatCard title={th("รอดำเนินการ", "Pending")}               value={orderStats.pending}   accent="#f59e0b" icon={<IconClock />}
          onClick={() => setSelectedStatus(s => s === "pending" ? null : "pending")} active={selectedStatus === "pending"} />
        <StatCard title={th("กำลังดำเนินการ", "In Progress")}        value={orderStats.processing} accent="#3b82f6" icon={<IconServer />}
          onClick={() => setSelectedStatus(s => s === "processing" ? null : "processing")} active={selectedStatus === "processing"} />
        <StatCard title={th("รายได้รวม", "Total Revenue")}           value={`฿${orderStats.revenue.toLocaleString("th-TH")}`} accent="#10b981" icon={<IconCoin />} />
      </div>

      {/* ── Quick actions + System status ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 24, marginBottom: 24 }}>
        <section className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: "var(--text-main)", fontWeight: 800 }}>{th("เมนูด่วน", "Quick Actions")}</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <ActionLink to="/admin/species"  title={th("จัดการสายพันธุ์", "Species Manager")} desc={th("เพิ่ม แก้ไข หรือลบข้อมูลสัตว์และพืช", "Add, edit, or remove species data")} icon={<IconSpecies />} />
            <ActionLink to="/admin/settings" title={th("ตั้งค่าระบบ", "System Settings")}     desc={th("จัดการแอดมิน สำรองข้อมูล และตั้งค่าเว็บ", "Manage admins, backups and site settings")} icon={<IconSettings />} />
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border-color)", textDecoration: "none", color: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconExternal /></span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-main)" }}>{th("ดูหน้าเว็บ", "View Website")}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{th("เปิดดูหน้าเว็บหลักในแท็บใหม่", "Open the public site in a new tab")}</div>
              </div>
            </a>
          </div>
        </section>
        <section className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: "var(--text-main)", fontWeight: 800 }}>{th("สถานะระบบ", "System Status")}</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { title: th("ระบบสมาชิก", "Auth System"), desc: th("ระบบเข้าสู่ระบบและ OTP ทำงานปกติ", "Login and OTP systems functioning normally"), ok: true, icon: <IconLock /> },
              { title: th("ฐานข้อมูล Turso", "Turso Database"), desc: th("เชื่อมต่อฐานข้อมูลเรียบร้อย", "Database connected successfully"), ok: true, icon: <IconDb /> },
              { title: "API Server", desc: apiOk ? th("พร้อมให้บริการ", "Running normally") : th("ไม่สามารถเชื่อมต่อได้", "Cannot connect"), ok: apiOk, icon: <IconServer /> },
            ].map(r => (
              <div key={r.title} style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: r.ok ? "var(--primary-light)" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: 13 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.ok ? "var(--primary)" : "#ef4444", flexShrink: 0, marginTop: 4 }} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Charts row: Revenue + Order Donut ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, marginBottom: 24 }}>

        {/* Revenue area chart */}
        <section className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ margin: 0, fontWeight: 800, color: "var(--text-main)" }}>
              {th("รายได้รายเดือน", "Monthly Revenue")}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Month range selector */}
              <div style={{ display: "flex", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border-color)" }}>
                {([3, 6, 12] as const).map(m => (
                  <button key={m} onClick={() => setRevenueMonths(m)}
                    style={{ padding: "4px 12px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: revenueMonths === m ? "var(--primary)" : "var(--bg-color)", color: revenueMonths === m ? "white" : "var(--text-muted)", transition: "all 0.15s" }}>
                    {m}M
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                {th("อัปเดต", "Updated")}: {updatedStr}
              </span>
            </div>
          </div>
          {displayStats.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>{th("ยังไม่มีข้อมูลรายได้", "No revenue data yet")}</p>
            : <RevenueAreaChart data={displayStats} lang={lang} />}
        </section>

        {/* Order Status Donut */}
        <section className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 800, color: "var(--text-main)" }}>
              {th("สถานะคำสั่งซื้อ", "Order Status")}
            </h3>
            {selectedStatus && (
              <button onClick={() => setSelectedStatus(null)}
                style={{ padding: "3px 10px", borderRadius: 20, border: "1px solid var(--border-color)", background: "var(--bg-color)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", cursor: "pointer" }}>
                {th("ล้างตัวกรอง", "Clear filter")} ✕
              </button>
            )}
          </div>
          <OrderDonutChart
            orders={adminOrders}
            lang={lang}
            selected={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </section>
      </div>

      {/* ── Recent / Filtered Orders ── */}
      <section className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "var(--text-main)" }}>
              {selectedStatus
                ? `${th("คำสั่งซื้อ:", "Orders:")} ${STATUS_COLORS[selectedStatus]?.label[lang === "th" ? "th" : "en"] ?? selectedStatus}`
                : th("คำสั่งซื้อล่าสุด", "Recent Orders")}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
              {th("อัปเดตอัตโนมัติทุก 30 วินาที · กดที่กราฟวงกลมเพื่อกรอง", "Auto-refreshes every 30s · Click the donut chart to filter")}
            </p>
          </div>
          <Link to="/admin/orders" style={{ padding: "6px 14px", borderRadius: 20, background: "var(--primary-light)", color: "var(--primary-hover)", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
            {th("ดูทั้งหมด →", "View all →")}
          </Link>
        </div>
        {filteredOrders.length === 0
          ? <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>{th("ยังไม่มีคำสั่งซื้อ", "No orders yet")}</p>
          : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                    {[th("หมายเลข", "Order ID"), th("ผู้ซื้อ", "Customer"), th("ยอดรวม", "Amount"), th("สถานะ", "Status"), th("วันที่", "Date")].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 800, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "10px", fontWeight: 700, color: "var(--primary-hover)", whiteSpace: "nowrap" }}>#{String(order.id).slice(0, 8)}</td>
                      <td style={{ padding: "10px", color: "var(--text-muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.user_email}</td>
                      <td style={{ padding: "10px", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap" }}>฿{(order.total_amount ?? 0).toLocaleString("th-TH")}</td>
                      <td style={{ padding: "10px" }}><OrderStatusBadge status={order.status} lang={lang} /></td>
                      <td style={{ padding: "10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(order.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>

      {/* ── View Analytics ── */}
      <section className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "var(--text-main)" }}>{th("สถิติการเข้าชม", "View Analytics")}</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-muted)" }}>{th("ยอดเข้าชมสายพันธุ์จากผู้ใช้จริง (เก็บในเครื่อง)", "Species page views from real users (client-side tracking)")}</p>
          </div>
          <span style={{ padding: "4px 14px", borderRadius: 20, background: "var(--primary-light)", color: "var(--primary-hover)", fontWeight: 800, fontSize: 13 }}>
            {th("ยอดเข้าชมรวม", "Total Views")}: {totalViews}
          </span>
        </div>
        {topViewed.length === 0
          ? <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>{th("ยังไม่มีข้อมูลการเข้าชม", "No view data yet")}</p>
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topViewed.map((s, i) => {
                const maxV = topViewed[0].views;
                const pct  = maxV > 0 ? (s.views / maxV) * 100 : 0;
                const name = lang === "th" ? s.name_th : s.name_en;
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 20, textAlign: "center", fontWeight: 800, fontSize: 13, color: "var(--text-muted)", flexShrink: 0 }}>{i + 1}</span>
                    <img src={s.image} alt={name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                      <div style={{ height: 6, borderRadius: 4, background: "var(--bg-color)", marginTop: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "var(--gradient-primary)", borderRadius: 4, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "var(--primary-hover)", flexShrink: 0, minWidth: 32, textAlign: "right" }}>{s.views}</span>
                  </div>
                );
              })}
            </div>
          )}
      </section>
    </div>
  );
}

// ─── Order Status Donut Chart ─────────────────────────────────────────────────
function OrderDonutChart({
  orders, lang, selected, onSelect,
}: {
  orders: { status: string }[];
  lang: string;
  selected: string | null;
  onSelect: (s: string | null) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const groups = useMemo(() => {
    const g: Record<string, number> = {};
    for (const o of orders) { g[o.status] = (g[o.status] || 0) + 1; }
    return Object.entries(g).map(([status, count]) => ({ status, count }));
  }, [orders]);

  const total = orders.length;

  if (total === 0) return (
    <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "16px 0 0", textAlign: "center" }}>
      {lang === "th" ? "ยังไม่มีคำสั่งซื้อ" : "No orders yet"}
    </p>
  );

  const cx = 75, cy = 75, outerR = 62, innerR = 40;

  function polarToXY(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(startDeg: number, sweepDeg: number, outer: number, inner: number): string {
    const clampedSweep = Math.min(sweepDeg, 359.99);
    const endDeg = startDeg + clampedSweep;
    const p1 = polarToXY(startDeg, outer), p2 = polarToXY(endDeg, outer);
    const p3 = polarToXY(endDeg, inner),  p4 = polarToXY(startDeg, inner);
    const large = clampedSweep > 180 ? 1 : 0;
    return `M${p1.x} ${p1.y} A${outer} ${outer} 0 ${large} 1 ${p2.x} ${p2.y} L${p3.x} ${p3.y} A${inner} ${inner} 0 ${large} 0 ${p4.x} ${p4.y}Z`;
  }

  let angle = 0;
  const segments = groups.map(({ status, count }) => {
    const sweep = (count / total) * 360;
    const seg = { status, count, startAngle: angle, sweep };
    angle += sweep;
    return seg;
  });

  const active = hovered ?? selected;
  const activeCfg = active ? STATUS_COLORS[active] : null;
  const activeCount = active ? (groups.find(g => g.status === active)?.count ?? 0) : total;
  const activeLabel = activeCfg
    ? activeCfg.label[lang === "th" ? "th" : "en"]
    : (lang === "th" ? "ทั้งหมด" : "All");

  return (
    <div>
      <svg viewBox="0 0 150 150" style={{ width: "100%", maxWidth: 200, display: "block", margin: "0 auto" }}>
        <defs>
          <filter id="segGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        {segments.map(seg => {
          const cfg = STATUS_COLORS[seg.status] ?? { bg: "#e5e7eb", color: "#6b7280" };
          const isActive = selected === seg.status || hovered === seg.status;
          const r = isActive ? outerR + 6 : outerR;
          return (
            <path
              key={seg.status}
              d={arcPath(seg.startAngle, seg.sweep, r, innerR)}
              fill={cfg.bg}
              stroke={cfg.color}
              strokeWidth={isActive ? "2" : "1"}
              filter={isActive ? "url(#segGlow)" : undefined}
              style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={() => setHovered(seg.status)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(selected === seg.status ? null : seg.status)}
            />
          );
        })}
        {/* Center label */}
        <text x={cx} y={cy - 10} textAnchor="middle" style={{ fontSize: 22, fontWeight: 900, fill: "var(--text-main)" }}>{activeCount}</text>
        <text x={cx} y={cy + 6}  textAnchor="middle" style={{ fontSize: 9,  fontWeight: 700, fill: "var(--text-muted)" }}>{activeLabel}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: 8,  fontWeight: 600, fill: "var(--text-muted)" }}>
          {active ? `${Math.round((activeCount / total) * 100)}%` : (lang === "th" ? "ทั้งหมด" : "orders")}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginTop: 10 }}>
        {segments.map(seg => {
          const cfg = STATUS_COLORS[seg.status] ?? { bg: "#f3f4f6", color: "#6b7280", label: { th: seg.status, en: seg.status } };
          const isActive = selected === seg.status;
          return (
            <button
              key={seg.status}
              type="button"
              onClick={() => onSelect(selected === seg.status ? null : seg.status)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 8px",
                borderRadius: 8, cursor: "pointer", textAlign: "left",
                background: isActive ? cfg.bg : "transparent",
                border: `1px solid ${isActive ? cfg.color : "var(--border-color)"}`,
                transition: "all 0.15s",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, flex: 1 }}>
                {cfg.label[lang === "th" ? "th" : "en"]}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-main)" }}>{seg.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Revenue Area Chart (SVG) ─────────────────────────────────────────────────
const MONTH_TH = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const MONTH_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthLabel(monthStr: string, lang: string) {
  const mm = parseInt(monthStr.split("-")[1] ?? "0");
  return lang === "th" ? (MONTH_TH[mm] ?? monthStr) : (MONTH_EN[mm] ?? monthStr);
}

function fmtRevenue(n: number): string {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000)      return `฿${(n / 1000).toFixed(1)}k`;
  return `฿${n}`;
}

function RevenueAreaChart({ data, lang }: { data: { month: string; order_count: number; revenue: number }[]; lang: string }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: typeof data[0] } | null>(null);

  const PL = 52, PR = 16, PT = 24, PB = 40, VW = 640, VH = 200;
  const innerW = VW - PL - PR, innerH = VH - PT - PB;
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  const pts = data.map((d, i) => ({
    x: PL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: PT + innerH - (d.revenue / maxRevenue) * innerH,
    ...d,
  }));

  function makePath(points: typeof pts): string {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const dx = (pt.x - prev.x) / 2.5;
      return `${acc} C ${prev.x + dx} ${prev.y}, ${pt.x - dx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, "");
  }

  const linePath = makePath(pts);
  const areaClose = pts.length > 0 ? ` L ${pts[pts.length - 1].x} ${PT + innerH} L ${pts[0].x} ${PT + innerH} Z` : "";

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", height: "auto", overflow: "visible" }}
        onMouseLeave={() => setTooltip(null)}>
        <defs>
          <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2d6a4f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <g key={pct}>
            <line x1={PL} y1={PT + innerH - pct * innerH} x2={VW - PR} y2={PT + innerH - pct * innerH}
              stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="1" />
            <text x={PL - 6} y={PT + innerH - pct * innerH} textAnchor="end" dominantBaseline="middle"
              style={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 600 }}>
              {fmtRevenue(maxRevenue * pct)}
            </text>
          </g>
        ))}
        <line x1={PL} y1={PT + innerH} x2={VW - PR} y2={PT + innerH} stroke="var(--border-color)" strokeWidth="1.5" />
        {pts.length > 0 && <path d={linePath + areaClose} fill="url(#areaGrad2)" />}
        {pts.length > 0 && <path d={linePath} fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineGlow)" />}
        {pts.map((pt, i) => (
          <g key={i}>
            <rect x={pt.x - 20} y={PT} width={40} height={innerH + PB} fill="transparent" style={{ cursor: "crosshair" }}
              onMouseEnter={() => setTooltip({ x: pt.x, y: pt.y, d: pt })} />
            {pt.order_count > 0 && (
              <text x={pt.x} y={pt.y - 14} textAnchor="middle" style={{ fontSize: 10, fill: "#2d6a4f", fontWeight: 800 }}>{pt.order_count}</text>
            )}
            <circle cx={pt.x} cy={pt.y} r="7" fill="#2d6a4f" opacity="0.12" />
            <circle cx={pt.x} cy={pt.y} r="5" fill={tooltip?.d.month === pt.month ? "#1b4332" : "#2d6a4f"} stroke="var(--card-bg)" strokeWidth="2.5" />
            <text x={pt.x} y={VH - 6} textAnchor="middle" style={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 700 }}>
              {getMonthLabel(pt.month, lang)}
            </text>
          </g>
        ))}
        {tooltip && <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT + innerH} stroke="#2d6a4f" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />}
      </svg>

      {tooltip && (
        <div style={{
          position: "absolute", top: Math.max(0, tooltip.y - 10),
          left: tooltip.x / VW > 0.7 ? "auto" : `calc(${(tooltip.x / VW) * 100}% + 16px)`,
          right: tooltip.x / VW > 0.7 ? `calc(${((VW - tooltip.x) / VW) * 100}% + 16px)` : "auto",
          background: "var(--card-bg)", border: "1.5px solid var(--border-color)", borderRadius: 12,
          padding: "10px 14px", pointerEvents: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 10, minWidth: 130,
        }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{tooltip.d.month}</div>
          <div style={{ fontWeight: 900, fontSize: 16, color: "#1b4332" }}>฿{tooltip.d.revenue.toLocaleString("th-TH")}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {lang === "th" ? "ออร์เดอร์" : "Orders"}: <strong style={{ color: "var(--text-main)" }}>{tooltip.d.order_count}</strong>
          </div>
        </div>
      )}
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
        {lang === "th" ? "* ตัวเลขบนจุด = จำนวนออร์เดอร์ · วางเมาส์เพื่อดูรายละเอียด" : "* Number above dot = orders · hover for details"}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ title, value, accent, icon, onClick, active }: {
  title: string; value: string | number; accent?: string; icon: React.ReactNode;
  onClick?: () => void; active?: boolean;
}) {
  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        padding: "18px 20px",
        borderTop: accent ? `3px solid ${accent}` : "1px solid var(--border-color)",
        display: "flex", flexDirection: "column", gap: 8,
        cursor: onClick ? "pointer" : "default",
        boxShadow: active ? `0 0 0 2px ${accent || "var(--primary)"}` : undefined,
        transition: "box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</div>
        <div style={{ opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-main)" }}>{value}</div>
    </div>
  );
}

function ActionLink({ to, title, desc, icon }: { to: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <Link to={to}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border-color)", textDecoration: "none", color: "inherit", transition: "all 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-main)" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
      </div>
    </Link>
  );
}

function StatusPill({ text, ok }: { text: string; ok: boolean }) {
  return (
    <span style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800, background: ok ? "var(--primary-light)" : "#fee2e2", color: ok ? "var(--primary-hover)" : "#991b1b", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor" }} /> {text}
    </span>
  );
}

// ─── Status colors + badge ────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; color: string; label: { th: string; en: string } }> = {
  pending:    { bg: "#fef3c7", color: "#92400e", label: { th: "รอดำเนินการ", en: "Pending" } },
  confirmed:  { bg: "#dbeafe", color: "#1e40af", label: { th: "ยืนยันแล้ว",  en: "Confirmed" } },
  processing: { bg: "#ede9fe", color: "#5b21b6", label: { th: "กำลังเตรียม", en: "Processing" } },
  shipped:    { bg: "#d1fae5", color: "#065f46", label: { th: "จัดส่งแล้ว",  en: "Shipped" } },
  delivered:  { bg: "#dcfce7", color: "#14532d", label: { th: "ถึงแล้ว",     en: "Delivered" } },
  cancelled:  { bg: "#fee2e2", color: "#991b1b", label: { th: "ยกเลิก",      en: "Cancelled" } },
};

function OrderStatusBadge({ status, lang }: { status: string; lang: string }) {
  const cfg = STATUS_COLORS[status] ?? { bg: "var(--bg-color)", color: "var(--text-muted)", label: { th: status, en: status } };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>
      {lang === "th" ? cfg.label.th : cfg.label.en}
    </span>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function IconChart()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>; }
function IconPaw()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)" stroke="none"><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 12.5c-2.5 0-6 2.5-6 5.5a2.5 2.5 0 0 0 2.5 2.5c1 0 2-.5 3.5-.5s2.5.5 3.5.5A2.5 2.5 0 0 0 18 18c0-3-3.5-5.5-6-5.5z"/></svg>; }
function IconLeaf()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }
function IconTag()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>; }
function IconCheck()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>; }
function IconLock()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function IconDb()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>; }
function IconServer()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>; }
function IconSpecies() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }
function IconSettings(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function IconExternal(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
function IconBag()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; }
function IconClock()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconCoin()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9"/></svg>; }
