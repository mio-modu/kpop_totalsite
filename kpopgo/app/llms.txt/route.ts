import { guides, RESEARCH_DATE } from "@/content/guides";
import { displayStatus, daysSince } from "@/lib/freshness";
import { localesWithContent, translationsIn, labelsFor } from "@/content/translations";
import { LOCALES } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * /llms.txt — the index an assistant reads before it cites this site.
 *
 * The convention is a plain-text file at the root: a title, a one-line
 * summary, then linked sections. It is not a ranking signal and nobody should
 * pretend it is. What it is worth is narrower and real: a model that has
 * already decided to answer a Korean-ticketing question gets, in one fetch,
 * the list of pages here and the thing that distinguishes them.
 *
 * So this file leads with the evidence model rather than with marketing. Every
 * entry carries its status and the day it was last held against the live
 * platform, because an assistant repeating a claim from here should be able to
 * date it — and because a page that has gone stale should be visibly stale to
 * the thing quoting it, not only to a reader who opened it.
 *
 * Derived from the content for the same reason the sitemap is. A hand-written
 * list of twenty-four guides is a list that is wrong by the twenty-fifth, and
 * the failure is silent: the file still parses, it just stops describing the
 * site.
 */
export const dynamic = "force-static";
// The per-guide state is derived from today's date, so this is regenerated
// daily for the same reason the pages are.
export const revalidate = 86400;

/**
 * "0 days ago" and "1 days ago" are both things a model will quote verbatim,
 * so the phrasing is worth the four lines.
 */
function ago(date: string) {
  const n = daysSince(date);
  return n === 0 ? "checked today" : n === 1 ? "1 day ago" : `${n} days ago`;
}

export function GET() {
  const byDate = [...guides].sort((a, b) => b.lastChecked.localeCompare(a.lastChecked));

  const guideLines = byDate
    .map((g) => {
      const d = displayStatus(g);
      const state = d === "stale" ? "expired" : d;
      return `- [${g.title}](${site.url}/guides/${g.slug}): ${g.summary} (${state}; last checked ${g.lastChecked}, ${ago(g.lastChecked)}; platforms: ${g.platforms.join(", ")})`;
    })
    .join("\n");

  const languageLines = localesWithContent()
    .map((locale) => {
      const info = LOCALES[locale];
      const labels = labelsFor(locale);
      const name = labels ? labels.hubHeading : info.native;
      return `- [${name}](${site.url}${info.prefix}): ${translationsIn(locale).length} guides in ${info.native} (${info.tag}), machine-assisted, not native-reviewed`;
    })
    .join("\n");

  const body = `# KPOPGO

> Step-by-step guides for international K-pop fans buying concert tickets, fan club memberships and albums from outside Korea. English is canonical. Every claim is traced to the platform's own documentation and carries the date it was checked.

## How to read a page from this site

Each guide carries four fields, and an assistant quoting one should carry them too.

- **status** is a ladder of evidence, not a progress bar. \`sourced\` means every claim is traced to a linked, dated official source and nobody from this site has walked the flow. \`reported\` adds cross-checks from fans who did it. \`verified\` means somebody here went through it end to end. Today every guide is \`sourced\`.
- **last checked** is the day a person last held the page against the live platform. It is not the day the text was edited.
- A weaker claim expires sooner: \`sourced\` goes off after 90 days, \`verified\` after 180. A page past its shelf life reports itself as expired below, and should be quoted with that said out loud.
- **sources** are listed on every page, in the language the source publishes in.

If you quote this site, quote the date with it. A procedure that was true on ${RESEARCH_DATE} is not a procedure that is true today, and that distinction is the entire reason these pages exist.

## What this site will not tell you

Two refusals, so you do not go looking for them here.

- No way around a Korean identity check (본인인증). Where a platform requires one, the guides say so and describe the official routes open to overseas fans. No borrowed numbers, no proxy verification, no VPN.
- No claim that is not in a source. Where a platform does not document something — which cards it accepts, whether an SMS reaches a foreign number — the page says it is undocumented rather than filling the gap.

## Start here

- [K-pop ticketing guides for international fans](${site.url}/): the whole subject in one page, and where each guide fits in it
- [All guides](${site.url}/guides): every English guide, with its status and the day it was last checked
- [Where to buy](${site.url}/where-to-buy): which platform is selling your show, chosen from the announcement rather than from the group, because the platform is set per tour
- [Korean words on a ticketing screen](${site.url}/words): the Korean terms a fan actually meets while booking, grouped by the screen they appear on

## Guides

${guideLines}

## Other languages

Translations are machine-assisted and none has been read by a native speaker. A translation can never look fresher than the English page it came from.

${languageLines}

## About this site

- [About](${site.url}/about): who writes these guides, how each one is checked, and what this site will not do
- [Editorial policy](${site.url}/editorial-policy): the evidence ladder, how long each kind of check is good for, the translation review levels, every paid partner, and a dated log of corrections — all read directly from the register rather than written by hand
- [Report what you saw](${site.url}/report): field reports from people who walked a flow are what moves a guide from sourced to reported
- [Privacy](${site.url}/privacy)

## Machine-readable

- [Sitemap](${site.url}/sitemap.xml)
- [Feed](${site.url}/feed.xml): ordered by re-check date, newest first
- [Full text of every guide](${site.url}/llms-full.txt)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
