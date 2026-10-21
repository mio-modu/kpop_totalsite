import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/content/guides";
import { QUESTIONS, REPORT_TO, reports } from "@/content/reports";
import { site } from "@/lib/site";

/**
 * Where a reader who actually walked a flow can say what they saw.
 *
 * It renders a status count, so it carries the same revalidate as every other
 * page that does — a fully static page would freeze today's numbers on the day
 * it deploys, which is the exact failure the expiry rules exist to prevent.
 */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Report what you saw",
  description:
    "Walked one of these flows? Tell us what the screens actually said. Field reports are read by a person and are what moves a guide from Sourced to Reported.",
  alternates: { canonical: "/report" },
};

/**
 * The address reports go to.
 *
 * Falls back to the one /editorial-policy already publishes rather than
 * inventing a second: a site with two contact addresses has one nobody reads.
 */
const to = REPORT_TO || `hello@${site.host}`;

const SUBJECT = "Field report";
const BODY = QUESTIONS.map((q) => `${q.ask}\n`).join("\n");
const mailto = `mailto:${to}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

export default function ReportPage() {
  const reported = new Set(reports.map((r) => r.slug)).size;

  return (
    <div className="wrap py-12 sm:py-16">
      <header>
        <p className="pc-han">제보</p>
        <h1 className="pl mt-3 max-w-[20ch]">Report what you saw</h1>
        <p className="t-lg mt-5 max-w-[62ch]">
          Every guide here is <strong>Sourced</strong>: traced to the platform&apos;s own
          dated documentation. None is <strong>Verified</strong>, because nobody from
          this site has created an account and walked it end to end.
        </p>
        <p className="t mt-4 max-w-[62ch]">
          One person cannot walk twenty flows across four platforms from one country. If
          you just did one of them — passed the identity check, got through the queue,
          collected the ticket — you have already done the part nobody here can do alone.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="obj p-5">
          <p className="data dim">Guides</p>
          <p className="pm mt-2">{guides.length}</p>
          <p className="t-sm dim mt-2">Every one of them sourced.</p>
        </div>
        <div className="obj p-5">
          <p className="data dim">With field reports</p>
          <p className="pm mt-2">{reported}</p>
          <p className="t-sm dim mt-2">
            {reported === 0
              ? "Nobody has reported walking one yet."
              : "Readers have walked these and written in."}
          </p>
        </div>
        <div className="obj p-5">
          <p className="data dim">Verified</p>
          <p className="pm mt-2">0</p>
          <p className="t-sm dim mt-2">Nobody here has walked one end to end.</p>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="pm">What to send</h2>
        <p className="t mt-3 max-w-[62ch]">
          Answer what you can. A partial report is still evidence — most of them are, and
          the place you stopped is often the most useful line in it.
        </p>
        <ol className="mt-6 grid gap-5">
          {QUESTIONS.map((q, i) => (
            <li key={q.key} className="pc p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="pc-no shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h3 className="pm">{q.ask}</h3>
                  <p className="t-sm dim mt-2">{q.why}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href={mailto} className="btn px-5 py-3">
            Send a field report
          </a>
          <p className="t-sm dim">
            Opens your mail app with the questions filled in. Or write to{" "}
            <span className="ju">{to}</span> any way you like.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="pm">What happens to it</h2>
        <ul className="t mt-4 grid gap-3 max-w-[66ch]">
          <li>
            <strong>A person reads it.</strong> Nothing you send publishes itself, and
            nothing you write appears on the site in your words.
          </li>
          <li>
            <strong>If it holds up, the guide changes.</strong> Wrong steps get corrected
            and the correction is logged with a date on{" "}
            <Link href="/editorial-policy" className="ju underline underline-offset-4">
              how we check
            </Link>
            , permanently, rather than quietly edited away.
          </li>
          <li>
            <strong>The guide moves to Reported.</strong> That rung means the flow was
            checked against people who did it from outside Korea. It is derived from the
            reports on file — it cannot be typed in by hand, so a page can never claim
            evidence nobody sent.
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="pm">Why this is not a comment section</h2>
        <p className="t mt-3 max-w-[66ch]">
          It was going to be, and it would have cost more than it paid. The first thing an
          open box on these pages fills with is advice for getting around a Korean
          identity check — that is what fans most want to know, and it is the one thing
          this site refuses to publish, because a reader who follows it loses their order.
        </p>
        <p className="t mt-3 max-w-[66ch]">
          The rest follows from the same place. A stranger&apos;s guess renders in the same
          typeface as a sourced claim and a reader cannot tell them apart, on a site whose
          only product is being right. So reports are structured, private, and read before
          they count — and what a page ends up showing is not a thread but a number
          against a standard: this many readers walked this, on these dates.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="pm">What we will not ask you for</h2>
        <ul className="t mt-4 grid gap-3 max-w-[66ch]">
          <li>Your booking reference, passport number, or any part of your identity document.</li>
          <li>Screenshots containing your own name, seat or order number.</li>
          <li>Your account credentials, for any reason, ever.</li>
        </ul>
        <p className="t-sm dim mt-4 max-w-[66ch]">
          A report needs the wording on the screen, not the data on it. If a screenshot
          helps, cover everything that identifies you first.
        </p>
      </section>

      <p className="t mt-14">
        <Link href="/guides" className="ju underline underline-offset-4">
          Back to the guides
        </Link>
      </p>
    </div>
  );
}
