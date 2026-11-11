/**
 * What a search result can actually show.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * A search result cuts a title at roughly 60 characters and throws the rest
 * away. Eighteen of twenty-four guide headlines were over, and because these
 * headlines are written as "Topic: the detail, the detail, and the payoff",
 * what they lost was the payoff — the clause that says why the page is worth
 * opening. `Cancelling a NOL World ticket: the deadline, the fee, and th…`
 * loses *the money you still lose*, which is the reason anybody clicks.
 *
 * Two things fixed it and both are the kind that quietly come back.
 *
 * The site suffix went first. Every inner page spent ` · KPOPGO` — nine of
 * sixty characters — on the one word a reader arriving from search does not
 * need, and this site has direct evidence of what search does with words like
 * that: `lib/site.ts` records a home title submitted as "KPOPGO — Get
 * verified. Get tickets. Go." and rendered as plain "KPOPGO". The brand is
 * still declared through `openGraph.siteName`, which is what search reads for
 * the site name it prints above a result.
 *
 * Then `searchTitle` split the headline from the title tag, so the page keeps
 * the long version and search gets a short one.
 *
 * Neither survives on its own. A template is one string away from re-adding a
 * suffix, and a character count is exactly the sort of thing that drifts back
 * one good headline at a time. So both are asserted here rather than
 * remembered.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const GUIDES = await readFile(new URL("content/guides.ts", root), "utf8");
const LAYOUT = await readFile(new URL("app/layout.tsx", root), "utf8");
const ROUTE = await readFile(new URL("app/guides/[slug]/page.tsx", root), "utf8");

/** What search displays before it cuts. Google's own limit is pixel-based and
 *  varies; 60 characters is the usual safe reading of it. */
const LIMIT = 60;

/**
 * Every guide as { slug, title, searchTitle }.
 *
 * Read by key off each guide's own block rather than by line order, because a
 * guide's steps carry `title` too and an order-dependent pattern walks
 * straight into them.
 */
function guides() {
  const out = [];
  const re = /\n {4}slug: "([^"]+)",/g;
  for (const m of GUIDES.matchAll(re)) {
    const block = GUIDES.slice(m.index, m.index + 4000);
    const title = block.match(/\n {4}title: "((?:[^"\\]|\\.)*)",/)?.[1];
    const searchTitle = block.match(/\n {4}searchTitle: "((?:[^"\\]|\\.)*)",/)?.[1];
    if (title) out.push({ slug: m[1], title, searchTitle });
  }
  return out;
}

/** The content file escapes some punctuation; a character count has to be of
 *  what renders, not of what is typed. */
const rendered = (s) =>
  s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

test("every guide was found, or this file is checking nothing", () => {
  const all = guides();
  assert.ok(all.length >= 20, `only ${all.length} guides parsed — the pattern has stopped matching`);
  assert.ok(
    all.every((g) => g.title),
    "a guide block parsed with no title",
  );
});

test("the title search gets fits what search shows", () => {
  for (const g of guides()) {
    const shown = rendered(g.searchTitle ?? g.title);
    assert.ok(
      shown.length <= LIMIT,
      `${g.slug}: the title search would show is ${shown.length} characters, over ${LIMIT}. ` +
        `Search cuts the end, which on this site is the clause that earns the click. ` +
        `Give it a searchTitle.\n    ${shown}`,
    );
  }
});

test("a headline too long for search has a short form", () => {
  for (const g of guides()) {
    if (rendered(g.title).length <= LIMIT) continue;
    assert.ok(
      g.searchTitle,
      `${g.slug}: the headline is ${rendered(g.title).length} characters and there is no ` +
        `searchTitle, so search shows the first ${LIMIT} and drops the rest.`,
    );
  }
});

test("a short form that is not shorter is not doing anything", () => {
  for (const g of guides()) {
    if (!g.searchTitle) continue;
    assert.notEqual(
      rendered(g.searchTitle),
      rendered(g.title),
      `${g.slug}: searchTitle is identical to the headline — delete it or make it shorter`,
    );
  }
});

test("the route hands search the short form, not the headline", () => {
  // The field is worth nothing if generateMetadata stops reading it, and
  // nothing on the page would change if it did.
  assert.match(
    ROUTE,
    /title:\s*guide\.searchTitle\s*\?\?\s*guide\.title/,
    "the guide route no longer prefers searchTitle for the <title>",
  );
});

test("the title template adds no site suffix back", () => {
  const template = LAYOUT.match(/template:\s*(`[^`]*`|"[^"]*")/)?.[1] ?? "";
  assert.ok(template, "app/layout.tsx no longer declares a title template");
  assert.equal(
    template.replace(/[`"]/g, ""),
    "%s",
    "the title template is appending something to every inner page again. " +
      "Nine characters of a sixty-character budget went on the site name once " +
      "already, and search rendered this site's own slogan away rather than show it.",
  );
  // And the brand still has to be declared somewhere search reads it.
  assert.match(
    LAYOUT,
    /siteName:\s*site\.name/,
    "openGraph.siteName is gone, so dropping the title suffix now drops the brand entirely",
  );
});
