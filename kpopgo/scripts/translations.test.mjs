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
 * What this cannot check is whether the translation reads naturally, which is
 * exactly why `review` stays at machine-assisted. These assertions make the
 * facts trustworthy; they do not make the writing native, and nothing here
 * should ever be used to argue that they do.
 *
 * Deliberately narrow, because a noisy check gets switched off: numbers of two
 * digits or more, years, currency codes, product names and hostnames. English
 * spells small numbers as words ("five seconds", "one to two days") and those
 * are skipped rather than guessed at.
 *
 * Every check runs against every locale in the register. The first version
 * hard-coded `locale: "ja"`, which was fine while Japanese was the only
 * language and became a silent hole the day it was not: four Traditional
 * Chinese translations landed and the suite still reported the same 28 passes,
 * having looked at none of them. A check scoped to one locale is a check that
 * stops existing when the second one arrives.
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

/**
 * Names that are written differently in the target language on purpose.
 * Anything not listed here has to survive verbatim — a product name that
 * quietly changed is a reader who cannot find the button.
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

/** Forms each locale is additionally allowed to use for the same name. */
const LOCALE_ALIASES = {
  "zh-Hant": {
    KRW: ["韓元", "韓圜"],
    JPY: ["日圓", "日元"],
    USD: ["美元"],
    CNY: ["人民幣"],
    UnionPay: ["銀聯"],
    "American Express": ["美國運通"],
    Amex: ["美國運通"],
    Apple: ["蘋果"],
    "COVID-19": ["新冠", "新型冠狀"],
  },
  id: {
    KRW: ["won"],
    JPY: ["yen"],
    USD: ["dolar"],
    CNY: ["yuan"],
  },
};

const aliasesFor = (locale, noun) => [
  ...ALIASES[noun],
  ...(LOCALE_ALIASES[locale]?.[noun] ?? []),
];

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
 *  · The minutes of an o'clock time are dropped. "11:00 KST" is correctly
 *    11時 in Japanese and 上午11時 in Chinese, and the 00 disappears in both.
 *    Nothing is lost by dropping it: the hour is itself a two-digit number in
 *    the same string and is still checked, so 11:00 rendered as 17時 fails on
 *    the 11. A non-zero minute is not excluded, so 11:30 that lost its 30
 *    still fails.
 */
function numbers(text) {
  if (!text) return [];
  const skip = new Set();
  for (const m of text.matchAll(/COVID-(\d+)/gi)) skip.add(m[1]);
  if (/\b\d{1,2}:00\b/.test(text)) skip.add("00");
  const found = [...text.matchAll(/\b\d{1,3}(?:,\d{3})+\b|\b\d{2,}\b/g)].map((m) => m[0]);
  return found.filter((n) => !skip.has(n)).map((n) => ({ n, alt: alternatives(text, n) }));
}

/** Forms a number may legitimately take in the translation. */
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
function pairs(en, tr) {
  const out = [];
  const add = (where, a, b) => {
    if (a && b) out.push({ where, en: a, t: b });
  };
  add("title", en.title, tr.title);
  add("summary", en.summary, tr.summary);
  add("scope", en.scope, tr.scope);
  en.intro.forEach((p, i) => add(`intro[${i}]`, p, tr.intro[i]));
  en.steps.forEach((s, i) => {
    const t = tr.steps[i];
    if (!t) return;
    add(`step[${i}].title`, s.title, t.title);
    add(`step[${i}].body`, s.body, t.body);
    add(`step[${i}].pitfall`, s.pitfall, t.pitfall);
  });
  en.faq.forEach((f, i) => {
    const t = tr.faq[i];
    if (!t) return;
    add(`faq[${i}].q`, f.q, t.q);
    add(`faq[${i}].a`, f.a, t.a);
  });
  return out;
}

/** Every (entry, field pair) in the register, so no check can miss a locale. */
function* allPairs() {
  for (const e of entries) {
    const en = enGuides.get(e.slug);
    if (!en) continue;
    for (const p of pairs(en, e.t)) yield { ...p, locale: e.locale, slug: e.slug };
  }
}

const at = (p) => `${p.locale} ${p.slug} ${p.where}`;

test("the extractor actually found the content it is checking", () => {
  assert.ok(entries.length > 0, "no translations parsed");
  for (const { locale, slug, t } of entries) {
    const en = enGuides.get(slug);
    assert.ok(en, `${locale}: translation for unknown guide ${slug}`);
    assert.ok(t.steps.length > 0, `${locale} ${slug}: no steps parsed`);
    assert.equal(
      t.steps.length,
      en.steps.length,
      `${locale} ${slug}: parsed ${t.steps.length} steps against ${en.steps.length} en`,
    );
    assert.ok(pairs(en, t).length > 10, `${locale} ${slug}: suspiciously few field pairs`);
  }
});

test("every locale in the register is actually being checked", () => {
  // The hole this suite had for four translations: a locale present in the
  // register and absent from the checks reports nothing, which reads exactly
  // like a locale with no problems.
  const seen = new Set([...allPairs()].map((p) => p.locale));
  assert.deepEqual([...seen].sort(), LOCALES, "a locale in the register has no checked pairs");
});

test("every number in the English survives into the translation", () => {
  const bad = [];
  for (const p of allPairs()) {
    for (const { n, alt } of numbers(p.en)) {
      // 8,000 and 8000 are interchangeable; accept either, plus any legitimate
      // alternative form such as a converted clock hour.
      if (!p.t.includes(n) && !alt.some((a) => p.t.includes(a))) {
        bad.push(`${at(p)}: "${n}" is in the English and not the translation`);
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

test("product names and currencies are not quietly renamed", () => {
  const bad = [];
  for (const p of allPairs()) {
    for (const noun of nounsIn(p.en)) {
      if (!aliasesFor(p.locale, noun).some((a) => p.t.includes(a))) {
        bad.push(`${at(p)}: "${noun}" has no counterpart in the translation`);
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

/**
 * A translated paragraph is roughly a fixed fraction of its source's length.
 *
 * In Japanese the ratio sits between 0.35 and 0.65 with a median of 0.45,
 * because Japanese says the same thing in fewer characters and does it
 * consistently. That consistency is useful: a field far outside the band is
 * usually not a translation at all but a paragraph somebody wrote fresh,
 * which is exactly the failure the number and product-name checks only catch
 * by luck — they caught three invented intros here because those happened to
 * contain a year. One that did not would have passed.
 *
 * The band is per locale because the fraction is a property of the writing
 * system, not of translation. Chinese compresses harder than Japanese, having
 * no kana; Indonesian runs *longer* than English, because its affixes and its
 * preference for full prepositional phrases cost characters an English
 * sentence does not spend. A single band wide enough for both would be wide
 * enough to catch nothing.
 *
 * Bounds are deliberately wider than each observed range. This is a smoke
 * alarm for a rewritten or truncated field, not a style rule, and a check
 * that fires on ordinary variation is a check somebody deletes.
 */
const BAND = {
  ja: [0.3, 0.9],
  "zh-Hant": [0.22, 0.75],
  id: [0.7, 1.6],
};

test("no translated field is far longer or shorter than its source", () => {
  const bad = [];
  for (const p of allPairs()) {
    // Headings are a different population: a 60-character English step title
    // compresses to a dozen characters in Japanese and is right to. The bands
    // were measured on prose, so they are applied to prose.
    if (/\.title$|^title$/.test(p.where)) continue;
    if (p.en.length < 60) continue; // short labels vary too much to judge
    const band = BAND[p.locale];
    assert.ok(band, `${p.locale}: no length band declared for this locale`);
    const ratio = p.t.length / p.en.length;
    if (ratio < band[0] || ratio > band[1]) {
      bad.push(
        `${at(p)}: translation is ${ratio.toFixed(2)}x the English ` +
          `(${p.en.length} to ${p.t.length} characters), outside ` +
          `${band[0]}–${band[1]} — rewritten rather than translated?`,
      );
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

/**
 * Scripts that have no business being in a given translation.
 *
 * Hangul and Cyrillic are wrong everywhere: both have turned up here, a 제보자
 * left inside Japanese prose and a риスク that mixed Cyrillic into a katakana
 * word, and neither is visible to a reader who does not know the language.
 *
 * The rest is per locale and catches a different failure — a translation
 * produced in the wrong language. Kana in Chinese means a Japanese paragraph
 * was pasted in; any Han character or kana in Indonesian means the same.
 */
const FORBIDDEN = {
  ja: [[/[가-힣]/, "Hangul"], [/[Ѐ-ӿ]/, "Cyrillic"]],
  "zh-Hant": [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ]/, "kana (Japanese text in a Chinese field)"],
  ],
  id: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in an Indonesian field)"],
  ],
};

/**
 * Simplified forms whose traditional counterparts this site uses.
 *
 * Traditional rather than Simplified is a distribution decision made in
 * lib/i18n.ts, and a page that mixes the two reads as careless to exactly the
 * Taiwanese and Hong Kong readers it is for. These are the high-frequency
 * characters this content actually uses, not a complete table — a complete
 * table is a conversion library, and this is a smoke alarm.
 */
const SIMPLIFIED = [..."个们这时会后买卖发为实门关认证单价过还对国韩预费运产业应当问题号码网页请确验账边变处现间开结经续连选择项额显转换银联机构场内"];

test("no stray script or untranslated word in the translation", () => {
  const bad = [];
  for (const p of allPairs()) {
    for (const [re, name] of FORBIDDEN[p.locale] ?? []) {
      if (re.test(p.t)) bad.push(`${at(p)}: contains ${name}`);
    }
    if (p.locale === "zh-Hant") {
      const hits = [...new Set(SIMPLIFIED.filter((c) => p.t.includes(c)))];
      if (hits.length) bad.push(`${at(p)}: simplified characters ${hits.join(" ")}`);
    }
    if (p.locale !== "id") {
      if (p.t.split("（").length !== p.t.split("）").length)
        bad.push(`${at(p)}: unbalanced full-width parentheses`);
      if (p.t.split("「").length !== p.t.split("」").length)
        bad.push(`${at(p)}: unbalanced full-width quotes`);
    }
    if (p.t.split("(").length !== p.t.split(")").length)
      bad.push(`${at(p)}: unbalanced parentheses`);
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

/**
 * A field left in English passes every check above.
 *
 * Numbers survive, product names survive, the ratio is exactly 1.0 and the
 * script checks see nothing wrong, because there is nothing wrong with the
 * English — it is simply not a translation. For Japanese and Chinese the
 * script checks make this unreachable, since a field with no kana or Han
 * characters at all would be obvious. Indonesian shares the Latin alphabet
 * with English, so for Indonesian this is the only check that would catch it.
 */
test("no field was left in English", () => {
  const bad = [];
  for (const p of allPairs()) {
    if (p.en.length < 40) continue;
    if (p.t.trim() === p.en.trim()) bad.push(`${at(p)}: identical to the English`);
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});
