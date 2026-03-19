import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import type { SpeciesType } from "../types/species";

export default function SpeciesAdminList() {
  const items = useSpeciesStore((s) => s.items);
  const remove = useSpeciesStore((s) => s.remove);
  const resetToSeed = useSpeciesStore((s) => s.resetToSeed);
  const { lang } = useSettingsStore();

  const [tab, setTab] = useState<"all" | SpeciesType>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== "all") list = list.filter((x) => x.type === tab);

    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((x) => {
        const th = (x.name_th || "").toLowerCase();
        const en = (x.name_en || "").toLowerCase();
        const sci = (x.scientific_name || "").toLowerCase();
        const id = (x.id || "").toLowerCase();
        return (
          th.includes(query) ||
          en.includes(query) ||
          sci.includes(query) ||
          id.includes(query)
        );
      });
    }

    // sort by type then name_en
    return [...list].sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return (a.name_en || "").localeCompare(b.name_en || "");
    });
  }, [items, tab, q]);

  const counts = useMemo(() => {
    const animal = items.filter((x) => x.type === "animal").length;
    const plant = items.filter((x) => x.type === "plant").length;
    return { all: items.length, animal, plant };
  }, [items]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>{lang === "th" ? "จัดการสายพันธุ์" : "Admin: Species"}</h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/new" style={btnPrimary}>
            {lang === "th" ? "+ เพิ่มใหม่" : "+ Add new"}
          </Link>

          <button
            onClick={() => {
              const ok = confirm(lang === "th" ? "Reset ข้อมูลกลับเป็นค่าเริ่มต้น? (จะทับ localStorage)" : "Reset data to seed? (This will overwrite localStorage)");
              if (ok) resetToSeed();
            }}
            style={btnGhost}
          >
            {lang === "th" ? "รีเซ็ตข้อมูล" : "Reset to seed"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button style={pill(tab === "all")} onClick={() => setTab("all")}>
          {lang === "th" ? "ทั้งหมด" : "All"} ({counts.all})
        </button>
        <button style={pill(tab === "animal")} onClick={() => setTab("animal")}>
          {lang === "th" ? "สัตว์" : "Animals"} ({counts.animal})
        </button>
        <button style={pill(tab === "plant")} onClick={() => setTab("plant")}>
          {lang === "th" ? "พืช" : "Plants"} ({counts.plant})
        </button>

        <div style={{ flex: 1, minWidth: 260, display: "flex", justifyContent: "flex-end" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "th" ? "ค้นหาชื่อ/ID/ชื่อวิทยาศาสตร์..." : "Search name/id/scientific..."}
            style={input}
          />
        </div>
      </div>

      <div style={{ marginTop: 12, opacity: 0.75 }}>
        {lang === "th" ? `แสดง ${filtered.length} รายการ` : `Showing ${filtered.length} items`}
      </div>

      {/* Table */}
      <div style={{ marginTop: 14, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th style={th}>{lang === "th" ? "ประเภท" : "Type"}</th>
              <th style={th}>ID</th>
              <th style={th}>{lang === "th" ? "ชื่อภาษาไทย" : "Name (TH)"}</th>
              <th style={th}>{lang === "th" ? "ชื่อภาษาอังกฤษ" : "Name (EN)"}</th>
              <th style={th}>{lang === "th" ? "การจัดการ" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={`${x.type}-${x.id}`} style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                <td style={td}>
                  <span style={badge(x.type)}>{lang === "th" ? (x.type === "animal" ? "สัตว์" : "พืช") : x.type}</span>
                </td>
                <td style={td} title={x.id}>
                  {x.id}
                </td>
                <td style={td}>{x.name_th}</td>
                <td style={td}>{x.name_en}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link to={`/species/${x.type}/${x.id}`} style={linkBtn}>
                      {lang === "th" ? "ดู" : "View"}
                    </Link>
                    <Link to={`/admin/edit/${x.type}/${x.id}`} style={linkBtn}>
                      {lang === "th" ? "แก้ไข" : "Edit"}
                    </Link>
                    <button
                      style={dangerBtn}
                      onClick={() => {
                        const ok = confirm(lang === "th" ? `ลบ: ${x.type}/${x.id} ?` : `Delete: ${x.type}/${x.id} ?`);
                        if (ok) remove(x.type, x.id);
                      }}
                    >
                      {lang === "th" ? "ลบ" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td style={{ ...td, padding: 18 }} colSpan={5}>
                  {lang === "th" ? "ไม่พบข้อมูล" : "No data."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 12px",
  fontSize: 13,
  letterSpacing: 0.2,
};

const td: React.CSSProperties = {
  padding: "12px 12px",
  verticalAlign: "top",
};

const input: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.18)",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 12,
  background: "#111827",
  color: "white",
  fontWeight: 700,
};

const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "white",
  border: "1px solid rgba(0,0,0,0.18)",
  cursor: "pointer",
  fontWeight: 600,
};

const linkBtn: React.CSSProperties = {
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.16)",
  color: "#111827",
  background: "white",
  fontWeight: 600,
};

const dangerBtn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.16)",
  background: "#fee2e2",
  cursor: "pointer",
  fontWeight: 700,
};

function pill(active: boolean): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 999,
    border: active ? "1px solid #111827" : "1px solid rgba(0,0,0,0.18)",
    background: active ? "#111827" : "white",
    color: active ? "white" : "#111827",
    cursor: "pointer",
    fontWeight: 700,
  };
}

function badge(type: "animal" | "plant"): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: type === "animal" ? "#dbeafe" : "#dcfce7",
    color: "#111827",
  };
}