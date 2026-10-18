import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides, jamo } from "@/content/guides";
import { guideJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { StackedScreens, SingleScreen, StepObject } from "@/components/Objects";
import { Artwork } from "@/components/Artwork";
import { VerifiedBadge, StatusNotice } from "@/components/Badges";
import { AdSlot } from "@/components/AdSlot";

// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.summary, type: "article" },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <article>
      {guideJsonLd(guide).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      {/* ─────────── Header ─────────── */}
      <header className="wrap pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="data dim">
          <Link href="/" className="hover:text-[var(--ink)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-[var(--ink)]">
            Guides
          </Link>
        </nav>

        <p className="pc-han mt-7">{guide.ko}</p>
        <h1 className="pl mt-3 max-w-[22ch]">{guide.title}</h1>
        <p className="han-m dim mt-3.5">{guide.koLine}</p>
        <p className="t-lg mt-5">{guide.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <VerifiedBadge guide={guide} />
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

      {/* ─────────── The guide's own object ─────────── */}
      {/* Capped narrower than it used to be: the pieces are not all the same
          shape, and a square one at 560px pushed a thousand pixels of guide
          below the fold to show an object nobody came for. */}
      <div className="wrap mt-10 max-w-[420px]">
        <Artwork name={guide.art} fallback={null} priority />
      </div>

      {/* ─────────── T21: the booking screens ─────────── */}
      <div className="wrap mt-10">
        <div className="sm:hidden">
          <SingleScreen />
        </div>
        <div className="hidden sm:block">
          <StackedScreens />
        </div>
        <p className="data-sm dim mt-3.5 max-w-[62ch]">
          Real values, and a real warning: the name does not match the fan club record.
          That is the failure these guides exist to prevent.
        </p>
      </div>

      {/* ─────────── Scope + draft notice ─────────── */}
      <div className="wrap mt-8 grid gap-3">
        <div className="obj p-5 sm:p-6">
          <p className="data dim">
            Scope <span className="han text-[0.6875rem]">적용 범위</span>
          </p>
          <p className="t-sm mt-3">{guide.scope}</p>
        </div>
        <StatusNotice guide={guide} />
      </div>

      {/* ─────────── Intro ─────────── */}
      <div className="wrap mt-12 grid gap-4">
        {guide.intro.map((para, i) => (
          <p key={i} className={i === 0 ? "t-lg max-w-[62ch]" : "t"}>
            {para}
          </p>
        ))}
      </div>

      {/* ─────────── T14: the flow ─────────── */}
      <section className="wrap mt-14">
        <h2 className="pl">Step by step</h2>
        <p className="han-m dim mt-3">단계별 절차</p>

        <ol className="mt-8 grid gap-3.5">
          {guide.steps.map((step, i) => (
            <li key={step.title} id={`step-${i + 1}`} className="obj flow-row">
              <div>
                <StepObject index={i} />
                <p className="data ju mt-3">
                  <span className="han text-[1.1rem]">{jamo[i] ?? "·"}</span>
                  &nbsp; Step {String(i + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
                  <h3 className="ps">{step.title}</h3>
                  {step.takes ? (
                    <span className="data-sm dim shrink-0">{step.takes}</span>
                  ) : null}
                </div>
                <p className="t-sm mt-3">{step.body}</p>
                {step.pitfall ? (
                  <div className="breaks">
                    <p className="data ju">Where this breaks</p>
                    <p className="t-sm mt-1.5">{step.pitfall}</p>
                  </div>
                ) : null}
                {step.see ? (
                  <p className="carry">
                    <Link href={`/guides/${step.see.slug}`}>
                      <span className="data-sm">
                        {getGuide(step.see.slug)?.name ?? "Continue"}
                      </span>
                      <span className="t-sm">{step.see.text}</span>
                    </Link>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="wrap">
        <AdSlot placement="article" />
      </div>

      {/* ─────────── FAQ ─────────── */}
      <section className="wrap mt-16">
        <h2 className="pl">Questions people ask</h2>
        <p className="han-m dim mt-3">자주 나오는 질문</p>
        <div className="mt-8 grid gap-3">
          {guide.faq.map((item) => (
            <details key={item.q} className="obj group p-5 sm:p-6">
              <summary className="ps flex cursor-pointer items-start justify-between gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <svg
                  viewBox="0 0 24 24"
                  className="dim mt-1 size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="t-sm mt-3.5">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="wrap">
        <AdSlot placement="foot" />
      </div>

      {/* ─────────── Sources ─────────── */}
      <section className="wrap mt-16">
        <div className="obj p-6 sm:p-7">
          <p className="data dim">
            Sources <span className="han text-[0.6875rem]">출처</span> · last checked{" "}
            {guide.lastChecked}
          </p>
          <ul className="srcs mt-4 grid gap-2.5">
            {guide.sources.map((s, i) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">
                  <span className="data ju">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="t-sm dim mt-4 text-[0.875rem]">
            If one of these has moved on since, the official announcement for your show is
            the authority — not this page.
          </p>
        </div>
      </section>

      {/* ─────────── Next — the same photocards as everywhere else ─────────── */}
      <section className="wrap mt-16">
        <h2 className="data dim">
          Next <span className="han text-[0.6875rem]">다음 절차</span>
        </h2>
        <ul className="mt-5 grid gap-3.5 sm:grid-cols-3">
          {others.map((g) => (
            <li key={g.slug} className="pc">
              <Link href={`/guides/${g.slug}`} className="block h-full p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="pc-han block">{g.ko}</span>
                  <span className="pc-no pc-no-sm shrink-0">
                    {String(guides.findIndex((x) => x.slug === g.slug) + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="ps mt-3">{g.name}</h3>
                <p className="data-sm dim mt-2">
                  {String(g.steps.length).padStart(2, "0")} steps ·{" "}
                  {String(g.readMinutes).padStart(2, "0")} min
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
