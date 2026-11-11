import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { adsConfigured, ads } from "@/lib/ads";
import { siteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";

// Archivo carries a width axis — the wide cut gives the headlines their poster feel.
/*
 * The `vietnamese` subset is here and `latin-ext` is not, which is the whole
 * decision. Google splits its webfonts by unicode-range, so a subset listed
 * here is fetched only by a page that actually sets a character in it: an
 * English reader downloads exactly what they downloaded before. Without it,
 * every ơ, ư, đ and tone mark on the Vietnamese pages drops to a system
 * fallback mid-word — the one typographic failure that looks like a typo
 * rather than like a different font.
 */
const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/**
 * The Hangul faces are self-hosted subsets, not Google imports.
 *
 * A Hangul font carries 11,172 syllables; this site sets 241 of them, because
 * every Korean word on it is one from a real booking screen and that is a
 * closed list. Imported whole they came to 1.6MB — 98% of the page weight, to
 * draw nothing. `subsets: ["latin"]` did not help: it governs which ranges are
 * preloaded, not which exist, and the browser fetched the Korean ranges the
 * moment Korean rendered.
 *
 * Regenerate with `node scripts/subset-fonts.mjs` after adding Korean text.
 * scripts/fonts.test.mjs fails if the content outgrows app/fonts/covered.json,
 * which is the only way this rots quietly — a new syllable would otherwise
 * render in the fallback face and nobody would notice.
 */
const blackHan = localFont({
  src: "./fonts/black-han-sans-400.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-black-han",
  display: "swap",
});

const gothicA1 = localFont({
  src: [
    { path: "./fonts/gothic-a1-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/gothic-a1-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/gothic-a1-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-gothic-a1",
  display: "swap",
});

// The data voice: verification dates, platform codes, step timings.
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.headline} · ${site.name}`,
    /*
     * No ` · KPOPGO` on inner pages, and the reason is written a few lines
     * above in lib/site.ts: this site submitted a home title ending in its
     * own slogan and Google rendered it as plain "KPOPGO". Search discards
     * words it judges useless to a searcher, and on a site nobody yet
     * searches by name the brand is exactly that — nine characters of a
     * sixty-character budget, spent on the one word a reader already has.
     *
     * The brand is not lost: `openGraph.siteName` still declares it, which
     * is what search reads for the site name it shows above a result, and
     * the domain is on that line anyway.
     */
    template: "%s",
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
        {/*
          Measurement, behind one gate.

          Both tags used to load unconditionally, and on the first day Clarity
          was live its session list was two HeadlessChrome visits from the
          United States, a minute apart, with no human in either. GA4 drops
          crawlers that identify themselves — a headless browser that does not
          is counted as a reader, which on a site measured in tens of users a
          day is not a rounding error but the dataset.

          `navigator.webdriver` is the signal an automated browser is required
          by the WebDriver specification to set, so it catches the honest ones:
          Playwright, Puppeteer, Selenium, and the SEO and uptime tools built
          on them. It does not catch a crawler that deliberately hides, and it
          is not meant to — the purpose is a count that reflects readers, not
          an access control.

          The gate wraps both tags rather than GA4 alone, because a bot
          excluded from one and recorded by the other gives two numbers that
          can never be reconciled. `gtag` is assigned to `window` deliberately:
          inside this closure a bare function declaration would no longer be
          global, and anything that later sends an event would find nothing.
        */}
        {site.gaId || site.clarityId ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){if(navigator.webdriver)return;${
                site.gaId
                  ? `var g=document.createElement("script");g.async=1;g.src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}";document.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${site.gaId}');`
                  : ""
              }${
                site.clarityId
                  ? `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${site.clarityId}");`
                  : ""
              }})();`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
