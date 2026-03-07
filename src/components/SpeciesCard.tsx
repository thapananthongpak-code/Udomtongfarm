import { Link } from "react-router-dom";
import type { Species } from "../types/species";
import { useSettingsStore } from "../store/settingsStore";

type Props = {
  species: Species;
};

export default function SpeciesCard({ species }: Props) {
  const { lang } = useSettingsStore();

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
      <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
        <img
          src={species.image}
          alt={species.name_en}
          className="hover-zoom-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: "1rem" }}>
        <span style={{
          background: species.type === "animal" ? "var(--primary-light)" : "#fef3c7",
          color: species.type === "animal" ? "var(--primary-hover)" : "#d97706",
          padding: "3px 10px",
          borderRadius: 8,
          fontSize: "0.75rem",
          fontWeight: 800,
          display: "inline-block",
          marginBottom: 8,
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

        <div style={{ marginTop: 12, color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.85rem", textAlign: "right" }}>
          อ่านเพิ่มเติม →
        </div>
      </div>
    </Link>
  );
}
