import { useEffect } from "react";
import { useT } from "@/i18n/hooks";

/** Sets the browser tab title and the page description for the current page. */
export function usePageMeta(title?: string, description?: string) {
  const t = useT();

  useEffect(() => {
    document.title = title ? `${title} | ${t.site.name}` : `${t.site.name} | ${t.site.tagline}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description ?? t.meta.home);
  }, [title, description, t]);
}
