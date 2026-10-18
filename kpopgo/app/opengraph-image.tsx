import { ImageResponse } from "next/og";
import { guides } from "@/content/guides";
import { displayStatus } from "@/lib/freshness";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

/**
 * What the whole site can claim, for the card that speaks for the whole site.
 *
 * It was the literal string "DATED · SOURCED" — written before `sourced` was a
 * status, when it was only a word. Left hardcoded it would go on saying
 * SOURCED after a guide had been walked, and worse, it would say it while a
 * check had quietly expired. This is the same hardcoded-claim pattern the rest
 * of this site just stopped doing.
 *
 * The weakest rung wins. The card speaks for five guides at once, so claiming
 * VERIFIED while four of them are only sourced would be the lie — and an
 * expired check drags the whole card down to EXPIRED, which is the point.
 */
const RUNGS = ["stale", "draft", "sourced", "reported", "verified"] as const;

function siteStamp() {
  const weakest = guides
    .map((g) => RUNGS.indexOf(displayStatus(g)))
    .reduce((a, b) => Math.min(a, b), RUNGS.length - 1);
  const label = RUNGS[weakest] ?? "sourced";
  return label === "stale" ? "EXPIRED" : label.toUpperCase();
}

/**
 * The share card. Most of this site's early distribution is a link pasted into a
 * fan community, so the card is the first impression far more often than the
 * home page is — and it is seen in a feed, next to posters and photocards,
 * which is why it is dark and carries the foil rule rather than sitting on
 * cream like a press release.
 *
 * Latin only, no Hangul: ImageResponse ships a Latin font and would render
 * Korean glyphs as tofu. The Korean belongs on the page, not here.
 *
 * satori needs `display` stated on any div with more than one child, so every
 * flex container below says so even where a browser would not need it.
 */
export default function OpengraphImage() {
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
          padding: "68px 80px 0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 54,
              borderRadius: 14,
              background: "#ff3b2e",
              color: "#0a0a0f",
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            K
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#f6f3ee",
            }}
          >
            KPOP<span style={{ color: "#ff3b2e" }}>GO</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            color: "#f6f3ee",
            maxWidth: 960,
          }}
        >
          Buying K-pop tickets from outside Korea
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingBottom: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "rgba(246,243,238,0.66)",
              maxWidth: 720,
            }}
          >
            Which platform. Which identity check. Why your card got declined.
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              borderRadius: 999,
              border: "3px solid #ff3b2e",
              color: "#ff3b2e",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            DATED · {siteStamp()}
          </div>
        </div>

        {/* The foil rule, as a flat three-stop gradient — the one place the
            whole trio appears, the same rule the site uses on an edge. */}
        <div
          style={{
            display: "flex",
            height: 12,
            width: 1200,
            marginLeft: -80,
            background:
              "linear-gradient(90deg, #00e5ff 0%, #b14bff 44%, #ff3b2e 82%, #00e5ff 100%)",
          }}
        />
      </div>
    ),
    size,
  );
}
