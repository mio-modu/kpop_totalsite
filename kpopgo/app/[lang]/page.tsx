import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide } from "@/content/guides";
import { localesWithContent, translationsIn, labelsFor } from "@/content/translations";
import { LOCALES, localeFromSegment, segmentOf, translatedLocales } from "@/lib/i18n";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { localeIndexJsonLd } from "@/lib/jsonld";

/**
 * One index page per language, at /vi, /th, /ja and the rest.
 *
 * Until this existed, `/vi` was a 404 and the nineteen Vietnamese pages were
 * reachable only from each other. That link graph is connected — checked, not
 * assumed: every one of the nineteen is reachable from the hub guide by
 * following the related rails — but the thinnest page in it has a single
 * sibling link, and a crawler arriving on that page has one door out. On a
 * site whose only channel is search, that is the difference between a section
 * and nineteen pages that happen to exist.
 *
 * The register already said the first half of this out loud, in the note above
 * `relatedTranslations`: six pages with no links between them are six dead
 * ends and the only way Google finds the sixth is the sitemap. The rail fixed
 * the dead ends. This fixes the part the rail could not — there was still no
 * page anywhere that names every guide a given language has, so no page could
 * be indexed for "KPOPGO in Vietnamese" and nobody trimming the URL to /vi
 * found anything at all.
 *
 * It lists only what exists in the language. No English titles, no "coming
 * soon" rows, no count of what is missing — the same rule the related rail
 * follows, for the same reason: a translated page that funnels into English is
 * worse than one that stops honestly. The single English link at the bottom is
 * a deliberate exception, labelled in the reader's language, because the
 * English index genuinely has guides this language does not.
 *
 * Order is the English editorial order rather than a per-language one. CLAUDE.md
 * records that an edition "leads with what its readers came for", and that is
 * true of which guides were translated first; it has never been a display
 * order, and inventing one here would be a claim this file cannot back.
 */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  // Driven by the register rather than by the locale list, so a language
  // declared in lib/i18n.ts but not yet translated produces no index page
  // rather than an empty one. The check at the bottom of this file is what
  // makes that state loud instead of silent.
  return localesWithContent().map((locale) => ({ lang: segmentOf(locale) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = localeFromSegment(lang);
  const labels = locale && labelsFor(locale);
  if (!locale || !labels) return {};
  const info = LOCALES[locale];
  return {
    // Absolute, because every locale's heading already contains the site name
    // and the root template would append it again: "KPOPGO ภาษาไทย · KPOPGO".
    title: { absolute: labels.hubHeading },
    description: labels.hubIntro,
    alternates: {
      canonical: info.prefix,
      // Reciprocity is the whole point of these: Google discards hreflang
      // annotations that are not confirmed from the other side, so /guides
      // declares this set too. x-default and en both go there — there is no
      // /en, the English index is the English index.
      languages: {
        "x-default": "/guides",
        en: "/guides",
        ...Object.fromEntries(
          translatedLocales.map((l) => [l.tag, l.prefix]),
        ),
      },
    },
    openGraph: {
      locale,
      type: "website",
      title: labels.hubHeading,
      description: labels.hubIntro,
    },
  };
}

export default async function LocaleIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = localeFromSegment(lang);
  const labels = locale && labelsFor(locale);
  if (!locale || locale === "en" || !labels) notFound();

  const items = translationsIn(locale);
  if (items.length === 0) notFound();
  const info = LOCALES[locale];

  return (
    <div className="wrap sect" lang={info.tag}>
      <JsonLd data={localeIndexJsonLd(locale, items)} />

      {/* The language's own name for itself, which needs no translating. */}
      <p className="data dim">{info.native}</p>
      <h1 className="pl mt-4 max-w-[22ch]">{labels.hubHeading}</h1>
      <p className="t-lg mt-6 max-w-[60ch]">{labels.hubIntro}</p>

      {/* Every page here declares machine assistance; the index says it once
          for the set rather than making a reader open a guide to find out. */}
      <div className="obj mt-8 p-5 sm:p-6">
        <p className="t-sm">{labels.hubReview}</p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {items.map((t, i) => {
          const guide = getGuide(t.slug);
          return (
            <li key={t.slug} className={`pc ${i === 0 ? "sm:col-span-2" : ""}`}>
              <Link
                href={`${info.prefix}/guides/${t.slug}`}
                className="block p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    {/* The Korean term stays Korean in every edition: it is
                        what the reader will meet on the real booking screen,
                        and the translated guide pages already show it. */}
                    {guide && <span className="pc-han block">{guide.ko}</span>}
                    <h2 className="pm mt-3">{t.title}</h2>
                  </div>
                  <span className="pc-no shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="t-sm mt-4 max-w-[58ch]">{t.summary}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {/* Reading time rather than a step count, and "min" rather
                      than a localised word: it is the chip the translated
                      guide pages already carry, and a bare number beside the
                      platform names says nothing at all. */}
                  {guide && (
                    <span className="chip data-sm">
                      {String(guide.readMinutes).padStart(2, "0")} min
                    </span>
                  )}
                  {guide?.platforms.map((pf) => (
                    <span key={pf} className="chip data-sm">
                      {pf}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <AdSlot placement="list" />

      <div className="mt-14 pb-4">
        <Link href="/guides" className="btn px-5 py-3" hrefLang="en">
          {labels.englishIndex}
        </Link>
      </div>
    </div>
  );
}

// Guard against the route and the register drifting apart: `translations` is
// imported for this alone, so a locale with entries but no index page would
// fail the build rather than quietly 404 for readers.
if (localesWithContent().length !== translatedLocales.length) {
  throw new Error(
    "every locale with translations needs an index page, and every locale " +
      "listed as translated needs translations — translatedLocales in " +
      "lib/i18n.ts and content/translations.ts disagree.",
  );
}
