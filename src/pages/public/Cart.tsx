import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { useSettingsStore } from "../../store/settingsStore";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCartStore();
  const { lang } = useSettingsStore();
  const isMobile = useIsMobile();

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  const t = {
    title:    lang === "th" ? "ตะกร้าสินค้า" : "Shopping Cart",
    empty:    lang === "th" ? "ตะกร้าของคุณว่างเปล่า" : "Your cart is empty",
    browse:   lang === "th" ? "เลือกซื้อสินค้า" : "Browse Products",
    clear:    lang === "th" ? "ล้างตะกร้า" : "Clear Cart",
    subtotal: lang === "th" ? "ยอดรวม" : "Subtotal",
    shipping: lang === "th" ? "ค่าจัดส่ง" : "Shipping",
    total:    lang === "th" ? "ยอดชำระ" : "Total",
    free:     lang === "th" ? "ฟรี" : "Free",
    checkout: lang === "th" ? "ดำเนินการสั่งซื้อ" : "Proceed to Checkout",
    cont:     lang === "th" ? "เลือกสินค้าต่อ" : "Continue Shopping",
    items:    lang === "th" ? "รายการสินค้า" : "Items",
    qty:      lang === "th" ? "จำนวน" : "Qty",
    price:    lang === "th" ? "ราคา/หน่วย" : "Unit Price",
    amount:   lang === "th" ? "รวม" : "Amount",
    action:   lang === "th" ? "จัดการ" : "Action",
  };

  const FREE_SHIP_THRESHOLD = 1000;
  const subtotal = totalPrice();
  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : 80;
  const grandTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
        <div style={{ fontSize: "5rem", marginBottom: 16 }}>🛒</div>
        <h2 style={{ color: "var(--text-main)", marginBottom: 8 }}>{t.empty}</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
          {lang === "th" ? "ลองเลือกดูสินค้าที่เราจัดเตรียมไว้ให้คุณ" : "Explore our catalog and add items you like."}
        </p>
        <Link
          to="/encyclopedia"
          style={{ background: "var(--primary)", color: "white", padding: "12px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: "1rem" }}
        >
          {t.browse}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ margin: 0, color: "var(--text-main)", fontSize: "1.8rem", fontWeight: 900 }}>
          🛒 {t.title}
        </h1>
        <button
          onClick={() => { if (confirm(lang === "th" ? "ล้างตะกร้าสินค้าทั้งหมด?" : "Clear all cart items?")) clearCart(); }}
          style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fee2e2", color: "#991b1b", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}
        >
          🗑 {t.clear}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr min(360px, 100%)", gap: 20, alignItems: "start" }}>
        {/* Item list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.cart_key} style={{
              display: "grid", gridTemplateColumns: isMobile ? "64px 1fr" : "80px 1fr auto auto auto", alignItems: "center",
              gap: 16, padding: "16px", background: "var(--card-bg)", borderRadius: 14,
              border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)",
            }}>
              <img
                src={item.species_image}
                alt={item.species_name}
                style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, objectFit: "cover", borderRadius: 10 }}
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
              />
              <div>
                <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: isMobile ? "0.92rem" : "1rem" }}>
                  {lang === "th" ? item.species_name : item.species_name_en}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                  {item.species_type === "animal" ? "🐾 สัตว์" : "🌿 พืช"} · {item.unit}
                  {item.gender && (
                    <span style={{ background: "var(--primary-light)", color: "var(--primary-hover)", borderRadius: 6, padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700 }}>
                      {item.gender}
                    </span>
                  )}
                </div>
                <div style={{ color: "var(--primary-hover)", fontWeight: 700, marginTop: 4, fontSize: "0.9rem" }}>
                  {fmt(item.unit_price)} / {item.unit}
                </div>
                {isMobile && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <button onClick={() => updateQty(item.cart_key, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 22, textAlign: "center", color: "var(--text-main)" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.cart_key, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    <span style={{ fontWeight: 900, color: "var(--primary-hover)", marginLeft: 4 }}>{fmt(item.unit_price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.cart_key)} style={{ background: "#fee2e2", border: "none", borderRadius: 7, padding: "4px 8px", cursor: "pointer", color: "#991b1b", fontWeight: 700, marginLeft: "auto" }}>🗑</button>
                  </div>
                )}
              </div>
              {/* Desktop: qty, subtotal, remove as separate columns */}
              {!isMobile && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => updateQty(item.cart_key, item.quantity - 1)} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <input type="number" min={1} value={item.quantity} onChange={(e) => updateQty(item.cart_key, parseInt(e.target.value) || 1)} style={{ width: 46, textAlign: "center", border: "1px solid var(--border-color)", borderRadius: 7, padding: "4px", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, fontSize: "0.95rem" }} />
                    <button onClick={() => updateQty(item.cart_key, item.quantity + 1)} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <div style={{ fontWeight: 900, color: "var(--primary-hover)", fontSize: "1.05rem", minWidth: 80, textAlign: "right" }}>{fmt(item.unit_price * item.quantity)}</div>
                  <button onClick={() => removeItem(item.cart_key)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#991b1b", fontWeight: 700 }}>🗑</button>
                </>
              )}
            </div>
          ))}

          <Link
            to="/encyclopedia"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem", marginTop: 4 }}
          >
            ← {t.cont}
          </Link>
        </div>

        {/* Order summary */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: 16, padding: isMobile ? "16px" : "24px", boxShadow: "var(--shadow-md)",
          position: isMobile ? "static" : "sticky", top: 90,
        }}>
          <h3 style={{ margin: "0 0 20px 0", color: "var(--text-main)", fontWeight: 900 }}>
            {lang === "th" ? "สรุปคำสั่งซื้อ" : "Order Summary"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
              <span>{t.subtotal} ({items.reduce((s, i) => s + i.quantity, 0)} {lang === "th" ? "รายการ" : "items"})</span>
              <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
              <span>{t.shipping}</span>
              <span style={{ fontWeight: 700, color: shipping === 0 ? "#16a34a" : "var(--text-main)" }}>
                {shipping === 0 ? `✓ ${t.free}` : fmt(shipping)}
              </span>
            </div>
            {subtotal < FREE_SHIP_THRESHOLD && (
              <div style={{ background: "#fef3c7", borderRadius: 8, padding: "8px 12px", fontSize: "0.82rem", color: "#92400e" }}>
                {lang === "th"
                  ? `ซื้อเพิ่ม ${fmt(FREE_SHIP_THRESHOLD - subtotal)} เพื่อรับส่งฟรี!`
                  : `Add ${fmt(FREE_SHIP_THRESHOLD - subtotal)} more for free shipping!`}
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>{t.total}</span>
              <span style={{ fontWeight: 900, fontSize: "1.4rem", color: "var(--primary-hover)" }}>{fmt(grandTotal)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            style={{
              display: "block", textAlign: "center", padding: "14px",
              background: "var(--primary)", color: "white",
              borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: "1rem",
              transition: "all 0.2s",
            }}
          >
            {t.checkout} →
          </Link>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <div>✓ {lang === "th" ? "สินค้าแท้ คุณภาพดี" : "Authentic quality products"}</div>
            <div>✓ {lang === "th" ? "จัดส่งทั่วประเทศ" : "Nationwide delivery"}</div>
            <div>✓ {lang === "th" ? "บริการหลังการขาย" : "After-sales support"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
