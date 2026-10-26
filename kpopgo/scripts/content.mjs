/**
 * Reading the content registers as text, once, for everything that reads them.
 *
 * The suite installs nothing, so nothing here imports TypeScript — the two
 * registers are parsed as source text, which is why these primitives exist at
 * all. They were written inside `scripts/translations.test.mjs` and lived
 * there alone while it was the only thing reading a guide against its
 * translation.
 *
 * They are shared now because a second reader arrived, and this repository
 * has already paid for the version of that mistake where the second reader
 * gets its own copy: `BRAND_WATCH` went on pointing at `concerts.weverse.io`
 * after every guide had been corrected to the singular host, because it was
 * a different list. A fingerprint computed by a parser that disagrees with
 * the checks around it is the same bug with worse consequences — it would
 * report drift in a field nothing else can see, or miss drift in one
 * everything else reads.
 *
 * So: parsing is shared, and *field selection* is the caller's. `parts` is
 * the set a translation is checked against; the fingerprint needs a different
 * set and says so where it builds it, rather than widening this one and
 * changing what every existing assertion looks at.
 */
import { readFile } from "node:fs/promises";

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const GUIDES = await read("content/guides.ts");
const TRANSLATIONS = await read("content/translations.ts");

const unescape = (s) =>
  s
    .replace(/\\u0027/g, "'")
    .replace(/\\u0022/g, '"')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");

/** Every object literal at the given indent inside a region. */
function objects(region, indent = "      ") {
  const out = [];
  const re = new RegExp(`^${indent}\\{\\n([\\s\\S]*?)(?=^${indent}\\},)`, "gm");
  for (const m of region.matchAll(re)) out.push(m[1]);
  return out;
}

function field(block, name) {
  const m = block.match(
    new RegExp(`^\\s{4,10}${name}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`, "m"),
  );
  return m ? unescape(m[1]) : null;
}

/** Slice a named array out of a guide/translation block. */
function arrayRegion(block, name) {
  const start = block.indexOf(`    ${name}: [`);
  if (start === -1) return "";
  // Arrays here are followed by another top-level key at four spaces.
  const rest = block.slice(start);
  const end = rest.search(/\n {4}\],\n/);
  return end === -1 ? rest : rest.slice(0, end);
}

function strings(region) {
  return [...region.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => unescape(m[1]));
}

/** Split a file into per-entry blocks keyed by slug. */
function blocks(src) {
  const out = [];
  const re = /^ {4}slug: "([a-z0-9-]+)",$/gm;
  const marks = [...src.matchAll(re)];
  for (let i = 0; i < marks.length; i++) {
    const from = marks[i].index;
    const to = i + 1 < marks.length ? marks[i + 1].index : src.length;
    out.push({ slug: marks[i][1], body: src.slice(from, to) });
  }
  return out;
}

/** The parts of a guide a translation is supposed to carry. */
function parts(block) {
  const steps = objects(arrayRegion(block, "steps")).map((s) => ({
    title: field(s, "title"),
    body: field(s, "body"),
    pitfall: field(s, "pitfall"),
  }));
  const faq = objects(arrayRegion(block, "faq")).map((f) => ({
    q: field(f, "q"),
    a: field(f, "a"),
  }));
  return {
    title: field(block, "title"),
    summary: field(block, "summary"),
    scope: field(block, "scope"),
    intro: strings(arrayRegion(block, "intro")),
    steps,
    faq,
  };
}

const enGuides = new Map(blocks(GUIDES).map((b) => [b.slug, parts(b.body)]));

/**
 * The register, split per entry rather than per slug.
 *
 * A guide translated into three languages is three entries sharing a slug, so
 * the slug cannot be the key. It cannot be the *boundary* either, which is the
 * subtler half: `locale` is written above `slug` in every entry, so a block
 * running from one slug line to the next contains the following entry's locale
 * and not its own. Read that way the suite attributed Japanese prose to
 * Chinese entries it had invented, and — with only Japanese in the register —
 * silently dropped the last translation, whose block had no locale line after
 * it at all. So the boundary is the locale line, and the slug is read inside.
 */
const entries = [];
{
  const marks = [...TRANSLATIONS.matchAll(/^ {4}locale: "([a-zA-Z-]+)",$/gm)];
  for (let i = 0; i < marks.length; i++) {
    const body = TRANSLATIONS.slice(
      marks[i].index,
      i + 1 < marks.length ? marks[i + 1].index : TRANSLATIONS.length,
    );
    const slug = body.match(/^ {4}slug: "([a-z0-9-]+)",$/m)?.[1];
    if (!slug) continue;
    entries.push({ locale: marks[i][1], slug, t: parts(body) });
  }
}
const LOCALES = [...new Set(entries.map((e) => e.locale))].sort();

export {
  read,
  GUIDES,
  TRANSLATIONS,
  unescape,
  objects,
  field,
  arrayRegion,
  strings,
  blocks,
  parts,
  enGuides,
  entries,
  LOCALES,
};
