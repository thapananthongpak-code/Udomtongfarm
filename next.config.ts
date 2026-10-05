import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    // Photos uploaded from the admin area live in Supabase Storage.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  // Paths from earlier versions of the site. The proxy adds the language prefix afterwards.
  async redirects() {
    return [
      { source: "/species/:type(animal|plant)/:id", destination: "/species/:id", permanent: true },
      { source: "/:lang(th|en)/species/:type(animal|plant)/:id", destination: "/:lang/species/:id", permanent: true },
      { source: "/encyclopedia", destination: "/collection", permanent: true },
      { source: "/gallery", destination: "/collection", permanent: true },
      { source: "/compare", destination: "/collection", permanent: true },
      { source: "/saved", destination: "/account", permanent: false },
      { source: "/wishlist", destination: "/account", permanent: false },
      { source: "/profile", destination: "/account", permanent: false },
      // Accounts are Google-only now, so the old password pages lead to sign-in.
      { source: "/:lang(th|en)/:page(register|forgot-password|reset-password)", destination: "/:lang/login", permanent: false },
      { source: "/:page(register|forgot|forgot-password|reset-password)", destination: "/login", permanent: false },
      { source: "/contact", destination: "/visit", permanent: true },
      { source: "/map", destination: "/visit", permanent: true },
      { source: "/faq", destination: "/visit", permanent: true },
    ];
  },
};

export default nextConfig;
