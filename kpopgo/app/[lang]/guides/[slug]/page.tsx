import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide } from "@/content/guides";
import { translations, getTranslation, relatedTranslations } from "@/content/translations";
import {
  LOCALES,
  localeFromSegment,
  segmentOf,
  translatedDisplayStatus,
} from "@/lib/i18n";
import { site } from "@/lib/site";
import { TranslationNotice } from "@/components/TranslationNotice";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { translatedGuideJsonLd } from "@/lib/jsonld";

/**
 * A guide in a language other than English.
 *
 * Driven entirely by content/translations.ts: `generateStaticParams` returns
 * one entry per translation that exists, and `dynamicParams = false` means
 * anything else is a 404 rather than an empty shell. With the register empty
 * this route generates nothing, which is the correct amount of Japanese to
 * serve before any Japanese has been written.
 *
 * It deliberately renders less than the English page — no artwork, no booking
 * graphic, no related-guide rail. Those carry English text or exist to move a
 * reader deeper into pages that are not translated yet, and a translated page
 * that funnels into English is worse than one that stops honestly.
 */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  // The segment, not the locale code: zh-Hant lives at /zh-hant.
  return translations.map((t) => ({ lang: segmentOf(t.locale), slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = localeFromSegment(lang);
  const tr = locale && getTranslation(slug, locale);
  if (!tr) return {};
  const info = LOCALES[tr.locale];
  return {
    title: tr.title,
    description: tr.summary,
    alternates: {
      canonical: `${info.prefix}/guides/${slug}`,
      // The English page is the source of record, and every language that
      // exists points at every other. x-default goes to English.
      languages: {
        "x-default": `/guides/${slug}`,
        en: `/guides/${slug}`,
        ...Object.fromEntries(
          translations
            .filter((t) => t.slug === slug)
            .map((t) => [LOCALES[t.locale].tag, `${LOCALES[t.locale].prefix}/guides/${slug}`]),
        ),
      },
    },
    openGraph: { locale: tr.locale, type: "article", title: tr.title, description: tr.summary },
  };
}

export default async function TranslatedGuide({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const guide = getGuide(slug);
  const locale = localeFromSegment(lang);
  const tr = guide && locale ? getTranslation(slug, locale) : undefined;
  if (!guide || !tr) notFound();

  const status = translatedDisplayStatus(guide, tr);
  const related = relatedTranslations(slug, tr.locale);

  return (
    <article lang={LOCALES[tr.locale].tag}>
      {translatedGuideJsonLd(guide, tr).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      <header className="wrap pt-10 sm:pt-14">
        <p className="pc-han mt-2">{guide.ko}</p>
        <h1 className="pl mt-3 max-w-[24ch]">{tr.title}</h1>
        <p className="t-lg mt-5">{tr.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="chip data-sm">{status}</span>
          <span className="chip data-sm">
            {String(guide.readMinutes).padStart(2, "0")} min
          </span>
          {guide.platforms.map((p) => (
            <span key={p} className="chip data-sm">
              {p}
            </span>
          ))}
        </div>
      </header>

      <div className="wrap">
        <TranslationNotice guide={guide} tr={tr} />
      </div>

      <div className="wrap mt-8">
        <div className="obj p-5 sm:p-6">
          <p className="data dim">{tr.labels.sources}</p>
          <p className="t-sm mt-3">{tr.scope}</p>
        </div>
      </div>

      <div className="wrap mt-12 grid gap-4">
        {tr.intro.map((para, i) => (
          <p key={i} className={i === 0 ? "t-lg max-w-[62ch]" : "t"}>
            {para}
          </p>
        ))}
      </div>

      <ol className="wrap mt-14 grid gap-5">
        {tr.steps.map((step, i) => (
          <li key={i} className="pc p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="pc-no shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h2 className="pm">{step.title}</h2>
                <p className="t mt-3">{step.body}</p>
                {step.pitfall && (
                  <p className="t-sm mt-4">
                    <span className="data dim">{tr.labels.pitfall}</span>{" "}
                    {step.pitfall}
                  </p>
                )}
                {step.takes && (
                  <p className="data-sm dim mt-3">
                    {tr.labels.takes} {step.takes}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <AdSlot placement="article" />

      <div className="wrap mt-14 grid gap-4">
        {tr.faq.map((item, i) => (
          <div key={i} className="obj p-5 sm:p-6">
            <h3 className="pm">{item.q}</h3>
            <p className="t-sm mt-3">{item.a}</p>
          </div>
        ))}
      </div>

      {/* The sources stay in their original language on purpose: a citation
          is only checkable in the words the source actually uses. */}
      <div className="wrap mt-14">
        <p className="data dim">{tr.labels.sources}</p>
        <ul className="mt-3 grid gap-2">
          {guide.sources.map((s) => (
            <li key={s.url} className="t-sm">
              <a
                href={s.url}
                className="tap foil-text hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Only guides that exist in this language. An empty list renders
          nothing rather than a heading over three links into English. */}
      {related.length > 0 && (
        <nav className="wrap mt-14">
          <p className="data dim">{tr.labels.related}</p>
          <ul className="mt-3 grid gap-2">
            {related.map((r) => (
              <li key={r.slug} className="t-sm">
                <Link
                  href={`${LOCALES[tr.locale].prefix}/guides/${r.slug}`}
                  className="tap foil-text hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* The language's own index first, the English page second, and in that
          order on purpose: the rail above lists only the guides this page
          cross-references, so for most pages the index is the only way to see
          what else the language has. */}
      <div className="wrap mt-12 flex flex-wrap gap-3 pb-16">
        <Link href={LOCALES[tr.locale].prefix} className="btn px-5 py-3">
          {tr.labels.hubHeading}
        </Link>
        <Link href={`/guides/${guide.slug}`} className="btn px-5 py-3" hrefLang="en">
          {tr.labels.readEnglish}
        </Link>
      </div>
    </article>
  );
}
