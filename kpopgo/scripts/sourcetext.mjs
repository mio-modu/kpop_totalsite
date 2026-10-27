/**
 * The check that fails when the English moves and its translations do not.
 *
 *   npm run sourcetext                 # report
 *   npm run sourcetext -- --record-new # baseline only the entries with none
 *   npm run sourcetext -- --record     # re-baseline deliberately, after fixing
 *
 * `sourceChecked` already catches one half of this. When a guide's
 * `lastChecked` moves, every translation of it goes `behind` and says so on
 * the page. That covers a source being re-read.
 *
 * It does not cover the English *text* changing, and that is the half that
 * kept happening. Twice in two days:
 *
 *   · Adding the word "Paris" to one line of the timezone guide meant
 *     editing three translations of that step.
 *   · Adding the Asian conversions to the same guide meant editing the same
 *     three again, plus a second step naming five more cities.
 *
 * Neither moved `lastChecked`, correctly — nobody re-checked a source to add
 * arithmetic that was already true. So every translation still read
 * `current`, and the only thing standing between a correct English page and
 * ten editions quietly disagreeing with it was somebody remembering. The step
 * and FAQ counts catch a translation short an *item*; a body string that grew
 * a sentence was invisible to every assertion in the suite. CLAUDE.md names
 * this as the precondition for ever raising the language ceiling, and this is
 * it.
 *
 * **What is fingerprinted is the English, not the translation.** The stored
 * value on a translation entry is the hash of the English fields that entry
 * mirrors, as they stood when the translation was last brought in line. So
 * the check reads "this translation was made against *that* English", and it
 * fails the moment the English is no longer that. It cannot tell whether the
 * translation is *good* — nothing here can, which is why `review` stays at
 * machine-assisted — only whether it was made against the text now on the
 * page.
 *
 * It is deliberately one hash per entry rather than per field. Per field
 * would be a few thousand hashes in a register a person reads, to buy a more
 * precise error message for a failure whose fix is the same either way: open
 * the English, open the translation, bring them in line. The report names the
 * guide and the locales, which is where the work is.
 *
 * `takes` is in the fingerprint and is *not* in `parts`, the field set the
 * translation checks read. That is on purpose: "2 minutes" becoming
 * "3 minutes" is a change a reader acts on, so it belongs here, and a
 * two-word field would fail the length-ratio band if it were added there.
 * Field selection is per purpose; the parsing underneath is shared.
 *
 * Nothing renders this. A translation whose source text has moved is not in a
 * state worth labelling on the page — unlike `behind`, which is honest and
 * temporary, it is simply wrong and the answer is to fix it.
 */
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import {
  read,
  TRANSLATIONS,
  objects,
  field,
  arrayRegion,
  strings,
  blocks,
} from "./content.mjs";

/**
 * The English fields a translation entry carries across.
 *
 * Read against `content/translations.ts`'s own `Translation` type rather than
 * chosen: title, summary, scope, intro, the steps and the FAQ are what the
 * translated template renders. `status`, `lastChecked`, `sources`, `see` and
 * `partner` are deliberately out — a translation does not mirror them, so a
 * citation being added should not flag ten editions as out of date.
 */
export function mirrored(block) {
  return {
    title: field(block, "title"),
    summary: field(block, "summary"),
    scope: field(block, "scope"),
    intro: strings(arrayRegion(block, "intro")),
    steps: objects(arrayRegion(block, "steps")).map((s) => ({
      title: field(s, "title"),
      body: field(s, "body"),
      pitfall: field(s, "pitfall"),
      takes: field(s, "takes"),
    })),
    faq: objects(arrayRegion(block, "faq")).map((f) => ({
      q: field(f, "q"),
      a: field(f, "a"),
    })),
  };
}

/**
 * Twelve hex characters of SHA-256 over the canonical form.
 *
 * JSON rather than a concatenation, so that text moving from one field to
 * another changes the hash: a sentence cut from a step body and pasted into
 * the summary is a change both translations have to follow, and a plain join
 * would read as identical.
 *
 * Twelve characters is 48 bits. These are compared for equality against a
 * value written by this same script, never searched for or guessed, so the
 * only collision that matters is between two *versions of one guide* — and
 * at that width a person reading the register can still tell two entries
 * apart at a glance, which a full hash makes harder.
 */
export function fingerprint(block) {
  return createHash("sha256")
    .update(JSON.stringify(mirrored(block)))
    .digest("hex")
    .slice(0, 12);
}

/** Every English guide's current fingerprint, by slug. */
export function englishFingerprints(src) {
  return new Map(blocks(src).map((b) => [b.slug, fingerprint(b.body)]));
}

/**
 * Translation entries with their stored value, bounded by the locale line.
 *
 * The boundary is `locale` and not `slug` for the reason the register records
 * at length: `locale` is written above `slug` in every entry, so a block
 * running slug-to-slug carries the *next* entry's locale and drops the last
 * entry entirely.
 */
export function storedEntries(src) {
  const marks = [...src.matchAll(/^ {4}locale: "([a-zA-Z-]+)",$/gm)];
  const out = [];
  for (let i = 0; i < marks.length; i++) {
    const from = marks[i].index;
    const to = i + 1 < marks.length ? marks[i + 1].index : src.length;
    const body = src.slice(from, to);
    const slug = body.match(/^ {4}slug: "([a-z0-9-]+)",$/m)?.[1];
    if (!slug) continue;
    out.push({
      locale: marks[i][1],
      slug,
      // `*` rather than `+`, and `||` rather than `??`, both for the same
      // entry: one written with `sourceText: ""`. The field is required by
      // the type, so staging a new translation means writing the key with
      // nothing in it, and a `+` pattern does not see that key at all. Ten
      // entries went in that way and `--record-new` inserted a second
      // `sourceText` above each empty one instead of filling it. In
      // JavaScript the later key wins, so every hash it had just written was
      // dead on arrival, the report said it had written them, and the suite
      // agreed — only `tsc` caught it, as TS1117. An empty value is no value.
      stored: body.match(/^ {4}sourceText: "([0-9a-f]*)",$/m)?.[1] || null,
      from,
      to,
    });
  }
  return out;
}

/** What the report and the test both work from. */
export function audit(guidesSrc, translationsSrc) {
  const en = englishFingerprints(guidesSrc);
  const rows = storedEntries(translationsSrc).map((e) => {
    const want = en.get(e.slug) ?? null;
    return {
      ...e,
      want,
      state:
        want === null ? "orphan" : e.stored === null ? "missing" : e.stored === want ? "ok" : "drift",
    };
  });
  return { en, rows };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

/**
 * Writing the baseline, with the asymmetry `watch.mjs` already earned.
 *
 * `--record-new` fills only the entries that have no value, which is what a
 * newly translated guide needs. `--record` overwrites, which is the
 * deliberate case: the translations have just been brought in line and the
 * new English is what they were made against.
 *
 * The distinction is the whole safeguard. A blanket overwrite is also exactly
 * how somebody in a hurry makes a drift warning disappear without touching a
 * translation, and afterwards a silenced warning and a fixed one look
 * identical — which is the sentence `watch.mjs` carries for the same reason.
 */
async function record(all) {
  const { rows } = audit(await read("content/guides.ts"), TRANSLATIONS);
  const targets = rows.filter(
    (r) => r.want !== null && (all ? r.state !== "ok" : r.state === "missing"),
  );
  if (!targets.length) {
    console.log("nothing to write.");
    return 0;
  }

  // Latest offset first, so an earlier insertion never shifts a later one.
  let src = TRANSLATIONS;
  for (const r of [...targets].sort((a, b) => b.from - a.from)) {
    const body = src.slice(r.from, r.to);
    // Matches an empty value too, so a staged entry is filled in place
    // rather than gaining a second key. See the note in storedEntries.
    const line = body.match(/^ {4}sourceText: "[0-9a-f]*",$/m);
    let next;
    if (line) {
      next = body.replace(line[0], `    sourceText: "${r.want}",`);
    } else {
      const anchor = body.match(/^ {4}sourceChecked: "[0-9-]+",$/m);
      if (!anchor) throw new Error(`${r.locale}/${r.slug}: no sourceChecked to anchor to`);
      next = body.replace(anchor[0], `${anchor[0]}\n    sourceText: "${r.want}",`);
    }
    src = src.slice(0, r.from) + next + src.slice(r.to);
  }

  await writeFile(new URL("../content/translations.ts", import.meta.url), src);
  console.log(`wrote ${targets.length} ${all ? "(--record, overwriting)" : "(--record-new)"}`);
  for (const r of targets) console.log(`  ${r.locale.padEnd(8)} ${r.slug}`);
  return 0;
}

async function report() {
  const { rows } = audit(await read("content/guides.ts"), TRANSLATIONS);
  const by = (s) => rows.filter((r) => r.state === s);

  const drift = by("drift");
  const missing = by("missing");
  const orphan = by("orphan");

  console.log(`${rows.length} translation entries\n`);

  if (drift.length) {
    console.log("DRIFT — the English moved and these did not:\n");
    const guides = [...new Set(drift.map((r) => r.slug))];
    for (const slug of guides) {
      const locales = drift.filter((r) => r.slug === slug).map((r) => r.locale);
      console.log(`  ${slug}`);
      console.log(`    ${locales.length} edition${locales.length > 1 ? "s" : ""}: ${locales.join(", ")}`);
    }
    console.log(
      "\n  Bring each one in line with the English, then re-baseline with\n" +
        "  `npm run sourcetext -- --record`. Recording without fixing is how a\n" +
        "  warning gets silenced, and afterwards nobody can tell which it was.\n",
    );
  }
  if (missing.length) {
    console.log(`NO BASELINE — ${missing.length} entr${missing.length > 1 ? "ies" : "y"}:\n`);
    for (const r of missing) console.log(`  ${r.locale.padEnd(8)} ${r.slug}`);
    console.log("\n  `npm run sourcetext -- --record-new` writes only these.\n");
  }
  if (orphan.length) {
    console.log("ORPHAN — translation of a guide that no longer exists:\n");
    for (const r of orphan) console.log(`  ${r.locale.padEnd(8)} ${r.slug}`);
    console.log("");
  }
  if (!drift.length && !missing.length && !orphan.length) {
    console.log("ALL IN LINE — every translation was made against the English now on the page.");
  }
  return drift.length || orphan.length ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const code = argv.includes("--record")
    ? await record(true)
    : argv.includes("--record-new")
      ? await record(false)
      : await report();
  process.exit(code);
}
