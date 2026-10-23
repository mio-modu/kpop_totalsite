/**
 * The disclosure guarantees, asserted rather than trusted.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * content/guides.ts already fails the build on a paid link to an unregistered
 * partner. These cover the failures a build cannot see: an edit that drops
 * `sponsored` from the rel, or that moves the notice below the steps it is
 * supposed to appear above. Both would leave a site that looks correct and is
 * not disclosing anything, which is the only failure in this area that cannot
 * be walked back once a reader has noticed it.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (rel) => readFile(new URL(`../${rel}`, import.meta.url), "utf8");

/** Block comments explain the rel attribute in prose, and the first version of
 *  this file matched that prose instead of the markup — passing on a quoted
 *  example while the real attribute could have said anything. Comments out. */
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "");

const AFFILIATE = stripComments(await read("components/Affiliate.tsx"));
const REGISTRY = await read("content/affiliates.ts");
const GUIDES = await read("content/guides.ts");
const GUIDE_PAGE = await read("app/guides/[slug]/page.tsx");

test("a paid link is always rel=sponsored, and opens with no referrer leak", () => {
  const rels = [...AFFILIATE.matchAll(/rel="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(rels.length > 0, "no rel attribute found — did the link markup move?");
  for (const rel of rels) {
    const parts = rel.split(/\s+/);
    assert.ok(parts.includes("sponsored"), `rel "${rel}" is missing sponsored`);
    assert.ok(parts.includes("nofollow"), `rel "${rel}" is missing nofollow`);
    assert.ok(parts.includes("noopener"), `rel "${rel}" is missing noopener`);
  }
});

test("a paid link always carries the visible Paid tag", () => {
  // Disclosed in law and invisible in practice is the failure mode here: a
  // paid link that looks exactly like an unpaid one.
  assert.match(
    AFFILIATE,
    /<a[\s\S]{0,400}?paid-tag/,
    "the anchor no longer contains the Paid tag",
  );
});

test("an unknown partner renders nothing rather than an unmarked link", () => {
  assert.match(
    AFFILIATE,
    /if \(!partner\) return null;/,
    "AffiliateLink must fail closed when the partner is missing",
  );
});

test("the notice is rendered above the steps, not below them", () => {
  const notice = GUIDE_PAGE.indexOf("<PaidDisclosure");
  const steps = GUIDE_PAGE.indexOf("guide.steps.map");
  assert.ok(notice > -1, "PaidDisclosure is not on the guide page at all");
  assert.ok(steps > -1, "could not find the steps list");
  assert.ok(
    notice < steps,
    "the paid-link notice renders after the steps — it has to come first",
  );
});

test("every paid link in the content names a registered partner", () => {
  const declared = new Set(
    [...REGISTRY.matchAll(/^\s{4}id: "([^"]+)",$/gm)].map((m) => m[1]),
  );
  // Both shapes. The first version of this matched `partner: { id: "…"` only,
  // and a step may now declare a list — so the day the accommodation step
  // landed with four links, this check would have gone on reporting a pass
  // having read none of them. That is the same failure the translation suite
  // already records: a check scoped to one shape stops existing when the
  // second arrives.
  const used = [
    ...GUIDES.matchAll(/partner: \{ id: "([^"]+)"/g),
    ...GUIDES.matchAll(/^\s+\{ id: "([^"]+)", area: "[^"]*", text:/gm),
  ].map((m) => m[1]);
  assert.ok(used.length > 0, "no paid links found in guides.ts — the patterns have stopped matching");
  for (const id of used) {
    assert.ok(
      declared.has(id),
      `guides.ts uses partner "${id}", which is not in content/affiliates.ts — ` +
        `that would be an undisclosed paid link`,
    );
  }
});

test("every registered partner is complete enough to disclose", () => {
  const blocks = [...REGISTRY.matchAll(/^\s{2}\{\n([\s\S]*?)^\s{2}\},$/gm)].map(
    (m) => m[1],
  );
  for (const b of blocks) {
    for (const field of ["id", "name", "what", "howWeArePaid", "url", "checked"]) {
      assert.match(b, new RegExp(`${field}: "`), `a partner is missing ${field}`);
    }
    const url = b.match(/url: "([^"]+)"/)?.[1] ?? "";
    assert.ok(url.startsWith("https://"), `partner url is not https: ${url}`);
    assert.match(
      b.match(/checked: "([^"]+)"/)?.[1] ?? "",
      /^\d{4}-\d{2}-\d{2}$/,
      "partner checked date is not YYYY-MM-DD",
    );
  }
});

/**
 * Areas: the per-place destinations, and the two ways they fail quietly.
 *
 * A step may send a reader to one partner at one named station rather than to
 * that partner's site-wide page. Both things that can go wrong with that are
 * invisible on the page, because what renders either way is a perfectly
 * ordinary, correctly disclosed paid link.
 *
 * The first costs money: an area URL that loses the affiliate attribution
 * earns nothing, for as long as nobody thinks to check a dashboard.
 *
 * The second costs trust, which is worse: a link that reads "near Guro
 * Station" and searches for somewhere else. This site's whole claim is that
 * what it says and what it does are the same thing, and a paid link is the
 * last place to break it.
 */

/** Every area block in the registry, as { id, label, query, url }. */
const areaBlocks = () =>
  [...REGISTRY.matchAll(/\{\s*\n\s+id: "([^"]+)",\s*\n\s+label: "([^"]+)",\s*\n\s+query: "([^"]+)",\s*\n\s+url: "([^"]+)",/g)].map(
    (m) => ({ id: m[1], label: m[2], query: m[3], url: m[4] }),
  );

test("every area a step names is registered", () => {
  const declared = new Set(areaBlocks().map((a) => a.id));
  const used = [...GUIDES.matchAll(/\{ id: "[^"]+", area: "([^"]+)"/g)].map((m) => m[1]);
  assert.ok(used.length > 0, "no area links found in guides.ts — the pattern has stopped matching");
  for (const id of used) {
    assert.ok(
      declared.has(id),
      `guides.ts sends a paid link to area "${id}", which content/affiliates.ts ` +
        `does not declare. The link would fall back to a generic destination.`,
    );
  }
});

test("an area link keeps the attribution, or it earns nothing", () => {
  const main = REGISTRY.match(/url: "(https:\/\/affiliate\.klook\.com[^"]+)"/)?.[1] ?? "";
  assert.ok(main, "the klook partner url is no longer recognisable");
  // Whatever identifies this site to the network has to survive into every
  // per-area URL. Read off the partner's own link rather than hardcoded, so
  // this keeps working when the ids change.
  const params = [...main.matchAll(/[?&](aid|aff_adid)=([^&]+)/g)].map((m) => `${m[1]}=${m[2]}`);
  assert.ok(params.length >= 2, "the partner url no longer carries aid and aff_adid");

  for (const area of areaBlocks()) {
    for (const p of params) {
      assert.ok(
        area.url.includes(p),
        `area "${area.id}" has lost ${p.split("=")[0]} from its URL. It is a ` +
          `working link that pays nothing, and nothing on the page shows it.`,
      );
    }
    assert.ok(area.url.startsWith("https://"), `area "${area.id}" url is not https`);
  }
});

test("an area searches for what its label says it searches for", () => {
  for (const area of areaBlocks()) {
    // The query is stored separately precisely so it can be held against the
    // destination: an encoded URL is not something anyone reads by eye.
    //
    // Decoded until it stops changing, because the destination is nested — the
    // network's redirect carries the storefront URL as a parameter, so the
    // query inside it is encoded twice. One `decodeURIComponent` leaves
    // `Guil%20Station` and the comparison fails on a link that is perfectly
    // correct, which is how a check like this gets deleted rather than fixed.
    let decoded = area.url;
    for (let i = 0; i < 5; i++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    assert.ok(
      decoded.includes(`query=${area.query}`),
      `area "${area.id}" declares query "${area.query}" and its URL does not carry it`,
    );
    // And the label must be the thing being searched for, not a nicer name
    // for somewhere else.
    assert.ok(
      area.query.toLowerCase().includes(area.label.toLowerCase()),
      `area "${area.id}" is labelled "${area.label}" but searches "${area.query}"`,
    );
  }
});

test("the visible text of an area link names that area", () => {
  const links = [...GUIDES.matchAll(/\{ id: "[^"]+", area: "([^"]+)", text: "([^"]+)" \}/g)];
  assert.ok(links.length > 0, "no area links found in guides.ts — the pattern has stopped matching");
  const byId = new Map(areaBlocks().map((a) => [a.id, a]));
  for (const [, id, text] of links) {
    const area = byId.get(id);
    if (!area) continue; // covered by the registration test above
    const station = area.label.replace(/ Station$/, "");
    assert.ok(
      text.includes(station),
      `a paid link to area "${id}" reads "${text}", which does not name ` +
        `${area.label}. A reader clicking it would land somewhere the text ` +
        `did not promise.`,
    );
  }
});
