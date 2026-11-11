/**
 * The assertion the register was missing: English moved, translation did not.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * Everything about *why* is in `scripts/sourcetext.mjs`. The short version is
 * that `sourceChecked` catches a source being re-read and nothing caught the
 * English text being edited, so ten editions could disagree with the page
 * while every date still read `current` — and twice in two days they nearly
 * did.
 *
 * This runs in the per-change gate, which is the point of putting it here
 * rather than in the weekly network sweep. The failure it catches is created
 * by a commit, so it has to be caught by one.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { read, TRANSLATIONS } from "./content.mjs";
import { audit, fingerprint, mirrored } from "./sourcetext.mjs";

const GUIDES = await read("content/guides.ts");
const { rows } = audit(GUIDES, TRANSLATIONS);

test("every translation was made against the English now on the page", () => {
  const drift = rows.filter((r) => r.state === "drift");
  const detail = drift.map(
    (r) => `${r.locale}/${r.slug}: stored ${r.stored}, English is now ${r.want}`,
  );
  assert.deepEqual(
    detail,
    [],
    `\n${detail.join("\n")}\n\n` +
      `The English text of these guides has changed since the translation was\n` +
      `made. Bring each translation in line, then re-baseline with\n` +
      `\`npm run sourcetext -- --record\`.\n\n` +
      `Recording without fixing is the one thing this check cannot see, and\n` +
      `afterwards a silenced warning and a fixed one look identical — the same\n` +
      `reason scripts/watch.mjs keeps --record-new separate.\n`,
  );
});

test("every translation carries a source-text baseline", () => {
  const missing = rows.filter((r) => r.state === "missing").map((r) => `${r.locale}/${r.slug}`);
  assert.deepEqual(
    missing,
    [],
    `\n${missing.join("\n")}\n\nA new translation needs a baseline: ` +
      `\`npm run sourcetext -- --record-new\` writes only the missing ones.\n`,
  );
});

test("no baseline is stored against a guide that no longer exists", () => {
  const orphan = rows.filter((r) => r.state === "orphan").map((r) => `${r.locale}/${r.slug}`);
  assert.deepEqual(orphan, [], `\n${orphan.join("\n")}\n`);
});

/**
 * The fingerprint has to notice a sentence moving between fields.
 *
 * A concatenation would not: text cut from a step body and pasted into the
 * summary produces the same joined string, and both translations have to
 * follow that edit. This is why the canonical form is JSON and not a join,
 * asserted rather than left as a comment, because the cheaper implementation
 * is the obvious one for somebody simplifying this later.
 */
test("the fingerprint is sensitive to which field text sits in", () => {
  const block = `    slug: "x",
    title: "A",
    summary: "B",
    scope: "C",
    intro: [
      "one",
    ],
    steps: [
      {
        title: "s",
        body: "body text",
        takes: "2 minutes",
      },
    ],
    faq: [
      {
        q: "q",
        a: "a",
      },
    ],
`;
  const moved = block.replace('summary: "B"', 'summary: "B body text"').replace('body: "body text"', 'body: ""');
  assert.notEqual(fingerprint(block), fingerprint(moved));
});

/** `takes` is mirrored by a translation, so a changed duration must register. */
test("the fingerprint covers takes, which the translation checks do not read", () => {
  const block = `    slug: "x",
    title: "A",
    summary: "B",
    scope: "C",
    steps: [
      {
        title: "s",
        body: "b",
        takes: "2 minutes",
      },
    ],
`;
  const slower = block.replace('"2 minutes"', '"9 minutes"');
  assert.equal(mirrored(block).steps[0].takes, "2 minutes");
  assert.notEqual(fingerprint(block), fingerprint(slower));
});

/**
 * And has to ignore what a translation does not carry.
 *
 * A guide gaining a citation or moving to `verified` is not an edit any
 * translation has to follow, and a check that flagged ten editions for it
 * would be the permanent false alarm this repository already has a rule
 * about.
 */
test("the fingerprint ignores fields no translation mirrors", () => {
  const block = `    slug: "x",
    title: "A",
    summary: "B",
    scope: "C",
    status: "sourced",
    lastChecked: "2026-10-01",
    steps: [
      {
        title: "s",
        body: "b",
      },
    ],
`;
  for (const [from, to] of [
    ['status: "sourced"', 'status: "verified"'],
    ['lastChecked: "2026-10-01"', 'lastChecked: "2026-11-30"'],
  ]) {
    assert.equal(fingerprint(block), fingerprint(block.replace(from, to)), `${from} should not matter`);
  }
});

/**
 * An entry staged with an empty value is missing, not adrift.
 *
 * `sourceText` is required by the type, so a newly written translation has to
 * carry the key with nothing in it until the baseline is recorded. That is the
 * normal way a translation arrives, and it used to read as a drift: the stored
 * pattern wanted at least one hex character, so it did not see the key, and
 * `--record-new` added a second `sourceText` above the empty one rather than
 * filling it. The later key wins in JavaScript, so the hash it reported
 * writing was never the hash in force. Ten entries went in that way in one
 * sitting and only `tsc` objected, as TS1117 — nothing in this suite did,
 * which is why this test is here rather than a comment.
 */
test("a staged entry with an empty baseline reads as missing", () => {
  const slug = rows.find((r) => r.want !== null).slug;
  const staged = [
    "export const translations: Translation[] = [",
    "  {",
    '    locale: "ja",',
    `    slug: "${slug}",`,
    '    sourceChecked: "2026-10-23",',
    '    sourceText: "",',
    "  },",
    "];",
  ].join("\n");
  const [row] = audit(GUIDES, staged).rows;
  assert.equal(row.state, "missing", "an empty baseline is no baseline");
  assert.equal(row.stored, null, "an empty value must not be read as a hash");
});
