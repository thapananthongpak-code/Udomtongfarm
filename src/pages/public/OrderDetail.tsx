import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useSettingsStore } from "../../store/settingsStore";
import { API_BASE } from "../../config/api";
import type { Order, OrderStatus } from "../../types/shop";
import { SHIPPING_COMPANIES } from "../../types/shop";

const STATUS_CONFIG: Record<OrderStatus, { icon: string; labelTh: string; labelEn: string; color: string; bg: string; step: number }> = {
  pending:    { icon: "⏳", labelTh: "รอชำระเงิน",        labelEn: "Pending Payment", color: "#92400e", bg: "#fef3c7", step: 1 },
  confirmed:  { icon: "✅", labelTh: "ชำระเงินแล้ว",       labelEn: "Paid",            color: "#1e40af", bg: "#dbeafe", step: 2 },
  processing: { icon: "⚙️", labelTh: "กำลังเตรียมสินค้า",  labelEn: "Processing",      color: "#5b21b6", bg: "#ede9fe", step: 3 },
  shipped:    { icon: "🚚", labelTh: "กำลังจัดส่ง",        labelEn: "Shipped",         color: "#0369a1", bg: "#e0f2fe", step: 4 },
  delivered:  { icon: "✓",  labelTh: "จัดส่งสำเร็จแล้ว",   labelEn: "Delivered",       color: "#15803d", bg: "#dcfce7", step: 5 },
  cancelled:  { icon: "✕",  labelTh: "ยกเลิกแล้ว",         labelEn: "Cancelled",       color: "#991b1b", bg: "#fee2e2", step: 0 },
};

const ORDER_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

const PAY_LABEL: Record<string, { th: string; en: string }> = {
  promptpay:    { th: "📱 พร้อมเพย์",         en: "📱 PromptPay" },
  bank_transfer: { th: "🏦 โอนเงินธนาคาร",    en: "🏦 Bank Transfer" },
  cod:          { th: "💵 เก็บเงินปลายทาง",   en: "💵 Cash on Delivery" },
  credit_card:  { th: "💳 บัตรเครดิต/เดบิต", en: "💳 Credit/Debit Card" },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { lang } = useSettingsStore();
  const isMobile = useIsMobile();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const justOrdered = (location.state as any)?.justOrdered;

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  async function fetchOrder() {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`);
      const data = await res.json();
      if (!data.error) setOrder(data);
    } catch {}
  }

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrder(data);
        setLoading(false);
      })
      .catch(() => { setError("โหลดข้อมูลล้มเหลว"); setLoading(false); });
  }, [id, user]);

  // Poll for status updates every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(fetchOrder, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 80, color: "var(--text-muted)" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⏳</div>
      {lang === "th" ? "กำลังโหลด..." : "Loading..."}
    </div>
  );

  if (error || !order) return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>❌</div>
      <p style={{ color: "#991b1b", marginBottom: 20 }}>{error || "ไม่พบคำสั่งซื้อ"}</p>
      <Link to="/orders" style={{ color: "var(--primary-hover)", fontWeight: 700 }}>← {lang === "th" ? "กลับหน้าคำสั่งซื้อ" : "Back to Orders"}</Link>
    </div>
  );

  const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const curStep = st.step;
  const isCancelled = order.status === "cancelled";
  const shippingCo = order.shipping_company
    ? SHIPPING_COMPANIES.find(c => c.id === order.shipping_company)
    : null;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "16px 12px" : "32px 20px" }}>
      {/* Success banner */}
      {justOrdered && (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 14, padding: "16px 20px", marginBottom: 22, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: "1.8rem" }}>🎉</span>
          <div>
            <div style={{ fontWeight: 800, color: "#15803d", fontSize: "1rem" }}>
              {lang === "th" ? "สั่งซื้อสำเร็จ!" : "Order Placed Successfully!"}
            </div>
            <div style={{ color: "#166534", fontSize: "0.88rem", marginTop: 2 }}>
              {lang === "th" ? "ทีมงานจะติดต่อกลับเพื่อยืนยันการชำระเงิน" : "Our team will contact you to confirm payment."}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <div>
          <Link to="/orders" style={{ color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
            ← {lang === "th" ? "คำสั่งซื้อทั้งหมด" : "All Orders"}
          </Link>
          <h1 style={{ margin: "6px 0 4px 0", fontWeight: 900, color: "var(--text-main)", fontSize: isMobile ? "1.1rem" : "1.4rem" }}>
            {order.id}
          </h1>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{fmtDate(order.created_at)}</div>
        </div>
        <span style={{ background: st.bg, color: st.color, borderRadius: 10, padding: "8px 14px", fontSize: "0.9rem", fontWeight: 800 }}>
          {st.icon} {lang === "th" ? st.labelTh : st.labelEn}
        </span>
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 14, padding: isMobile ? "16px 12px" : "20px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {ORDER_STEPS.map((stepId, idx) => {
              const s = STATUS_CONFIG[stepId];
              const done = curStep > s.step;
              const active = curStep === s.step;
              return (
                <div key={stepId} style={{ display: "flex", alignItems: "center", flex: idx < ORDER_STEPS.length - 1 ? 1 : undefined }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: isMobile ? 30 : 38, height: isMobile ? 30 : 38, borderRadius: "50%",
                      background: done || active ? "var(--primary)" : "var(--bg-color)",
                      border: `2px solid ${done || active ? "var(--primary)" : "var(--border-color)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: isMobile ? "0.75rem" : "0.9rem",
                      color: done || active ? "white" : "var(--text-muted)",
                      fontWeight: 700, transition: "all 0.3s", margin: "0 auto 5px",
                    }}>
                      {done ? "✓" : s.icon}
                    </div>
                    <div style={{ fontSize: isMobile ? "0.6rem" : "0.7rem", color: active ? "var(--primary-hover)" : "var(--text-muted)", fontWeight: active ? 700 : 400, maxWidth: isMobile ? 50 : 70, lineHeight: 1.3 }}>
                      {lang === "th" ? s.labelTh : s.labelEn}
                    </div>
                  </div>
                  {idx < ORDER_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: done ? "var(--primary)" : "var(--border-color)", margin: "0 2px 18px", transition: "background 0.3s" }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: "0.78rem", color: "var(--text-muted)" }}>
            🔄 {lang === "th" ? "อัปเดตอัตโนมัติทุก 30 วินาที" : "Auto-refreshes every 30 seconds"}
          </div>
        </div>
      )}

      {/* Shipping info card — show when shipped */}
      {(order.shipping_company || order.tracking_number || order.estimated_delivery) && !isCancelled && (
        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 14, padding: "16px 20px", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, color: "#1d4ed8", marginBottom: 12, fontSize: "0.95rem" }}>
            🚚 {lang === "th" ? "ข้อมูลการจัดส่ง" : "Shipping Info"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
            {shippingCo && (
              <div>
                <div style={{ fontSize: "0.75rem", color: "#1e40af", fontWeight: 600, marginBottom: 3 }}>{lang === "th" ? "บริษัทขนส่ง" : "Carrier"}</div>
                <div style={{ fontWeight: 800, color: "#1d4ed8" }}>{shippingCo.icon} {lang === "th" ? shippingCo.nameTh : shippingCo.nameEn}</div>
              </div>
            )}
            {order.tracking_number && (
              <div>
                <div style={{ fontSize: "0.75rem", color: "#1e40af", fontWeight: 600, marginBottom: 3 }}>{lang === "th" ? "เลขพัสดุ" : "Tracking No."}</div>
                <div style={{ fontWeight: 800, color: "#1d4ed8", fontFamily: "monospace", fontSize: "0.95rem" }}>{order.tracking_number}</div>
              </div>
            )}
            {order.estimated_delivery && (
              <div>
                <div style={{ fontSize: "0.75rem", color: "#1e40af", fontWeight: 600, marginBottom: 3 }}>{lang === "th" ? "คาดว่าจะถึง" : "Est. Delivery"}</div>
                <div style={{ fontWeight: 800, color: "#1d4ed8" }}>📅 {order.estimated_delivery}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--text-main)" }}>📍 {lang === "th" ? "ที่อยู่จัดส่ง" : "Shipping Address"}</div>
          {order.shipping_address ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--text-main)" }}>{order.shipping_address.name}</strong>
              {order.shipping_address.phone && ` · ${order.shipping_address.phone}`}<br />
              {[order.shipping_address.address_line, order.shipping_address.district, order.shipping_address.province, order.shipping_address.postal_code].filter(Boolean).join(", ")}
            </div>
          ) : <div style={{ color: "var(--text-muted)" }}>-</div>}
        </div>

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--text-main)" }}>💳 {lang === "th" ? "การชำระเงิน" : "Payment"}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {PAY_LABEL[order.payment_method]?.[lang === "th" ? "th" : "en"] ?? order.payment_method}
          </div>
          {order.status === "pending" && (
            <div style={{ marginTop: 8, background: "#fef3c7", borderRadius: 8, padding: "8px 10px", fontSize: "0.8rem", color: "#92400e" }}>
              ⏳ {lang === "th" ? "รอการยืนยันจากทีมงาน" : "Awaiting confirmation"}
            </div>
          )}
          {order.status === "confirmed" && (
            <div style={{ marginTop: 8, background: "#dcfce7", borderRadius: 8, padding: "8px 10px", fontSize: "0.8rem", color: "#15803d" }}>
              ✅ {lang === "th" ? "ชำระเงินเรียบร้อยแล้ว" : "Payment confirmed"}
            </div>
          )}
        </div>
      </div>

      {/* Order items */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 14, padding: "18px", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 14, color: "var(--text-main)" }}>
          🛒 {lang === "th" ? "รายการสินค้า" : "Order Items"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(order.items ?? []).map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--border-color)" }}>
              <img
                src={item.species_image}
                style={{ width: isMobile ? 48 : 60, height: isMobile ? 48 : 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                onError={e => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
              />
              <div style={{ flex: 1 }}>
                <Link
                  to={`/species/${item.species_type}/${item.species_id}`}
                  style={{ fontWeight: 700, color: "var(--text-main)", textDecoration: "none", fontSize: "0.92rem" }}
                >
                  {item.species_name}
                </Link>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: 2 }}>
                  {fmt(item.unit_price)} × {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 800, color: "var(--primary-hover)", fontSize: "0.95rem" }}>
                {fmt(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            <span>{lang === "th" ? "ยอดรวม" : "Subtotal"}</span>
            <span style={{ fontWeight: 700 }}>
              {fmt((order.items ?? []).reduce((s, i) => s + i.subtotal, 0))}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-hover)", paddingTop: 8, borderTop: "1px solid var(--border-color)" }}>
            <span>{lang === "th" ? "ยอดชำระ" : "Total"}</span>
            <span>{fmt(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {order.note && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "12px 16px" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--text-main)" }}>📝 {lang === "th" ? "หมายเหตุ" : "Note"}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{order.note}</div>
        </div>
      )}
    </div>
  );
}
