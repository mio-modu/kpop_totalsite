/**
 * The translation register, and it is empty.
 *
 * The machinery exists before any translation does, for the same reason the
 * paid-link register did: knowing that a page may one day be translated
 * changes how the English is written now, and a translation added to a site
 * with no freshness rules would quietly become the undated guide this site
 * exists to replace.
 *
 * What a translation must carry is in lib/i18n.ts. What it must not do is
 * here, enforced at module scope:
 *
 *  - It cannot name a guide that does not exist.
 *  - It cannot claim a `sourceChecked` in the future, which would make a
 *    translation permanently "current" no matter what the English page did.
 *  - It cannot be translated earlier than the source it was translated from.
 *  - It must declare how it was reviewed. There is no default, because the
 *    default would be the flattering one.
 *
 * Adding a language also means `translatedLocales` in lib/i18n.ts, an entry
 * here per guide, and accepting that every source re-check now has N pages to
 * follow. That last part is the real cost and it is why this is one language
 * at a time rather than all of them at once.
 */
import { guides } from "./guides";
import { LOCALES, type Locale, type ReviewLevel, type TranslationMeta } from "@/lib/i18n";

export type TranslatedStep = {
  title: string;
  body: string;
  pitfall?: string;
  takes?: string;
};

export type Translation = TranslationMeta & {
  locale: Locale;
  /** The English guide this translates. */
  slug: string;
  title: string;
  summary: string;
  scope: string;
  intro: string[];
  steps: TranslatedStep[];
  faq: { q: string; a: string }[];
  /**
   * Localised chrome.
   *
   * Every one of these is wording the template needs in the reader's own
   * language. A notice explaining a translation, written in English, is a
   * notice for somebody who did not need the translation — so there is no
   * English fallback and the type requires all of them.
   */
  labels: {
    pitfall: string;
    takes: string;
    sources: string;
    readEnglish: string;
    /** "Translated with machine assistance; not reviewed by a native speaker." */
    reviewedMachine: string;
    /** "Translation reviewed by a native speaker." */
    reviewedNative: string;
    /** Shown when the English page has been re-checked since this was made. */
    sourceMoved: string;
    /** Shown when the English page has passed its shelf life. */
    sourceStale: string;
  };
};

export const translations: Translation[] = [];

/** Every locale that actually has at least one translated guide. */
export function localesWithContent(): Locale[] {
  return [...new Set(translations.map((t) => t.locale))];
}

export function getTranslation(slug: string, locale: Locale): Translation | undefined {
  return translations.find((t) => t.slug === slug && t.locale === locale);
}

/** The locales a given guide has been translated into. */
export function translationsFor(slug: string): Translation[] {
  return translations.filter((t) => t.slug === slug);
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REVIEWS: ReviewLevel[] = ["machine-assisted", "native-reviewed"];
const today = new Date().toISOString().slice(0, 10);

for (const t of translations) {
  const guide = guides.find((g) => g.slug === t.slug);
  if (!guide) {
    throw new Error(
      `translation (${t.locale}) names an unknown guide: ${t.slug}`,
    );
  }
  if (!LOCALES[t.locale]) {
    throw new Error(`translation of ${t.slug} uses an unknown locale: ${t.locale}`);
  }
  if (t.locale === "en") {
    throw new Error(
      `${t.slug} has a translation declared for "en" — English is the source, ` +
        `not a translation of itself.`,
    );
  }
  for (const [field, value] of [
    ["sourceChecked", t.sourceChecked],
    ["translated", t.translated],
  ] as const) {
    if (!DATE.test(value)) {
      throw new Error(`${t.slug} (${t.locale}): ${field} is not YYYY-MM-DD: ${value}`);
    }
  }
  // A future sourceChecked would never equal the guide's lastChecked and so
  // would never go "behind" either — it would sit at "current" forever.
  if (t.sourceChecked > today) {
    throw new Error(
      `${t.slug} (${t.locale}): sourceChecked ${t.sourceChecked} is in the future.`,
    );
  }
  if (t.translated < t.sourceChecked) {
    throw new Error(
      `${t.slug} (${t.locale}): translated ${t.translated} is before the source ` +
        `check it claims to be based on (${t.sourceChecked}).`,
    );
  }
  if (!REVIEWS.includes(t.review)) {
    throw new Error(
      `${t.slug} (${t.locale}): review must be one of ${REVIEWS.join(", ")}`,
    );
  }
  // A translation that drops steps is not a translation of the page a reader
  // was linked to, and the missing step is always the one that mattered.
  if (t.steps.length !== guide.steps.length) {
    throw new Error(
      `${t.slug} (${t.locale}): has ${t.steps.length} steps but the English ` +
        `guide has ${guide.steps.length}. A translation may not drop or add steps.`,
    );
  }
}
