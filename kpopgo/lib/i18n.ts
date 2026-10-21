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

export type Locale = "en" | "ja" | "zh-Hant" | "id" | "de" | "es" | "pt-BR";

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
  // Traditional rather than Simplified, and the reason is distribution rather
  // than preference: this site's only channel is Google search, and Google is
  // blocked in mainland China. Traditional reaches Taiwan, Hong Kong and
  // Macau, where it works. A Simplified edition would be a translation for
  // readers who cannot reach the page that carries it.
  "zh-Hant": {
    code: "zh-Hant",
    native: "繁體中文",
    english: "Traditional Chinese",
    tag: "zh-Hant",
    prefix: "/zh-hant",
  },
  id: {
    code: "id",
    native: "Bahasa Indonesia",
    english: "Indonesian",
    tag: "id",
    prefix: "/id",
  },
  // The first European language. Germany is among the top ten importers of
  // Korean albums and, with the UK, leads Europe's K-pop event market, so it
  // led with the commerce guides — albums, merchandise, then EU customs.
  //
  // It was commerce *only* for a while, on the reasoning that a German fan
  // sees the tour in Berlin, bought from a local promoter, which this site's
  // scope excludes. That reasoning was too broad and the restriction is gone.
  // It holds for the acts large enough to run a European leg and fails for
  // everyone else: a fan of a mid-tier group that never leaves Asia flies to
  // Seoul from Berlin exactly as they would from Taipei, and for that reader
  // the German edition had nothing. The ticketing guides are theirs too.
  de: {
    code: "de",
    native: "Deutsch",
    english: "German",
    tag: "de",
    prefix: "/de",
  },
  // Spanish, and the inverse of the German case rather than a repeat of it.
  //
  // The audience is the largest this site has added: Mexico alone is the
  // fifth-largest K-pop market on Spotify, with more than 14 million
  // listeners and over 500% growth in five years, and K-pop is 34.9% of
  // Hallyu content consumption across Latin America.
  //
  // The ticketing guides matter *more* here than in Europe, not less, and the
  // reason is the shape of the tours. BTS's 2026 Arirang run reached Mexico
  // City, Bogotá, Lima, Santiago and Buenos Aires — and those were the first
  // full-group shows the band had ever played in Colombia, Peru and
  // Argentina. A region that waits a decade for its first date from the
  // largest act in the genre is a region whose fans fly to Seoul for
  // everybody else.
  //
  // One caveat belongs with the first Spanish word rather than after it:
  // Weverse entered Latin America through EBANX in April 2025, launching in
  // Mexico with OXXO Pay — cash settlement at a convenience store, chosen
  // because only around a quarter of Mexicans use cards at all. A straight
  // translation of the declined-card guide would therefore be half wrong for
  // a Mexican reader, who has a route the English page does not know about.
  // That guide needs its own paragraph in Spanish, checked against Weverse's
  // own help pages rather than against the 2025 launch coverage.
  es: {
    code: "es",
    native: "Español",
    english: "Spanish",
    tag: "es",
    prefix: "/es",
  },
  // Brazil, not Portuguese generally, and the region in the code is doing
  // work rather than decorating it.
  //
  // Brazil is the other half of Latin America and the half Spanish does not
  // reach. It is one of the largest K-pop markets outside Asia, and the
  // reasoning that put Spanish ahead of German applies here with nothing
  // subtracted: a fan in São Paulo flies to Seoul for everyone who never
  // tours South America, which is almost everyone.
  //
  // The region matters because it decides a page. Brazil abolished daylight
  // saving in 2019, so the timezone guide — which is really a daylight-saving
  // guide — teaches arithmetic a Brazilian reader does not have to do.
  // Checked against this container's zoneinfo rather than recalled:
  // America/Sao_Paulo, America/Manaus and America/Recife all sit at the same
  // offset in January and July, and 20:00 KST is 08:00 in São Paulo on both
  // dates. That is the Tokyo and Jakarta situation, not the Madrid one.
  //
  // Portugal does observe it, so a generic `pt` edition would have to carry
  // that guide for half its readers and waste it on the other half. `pt-BR`
  // is the honest scope, and it is why the exclusion below is a decision
  // rather than a gap.
  "pt-BR": {
    code: "pt-BR",
    native: "Português (Brasil)",
    english: "Portuguese (Brazil)",
    tag: "pt-BR",
    prefix: "/pt-br",
  },
};

export const localeList: LocaleInfo[] = Object.values(LOCALES);

/**
 * The URL segment for a locale, which is not always its code.
 *
 * A BCP 47 subtag can carry case — zh-Hant is written that way by convention
 * and the hreflang attribute wants it — but a URL path is case-sensitive and
 * a capital letter in one is a second address for the same page. So the path
 * is lowercase and the tag is not, which means the route cannot simply cast
 * its segment to a Locale: it has to look the segment up. Deriving both from
 * `prefix` is what stops the two drifting, and they did drift once — the
 * route generated /zh-Hant while every link on the site pointed at /zh-hant,
 * so with dynamicParams off, every Chinese page 404'd from every link to it.
 */
export const segmentOf = (locale: Locale): string => LOCALES[locale].prefix.replace(/^\//, "");

const BY_SEGMENT = new Map(
  localeList.filter((l) => l.prefix).map((l) => [segmentOf(l.code), l.code]),
);

/** The locale a URL segment names, or undefined if it names none. */
export function localeFromSegment(segment: string): Locale | undefined {
  return BY_SEGMENT.get(segment);
}

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
