import { useMemo, useState } from "react";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore"; // 🟢 ดึงระบบภาษามาใช้
import type { Species, SpeciesType } from "../types/species";

// 🟢 อัปเดต Initial State ให้ครอบคลุมฟิลด์ภาษาอังกฤษ
const emptyDraft = (): Species => ({
  id: "",
  type: "animal",
  name_th: "",
  name_en: "",
  scientific_name: "",
  short_description: "",
  short_description_en: "", // 🟢 เพิ่ม
  description: "",
  description_en: "",       // 🟢 เพิ่ม
  image: "",
  tags: [],
  references: [],
});

export default function SpeciesManager() {
  const items = useSpeciesStore((s) => s.items);
  const add = useSpeciesStore((s) => s.add);
  const update = useSpeciesStore((s) => s.update);
  const remove = useSpeciesStore((s) => s.remove);
  
  const { lang } = useSettingsStore(); // 🟢 ดึงค่าภาษาปัจจุบัน

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | SpeciesType>("all");
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [editingKey, setEditingKey] = useState<{ type: SpeciesType; id: string } | null>(null);
  const [draft, setDraft] = useState<Species>(emptyDraft());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((x) => (typeFilter === "all" ? true : x.type === typeFilter))
      .filter((x) => (x.name_th + x.name_en + x.id).toLowerCase().includes(q))
      .sort((a, b) => (a.name_en || "").localeCompare(b.name_en || ""));
  }, [items, query, typeFilter]);

  // 🟢 พจนานุกรมแปลหน้าจัดการสายพันธุ์
  const t = {
    title: lang === "th" ? "จัดการสายพันธุ์" : "Species Manager",
    addBtn: lang === "th" ? "+ เพิ่มสายพันธุ์ใหม่" : "+ Add New Species",
    search: lang === "th" ? "ค้นหาชื่อหรือ ID..." : "Search name or ID...",
    allTypes: lang === "th" ? "ทุกหมวดหมู่" : "All Types",
    animals: lang === "th" ? "สัตว์" : "Animals",
    plants: lang === "th" ? "พืช" : "Plants",
    modalAdd: lang === "th" ? "✨ เพิ่มข้อมูลใหม่" : "✨ Add New",
    modalEdit: lang === "th" ? "✏️ แก้ไขข้อมูล" : "✏️ Edit Data",
    btnCancel: lang === "th" ? "ยกเลิก" : "Cancel",
    btnSave: lang === "th" ? "💾 บันทึกข้อมูล" : "💾 Save",
    thPreview: lang === "th" ? "รูปภาพ" : "Preview",
    thName: lang === "th" ? "ชื่อ" : "Name",
    thAction: lang === "th" ? "การจัดการ" : "Actions",
    editBtn: lang === "th" ? "แก้ไข" : "Edit",
    delBtn: lang === "th" ? "ลบ" : "Delete",
    noData: lang === "th" ? "ไม่พบข้อมูลที่ค้นหา" : "No data found",
    alertSave: lang === "th" ? "กรุณากรอกข้อมูลสำคัญให้ครบ" : "Please fill in all required fields",
  };

  const onSave = () => {
    if (!draft.id || !draft.name_th) return alert(t.alertSave);
    if (mode === "create") {
      add(draft);
    } else if (editingKey) {
      update(editingKey.type, editingKey.id, draft);
    }
    setMode(null);
  };

  return (
    <div className="fade-in-up" style={{ paddingBottom: "60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontWeight: 900, color: "var(--text-main)", margin: 0 }}>{t.title}</h1>
        <button className="btn-primary" onClick={() => { setDraft(emptyDraft()); setMode("create"); }}>
          {t.addBtn}
        </button>
      </div>

      {/* 🔍 Search & Filter */}
      <div className="glass-card" style={{ padding: 16, display: "flex", gap: 12, marginBottom: 24 }}>
        <input 
          placeholder={t.search} 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)" }}
        />
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value as SpeciesType | "all")}
          style={{ padding: "0 16px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)" }}
        >
          <option value="all">{t.allTypes}</option>
          <option value="animal">{t.animals}</option>
          <option value="plant">{t.plants}</option>
        </select>
      </div>

      {/* 📝 Editor Modal (ปรับให้กว้างขึ้นเพื่อรองรับ 2 ภาษา) */}
      {mode && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
          <div className="glass-card fade-in-up" style={{ maxWidth: 1000, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 40, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 24px 0", color: "var(--text-main)", borderBottom: "1px solid var(--border-color)", paddingBottom: 16 }}>
              {mode === "create" ? t.modalAdd : t.modalEdit}
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              
              {/* ข้อมูลพื้นฐาน */}
              <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, background: "var(--bg-color)", padding: 20, borderRadius: 16 }}>
                <Field label="ID (slug) *" value={draft.id} onChange={(v: string) => setDraft({...draft, id: v})} disabled={mode === "edit"} placeholder="เช่น black-swan" />
                <Field label="Type *" value={draft.type} onChange={(v: string) => setDraft({...draft, type: v as SpeciesType})} type="select" disabled={mode === "edit"} options={[{v:"animal",l:"Animal"},{v:"plant",l:"Plant"}]} />
                <Field label="Name (TH) *" value={draft.name_th} onChange={(v: string) => setDraft({...draft, name_th: v})} placeholder="ชื่อภาษาไทย" />
                <Field label="Name (EN) *" value={draft.name_en} onChange={(v: string) => setDraft({...draft, name_en: v})} placeholder="English Name" />
                <div style={{ gridColumn: "span 2" }}>
                  <Field label="Image Path *" value={draft.image} onChange={(v: string) => setDraft({...draft, image: v})} placeholder="/images/animals/xxx.jpg" />
                </div>
              </div>

              {/* 🟢 ส่วนคำอธิบายภาษาไทย */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontWeight: 800, color: "var(--primary-hover)", borderBottom: "1px solid var(--border-color)", paddingBottom: 8 }}>🇹🇭 ภาษาไทย (Thai)</div>
                <Field label="Short Desc (TH)" value={draft.short_description ?? ""} onChange={(v: string) => setDraft({...draft, short_description: v})} placeholder="คำอธิบายสั้นๆ..." />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>Full Description (TH)</label>
                  <textarea 
                    value={draft.description ?? ""} 
                    onChange={(e) => setDraft({...draft, description: e.target.value})} 
                    style={{...inputStyle, minHeight: 150, resize: "vertical"}} 
                    placeholder="รายละเอียดแบบเต็ม..."
                  />
                </div>
              </div>

              {/* 🟢 ส่วนคำอธิบายภาษาอังกฤษ */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontWeight: 800, color: "#2563eb", borderBottom: "1px solid var(--border-color)", paddingBottom: 8 }}>🇬🇧 ภาษาอังกฤษ (English)</div>
                <Field label="Short Desc (EN)" value={draft.short_description_en ?? ""} onChange={(v: string) => setDraft({...draft, short_description_en: v})} placeholder="Short description..." />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>Full Description (EN)</label>
                  <textarea 
                    value={draft.description_en ?? ""} 
                    onChange={(e) => setDraft({...draft, description_en: e.target.value})} 
                    style={{...inputStyle, minHeight: 150, resize: "vertical"}} 
                    placeholder="Full details..."
                  />
                </div>
              </div>

            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 40, justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: 24 }}>
              <button style={btnCancel} onClick={() => setMode(null)}>{t.btnCancel}</button>
              <button className="btn-primary" onClick={onSave} style={{ padding: "12px 32px", fontSize: "1.05rem" }}>{t.btnSave}</button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Table List */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-color)", textAlign: "left" }}>
              <th style={thStyle}>{t.thPreview}</th>
              <th style={thStyle}>{t.thName}</th>
              <th style={thStyle}>ID / Type</th>
              <th style={thStyle}>{t.thAction}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={`${item.type}-${item.id}`} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--primary-light)"} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                <td style={tdStyle}><img src={item.image} alt="" style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border-color)" }} /></td>
                <td style={tdStyle}>
                  {/* 🟢 แสดงแค่ชื่อเดียว ตามภาษาที่เลือก */}
                  <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "1.05rem" }}>
                    {lang === "th" ? item.name_th : item.name_en}
                  </div>
                </td>
                <td style={tdStyle}>
                  <code style={{ background: "var(--bg-color)", padding: "4px 8px", borderRadius: 6, fontSize: 12, border: "1px solid var(--border-color)", color: "var(--text-main)" }}>{item.id}</code>
                  {/* 🟢 แปลป้าย Animal/Plant ตามภาษาที่เลือก */}
                  <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 800, color: item.type === 'animal' ? "var(--primary-hover)" : "#d97706", marginTop: 8 }}>
                    {item.type === 'animal' ? (lang === 'th' ? '🐾 สัตว์' : '🐾 Animal') : (lang === 'th' ? '🌿 พืช' : '🌿 Plant')}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnSmall} onClick={() => { setDraft({...emptyDraft(), ...item}); setMode("edit"); setEditingKey({type:item.type, id:item.id}); }}>{t.editBtn}</button>
                    <button style={{...btnSmall, color:"#ef4444", borderColor: "#fecaca", background: "#fef2f2"}} onClick={() => { if(confirm(lang==="th"?`ต้องการลบ ${item.name_th} ใช่หรือไม่?`:`Delete ${item.name_en}?`)) remove(item.type, item.id); }}>{t.delBtn}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: "1.1rem" }}>{t.noData}</div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", options, disabled, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; options?: Array<{v: string; l: string}>; disabled?: boolean; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {type === "select" ? (
        <select disabled={disabled} value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
          {options?.map((o)=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input 
          disabled={disabled} 
          placeholder={placeholder} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          style={inputStyle} 
        />
      )}
    </div>
  );
}

const inputStyle = { padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "1rem", outline: "none", fontFamily: "inherit" };
const thStyle = { padding: "16px 24px", fontSize: 12, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase" as const };
const tdStyle = { padding: "16px 24px" };
const btnSmall = { padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: 13, transition: "all 0.2s" };
const btnCancel = { padding: "12px 24px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" };