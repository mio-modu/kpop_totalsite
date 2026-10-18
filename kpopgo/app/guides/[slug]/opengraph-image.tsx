import { ImageResponse } from "next/og";
import { getGuide, guides } from "@/content/guides";
import { displayStatus } from "@/lib/freshness";
import { site } from "@/lib/site";

// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

/**
 * Per-guide share card. It carries the verification date, because a dated page
 * is the one claim this site makes that the stale guides it competes with
 * cannot — and the card is where someone decides whether to click.
 *
 * Latin only: ImageResponse ships a Latin font and would render Hangul as tofu.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);

  const title = guide?.title ?? site.name;
  const steps = guide ? `${String(guide.steps.length).padStart(2, "0")} STEPS` : "";
  // The stamp follows the derived status, not the stored one. This card is
  // where somebody decides whether to click, and "DRAFT" on a page whose every
  // claim is sourced and dated undersold it badly.
  const stamp = guide
    ? `${displayStatus(guide) === "stale" ? "EXPIRED" : displayStatus(guide).toUpperCase()} · ${guide.lastChecked}`
    : "";

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
          {stamp ? (
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
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 52 ? 62 : 76,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: "-0.04em",
            color: "#f6f3ee",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              width: 110,
              height: 6,
              background:
                "linear-gradient(90deg, #00e5ff 0%, #b14bff 48%, #ff3b2e 100%)",
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
            {steps}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
