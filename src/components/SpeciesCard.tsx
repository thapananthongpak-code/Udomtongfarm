import { Link } from "react-router-dom";
import type { Species } from "../types/species";
import { useSettingsStore } from "../store/settingsStore";
import { useCartStore } from "../store/cartStore";

type Props = {
  species: Species;
};

export default function SpeciesCard({ species }: Props) {
  const { lang } = useSettingsStore();
  const { addItem } = useCartStore();

  const hasPrice = typeof species.price === "number" && species.price > 0;
  const inStock  = (species.stock ?? 0) > 0 || species.available !== false;

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!hasPrice || !inStock) return;
    addItem({
      species_id:    species.id,
      species_name:  species.name_th,
      species_name_en: species.name_en,
      species_image: species.image,
      species_type:  species.type,
      unit_price:    species.price!,
      quantity:      1,
      unit:          species.unit ?? (species.type === "animal" ? "ตัว" : "ต้น"),
    });
  }

  return (
    <Link
      to={`/species/${species.type}/${species.id}`}
      className="glass-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", height: 200, overflow: "hidden", position: "relative" }}>
        <img
          src={species.image}
          alt={species.name_en}
          className="hover-zoom-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Out of stock overlay */}
        {hasPrice && !inStock && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ background: "#ef4444", color: "white", borderRadius: 8, padding: "4px 12px", fontWeight: 800, fontSize: "0.85rem" }}>
              {lang === "th" ? "สินค้าหมด" : "Out of Stock"}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "1rem" }}>
        <span style={{
          background: species.type === "animal" ? "var(--primary-light)" : "#fef3c7",
          color: species.type === "animal" ? "var(--primary-hover)" : "#d97706",
          padding: "3px 10px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 800,
          display: "inline-block", marginBottom: 8,
        }}>
          {species.type === "animal" ? "🐾 สัตว์" : "🌿 พืช"}
        </span>

        <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "1.1rem" }}>
          {lang === "th" ? species.name_th : species.name_en}
        </h3>

        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {lang === "th" ? species.name_en : species.name_th}
        </p>

        {species.scientific_name && (
          <p style={{ fontStyle: "italic", fontSize: "0.85rem", margin: "4px 0 0 0", color: "var(--text-muted)" }}>
            {species.scientific_name}
          </p>
        )}

        {/* Price + cart or read-more */}
        {hasPrice ? (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "var(--primary-hover)", fontWeight: 900, fontSize: "1.05rem" }}>
                {fmt(species.price!)}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                / {species.unit ?? (species.type === "animal" ? "ตัว" : "ต้น")}
                {typeof species.stock === "number" && species.stock > 0 && (
                  <span style={{ marginLeft: 6, color: "#16a34a" }}>
                    ({lang === "th" ? "เหลือ" : "Stock"} {species.stock})
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                padding: "7px 14px", borderRadius: 9,
                background: inStock ? "var(--primary)" : "var(--border-color)",
                color: inStock ? "white" : "var(--text-muted)",
                border: "none", fontWeight: 700, fontSize: "0.82rem",
                cursor: inStock ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              🛒 {lang === "th" ? "ใส่ตะกร้า" : "Add to Cart"}
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 12, color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.85rem", textAlign: "right" }}>
            {lang === "th" ? "อ่านเพิ่มเติม →" : "Read more →"}
          </div>
        )}
      </div>
    </Link>
  );
}
