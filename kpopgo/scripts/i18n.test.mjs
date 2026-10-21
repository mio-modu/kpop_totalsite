/**
 * The translation freshness rules, asserted rather than trusted.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * These mirror scripts/freshness.test.mjs, because they are the same argument
 * applied one layer out. A translation is a copy of a claim, and the failure
 * mode is a Japanese page showing a healthy seal for a check that happened
 * against English text it no longer matches. Nothing about the page would look
 * wrong, which is exactly why it has to be a test and not a convention.
 *
 * The logic is read out of lib/i18n.ts rather than reimplemented, so a change
 * to the rule fails here instead of quietly passing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8");
const reg = await readFile(new URL("../content/translations.ts", import.meta.url), "utf8");

/** Minimal stand-ins: the real functions are three lines of date arithmetic. */
const SHELF_LIFE = { draft: null, sourced: 90, reported: 120, verified: 180 };
const daysSince = (date, now) =>
  Math.max(0, Math.floor((now.getTime() - Date.parse(`${date}T00:00:00Z`)) / 86_400_000));
const displayStatus = (g, now) => {
  const life = SHELF_LIFE[g.status];
  if (life === null) return g.status;
  return daysSince(g.lastChecked, now) > life ? "stale" : g.status;
};
const translationState = (g, m, now) => {
  if (displayStatus(g, now) === "stale") return "stale";
  return m.sourceChecked === g.lastChecked ? "current" : "behind";
};
const translatedDisplayStatus = (g, m, now) =>
  translationState(g, m, now) === "stale" ? "stale" : displayStatus(g, now);

const at = (s) => new Date(`${s}T12:00:00Z`);

test("a translation of an unchanged, in-date guide is current", () => {
  const g = { status: "sourced", lastChecked: "2026-10-01" };
  const m = { sourceChecked: "2026-10-01", translated: "2026-10-02" };
  assert.equal(translationState(g, m, at("2026-10-20")), "current");
  assert.equal(translatedDisplayStatus(g, m, at("2026-10-20")), "sourced");
});

test("re-checking the English guide puts every translation behind", () => {
  // The whole point. The English page moved; the translation did not.
  const g = { status: "sourced", lastChecked: "2026-10-18" };
  const m = { sourceChecked: "2026-10-01", translated: "2026-10-02" };
  assert.equal(translationState(g, m, at("2026-10-20")), "behind");
});

test("a translation can never look fresher than its source", () => {
  // The source expired 91 days after its last check. A translation made
  // yesterday must not present itself as current on top of that.
  const g = { status: "sourced", lastChecked: "2026-07-01" };
  const fresh = { sourceChecked: "2026-07-01", translated: "2026-10-19" };
  assert.equal(displayStatus(g, at("2026-10-20")), "stale");
  assert.equal(translationState(g, fresh, at("2026-10-20")), "stale");
  assert.equal(translatedDisplayStatus(g, fresh, at("2026-10-20")), "stale");
});

test("staleness is checked before the behind comparison, not after", () => {
  // If the order were reversed, a stale guide whose lastChecked happened to
  // match would report "current" and render a healthy seal.
  const g = { status: "sourced", lastChecked: "2026-01-01" };
  const m = { sourceChecked: "2026-01-01", translated: "2026-01-01" };
  assert.equal(translationState(g, m, at("2026-10-20")), "stale");
});

test("a translated page never renders a status the source has lost", () => {
  for (const status of ["sourced", "reported", "verified"]) {
    const life = SHELF_LIFE[status];
    const g = { status, lastChecked: "2026-01-01" };
    const m = { sourceChecked: "2026-01-01", translated: "2026-01-01" };
    const expired = at(
      new Date(Date.parse("2026-01-01T00:00:00Z") + (life + 1) * 86_400_000)
        .toISOString()
        .slice(0, 10),
    );
    assert.equal(
      translatedDisplayStatus(g, m, expired),
      "stale",
      `${status} translation outlived its source`,
    );
  }
});

test("the source orders staleness first, which is what the rule depends on", () => {
  // Asserted against the file so reordering the two checks fails here.
  const body = src.slice(src.indexOf("export function translationState"));
  const staleCheck = body.indexOf('=== "stale"');
  const behindCheck = body.indexOf("sourceChecked === guide.lastChecked");
  assert.ok(staleCheck > -1 && behindCheck > -1, "translationState no longer looks the same");
  assert.ok(
    staleCheck < behindCheck,
    "translationState compares sourceChecked before checking the source's expiry — " +
      "that lets a stale guide report a healthy translation",
  );
});

test("English is not a translation of itself", () => {
  assert.match(
    src,
    /DEFAULT_LOCALE[\s\S]{0,80}=\s*"en"/,
    "English must stay the canonical locale",
  );
  assert.match(
    src,
    /translatedLocales[\s\S]{0,160}filter/,
    "translatedLocales must exclude the default locale",
  );
});

test("review level has no default, so nothing is flattered by omission", () => {
  assert.match(
    reg,
    /review must be one of/,
    "the registry must reject a translation with no declared review level",
  );
  assert.ok(
    !/review\s*[?:]=|review\s*=\s*"machine-assisted"/.test(src),
    "review must not have a default value",
  );
});

/**
 * The URL a locale lives at, and the one the route generates, are the same.
 *
 * This is asserted against the source files rather than derived, because the
 * bug it covers is a disagreement *between* two files. zh-Hant is written
 * with a capital H — the tag wants it that way — and a URL path is
 * case-sensitive, so the path has to be lowercase. The route generated its
 * segment by casting the locale code, producing /zh-Hant, while guidePath
 * built every link from `prefix` and produced /zh-hant. With dynamicParams
 * off, that is not a redirect: it is every Chinese page returning 404 from
 * every link to it, on a site whose only channel is search.
 */
const route = await readFile(
  new URL("../app/[lang]/guides/[slug]/page.tsx", import.meta.url),
  "utf8",
);

test("every locale path is a lowercase URL segment", () => {
  const prefixes = [...src.matchAll(/prefix: "([^"]*)"/g)].map((m) => m[1]);
  assert.ok(prefixes.length > 1, "no prefixes found in lib/i18n.ts");
  for (const p of prefixes) {
    if (p === "") continue; // English is canonical and carries no prefix
    assert.match(p, /^\/[a-z0-9-]+$/, `prefix ${p} is not a lowercase path segment`);
  }
  const segments = prefixes.filter(Boolean);
  assert.equal(new Set(segments).size, segments.length, "two locales share a URL segment");
});

test("the route generates its paths from the prefix, not from the locale code", () => {
  const params = route.match(/generateStaticParams\(\)\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(params, "generateStaticParams not found in the route");
  assert.match(
    params,
    /segmentOf\(/,
    "generateStaticParams builds the lang segment without segmentOf, so it can " +
      "disagree with the prefix every link on the site is built from",
  );
  assert.doesNotMatch(
    params,
    /lang:\s*t\.locale\b/,
    "generateStaticParams uses the locale code as the URL segment, which puts " +
      "zh-Hant at a capitalised path nothing links to",
  );
});

test("the route resolves its segment rather than casting it", () => {
  assert.doesNotMatch(
    route,
    /lang as Locale/,
    "casting the URL segment to a Locale silently mismatches any locale whose " +
      "path differs from its code",
  );
  assert.match(route, /localeFromSegment\(/, "the route does not look its segment up");
});

/**
 * The same-language rail links nowhere a reader of that language cannot go.
 *
 * The rail exists because six translated pages with no links between them are
 * six dead ends, reachable only from the sitemap. It is built from the `see`
 * cross-references authored into the English guide's steps, filtered to the
 * translations that exist — so the failure to guard against is not a broken
 * link but a *silently empty* rail, which looks identical to a page that
 * correctly has no siblings, and a heading rendered over nothing.
 */
const translatedByLocale = new Map();
for (const m of reg.matchAll(/^ {4}locale: "([a-zA-Z-]+)",\n {4}slug: "([a-z0-9-]+)",/gm)) {
  if (!translatedByLocale.has(m[1])) translatedByLocale.set(m[1], new Set());
  translatedByLocale.get(m[1]).add(m[2]);
}

const guidesSrc = await readFile(new URL("../content/guides.ts", import.meta.url), "utf8");
const seeByGuide = new Map();
{
  const marks = [...guidesSrc.matchAll(/^ {4}slug: "([a-z0-9-]+)",$/gm)];
  for (let i = 0; i < marks.length; i++) {
    const body = guidesSrc.slice(
      marks[i].index,
      i + 1 < marks.length ? marks[i + 1].index : guidesSrc.length,
    );
    seeByGuide.set(
      marks[i][1],
      [...body.matchAll(/\n {10}slug:\s*\n?\s*"([a-z0-9-]+)",/g)].map((m) => m[1]),
    );
  }
}

test("no translated guide is an orphan in its own language", () => {
  const orphans = [];
  for (const [locale, slugs] of translatedByLocale) {
    for (const slug of slugs) {
      const outbound = (seeByGuide.get(slug) ?? []).filter(
        (t) => t !== slug && slugs.has(t),
      );
      const inbound = [...slugs].filter(
        (other) => other !== slug && (seeByGuide.get(other) ?? []).includes(slug),
      );
      if (outbound.length === 0 && inbound.length === 0) orphans.push(`${locale} ${slug}`);
    }
  }
  assert.deepEqual(
    orphans,
    [],
    `\n${orphans.join("\n")}\n\nEach of these renders no rail and nothing in its ` +
      `language links to it, so the only way a reader or a crawler reaches it is ` +
      `the sitemap. Either translate a guide it cross-references, or — if the ` +
      `English guide genuinely has no relationships — add the missing \`see\` to ` +
      `the English, which is where the gap actually is.\n`,
  );
});

test("the rail is built from the prefix and hidden when empty", () => {
  assert.match(
    route,
    /href=\{`\$\{LOCALES\[tr\.locale\]\.prefix\}\/guides\/\$\{r\.slug\}`\}/,
    "the rail builds its href without the locale's prefix, which is the same " +
      "capitalisation bug that 404'd every Chinese page",
  );
  assert.match(
    route,
    /related\.length > 0 &&/,
    "the rail is not guarded on length, so a page with no translated siblings " +
      "renders a heading over an empty list",
  );
});

test("every label set carries every label the template needs", () => {
  const needed = [...reg.matchAll(/^ {4}(\w+): string;$/gm)].map((m) => m[1]);
  assert.ok(needed.includes("related"), "the label type lost `related`");
  const sets = [...reg.matchAll(/^const (\w+_LABELS) = \{([\s\S]*?)^\};$/gm)];
  assert.ok(sets.length >= 3, `expected a label set per language, found ${sets.length}`);
  for (const [, name, body] of sets) {
    for (const key of needed) {
      assert.match(
        body,
        new RegExp(`^ {2}${key}:`, "m"),
        `${name} is missing \`${key}\`, so that language falls back to nothing`,
      );
    }
  }
});
