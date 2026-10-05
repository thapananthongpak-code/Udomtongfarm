"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALE_COOKIE, localePath, otherLocale, type Dictionary, type Locale } from "@/i18n";
import { useSession } from "./SessionProvider";

type Props = { lang: Locale; siteName: string; labels: Dictionary["nav"] };

/** Stored so the proxy sends a returning visitor to the language they chose. */
function rememberLocale(lang: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export default function SiteHeader({ lang, siteName, labels }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  // Path without the language prefix, e.g. "/collection".
  const path = pathname.replace(/^\/(th|en)(?=\/|$)/, "") || "/";
  const target = otherLocale(lang);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/collection", label: labels.collection, active: path.startsWith("/collection") || path.startsWith("/species") },
    { href: "/about", label: labels.about, active: path.startsWith("/about") },
    { href: "/visit", label: labels.visit, active: path.startsWith("/visit") },
  ];

  const account =
    status === "member"
      ? { href: "/account", label: labels.account }
      : { href: "/login", label: labels.signIn };

  function switchLanguage(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    rememberLocale(target);
    setOpen(false);
    router.push(localePath(target, path) + window.location.search);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link href={localePath(lang)} className="font-serif text-xl tracking-tight" onClick={() => setOpen(false)}>
          {siteName}
        </Link>

        <nav aria-label={labels.menu} className="hidden items-center gap-8 text-[0.9375rem] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={localePath(lang, link.href)}
              aria-current={link.active ? "page" : undefined}
              className={`border-b py-1 transition-colors ${
                link.active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 text-[0.9375rem] md:flex">
          <a
            href={localePath(target, path)}
            hrefLang={target}
            lang={target}
            aria-label={labels.switchLanguageLabel}
            onClick={switchLanguage}
            className="text-muted transition-colors hover:text-ink"
          >
            {labels.switchLanguage}
          </a>
          <Link
            href={localePath(lang, account.href)}
            className={`btn btn-sm btn-quiet ${status === "loading" ? "invisible" : ""}`}
          >
            {account.label}
          </Link>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-quiet md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? labels.close : labels.menu}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label={labels.menu} className="border-t border-line bg-paper md:hidden">
          <ul className="shell divide-y divide-line py-2">
            {[...links, { ...account, active: false }].map((link) => (
              <li key={link.href}>
                <Link
                  href={localePath(lang, link.href)}
                  aria-current={link.active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 font-serif text-2xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={localePath(target, path)}
                hrefLang={target}
                lang={target}
                onClick={switchLanguage}
                className="block py-3.5 text-muted"
              >
                {labels.switchLanguage}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
