import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Newsreader, Noto_Serif_Thai } from "next/font/google";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/chat/ChatWidget";
import SessionProvider from "@/components/SessionProvider";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getDictionary, isLocale, locales } from "@/i18n";
import { CHAT_LIMITS, isChatConfigured } from "@/lib/chat/config";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

const plex = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${t.site.name} | ${t.site.tagline}`, template: `%s | ${t.site.name}` },
    description: t.meta.home,
    openGraph: {
      type: "website",
      siteName: t.site.name,
      locale: lang === "th" ? "th_TH" : "en_US",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/icons/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = { themeColor: "#f8f7f3" };

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} className={`${newsreader.variable} ${notoSerifThai.variable} ${plex.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {t.site.skip}
        </a>
        <SessionProvider>
          <SiteHeader lang={lang} siteName={t.site.name} labels={t.nav} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter lang={lang} />
          {isChatConfigured && (
            <ChatWidget
              lang={lang}
              labels={t.chat}
              limits={{ messageLength: CHAT_LIMITS.messageLength, history: CHAT_LIMITS.history }}
            />
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
