import { RESEARCH_DATE, type Guide, guides } from "@/content/guides";
import { site } from "./site";

/**
 * Structured data serves two jobs here:
 *  - classic rich results for the how-to and FAQ blocks
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
