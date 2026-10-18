import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/content/guides";
import { guidesIndexJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { VerifiedBadge } from "@/components/Badges";
import { AdSlot } from "@/components/AdSlot";

// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All guides",
  description:
    "Every KPOPGO guide: ticketing platforms, identity verification, fan club presales, foreign card payments and overseas album orders.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="wrap sect">
      <JsonLd data={guidesIndexJsonLd()} />
      <p className="data dim">The guides</p>
      <h1 className="pl mt-4 max-w-[18ch]">
        Five <span className="foil-text">procedures</span>, start to finish
      </h1>
      <p className="han-m dim mt-3.5">다섯 개의 절차</p>
      <p className="t-lg mt-6 max-w-[60ch]">
        Each one is a sequence you can follow start to finish, with the thing that actually
        goes wrong called out at every step.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {guides.map((g, i) => (
          <li key={g.slug} className={`pc ${i === 0 ? "sm:col-span-2" : ""}`}>
            <Link href={`/guides/${g.slug}`} className="block p-6 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <span className="pc-han block">{g.ko}</span>
                  <h2 className="pm mt-3">{g.title}</h2>
                </div>
                <span className="pc-no shrink-0">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="han-lb mt-2">{g.koLine}</p>
              <p className="t-sm mt-4 max-w-[58ch]">{g.summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="chip data-sm">
                  {String(g.steps.length).padStart(2, "0")} steps
                </span>
                <span className="chip data-sm">
                  {String(g.readMinutes).padStart(2, "0")} min
                </span>
                <VerifiedBadge guide={g} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot placement="list" />
    </div>
  );
}
