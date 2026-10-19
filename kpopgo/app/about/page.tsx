import type { Metadata } from "next";
import Link from "next/link";
import { guides, RESEARCH_DATE } from "@/content/guides";
import { SHELF_LIFE, displayStatus, type DisplayStatus } from "@/lib/freshness";
import { site } from "@/lib/site";

// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About",
  description:
    "Who writes KPOPGO, how each guide is checked, and what this site will not do.",
  alternates: { canonical: "/about" },
};

/**
 * The honest sentence for whatever the mix currently is.
 *
 * The earlier version had two branches, "all drafts" and "some verified", and
 * would have had to be rewritten the moment a third state existed. It is
 * assembled from the tally instead, so the page cannot fall behind the content.
 */
function describe(n: {
  draft: number;
  sourced: number;
  reported: number;
  verified: number;
  expired: number;
  /** Stored status, not derived: has anybody ever walked one of these? */
  everWalked: boolean;
  total: number;
}) {
  const parts: string[] = [];
  if (n.verified) parts.push(`${n.verified} walked end to end`);
  if (n.reported) parts.push(`${n.reported} cross-checked with fans who did it`);
  if (n.sourced) parts.push(`${n.sourced} checked against official sources`);
  if (n.expired) parts.push(`${n.expired} past the date it can vouch for itself`);
  if (n.draft) parts.push(`${n.draft} still being written`);
  const list =
    parts.length > 1
      ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`
      : (parts[0] ?? "none yet");
  // Keyed on the stored status, not the tally. A guide somebody walked in
  // March whose seal has since expired still means somebody walked it, and
  // "nobody has ever done this" would be false on a page about being accurate.
  const tail = n.everWalked
    ? ""
    : " Nobody has yet created an account and gone through one of these flows personally, and we would rather say so than claim a verification we have not done — that is the whole reason this site has any right to exist alongside the ones that are out of date.";
  return `Of ${n.total} guides: ${list}.${tail}`;
}

/**
 * AdSense reviewers look for a real publisher behind a site, and readers
 * deciding whether to trust a procedure want the same thing. One page answers
 * both — including the part that is least flattering, which is that nothing
 * here has been walked end to end yet.
 */
export default function About() {
  // Counted off the derived status, not the stored one: a page whose check has
  // lapsed should not be counted here as though it still held.
  const tally = (s: DisplayStatus) =>
    guides.filter((g) => displayStatus(g) === s).length;
  const draft = tally("draft");
  const sourced = tally("sourced");
  const reported = tally("reported");
  const verified = tally("verified");
  const expired = tally("stale");
  const everWalked = guides.some((g) => g.status === "verified");

  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="pl max-w-[20ch]">About this site</h1>
      <p className="han-m dim mt-3.5">이 사이트에 대하여</p>

      <div className="mt-10 grid max-w-[68ch] gap-8">
        <section>
          <p className="t-lg">
            KPOPGO exists because the English guides that rank for &quot;how to buy K-pop
            concert tickets&quot; describe a ticketing site that has since been renamed,
            under rules that have since changed.
          </p>
        </section>

        <section>
          <h2 className="pm">What we do</h2>
          <p className="t mt-3">
            We write the procedure an international fan actually has to follow: which
            platform a show is sold on, which identity check that platform runs, how a
            fan club presale is qualified for, and why an overseas card gets declined at
            the payment step. Each guide is a sequence you can work through, with the
            point where it usually goes wrong called out at every step.
          </p>
        </section>

        <section>
          <h2 className="pm">How a guide is checked</h2>
          <p className="t mt-3">
            Every claim links its source, and every page carries the date it was last
            held against the live platform. What a page does <em>not</em> get is a
            single tick that means nothing in particular. There are three kinds of
            check, they are not interchangeable, and each page says which one it has
            had.
          </p>
          <ul className="t mt-4 grid gap-3">
            <li>
              <strong>Sourced</strong> — every step traced to the platform&apos;s own
              help pages, the official announcement, or press reporting, each linked and
              dated. Nobody from this site went through the flow.{" "}
              <span className="dim">Expires after {SHELF_LIFE.sourced} days.</span>
            </li>
            <li>
              <strong>Reported</strong> — the above, plus the failure points
              cross-checked against fans who did it from outside Korea. Second-hand, but
              second-hand from people who hit the wall.{" "}
              <span className="dim">Expires after {SHELF_LIFE.reported} days.</span>
            </li>
            <li>
              <strong>Verified</strong> — somebody created an account and walked it end
              to end.{" "}
              <span className="dim">Expires after {SHELF_LIFE.verified} days.</span>
            </li>
          </ul>
          <p className="t mt-4">
            The expiry is the part that matters, and it is automatic. Every guide
            ranking for these questions today was accurate when it was written; they are
            wrong now because nothing made them stop claiming otherwise. Here the claim
            comes down on its own, and the weaker check comes down sooner — a procedure
            nobody tested is held to a shorter clock than one somebody walked, not a
            longer one.
          </p>
          <p className="t mt-4">
            {describe({
              draft,
              sourced,
              reported,
              verified,
              expired,
              everWalked,
              total: guides.length,
            })}
          </p>
          <p className="t mt-4">
            The full method — what each badge means, how long a check is good for, and a
            dated log of the corrections we have had to make — is on{" "}
            <Link href="/editorial-policy" className="ju underline underline-offset-4">
              how we check things
            </Link>
            .
          </p>
          <p className="data dim mt-4">Research compiled {RESEARCH_DATE}</p>
        </section>

        <section>
          <h2 className="pm">What we will not do</h2>
          <ul className="t mt-3 grid gap-2.5">
            <li>
              <strong>Help you around an identity check.</strong> Where a platform
              requires Korean 본인인증 we say so, and describe the official routes open to
              overseas fans instead.
            </li>
            <li>
              <strong>Use idol photographs.</strong> Not one. Every object and figure on
              this site was drawn or photographed for it, and every silhouette is
              anonymous.
            </li>
            <li>
              <strong>Take payment for a recommendation.</strong> Advertising is labelled
              and no advertiser has any say over what a guide says.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="pm">Independence</h2>
          <p className="t mt-3">
            KPOPGO is an independent fan resource. It is not affiliated with, endorsed by
            or operated by any agency, artist or ticketing platform. Platform rules change
            — the official announcement for your show always overrides anything written
            here.
          </p>
        </section>

        <section>
          <h2 className="pm">Contact</h2>
          <p className="t mt-3">
            Corrections are the most useful thing you can send. If a step has changed, or
            a guide cost you a sale, we want to know:{" "}
            <span className="ju">hello@{site.host}</span>
          </p>
          <p className="t mt-3">
            See also the <Link href="/privacy" className="ju underline underline-offset-4">privacy policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
