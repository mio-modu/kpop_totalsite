import type { Metadata } from "next";
import Link from "next/link";
import { routes, coveredRoutes } from "@/content/routes";
import { getGuide } from "@/content/guides";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";

/** Renders guide statuses, so it must be able to let one expire. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where to buy: which site is selling your group's tickets",
  description:
    "Six routes, chosen by the platform your show's announcement names rather than by group — " +
    "because the platform is set per tour. Start from what the announcement tells you.",
  alternates: { canonical: "/where-to-buy" },
};

/**
 * The front door for a fan who knows their group and nothing else.
 *
 * Deliberately not a list of artists. content/routes.ts has the reasoning:
 * the platform is a per-tour decision, so an artist table would be wrong
 * somewhere on the day it shipped and stale every time a tour was announced.
 * This asks the reader to look at their announcement instead, which is the one
 * document that is authoritative for their show.
 */
export default function WhereToBuy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "KPOPGO", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Where to buy",
        item: `${site.url}/where-to-buy`,
      },
    ],
  };

  return (
    <div className="wrap py-12 sm:py-16">
      <JsonLd data={jsonLd} />

      <h1 className="pl max-w-[24ch]">Which site is selling your group&rsquo;s tickets?</h1>
      <p className="han-m dim mt-3.5">어느 사이트에서 파는지 먼저 확인하세요</p>

      <p className="t-lg mt-6 max-w-[62ch]">
        Start here if you know your group and nothing else. Pick the route that matches
        your show and you land on the guides that apply to it — and only those.
      </p>

      <div className="tint mt-8 p-5 sm:p-6">
        <p className="data dim">Read this first</p>
        <p className="t mt-3 max-w-[62ch]">
          We do not list groups, and that is on purpose. The platform selling a tour is
          chosen by the promoter{" "}
          <strong>per tour</strong> — the same group can sell one tour through one site and
          the next through another, and a single tour can use different platforms in
          different countries. Any list of groups and their ticket sites would be wrong
          somewhere the day it was written.
        </p>
        <p className="t mt-3 max-w-[62ch]">
          So the authority for your show is{" "}
          <strong>its own official announcement</strong>. Find that, see which platform it
          names, and come back to the matching route below.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {routes.map((route) => (
          <section key={route.id} className="pc min-w-0 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <span className="pc-han block">{route.ko}</span>
                <h2 className="pm mt-3">{route.name}</h2>
              </div>
              {route.then.length > 0 ? (
                <span className="chip data-sm shrink-0">
                  {route.then.length} {route.then.length === 1 ? "guide" : "guides"}
                </span>
              ) : (
                <span className="chip data-sm shrink-0">no guide yet</span>
              )}
            </div>

            <p className="t-sm mt-4">{route.who}</p>

            <p className="data dim mt-5">This is you if</p>
            <ul className="t-sm mt-2 space-y-1.5">
              {route.tells.map((tell) => (
                <li key={tell}>— {tell}</li>
              ))}
            </ul>

            {route.gap ? (
              <p className="t-sm mt-5" style={{ color: "var(--warn, var(--ink))" }}>
                {route.gap}
              </p>
            ) : (
              <ol className="mt-5 space-y-2">
                {route.then.map((slug, i) => {
                  const guide = getGuide(slug);
                  if (!guide) return null;
                  return (
                    <li key={slug} className="flex gap-3">
                      <span className="data dim shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <Link
                        href={`/guides/${slug}`}
                        className="tap foil-text min-w-0 break-words hover:underline"
                      >
                        {guide.name}
                        <span className="dim"> — {guide.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}

            {route.note && <p className="t-sm dim mt-5">{route.note}</p>}
          </section>
        ))}
      </div>

      <AdSlot placement="list" />

      <p className="t-sm dim mt-12 max-w-[62ch]">
        {coveredRoutes} of these {routes.length} routes have guides. The ones that do not
        say so above rather than sending you through pages that do not apply — we have not
        had a readable source to write them from, and the announcement for your show is
        the authority in the meantime.
      </p>

      <p className="mt-8">
        <Link href="/guides" className="btn px-5 py-3">
          See all guides
        </Link>
      </p>
    </div>
  );
}
