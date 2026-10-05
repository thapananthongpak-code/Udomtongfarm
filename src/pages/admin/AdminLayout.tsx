import { Link, Outlet } from "react-router-dom";
import NotFoundContent from "@/components/NotFoundContent";
import PageLoading from "@/components/PageLoading";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { usePageMeta } from "@/lib/usePageMeta";
import { useSession } from "@/state/session";

/**
 * The frame around the admin dashboard. Everyone except admins sees "not found".
 * This only hides the pages: the database itself refuses changes from anyone who is not an admin.
 */
export default function AdminLayout() {
  const lang = useLang();
  const t = useT().admin;
  const { status, profile } = useSession();
  usePageMeta(t.title);

  if (status === "loading") return <PageLoading />;
  if (profile?.role !== "admin") return <NotFoundContent />;

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
          <nav aria-label={t.eyebrow} className="flex flex-wrap gap-x-6 gap-y-1 text-[0.9375rem]">
            {links.map((link) => (
              <Link key={link.href} to={localePath(lang, link.href)} className="text-muted transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link to={localePath(lang)} className="link text-[0.875rem] text-muted">
          {t.backToSite}
        </Link>
      </div>
      <div className="pt-10">
        <Outlet />
      </div>
    </div>
  );
}
