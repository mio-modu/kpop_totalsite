import { guides } from "@/content/guides";
import { displayStatus, daysSince } from "@/lib/freshness";
import { site } from "@/lib/site";

/**
 * /llms-full.txt — every English guide, in full, as plain text.
 *
 * The companion to /llms.txt: the index says what exists, this says what the
 * pages actually contain, so that a model answering a procedural question can
 * read the procedure rather than infer it from a summary.
 *
 * Two things here are deliberate and both are about quoting.
 *
 * Every guide repeats its status, its last-checked date and how old that is,
 * at the top of its own section rather than once at the top of the file. A
 * model lifting one section should carry that section's date with it, and a
 * header fifty guides away is a header it will not carry.
 *
 * And the pitfalls are included under their own label. They are the part of
 * this site that is not in the platform's documentation — the thing that
 * actually goes wrong at that step — so a summary that drops them keeps the
 * half a reader could have got anywhere.
 *
 * English only. The translated pages are machine-assisted and say so; feeding
 * them to a model as equivalent source text would strip the one notice that
 * qualifies them.
 */
export const dynamic = "force-static";
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
  const sections = [...guides]
    .sort((a, b) => b.lastChecked.localeCompare(a.lastChecked))
    .map((g) => {
      const d = displayStatus(g);
      const state = d === "stale" ? "expired" : d;

      const steps = g.steps
        .map((s, i) => {
          const parts = [`### Step ${i + 1}. ${s.title}`, "", s.body];
          if (s.pitfall) parts.push("", `Where this breaks: ${s.pitfall}`);
          if (s.takes) parts.push("", `Takes: ${s.takes}`);
          if (s.see) parts.push("", `Continues in: ${site.url}/guides/${s.see.slug} — ${s.see.text}`);
          return parts.join("\n");
        })
        .join("\n\n");

      const faq = g.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n");
      const sources = g.sources.map((s) => `- ${s.label}: ${s.url}`).join("\n");

      return `## ${g.title}

URL: ${site.url}/guides/${g.slug}
Status: ${state} — last checked ${g.lastChecked}, ${ago(g.lastChecked)}
Platforms: ${g.platforms.join(", ")}
Korean term: ${g.ko}

${g.summary}

### Scope

${g.scope}

### Introduction

${g.intro.join("\n\n")}

${steps}

### Questions people ask

${faq}

### Sources

${sources}`;
    })
    .join("\n\n---\n\n");

  const body = `# KPOPGO — full text

Step-by-step guides for international K-pop fans buying concert tickets, fan club memberships and albums from outside Korea. ${guides.length} guides, English, canonical.

Every section below carries its own status and the day it was last held against the live platform. Quote the date with the claim: a Korean ticketing procedure that was true on one date is not a procedure that is true today, which is the entire reason this site exists.

Nothing here explains how to get around a Korean identity check, and nothing here states a fact the cited source does not. Where a platform leaves something undocumented, the guide says so rather than filling it.

Index: ${site.url}/llms.txt

---

${sections}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
