import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Species, SpeciesType } from "../types/species";
import { useSpeciesStore } from "../store/speciesStore";

type RefRow = { title: string; url: string };

function emptySpecies(type: SpeciesType): Species {
  return {
    id: "",
    type,
    name_th: "",
    name_en: "",
    scientific_name: "",
    short_description: "",
    description: "",
    image: type === "animal" ? "/images/animals/" : "/images/plants/",
    tags: [],
    available: true,
    quantity: 0,
    references: [{ title: "Wikipedia", url: "" }],
  };
}

export default function SpeciesAdminEdit() {
  const nav = useNavigate();
  const { type, id } = useParams();

  // 🚀 แก้ไข: ดึง add และ update มาใช้แทน upsert
  const items = useSpeciesStore((s) => s.items);
  const add = useSpeciesStore((s) => s.add);
  const update = useSpeciesStore((s) => s.update);

  const mode: "new" | "edit" = id ? "edit" : "new";
  const initialType: SpeciesType = (type as SpeciesType) || "animal";

  const existing = useMemo(() => {
    if (!type || !id) return null;
    return items.find((x) => x.type === type && x.id === id) || null;
  }, [items, type, id]);

  const [form, setForm] = useState<Species>(() => existing ?? emptySpecies(initialType));

  const [refs, setRefs] = useState<RefRow[]>(
    (existing?.references?.length ? existing.references : form.references).map((r) => ({
      title: r.title,
      url: r.url,
    }))
  );

  function set<K extends keyof Species>(key: K, value: Species[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    const cleanId = form.id.trim();
    if (!cleanId) return alert("id ห้ามว่าง");
    if (!/^[a-z0-9-]+$/.test(cleanId)) {
      return alert('id ต้องเป็น lowercase + ตัวเลข + "-" เท่านั้น เช่น call-duck');
    }
    if (!form.name_th.trim()) return alert("name_th ห้ามว่าง");
    if (!form.name_en.trim()) return alert("name_en ห้ามว่าง");
    if (!form.image.trim()) return alert("image ห้ามว่าง");

    const cleanRefs = refs
      .map((r) => ({ title: r.title.trim(), url: r.url.trim() }))
      .filter((r) => r.title && r.url);

    if (cleanRefs.length === 0) {
      return alert("ต้องมี reference อย่างน้อย 1 อัน");
    }

    const payload: Species = {
      ...form,
      id: cleanId,
      scientific_name: form.scientific_name?.trim() || undefined,
      references: cleanRefs,
    };

    // 🚀 แก้ไขการบันทึกข้อมูล: แยกโหมดสร้างใหม่ กับ โหมดแก้ไข
    if (mode === "new") {
      // เช็ค id ซ้ำก่อนเพิ่ม
      const isDup = items.some(x => x.type === payload.type && x.id === payload.id);
      if (isDup) return alert("ID นี้มีอยู่แล้วในระบบ กรุณาใช้ชื่ออื่น");
      add(payload);
    } else {
      // โหมดแก้ไข
      update(initialType, id!, payload);
    }

    nav("/admin");
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>
          {mode === "new" ? "Add new species" : `Edit: ${form.type}/${form.id}`}
        </h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin" style={btnGhost}>← Back</Link>
          <button onClick={onSave} style={btnPrimary}>Save</button>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={label}>Type</label>
          <select
            value={form.type}
            onChange={(e) => {
              const t = e.target.value as SpeciesType;
              set("type", t);
              set("image", t === "animal" ? "/images/animals/" : "/images/plants/");
            }}
            style={input}
            disabled={mode === "edit"}
          >
            <option value="animal">animal</option>
            <option value="plant">plant</option>
          </select>
        </div>

        <div>
          <label style={label}>ID (slug)</label>
          <input
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder='เช่น "call-duck"'
            style={input}
            disabled={mode === "edit"}
          />
        </div>

        <div>
          <label style={label}>Name (TH)</label>
          <input value={form.name_th} onChange={(e) => set("name_th", e.target.value)} style={input} />
        </div>

        <div>
          <label style={label}>Name (EN)</label>
          <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} style={input} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={label}>Scientific name (optional)</label>
          <input value={form.scientific_name || ""} onChange={(e) => set("scientific_name", e.target.value)} placeholder='เช่น "Amazona spp."' style={input} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={label}>Image path</label>
          <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder='/images/animals/call-duck.jpg' style={input} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={label}>Short description</label>
          <textarea value={form.short_description} onChange={(e) => set("short_description", e.target.value)} rows={2} style={textarea} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={label}>Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={6} style={textarea} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ ...label, margin: 0 }}>References</label>
            <button type="button" onClick={() => setRefs((p) => [...p, { title: "", url: "" }])} style={btnGhostSmall}>+ Add reference</button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {refs.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "220px 1fr auto", gap: 10 }}>
                <input value={r.title} onChange={(e) => setRefs((p) => p.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} placeholder="Title" style={input} />
                <input value={r.url} onChange={(e) => setRefs((p) => p.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))} placeholder="https://..." style={input} />
                <button type="button" onClick={() => setRefs((p) => p.filter((_, idx) => idx !== i))} style={dangerBtn}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 14 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Preview</div>
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.12)" }}>
              <img src={form.image} alt="preview" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} 
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} 
              />
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{form.name_en || "Name EN"}</div>
                <div style={{ opacity: 0.75 }}>{form.name_th || "Name TH"}</div>
                {form.scientific_name && <div style={{ fontStyle: "italic", opacity: 0.7, marginTop: 6 }}>{form.scientific_name}</div>}
                <div style={{ marginTop: 10 }}>{form.short_description || "Short description..."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {existing === null && mode === "edit" && (
        <div style={{ marginTop: 14, color: "#b91c1c" }}>ไม่พบข้อมูลเดิม (อาจถูกลบไปแล้ว)</div>
      )}
    </div>
  );
}

const label: React.CSSProperties = { fontWeight: 800, marginBottom: 6, display: "block" };
const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.18)", outline: "none" };
const textarea: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.18)", outline: "none", resize: "vertical", fontFamily: "inherit" };
const btnPrimary: React.CSSProperties = { padding: "10px 14px", borderRadius: 12, background: "#111827", color: "white", fontWeight: 800, border: "none", cursor: "pointer" };
const btnGhost: React.CSSProperties = { textDecoration: "none", padding: "10px 14px", borderRadius: 12, background: "white", border: "1px solid rgba(0,0,0,0.18)", cursor: "pointer", fontWeight: 700, color: "#111827" };
const btnGhostSmall: React.CSSProperties = { padding: "8px 12px", borderRadius: 12, background: "white", border: "1px solid rgba(0,0,0,0.18)", cursor: "pointer", fontWeight: 800 };
const dangerBtn: React.CSSProperties = { padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.16)", background: "#fee2e2", cursor: "pointer", fontWeight: 800 };