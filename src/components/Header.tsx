import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Bookmark, Languages, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useT } from "../lib/i18n";
import { useLibrary } from "../store/library";
import { usePrefs } from "../store/prefs";
import { useUI } from "../store/ui";
import { LogoMark } from "./Icons";

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

export default function Header() {
  const t = useT();
  const theme = usePrefs((s) => s.theme);
  const lang = usePrefs((s) => s.lang);
  const toggleTheme = usePrefs((s) => s.toggleTheme);
  const toggleLang = usePrefs((s) => s.toggleLang);
  const savedCount = useLibrary((s) => s.saved.length);
  const openSearch = useUI((s) => s.openSearch);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 8);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape while the mobile menu is open.
  useEffect(() => {
    document.documentElement.classList.toggle("has-menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const links = [
    { to: "/", label: t.nav.home, end: true },
    { to: "/encyclopedia", label: t.nav.encyclopedia },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/compare", label: t.nav.compare },
    { to: "/about", label: t.nav.about },
    { to: "/visit", label: t.nav.visit },
  ];
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}>
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={closeMenu} aria-label={`${t.brand}, ${t.nav.home}`}>
          <LogoMark size={38} />
          <span className="brand__text">
            <span className="brand__name">{t.brand}</span>
            <span className="brand__sub">{t.brandSub}</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="site-nav__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button type="button" className="search-trigger" onClick={openSearch} aria-label={t.nav.searchHint}>
            <Search size={17} aria-hidden />
            <span className="search-trigger__label">{t.nav.search}</span>
            <kbd className="kbd search-trigger__kbd">{IS_MAC ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <NavLink to="/saved" className="icon-btn icon-btn--badge" aria-label={`${t.nav.saved} (${savedCount})`} title={t.nav.saved}>
            <Bookmark size={19} aria-hidden />
            {savedCount > 0 && <span className="badge-count">{savedCount > 99 ? "99+" : savedCount}</span>}
          </NavLink>
          <button type="button" className="icon-btn lang-toggle" onClick={toggleLang} aria-label={t.nav.switchLang} title={t.nav.switchLang}>
            {lang === "en" ? "ไทย" : "EN"}
          </button>
          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
            title={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
          >
            {theme === "dark" ? <Sun size={19} aria-hidden /> : <Moon size={19} aria-hidden />}
          </button>
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
          >
            {menuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Mobile">
          <ul>
            {[...links, { to: "/saved", label: t.nav.saved, end: false }].map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="mobile-menu__link" onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__prefs">
          <button type="button" className="btn btn--secondary" onClick={toggleLang}>
            <Languages size={18} aria-hidden /> {lang === "en" ? "ภาษาไทย" : "English"}
          </button>
          <button type="button" className="btn btn--secondary" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            {theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
          </button>
        </div>
      </div>
    </header>
  );
}
