import { ImageResponse } from "next/og";
import { getGuide } from "@/content/guides";
import { localesWithContent, translationsIn } from "@/content/translations";
import { LOCALES, localeFromSegment, segmentOf, translatedDisplayStatus } from "@/lib/i18n";
import { site } from "@/lib/site";

// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return localesWithContent().map((locale) => ({ lang: segmentOf(locale) }));
}

/**
 * The share card for a translated edition — one per locale, and until this
 * existed there was none at all.
 *
 * 203 of the site's 234 pages had no `og:image`: every translated guide and
 * every language index. That is the whole of the site outside English, and it
 * is the half where the gap costs most. This site's early distribution is a
 * link pasted into a fan community, so the card is the first impression far
 * more often than any page is — and a link pasted into a Japanese or
 * Vietnamese community is precisely a translated one.
 *
 * **It carries no prose, and that is a constraint rather than a shortcut.**
 * `ImageResponse` ships a Latin font, which is why the English cards are
 * documented as Latin-only: Hangul renders as tofu, and so would Japanese,
 * Chinese or Thai. Setting a translated title here would need those fonts in
 * the build. Pointing these pages at the English card instead was the other
 * obvious option and is worse — this repository already refuses to put English
 * artwork on a translated page, on the grounds that a page which funnels a
 * reader into English is worse than one that stops honestly, and a share card
 * seen *before* the click misrepresents the page's language to exactly the
 * reader who chose it for the language.
 *
 * So the card says the things that are true in any language: which edition it
 * is, how many guides it has, what evidence they rest on, and that a machine
 * made the translation. That last line is the one a reader deserves before
 * the click rather than after it, which makes this the right surface for it.
 *
 * One card per locale rather than per guide, because none of it is per-guide:
 * 190 generations would produce nineteen identical images ten times over. The
 * translated guide pages point their `openGraph.images` here.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = localeFromSegment(lang);
  const info = locale ? LOCALES[locale] : undefined;
  const entries = locale ? translationsIn(locale) : [];

  /**
   * The weakest rung across the edition wins, the way the site card does it.
   *
   * A card that speaks for nineteen pages must not claim what only the best of
   * them could. `translatedDisplayStatus` is the one to ask rather than the
   * source's own status: a translation that has gone behind its source cannot
   * inherit a healthy seal, and that asymmetry is the point of the whole
   * freshness system — it would be undone by a card that read the English.
   */
  const RUNGS = ["stale", "draft", "sourced", "reported", "verified"] as const;
  const weakest = entries.reduce((worst, tr) => {
    const guide = getGuide(tr.slug);
    if (!guide) return worst;
    return Math.min(worst, RUNGS.indexOf(translatedDisplayStatus(guide, tr)));
  }, RUNGS.length - 1);
  const label = RUNGS[weakest] ?? "sourced";
  const stamp = label === "stale" ? "EXPIRED" : label.toUpperCase();

  // Every translation today is machine-assisted, and the card must not say
  // otherwise if one is ever reviewed — so it is read off the entries rather
  // than written here. `native-reviewed` only shows when every one of them is.
  const reviewed = entries.length > 0 && entries.every((t) => t.review === "native-reviewed");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          padding: "68px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#f6f3ee",
            }}
          >
            KPOP<span style={{ color: "#ff3b2e" }}>GO</span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "9px 18px",
              borderRadius: 999,
              border: "3px solid #ff3b2e",
              color: "#ff3b2e",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            {stamp}
          </div>
        </div>

        {/*
          The locale tag, in Latin, as the identifying element. `ZH-HANT` and
          `PT-BR` are the long ones, so the size steps down rather than letting
          them run past the frame.
        */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              fontSize: (info?.tag.length ?? 2) > 5 ? 112 : 148,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "#f6f3ee",
            }}
          >
            {(info?.tag ?? "").toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "rgba(246,243,238,0.66)",
            }}
          >
            {info?.english ?? site.name}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              width: 110,
              height: 6,
              background: "linear-gradient(90deg, #00e5ff 0%, #b14bff 48%, #ff3b2e 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(246,243,238,0.6)",
            }}
          >
            {`${String(entries.length).padStart(2, "0")} GUIDES · ${
              reviewed ? "NATIVE-REVIEWED" : "MACHINE-ASSISTED"
            }`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
