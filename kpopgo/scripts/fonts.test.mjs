/**
 * The one way the font subset rots quietly.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * app/fonts/*.woff2 contain exactly the Hangul this site sets today. Add a
 * Korean word with a syllable outside that set and nothing breaks loudly: the
 * page builds, the test suite passes, and one character renders in whatever
 * fallback face the reader's device supplies. On a site whose Korean is the
 * product — the words on a real booking screen — a syllable in the wrong face
 * is a typo nobody is going to catch by eye.
 *
 * So the covered set is checked against the content on every run, and the
 * failure names the characters and the command that fixes it.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { usedHangul } from "./subset-fonts.mjs";

const covered = JSON.parse(
  await readFile(new URL("../app/fonts/covered.json", import.meta.url), "utf8"),
);

test("the subset covers every Hangul character the site sets", async () => {
  const used = [...(await usedHangul())];
  const have = new Set([...covered.chars]);
  const missing = used.filter((ch) => !have.has(ch));
  assert.deepEqual(
    missing,
    [],
    `${missing.length} Hangul character(s) are not in the font subset: ` +
      `${missing.join(" ")}\n` +
      `They will render in a fallback face. Run:\n` +
      `    node scripts/subset-fonts.mjs\n` +
      `and commit the regenerated app/fonts/.`,
  );
});

test("the subset is not carrying characters the site no longer sets", async () => {
  // Not a failure, but worth seeing: dead glyphs are bytes every reader pays
  // for. A handful of leftovers after an edit is fine; a hundred means the
  // subset was generated from something other than this content.
  const used = new Set([...(await usedHangul())]);
  const extra = [...covered.chars].filter((ch) => !used.has(ch));
  assert.ok(
    extra.length < 100,
    `${extra.length} characters in the subset are no longer used anywhere. ` +
      `Regenerate with node scripts/subset-fonts.mjs.`,
  );
});

test("the committed faces are subsets, not whole fonts", async () => {
  // The guard that matters most: if Google ever ignores text= and serves the
  // full face, the build would happily ship 1.6MB again. A full Hangul woff2
  // is ~900KB upwards; a 241-glyph subset is ~20KB.
  for (const file of [
    "black-han-sans-400.woff2",
    "gothic-a1-400.woff2",
    "gothic-a1-700.woff2",
    "gothic-a1-900.woff2",
  ]) {
    const bytes = await readFile(new URL(`../app/fonts/${file}`, import.meta.url));
    assert.ok(
      bytes.length < 200_000,
      `app/fonts/${file} is ${(bytes.length / 1024).toFixed(0)}KB — that is a ` +
        `full face, not a subset of ${covered.count} characters.`,
    );
    assert.equal(
      bytes.subarray(0, 4).toString("latin1"),
      "wOF2",
      `app/fonts/${file} is not a woff2 file`,
    );
  }
});
