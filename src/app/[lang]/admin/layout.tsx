import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localePath } from "@/i18n";
import { requireAdmin } from "@/lib/auth";

// Depends on who is signed in, so it is never prerendered.
export const dynamic = "force-dynamic";

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  await requireAdmin();
  const t = getDictionary(lang).admin;

  const links = [
    { href: "/admin", label: t.overview },
    { href: "/admin/species", label: t.species },
    { href: "/admin/site", label: t.site },
  ];

  return (
    <div className="shell pb-8 pt-10 md:pt-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink pb-4">
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <p className="eyebrow">{t.eyebrow}</p>
          <nav aria-label={t.eyebrow} className="flex gap-6 text-[0.9375rem]">
            {links.map((link) => (
              <Link key={link.href} href={localePath(lang, link.href)} className="text-muted transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href={localePath(lang)} className="link text-[0.875rem] text-muted">
          {t.backToSite}
        </Link>
      </div>
      <div className="pt-10">{children}</div>
    </div>
  );
}
