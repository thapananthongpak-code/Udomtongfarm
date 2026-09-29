import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { animals } from "./src/data/animals";
import { plants } from "./src/data/plants";

const SITE_URL = "https://udomtongfarm.com";
const STATIC_ROUTES = ["/", "/encyclopedia", "/gallery", "/compare", "/about", "/visit"];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Emits sitemap.xml, robots.txt and an RSS feed built from the species data. */
function seoFiles(): Plugin {
  return {
    name: "udomtong-seo-files",
    apply: "build",
    generateBundle() {
      const species = [...animals, ...plants];
      const today = new Date().toISOString().slice(0, 10);

      const urls = [
        ...STATIC_ROUTES.map((path) => ({ loc: `${SITE_URL}${path}`, priority: path === "/" ? "1.0" : "0.8" })),
        ...species.map((sp) => ({ loc: `${SITE_URL}/species/${sp.type}/${sp.id}`, priority: "0.7" })),
      ];
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map((u) => `  <url><loc>${xmlEscape(u.loc)}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`)
          .join("\n") +
        `\n</urlset>\n`;

      const items = species
        .map((sp) => {
          const link = `${SITE_URL}/species/${sp.type}/${sp.id}`;
          return [
            "    <item>",
            `      <title>${xmlEscape(sp.name_en)}</title>`,
            `      <link>${link}</link>`,
            `      <guid isPermaLink="true">${link}</guid>`,
            `      <category>${sp.type === "animal" ? "Animals" : "Plants"}</category>`,
            `      <description>${xmlEscape(sp.short_description_en ?? sp.short_description)}</description>`,
            "    </item>",
          ].join("\n");
        })
        .join("\n");
      const feed =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<rss version="2.0">\n  <channel>\n` +
        `    <title>Udomtong Farm Nature Journal</title>\n` +
        `    <link>${SITE_URL}/</link>\n` +
        `    <description>Field notes on the rare animals and plants of Udomtong Farm, Chaiyaphum.</description>\n` +
        `    <language>en</language>\n` +
        `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
        `${items}\n  </channel>\n</rss>\n`;

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "feed.xml", source: feed });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoFiles()],
  build: {
    sourcemap: false,
  },
});
