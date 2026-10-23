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
// Comment-stripped like the component, and for the same reason: this file is
// heavily commented, several comments quote example URLs and field names, and
// a check that reads a comment as a registration is reading fiction.
const REGISTRY = stripComments(await read("content/affiliates.ts"));
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
  // Both shapes, each guarded on its own.
  //
  // The first version matched `partner: { id: "…"` alone, so the day a step
  // declared a list it would have reported a pass having read none of the new
  // links. The second version read both and guarded the *concatenated* result,
  // which is the same hole one layer along: the single link on Play&Stay keeps
  // the count above zero while the four area links go unread.
  //
  // And neither version survived the fields being written in another order.
  // `StepPartner` declares them `id`, `text`, `area`, so the type's own order
  // defeated a pattern hard-coded to `id`, `area`, `text`. Objects are found
  // first and their keys read individually.
  const objects = [...GUIDES.matchAll(/\{[^{}]*\bid: "[^"]+"[^{}]*\}/g)].map((m) => m[0]);
  const key = (obj, name) => obj.match(new RegExp(`\\b${name}: "((?:[^"\\\\]|\\\\.)*)"`))?.[1];

  const singles = [...GUIDES.matchAll(/partner: (\{[^{}]*\})/g)].map((m) => m[1]);
  const listed = objects.filter((o) => key(o, "area") !== undefined);

  assert.ok(singles.length > 0, "no `partner: { … }` link found in guides.ts — that pattern has stopped matching");
  assert.ok(listed.length > 0, "no area link object found in guides.ts — that pattern has stopped matching");

  const used = [...singles, ...listed].map((o) => key(o, "id")).filter(Boolean);
  assert.equal(
    used.length,
    singles.length + listed.length,
    "a paid link object was found with no readable id",
  );
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
    // The captured block now contains the nested `areas` array, so a bare
    // `url: "` match could be satisfied by an area's URL while the partner's
    // own had been deleted. Read the one at the partner's own indent.
    const url = b.match(/^ {4}url: "([^"]+)"/m)?.[1] ?? "";
    assert.ok(url.startsWith("https://"), `the partner's own url is missing or not https: ${url}`);
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

/**
 * Every area block in the registry, as { id, label, query, url }.
 *
 * Read by key rather than by key order. The first version required all four
 * fields on consecutive lines in one fixed order, which meant a reordering of
 * the registry would make this return `[]` — and the two tests below it, the
 * ones protecting the money and the link text, would then iterate over nothing
 * and pass. Every caller also asserts it found something, because a helper
 * that silently returns an empty list is the failure this file keeps meeting.
 */
const areaBlocks = () =>
  [...REGISTRY.matchAll(/\{[^{}]*\bquery: "[^"]*"[^{}]*\}/g)]
    .map((m) => m[0])
    .map((b) => ({
      id: b.match(/\bid: "([^"]+)"/)?.[1],
      label: b.match(/\blabel: "([^"]+)"/)?.[1],
      query: b.match(/\bquery: "([^"]+)"/)?.[1],
      url: b.match(/\burl: "([^"]+)"/)?.[1],
    }))
    .filter((a) => a.id && a.label && a.query && a.url);

test("every area a step names is registered", () => {
  const declared = new Set(areaBlocks().map((a) => a.id));
  const used = [...GUIDES.matchAll(/\{[^{}]*\barea: "([^"]+)"[^{}]*\}/g)].map((m) => m[1]);
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
  assert.ok(areaBlocks().length > 0, "no areas parsed from the registry — the pattern has stopped matching");
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
  assert.ok(areaBlocks().length > 0, "no areas parsed from the registry — the pattern has stopped matching");
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
  // Object first, keys after, so the assertion survives the fields being
  // written in a different order — including `StepPartner`'s own order.
  const links = [...GUIDES.matchAll(/\{[^{}]*\barea: "[^"]+"[^{}]*\}/g)]
    .map((m) => m[0])
    .map((o) => [
      o,
      o.match(/\barea: "([^"]+)"/)?.[1],
      o.match(/\btext: "((?:[^"\\]|\\.)*)"/)?.[1] ?? "",
    ]);
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

/**
 * An ad unit must not land on the heels of a paid link.
 *
 * Today it does not, and only by accident: the step carrying four paid links
 * happens to be followed by another step, so the in-article `AdSlot` is two
 * steps down the page. Drop that step, reorder them, or put a `partner` on any
 * guide's final step, and the ad renders immediately under a stack of four
 * `rel="sponsored"` boxes — four sponsored surfaces, then one marked
 * Advertisement.
 *
 * They would read as one block, because they nearly are one: `.paid a` and
 * `.ad-slot` share a background and a border and differ mainly in radius.
 * CLAUDE.md's advertising rules are about exactly this adjacency — an ad that
 * reads as a recommendation costs more than it earns, on a page whose product
 * is trust — and `documents.test.mjs` already asserts the same shape of rule
 * for the reproduced chart. This is the missing half.
 *
 * Asserted structurally: the ad slot is outside the steps section, and the
 * steps section is where paid links live. That holds however the steps are
 * reordered, which a check against the last step's content would not.
 */
test("the in-article ad renders outside the steps, never under a paid link", () => {
  const stepsOpen = GUIDE_PAGE.indexOf("{guide.steps.map(");
  const ad = GUIDE_PAGE.search(/<AdSlot\s+placement="article"/);
  const paid = GUIDE_PAGE.indexOf("<AffiliateLink");

  assert.ok(stepsOpen > 0, "the guide route no longer maps over guide.steps");
  assert.ok(ad > 0, "the guide route no longer renders the in-article AdSlot");
  assert.ok(paid > 0, "the guide route no longer renders <AffiliateLink>");

  assert.ok(
    paid > stepsOpen,
    "paid links are no longer rendered inside the steps — this check's assumption has moved",
  );
  // The steps section has to close before the ad opens.
  const sectionClose = GUIDE_PAGE.indexOf("</section>", paid);
  assert.ok(
    sectionClose > 0 && ad > sectionClose,
    "the in-article AdSlot renders inside or immediately after the steps, where it can " +
      "land directly beneath a step's paid links. Four sponsored boxes followed by an " +
      "ad box reads as one stack of advertising on a page whose product is trust.",
  );
});
