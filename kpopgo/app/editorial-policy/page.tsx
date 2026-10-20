import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/content/guides";
import { corrections } from "@/content/corrections";
import { partners } from "@/content/affiliates";
import { SHELF_LIFE } from "@/lib/freshness";
import { site } from "@/lib/site";

// Derived status needs a daily rebuild — see the note in app/page.tsx.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "How we check things, and what we got wrong",
  description:
    "The evidence ladder behind every KPOPGO guide, how long each kind of check is good for, what we will not publish, and a dated log of our own corrections.",
  alternates: { canonical: "/editorial-policy" },
};

/**
 * The method, in the reader's words rather than the code's.
 *
 * Three things pushed this page into existence. The badges say "Sourced" and
 * a date, which means something to whoever wrote the system and nothing to a
 * fan who has thirty minutes before a sale opens. There was nowhere to put the
 * reasoning behind the expiry, so it lived in a TypeScript comment. And a
 * review found a year-old error in a law date, which needed somewhere to be
 * published rather than quietly patched.
 *
 * The corrections log is the part that matters. Every site claims to check its
 * facts; only a dated list of the times that failed is evidence.
 */
export default function EditorialPolicy() {
  const sourceCount = guides.reduce((n, g) => n + g.sources.length, 0);
  const stepCount = guides.reduce((n, g) => n + g.steps.length, 0);

  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="pl max-w-[22ch]">How we check things, and what we got wrong</h1>
      <p className="han-m dim mt-3.5">검증 방식과 정정 기록</p>

      <div className="mt-10 grid max-w-[68ch] gap-8">
        <section>
          <p className="t-lg">
            Every guide here competes with pages that were accurate when they were
            written. They rank above us today and they are wrong today, because nothing
            ever made them stop claiming otherwise. This page is the machinery that is
            meant to stop the same thing happening here — and the record of the time it
            did not.
          </p>
        </section>

        <section>
          <h2 className="pm">Three kinds of check, not a progress bar</h2>
          <p className="t mt-3">
            A badge on every guide says which kind of evidence it has. They are not
            stages on the way to the same destination; they are different claims, and we
            would rather make the smaller one accurately.
          </p>
          <ul className="t mt-4 grid gap-3">
            <li>
              <strong>Sourced</strong> — every step traced to the platform&apos;s own help
              pages, the official announcement for a show, or press reporting, each linked
              at the foot of the guide. Nobody from this site went through the flow.
            </li>
            <li>
              <strong>Reported</strong> — the above, and the points where it goes wrong
              checked against fans who did it from outside Korea. Second-hand, but
              second-hand from people who hit the wall.
            </li>
            <li>
              <strong>Verified</strong> — somebody here created an account and walked it
              end to end.
            </li>
          </ul>
          <p className="t mt-4">
            Today all {guides.length} guides are <strong>Sourced</strong>: {stepCount}{" "}
            steps traced to {sourceCount} linked sources, and nobody has walked one end to
            end. That is on every page, in the place a tick would normally go.
          </p>
        </section>

        <section>
          <h2 className="pm">A check has a shelf life, and the weaker one is shorter</h2>
          <p className="t mt-3">
            Past its date, a guide stops claiming the check by itself. No one has to
            remember, which is the point, because no one does.
          </p>
          <ul className="t mt-4 grid gap-2.5">
            <li>
              <strong>Sourced — {SHELF_LIFE.sourced} days.</strong> Documentation that
              nobody tested is exactly what is wrong with the guides we are trying to
              beat, so it is held to the shortest clock.
            </li>
            <li>
              <strong>Reported — {SHELF_LIFE.reported} days.</strong>
            </li>
            <li>
              <strong>Verified — {SHELF_LIFE.verified} days.</strong>
            </li>
          </ul>
          <p className="t mt-4">
            The ordering is the whole defence. If a page nobody walked could outlast one
            somebody did, the ladder would be a way of making a weaker claim last longer.
            A test in the build fails if anyone ever reverses it.
          </p>
          <p className="t mt-4">
            <strong>Expired does not mean wrong.</strong> It means the date is old enough
            that you should check the official announcement for your show before acting on
            a step — which is advice this page would give you anyway. Once a week an
            automated job re-checks that every source we cite still resolves, and watches
            the three ticketing platforms for another rename.
          </p>
        </section>

        <section>
          <h2 className="pm">What we will not publish</h2>
          <ul className="t mt-3 grid gap-2.5">
            <li>
              <strong>A way around an identity check.</strong> Where a platform requires
              Korean 본인인증 we say so and describe the official routes open to overseas
              fans. Borrowed numbers and other people&apos;s memberships lose orders.
            </li>
            <li>
              <strong>Idol photographs or likenesses.</strong> Not one, anywhere, including
              generated ones. Every figure here is an anonymous silhouette.
            </li>
            <li>
              <strong>A verification nobody performed.</strong> The badge is the product.
            </li>
            <li>
              <strong>Anything an advertiser asked for.</strong> Advertising is labelled,
              and no advertiser has any say over what a guide says.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="pm">Who pays us</h2>
          {partners.length === 0 ? (
            <>
              <p className="t mt-3">
                <strong>Nobody, today.</strong> There is not a single paid link anywhere
                on this site, and no advertising is running yet. This paragraph is
                generated from the register itself, so it cannot stay here after that
                stops being true.
              </p>
              <p className="t mt-3">
                When that changes, every company paying us will be named here, with what
                they sell and how they pay. The rules are already fixed: a paid link goes
                in only where the thing would have been named anyway, the commission never
                changes what a step says, and any guide containing one carries a notice
                above its first step rather than a line in the footer.
              </p>
            </>
          ) : (
            <>
              <p className="t mt-3">
                Every company that pays this site is named here. A guide containing a paid
                link says so above its first step, and the link itself is marked{" "}
                <span className="paid-tag">Paid</span> where it sits. The commission never
                changes what a step says.
              </p>
              <ul className="t mt-4 grid gap-3">
                {partners.map((x) => (
                  <li key={x.id}>
                    <strong>{x.name}</strong> — {x.what}. {x.howWeArePaid}{" "}
                    <span className="dim">Checked {x.checked}.</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section>
          <h2 className="pm">
            Corrections <span className="han text-[0.6875rem]">정정</span>
          </h2>
          <p className="t mt-3">
            Every site says it checks its facts. The only evidence that means anything is
            a dated list of the times the checking failed, so this is ours. Factual errors
            that reached a published page are logged here permanently, not quietly edited
            away.
          </p>
          <ol className="mt-5 grid gap-4">
            {corrections.map((c) => (
              <li key={c.date + c.where} className="obj p-5 sm:p-6">
                <p className="data ju">{c.date}</p>
                <p className="t-sm mt-3">
                  <strong>{c.where}</strong>
                </p>
                <p className="t-sm mt-2.5">{c.wrong}</p>
                <p className="t-sm mt-2.5">{c.right}</p>
                <p className="data-sm dim mt-3">{c.found}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="pm">Tell us we are wrong</h2>
          <p className="t mt-3">
            A correction is the most useful thing you can send. If a step has changed, if
            a screen does not look like the one described, or if a guide cost you a sale:{" "}
            <span className="ju">hello@{site.host}</span>
          </p>
          <p className="t mt-3">
            See also{" "}
            <Link href="/about" className="ju underline underline-offset-4">
              about this site
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="ju underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
