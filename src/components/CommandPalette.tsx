import { useId, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Bookmark, Clock, GitCompare, Home, Images, Info, MapPin, Search } from "lucide-react";
import { useT } from "../lib/i18n";
import { SPECIES_BY_ID, ALL_SPECIES, searchSpecies, speciesName, speciesPath } from "../lib/species";
import { useLibrary } from "../store/library";
import { usePrefs } from "../store/prefs";
import { useUI } from "../store/ui";
import type { Species } from "../types/species";
import Modal from "./Modal";
import { SpeciesImage } from "./SpeciesBits";

type Item =
  | { kind: "page"; key: string; label: string; to: string; icon: ReactNode }
  | { kind: "species"; key: string; label: string; to: string; sp: Species };

export default function CommandPalette() {
  const open = useUI((s) => s.searchOpen);
  const close = useUI((s) => s.closeSearch);
  const t = useT();
  return (
    <Modal open={open} onClose={close} label={t.search.label} className="modal--palette">
      <PaletteContent onDone={close} />
    </Modal>
  );
}

function PaletteContent({ onDone }: { onDone: () => void }) {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const recent = useLibrary((s) => s.recent);
  const navigate = useNavigate();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const pages: Item[] = useMemo(
    () => [
      { kind: "page", key: "home", label: t.nav.home, to: "/", icon: <Home size={18} /> },
      { kind: "page", key: "encyclopedia", label: t.nav.encyclopedia, to: "/encyclopedia", icon: <BookOpen size={18} /> },
      { kind: "page", key: "gallery", label: t.nav.gallery, to: "/gallery", icon: <Images size={18} /> },
      { kind: "page", key: "compare", label: t.nav.compare, to: "/compare", icon: <GitCompare size={18} /> },
      { kind: "page", key: "saved", label: t.nav.saved, to: "/saved", icon: <Bookmark size={18} /> },
      { kind: "page", key: "about", label: t.nav.about, to: "/about", icon: <Info size={18} /> },
      { kind: "page", key: "visit", label: t.nav.visit, to: "/visit", icon: <MapPin size={18} /> },
    ],
    [t],
  );

  const groups = useMemo(() => {
    const toItem = (sp: Species): Item => ({ kind: "species", key: sp.id, label: speciesName(sp, lang), to: speciesPath(sp), sp });
    const q = query.trim().toLowerCase();
    let raw: { title: string; items: Item[] }[];
    if (!q) {
      const recentSpecies = recent.map((id) => SPECIES_BY_ID.get(id)).filter((sp): sp is Species => !!sp).slice(0, 5);
      raw = [
        { title: t.search.recent, items: recentSpecies.map(toItem) },
        { title: t.search.pages, items: pages },
      ];
    } else {
      raw = [
        { title: t.search.species, items: searchSpecies(ALL_SPECIES, q).slice(0, 8).map(toItem) },
        { title: t.search.pages, items: pages.filter((p) => p.label.toLowerCase().includes(q)) },
      ];
    }
    // Give every item its position in the flattened list for keyboard navigation.
    let position = 0;
    return raw
      .filter((g) => g.items.length > 0)
      .map((g) => ({ ...g, items: g.items.map((item) => ({ item, i: position++ })) }));
  }, [query, recent, lang, pages, t]);

  const flat = groups.flatMap((g) => g.items.map((x) => x.item));
  const activeIndex = Math.min(active, Math.max(0, flat.length - 1));

  function go(item: Item) {
    onDone();
    navigate(item.to);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((activeIndex + 1) % Math.max(1, flat.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((activeIndex - 1 + flat.length) % Math.max(1, flat.length));
    } else if (event.key === "Enter" && flat[activeIndex]) {
      event.preventDefault();
      go(flat[activeIndex]);
    }
  }

  return (
    <div className="palette" onKeyDown={onKeyDown}>
      <div className="palette__field">
        <Search size={20} aria-hidden />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder={t.search.placeholder}
          aria-label={t.search.label}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={flat[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="kbd">Esc</kbd>
      </div>

      <div className="palette__results" id={listId} role="listbox" aria-label={t.search.label}>
        {flat.length === 0 && <p className="palette__empty">{t.search.noResults(query.trim())}</p>}
        {groups.map((group) => (
          <div key={group.title} role="group" aria-label={group.title} className="palette__group">
            <p className="palette__group-title" aria-hidden>
              {group.title === t.search.recent && <Clock size={13} />}
              {group.title}
            </p>
            {group.items.map(({ item, i }) => {
              return (
                <div
                  key={`${item.kind}-${item.key}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`palette__item${i === activeIndex ? " is-active" : ""}`}
                  onMouseMove={() => i !== activeIndex && setActive(i)}
                  onClick={() => go(item)}
                >
                  {item.kind === "species" ? (
                    <span className="palette__thumb">
                      <SpeciesImage sp={item.sp} />
                    </span>
                  ) : (
                    <span className="palette__icon">{item.icon}</span>
                  )}
                  <span className="palette__text">
                    <span className="palette__label">{item.label}</span>
                    {item.kind === "species" && item.sp.scientific_name && (
                      <span className="palette__sub">{item.sp.scientific_name}</span>
                    )}
                  </span>
                  <ArrowRight size={16} className="palette__go" aria-hidden />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="palette__hints" aria-hidden>
        <span>
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd> {t.search.hintNavigate}
        </span>
        <span>
          <kbd className="kbd">Enter</kbd> {t.search.hintOpen}
        </span>
        <span>
          <kbd className="kbd">Esc</kbd> {t.search.hintClose}
        </span>
      </div>
    </div>
  );
}
