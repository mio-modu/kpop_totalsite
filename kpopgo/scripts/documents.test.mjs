/**
 * The copy on this site has to be the copy that was checked.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * The site serves its own copy of the venue's seating chart, reproduced under
 * 공공누리 제1유형. `scripts/watch.mjs` fingerprints the operator's file by
 * hash and reports when it is replaced, which covers one half of the problem.
 *
 * This is the other half, and it is the half that would otherwise rot in
 * silence. `--record` on a changed document clears the warning; nothing in
 * that script makes anyone replace `public/img/docs/` while they are doing
 * it. A silenced warning and a re-read source look identical afterwards —
 * this repository has already written that sentence down once, about the
 * text fingerprints, and the lesson transfers exactly.
 *
 * So the baseline and the file on disk are asserted to be the same bytes.
 * Re-recording without replacing the file now fails here rather than
 * producing a green report over a stale picture.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const src = await readFile(new URL("content/guides.ts", root), "utf8");

/**
 * Parsed rather than imported, like every other check in this directory: the
 * content is TypeScript and these are plain scripts. Each `document: {` block
 * is cut at its closing brace and read inside its own bounds.
 */
function documents() {
  const out = [];
  const re = /^ {4}document: \{$/gm;
  for (const m of src.matchAll(re)) {
    const end = src.indexOf("\n    },", m.index);
    const block = src.slice(m.index, end);
    const field = (name) => {
      const hit = block.match(new RegExp(`^\\s{6}${name}:\\s*"([^"]*)"`, "m"));
      return hit ? hit[1] : undefined;
    };
    const number = (name) => {
      const hit = block.match(new RegExp(`^\\s{6}${name}:\\s*(\\d+)`, "m"));
      return hit ? Number(hit[1]) : undefined;
    };
    out.push({
      file: field("file"),
      upstream: field("upstream"),
      sourceUrl: field("sourceUrl"),
      credit: field("credit"),
      licence: field("licence"),
      licenceUrl: field("licenceUrl"),
      taken: field("taken"),
      width: number("width"),
      height: number("height"),
    });
  }
  return out;
}

const docs = documents();

test("every reproduced document is served from a file that exists", async () => {
  for (const doc of docs) {
    assert.ok(doc.file, "a document block has no file");
    const bytes = await readFile(new URL(`public/img/${doc.file}`, root)).catch(
      () => null,
    );
    assert.ok(
      bytes && bytes.length > 2000,
      `public/img/${doc.file} is missing or empty. The component renders ` +
        `nothing when the file is absent, so this would ship as a guide with ` +
        `no chart on it and nobody would see an error.`,
    );
  }
});

test("the served copy is the one the watch recorded", async () => {
  if (docs.length === 0) return;
  const store = JSON.parse(
    await readFile(new URL("content/document-fingerprints.json", root), "utf8"),
  );
  for (const doc of docs) {
    const seen = store[doc.upstream];
    assert.ok(
      seen,
      `No fingerprint for ${doc.upstream}. Run \`npm run watch -- --record-new\`.`,
    );
    const bytes = await readFile(new URL(`public/img/${doc.file}`, root));
    const sha = createHash("sha256").update(bytes).digest("hex");
    assert.equal(
      sha,
      seen.sha256,
      `public/img/${doc.file} is not the file the watch last recorded for\n` +
        `${doc.upstream}\n` +
        `  on disk:   ${sha} (${bytes.length} bytes)\n` +
        `  recorded:  ${seen.sha256} (${seen.bytes} bytes)\n` +
        `Either the baseline was re-recorded without replacing the copy, or ` +
        `the copy was replaced without re-recording. Download the operator's ` +
        `current file into public/img/docs/, run \`npm run watch -- --record\`, ` +
        `and move the guide's document.taken date.`,
    );
  }
});

test("every reproduced document names its credit, licence and source", () => {
  for (const doc of docs) {
    for (const name of ["credit", "licence", "licenceUrl", "sourceUrl", "taken"]) {
      assert.ok(
        doc[name] && doc[name].trim() !== "",
        `${doc.file} has no ${name}. The terms are what the copy is allowed ` +
          `to exist on, and they render from this register — a document that ` +
          `cannot name them must not be on the page.`,
      );
    }
    assert.ok(
      src.includes(`url: "${doc.sourceUrl}"`),
      `${doc.file} is reproduced from ${doc.sourceUrl}, which is not cited as ` +
        `a source by any guide. Cite the page before reproducing what is on it.`,
    );
    assert.ok(
      doc.width > 0 && doc.height > 0,
      `${doc.file} has no dimensions. Without them the image reserves no ` +
        `height and the page shifts as it loads, which is the layout-shift ` +
        `cost the ad rules already refuse to pay.`,
    );
  }
});
