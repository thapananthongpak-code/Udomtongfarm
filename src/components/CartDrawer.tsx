import { useCartStore } from "../store/cartStore";
import { useSettingsStore } from "../store/settingsStore";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, X } from "lucide-react";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, removeItem, updateQty, totalPrice } = useCartStore();
  const { lang } = useSettingsStore();

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  const t = {
    title:    lang === "th" ? "ตะกร้าสินค้า" : "Shopping Cart",
    empty:    lang === "th" ? "ตะกร้าว่างเปล่า" : "Your cart is empty",
    checkout: lang === "th" ? "ดำเนินการชำระเงิน" : "Proceed to Checkout",
    viewCart: lang === "th" ? "ดูตะกร้าสินค้า" : "View Cart",
    total:    lang === "th" ? "ยอดรวม" : "Total",
    remove:   lang === "th" ? "ลบ" : "Remove",
    close:    lang === "th" ? "ปิด" : "Close",
    baht:     "฿",
  };

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 200, backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(420px, 96vw)",
        background: "var(--card-bg)",
        borderLeft: "1px solid var(--border-color)",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
        zIndex: 201,
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.28s cubic-bezier(.22,.61,.36,1)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", borderBottom: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={20} color="var(--primary-hover)" />
            <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-main)" }}>{t.title}</span>
            {items.length > 0 && (
              <span style={{
                background: "var(--primary)", color: "white",
                borderRadius: 20, padding: "2px 10px", fontSize: "0.8rem", fontWeight: 700,
              }}>
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            style={{
              background: "var(--bg-color)", border: "1px solid var(--border-color)",
              borderRadius: 8, width: 34, height: 34, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: "1.1rem", transition: "all 0.15s",
            }}
          ><X size={16} /></button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <div style={{ marginBottom: 12, color: "var(--text-muted)" }}><ShoppingCart size={48} /></div>
              <div style={{ fontWeight: 600, fontSize: "1rem" }}>{t.empty}</div>
              <Link
                to="/encyclopedia"
                onClick={closeDrawer}
                style={{
                  display: "inline-block", marginTop: 20,
                  background: "var(--primary)", color: "white",
                  padding: "10px 24px", borderRadius: 10, textDecoration: "none",
                  fontWeight: 700, fontSize: "0.95rem",
                }}
              >
                {lang === "th" ? "เลือกสินค้า" : "Browse Products"}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cart_key} style={{
                display: "flex", gap: 12, padding: "12px",
                background: "var(--bg-color)", borderRadius: 12,
                border: "1px solid var(--border-color)", alignItems: "flex-start",
              }}>
                <img
                  src={item.species_image}
                  alt={item.species_name}
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lang === "th" ? item.species_name : item.species_name_en}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ color: "var(--primary-hover)", fontWeight: 800, fontSize: "0.9rem" }}>
                      {fmt(item.unit_price)} / {item.unit}
                    </span>
                    {item.gender && (
                      <span style={{ background: "var(--primary-light)", color: "var(--primary-hover)", borderRadius: 6, padding: "1px 8px", fontSize: "0.75rem", fontWeight: 700 }}>
                        {item.gender}
                      </span>
                    )}
                  </div>
                  {/* Quantity controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => updateQty(item.cart_key, item.quantity - 1)}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--card-bg)", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >−</button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center", color: "var(--text-main)" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.cart_key, item.quantity + 1)}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--card-bg)", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >+</button>
                    <span style={{ marginLeft: "auto", fontWeight: 700, color: "var(--primary-hover)" }}>
                      {fmt(item.unit_price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.cart_key)}
                      title={t.remove}
                      style={{ background: "#fee2e2", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "#991b1b", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                    ><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "16px 20px", borderTop: "1px solid var(--border-color)",
            background: "var(--card-bg)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>{t.total}</span>
              <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--primary-hover)" }}>
                {fmt(totalPrice())}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link
                to="/cart"
                onClick={closeDrawer}
                style={{
                  flex: 1, textAlign: "center", padding: "11px", borderRadius: 10,
                  border: "1px solid var(--border-color)", background: "var(--bg-color)",
                  color: "var(--text-main)", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem",
                }}
              >{t.viewCart}</Link>
              <Link
                to="/checkout"
                onClick={closeDrawer}
                style={{
                  flex: 1.5, textAlign: "center", padding: "11px", borderRadius: 10,
                  background: "var(--primary)", color: "white",
                  textDecoration: "none", fontWeight: 800, fontSize: "0.9rem",
                }}
              >{t.checkout}</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

