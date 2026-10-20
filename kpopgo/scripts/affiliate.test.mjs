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
  const used = [...GUIDES.matchAll(/partner: \{ id: "([^"]+)"/g)].map((m) => m[1]);
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
