import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";
import { translations, translationsFor, translationsIn } from "@/content/translations";
import { LOCALES, translatedLocales } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // The hub pages change whenever any guide is re-checked, so they carry the
  // most recent verification date rather than no date at all. A sitemap entry
  // without lastModified tells a crawler nothing about whether to come back.
  const newest = guides
    .map((g) => g.lastChecked)
    .sort()
    .at(-1) as string;
  const latest = new Date(newest);

  return [
    { url: site.url, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/guides`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
      // The English index is the x-default for every language index, and the
      // annotation has to appear on both sides to count.
      alternates: {
        languages: {
          en: `${site.url}/guides`,
          ...Object.fromEntries(
            translatedLocales.map((l) => [l.tag, `${site.url}${l.prefix}`]),
          ),
        },
      },
    },
    // The chooser is the front door for a fan who knows their group and
    // nothing else, so it ranks with the guide index rather than below it.
    {
      url: `${site.url}/where-to-buy`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${site.url}/words`, lastModified: latest, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site.url}/editorial-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/report`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...guides.map((g) => ({
      url: `${site.url}/guides/${g.slug}`,
      lastModified: new Date(g.lastChecked),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      // hreflang alternates, emitted only where a translation exists.
      ...(translationsFor(g.slug).length > 0 && {
        alternates: {
          languages: {
            en: `${site.url}/guides/${g.slug}`,
            ...Object.fromEntries(
              translationsFor(g.slug).map((t) => [
                LOCALES[t.locale].tag,
                `${site.url}${LOCALES[t.locale].prefix}/guides/${g.slug}`,
              ]),
            ),
          },
        },
      }),
    })),
    // One index per language, ranked between the English hubs and the
    // translated guides they list. Dated from the newest source check in that
    // edition rather than from today: the page is a list of translations and
    // is exactly as fresh as the freshest thing on it.
    ...translatedLocales
      .filter((l) => translationsIn(l.code).length > 0)
      .map((l) => ({
        url: `${site.url}${l.prefix}`,
        lastModified: new Date(
          translationsIn(l.code)
            .map((t) => t.sourceChecked)
            .sort()
            .at(-1) as string,
        ),
        changeFrequency: "weekly" as const,
        priority: 0.75,
        alternates: {
          languages: {
            en: `${site.url}/guides`,
            ...Object.fromEntries(
              translatedLocales.map((o) => [o.tag, `${site.url}${o.prefix}`]),
            ),
          },
        },
      })),
    // A translated guide is its own URL and needs its own entry, dated from
    // the source check it was made against rather than from today — a
    // translation of a page checked in July is not fresh content.
    ...translations.map((t) => ({
      url: `${site.url}${LOCALES[t.locale].prefix}/guides/${t.slug}`,
      lastModified: new Date(t.sourceChecked),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
