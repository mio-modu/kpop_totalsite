import { RESEARCH_DATE, type Guide, guides } from "@/content/guides";
import type { Translation } from "@/content/translations";
import { LOCALES, type Locale } from "./i18n";
import { site } from "./site";

/**
 * Structured data, and what it is actually still worth.
 *
 * The HowTo and FAQPage blocks below will not produce a rich result, and this
 * comment used to say they would. Google deprecated HowTo rich results in
 * September 2023 and FAQ rich results on 7 May 2026, after first narrowing
 * FAQ to government and health sites in August 2023. Search Console stopped
 * reporting on FAQ in June 2026, which is why the only enhancement this site
 * shows there is Breadcrumbs — that one still renders, and it is the only
 * rich result this content type can earn.
 *
 * Checked 19 October 2026. Google's position is that leftover markup causes
 * no harm, so it stays: it is semantically correct, breadcrumbs depend on the
 * same graph, and other consumers are not Google. But nobody should ship a
 * change here expecting stars in the results page.
 *
 * What it is still for:
 *  - Breadcrumbs, which do render
 *  - giving AI answer engines something quotable and attributable, since a
 *    chunk of this traffic will never reach the page at all
 */
export function guideJsonLd(guide: Guide) {
  const url = `${site.url}/guides/${guide.slug}`;

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.summary,
    url,
    totalTime: `PT${guide.readMinutes}M`,
    // Both dates, not just one. This site's entire claim is that it is not
    // stale, and a crawler reads that from dateModified — but a page with a
    // modified date and no published date looks like it was back-dated.
    datePublished: RESEARCH_DATE,
    dateModified: guide.lastChecked,
    inLanguage: "en",
    // Pointing at the @id defined in siteJsonLd rather than restating the
    // publisher inline: one organisation in the graph, referenced twice.
    publisher: { "@id": `${site.url}#org` },
    isPartOf: { "@id": `${site.url}#site` },
    step: guide.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.body,
      url: `${url}#step-${i + 1}`,
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/guides` },
      { "@type": "ListItem", position: 3, name: guide.name, item: url },
    ],
  };

  return [howTo, faq, breadcrumb];
}

/**
 * A translated guide.
 *
 * These pages had no structured data at all — fifty-one of them, in the
 * sitemap, telling a crawler nothing about what they were. That mattered more
 * than it looks: breadcrumbs are, per the note above, the one rich result this
 * content type can still earn, and the translations were the only pages not
 * emitting them.
 *
 * Deliberately **not** HowTo and FAQPage. The English pages carry those for
 * the reasons given above — semantically correct, harmless, occasionally read
 * by something that is not Google — but copying dead markup onto fifty-one
 * more pages would be cargo. Article is the right type here and is still live:
 * it carries the language, the dates and the relationship to the original,
 * which is what a translated page actually has to say about itself.
 *
 * `dateModified` obeys the same rule as the visible status: **a translation
 * can never look fresher than its source.** The page last changed on the day
 * it was translated, but the claims in it were only ever verified on the day
 * the source was checked — so the later of those two is a date the page has
 * not earned, and the earlier is the honest one. Emitting `translated` alone
 * would tell a crawler this page is newer than the English it was copied from,
 * which is the exact inversion lib/i18n.ts exists to prevent on screen.
 */
export function translatedGuideJsonLd(guide: Guide, tr: Translation) {
  const info = LOCALES[tr.locale];
  const url = `${site.url}${info.prefix}/guides/${guide.slug}`;
  const english = `${site.url}/guides/${guide.slug}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: tr.title,
    description: tr.summary,
    inLanguage: info.tag,
    datePublished: tr.translated,
    dateModified: tr.translated < guide.lastChecked ? tr.translated : guide.lastChecked,
    url,
    mainEntityOfPage: url,
    // Both relations on purpose: isBasedOn is the general one a reader of the
    // graph will understand, translationOfWork is the precise one.
    isBasedOn: english,
    translationOfWork: { "@type": "Article", "@id": english, url: english },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: site.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/guides` },
      { "@type": "ListItem", position: 3, name: tr.title, item: url },
    ],
  };

  return [article, breadcrumb];
}

/**
 * The same thing for one language's index.
 *
 * `inLanguage` is the field doing the work. An ItemList of nineteen Vietnamese
 * titles with no language on it invites exactly the wrong inference — that the
 * site has nineteen more English pages whose titles happen to be unreadable.
 * The list is also declared as a translation of the English index, so the
 * relationship a reader can see in the hreflang tags is stated in the graph
 * too rather than left for a crawler to infer from URL shape.
 */
export function localeIndexJsonLd(locale: Exclude<Locale, "en">, items: Translation[]) {
  const info = LOCALES[locale];
  const url = `${site.url}${info.prefix}`;
  const english = `${site.url}/guides`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} — ${info.english}`,
    url,
    inLanguage: info.tag,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    isPartOf: { "@id": `${site.url}#site` },
    isBasedOn: english,
    translationOfWork: { "@type": "ItemList", "@id": english, url: english },
    itemListElement: items.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
      description: t.summary,
      url: `${url}/guides/${t.slug}`,
    })),
  };
}

/**
 * The guides index, as a list rather than a page that happens to have links on
 * it. Without this the hub is just another document to a crawler; with it, the
 * five guides are named, ordered and attributed to the site in one object.
 */
export function guidesIndexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KPOPGO guides",
    description:
      "Every procedure an international K-pop fan has to follow, start to finish.",
    url: `${site.url}/guides`,
    numberOfItems: guides.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    isPartOf: { "@id": `${site.url}#site` },
    itemListElement: guides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      description: g.summary,
      url: `${site.url}/guides/${g.slug}`,
    })),
  };
}

/**
 * Site-level structured data. Answer engines increasingly cite rather than
 * link, so naming the publisher and what it covers is worth doing even when no
 * rich result comes of it.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}#org`,
        name: site.name,
        url: site.url,
        description: site.description,
        // Said plainly, because the agencies and platforms named across the
        // site are not partners and must not read as such.
        disambiguatingDescription:
          "An independent fan resource. Not affiliated with, endorsed by or " +
          "operated by any agency, artist or ticketing platform.",
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}#site`,
        url: site.url,
        name: site.name,
        inLanguage: "en",
        publisher: { "@id": `${site.url}#org` },
      },
    ],
  };
}
