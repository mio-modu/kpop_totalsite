import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";
import { site } from "@/lib/site";

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
    { url: `${site.url}/words`, lastModified: latest, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site.url}/editorial-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...guides.map((g) => ({
      url: `${site.url}/guides/${g.slug}`,
      lastModified: new Date(g.lastChecked),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
