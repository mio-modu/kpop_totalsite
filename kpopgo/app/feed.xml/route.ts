import { guides, RESEARCH_DATE } from "@/content/guides";
import { displayStatus } from "@/lib/freshness";
import { site } from "@/lib/site";

/**
 * RSS.
 *
 * Two reasons it is worth the forty lines. Naver's Search Advisor has a
 * submission slot for a feed alongside the sitemap, and takes it as a
 * separate signal. And a feed is the one way a reader can subscribe to "tell
 * me when a guide is re-checked" — which, on a site whose product is that its
 * guides are not stale, is the thing worth subscribing to.
 *
 * Ordered by verification date, newest first, so a re-checked guide surfaces
 * again rather than sitting wherever it was first published.
 */
export const dynamic = "force-static";
// The per-item state label is derived from today's date, so the feed is
// regenerated daily for the same reason the pages are.
export const revalidate = 86400;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items = [...guides]
    .sort((a, b) => b.lastChecked.localeCompare(a.lastChecked))
    .map((g) => {
      const url = `${site.url}/guides/${g.slug}`;
      const d = displayStatus(g);
      const state = d === "stale" ? "Expired" : d[0].toUpperCase() + d.slice(1);
      return `    <item>
      <title>${esc(g.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(g.lastChecked).toUTCString()}</pubDate>
      <description>${esc(`${g.summary} (${state} · last checked ${g.lastChecked})`)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — ${esc(site.tagline)}</title>
    <link>${site.url}</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(RESEARCH_DATE).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
