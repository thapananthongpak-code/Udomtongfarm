import { useEffect, useState, useMemo } from "react";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import { authFetch } from "../utils/authFetch";
import { API_BASE } from "../config/api";
import type { Species } from "../types/species";

type ProductRow = Species & { editing?: boolean };

export default function ProductManager() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();

  const [rows, setRows]       = useState<ProductRow[]>([]);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<"all" | "animal" | "plant">("all");
  const [saving, setSaving]   = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  useEffect(() => { fetchAll(); }, []);

  // sync ค่าจาก store แต่ไม่ reset row ที่กำลัง edit
  useEffect(() => {
    setRows(prev => {
      if (prev.length === 0) return items.map(it => ({ ...it, editing: false }));
      return items.map(it => {
        const existing = prev.find(r => r.id === it.id);
        if (existing?.editing) return existing; // ยังแก้ไขอยู่ อย่า reset
        return { ...it, editing: false };
      });
    });
  }, [items]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchType   = filter === "all" || r.type === filter;
      const matchSearch = !search || r.name_th.includes(search) || r.name_en.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [rows, filter, search]);

  function setRow(id: string, patch: Partial<ProductRow>) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }

  function rowPayload(r: ProductRow) {
    return {
      price:     r.price ?? 0,
      stock:     r.stock ?? 0,
      unit:      r.unit ?? (r.type === "animal" ? "head" : "plant"),
      available: r.available !== false,
      age:       r.age ?? null,
      gender:    r.gender ?? null,
    };
  }

  async function saveRow(row: ProductRow) {
    setSaving(row.id);
    setError(""); setSuccess("");
    try {
      const res = await authFetch(`${API_BASE}/api/products/${row.id}`, {
        method: "PUT",
        body: JSON.stringify(rowPayload(row)),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? (lang === "th" ? "บันทึกล้มเหลว" : "Save failed"));
      } else {
        setSuccess(lang === "th" ? `บันทึก "${row.name_th}" สำเร็จ` : `Saved "${row.name_en || row.name_th}" successfully`);
        setRow(row.id, { editing: false });
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError(lang === "th" ? "เกิดข้อผิดพลาด" : "An error occurred");
    } finally {
      setSaving(null);
    }
  }

  async function saveAll() {
    const changed = rows.filter(r => r.editing);
    if (changed.length === 0) { setError(lang === "th" ? "ไม่มีรายการที่แก้ไข" : "No items to save"); return; }
    setSaving("all"); setError(""); setSuccess("");
    try {
      const res = await authFetch(`${API_BASE}/api/products`, {
        method: "PUT",
        body: JSON.stringify(changed.map(r => ({ id: r.id, ...rowPayload(r) }))),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? (lang === "th" ? "บันทึกล้มเหลว" : "Save failed"));
      } else {
        setSuccess(lang === "th" ? `บันทึก ${changed.length} รายการสำเร็จ` : `Saved ${changed.length} items successfully`);
        setRows(prev => prev.map(r => ({ ...r, editing: false })));
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch { setError(lang === "th" ? "เกิดข้อผิดพลาด" : "An error occurred"); }
    finally { setSaving(null); }
  }

  const editCount  = rows.filter(r => r.editing).length;
  const totalValue = rows.reduce((s, r) => s + (r.price ?? 0) * (r.stock ?? 0), 0);
  const availCount = rows.filter(r => r.available !== false && (r.price ?? 0) > 0).length;

  const t = {
    title:     lang === "th" ? "จัดการราคาและสต็อก" : "Product Manager",
    search:    lang === "th" ? "ค้นหาสินค้า..." : "Search products...",
    saveAll:   lang === "th" ? "บันทึกทั้งหมด" : "Save All",
    name:      lang === "th" ? "สินค้า" : "Product",
    price:     lang === "th" ? "ราคา (฿)" : "Price (฿)",
    stock:     lang === "th" ? "สต็อก" : "Stock",
    unit:      lang === "th" ? "หน่วย" : "Unit",
    age:       lang === "th" ? "อายุ" : "Age",
    gender:    lang === "th" ? "เพศ" : "Gender",
    avail:     lang === "th" ? "จำหน่าย" : "Available",
    action:    lang === "th" ? "บันทึก" : "Save",
    totalVal:  lang === "th" ? "มูลค่าสต็อก" : "Stock Value",
    available: lang === "th" ? "สินค้าวางขาย" : "Listed Products",
  };

  const GENDER_OPTIONS_ANIMAL = lang === "th"
    ? ["ผสม", "เพศผู้", "เพศเมีย", "คู่ผสมพันธุ์"]
    : ["Mixed", "Male", "Female", "Breeding Pair"];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 6px 0", fontWeight: 900, color: "var(--text-main)" }}>🏷️ {t.title}</h1>
        <p style={{ margin: 0, color: "var(--text-muted)" }}>
          {lang === "th" ? "กำหนดราคา สต็อก อายุ เพศ และสถานะจำหน่ายสำหรับพืชและสัตว์แต่ละชนิด" : "Set price, stock, age, gender and availability for each species."}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: lang === "th" ? "สินค้าทั้งหมด" : "Total Products", value: rows.length, icon: "📦" },
          { label: t.available, value: availCount, icon: "✅" },
          { label: t.totalVal, value: fmt(totalValue), icon: "💰" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
            <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "var(--text-main)" }}>{s.value}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {success && <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#15803d", fontWeight: 600 }}>✅ {success}</div>}
      {error   && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#991b1b", fontWeight: 600 }}>⚠️ {error}</div>}

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t.search}
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.9rem" }}
        />
        <div style={{ display: "flex", background: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: 10, overflow: "hidden" }}>
          {(["all", "animal", "plant"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", border: "none", background: filter === f ? "var(--primary)" : "transparent", color: filter === f ? "white" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
              {f === "all" ? (lang === "th" ? "ทั้งหมด" : "All") : f === "animal" ? "🐾" : "🌿"}
            </button>
          ))}
        </div>
        {editCount > 0 && (
          <button
            onClick={saveAll}
            disabled={saving === "all"}
            style={{ padding: "9px 20px", borderRadius: 10, background: "#16a34a", color: "white", border: "none", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            💾 {t.saveAll} ({editCount})
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>⏳ {lang === "th" ? "กำลังโหลด..." : "Loading..."}</div>
      ) : (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-color)", borderBottom: "1px solid var(--border-color)" }}>
                  {[t.name, t.price, t.stock, t.unit, t.age, t.gender, t.avail, t.action].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "var(--text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--border-color)", background: row.editing ? "rgba(var(--primary-rgb,45,106,79),0.04)" : idx % 2 === 0 ? "transparent" : "var(--bg-color)" }}>
                    {/* Name */}
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={row.image} style={{ width: 40, height: 40, borderRadius: 7, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.9rem" }}>{row.name_th}</div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{row.type === "animal" ? "🐾" : "🌿"} {row.name_en}</div>
                        </div>
                      </div>
                    </td>
                    {/* Price */}
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        type="number" min={0} step={10}
                        value={row.price ?? 0}
                        onChange={e => setRow(row.id, { price: parseFloat(e.target.value) || 0, editing: true })}
                        style={{ width: 90, padding: "6px 8px", borderRadius: 7, border: `1px solid ${row.editing ? "var(--primary)" : "var(--border-color)"}`, background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, fontSize: "0.9rem" }}
                      />
                    </td>
                    {/* Stock */}
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        type="number" min={0}
                        value={row.stock ?? 0}
                        onChange={e => setRow(row.id, { stock: parseInt(e.target.value) || 0, editing: true })}
                        style={{ width: 72, padding: "6px 8px", borderRadius: 7, border: `1px solid ${row.editing ? "var(--primary)" : "var(--border-color)"}`, background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700 }}
                      />
                    </td>
                    {/* Unit */}
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        type="text"
                        value={row.unit ?? (row.type === "animal" ? "head" : "plant")}
                        onChange={e => setRow(row.id, { unit: e.target.value, editing: true })}
                        style={{ width: 72, padding: "6px 8px", borderRadius: 7, border: `1px solid ${row.editing ? "var(--primary)" : "var(--border-color)"}`, background: "var(--bg-color)", color: "var(--text-main)" }}
                      />
                    </td>
                    {/* Age */}
                    <td style={{ padding: "10px 16px" }}>
                      <input
                        type="text"
                        value={row.age ?? ""}
                        placeholder={lang === "th" ? "เช่น 1-2 ปี" : "e.g. 1-2 yr"}
                        onChange={e => setRow(row.id, { age: e.target.value, editing: true })}
                        style={{ width: 90, padding: "6px 8px", borderRadius: 7, border: `1px solid ${row.editing ? "var(--primary)" : "var(--border-color)"}`, background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.85rem" }}
                      />
                    </td>
                    {/* Gender */}
                    <td style={{ padding: "10px 16px" }}>
                      {row.type === "animal" ? (
                        <select
                          value={row.gender ?? ""}
                          onChange={e => setRow(row.id, { gender: e.target.value || null as any, editing: true })}
                          style={{ width: 100, padding: "6px 8px", borderRadius: 7, border: `1px solid ${row.editing ? "var(--primary)" : "var(--border-color)"}`, background: "var(--bg-color)", color: "var(--text-main)", fontSize: "0.85rem", cursor: "pointer" }}
                        >
                          <option value="">{lang === "th" ? "ไม่ระบุ" : "Any"}</option>
                          {GENDER_OPTIONS_ANIMAL.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                      )}
                    </td>
                    {/* Available toggle */}
                    <td style={{ padding: "10px 16px" }}>
                      <button
                        onClick={() => setRow(row.id, { available: !row.available, editing: true })}
                        style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: row.available !== false ? "#dcfce7" : "#fee2e2", color: row.available !== false ? "#15803d" : "#991b1b", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}
                      >
                        {row.available !== false ? (lang === "th" ? "✓ วางขาย" : "✓ Listed") : (lang === "th" ? "✕ ปิดขาย" : "✕ Unlisted")}
                      </button>
                    </td>
                    {/* Save */}
                    <td style={{ padding: "10px 16px" }}>
                      <button
                        onClick={() => saveRow(row)}
                        disabled={saving === row.id || !row.editing}
                        style={{ padding: "6px 14px", borderRadius: 8, background: row.editing ? "var(--primary)" : "var(--bg-color)", color: row.editing ? "white" : "var(--text-muted)", border: "1px solid var(--border-color)", fontWeight: 700, cursor: row.editing && saving !== row.id ? "pointer" : "not-allowed", fontSize: "0.85rem", transition: "all 0.15s" }}
                      >
                        {saving === row.id ? "..." : "💾"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
              {lang === "th" ? "ไม่พบสินค้า" : "No products found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
