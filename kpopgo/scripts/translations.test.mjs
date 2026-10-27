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

// The registers are parsed as text in scripts/content.mjs, which is shared
// with the source-text fingerprint rather than copied into it. Field
// selection stays here: `parts` is the set a translation is checked
// against, and widening it would change what every assertion below reads.
import {
  read,
  field,
  strings,
  enGuides,
  entries,
  LOCALES,
} from "./content.mjs";

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
  // Amex and American Express are one name with two spellings, so each entry
  // carries the other. A translation that spells out what the English
  // abbreviated has not renamed anything — Spanish, for one, does not use
  // the short form at all.
  Amex: ["Amex", "AMEX", "American Express", "アメリカン・エキスプレス"],
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
  // German needs almost nothing listed by hand, because its one systematic
  // difference is handled as a rule below: it welds a brand onto the noun it
  // qualifies and hyphenates every join, so an American Express card is an
  // American-Express-Karte and a NOL World ticket is a NOL-World-Ticket. The
  // name is intact and correctly set; the space is what the plain check was
  // looking for.
  de: {
    UnionPay: ["China UnionPay", "UnionPay"],
    // German prose writes the currency out and rarely reaches for the ISO
    // code, the same way Chinese writes 美元 and Indonesian writes dolar.
    USD: ["US-Dollar", "USD"],
    KRW: ["Won", "KRW"],
    JPY: ["Yen", "JPY"],
  },
  es: {
    KRW: ["won"],
    JPY: ["yen"],
    USD: ["dólar", "dolar"],
    CNY: ["yuan"],
    "American Express": ["American Express"],
  },
};

/**
 * Locales that group thousands with a period rather than a comma.
 *
 * 2,000 KRW is written 2.000 KRW in German, Indonesian and Spanish, and that
 * is the correct form rather than a liberty taken by the translator — so the
 * period form is offered as an alternative, exactly as the converted 24-hour
 * clock is for Japanese. The digits are still checked: a 2.000 that became
 * 3.000 still fails, and so does one that lost its thousands entirely.
 *
 * Earned by a false positive. The YES24 booking fee is the only place on the
 * site where a four-digit money amount appears in prose, which is why this
 * surfaced on the twelfth German page rather than the first.
 */
// Vietnamese joins this set: 8.000 is how a Vietnamese page writes 8,000,
// and the decimal mark inverts with it. Thai and Filipino both group with a
// comma exactly as English does, so neither needs an entry — which is worth
// saying out loud, because "no entry" and "nobody checked" look the same.
const PERIOD_THOUSANDS = new Set(["de", "id", "es", "pt-BR", "vi"]);

/**
 * French groups thousands with a space, not a period: 8 000, never 8.000.
 *
 * Which space varies and all three are correct in the wild — a plain space, a
 * no-break space, or the narrow no-break space typography actually asks for —
 * so all three are accepted rather than picking one and failing honest text.
 * Without this the number check reads a correctly written French "8 000" as a
 * missing 8,000 and fails every page that quotes a fee.
 */
const SPACE_THOUSANDS = new Set(["fr"]);
const THOUSAND_SPACES = [" ", "\u00A0", "\u202F"];

/**
 * German hyphenates a multi-word name into the compound it forms.
 *
 * Enumerating the compounds was the first attempt and it was wrong in the way
 * a table is always wrong: it listed American-Express because that page had
 * been written, and said nothing about NOL-World until the next page failed.
 * The difference is systematic, so it is a rule — every multi-word name gets
 * its hyphenated form for free, which covers the names nobody has written yet.
 */
const hyphenated = (locale, forms) =>
  locale === "de"
    ? forms.filter((f) => f.includes(" ")).map((f) => f.replace(/ /g, "-"))
    : [];

const aliasesFor = (locale, noun) => {
  const forms = [...ALIASES[noun], ...(LOCALE_ALIASES[locale]?.[noun] ?? [])];
  // Derived from every accepted form rather than from the key, so the German
  // compound of an alias is covered too: Amex accepts "American Express",
  // which in German is written American-Express-Karte.
  return [...forms, ...hyphenated(locale, forms)];
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
      // alternative form such as a converted clock hour or a period-grouped
      // thousand in the locales that write them that way.
      const forms = [...alt];
      if (PERIOD_THOUSANDS.has(p.locale) && n.includes(",")) {
        forms.push(n.replace(/,/g, "."));
      }
      if (SPACE_THOUSANDS.has(p.locale) && n.includes(",")) {
        for (const sp of THOUSAND_SPACES) forms.push(n.replace(/,/g, sp));
      }
      if (!p.t.includes(n) && !forms.some((a) => p.t.includes(a))) {
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
  // German runs longer than English for the same reason Indonesian does and
  // then some: compounds replace phrases, but case endings, separable verbs
  // and the longer words themselves cost more characters than they save.
  de: [0.8, 1.7],
  // Spanish runs longer than English and for the plainest reason of the four:
  // it spends words where English compounds. "Ticketing account" becomes
  // "cuenta de venta de entradas", and the preposition is not optional. It is
  // tighter than German, which also builds compounds, and looser than
  // Indonesian, which does not inflect.
  es: [0.85, 1.6],
  // Brazilian Portuguese sits beside Spanish and very slightly wider. It
  // spends the same prepositions ("conta de venda de ingressos"), and adds a
  // little on top: mesoclisis is rare but the enclitic hyphens are not, and
  // "você" where Spanish drops the pronoun entirely.
  "pt-BR": [0.85, 1.7],
  // French is the widest of the Latin set. It spends the prepositions
  // Spanish spends and then adds its own: "de la", "à la", the obligatory
  // subject pronoun, and a politeness register that does not contract.
  fr: [0.9, 1.8],
  // Vietnamese runs longer than English for a reason none of the others
  // share: it is written in separate syllables, so a word English sets solid
  // arrives here as two or three space-separated pieces. "Ticketing account"
  // is "tai khoan ban ve" — four of them. The diacritics cost nothing in a
  // character count, being combined into the letters, so the whole excess is
  // the syllable spacing and the prepositions.
  vi: [0.8, 1.7],
  // Thai is the first non-spacing script here that is not CJK, and it sits
  // between the two groups. It compresses like Chinese does — no spaces at
  // all, and a cluster of marks riding one base letter — but each syllable
  // is still several characters where a Han character is one. Observed
  // around 0.7; the band is wide because the compression varies a lot with
  // how many loanwords a passage carries, and a page about NOL World and
  // 3-D Secure carries many.
  th: [0.45, 1.2],
  // Filipino is the widest band on the list, and earns it twice over. It
  // spends the particles English does not write at all — "ang", "ng", "sa"
  // in front of nearly every noun — and then builds verbs by stacking
  // affixes and reduplicating syllables onto a root, so "to be able to
  // collect" becomes one long word rather than four short ones. Those two
  // pull in opposite directions, which is exactly why the band is loose:
  // neither effect is reliable enough to narrow it around.
  fil: [0.9, 1.9],
};

test("no translated field is far longer or shorter than its source", () => {
  const bad = [];
  for (const p of allPairs()) {
    // Headings are a different population: a 60-character English step title
    // compresses to a dozen characters in Japanese and is right to. The bands
    // were measured on prose, so they are applied to prose.
    // Headings are a different population: a 60-character English step title
    // compresses to a dozen characters in Japanese and is right to.
    //
    // An FAQ question is the same population and is excluded for the same
    // reason. They are short, and they are dense with product names that
    // cannot compress — "Can I pay for a Global Membership with my own Visa or
    // Mastercard?" is two thirds untranslatable, so the ratio measures the
    // names rather than the prose and lands wherever the names fall.
    //
    // An attempt to be cleverer about this — stripping Latin runs from both
    // sides before measuring — made it worse, because an all-English source
    // strips to nothing and falls back to its full length while the Chinese
    // keeps only its Han characters. That compares 13 against 60 and fails
    // correct translations. The answers are still checked, and an answer is
    // where a rewritten field would actually cost a reader something.
    if (/\.title$|^title$|\.q$/.test(p.where)) continue;
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
  de: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a German field)"],
  ],
  es: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a Spanish field)"],
  ],
  // pt-BR and fr were added without entries here, which was a gap rather
  // than a decision: every other Latin-script locale on the list carries
  // these three, and the whole point of the table is that it covers every
  // locale in the register. Filled in with the rest rather than separately,
  // because a check that is only remembered when somebody is already editing
  // it is a check that will be forgotten again.
  "pt-BR": [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a Portuguese field)"],
  ],
  fr: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a French field)"],
  ],
  // Thai is now a script on this site, so every other locale has to be able
  // to say it does not belong there. The reverse direction is the next test.
  vi: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a Vietnamese field)"],
    [/[\u0E00-\u0E7F]/, "Thai (Thai text in a Vietnamese field)"],
  ],
  th: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a Thai field)"],
  ],
  fil: [
    [/[가-힣]/, "Hangul"],
    [/[Ѐ-ӿ]/, "Cyrillic"],
    [/[぀-ゟ゠-ヿ一-鿿]/, "CJK (East Asian text in a Filipino field)"],
    [/[\u0E00-\u0E7F]/, "Thai (Thai text in a Filipino field)"],
  ],
};

/**
 * Spanish opens its questions and exclamations, and a machine translation
 * drops the opening mark.
 *
 * This is Spanish's equivalent of the Simplified-character table: a rule the
 * language has that English does not, so nothing upstream enforces it, and
 * one that a reader of the language notices in the first second. Every FAQ
 * entry on this site is a question, so in Spanish every one of them has to
 * carry ¿ as well as ?, and the inverted mark opens the question rather than
 * the sentence — "Si la verificación falla, ¿qué hago?" is correct and
 * "¿Si la verificación falla, qué hago?" is not, which is why the check looks
 * for presence rather than position.
 *
 * It is cheap and it is not cosmetic. A guide whose headings are visibly not
 * written by someone who knows the language undercuts the one thing this site
 * sells, on the pages where a reader decides whether to trust it.
 */
/**
 * Quotation marks belong to the language, and the wrong ones are a fingerprint.
 *
 * German opens a quotation low and closes it high — „so“ — and Spanish uses
 * angle quotes, «así», or the ordinary curly pair. A German quotation mark
 * sitting in Spanish prose is not a style quibble: it is evidence the field
 * was written in the same sitting as a German one and carried the habit
 * across, which is exactly how it got here. The first Spanish card guide
 * shipped with „tu verificación está pendiente“ for that reason.
 *
 * Caught by a reader of either language in the first second, invisible to
 * every other check on this page, and free to assert.
 */
const QUOTES = {
  es: [[/[„“]/, "German quotation marks (use « » or “ ”)"]],
  de: [[/[«»]/, "Spanish angle quotes (use „ “)"]],
  // Brazil sets quotation marks the way English does. The angle quotes are
  // European Portuguese and the low opening mark is German; either one in a
  // Brazilian page is a sign the text came from the wrong edition.
  "pt-BR": [
    [/[«»]/, "European Portuguese angle quotes (Brazil uses “ ”)"],
    [/[„]/, "German opening quotation mark (Brazil uses “ ”)"],
  ],
  // French sets guillemets, so « » is correct here and is not flagged. The
  // low opening mark is German and nothing else.
  fr: [[/[„]/, "German opening quotation mark (French uses « »)"]],
  // The three new editions all set the ordinary curly pair. Vietnamese does
  // use guillemets in some formal registers, so « » is left alone there and
  // only the German low mark is flagged; Thai and Filipino use neither, so
  // both marks are a sign the field was written alongside a European one.
  vi: [[/[„]/, "German opening quotation mark (Vietnamese uses “ ”)"]],
  th: [
    [/[„]/, "German opening quotation mark (Thai uses “ ”)"],
    [/[«»]/, "French angle quotes (Thai uses “ ”)"],
  ],
  fil: [
    [/[„]/, "German opening quotation mark (Filipino uses “ ”)"],
    [/[«»]/, "French angle quotes (Filipino uses “ ”)"],
  ],
};

test("quotation marks match the language", () => {
  const bad = [];
  for (const p of allPairs()) {
    for (const [re, why] of QUOTES[p.locale] ?? []) {
      if (re.test(p.t)) bad.push(`${at(p)}: ${why}`);
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

test("Spanish questions and exclamations carry their opening mark", () => {
  const bad = [];
  for (const p of allPairs()) {
    if (p.locale !== "es") continue;
    const t = p.t.trim();
    if (/\?/.test(t) && !t.includes("¿"))
      bad.push(`${at(p)}: has ? with no ¿ — "${t.slice(0, 70)}"`);
    if (/!/.test(t) && !t.includes("¡"))
      bad.push(`${at(p)}: has ! with no ¡ — "${t.slice(0, 70)}"`);
  }
  assert.deepEqual(
    bad,
    [],
    `\n${bad.join("\n")}\n\nSpanish opens a question with ¿ and an ` +
      `exclamation with ¡. A field carrying only the closing mark was ` +
      `translated without them.\n`,
  );
});

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
 * characters at all would be obvious. Indonesian, German and Spanish
 * share the Latin alphabet with English, so for those three this is the only
 * check that would catch it — and German is the likeliest to produce a field
 * left alone, because enough English sentences are near enough to German that
 * one can look translated at a glance.
 */
test("no field was left in English", () => {
  const bad = [];
  for (const p of allPairs()) {
    if (p.en.length < 40) continue;
    if (p.t.trim() === p.en.trim()) bad.push(`${at(p)}: identical to the English`);
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

/**
 * The same question asked from the other side, for Thai.
 *
 * The check above catches a field copied from the English verbatim. It does
 * not catch one that was edited a little, or one that is a different
 * language's text pasted into the wrong locale — and for the Latin-script
 * editions nothing can, which is why that check is as far as it goes there.
 *
 * Thai is the first locale on this site where the opposite assertion is
 * available and cheap: a Thai field has to contain Thai. The ja and zh-Hant
 * entries have had this implicitly all along, because a field with no kana
 * or Han in it would be obvious to anyone glancing at the file; Thai is
 * newer here and nobody's eye is trained on it yet, so it is asserted rather
 * than assumed.
 *
 * Short fields are skipped on the same threshold the English check uses,
 * because a `takes` field is legitimately "15 นาที" or, occasionally, a bare
 * dash.
 */
const THAI = /[\u0E00-\u0E7F]/;

test("Thai fields are actually written in Thai", () => {
  const bad = [];
  for (const p of allPairs()) {
    if (p.locale !== "th") continue;
    if (p.en.length < 40) continue;
    if (!THAI.test(p.t)) {
      bad.push(`${at(p)}: no Thai characters at all — "${p.t.slice(0, 70)}"`);
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join("\n")}\n`);
});

/**
 * A Latin word loose in Japanese or Chinese prose.
 *
 * CLAUDE.md claimed this check existed and it did not. What existed was a
 * script check — Hangul, Cyrillic, kana in the wrong place — which catches a
 * paragraph from the wrong language and misses a single English word sitting
 * in an otherwise fluent sentence. That is the likelier failure by far: the
 * Chinese fees guide shipped with "並從中抽取一層margin", one untranslated
 * word in the middle of a correct sentence about exchange-rate margins,
 * invisible to every other assertion here.
 *
 * The rule only works for languages that do not use the Latin alphabet, which
 * is why Indonesian is excluded and has its own check — a field left in
 * English — further up. For ja and zh-Hant the allowed Latin strings are a
 * closed set: product names, platform UI labels a reader will see on screen,
 * and currency codes. Anything else is either an untranslated word or a name
 * that belongs in the list, and both are worth a moment's thought.
 */
const LATIN_OK = new Set([
  // Product and company names
  ...Object.keys(ALIASES),
  "Weverse", "Shop", "World", "Ticket", "Global", "Interpark", "interpark",
  "Yanolja", "Core", "Melon", "HYBE", "Toss", "NAVER", "Kakao", "PAYCO",
  "Alipay", "WeChat", "Grab", "Pay", "Apple", "Visa", "Mastercard", "MasterCard",
  "VISA", "AMEX", "JCB", "Eximbay", "PayPal", "FaceAccess", "facepass",
  "Play", "Stay", "Government", "PASS", "KISA", "ISO", "CBPR", "COVID",
  "Chrome", "Safari", "Samsung", "Internet", "Edge", "Instagram", "Google",
  "Company", "Korea", "Myanmar", "Andorra", "Mali", "Belarus", "Afghanistan",
  "Israel", "Antilles", "Netherlands", "Iraq", "Iran", "Lebanon", "Russia",
  "Ukraine", "Turkey", "Congo", "Maria", "Elena", "Santos", "Cruz",
  // Screen labels a reader has to recognise in English on the real site
  "Account", "My", "Reservations", "Reservation", "List", "Details", "Cancel",
  "Send", "Mobile", "Received", "Register", "Booking", "History", "Return",
  "View", "Tickets", "Page", "Reserve", "Verified", "Member", "Only", "Request",
  "Website", "Secure", "English", "Japan", "USA", "GLOBAL",
  // The two Korean album charts, their registry, and the shape of a store's
  // certification code. These stay in Latin in every language because they are
  // what the reader has to type into a search box and match against a page:
  // a translated "한터" or "한泰" finds nothing on hanteochart.com, and a family
  // code is an identifier rather than a word.
  "Hanteo", "Circle", "Chart", "Family", "family", "hanteochart",
  "circlechart", "com",
  // Codes and formats
  "KST", "KRW", "JPY", "USD", "CNY", "MXN", "QR", "PIN", "API", "APIs", "App",
  "URL", "SMS", "ID", "IDs", "eKYC", "I-PIN", "SPF", "Auto", "Payment",
  "DCC", "TXT", "MX", "UTC+", "Alipay+",
  // More screen labels and names, each one a string a reader meets on the
  // real site or a proper noun with no translation: NOL, YES24's "YES TICKET",
  // the Galaxy Fold the browser-mode answer names, and the menu items.
  "NOL", "nol", "YES", "yes", "TICKET", "ticket", "Store", "Membership", "Official",
  "Delete", "Reactivate", "Retry", "Password", "Find", "Now", "Web", "FAQ",
  // NOL World app menu path: My Account > Settings > Delete Account
  "Settings", "Security", "Authorized", "Apple", "Sign", "Line",
  // Weverse Shop cancel path (More > My Orders > Order Details > Cancel Order)
  // and the two order statuses that close it (Shipping Soon, In Transit). A
  // reader is being told to look for these strings and act before one of them
  // appears, so translating them into prose breaks the only instruction that
  // matters. "eFiling" is the CPSC regime's own name.
  "More", "Orders", "Order", "Shipping", "Soon", "Transit", "eFiling",
  "American", "Express", "Microsoft", "Galaxy", "Fold", "POP", "SNS",
  "world", "global", "mobile", "site", "version", "com", "and",
  // Ktown4u, and the carrier schemes its notices name. Each is a proper noun
  // a reader has to recognise to act: "Ktown" because the tokeniser splits the
  // name at its digit; UPS and EMS as the carriers; K-Packet and Prime Group
  // as the postal arrangement a country can be dropped from; and the words of
  // UPS's own two scheme names, International Collect on Delivery and Import
  // Prepaid Duties and Taxes, which are what the fee and its avoidance are
  // called on the bill and in the portal. Discover joins the card networks.
  "Ktown", "UPS", "EMS", "Packet", "Prime", "Group", "Discover",
  "International", "Collect", "Delivery", "Import", "Prepaid", "Duties", "Taxes",
  // TicketLink, and the strings a reader has to match on its screens. The
  // guide's whole argument is that this platform is documented in English and
  // almost nowhere else, so a reader is being told to recognise English labels
  // on an English page: the "Exclusive Sale" badge that means the show is sold
  // nowhere else, the button that reads "To Be Sold" until it turns into
  // "Reserve", the delivery row marked "Domestic" that is the reason to plan on
  // collecting, "Home Ticket" and "Smart Ticket" as the two app routes, the
  // "Create account" link, and the "1:1 Inquiry" form. Translating any of those
  // breaks the only instruction that matters. The rest are identifiers: the
  // operator NHN LINK Corporation, the host and the path pieces of the one
  // address that works, NXDOMAIN for the one that does not, and the mailbox.
  // VPN is here because the guide tells a reader not to reach for one.
  "TicketLink", "ticketlink", "NHN", "LINK", "Corporation",
  "Exclusive", "Sale", "Sold", "Domestic", "Home", "Smart", "Create", "account",
  "Inquiry",
  "www", "home", "english", "NXDOMAIN", "membership", "nhnlink", "VPN",
]);

/** Locales whose prose should contain no bare Latin words. */
const NON_LATIN = new Set(["ja", "zh-Hant"]);

/**
 * Identifiers, which are not words and must not be split into letter-runs.
 *
 * A Hanteo family code looks like `HF0082KTU001`. Read letter-run by
 * letter-run it becomes "HF" and "KTU", and the check then demands that two
 * fragments of one identifier be translated or registered as names — which
 * would put meaningless three-letter strings into LATIN_OK, one per store
 * this site ever cites. The code is a single token a reader copies into a
 * search box, so it is removed before the prose is read for loose words.
 */
const IDENTIFIER = /\b[A-Z]{2}\d{4}[A-Z]{3}\d{3}\b/g;

test("no untranslated Latin word is loose in Japanese or Chinese prose", () => {
  const bad = [];
  for (const p of allPairs()) {
    if (!NON_LATIN.has(p.locale)) continue;
    for (const word of p.t.replace(IDENTIFIER, " ").match(/[A-Za-z][A-Za-z+]{2,}/g) ?? []) {
      if (LATIN_OK.has(word)) continue;
      bad.push(`${at(p)}: "${word}" is not translated and is not a known name`);
    }
  }
  assert.deepEqual(
    bad,
    [],
    `\n${bad.join("\n")}\n\nEither translate the word, or — if it is a product ` +
      `name or a label the reader sees on the real screen — add it to ` +
      `LATIN_OK with that reason in mind.\n`,
  );
});
