/**
 * Languages, and the rule that keeps a translation honest.
 *
 * The site's whole argument is that a dated claim beats an undated one, and
 * translation is the fastest way to lose that. A translated page is a copy of
 * a claim made on a particular day from a source checked on a particular day,
 * and the moment the English page is re-checked the translation stops being
 * that copy. Nothing about the translated page looks different, which is
 * exactly the failure the status system exists to prevent — so it gets the
 * same treatment.
 *
 * Two rules, and both are asymmetric on purpose:
 *
 *   1. A translation can never look fresher than its source. If the English
 *      guide has gone stale, so has every translation of it, whatever date
 *      the translation carries.
 *   2. A translation is `behind` the moment the source's lastChecked moves.
 *      Not wrong — the English page may have changed a comma — but no longer
 *      a copy of a page anybody checked, and the reader is told so and given
 *      the English link.
 *
 * `review` is the second half of the honesty. A machine-assisted translation
 * of a page about customs offences and biometric retention is useful and is
 * not the same artefact as one a native speaker has read, and the page says
 * which it is. Same distinction as sourced versus verified, for the same
 * reason: claiming the stronger one is how this site would become the thing
 * it replaces.
 */
import type { Guide } from "@/content/guides";
import { displayStatus, type DisplayStatus } from "./freshness";

export type Locale = "en" | "ja";

/** English is the canonical language and carries no path prefix. */
export const DEFAULT_LOCALE: Locale = "en";

export type LocaleInfo = {
  code: Locale;
  /** The language's own name, which is what a reader scans for. */
  native: string;
  english: string;
  /** BCP 47 value for <html lang> and hreflang. */
  tag: string;
  /** Path prefix. Empty for the default locale. */
  prefix: string;
};

export const LOCALES: Record<Locale, LocaleInfo> = {
  en: { code: "en", native: "English", english: "English", tag: "en", prefix: "" },
  ja: { code: "ja", native: "日本語", english: "Japanese", tag: "ja", prefix: "/ja" },
};

export const localeList: LocaleInfo[] = Object.values(LOCALES);

/** Locales other than the canonical one. */
export const translatedLocales: LocaleInfo[] = localeList.filter(
  (l) => l.code !== DEFAULT_LOCALE,
);

/** How a translation was produced. Never upgrade one of these by hand. */
export type ReviewLevel = "machine-assisted" | "native-reviewed";

/**
 * What a translated page is entitled to claim today.
 *
 *   current   The source has not moved since this was translated, and the
 *             source itself is still inside its shelf life.
 *   behind    The source has been re-checked since this translation was made.
 *   stale     The source has expired, so this has too.
 */
export type TranslationState = "current" | "behind" | "stale";

export type TranslationMeta = {
  /** The source guide's lastChecked on the day this was translated. */
  sourceChecked: string;
  /** The day the translation itself was made. */
  translated: string;
  review: ReviewLevel;
};

/**
 * Derived, never stored — the same decision as displayStatus.
 *
 * Order matters: the source's expiry is checked first, so a translation
 * cannot present itself as current on top of a stale page.
 */
export function translationState(
  guide: Guide,
  meta: TranslationMeta,
  now: Date = new Date(),
): TranslationState {
  if (displayStatus(guide, now) === "stale") return "stale";
  return meta.sourceChecked === guide.lastChecked ? "current" : "behind";
}

/**
 * The status a translated page may display.
 *
 * It is the source's status, except that a translation which is behind or
 * stale cannot inherit a healthy one. This is what stops a Japanese page
 * showing a `sourced` seal for a check that happened against different text.
 */
export function translatedDisplayStatus(
  guide: Guide,
  meta: TranslationMeta,
  now: Date = new Date(),
): DisplayStatus {
  const state = translationState(guide, meta, now);
  if (state === "stale") return "stale";
  return displayStatus(guide, now);
}

/** The path a guide lives at in a given locale. */
export function guidePath(slug: string, locale: Locale): string {
  return `${LOCALES[locale].prefix}/guides/${slug}`;
}
