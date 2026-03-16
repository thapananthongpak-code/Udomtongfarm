import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import type { Species } from "../types/species";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SpotlightSearch({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { items } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const results = useMemo<Species[]>(() => {
    if (!query.trim()) return items.slice(0, 8);
    const q = query.toLowerCase();
    return items
      .filter(
        (x) =>
          x.name_th.toLowerCase().includes(q) ||
          x.name_en.toLowerCase().includes(q) ||
          (x.scientific_name || "").toLowerCase().includes(q) ||
          (x.tags || []).some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, items]);

  function go(item: Species) {
    navigate(`/species/${item.type}/${item.id}`);
    onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => {
          const next = Math.min(s + 1, results.length - 1);
          scrollToItem(next);
          return next;
        });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => {
          const next = Math.max(s - 1, 0);
          scrollToItem(next);
          return next;
        });
      }
      if (e.key === "Enter" && results[selected]) {
        go(results[selected]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selected]); // eslint-disable-line

  function scrollToItem(idx: number) {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[idx] as HTMLElement;
    if (item) item.scrollIntoView({ block: "nearest" });
  }

  if (!open) return null;

  return (
    <div className="spotlight-overlay" onClick={onClose} role="dialog" aria-modal>
      <div
        className="spotlight-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="spotlight-input-wrap">
          <IconSearch size={20} />
          <input
            ref={inputRef}
            className="spotlight-input"
            placeholder={lang === "th" ? "ค้นหาสายพันธุ์ เช่น หงส์, สักทอง..." : "Search species, e.g. Swan, Teak..."}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="spotlight-esc" onClick={onClose}>Esc</kbd>
        </div>

        {/* Results */}
        <div className="spotlight-results" ref={listRef}>
          {results.length === 0 ? (
            <div className="spotlight-empty">
              {lang === "th" ? "🔍 ไม่พบสายพันธุ์ที่ตรงกัน" : "🔍 No species found"}
            </div>
          ) : (
            results.map((item, i) => {
              const name = lang === "th" ? item.name_th : item.name_en;
              return (
                <button
                  key={item.id}
                  className={`spotlight-item${i === selected ? " selected" : ""}`}
                  onClick={() => go(item)}
                  onMouseEnter={() => setSelected(i)}
                >
                  <img src={item.image} alt={name} className="spotlight-thumb" />
                  <div className="spotlight-item-info">
                    <span className="spotlight-item-name">{name}</span>
                    {item.scientific_name && (
                      <span className="spotlight-item-sci">{item.scientific_name}</span>
                    )}
                  </div>
                  <span className={`spotlight-type-badge spotlight-type-${item.type}`}>
                    {item.type === "animal" ? "🐾 สัตว์" : "🌿 พืช"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="spotlight-footer">
          <span><kbd>↑↓</kbd> เลื่อน</span>
          <span><kbd>Enter</kbd> เปิด</span>
          <span><kbd>Esc</kbd> ปิด</span>
          <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "0.78rem" }}>
            {results.length} {lang === "th" ? "รายการ" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}

function IconSearch({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
