import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "../lib/site";

type Meta = {
  /** Page title without the site name. Omit on the home page. */
  title?: string;
  description: string;
  /** Absolute URL or a path under /public. */
  image?: string;
  type?: "website" | "article";
};

const SITE_NAME = "Udomtong Farm";
const DEFAULT_IMAGE = "/og-image.jpg";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Updates the document title plus description, canonical and share tags for the current page. */
export function useDocumentMeta({ title, description, image, type = "website" }: Meta) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Nature Journal`;
    const url = `${SITE_URL}${pathname}`;
    const imagePath = image ?? DEFAULT_IMAGE;
    const imageUrl = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", imageUrl);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
    setCanonical(url);
  }, [title, description, image, type, pathname]);
}
