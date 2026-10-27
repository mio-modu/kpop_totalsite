/**
 * /llms.txt and /llms-full.txt cannot quietly stop describing the site.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * Both are derived from `content/guides.ts`, which is what keeps them from
 * going stale the way a hand-written list would. That derivation is only worth
 * anything while it is actually a derivation, and the failure if somebody
 * replaces it with a literal is the quiet kind: the file still serves, still
 * parses, still looks like an index — it just stops listing the guide added
 * after it was written. The sitemap has a check for exactly this reason and
 * these two files have the same shape of risk.
 *
 * Read as text rather than imported and executed, because these are route
 * handlers with Next's module resolution behind them and this suite installs
 * nothing. What can be asserted from the source is the part that matters: the
 * list comes from `guides`, and every entry carries the date.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const index = await readFile(new URL("app/llms.txt/route.ts", root), "utf8");
const full = await readFile(new URL("app/llms-full.txt/route.ts", root), "utf8");
const content = await readFile(new URL("content/guides.ts", root), "utf8");

const slugs = [...content.matchAll(/^    slug: "([^"]+)",$/gm)].map((m) => m[1]);

test("the guide list is derived, not written out", () => {
  assert.ok(slugs.length >= 20, `only ${slugs.length} guides parsed — the pattern has drifted`);
  for (const [name, src] of [["llms.txt", index], ["llms-full.txt", full]]) {
    assert.match(
      src,
      /from "@\/content\/guides"/,
      `${name} does not import the content register`,
    );
    const hardcoded = slugs.filter((s) => src.includes(`"${s}"`) || src.includes(`/${s}`));
    assert.deepEqual(
      hardcoded,
      [],
      `${name} names ${hardcoded.length} guide slug(s) literally: ${hardcoded.join(", ")}. ` +
        `A literal list is wrong the day the next guide lands, and nothing breaks loudly ` +
        `when it is — build the list from \`guides\` instead.`,
    );
  }
});

test("every entry carries the date it was last checked", () => {
  for (const [name, src] of [["llms.txt", index], ["llms-full.txt", full]]) {
    assert.match(
      src,
      /lastChecked/,
      `${name} never emits lastChecked. An assistant quoting a procedure from ` +
        `this site has to be able to date it, which is the whole reason these ` +
        `files lead with the evidence model.`,
    );
    assert.match(
      src,
      /displayStatus/,
      `${name} does not derive the status. A page past its shelf life has to ` +
        `report itself as expired here too, not only to a reader who opened it.`,
    );
  }
});

test("llms-full carries the pitfalls, which are the part not in the sources", () => {
  assert.match(
    full,
    /pitfall/,
    "llms-full.txt drops step pitfalls. They are the only part of a guide that " +
      "is not already in the platform's own documentation, so a copy without " +
      "them keeps the half a reader could have got anywhere.",
  );
});

test("llms-full is English only", () => {
  assert.doesNotMatch(
    full,
    /translationsIn|content\/translations/,
    "llms-full.txt pulls in translations. They are machine-assisted and say so " +
      "on the page; serving them here as equivalent source text strips the one " +
      "notice that qualifies them.",
  );
});

test("both files are regenerated daily, like every page that shows a derived status", () => {
  for (const [name, src] of [["llms.txt", index], ["llms-full.txt", full]]) {
    assert.match(
      src,
      /export const revalidate = 86400/,
      `${name} has no daily revalidate. The status it prints is derived from ` +
        `today's date, so a fully static copy freezes it — the exact failure ` +
        `the expiry exists to prevent.`,
    );
  }
});
