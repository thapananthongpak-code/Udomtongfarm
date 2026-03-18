import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/orderStore";
import { useAuth } from "../../store/AuthContext";
import { useSettingsStore } from "../../store/settingsStore";
import type { OrderStatus } from "../../types/shop";

const STATUS_CONFIG: Record<OrderStatus, { icon: string; labelTh: string; labelEn: string; color: string; bg: string }> = {
  pending:    { icon: "⏳", labelTh: "รอชำระเงิน",          labelEn: "Pending Payment", color: "#92400e", bg: "#fef3c7" },
  confirmed:  { icon: "✅", labelTh: "ชำระเงินแล้ว",         labelEn: "Paid",            color: "#1e40af", bg: "#dbeafe" },
  processing: { icon: "⚙️", labelTh: "กำลังเตรียมสินค้า",   labelEn: "Processing",      color: "#5b21b6", bg: "#ede9fe" },
  shipped:    { icon: "🚚", labelTh: "กำลังจัดส่ง",          labelEn: "Shipped",         color: "#0369a1", bg: "#e0f2fe" },
  delivered:  { icon: "✓",  labelTh: "จัดส่งสำเร็จแล้ว",    labelEn: "Delivered",       color: "#15803d", bg: "#dcfce7" },
  cancelled:  { icon: "✕",  labelTh: "ยกเลิกแล้ว",           labelEn: "Cancelled",       color: "#991b1b", bg: "#fee2e2" },
};

const FLOW_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

function OrderTimeline({ status, lang }: { status: OrderStatus; lang: string }) {
  if (status === "cancelled") return null;
  const currentIdx = FLOW_STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 10 }}>
      {FLOW_STEPS.map((s, i) => {
        const cfg = STATUS_CONFIG[s];
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < FLOW_STEPS.length - 1 ? "none" : 1 }}>
            <div title={lang === "th" ? cfg.labelTh : cfg.labelEn} style={{
              width: active ? 26 : 18, height: active ? 26 : 18,
              borderRadius: "50%",
              background: done ? "var(--primary)" : active ? cfg.bg : "var(--bg-color)",
              border: active ? `2px solid ${cfg.color}` : done ? "none" : "2px solid var(--border-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: active ? "0.8rem" : "0.65rem",
              flexShrink: 0,
              transition: "all 0.25s ease",
              boxShadow: active ? `0 2px 8px ${cfg.bg}` : "none",
            }}>
              {active ? cfg.icon : done ? "✓" : ""}
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div style={{ width: "100%", minWidth: 12, height: 2, background: done ? "var(--primary)" : "var(--border-color)", margin: "0 2px", borderRadius: 2, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function Orders() {
  const { orders, loading, fetchMyOrders, pollOrders } = useOrderStore();
  const { user } = useAuth();
  const { lang } = useSettingsStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchMyOrders(user.email!);
  }, [user?.email]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!user?.email) return;
    intervalRef.current = setInterval(() => pollOrders(user.email!), 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [user?.email]);

  if (!user) return null;

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const statusKeys = Object.keys(STATUS_CONFIG) as OrderStatus[];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 12px" : "32px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ margin: 0, fontWeight: 900, color: "var(--text-main)", fontSize: isMobile ? "1.3rem" : "1.8rem" }}>
          📦 {lang === "th" ? "คำสั่งซื้อของฉัน" : "My Orders"}
        </h1>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          🔄 {lang === "th" ? "อัปเดตอัตโนมัติทุก 30 วิ" : "Auto-updates every 30s"}
        </div>
      </div>

      {/* Status filter */}
      {orders.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          <button
            onClick={() => setFilterStatus("all")}
            style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid", borderColor: filterStatus === "all" ? "var(--primary)" : "var(--border-color)", background: filterStatus === "all" ? "var(--primary)" : "var(--bg-color)", color: filterStatus === "all" ? "white" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.78rem" }}
          >
            📋 {lang === "th" ? "ทั้งหมด" : "All"} ({orders.length})
          </button>
          {statusKeys.map(s => {
            const count = orders.filter(o => o.status === s).length;
            if (count === 0) return null;
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid", borderColor: filterStatus === s ? cfg.color : "var(--border-color)", background: filterStatus === s ? cfg.bg : "var(--bg-color)", color: filterStatus === s ? cfg.color : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.78rem" }}
              >
                {cfg.icon} {lang === "th" ? cfg.labelTh : cfg.labelEn} ({count})
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
          {lang === "th" ? "กำลังโหลด..." : "Loading..."}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80 }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>📭</div>
          <h3 style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            {lang === "th" ? "ยังไม่มีคำสั่งซื้อ" : "No orders yet"}
          </h3>
          <Link to="/encyclopedia" style={{ background: "var(--primary)", color: "white", padding: "12px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>
            {lang === "th" ? "เลือกซื้อสินค้า" : "Shop Now"}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
          {lang === "th" ? "ไม่พบคำสั่งซื้อในสถานะนี้" : "No orders with this status"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((order) => {
            const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            return (
              <Link key={order.id} to={`/orders/${order.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--card-bg)", border: "1px solid var(--border-color)",
                  borderRadius: 14, padding: isMobile ? "14px" : "18px 20px",
                  display: "flex", flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 10 : 16, alignItems: isMobile ? "flex-start" : "center",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.15s, border-color 0.15s", cursor: "pointer",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.92rem" }}>{order.id}</span>
                      <span style={{ background: st.bg, color: st.color, borderRadius: 8, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700 }}>
                        {st.icon} {lang === "th" ? st.labelTh : st.labelEn}
                      </span>
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 8 }}>
                      {fmtDate(order.created_at)}
                    </div>
                    <OrderTimeline status={order.status} lang={lang} />
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
                      {(order.items ?? []).slice(0, 3).map(item => (
                        <img
                          key={item.id}
                          src={item.species_image}
                          style={{ width: 38, height: 38, borderRadius: 7, objectFit: "cover" }}
                          onError={e => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                        />
                      ))}
                      {(order.items?.length ?? 0) > 3 && (
                        <div style={{ width: 38, height: 38, borderRadius: 7, background: "var(--bg-color)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--text-muted)", fontSize: "0.78rem" }}>
                          +{(order.items?.length ?? 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: isMobile ? "left" : "right" }}>
                    <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-hover)" }}>
                      {fmt(order.total_amount)}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>
                      {(order.items?.length ?? 0)} {lang === "th" ? "รายการ" : "items"}
                    </div>
                    {order.tracking_number && (
                      <div style={{ fontSize: "0.75rem", color: "#0369a1", marginTop: 4, fontFamily: "monospace" }}>
                        📦 {order.tracking_number}
                      </div>
                    )}
                    <div style={{ color: "var(--primary-hover)", fontSize: "0.8rem", marginTop: 4, fontWeight: 700 }}>
                      {lang === "th" ? "ดูรายละเอียด →" : "View →"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
