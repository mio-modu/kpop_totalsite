import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides, jamo, stepPartners } from "@/content/guides";
import { reportsFor } from "@/content/reports";
import { guideJsonLd } from "@/lib/jsonld";
import { translationsFor } from "@/content/translations";
import { LOCALES } from "@/lib/i18n";
import { LanguageLinks } from "@/components/LanguageLinks";
import { JsonLd } from "@/components/JsonLd";
import { StackedScreens, SingleScreen, StepObject } from "@/components/Objects";
import { GocheokBowl } from "@/components/VenuePlan";
import { SourceDocument } from "@/components/SourceDocument";
import { Artwork } from "@/components/Artwork";
import { VerifiedBadge, StatusNotice } from "@/components/Badges";
import { PaidDisclosure, AffiliateLink } from "@/components/Affiliate";
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
    // The headline is for the page; this is for a search result, which cuts
    // around 60 characters. Falls back to the headline where it already fits.
    title: guide.searchTitle ?? guide.title,
    description: guide.summary,
    alternates: {
      canonical: `/guides/${guide.slug}`,
      // Only emitted where a translation actually exists. Advertising a
      // language that 404s is worse than advertising none, and hreflang is
      // reciprocal — the translated page points back here as x-default.
      ...(translationsFor(guide.slug).length > 0 && {
        languages: {
          "x-default": `/guides/${guide.slug}`,
          en: `/guides/${guide.slug}`,
          ...Object.fromEntries(
            translationsFor(guide.slug).map((t) => [
              LOCALES[t.locale].tag,
              `${LOCALES[t.locale].prefix}/guides/${guide.slug}`,
            ]),
          ),
        },
      }),
    },
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

  const walked = reportsFor(slug);

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

        <LanguageLinks slug={guide.slug} />
      </header>

      {/* ─────────── The guide's own object ─────────── */}
      {/* Budgeted by height, and on the element itself rather than beside it.
          The previous cap was `max-w-[420px]` on the same node as `.wrap`,
          which sets max-width too — equal specificity, so source order decided
          and `.wrap`'s 1140px won. The cap had never applied: this piece
          rendered 1979px tall at 1280px and upscaled past its own 640px
          source, putting a screen and a half of object above a guide somebody
          came to read. A width cap would not have fixed it either, because
          these pieces are not the same shape. */}
      <div className="wrap mt-10 flex justify-center">
        <Artwork
          name={guide.art}
          fallback={null}
          priority
          maxHeight="min(44vh, 360px)"
        />
      </div>

      {/* ─────────── T21: the booking screens, or the guide's own diagram ───────────
          The screens are right for a guide about buying something and wrong for
          a guide about a building, which is what `diagram` exists to say. */}
      {guide.diagram === "gocheok-bowl" ? (
        <div className="wrap mt-10">
          <div className="flex justify-center">
            <GocheokBowl />
          </div>
          <p className="t-sm dim mt-4 max-w-[62ch]">
            Four levels, numbered outward from the floor. The two red dashed lines
            are the edges of the break where the seating stops and the numbering
            starts again &mdash; it widens with height, because the upper decks stop
            short of that corner. The red arrow is the direction every level counts
            in. Cyan circles are the seven gates, A to G; red squares are the ticket
            offices, which the chart marks 2, 3 and 4.
          </p>
          <p className="data-sm dim mt-2.5 max-w-[62ch]">
            Schematic, drawn from the venue&rsquo;s own chart rather than traced from
            it. Which block sits beside which gate to a single number is a question
            for that chart, linked at the foot of this page.
          </p>
        </div>
      ) : (
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
      )}

      {/* ─────────── Scope + draft notice ─────────── */}
      <div className="wrap mt-8 grid gap-3">
        <div className="obj p-5 sm:p-6">
          <p className="data dim">
            Scope <span className="han text-[0.6875rem]">적용 범위</span>
          </p>
          <p className="t-sm mt-3">{guide.scope}</p>
        </div>
        <StatusNotice guide={guide} />
        <PaidDisclosure guide={guide} />
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
                {stepPartners(step).map((link) => (
                  <AffiliateLink
                    key={`${link.id}:${link.area ?? ""}`}
                    id={link.id}
                    text={link.text}
                    area={link.area}
                  />
                ))}
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

      {/*
        The in-article ad sits here, above the reproduced document rather than
        below it, and that ordering is a licence condition rather than taste.

        공공누리 제1유형 permits the chart on two conditions, and the second one
        is easy to miss: the user must not present anything that would make a
        third party mistakenly believe the public institution sponsors them or
        has a special relationship with them. An ad unit rendered immediately
        under 서울시설공단's own drawing, with its credit line between them, is
        exactly that impression — and it only happened on document guides,
        because the document section is the only thing that comes between the
        steps and this slot.

        Moving the slot changes nothing for the other guides: steps, ad, FAQ,
        as before. On a document guide the chart is now followed by the FAQ.
        `scripts/documents.test.mjs` asserts the order, because the next person
        to add a section here will not know this paragraph exists.
      */}
      <div className="wrap">
        <AdSlot placement="article" />
      </div>

      {guide.document ? (
        <section className="wrap mt-14">
          <h2 className="pl">The chart itself</h2>
          <p className="han-m dim mt-3">좌석배치도</p>
          <div className="mt-8">
            <SourceDocument guide={guide} />
          </div>
        </section>
      ) : null}

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

      {/* ─────────── The ask ───────────
          Below the sources rather than above the steps, because a reader who
          has not read the guide has nothing to report yet. The count is
          derived from content/reports.ts, so the sentence cannot claim
          evidence the register does not hold. */}
      <section className="wrap mt-10">
        <div className="obj p-6 sm:p-7">
          <p className="data dim">
            Walked this? <span className="han text-[0.6875rem]">제보</span>
          </p>
          {walked.length > 0 ? (
            <p className="t mt-3">
              {walked.length === 1
                ? "One reader has reported walking this flow"
                : `${walked.length} readers have reported walking this flow`}{" "}
              — most recently on {walked[walked.length - 1].walked}. If the screens have
              moved since, that is worth knowing.
            </p>
          ) : (
            <p className="t mt-3">
              Nobody has reported walking this one yet. This page is traced to the
              platform&apos;s own documentation and no further — if you have just done it,
              what the screens actually said is the thing that would improve it most.
            </p>
          )}
          <p className="mt-4">
            <Link href="/report" className="btn px-5 py-3">
              Tell us what you saw
            </Link>
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
