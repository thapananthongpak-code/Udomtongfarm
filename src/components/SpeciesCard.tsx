import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Species } from "../types/species";
import { useSettingsStore } from "../store/settingsStore";
import { useCartStore } from "../store/cartStore";
import { PawPrint, Leaf, Clock, Package, ShoppingCart, X } from "lucide-react";

type Props = { species: Species };

export default function SpeciesCard({ species }: Props) {
  const { lang } = useSettingsStore();
  const { addItem } = useCartStore();

  const hasPrice = typeof species.price === "number" && species.price > 0;
  const inStock  = (species.stock ?? 0) > 0 || species.available !== false;

  const [showModal, setShowModal] = useState(false);
  const [qty, setQty]             = useState(1);
  const [gender, setGender]       = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // เลือกค่า gender เริ่มต้นจาก species.gender ถ้ามี
  useEffect(() => {
    if (showModal) {
      setQty(1);
      setGender(species.gender ?? "");
    }
  }, [showModal, species.gender]);

  // ปิด modal เมื่อคลิกนอก
  useEffect(() => {
    if (!showModal) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showModal]);

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  function handleConfirmAdd() {
    if (!hasPrice || !inStock) return;
    const key = `${species.id}|${gender}`;
    addItem({
      cart_key:      key,
      species_id:    species.id,
      species_name:  species.name_th,
      species_name_en: species.name_en,
      species_image: species.image,
      species_type:  species.type,
      unit_price:    species.price!,
      quantity:      qty,
      unit:          species.unit ?? (species.type === "animal" ? "ตัว" : "ต้น"),
      gender:        gender || undefined,
    });
    setShowModal(false);
  }

  const genderOptions = species.type === "animal"
    ? (lang === "th"
        ? ["ผสม", "เพศผู้", "เพศเมีย", "คู่ผสมพันธุ์"]
        : ["Mixed", "Male", "Female", "Breeding Pair"])
    : [];

  return (
    <div style={{ position: "relative" }}>
      <Link
        to={`/species/${species.type}/${species.id}`}
        className={`glass-card species-card-${species.type}`}
        style={{ textDecoration: "none", color: "inherit", display: "block", padding: 0, overflow: "hidden" }}
      >
        {/* Image */}
        <div style={{ width: "100%", height: 210, overflow: "hidden", position: "relative", borderRadius: "24px 24px 0 0" }}>
          <img
            src={species.image}
            alt={species.name_en}
            className="hover-zoom-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Out of stock overlay */}
          {hasPrice && !inStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ background: "#ef4444", color: "white", borderRadius: 8, padding: "4px 12px", fontWeight: 800, fontSize: "0.85rem" }}>
                {lang === "th" ? "สินค้าหมด" : "Out of Stock"}
              </span>
            </div>
          )}
          {/* + Add to Cart button — top right */}
          {hasPrice && inStock && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
              style={{
                position: "absolute", top: 10, right: 10,
                width: 34, height: 34, borderRadius: "50%",
                background: "var(--primary)", color: "white",
                border: "none", fontSize: "1.3rem", fontWeight: 900,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                transition: "transform 0.15s, box-shadow 0.15s",
                lineHeight: 1,
              }}
              title={lang === "th" ? "เพิ่มเข้าตะกร้า" : "Add to Cart"}
            >+</button>
          )}
          {/* Stock badge */}
          {hasPrice && typeof species.stock === "number" && species.stock > 0 && (
            <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.55)", color: "white", borderRadius: 6, padding: "2px 8px", fontSize: "0.75rem", fontWeight: 700 }}>
              {lang === "th" ? "เหลือ" : "Stock"} {species.stock} {species.unit ?? (species.type === "animal" ? "ตัว" : "ต้น")}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1rem" }}>
          <span style={{ background: species.type === "animal" ? "var(--primary-light)" : "#fef3c7", color: species.type === "animal" ? "var(--primary-hover)" : "#d97706", padding: "3px 10px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 800, display: "inline-block", marginBottom: 8 }}>
            {species.type === "animal" ? <><PawPrint size={12} color="var(--primary-hover)" /> สัตว์</> : <><Leaf size={12} color="#d97706" /> พืช</>}
          </span>

          <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "1.05rem" }}>
            {lang === "th" ? species.name_th : species.name_en}
          </h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {lang === "th" ? species.name_en : species.name_th}
          </p>
          {species.scientific_name && (
            <p style={{ fontStyle: "italic", fontSize: "0.82rem", margin: "4px 0 0 0", color: "var(--text-muted)" }}>{species.scientific_name}</p>
          )}

          {/* Price row + meta */}
          {hasPrice ? (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ color: "var(--primary-hover)", fontWeight: 900, fontSize: "1.1rem" }}>{fmt(species.price!)}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.76rem" }}>/ {species.unit ?? (species.type === "animal" ? "ตัว" : "ต้น")}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {species.age  && <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} color="var(--text-muted)" /> {species.age}</div>}
                  {species.gender && <div>⚥ {species.gender}</div>}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 10, color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.85rem", textAlign: "right" }}>
              {lang === "th" ? "อ่านเพิ่มเติม →" : "Read more →"}
            </div>
          )}
        </div>
      </Link>

      {/* ── Cart Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }}>
          <div ref={modalRef} style={{ background: "var(--card-bg)", borderRadius: 18, padding: 24, width: "min(360px, 92vw)", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", border: "1px solid var(--border-color)" }}>
            {/* Header */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
              <img src={species.image} alt={species.name_th} style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "1rem" }}>{lang === "th" ? species.name_th : species.name_en}</div>
                <div style={{ color: "var(--primary-hover)", fontWeight: 900, fontSize: "1.1rem" }}>{fmt(species.price!)}</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}><X size={20} /></button>
            </div>

            {/* Gender selector (animals only) */}
            {genderOptions.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8, fontSize: "0.9rem" }}>
                  ⚥ {lang === "th" ? "เพศ" : "Gender"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["", ...genderOptions].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${gender === g ? "var(--primary)" : "var(--border-color)"}`, background: gender === g ? "var(--primary-light)" : "var(--bg-color)", color: gender === g ? "var(--primary-hover)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}
                    >
                      {g || (lang === "th" ? "ไม่ระบุ" : "Any")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 5 }}>
                <Package size={14} color="#f59e0b" /> {lang === "th" ? "จำนวน" : "Quantity"}
                {typeof species.stock === "number" && species.stock > 0 && (
                  <span style={{ marginLeft: 8, color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>
                    ({lang === "th" ? "เหลือ" : "Stock"} {species.stock})
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", fontWeight: 900, fontSize: "1.2rem", cursor: "pointer", color: "var(--text-main)" }}
                >−</button>
                <input
                  type="number" min={1} max={species.stock ?? 999}
                  value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: 60, textAlign: "center", padding: "8px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 900, fontSize: "1.1rem" }}
                />
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", fontWeight: 900, fontSize: "1.2rem", cursor: "pointer", color: "var(--text-main)" }}
                >+</button>
                <span style={{ marginLeft: 4, color: "var(--primary-hover)", fontWeight: 900, fontSize: "1rem" }}>
                  = {fmt(species.price! * qty)}
                </span>
              </div>
            </div>

            {/* Confirm */}
            <button
              onClick={handleConfirmAdd}
              style={{ width: "100%", padding: "13px", borderRadius: 12, background: "var(--primary)", color: "white", border: "none", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}
            >
              <ShoppingCart size={16} style={{ marginRight: 6 }} /> {lang === "th" ? "เพิ่มเข้าตะกร้า" : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
