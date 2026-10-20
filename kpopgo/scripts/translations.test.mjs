/**
 * What a translation must carry across, asserted rather than hoped for.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * The translations on this site are machine-assisted and say so. That is an
 * honest label and it is not a safety net, so this is the net: the class of
 * error that actually hurts a reader is a number that changed in translation.
 * A deadline that reads 17時 instead of 11時, a fee of 3,000 where the source
 * says 8,000, a 2026 that became 2025 — each of those is a factual error
 * wearing fluent prose, and no amount of reading it back catches them
 * reliably. A machine does.
 *
 * What this cannot check is whether the Japanese reads naturally, which is
 * exactly why `review` stays at machine-assisted. These assertions make the
 * facts trustworthy; they do not make the writing native, and nothing here
 * should ever be used to argue that they do.
 *
 * Deliberately narrow, because a noisy check gets switched off: numbers of two
 * digits or more, years, currency codes, product names and hostnames. English
 * spells small numbers as words ("five seconds", "one to two days") and those
 * are skipped rather than guessed at.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
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
const jaBlocks = blocks(TRANSLATIONS).filter((b) => /locale: "ja"/.test(b.body));
const ja = new Map(jaBlocks.map((b) => [b.slug, parts(b.body)]));

/**
 * Names that are written differently in Japanese on purpose. Anything not
 * listed here has to survive verbatim — a product name that quietly changed
 * is a reader who cannot find the button.
 */
const ALIASES = {
  Toss: ["トス", "Toss"],
  "Google Play": ["Google Play"],
  Apple: ["Apple", "アップル"],
  Google: ["Google", "グーグル"],
  Line: ["LINE", "Line"],
  LINE: ["LINE"],
  "American Express": ["アメリカン・エキスプレス", "American Express", "Amex", "AMEX"],
  Amex: ["Amex", "AMEX", "アメリカン・エキスプレス"],
  UnionPay: ["UnionPay", "ユニオンペイ", "銀聯"],
  PayPal: ["PayPal"],
  Eximbay: ["Eximbay"],
  Weverse: ["Weverse"],
  "NOL World": ["NOL World"],
  "NOL Ticket": ["NOL Ticket", "NOL ticket"],
  YES24: ["YES24"],
  KISA: ["KISA"],
  CPSC: ["CPSC"],
  "Galaxy Fold": ["Galaxy Fold"],
  Chrome: ["Chrome"],
  Edge: ["Edge"],
  Safari: ["Safari"],
  "Samsung Internet": ["Samsung Internet"],
  facepass: ["facepass"],
  KRW: ["KRW", "ウォン", "韓国ウォン"],
  JPY: ["JPY", "円"],
  USD: ["USD", "米ドル", "ドル"],
  MXN: ["MXN"],
  CNY: ["CNY", "人民元"],
  KST: ["KST"],
  "COVID-19": ["新型コロナ", "COVID-19"],
};

const NOUNS = Object.keys(ALIASES);

/**
 * Numbers worth checking: two digits or more, comma groups included.
 *
 * Two exclusions, both earned by a false positive rather than guessed at:
 *
 *  · A 12-hour clock time is correctly written on a 24-hour clock in Japanese,
 *    so "11:59 PM" becomes 23時59分 and the 11 legitimately disappears. The
 *    converted hour is offered as an alternative rather than the check being
 *    dropped, so a 5pm that became 15時 would still fail.
 *  · COVID-19 is 新型コロナウイルス in Japanese and carries no 19. The name is
 *    checked as a product name instead, where the alias belongs.
 */
function numbers(text) {
  if (!text) return [];
  const skip = new Set();
  for (const m of text.matchAll(/COVID-(\d+)/gi)) skip.add(m[1]);
  const found = [...text.matchAll(/\b\d{1,3}(?:,\d{3})+\b|\b\d{2,}\b/g)].map((m) => m[0]);
  return found.filter((n) => !skip.has(n)).map((n) => ({ n, alt: alternatives(text, n) }));
}

/** Forms a number may legitimately take in the Japanese. */
function alternatives(text, n) {
  const alts = [n.replace(/,/g, "")];
  // 12-hour to 24-hour: match this number as the hour of an am/pm time.
  const re = new RegExp(`\\b${n}(?::(\\d{2}))?\\s*(a\\.?m\\.?|p\\.?m\\.?)`, "i");
  const m = text.match(re);
  if (m) {
    const h = Number(n);
    if (h >= 1 && h <= 12) {
      const pm = /p/i.test(m[2]);
      const h24 = pm ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
      alts.push(String(h24));
    }
  }
  return alts;
}

function nounsIn(text) {
  if (!text) return [];
  return NOUNS.filter((n) => text.includes(n));
}

/** Pair up the fields of a guide and its translation. */
function pairs(en, jp) {
  const out = [];
  const add = (where, a, b) => {
    if (a && b) out.push({ where, en: a, ja: b });
  };
  add("title", en.title, jp.title);
  add("summary", en.summary, jp.summary);
  add("scope", en.scope, jp.scope);
  en.intro.forEach((p, i) => add(`intro[${i}]`, p, jp.intro[i]));
  en.steps.forEach((s, i) => {
    const t = jp.steps[i];
    if (!t) return;
    add(`step[${i}].title`, s.title, t.title);
    add(`step[${i}].body`, s.body, t.body);
    add(`step[${i}].pitfall`, s.pitfall, t.pitfall);
  });
  en.faq.forEach((f, i) => {
    const t = jp.faq[i];
    if (!t) return;
    add(`faq[${i}].q`, f.q, t.q);
    add(`faq[${i}].a`, f.a, t.a);
  });
  return out;
}

test("the extractor actually found the content it is checking", () => {
  assert.ok(ja.size > 0, "no Japanese translations parsed");
  for (const [slug, jp] of ja) {
    const en = enGuides.get(slug);
    assert.ok(en, `translation for unknown guide ${slug}`);
    assert.ok(jp.steps.length > 0, `${slug}: no steps parsed from the translation`);
    assert.equal(
      jp.steps.length,
      en.steps.length,
      `${slug}: parsed ${jp.steps.length} ja steps against ${en.steps.length} en`,
    );
    assert.ok(pairs(en, jp).length > 10, `${slug}: suspiciously few field pairs`);
  }
});

test("every number in the English survives into the Japanese", () => {
  const bad = [];
  for (const [slug, jp] of ja) {
    for (const { where, en, ja: j } of pairs(enGuides.get(slug), jp)) {
      for (const { n, alt } of numbers(en)) {
        // Japanese writes 8,000 and 8000 interchangeably; accept either, plus
        // any legitimate alternative form such as a converted clock hour.
        if (!j.includes(n) && !alt.some((a) => j.includes(a))) {
          bad.push(`${slug} ${where}: "${n}" is in the English and not the Japanese`);
        }
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

test("product names and currencies are not quietly renamed", () => {
  const bad = [];
  for (const [slug, jp] of ja) {
    for (const { where, en, ja: j } of pairs(enGuides.get(slug), jp)) {
      for (const noun of nounsIn(en)) {
        if (!ALIASES[noun].some((a) => j.includes(a))) {
          bad.push(`${slug} ${where}: "${noun}" has no counterpart in the Japanese`);
        }
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

/**
 * A translated paragraph is roughly a fixed fraction of its source's length.
 *
 * Across this content the ratio sits between 0.35 and 0.65 with a median of
 * 0.45, because Japanese says the same thing in fewer characters and does it
 * consistently. That consistency is useful: a field far outside the band is
 * usually not a translation at all but a paragraph somebody wrote fresh,
 * which is exactly the failure the number and product-name checks only catch
 * by luck — they caught three invented intros here because those happened to
 * contain a year. One that did not would have passed.
 *
 * Bounds are deliberately wider than the observed range. This is a smoke
 * alarm for a rewritten or truncated field, not a style rule, and a check
 * that fires on ordinary variation is a check somebody deletes.
 */
test("no translated field is far longer or shorter than its source", () => {
  const bad = [];
  for (const [slug, jp] of ja) {
    for (const { where, en, ja: j } of pairs(enGuides.get(slug), jp)) {
      // Headings are a different population: Japanese compresses a 60-character
      // English step title into a dozen characters and is right to. The band
      // below was measured on prose, so it is applied to prose.
      if (/\.title$|^title$/.test(where)) continue;
      if (en.length < 60) continue; // short labels vary too much to judge
      const ratio = j.length / en.length;
      if (ratio < 0.3 || ratio > 0.9) {
        bad.push(
          `${slug} ${where}: Japanese is ${ratio.toFixed(2)}x the English ` +
            `(${en.length} to ${j.length} characters) — rewritten rather than translated?`,
        );
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

test("no stray script or untranslated word in the Japanese", () => {
  const bad = [];
  for (const [slug, jp] of ja) {
    for (const { where, ja: j } of pairs(enGuides.get(slug), jp)) {
      if (/[가-힣]/.test(j)) bad.push(`${slug} ${where}: contains Hangul`);
      if (/[Ѐ-ӿ]/.test(j)) bad.push(`${slug} ${where}: contains Cyrillic`);
      if (j.split("（").length !== j.split("）").length)
        bad.push(`${slug} ${where}: unbalanced full-width parentheses`);
      if (j.split("「").length !== j.split("」").length)
        bad.push(`${slug} ${where}: unbalanced full-width quotes`);
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});
