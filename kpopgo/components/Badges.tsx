import type { Guide, GuideStatus } from "@/content/guides";
import { displayStatus, daysSince, expiresAfter, type DisplayStatus } from "@/lib/freshness";

/**
 * The 인장 seal. A Korean seal is a mark of authentication, which is exactly
 * what this badge asserts — so the badge is a seal rather than a tick.
 *
 * The Hangul character changes with the claim, because 검 is the first
 * character of 검증 (verification) and putting it on a page that has not been
 * verified would be the first small lie. 출 is 출처 (source), 교 is 교차
 * (cross-check), 초 is 초안 (draft), 만 is 만료 (expired).
 *
 * It takes the guide rather than a status, because what the page is entitled
 * to say depends on how old the check is, not only on what the content claims.
 */
const SEAL: Record<DisplayStatus, { han: string; label: string; cls: string }> = {
  verified: { han: "검", label: "Verified", cls: "" },
  reported: { han: "교", label: "Reported", cls: " seal-cy" },
  sourced: { han: "출", label: "Sourced", cls: " seal-plain" },
  draft: { han: "초", label: "Draft", cls: " seal-draft" },
  stale: { han: "만", label: "Expired", cls: " seal-stale" },
};

export function VerifiedBadge({ guide }: { guide: Guide }) {
  const { han, label, cls } = SEAL[displayStatus(guide)];
  return (
    <span className={`seal${cls}`}>
      <span className="seal-han">{han}</span>
      {label} · {guide.lastChecked}
    </span>
  );
}

/**
 * What kind of check this page has had, in the reader's words, above the steps.
 *
 * Four different notices rather than one with the wording softened, because
 * they are four different statements and the differences are the whole point.
 * `sourced` is not an apology for not being `verified`: it says the procedure
 * below is the official one as the platform stated it on a date you can see,
 * which is already more than any undated guide offers. `verified` says nothing
 * at all, because a page that has actually been walked does not need to
 * explain itself.
 */
export function StatusNotice({ guide }: { guide: Guide }) {
  const state: DisplayStatus = displayStatus(guide);
  if (state === "verified") return null;
  if (state === "stale") return <Expired guide={guide} />;

  if (state === "reported") {
    return (
      <Notice en="Cross-checked with fans who did it" ko="교차 확인">
        <p className="t-sm mt-3">
          Every step below is traced to the platform&apos;s own documentation or the
          official announcement, all linked at the bottom. The points where it goes
          wrong were then checked against reports from fans who went through it from
          outside Korea — second-hand, but second-hand from people who hit the wall.
        </p>
        <p className="t-sm mt-3">
          Nobody on this site has created an account and walked it personally, which is
          why it is not marked verified. Check the official announcement for your
          specific show before acting on any step.
        </p>
      </Notice>
    );
  }

  if (state === "sourced") {
    return (
      <Notice en="Checked against official sources" ko="출처 기준 확인">
        <p className="t-sm mt-3">
          Every step below comes from the platform&apos;s own help pages, the official
          announcement for a show, or press reporting — each one linked at the bottom
          of this page with the date it was read. This is the official procedure as the
          platforms stated it on {guide.lastChecked}.
        </p>
        <p className="t-sm mt-3">
          It is not a first-hand account and does not claim to be: nobody on this site
          has created an account and gone through this flow personally. That is the
          difference between this page and a verified one, and it is why this page
          expires sooner — after {expiresAfter("sourced")} days it stops making the
          claim by itself rather than waiting for anyone to notice.
        </p>
        <p className="t-sm mt-3">
          Check the official announcement for your specific show before acting on any
          step.
        </p>
      </Notice>
    );
  }

  return (
    <Notice en="Still being written" ko="작성 중">
      <p className="t-sm mt-3">
        This page is a draft. Its steps have not yet been traced back to a source for
        every claim, so do not act on it — read a sourced guide instead.
      </p>
    </Notice>
  );
}

/**
 * Expiry wording follows what expired. "Someone did walk this flow" is true of
 * a lapsed verification and false of a lapsed source check, and a single
 * notice covering both would have to say the weaker thing on the stronger page
 * or the stronger thing on the weaker one.
 */
function Expired({ guide }: { guide: Guide }) {
  const age = daysSince(guide.lastChecked);
  const was: GuideStatus = guide.status;
  return (
    <Notice en="This check has expired" ko="검증 만료">
      <p className="t-sm mt-3">
        {was === "verified"
          ? `Someone did walk this flow, on ${guide.lastChecked} — ${age} days ago.`
          : `This page was last held against the live platforms on ${guide.lastChecked} — ${age} days ago.`}{" "}
        That is long enough for a platform to have changed a step, and these platforms
        have been renamed twice in two years, so the seal comes down by itself rather
        than waiting for anyone to remember. The steps below are what was true then.
      </p>
      <p className="t-sm mt-3">
        Check the official announcement for your specific show before acting on any
        step.
      </p>
    </Notice>
  );
}

function Notice({
  en,
  ko,
  children,
}: {
  en: string;
  ko: string;
  children: React.ReactNode;
}) {
  return (
    <div className="obj-ju p-5 sm:p-6">
      <p className="data ju">
        {en} <span className="han text-[0.6875rem]">{ko}</span>
      </p>
      {children}
    </div>
  );
}
