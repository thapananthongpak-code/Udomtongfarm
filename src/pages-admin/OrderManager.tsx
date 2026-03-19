import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import { useSettingsStore } from "../store/settingsStore";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";
import type { Order, OrderStatus, ShippingCompany } from "../types/shop";
import { SHIPPING_COMPANIES } from "../types/shop";

const STATUS_CONFIG: Record<OrderStatus, { icon: string; labelTh: string; labelEn: string; color: string; bg: string }> = {
  pending:    { icon: "⏳", labelTh: "รอชำระเงิน",          labelEn: "Pending",     color: "#92400e", bg: "#fef3c7" },
  confirmed:  { icon: "✅", labelTh: "ชำระเงินแล้ว",         labelEn: "Paid",        color: "#1e40af", bg: "#dbeafe" },
  processing: { icon: "⚙️", labelTh: "กำลังเตรียมสินค้า",   labelEn: "Processing",  color: "#5b21b6", bg: "#ede9fe" },
  shipped:    { icon: "🚚", labelTh: "กำลังจัดส่ง",          labelEn: "Shipped",     color: "#0369a1", bg: "#e0f2fe" },
  delivered:  { icon: "✓",  labelTh: "จัดส่งสำเร็จแล้ว",    labelEn: "Delivered",   color: "#15803d", bg: "#dcfce7" },
  cancelled:  { icon: "✕",  labelTh: "ยกเลิกแล้ว",           labelEn: "Cancelled",   color: "#991b1b", bg: "#fee2e2" },
};

const STATUS_LIST = Object.keys(STATUS_CONFIG) as OrderStatus[];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function OrderManager() {
  const { adminOrders, fetchAdminOrders, loading } = useOrderStore();
  const { lang } = useSettingsStore();
  const isMobile = useIsMobile();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  // Shipping fields for selected order
  const [trackingNum, setTrackingNum]     = useState("");
  const [shipCo, setShipCo]               = useState<ShippingCompany | "">("");
  const [estDelivery, setEstDelivery]     = useState("");
  const [savingShip, setSavingShip]       = useState(false);
  const [shipSaved, setShipSaved]         = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  function fmtDate(d: string) {
    return new Date(d).toLocaleString(lang === "th" ? "th-TH" : "en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  // Refresh every 30s
  useEffect(() => {
    const id = setInterval(() => fetchAdminOrders(), 30000);
    return () => clearInterval(id);
  }, []);

  function populateShippingFields(order: Order) {
    setTrackingNum(order.tracking_number ?? "");
    setShipCo((order.shipping_company as ShippingCompany) ?? "");
    setEstDelivery(order.estimated_delivery ?? "");
    setShipSaved(false);
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    try {
      await authFetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await fetchAdminOrders();
      if (selected?.id === orderId) {
        setSelected(prev => prev ? { ...prev, status } : null);
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function saveShippingInfo() {
    if (!selected) return;
    setSavingShip(true);
    try {
      await authFetch(`${API_BASE}/api/admin/orders/${selected.id}/shipping`, {
        method: "PUT",
        body: JSON.stringify({
          shipping_company: shipCo || null,
          tracking_number:  trackingNum.trim() || null,
          estimated_delivery: estDelivery.trim() || null,
        }),
      });
      await fetchAdminOrders();
      setSelected(prev => prev ? { ...prev, shipping_company: (shipCo as ShippingCompany) || undefined, tracking_number: trackingNum || undefined, estimated_delivery: estDelivery || undefined } : null);
      setShipSaved(true);
      setTimeout(() => setShipSaved(false), 3000);
    } finally {
      setSavingShip(false);
    }
  }

  async function openDetail(order: Order) {
    try {
      const res = await authFetch(`${API_BASE}/api/admin/orders/${order.id}`);
      const data = await res.json();
      setSelected(data);
      populateShippingFields(data);
    } catch {
      setSelected(order);
      populateShippingFields(order);
    }
    if (isMobile) setShowDetail(true);
  }

  const filtered = adminOrders.filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.user_email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats: Record<string, number> = { all: adminOrders.length };
  for (const s of STATUS_LIST) stats[s] = adminOrders.filter(o => o.status === s).length;
  const totalRevenue = adminOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total_amount, 0);

  async function handleExportCSV() {
    try {
      const res = await authFetch(`${API_BASE}/api/admin/orders/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert(lang === "th" ? "Export ล้มเหลว" : "Export failed"); }
  }

  const DetailPanel = selected ? (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 16, padding: isMobile ? 16 : 20, height: "fit-content", position: isMobile ? "static" : "sticky", top: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: "var(--text-main)", fontWeight: 800, fontSize: "1rem" }}>
          {lang === "th" ? "รายละเอียดคำสั่งซื้อ" : "Order Detail"}
        </h3>
        <button onClick={() => { setSelected(null); setShowDetail(false); }} style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: 7, width: 30, height: 30, cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem" }}>✕</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 2 }}>{lang === "th" ? "หมายเลขคำสั่งซื้อ" : "ORDER ID"}</div>
        <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.88rem" }}>{selected.id}</div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 2 }}>{lang === "th" ? "ผู้ซื้อ" : "CUSTOMER"}</div>
        <div style={{ color: "var(--text-main)", fontSize: "0.88rem" }}>{selected.user_email}</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{fmtDate(selected.created_at)}</div>
      </div>

      {/* Status update */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 8 }}>
          {lang === "th" ? "อัปเดตสถานะ" : "UPDATE STATUS"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {STATUS_LIST.map(s => {
            const cfg = STATUS_CONFIG[s];
            const isCurrent = selected.status === s;
            return (
              <button
                key={s}
                onClick={() => !isCurrent && updateStatus(selected.id, s)}
                disabled={isCurrent || updatingId === selected.id}
                style={{
                  padding: "7px 12px", borderRadius: 8,
                  border: `1px solid ${isCurrent ? cfg.color : "var(--border-color)"}`,
                  background: isCurrent ? cfg.bg : "transparent",
                  color: isCurrent ? cfg.color : "var(--text-muted)",
                  fontWeight: isCurrent ? 800 : 600, cursor: isCurrent ? "default" : "pointer",
                  fontSize: "0.82rem", textAlign: "left",
                  opacity: updatingId === selected.id && !isCurrent ? 0.5 : 1,
                }}
              >
                {cfg.icon} {lang === "th" ? cfg.labelTh : cfg.labelEn}
                {isCurrent && " ✓"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shipping info */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 14, marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 10 }}>
          🚚 {lang === "th" ? "ข้อมูลการจัดส่ง" : "SHIPPING INFO"}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>
            {lang === "th" ? "บริษัทขนส่ง" : "Carrier"}
          </label>
          <select
            value={shipCo}
            onChange={e => setShipCo(e.target.value as ShippingCompany)}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.85rem" }}
          >
            <option value="">{lang === "th" ? "-- เลือก --" : "-- Select --"}</option>
            {SHIPPING_COMPANIES.map(co => (
              <option key={co.id} value={co.id}>{co.icon} {lang === "th" ? co.nameTh : co.nameEn}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>
            {lang === "th" ? "เลขพัสดุ" : "Tracking Number"}
          </label>
          <input
            value={trackingNum}
            onChange={e => setTrackingNum(e.target.value)}
            placeholder="TH123456789TH"
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.85rem", fontFamily: "monospace", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>
            {lang === "th" ? "วันที่คาดว่าจะถึง" : "Est. Delivery Date"}
          </label>
          <input
            value={estDelivery}
            onChange={e => setEstDelivery(e.target.value)}
            placeholder={lang === "th" ? "เช่น 20–22 มี.ค. 2025" : "e.g. Mar 20–22, 2025"}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.85rem", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={saveShippingInfo}
          disabled={savingShip}
          style={{ width: "100%", padding: "9px", borderRadius: 9, background: shipSaved ? "#16a34a" : "var(--primary)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}
        >
          {savingShip ? "..." : shipSaved ? (lang === "th" ? "✓ บันทึกแล้ว" : "✓ Saved") : (lang === "th" ? "บันทึกข้อมูลจัดส่ง" : "Save Shipping Info")}
        </button>
      </div>

      {/* Shipping address */}
      {selected.shipping_address?.address_line && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 4 }}>
            {lang === "th" ? "ที่อยู่จัดส่ง" : "SHIPPING ADDRESS"}
          </div>
          <div style={{ color: "var(--text-main)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            <strong>{selected.shipping_address.name}</strong> {selected.shipping_address.phone && `· ${selected.shipping_address.phone}`}<br />
            {[selected.shipping_address.address_line, selected.shipping_address.district, selected.shipping_address.province, selected.shipping_address.postal_code].filter(Boolean).join(", ")}
          </div>
        </div>
      )}

      {/* Items */}
      {selected.items && selected.items.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 8 }}>{lang === "th" ? "รายการสินค้า" : "ITEMS"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.items.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 9, alignItems: "center" }}>
                <img src={item.species_image} style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.82rem" }}>{item.species_name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>×{item.quantity} · {fmt(item.unit_price)}</div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--primary-hover)", fontSize: "0.85rem" }}>{fmt(item.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" }}>{lang === "th" ? "ยอดชำระ" : "Total"}</span>
        <span style={{ fontWeight: 900, fontSize: "1.15rem", color: "var(--primary-hover)" }}>{fmt(selected.total_amount)}</span>
      </div>
      {selected.note && (
        <div style={{ marginTop: 10, background: "var(--bg-color)", borderRadius: 8, padding: "9px 12px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          📝 {selected.note}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div>
      {/* Mobile: show detail as overlay */}
      {isMobile && showDetail && selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 }} onClick={() => setShowDetail(false)}>
          <div
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(420px,95vw)", overflowY: "auto", background: "var(--bg-color)", padding: 16 }}
            onClick={e => e.stopPropagation()}
          >
            {DetailPanel}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: (!isMobile && selected) ? "1fr 380px" : "1fr", gap: 20, minHeight: "calc(100vh - 80px)" }}>
        {/* Left: orders list */}
        <div>
          <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ margin: "0 0 4px 0", fontWeight: 900, color: "var(--text-main)", fontSize: isMobile ? "1.3rem" : "1.6rem" }}>
                📦 {lang === "th" ? "จัดการคำสั่งซื้อ" : "Order Manager"}
              </h1>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
                {lang === "th" ? "ดูและอัปเดตสถานะคำสั่งซื้อทั้งหมด" : "View and update all customer orders."}
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              📥 {lang === "th" ? "Export CSV" : "Export CSV"}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: lang === "th" ? "คำสั่งซื้อทั้งหมด" : "Total Orders", value: adminOrders.length,    icon: "📋" },
              { label: lang === "th" ? "รอดำเนินการ"       : "Pending",       value: stats.pending ?? 0,    icon: "⏳" },
              { label: lang === "th" ? "รายได้รวม"         : "Revenue",       value: fmt(totalRevenue),     icon: "💰" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ fontSize: "1.3rem" }}>{s.icon}</div>
                <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "var(--text-main)" }}>{s.value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === "th" ? "ค้นหา ID หรืออีเมล..." : "Search ID or email..."}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.88rem" }}
            />
            <button onClick={() => fetchAdminOrders()} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700, color: "var(--text-muted)" }}>
              🔄
            </button>
          </div>

          {/* Status filter tabs */}
          <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
            {["all", ...STATUS_LIST].map(s => {
              const cfg = s === "all" ? null : STATUS_CONFIG[s as OrderStatus];
              return (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: "5px 12px", borderRadius: 20, border: "1px solid",
                  borderColor: filterStatus === s ? "var(--primary)" : "var(--border-color)",
                  background: filterStatus === s ? "var(--primary)" : "var(--bg-color)",
                  color: filterStatus === s ? "white" : "var(--text-muted)",
                  fontWeight: 700, cursor: "pointer", fontSize: "0.78rem",
                }}>
                  {cfg ? cfg.icon : "📋"} {s === "all" ? (lang === "th" ? "ทั้งหมด" : "All") : (lang === "th" ? cfg!.labelTh : cfg!.labelEn)} ({stats[s] ?? 0})
                </button>
              );
            })}
          </div>

          {/* Orders */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>⏳ {lang === "th" ? "กำลังโหลด..." : "Loading..."}</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
              {lang === "th" ? "ไม่พบคำสั่งซื้อ" : "No orders found"}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(order => {
                const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const isSelected = selected?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => openDetail(order)}
                    style={{
                      background: "var(--card-bg)", border: `1px solid ${isSelected ? "var(--primary)" : "var(--border-color)"}`,
                      borderRadius: 12, padding: "12px 16px",
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.85rem" }}>{order.id}</span>
                        <span style={{ background: st.bg, color: st.color, borderRadius: 7, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
                          {st.icon} {lang === "th" ? st.labelTh : st.labelEn}
                        </span>
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.user_email} · {fmtDate(order.created_at)}
                      </div>
                      {order.tracking_number && (
                        <div style={{ fontSize: "0.72rem", color: "#0369a1", marginTop: 2, fontFamily: "monospace" }}>📦 {order.tracking_number}</div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 900, color: "var(--primary-hover)", fontSize: "0.95rem" }}>{fmt(order.total_amount)}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                        {(order.items?.length ?? 0)} {lang === "th" ? "รายการ" : "items"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right panel (desktop only) */}
        {!isMobile && selected && DetailPanel}
      </div>
    </div>
  );
}
