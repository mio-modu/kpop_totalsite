import type { Metadata, Viewport } from "next";
import { Archivo, Black_Han_Sans, Gothic_A1, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { adsConfigured, ads } from "@/lib/ads";
import { siteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";

// Archivo carries a width axis — the wide cut gives the headlines their poster feel.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Hangul at poster scale. Used sparingly and always smaller than the Latin.
const blackHan = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-han",
  display: "swap",
});

// Hangul for labels and body — the words a fan meets on the booking screen.
const gothicA1 = Gothic_A1({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-gothic-a1",
  display: "swap",
});

// The data voice: verification dates, platform codes, step timings.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.headline} · ${site.name}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.headline} · ${site.name}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Rendered only once a token exists. Next drops an undefined entry, so an
  // unset variable leaves no tag rather than an empty one.
  verification: {
    ...(site.verifyGoogle ? { google: site.verifyGoogle } : {}),
    ...(site.verifyNaver
      ? { other: { "naver-site-verification": site.verifyNaver } }
      : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Dark is the resting state now, so the bare value has to be the dark one —
  // a browser that reads only the first entry would otherwise paint its chrome
  // paper-coloured above a black page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Written here rather than through metadata.alternates: a page that
            declares its own `alternates` for a canonical replaces the whole
            object, and every page here declares one — so the feed link would
            survive on none of them. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${site.name} — guides, newest verification first`}
          href="/feed.xml"
        />
        {/* Applied before paint so a pinned theme never flashes the wrong one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kpopgo-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${archivo.variable} ${blackHan.variable} ${gothicA1.variable} ${jetbrains.variable}`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
          style={{ background: "var(--ju)", color: "var(--on-ju)" }}
        >
          Skip to content
        </a>
        <JsonLd data={siteJsonLd()} />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        {adsConfigured ? (
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.client}`}
          />
        ) : null}
        {site.gaId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}');`,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
