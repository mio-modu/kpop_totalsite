import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";
import { translations, translationsFor } from "@/content/translations";
import { LOCALES } from "@/lib/i18n";

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
    { url: `${site.url}/guides`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
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
