import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { seedSpecies } from "./src/data/species";

const STATIC_PATHS = ["", "/collection", "/about", "/visit", "/privacy"];
const LOCALES = ["th", "en"];

/** Writes sitemap.xml and robots.txt into the build, listing every page in both languages. */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: "udomtong-seo-files",
    apply: "build",
    generateBundle() {
      const paths = [...STATIC_PATHS, ...seedSpecies.filter((sp) => sp.published).map((sp) => `/species/${sp.id}`)];
      const urls = paths.flatMap((path) => LOCALES.map((lang) => `  <url><loc>${siteUrl}/${lang}${path}</loc></url>`));

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /auth/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

/**
 * Runs api/chat.ts during `npm run dev`, so the chat works locally the same way it does on Vercel.
 * In production Vercel runs that file itself and this plugin is not used.
 */
function chatApiInDev(): Plugin {
  return {
    name: "udomtong-chat-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          const handlers = await server.ssrLoadModule("/api/chat.ts");
          const handler = handlers[req.method ?? "GET"];
          if (typeof handler !== "function") {
            res.statusCode = 405;
            res.end();
            return;
          }

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const request = new Request(`http://${req.headers.host}/api/chat`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
          });

          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, name) => res.setHeader(name, value));
          if (response.body) {
            for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) res.write(chunk);
          }
          res.end();
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.end();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Make the settings in .env.local visible to api/chat.ts when it runs inside the dev server.
  for (const name of ["GEMINI_API_KEY", "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"]) {
    if (env[name] && !process.env[name]) process.env[name] = env[name];
  }
  const siteUrl = (env.VITE_SITE_URL || "https://udomtongfarm.vercel.app").replace(/\/+$/, "");

  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl), chatApiInDev()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    // The main bundle is a little over the default 500 kB warning line, mostly the Supabase client.
    build: { sourcemap: false, chunkSizeWarningLimit: 600 },
  };
});
