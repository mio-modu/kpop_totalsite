/**
 * The paths between the guides, which are the only reason they read as one
 * subject rather than twenty-one pages that happen to share a menu.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * `see` is the cross-reference on a step: where this step continues, when it
 * continues in another guide. Its rule is stated on the type and is a rule
 * about restraint — only where a reader would actually leave, because a link
 * on every step teaches nothing. Restraint is the easy half to keep. The hard
 * half is that a guide can be written, pass every other check, ship, and be
 * reachable only from the index — and nothing says so.
 *
 * That is not hypothetical. Two guides were sitting in exactly that state
 * when this file was written: `weverse-membership-renewal-overseas` and
 * `nol-world-play-stay-package`, both linking out three times and linked to
 * by nothing. They were found by building the graph by hand, which is a thing
 * nobody does twice. Hence a check.
 *
 * A guide no other guide points at is a guide a reader arrives at only by
 * already knowing it exists, which for a page written to answer a search is
 * close to not existing. So the inbound rule is a hard failure, not a warning,
 * and the honest consequence is accepted: if a new guide has no step anywhere
 * that a reader would genuinely leave from, the answer is that the guide is
 * not yet part of the subject — not that a decorative link should be added to
 * clear the check. Adding one to go green is the failure this file is for, one
 * step removed.
 *
 * The outbound rule is the same test from the other side. A guide that points
 * nowhere is claiming its process ends inside it, which so far has never been
 * true of any page here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const GUIDES = await readFile(
  new URL("../content/guides.ts", import.meta.url),
  "utf8",
);

/**
 * Guide slugs sit at four spaces; every other `slug:` in the file is nested
 * deeper inside a `see` block. That indentation is load-bearing here, so it is
 * asserted below rather than trusted.
 */
const guideSlugs = [...GUIDES.matchAll(/^ {4}slug: "([a-z0-9-]+)",$/gm)].map(
  (m) => m[1],
);

/** Each guide's source, so a `see` can be attributed to the guide holding it. */
const blocks = (() => {
  const starts = [...GUIDES.matchAll(/^ {4}slug: "([a-z0-9-]+)",$/gm)].map(
    (m) => ({ slug: m[1], at: m.index }),
  );
  return starts.map((s, i) => ({
    slug: s.slug,
    src: GUIDES.slice(s.at, starts[i + 1]?.at ?? GUIDES.length),
  }));
})();

const seesIn = (src) =>
  [...src.matchAll(/see: \{\s*\n\s*slug: "([a-z0-9-]+)",/g)].map((m) => m[1]);

const edges = blocks.flatMap((b) =>
  seesIn(b.src).map((to) => ({ from: b.slug, to })),
);

test("the file is laid out the way this file's parsing assumes", () => {
  assert.ok(guideSlugs.length > 0, "no guide slugs found at four spaces");
  assert.equal(
    new Set(guideSlugs).size,
    guideSlugs.length,
    "two guides share a slug",
  );
  assert.ok(
    edges.length > 0,
    "no `see` cross-references found — the regex has stopped matching the file",
  );
});

test("every `see` names a guide that exists", () => {
  const known = new Set(guideSlugs);
  const dangling = edges.filter((e) => !known.has(e.to));
  assert.deepEqual(
    dangling,
    [],
    `a step points at a slug no guide has: ${dangling
      .map((e) => `${e.from} -> ${e.to}`)
      .join(", ")}`,
  );
});

test("no guide points at itself", () => {
  const self = edges.filter((e) => e.from === e.to);
  assert.deepEqual(
    self,
    [],
    `a step links to its own guide: ${self.map((e) => e.from).join(", ")}`,
  );
});

test("every guide is reachable from another guide", () => {
  const linkedTo = new Set(edges.map((e) => e.to));
  const orphans = guideSlugs.filter((s) => !linkedTo.has(s));
  assert.deepEqual(
    orphans,
    [],
    `no other guide points at these, so a reader only reaches them from the index: ${orphans.join(
      ", ",
    )}. Add the link on the step a reader would actually leave from — or leave the guide out until there is one.`,
  );
});

test("every guide continues somewhere", () => {
  const linksOut = new Set(edges.map((e) => e.from));
  const dead = guideSlugs.filter((s) => !linksOut.has(s));
  assert.deepEqual(
    dead,
    [],
    `these guides point nowhere, which claims the process ends inside them: ${dead.join(
      ", ",
    )}`,
  );
});
