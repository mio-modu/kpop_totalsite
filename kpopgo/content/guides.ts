/**
 * The content layer.
 *
 * Every claim on this site has to carry three things or it does not ship:
 *   1. `sources`     — where it came from, linkable by the reader
 *   2. `lastChecked` — the day a human last held it against the live platform
 *   3. `status`      — how it was checked, which is not the same question
 *
 * The field is `lastChecked`, not `lastVerified`, because most of these pages
 * have been checked without having been verified, and a field name that says
 * otherwise is the first step towards a page that does.
 *
 * Nothing here helps anyone get around an identity check. Where a platform
 * requires Korean identity verification we say so plainly and describe the
 * official routes open to overseas fans instead.
 */

/**
 * How a guide was checked. Not a progress bar — each rung is a different
 * *kind* of evidence, and the page says which one it has.
 *
 *   draft     Being written. Not finished, not to be published as a claim.
 *   sourced   Every step traced to the platform's own documentation, the
 *             official announcement, or press reporting, each linked and
 *             dated. Nobody from this site went through the flow.
 *   reported  The above, plus the failure points cross-checked against fans
 *             who actually did it from outside Korea. Second-hand, but
 *             second-hand from people who hit the wall.
 *   verified  Somebody created an account and walked it end to end.
 *
 * `sourced` is not an excuse for the absence of `verified`; it is a different
 * and honest statement. "The official procedure, as the platform stated it on
 * 14 October 2026" is a claim this site can stand behind, and it is already a
 * stronger claim than the guides currently ranking, which are undated.
 *
 * What makes it honest rather than a loophole is that it expires faster. See
 * SHELF_LIFE in lib/freshness.ts: a sourced page goes off in 90 days, a
 * verified one in 180. Documentation nobody tested is exactly what was wrong
 * with every guide this site exists to replace, so it is held to the shorter
 * clock, not the longer one.
 */
import { partners } from "./affiliates";

export type GuideStatus = "draft" | "sourced" | "reported" | "verified";

export type Source = {
  label: string;
  url: string;
};

export type Step = {
  title: string;
  body: string;
  /** The thing that actually goes wrong here. This is the differentiator. */
  pitfall?: string;
  /** Rough wall-clock cost, so people can plan around a presale window. */
  takes?: string;
  /**
   * Where this step continues, when it continues in another guide.
   *
   * These five guides describe one process from five angles, and the same
   * obstacles recur across them: the identity check appears in three, the
   * name-matching problem in three, the card refusal in two. Written as five
   * separate pages with no path between them, a reader who hits the card
   * problem in the middle of guide 01 has to go back to a menu and guess —
   * and a crawler reads five unrelated pages instead of one subject covered
   * from five sides.
   *
   * Only where a reader would actually leave. A link on every step teaches
   * nothing, because then no link means anything.
   */
  see?: { slug: string; text: string };
  /**
   * A paid link, where one belongs.
   *
   * `id` names a partner in content/affiliates.ts, checked at build time the
   * same way `see` is. A step carrying this makes its whole guide render the
   * paid-link disclosure above step one — the notice is derived, never
   * remembered, because a disclosure someone has to remember is one that goes
   * missing from exactly the page that gets screenshotted.
   *
   * It goes in only where the thing would have been named anyway. If a step
   * had to be invented to hold it, it does not belong.
   */
  partner?: { id: string; text: string };
};

export type Guide = {
  slug: string;
  /** Short label for cards and nav. */
  name: string;
  /**
   * The one Korean word this guide is about, carried as the photocard's face.
   * Every one of them is a word on the real booking screen, so the card teaches
   * something before it is even opened.
   */
  ko: string;
  /**
   * A Hangul one-liner shown under the title. Not a translation of the English —
   * it uses the words a fan meets on the real booking screen, so it carries
   * information an international reader can act on.
   */
  koLine: string;
  /** Full <title> / h1. Written as the query a fan actually types. */
  title: string;
  /** Meta description + card subtitle. */
  summary: string;
  /** Emoji-free glyph key — mapped to an inline SVG in components/Glyph.tsx */
  glyph: "ticket" | "id" | "card" | "star" | "parcel";
  /** Artwork id from content/artwork.ts. Falls back to the drawn SVG. */
  art: string;
  status: GuideStatus;
  /** The day a human last held this against the live platform. */
  lastChecked: string;
  /** What this guide does and does not cover. Rendered above the steps. */
  scope: string;
  readMinutes: number;
  /** Platforms this guide touches, for cross-linking and filtering. */
  platforms: string[];
  intro: string[];
  steps: Step[];
  /** Rendered as FAQPage structured data as well as on-page. */
  faq: { q: string; a: string }[];
  sources: Source[];
};

/** Single source of truth for the "as of" date shown in the footer. */
export const RESEARCH_DATE = "2026-10-14";

export const guides: Guide[] = [
  {
    slug: "buy-k-pop-concert-tickets-from-overseas",
    ko: "예매",
    art: "guide-tickets",
    name: "Start here",
    koLine: "해외에서 한국 공연 티켓 사기 — 전체 흐름",
    title: "How to buy K-pop concert tickets from outside Korea",
    summary:
      "The whole picture before you start: which platform your show is on, what identity check it runs, and what to have ready before the sale opens.",
    glyph: "ticket",
    status: "sourced",
    lastChecked: RESEARCH_DATE,
    scope:
      "Covers shows held in South Korea and the ticketing platforms Korean agencies use. Overseas tour dates are sold by local promoters and are covered separately — the rules below do not apply to them.",
    readMinutes: 8,
    platforms: ["Weverse", "NOL World", "YES24 Global", "Melon Ticket"],
    intro: [
      "Almost every guide that ranks for this question was written before December 2025 and tells you to use a site that no longer exists under that name. That is the main reason this page exists.",
      "There is no single K-pop ticketing site. The platform is chosen per tour by the agency and promoter, and it is named in the official announcement for that show. Everything else — which identity check you face, whether a foreign card works, how early the presale opens — follows from that one fact.",
      "So the order of operations is: find the official announcement first, identify the platform, then prepare for that platform's specific requirements. Doing it the other way around is how people end up with a verified account on the wrong site an hour before the sale.",
    ],
    steps: [
      {
        title: "Find the official announcement, not a fan repost",
        body: "Go to the artist's official channels — the agency site, the artist's Weverse community, and their official X/Instagram. The announcement names the ticketing platform, the presale and general sale times in KST, the membership tier required for presale, and any residency or verification conditions. Screenshot it. Everything you do next depends on this one document.",
        pitfall:
          "Fan accounts aggregate and paraphrase, and they get the platform wrong often enough to cost you the sale. They also rarely update when a date moves.",
        takes: "10 minutes",
      },
      {
        title: "Identify your platform — and do not assume it from the label",
        body: "HYBE artists generally route through Weverse's own ticketing. Other Korean tours commonly use NOL Ticket (the Korean-language site) or NOL World (its overseas-facing counterpart), YES24, or Melon Ticket. But this is a tendency, not a rule: agencies switch platforms between tours, and a single tour can split the Korean sale and the global sale across two different sites. Read the announcement.",
        pitfall:
          "Treating the mapping as fixed — 'HYBE means Weverse, SM means YES24' — is the single most common error in existing guides. It is wrong often enough to matter.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-ticketing-guide",
          text:
            "If your show is on NOL World, the route from here is step by step in the NOL World guide.",
        },
      },
      {
        title: "Work out which identity check you face",
        body: "Korean-language ticketing sites generally verify identity against a Korean mobile number, which in practice requires a Korean residency document to obtain. If you do not have one, the Korean-language site is not your route. The overseas-facing sites exist precisely for this case and verify by other means — typically passport details matched to your account. Decide now which site you are using, because the account you need is on that site.",
        pitfall:
          "Trying to force the Korean-language site to work is wasted effort, and arrangements that borrow someone else's identity for verification are not something we will help with — they put your ticket and your account at risk.",
        takes: "15 minutes",
        see: {
          slug: "nol-world-ticketing-guide",
          text:
            "What the overseas-facing check actually asks for, and how long it takes to clear.",
        },
      },
      {
        title: "Create the account with your passport details exactly",
        body: "Enter your legal name as it appears in the machine-readable zone of your passport, and your date of birth in the format the site expects. If the show requires a fan club membership for presale, the name and date of birth on the membership and on the ticketing account have to be the same. Mismatches are a documented cause of cancelled orders at the gate or during verification.",
        pitfall:
          "Middle names, hyphenated surnames and name order are where this breaks. A membership reading 'Maria Santos' and a passport reading 'Maria Elena Santos Cruz' is a mismatch.",
        takes: "20 minutes",
        see: {
          slug: "fan-club-presale-checklist",
          text:
            "Where a presale is involved, the same name has to match in a third place as well.",
        },
      },
      {
        title: "Verify your payment method days ahead, not on the day",
        body: "Overseas-issued cards are commonly accepted but often only after your account has been verified as an overseas customer. Separately, your bank may block a first-time Korean merchant charge, and 3-D Secure prompts can fail inside an in-app browser. Call your bank, enable international transactions, and if the platform offers a test-able flow, run a small unrelated purchase first.",
        pitfall:
          "A card that declines in the payment step frees your seat back into the pool within minutes. This is the most expensive failure in the whole process and it is entirely preventable.",
        takes: "1-3 days of lead time",
        see: {
          slug: "foreign-card-declined-korean-ticketing",
          text:
            "If a card has already been refused, the card guide works through the three systems that can refuse it.",
        },
      },
      {
        title: "Set up for the sale itself",
        body: "Log in and complete every verification step at least a day early. On the day, be signed in well before the opening time, with the official KST time as your reference rather than your device clock. Have your seat preferences decided in advance — most queue systems give you a short window to choose and pay before releasing your hold.",
        pitfall:
          "Opening a fresh incognito window 'to be safe' means logging in and re-verifying inside the queue. Do not.",
        takes: "30 minutes before open",
      },
      {
        title: "Know the resale rules before you consider resale",
        body: "South Korea tightened its rules on ticket resale with a revision to the Performances Act that took effect on 28 August 2026 — amended in January, promulgated in February, in force since late August. Reporting on the change describes a prohibition on habitual or commercial resale above the purchase price, reaching buying with intent to resell as well as selling, and no longer limited to purchases made with automation. Penalties reported include fines of up to fifty times the sale value and forfeiture of the proceeds. Treat above-face resale for Korean shows as off the table, and use the platform's own official resale or transfer function if the show provides one.",
        pitfall:
          "This is new law, in force only since August 2026, and the threshold for \u0022habitual\u0022 is still being settled in practice. A listing existing on an international resale marketplace tells you nothing about whether buying or selling it is safe for you.",
        takes: "5 minutes",
      },
    ],
    faq: [
      {
        q: "If my membership expires before the presale, can I just renew it in time?",
        a: "Only if the renewal lands before the eligibility cut-off, and that cut-off is usually earlier than the presale itself. Weverse Shop\u0027s Auto Payment, available since 3 September 2026 on memberships that support it, charges a registered method on the last day of the validity period, which removes the gap entirely. Set it up before a tour is announced rather than after.",
      },
      {
        q: "Do I need a Korean phone number to buy K-pop concert tickets?",
        a: "For the Korean-language ticketing sites, identity verification generally depends on a Korean mobile number, and obtaining one normally requires Korean residency documentation. For the overseas-facing sites, you generally do not — they verify overseas customers by other means, typically passport details. Which applies to you depends on which platform your specific show is sold on.",
      },
      {
        q: "Can I use a foreign credit card?",
        a: "Usually yes on the overseas-facing platforms, and often only after your account is verified as an overseas customer. Expect your own bank to be the other half of the problem: enable international transactions in advance and be ready for a 3-D Secure prompt.",
      },
      {
        q: "How far ahead does the fan club presale open?",
        a: "It varies by show, and the official announcement is the only reliable answer. Presale windows are commonly a day or more before the general sale, and membership usually has to be active before a cut-off that is earlier still. Do not infer the timing from a previous tour.",
      },
      {
        q: "Is the Korean site and the global site the same queue?",
        a: "Not necessarily. Allocations, verification and fan club recognition can be handled separately between a Korean-language sale and a global sale for the same show. A membership verified on one is not automatically recognised on the other, so check the announcement for which applies to you.",
      },
    ],
    sources: [
      {
        label: "Weverse — official concerts and ticketing",
        url: "https://concerts.weverse.io/",
      },
      {
        label: "NOL World (formerly interpark Global) — rebrand announcement, 1 Dec 2025",
        url: "https://sg.finance.yahoo.com/news/interpark-global-rebrands-nol-world-230000074.html",
      },
      {
        label: "Korea.net — government briefing on the ticket resale crackdown",
        url: "https://www.korea.net/Government/Briefing-Room/Press-Releases/view?articleId=80109&type=N&insttCode=A260303",
      },
      {
        label: "SCMP — penalties under the revised Performances Act, in force 28 Aug 2026",
        url: "https://www.scmp.com/week-asia/lifestyle/article/3360219/south-korean-ticket-touts-face-music-when-new-penalties-come-play",
      },
    ],
  },

  {
    slug: "nol-world-ticketing-guide",
    ko: "놀 월드",
    art: "guide-nol",
    name: "NOL World",
    koLine: "놀 월드 예매 안내 — 구 인터파크 글로벌",
    title: "NOL World tickets: the site that was Interpark Global",
    summary:
      "The site that used to be interpark Global. It was renamed on 1 December 2025, most guides still send you to the old name, and here is the current route step by step.",
    glyph: "id",
    status: "sourced",
    lastChecked: RESEARCH_DATE,
    scope:
      "Covers the overseas-facing platform for Korean shows. The Korean-language NOL Ticket site is a separate product with a separate account system and a stricter identity check.",
    readMinutes: 6,
    platforms: ["NOL World", "NOL Ticket"],
    intro: [
      "Two renames happened close together and almost every English guide online has absorbed neither. Yanolja Core consolidated its brands under the NOL name in April 2025, which is when Interpark Ticket became NOL Ticket. Then on 1 December 2025 the overseas-facing interpark Global became NOL World.",
      "The practical consequence: guides telling you to go to 'Interpark Global', and screenshots of its old interface, are describing a product that has been renamed and redesigned. If you are following one of those, you are navigating by an out-of-date map.",
      "This page tracks the current one. The date at the top is when it was last checked.",
    ],
    steps: [
      {
        title: "Start on the overseas-facing site, not the Korean one",
        body: "NOL World is the front door for overseas fans. The Korean-language NOL Ticket site runs the stricter domestic identity check and is generally not the route for you unless you hold Korean residency documentation. They are separate accounts — registering on one does not give you the other.",
        pitfall:
          "Search results and old bookmarks still resolve to the previous branding. Confirm you are on the overseas site before you spend time creating an account.",
        takes: "5 minutes",
      },
      {
        title: "Register with passport-exact details",
        body: "Use your legal name and date of birth as printed in your passport. If the show you want has a fan club presale, these details need to match your membership record as well. Fix any mismatch before the presale window opens, not during it.",
        pitfall:
          "Changing a verified name later is a support-ticket process, not a settings toggle. Get it right the first time.",
        takes: "20 minutes",
        see: {
          slug: "fan-club-presale-checklist",
          text:
            "The membership record is the third name that has to agree, and it is the one people forget.",
        },
      },
      {
        title: "Complete overseas-customer verification before you need it",
        body: "Overseas-customer verification is a one-time action per account, and NOL World states that the verified information cannot be reused. Verify on the account you actually intend to buy with — if you have more than one, the verification does not move between them. Deleting an account does erase its verification and free it for another, but an account restricted for misuse cannot be deleted at all. There is no age limit on verification itself, though age-restricted events may still refuse the booking. The confirmation arrives by email, so check spam before concluding it failed.",
        pitfall:
          "Discovering at the payment step that verification is still pending is the classic way to lose a held seat.",
        takes: "1-3 days including processing",
        see: {
          slug: "foreign-card-declined-korean-ticketing",
          text:
            "A pending verification looks exactly like a card problem at the payment step.",
        },
      },
      {
        title: "Check the per-show conditions on the event page",
        body: "Seat limits per account, whether a membership is required, ID requirements at the venue, and whether the show is open to overseas purchasers at all are set per event. Read the event page and the official announcement together — where they disagree, the official announcement for your show wins.",
        pitfall:
          "Some shows restrict particular seat blocks or sale rounds to domestic purchasers. This is per show and not discoverable from a general guide.",
        takes: "10 minutes",
      },
      {
        title: "Bring the right document to collection",
        body: "Collection is at the venue box office on the day of the show and not before — NOL World says tickets cannot be picked up on an earlier day. The window opens one hour before the show, and you need the confirmation number together with identification. Allow for a queue at the box office itself. Once collected, a ticket cannot be re-issued if it is lost or stolen.",
        pitfall:
          "Name on the booking, name on the document and name on the membership all have to agree. A nickname anywhere in that chain is a problem.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "Is NOL World the same as Interpark Global?",
        a: "It is the same overseas-facing ticketing service after a rebrand. interpark Global was renamed NOL World on 1 December 2025, following Yanolja Core's consolidation of its brands under the NOL name in April 2025, when Interpark Ticket became NOL Ticket.",
      },
      {
        q: "Why does my old bookmark still say Interpark?",
        a: "Rebrands take a while to propagate through search results, third-party guides and cached pages. Navigate from the official announcement for your show rather than from a saved link or a blog post.",
      },
      {
        q: "Can I use my NOL Ticket account on NOL World?",
        a: "Treat them as separate accounts with separate verification. Do not assume a login or a completed verification carries across — confirm on the site you will actually be buying from.",
      },
    ],
    sources: [
      {
        label: "interpark Global rebrands to NOL World, 1 Dec 2025",
        url: "https://sg.finance.yahoo.com/news/interpark-global-rebrands-nol-world-230000074.html",
      },
      {
        label: "Chosun — Yanolja Core brand consolidation under NOL",
        url: "https://www.chosun.com/english/industry-en/2026/09/08/K47OIMIW7BBSBDXFJ7XN4SAARA/",
      },
      {
        label: "NOL World — overseas ticketing",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },

  {
    slug: "fan-club-presale-checklist",
    ko: "선예매",
    art: "guide-presale",
    name: "Presale access",
    koLine: "팬클럽 선예매 — 자격 만들기",
    title: "Fan club presale: how to qualify before it closes",
    summary:
      "Membership alone is not access. There is a verification step between the two, it has its own deadline, and missing it is the most common way fans lose a presale.",
    glyph: "star",
    status: "sourced",
    lastChecked: RESEARCH_DATE,
    scope:
      "Covers the general shape of fan club presale qualification for Korean shows. Every tour sets its own tiers, cut-offs and conditions in the official announcement, which overrides anything general.",
    readMinutes: 5,
    platforms: ["Weverse", "NOL World", "YES24 Global"],
    intro: [
      "Presale access is a chain of three links, and fans usually only know about the first one. You buy the membership. Then you link and verify that membership against the ticketing account. Only then do you get the presale entitlement.",
      "Each link has its own deadline, and the verification deadline is routinely earlier than people expect — in some cases days before the presale itself. A membership bought the night before can be too late even though it is active.",
      "Treat the announcement as the spec and this page as the checklist.",
    ],
    steps: [
      {
        title: "Read the eligibility clause, not the headline",
        body: "The announcement will specify which membership product and tier qualifies, and the date by which it must have been purchased or active. These are two different dates and both matter. Write them down in your own timezone alongside KST.",
        pitfall:
          "A membership that is active but was purchased after the cut-off does not qualify on some tours. 'I have the membership' is not the same as 'I qualified'.",
        takes: "10 minutes",
      },
      {
        title: "Buy the membership well before the cut-off",
        body: "Buy from the official store for that artist. Keep the order confirmation and the membership number. If the membership is a physical kit with a digital code, allow for the code\u0027s delivery and activation time, which is not instant. Since 3 September 2026 Weverse Shop also offers Auto Payment on memberships that support it: the renewal is charged to a registered method on the last day of the validity period, so a membership cannot lapse unnoticed in the week a tour is announced. It is set per membership category — Global, Japan and USA are managed separately.",
        pitfall:
          "Resold or gifted membership codes frequently fail verification because the registered name will not match your ticketing account. Auto Payment removes the lapse risk but not the name risk: it renews whatever account it is attached to.",
        takes: "30 minutes",
      },
      {
        title: "Link and verify the membership on the ticketing platform",
        body: "This is the step people miss. On the ticketing platform there is a separate action to verify your fan club status, and it opens in a window — commonly a few days before the presale — and closes before it. Do it the hour it opens.",
        pitfall:
          "Verification on a Korean-language sale and on a global sale can be handled separately for the same show. Completing one does not necessarily grant the other.",
        takes: "20 minutes, inside the window",
      },
      {
        title: "Make the three names identical",
        body: "Passport, fan club membership and ticketing account. All three. Same legal name, same date of birth, same order. If one is wrong, correct it before the verification window rather than after.",
        pitfall:
          "This is the most frequent documented cause of a presale entitlement failing to apply, and it is invisible until the moment it matters.",
        takes: "15 minutes",
        see: {
          slug: "buy-k-pop-concert-tickets-from-overseas",
          text:
            "The account side of the same problem, with what each field expects.",
        },
      },
      {
        title: "Confirm the entitlement landed",
        body: "After verifying, look for an explicit confirmation — a badge, a status line, an email. If you cannot find positive confirmation that you are eligible, assume you are not and contact support while the window is still open.",
        pitfall:
          "Silence is not success. A submitted form is not a granted entitlement.",
        takes: "10 minutes",
      },
    ],
    faq: [
      {
        q: "Does buying a membership guarantee presale access?",
        a: "No. On most tours there is a separate verification step linking the membership to your ticketing account, with its own window that opens and closes before the presale. Membership is a prerequisite, not the entitlement itself.",
      },
      {
        q: "Can I use someone else's membership?",
        a: "In practice no, because verification matches the registered name and date of birth against your ticketing account and your identity document. Beyond not working, it risks the order being cancelled.",
      },
      {
        q: "How early does the presale open compared to the general sale?",
        a: "It varies by tour. A day or more ahead is common, and the membership cut-off sits earlier again. The official announcement for your show is the only reliable source.",
      },
    ],
    sources: [
      {
        label: "Weverse — official concerts and ticketing",
        url: "https://concerts.weverse.io/",
      },
      {
        label: "r/kpophelp — fans comparing presale qualification in practice",
        url: "https://www.reddit.com/r/kpophelp/",
      },
    ],
  },

  {
    slug: "foreign-card-declined-korean-ticketing",
    ko: "결제",
    art: "guide-card",
    name: "Card declined",
    koLine: "해외 카드 결제 거절 — 원인별 해결",
    title: "Why your card got declined on a Korean ticketing site",
    summary:
      "Three different systems can reject the same payment — the platform, your card network and your bank. Each has a different fix and only one of them is fast.",
    glyph: "card",
    status: "sourced",
    lastChecked: RESEARCH_DATE,
    scope:
      "Covers overseas-issued card payments on Korean ticketing platforms. Not financial advice, and it cannot cover your specific bank's rules.",
    readMinutes: 5,
    platforms: ["NOL World", "YES24 Global", "Weverse"],
    intro: [
      "A declined card at the payment step is the single most expensive failure in K-pop ticketing, because a held seat returns to the pool in minutes. Nearly all of it is preventable with lead time.",
      "The reason it feels random is that three independent systems can refuse the same transaction, and the error message you see rarely tells you which one did. Work through them in order of how long each takes to fix.",
    ],
    steps: [
      {
        title: "Check whether your account verification is actually complete",
        body: "On several platforms, overseas-issued cards only work once the account has been verified as an overseas customer. If that verification is still pending, the card will fail no matter how healthy it is. This is the slowest fix, which is why it is first.",
        pitfall:
          "The payment error will not say 'your verification is pending'. It will look like a card problem.",
        takes: "1-3 days",
        see: {
          slug: "nol-world-ticketing-guide",
          text:
            "Where that verification lives on NOL World, and how long it takes to process.",
        },
      },
      {
        title: "Tell your bank before the sale, not after",
        body: "Enable international and online transactions, and if your bank supports it, pre-authorise the amount range and the country. A first-ever charge from a Korean merchant at an unusual hour is exactly the profile a fraud system blocks.",
        pitfall:
          "Automated fraud blocks are often silent on your side — no SMS, no app alert. You only learn about it from the merchant's generic decline.",
        takes: "1 day",
      },
      {
        title: "Do not take the payment step inside an in-app browser",
        body: "3-D Secure and bank one-time-password flows frequently break inside the browser embedded in a social or messaging app. Use a standard mobile or desktop browser, and make sure you can receive your bank's verification message on the same device.",
        pitfall:
          "The redirect can appear to succeed and then silently drop the authorisation, which reads as a decline.",
        takes: "0 minutes, just do it right",
      },
      {
        title: "Have a genuinely different backup, not a sibling card",
        body: "A second card from the same issuer will usually fail for the same reason. A different issuer, a different network, or the platform's supported alternative method if it offers one, is a real backup. The two overseas platforms also refuse opposite things, which is worth knowing before you blame the card: NOL World accepts VISA, MasterCard, AMEX, JCB and UnionPay but only when issued outside Korea, and refuses Korean-issued cards outright. YES24 Global does the reverse on two of them, excluding American Express issued outside Korea and UnionPay entirely. A card refused on one can be the right card on the other.",
        pitfall:
          "Two cards from the same bank is one card for the purposes of a fraud rule.",
        takes: "30 minutes to set up",
      },
      {
        title: "Check the currency and amount before confirming",
        body: "Read whether you are charged in KRW or a converted amount, and know your card's foreign transaction fee. A conversion that pushes the total over a limit you set yourself can also cause a decline.",
        pitfall:
          "Dynamic currency conversion quietly adds cost. Paying in KRW is usually the cheaper option.",
        takes: "5 minutes",
      },
    ],
    faq: [
      {
        q: "Why was my card declined even though it has funds?",
        a: "Most often one of three things: your platform account has not finished overseas-customer verification, your bank's fraud system blocked an unfamiliar foreign merchant, or a 3-D Secure step failed — commonly because it ran inside an in-app browser. The decline message usually does not distinguish between them.",
      },
      {
        q: "Does PayPal work?",
        a: "Some overseas-facing platforms support alternative payment methods on some shows. It is set per platform and per event rather than universally, so check the payment options listed on your event page before you plan around it.",
      },
      {
        q: "Should I pay in KRW or my own currency?",
        a: "Paying in the merchant's currency is generally cheaper than letting the payment page convert for you, because dynamic currency conversion adds a margin. Your own card's foreign transaction fee still applies either way.",
      },
    ],
    sources: [
      {
        label: "YES24 Global — ticketing help and payment information",
        url: "https://ticket.yes24.com/",
      },
      {
        label: "NOL World — overseas ticketing",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },

  {
    slug: "buy-k-pop-albums-from-overseas",
    ko: "앨범",
    art: "album-stack",
    name: "Albums & goods",
    koLine: "해외 앨범 구매 — 차트 반영되는 곳",
    title: "How to buy K-pop albums from overseas so they count",
    summary:
      "Where you buy decides whether your purchase is counted, what you pay in shipping, and whether you get the pre-order inclusions. Here is how to choose.",
    glyph: "parcel",
    status: "sourced",
    lastChecked: RESEARCH_DATE,
    scope:
      "Covers buying official physical albums and goods for delivery outside Korea. Does not cover resale marketplaces or unofficial merchandise.",
    readMinutes: 6,
    platforms: ["Official artist stores", "Korean album retailers"],
    intro: [
      "This is the question that keeps running all year, unlike tickets — which is why it belongs next to them. And unlike tickets, it has a wrong answer that costs you nothing visible: your album arrives, it just was not counted.",
      "Three things vary by where you buy: whether the sale is reported to the Korean charts, whether the pre-order inclusions come with it, and the real landed cost once shipping and customs are in. They do not move together, so the cheapest option is frequently the one that counts for nothing.",
    ],
    steps: [
      {
        title: "Decide what you actually want from the purchase",
        body: "Chart contribution, the physical album, the pre-order inclusions, or the lowest price. These pull in different directions. Pick the priority before you pick the shop, because the shop is downstream of it.",
        pitfall:
          "Buying on a general marketplace to save money and then discovering it did not count is the standard version of this mistake.",
        takes: "5 minutes",
      },
      {
        title: "Check whether the seller reports to the Korean charts",
        body: "Sales reported to the Korean album charts come from specific retailers and official stores. A listing being an official album does not mean the sale was reported. If chart contribution is why you are buying, verify the retailer is a reporting one before you order.",
        pitfall:
          "Third-party marketplace listings of genuine albums commonly do not count. The album is real; the contribution is not there.",
        takes: "15 minutes",
      },
      {
        title: "Order inside the pre-order window for the inclusions",
        body: "Pre-order benefits — posters, extra photocards, event entries — are tied to ordering within a window, and often to that specific retailer. The window closes before release day, not on it.",
        pitfall:
          "Retailer-exclusive inclusions are not interchangeable. Ordering the same album elsewhere gets you a different set or none.",
        takes: "10 minutes",
      },
      {
        title: "Price the shipping and the customs exposure, not the album",
        body: "Shipping from Korea can exceed the album price, and your own country's duty-free threshold decides whether you pay import charges on top. Group orders reduce per-item shipping. Work out the landed cost before you commit, and know your threshold.",
        pitfall:
          "Combining several albums into one parcel can push the declared value over your threshold and cost more than shipping them separately. Run both numbers.",
        takes: "20 minutes",
      },
      {
        title: "Keep the order record until it arrives",
        body: "Save the confirmation, the tracking number and the declared value. For anything that goes wrong — a damaged parcel, a customs query, a missing inclusion — these are what the retailer will ask you for.",
        pitfall:
          "Korean retailers' support often works on order numbers rather than email lookups. Without the number the conversation is slow.",
        takes: "5 minutes",
      },
    ],
    faq: [
      {
        q: "Do albums bought outside Korea count toward the Korean charts?",
        a: "Sales reported by participating retailers count, and that depends on the retailer rather than on your location. Buying a genuine album from a shop that does not report means the album is real but the sale is not counted. Check the retailer before ordering if chart contribution is the point.",
      },
      {
        q: "Is a group order worth it?",
        a: "Usually yes for shipping, because the per-item cost drops sharply. Weigh it against your country's duty-free threshold — a single high-value parcel can attract import charges that separate smaller ones would not.",
      },
      {
        q: "Why are pre-order benefits different between shops?",
        a: "Retailers negotiate their own exclusive inclusions, so the same album carries different extras depending on where it was pre-ordered. If a specific inclusion is what you want, you have to order from the shop offering it, within its window.",
      },
    ],
    sources: [
      {
        label: "Ktown4u — official K-pop album and goods retailer",
        url: "https://www.ktown4u.com/",
      },
      {
        label: "Weverse Shop — official artist store",
        url: "https://shop.weverse.io/",
      },
    ],
  },

  {
    slug: "order-from-weverse-shop-overseas",
    ko: "위버스샵",
    art: "pc-foil",
    name: "Weverse Shop",
    koLine: "해외에서 위버스샵 주문 — 통화·세금·배송",
    title: "Ordering from Weverse Shop outside Korea",
    summary:
      "Which store you are in, why the price changes at checkout, which payment methods your currency actually gets, and the countries Korea cannot ship to.",
    glyph: "parcel",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers Weverse Shop ordering for physical merchandise and albums shipped from Korea. Membership purchases and ticketing are handled separately and are covered in the presale guide. Rules here come from Weverse Shop's own notices and change without much warning.",
    readMinutes: 7,
    platforms: ["Weverse Shop"],
    intro: [
      "Almost every English guide to Weverse Shop still says the global store takes PayPal or Eximbay and nothing else. That was true years ago. The payment list is longer now, it is set by the currency your account is in rather than by the country you live in, and since February 2026 the price on a product page is not the price you pay.",
      "None of that is hidden — it is in the shop's own notices, which is where everything below comes from. It is just that nobody writing these guides went and read them.",
    ],
    steps: [
      {
        title: "Work out which Weverse Shop you are actually in",
        body: "Weverse Shop is not one store. There is a GLOBAL shop and there are region shops, and they carry different stock, run different pre-order windows and ship from different places. An item you saw someone else order may simply not exist in your store. Check which one you are in before you plan around a release date, because a pre-order cut-off in one store tells you nothing about the others.",
        pitfall:
          "A link someone shares in a fan community opens their store, not yours. If the page loads but the item will not add to a cart, you are usually in the wrong shop rather than too late.",
        takes: "2 minutes",
      },
      {
        title: "Set your currency before you look at anything",
        body: "Your default currency decides which payment methods you are offered. Weverse states these per currency: USD gets PayPal, Eximbay, Alipay+, Apple Pay, WeChat Pay and Grab Pay. JPY gets the same list without Grab Pay. CNY drops PayPal. MXN is only PayPal and Apple Pay. KRW adds Korean cards and the Korean wallets — Toss, NAVER Pay, Kakao Pay, PAYCO.",
        pitfall:
          "There is no plain \u0022pay with Visa\u0022 on the non-KRW currencies. Your card goes through PayPal or Eximbay, which is a different transaction to your bank than a Korean merchant charge — and the reason a card that works elsewhere can still fail here.",
        takes: "3 minutes",
        see: {
          slug: "foreign-card-declined-korean-ticketing",
          text: "If the payment fails anyway, the three systems that can refuse it",
        },
      },
      {
        title: "Expect the price to go up at checkout, and know why",
        body: "Since 3 February 2026, Weverse calculates tax from your shipping and billing address. Orders going to Korea show tax-inclusive prices the whole way through. Orders going anywhere else show the product page price without tax, and the destination\u0027s tax is added at checkout once you enter an address. The number on the product page is not the number you pay, and that is deliberate rather than a fault.",
        pitfall:
          "This looks exactly like a scam or a bug, and it is the point where people abandon the order. The increase is the tax your own country charges, collected up front instead of by customs later.",
        takes: "1 minute",
      },
      {
        title: "Fill in the billing address, not just the shipping one",
        body: "The same February 2026 change added a billing address field at checkout, because the tax calculation needs it. For some intangible products — digital items and content — the billing address may be required rather than optional. Enter it accurately: it is what the tax rate is computed from, and a wrong one is not something you can quietly correct later.",
        pitfall:
          "Copying the shipping address into the billing field without thinking is fine when they match and wrong when they do not. If your card is registered to a different address, use that one.",
        takes: "2 minutes",
      },
      {
        title: "Check your address language against the destination",
        body: "Weverse asks international customers to verify what language the destination country needs the address in before entering it. The rule is clearer in the other direction: an order shipping to South Korea has to carry the address in Korean, because couriers may not accept or may misprocess an English one. For everywhere else, write the address the way your own national postal service expects it.",
        pitfall:
          "Transliterating a Korean address into English is the single most common cause of a delayed or failed delivery on orders going to Korea.",
        takes: "5 minutes",
      },
      {
        title: "Confirm Korea can ship to you at all",
        body: "Shipping from South Korea is unavailable to a list of countries and regions that Weverse maintains and updates. As of the 15 July 2026 revision it covers Myanmar, the Democratic Republic of the Congo, Iraq, Iran, Lebanon, Mali, Russia, Andorra, Ukraine, Belarus, Afghanistan, the Netherlands Antilles, Israel and Turkey. The list moves, so check the notice rather than this page.",
        pitfall:
          "The list is described as temporary disruption rather than policy, which means a country can come off it as well as go on. Neither a previous successful order nor a friend\u0027s order last year settles whether you can order today.",
        takes: "2 minutes",
      },
      {
        title: "Order inside the pre-order window if the inclusions matter",
        body: "Pre-order benefits — the posters, photocards and first-press inclusions that are usually the reason for ordering from the official store rather than anywhere cheaper — are tied to the pre-order window, not to the album. Once the window closes, the same album ships without them. If the inclusions are the point, the deadline is the thing to plan around, not the release date.",
        pitfall:
          "Pre-order windows close at a Korean time of day, which is the previous evening or the small hours where most of this site\u0027s readers live.",
        takes: "Before the cut-off",
        see: {
          slug: "buy-k-pop-albums-from-overseas",
          text: "Whether the purchase counts toward the Korean charts",
        },
      },
    ],
    faq: [
      {
        q: "Can I pay with a Visa or Mastercard on Weverse Shop?",
        a: "Not as a direct card option outside the Korean currency setting. On USD, JPY, CNY and MXN the card goes through PayPal or Eximbay instead. That still reaches your card, but your bank sees a different kind of transaction, so enabling international payments in advance is worth doing.",
      },
      {
        q: "Why did the price go up when I entered my address?",
        a: "Since 3 February 2026, prices outside Korea are shown on the product page without tax, and the tax for your destination is added at checkout. It is the tax your own country charges, collected at purchase rather than on delivery.",
      },
      {
        q: "Will I be charged customs when it arrives?",
        a: "Weverse now prepays duties and taxes at checkout for applicable orders, which it says reduces the need for additional payment during clearance. It states this does not apply to every country or region, so it is a reasonable expectation rather than a guarantee.",
      },
      {
        q: "Does Weverse Shop ship to my country?",
        a: "Usually, but a maintained list of countries and regions cannot currently receive shipping from South Korea. Check that notice for the current list before ordering — it is revised as conditions change.",
      },
    ],
    sources: [
      {
        label:
          "Weverse Shop — Payment and Customs Service Update, effective 3 Feb 2026",
        url: "https://shop.weverse.io/en/notices/12149",
      },
      {
        label:
          "Weverse Shop — countries shipping from Korea is unavailable to, updated 15 Jul 2026",
        url: "https://shop.weverse.io/en/notices/216",
      },
      {
        label:
          "Weverse Global — pre-order notice listing payment methods by currency",
        url: "https://shop.weverse.io/en/shop/USD/artists/75/notices/14466",
      },
    ],
  },

  {
    slug: "yes24-global-ticketing-guide",
    ko: "예스24 글로벌",
    art: "lightstick",
    name: "YES24 Global",
    koLine: "예스24 영문 예매 — 계정·결제·수령",
    title: "YES24 Global ticketing: the rules that are not on the English page",
    summary:
      "Your existing YES24 account will not work. PayPal only appears if the show is far enough away. Two card types are refused outright, and the venue checks your passport against the name you signed up with.",
    glyph: "ticket",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers the English-language YES24 TICKET site used by overseas buyers. The Korean-language YES24 site runs a different account system and a different identity check. Per-show conditions on an event page override everything here, and YES24 says so itself.",
    readMinutes: 8,
    platforms: ["YES24 Global"],
    intro: [
      "YES24 publishes its overseas rules in an English purchase guide and FAQ, and almost none of what is in them appears in the guides that rank for this. They are specific, they are unusual, and several of them will end your booking on the day if you meet them for the first time at checkout.",
      "Everything below is from those two pages, read on 20 October 2026. Where YES24 contradicts itself — and it does, once, on a fee — this page says so rather than picking the convenient number.",
    ],
    steps: [
      {
        title: "Sign up again, even if you already have a YES24 account",
        body: "YES24 states it plainly: existing YES24 members who want to use the Global YES24 TICKET site must sign up again. It also warns that the Global ticket site is a different thing from global.yes24.com, the bookstore, and that the two do not share member information. Non-members cannot book at all, so this is the first step and not a formality.",
        pitfall:
          "Three YES24 properties with similar names and no shared login. Discovering this in a queue is discovering it too late — the account has to exist days earlier anyway, because of the name check below.",
        takes: "15 minutes",
      },
      {
        title: "Register the name exactly as your passport has it",
        body: "This is the one place a platform says the quiet part out loud. YES24\u0027s FAQ: if your YES24 account name is different from your passport name, you can have trouble taking the booked ticket at the venue. Will-call tickets can only be collected by the ticket holder, and collection needs a physical valid ID — a passport — alongside the booking record.",
        pitfall:
          "A middle name dropped, a romanisation chosen years ago, a given-name-first order. The venue is comparing two documents, not judging whether it is obviously you.",
        takes: "10 minutes",
        see: {
          slug: "fan-club-presale-checklist",
          text: "The three names that have to match, and where each is set",
        },
      },
      {
        title: "Check whether PayPal is even offered for your show",
        body: "PayPal on YES24 Global is only available when there are more than 180 days between the booking date and the show date. For most K-pop concerts, announced a month or two ahead, that means PayPal is simply not an option and the card is the only route. There is also a 10-cent PayPal fee which is not refunded even if you cancel.",
        pitfall:
          "Planning around PayPal because a guide said it was accepted, then finding only a card field at checkout. The 180-day rule is why — not an error, and not something support can waive.",
        takes: "2 minutes",
      },
      {
        title: "Know which cards are refused before you try one",
        body: "The purchase guide excludes American Express cards issued outside Korea, and China UnionPay cards entirely. Everything else goes through as a card payment — and YES24 states that 3-D Secure authentication is required on the Global site, so the card has to be enrolled with your bank for it.",
        pitfall:
          "An Amex that works on every other site is refused here for where it was issued, not for anything about the card. That failure looks identical to a bank block, so people spend the sale ringing their bank about the wrong problem.",
        takes: "10 minutes, with your bank",
        see: {
          slug: "foreign-card-declined-korean-ticketing",
          text: "When the refusal is your bank rather than the platform",
        },
      },
      {
        title: "Choose will-call or overseas delivery at the time of booking",
        body: "Both exist, but overseas delivery is per-show rather than universal: YES24 says availability varies by performance and the fee varies by destination, and that the event page is where it is stated. Changing the delivery method afterwards is only possible until 20 business days before the show — four working weeks, not four days.",
        pitfall:
          "Twenty business days is roughly a month of calendar. Booking two weeks out means the method you picked in the queue is the method you are keeping.",
        takes: "5 minutes",
      },
      {
        title: "Read the booking and cancellation clock, which is not the show date",
        body: "Booking closes at 5pm the day before a Tuesday-to-Saturday show, and at 11am on Saturday for a Sunday or Monday show. Cancellation runs on exactly the same clock, and after it passes there is no cancellation, change or refund. Cancellation is free within 7 days of purchase; after that it is a per-ticket fee rising to 10%, 20% and 30% of the paid amount as the show approaches. The limit is 10 tickets per person at a time.",
        pitfall:
          "The booking fee is where YES24 contradicts itself: the FAQ says 2,000 KRW in one line and then announces the change to 3,000 KRW per ticket from 14 August 2023 in the next. Treat 3,000 as current. Either way it is refundable only until 23:59 on the day you bought, not within the 7-day window that covers the ticket itself.",
        takes: "5 minutes",
      },
      {
        title: "Bring the passport and the booking record to the venue",
        body: "Collection requires a physical valid ID — YES24 names the passport — together with the record of booking confirmation. The purchase guide also tells you to print the purchase details and hand them in at the box office. Per-show policy on the event page overrides this, and YES24 says the event page wins, so read it even if you have collected at that venue before.",
        pitfall:
          "A photo of the confirmation on a phone is not what is described. Print it, and carry the passport you registered with rather than any other ID.",
        takes: "At the venue",
      },
    ],
    faq: [
      {
        q: "Can I use my existing YES24 account on the English site?",
        a: "No. YES24 says existing members must sign up again for the Global YES24 TICKET site, and that it is separate from global.yes24.com with no shared member information.",
      },
      {
        q: "Why is PayPal missing at checkout?",
        a: "PayPal is only offered when there are more than 180 days between the booking date and the show date. Most concert bookings fall well inside that, so the card is the only route.",
      },
      {
        q: "Which cards does YES24 Global refuse?",
        a: "American Express cards issued outside South Korea, and China UnionPay cards. Other cards are accepted but must pass 3-D Secure, which the site requires.",
      },
      {
        q: "Can someone else collect my ticket?",
        a: "No. Will-call tickets can only be collected by the ticket holder, with a physical passport and the booking record — unless the individual show says otherwise on its own page.",
      },
      {
        q: "How long does a refund take?",
        a: "Card refunds are stated at 3 to 7 days, with the card company\u0027s own policy deciding, and up to 30 days. PayPal refunds go back to the PayPal balance within 5 business days — at the exchange rate on the refund date including the conversion spread, so the amount returned may be less than the amount paid.",
      },
    ],
    sources: [
      {
        label: "YES24 TICKET — English purchase guide, steps 1 to 5",
        url: "https://ticket.yes24.com/English/Guide",
      },
      {
        label:
          "YES24 TICKET — English FAQ: booking, payment, cancellation, collection",
        url: "https://ticket.yes24.com/English/FAQ",
      },
      {
        label: "YES24 TICKET — English site entry point",
        url: "https://ticket.yes24.com/English",
      },
    ],
  },

  {
    slug: "kpop-ticketing-day-timezone",
    ko: "티켓팅",
    art: "guide-tickets",
    name: "Ticketing day",
    koLine: "티켓팅 당일 — 시차와 서머타임 계산",
    title: "What time a Korean ticket sale opens where you are",
    summary:
      "Korea has no daylight saving and your country probably does, so the hour a Korean sale lands on your clock moves two to four times a year. Here is how to get it right for the date rather than for today.",
    glyph: "star",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers converting an announced Korean sale time to your own, and the clock the platforms run on afterwards. It does not cover how to win a queue, which is mostly allocation and luck. The official announcement for your show is the only authority on the time itself.",
    readMinutes: 6,
    platforms: ["NOL World", "YES24 Global", "Weverse", "Melon Ticket"],
    intro: [
      "Every guide that converts a Korean sale time gives you one number. \u00228pm KST is 6am Eastern.\u0022 That number is correct for about four months of the year and wrong for the rest, because Korea does not observe daylight saving time and most of the countries reading this do.",
      "The times below were computed from the IANA time zone database, release 2026c — the same data your operating system uses. The point is not to memorise them. It is to convert for the date of the sale, which is rarely the same answer as converting for today.",
    ],
    steps: [
      {
        title: "Take the announced time as KST, and do not adjust it",
        body: "Korean sales are announced in Korean time, and Korean time does not move: KST is UTC+9 all year, with no summer adjustment. A general sale is commonly announced for 20:00 KST on a weekday, but that is a convention rather than a rule — 19:00 and 14:00 both appear, and fan club verification windows often open earlier the same day on their own schedule. The announcement for your show is the only authority.",
        pitfall:
          "Reading a time from a previous tour and assuming this one matches. The platform is the same, the hour often is not.",
        takes: "2 minutes",
        see: {
          slug: "buy-k-pop-concert-tickets-from-overseas",
          text: "Finding the official announcement rather than a fan repost",
        },
      },
      {
        title: "Convert for the date of the sale, not for today",
        body: "This is the whole guide in one line. Because Korea never shifts and you do, the local hour of a Korean sale depends on which side of your own daylight saving change the date falls on. At 20:00 KST, a sale lands at 06:00 in New York in January and 07:00 in July. Los Angeles moves 03:00 to 04:00, Toronto 06:00 to 07:00, London 11:00 to 12:00.",
        pitfall:
          "Converting in a search box today for a sale three weeks away. If a clock change falls in between, the answer you get is an hour wrong — and it is wrong in the direction of being late.",
        takes: "3 minutes",
      },
      {
        title: "If you are in Australia, the gap moves the other way",
        body: "Southern hemisphere daylight saving runs opposite to northern. At 20:00 KST a sale is 22:00 in Sydney in January and 21:00 in July — the gap narrows in the northern summer rather than widening. Across a full year the Sydney offset swings an hour in the opposite direction to every North American and European figure above, so a conversion borrowed from a US fan is wrong by two hours.",
        pitfall:
          "Most guides for this are written for American readers. Australian and New Zealand fans inherit their arithmetic and arrive an hour or two late.",
        takes: "2 minutes",
      },
      {
        title: "Check whether a clock change falls between now and the sale",
        body: "The changeover dates are not the same in each country, which creates short windows where the usual conversion is wrong even between two countries that both observe it. In 2027 New York changes on 14 March, London on 28 March, Sydney on 4 April. Mexico City and Manila do not change at all. If the sale date sits on the far side of your own changeover, set your alarm from the converted time for that date.",
        pitfall:
          "The two-week gap between the North American and European changes in March is the one that catches people, because the familiar New York to London difference is briefly not what it normally is.",
        takes: "3 minutes",
      },
      {
        title: "Note the date as well as the hour",
        body: "For most of the Americas a Korean evening sale lands on the same calendar date, early in the morning. For Sydney it is the same evening. The hour is the part people convert and the date is the part they assume, and an alarm set for the right hour on the wrong day is the same as no alarm.",
        pitfall:
          "A sale announced for a Tuesday evening in Seoul is a Tuesday morning in New York. Writing \u0022Tuesday\u0022 in a calendar without the converted time is how people arrive a day out.",
        takes: "1 minute",
      },
      {
        title: "Be signed in and verified before the window, not inside it",
        body: "Everything that can be done in advance should already be done when the hour arrives: account created, overseas verification processed, fan club membership linked, payment method enabled for international use and for 3-D Secure. Queue systems commonly give a short window to choose seats and pay before releasing the hold, and none of that time is spare.",
        pitfall:
          "Opening a fresh private window to be safe means logging in and re-verifying inside the queue, which costs more than it protects.",
        takes: "30 minutes before open",
        see: {
          slug: "foreign-card-declined-korean-ticketing",
          text: "What to have ready so the payment step does not fail",
        },
      },
      {
        title: "Know the closing clock too, which is a different one",
        body: "Opening time is not the only deadline that runs on Korean time. On YES24 Global, booking closes at 5pm the day before a Tuesday-to-Saturday show and at 11am on Saturday for a Sunday or Monday show, and cancellation runs on exactly the same clock. Those are KST too, and the same conversion applies — in the other direction, when it matters most.",
        pitfall:
          "Planning a cancellation from the show date rather than the platform\u0027s deadline. After it passes there is no cancellation, change or refund.",
        takes: "5 minutes",
        see: {
          slug: "yes24-global-ticketing-guide",
          text: "YES24\u0027s booking and cancellation clock in full",
        },
      },
    ],
    faq: [
      {
        q: "Does Korea use daylight saving time?",
        a: "No. KST is UTC+9 for the whole year. Korea ran summer time in 1987 and 1988, around the Seoul Olympics, and has not since — the time zone database shows no offset change in the four decades after. Every shift in the gap between Korea and your country therefore comes from your side.",
      },
      {
        q: "What time do Korean ticket sales usually open?",
        a: "A general sale is commonly announced for 20:00 KST on a weekday, often one to three months before the show. It is a convention, not a rule — other hours appear regularly, and fan club presales and verification windows run on their own earlier schedule. Read the announcement.",
      },
      {
        q: "Why does my conversion keep changing by an hour?",
        a: "Because your country changes its clocks and Korea does not. Convert for the date of the sale rather than for today, and check whether your own changeover falls in between.",
      },
      {
        q: "I am in Australia — can I use a US fan's conversion?",
        a: "No. Southern hemisphere daylight saving runs the opposite way, so the Sydney gap narrows when the New York gap widens. Borrowing a northern conversion puts you up to two hours out.",
      },
    ],
    sources: [
      {
        label:
          "IANA time zone database, release 2026c — the conversions and changeover dates above are computed from it, not quoted from anywhere",
        url: "https://www.iana.org/time-zones",
      },
      {
        label: "YES24 TICKET — English FAQ, booking and cancellation deadlines",
        url: "https://ticket.yes24.com/English/FAQ",
      },
      {
        label: "NOL World — the overseas-facing ticketing site and its announcements",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },

  {
    slug: "weverse-membership-renewal-overseas",
    ko: "멤버십",
    art: "guide-presale",
    name: "Membership renewal",
    koLine: "위버스 멤버십 갱신 — 통화·자동결제·공백",
    title: "Weverse membership renewal from overseas",
    summary:
      "Auto Payment runs on the last day of your term at the hour you first paid, in a currency that has to match, and if it fails past the renewal window there is no way back except buying again.",
    glyph: "id",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers keeping an existing Weverse Official Membership running, and what a lapse costs. Joining a fan club for the first time, and qualifying for a specific presale, are separate questions covered in the presale guide. Everything here is from Weverse Shop\u0027s notice of 3 September 2026 and the product pages it points to.",
    readMinutes: 6,
    platforms: ["Weverse", "Weverse Shop"],
    intro: [
      "A membership that lapses in the wrong week does not cost you a subscription. It costs you the presale, because eligibility is checked against a membership that was active before a cut-off, and no amount of buying it again afterwards moves that date.",
      "Weverse added Auto Payment on 3 September 2026, which removes the ordinary way of lapsing. It also introduced four rules that are easy to get wrong, and one point of no return.",
    ],
    steps: [
      {
        title: "Find out which membership category you are in",
        body: "Weverse runs memberships in three categories — Global, Japan and USA — and they are managed separately. Payment methods, currencies and Auto Payment settings are all per category, and up to five payment methods can be stored for each with one marked primary. Which category you are in is not something you pick casually; it is where your membership already lives.",
        pitfall:
          "Setting up Auto Payment on the category you are not using. The screen looks identical, the membership that renews is the other one.",
        takes: "5 minutes",
      },
      {
        title: "Check your currency is one the category actually accepts",
        body: "As of 3 September 2026: a Global Membership takes South Korean debit or credit cards for KRW, and PayPal-registered cards for JPY, USD or MXN. A Japan Membership takes credit cards for JPY. A US Membership takes PayPal-registered cards for USD. For an overseas fan on a Global Membership paying in USD, that means the card goes through PayPal — there is no direct card option.",
        pitfall:
          "Expecting to register a Visa directly on a USD Global Membership. The same pattern runs through Weverse Shop, and it is why a card that works everywhere else can still fail here.",
        takes: "10 minutes",
        see: {
          slug: "order-from-weverse-shop-overseas",
          text: "Why the payment list depends on your currency rather than your country",
        },
      },
      {
        title: "Match the purchase currency to the primary method",
        body: "Weverse states it directly: the payment currency used to buy the Membership must match the payment currency of your primary Auto Payment method. A mismatch is not resolved at renewal time in your favour — it is a renewal that does not go through.",
        pitfall:
          "Buying a membership in one currency and later adding a primary method in another, which looks fine on both screens and only fails on the day it matters.",
        takes: "3 minutes",
      },
      {
        title: "Know the exact moment it renews",
        body: "Auto Payment runs on the last day of the current membership\u0027s validity period, at the same time of day you first paid for it. That hour was set on a Korean server, so for most readers it falls somewhere in the night or early morning. If it fails, Weverse sends an email and a push notification and retries once a day at the same time, for as long as the renewal period lasts.",
        pitfall:
          "A card that expires mid-term, or a bank that blocks the charge, turns into a notification arriving at four in the morning your time. The retry is daily, not hourly — a day of not seeing the email is a day of the window spent.",
        takes: "2 minutes",
        see: {
          slug: "kpop-ticketing-day-timezone",
          text: "Converting a Korean hour to yours, for the date it actually falls on",
        },
      },
      {
        title: "Understand what cancelling Auto Payment does not do",
        body: "Cancelling Auto Payment stops future renewals. It does not cancel or refund the membership you are already holding, and you keep using it normally until the validity period ends. Cancellation and refund of the membership itself is a separate matter governed by the product page for that membership.",
        pitfall:
          "Cancelling Auto Payment expecting money back, and separately: cancelling it to \u0022pause\u0022 while a tour is rumoured, which is the week you least want the renewal to stop.",
        takes: "2 minutes",
      },
      {
        title: "Treat the end of the renewal period as a point of no return",
        body: "If you cancelled Auto Payment you can reactivate it — but only while the renewal period is still running. Once that period has ended, reactivation is not available and the only route is to purchase the membership again. Weverse also gives two manual controls inside the window: Pay Now to renew immediately, and Retry Now if a payment failed on a method you have since fixed.",
        pitfall:
          "Waiting to see whether the retries succeed. Retry Now and Pay Now exist precisely so you do not have to, and both disappear when the window closes.",
        takes: "5 minutes",
      },
      {
        title: "Renew rather than rebuy, because the record carries over",
        body: "When a membership renews through Auto Payment, the member information registered on the existing membership is retained on the next one. That record — the name on it in particular — is what a presale eligibility check is run against. Buying a fresh membership after a lapse starts a new record and a new start date, which is the part that costs a presale rather than a subscription fee.",
        pitfall:
          "Assuming continuity is about loyalty. It is about a date and a name on a record, and a gap in either is what the check sees.",
        takes: "2 minutes",
        see: {
          slug: "fan-club-presale-checklist",
          text: "What the eligibility check actually compares, and when",
        },
      },
    ],
    faq: [
      {
        q: "Can I pay for a Global Membership with my own Visa or Mastercard?",
        a: "Not directly, outside KRW. A Global Membership takes Korean cards for KRW, and PayPal-registered cards for JPY, USD or MXN — so your card reaches Weverse through PayPal rather than as a direct card payment.",
      },
      {
        q: "When exactly does Auto Payment charge me?",
        a: "On the last day of your current membership\u0027s validity period, at the same time of day you first paid. That time was set on a Korean clock, so convert it for your own.",
      },
      {
        q: "If Auto Payment fails, how many chances do I get?",
        a: "Weverse notifies you by email and push, then retries once a day at the same time for the remainder of the renewal period. You can also use Retry Now after fixing the payment method, or Pay Now to renew immediately.",
      },
      {
        q: "I cancelled Auto Payment. Can I turn it back on?",
        a: "Yes, while the renewal period is still open — there is a Reactivate control for exactly that. After the renewal period ends you cannot, and the only option is to buy the membership again.",
      },
      {
        q: "Does it matter if my membership lapses for a few days?",
        a: "It can matter more than the price. Renewal retains the member information from the existing membership; a repurchase starts a new record with a new date. Presale eligibility is checked against that record and its cut-off, not against how long you have been a fan.",
      },
    ],
    sources: [
      {
        label:
          "Weverse Shop — Auto Payment for Official Membership, effective 3 September 2026",
        url: "https://shop.weverse.io/en/notices/14202",
      },
      {
        label: "Weverse Shop — the store where memberships are bought and managed",
        url: "https://shop.weverse.io/",
      },
      {
        label: "Weverse — the community side, where a membership is used",
        url: "https://weverse.io/",
      },
    ],
  },

  {
    slug: "nol-world-queue-and-seat-selection",
    ko: "대기열",
    art: "guide-nol",
    name: "The queue",
    koLine: "NOL World 대기열 — 새로고침이 순번을 지웁니다",
    title: "The NOL World queue, and what resets your place in it",
    summary:
      "Refreshing clears your position. A second device closes your first number. Seats update without reloading. All of it is in NOL World\u0027s own FAQ, and all of it contradicts what people do instinctively.",
    glyph: "ticket",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers how the NOL World queue, seat map and waitlist behave during a sale. Registration and overseas verification happen before any of this and are covered in the NOL World guide. Everything here is from NOL World\u0027s published FAQ.",
    readMinutes: 7,
    platforms: ["NOL World"],
    intro: [
      "The instinct in a ticket queue is to refresh, and to open a second browser in case the first one is stuck. On NOL World both of those cost you the thing you are trying to protect, and the platform says so in its own help pages.",
      "This is the part of a sale that no guide covers, because it cannot be worked out from the outside — you only see it once, for ninety seconds, while panicking.",
    ],
    steps: [
      {
        title: "Do not refresh. Refreshing resets your position",
        body: "NOL World states it plainly: you cannot skip the queue, and if you refresh the page your position in the queue will be reset. Not re-checked, not re-queried — reset. Whatever number you were holding goes back to the end.",
        pitfall:
          "A queue page that looks frozen is usually just a queue page. The one action that feels like doing something is the one action that undoes the waiting you have already done.",
        takes: "The whole queue",
      },
      {
        title: "One account gets one queue number, and a second attempt kills the first",
        body: "You can only receive one queue number per account. If you try for more — a second browser, a phone alongside a laptop — NOL World closes the first number you received. Pressing Reserve from another device while already queued prompts you to keep the existing queue or start a new one, and choosing a new one means waiting again from the beginning on that device.",
        pitfall:
          "Opening a backup device is the single most common ticketing tactic in fan communities and it is strictly worse than doing nothing here. The prompt that appears is not offering you a second chance; it is asking which one you want to throw away.",
        takes: "0 minutes, if you resist",
      },
      {
        title: "A queue number is not a ticket",
        body: "NOL World says a position in the queue does not guarantee a ticket, because availability is limited and tickets are issued in order. The queue decides when you get to try, not whether anything is left when you arrive. The queue applies to every product bookable on NOL World, not only the high-demand ones.",
        pitfall:
          "Reading a low queue number as a result. It is a turn, and the stock may be gone before your turn comes.",
        takes: "1 minute",
      },
      {
        title: "Stop refreshing the seat map too — it updates by itself",
        body: "The booking system was reorganised so that available seats update in real time without reloading. Seats held by other users disappear and cancelled seats come back on their own. If you see \u0022this seat has already been selected\u0022, it means another user chose the same seat at nearly the same moment — not that your page is stale.",
        pitfall:
          "Refreshing the seat map carries the same cost as refreshing the queue. The habit from older ticketing sites is the exact wrong habit here.",
        takes: "During selection",
      },
      {
        title: "Read the sold-out rate for what it measures",
        body: "Where a sold-out rate is shown, it appears only once 90% or more of all seats have been paid for, and it counts paid tickets rather than selectable ones. Remaining-seat counts may not be shown at all: NOL World says the organiser decides, and that for high-demand products there is a lag between what is displayed and what is actually available.",
        pitfall:
          "Treating a sold-out percentage as live inventory. It is a paid-ticket figure with a 90% floor, and the gap between it and reality is widest exactly when you care most.",
        takes: "1 minute",
      },
      {
        title: "If you get a waitlist notification, you have six hours",
        body: "If a booking waitlist seat becomes available and payment is not completed within six hours of the notification, the booking is automatically cancelled and refunded, and the opportunity passes to the next person on the list. Six hours is generous until you remember the notification arrives on Korean business hours and most readers of this will be asleep for part of it.",
        pitfall:
          "A six-hour window that opens at 3am your time is a two-hour window. Convert the notification time the same way you converted the sale time.",
        takes: "Within 6 hours",
        see: {
          slug: "kpop-ticketing-day-timezone",
          text: "Converting a Korean hour to yours, for the date it falls on",
        },
      },
      {
        title: "Know you cannot change the seat afterwards",
        body: "Once the reservation is complete, seat changes are not possible — the only route is to cancel and rebook, which exposes you to the event\u0027s cancellation fee and to the seat being taken in between. The same applies to coupons: a coupon cannot be applied after payment, and using one means cancelling and rebooking the same seat with the fee that implies.",
        pitfall:
          "Booking a seat you are unsure about intending to fix it later. There is no later.",
        takes: "Before you confirm",
      },
    ],
    faq: [
      {
        q: "Does refreshing help me get through the NOL World queue faster?",
        a: "The opposite. NOL World states that refreshing the page resets your position in the queue, and that the queue cannot be skipped.",
      },
      {
        q: "Can I queue on my phone and my laptop at the same time?",
        a: "No. One account receives one queue number, and attempting to get more closes the first one. If you press Reserve on a second device you are asked to keep the existing queue or start over on the new one.",
      },
      {
        q: "Do I need to refresh the seat map to see new seats?",
        a: "No. Seats update in real time — held seats disappear and cancelled seats return without a reload. Refreshing costs you the same as refreshing the queue.",
      },
      {
        q: "What does the sold-out rate actually mean?",
        a: "It appears only when 90% or more of seats have been paid for, and it counts paid tickets rather than seats you could select. For high-demand shows there is a known lag between the figure and real availability.",
      },
      {
        q: "How long do I have after a waitlist notification?",
        a: "Six hours. If payment is not completed in that time the booking is automatically cancelled and refunded and the seat passes to the next person on the waitlist.",
      },
    ],
    sources: [
      {
        label: "NOL World — FAQ: booking and payment, including queue behaviour",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },

  {
    slug: "nol-facepass-face-registration",
    ko: "얼굴인식",
    art: "lightstick",
    name: "Face registration",
    koLine: "NOL facepass — 얼굴 등록과 입장",
    title: "NOL facepass: who holds your face, and what it is for",
    summary:
      "Register once and a camera lets you in without a ticket check. The face is kept by Toss rather than by NOL World, it cannot be changed afterwards, and cancelling the service deletes the photo but keeps a separate copy for a year.",
    glyph: "id",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers what NOL World publishes about NOL facepass, including its stated retention period after cancellation: what it does, who stores the facial data, and what registering commits you to. Support is per show, and the event page decides. Nothing here is a legal opinion about biometric data in your own country.",
    readMinutes: 6,
    platforms: ["NOL World"],
    intro: [
      "Korean venues are moving to facial recognition at the door, and an overseas fan meets it as a checkbox during booking with very little explanation in English. The question underneath it is not small: a company you have never dealt with is about to hold your face.",
      "NOL World does publish answers. They are specific, they are more reassuring than most companies manage, and they are worth reading before the queue rather than during it — including the one about what happens to the data after you cancel, which does not say what a single word like deleted would suggest.",
    ],
    steps: [
      {
        title: "Understand what it replaces",
        body: "NOL World describes facepass as a way to cut the procedure and time that identity verification takes at entry. Once face registration is complete, a camera scans you at the door and you enter without ticket verification. It is a replacement for the document check at the gate, not an extra layer on top of it.",
        pitfall:
          "Reading it as a convenience feature only. The second half of NOL World\u0027s own description is enforcement, which is the next step.",
        takes: "2 minutes",
      },
      {
        title: "Know the other reason it exists",
        body: "NOL World states the purpose twice over: streamlining identity verification, and preventing the illegal sale and distribution of tickets. A face that must match the account that bought the ticket is a resale control, and it arrives in the same period as a revised Performances Act that reaches habitual resale above face value. Those two facts belong next to each other.",
        pitfall:
          "Assuming a ticket bought through a resale marketplace will simply work at a facepass gate. The system exists to make exactly that not work.",
        takes: "2 minutes",
        see: {
          slug: "buy-k-pop-concert-tickets-from-overseas",
          text: "What the revised Performances Act actually prohibits",
        },
      },
      {
        title: "Know where the face actually goes",
        body: "This is the part most worth knowing. NOL World says facial information — the original image and the feature data — is encrypted and stored by Toss, the fintech company behind the FaceAccess service, and that it is not provided to NOL World or to agencies under any circumstances. Only the authentication result, success or failure, is shared. NOL World also says the data is not used for any purpose beyond providing the service, and cites Toss holding ISO 27701 and CBPR certification.",
        pitfall:
          "These are NOL World\u0027s statements about a third party, not an audit. They are unusually specific for this kind of page, which is a reason to take them seriously and not a reason to stop reading.",
        takes: "5 minutes",
      },
      {
        title: "Treat registration as permanent",
        body: "Once a face is registered it cannot be modified. NOL World gives the reason plainly — it is to prevent fraudulent use of the service. There is no correcting a bad registration later, so the conditions you register under are the conditions you keep: lighting, glasses, whatever the camera captured.",
        pitfall:
          "Registering quickly in a queue, in bad light, meaning to redo it properly later. There is no later.",
        takes: "10 minutes, deliberately",
      },
      {
        title: "Never let anyone register on your phone or account",
        body: "NOL World says it directly: ensure no one else uses your account, and if someone registers face information using your phone or account, the company is not responsible for any resulting issues. A shared household device at the moment a tour goes on sale is exactly how this happens, and the account is the thing that carries the consequence.",
        pitfall:
          "Helping a friend register on your logged-in phone. The face that is now attached to your account is theirs, it cannot be modified, and the disclaimer is explicit.",
        takes: "1 minute",
      },
      {
        title: "Check whether your show supports it at all",
        body: "Support is per event rather than universal — NOL World maintains a question specifically about how to check whether a concert supports facepass, which only exists because the answer varies. Check the event page for your show before planning entry around it, and have the ordinary route ready: confirmation number and identification at the box office.",
        pitfall:
          "Registering, then arriving at a venue that is still doing document checks, with the passport left at the hotel.",
        takes: "3 minutes",
        see: {
          slug: "nol-world-ticketing-guide",
          text: "What collection takes when facepass is not in use",
        },
      },
      {
        title: "Read the deletion answer carefully — it is not simply deletion",
        body: "NOL World answers whether facial information is deleted if you unsubscribe, and the answer has two halves. The first: your face photo is deleted when you cancel the service, and using it again means registering again. The second: for the purpose of identity verification, the data is separately stored and retained for one year from the point of cancellation — used, NOL World says, only for identity verification on re-registration, and discarded after the year. So unsubscribing deletes the photo and starts a clock rather than stopping one. That is a defensible policy and it is not what the word deleted implies on its own, which is why it is worth reading in their words before you register.",
        pitfall:
          "Taking any third party\u0027s one-word summary of what happens to biometric data, including ours. Read the retention sentence, not the headline.",
        takes: "5 minutes",
      },
    ],
    faq: [
      {
        q: "Does NOL World see my face?",
        a: "NOL World says no. Facial information is encrypted and held by Toss, and NOL World states it is not provided to NOL World or agencies under any circumstances — only the success or failure of the authentication is shared.",
      },
      {
        q: "Can I re-register my face if the first attempt was bad?",
        a: "No. NOL World says a registered face cannot be modified, to prevent fraudulent use of the service. Register deliberately the first time.",
      },
      {
        q: "Will my facial data be deleted if I cancel facepass?",
        a: "Partly, and then on a timer. NOL World says the face photo is deleted when you unsubscribe, and that you would have to register again to use the service. It also says that for identity-verification purposes the data is separately stored and retained for one year from cancellation, used only for identity verification if you re-register, and discarded after that year. Until 20 October 2026 this page said we had not read that answer and declined to summarise it; it is now quoted above and logged in our corrections.",
      },
      {
        q: "Does every concert use facepass?",
        a: "No. Support varies by event, and NOL World keeps a separate answer on how to check. Confirm on the event page for your show, and keep the ordinary collection route available.",
      },
      {
        q: "What happens if someone else registers their face on my account?",
        a: "NOL World says the company is not responsible for issues arising from that, and asks you to ensure no one else uses your account. Since a registered face cannot be changed, this is not recoverable in the ordinary way.",
      },
    ],
    sources: [
      {
        label: "NOL World — FAQ: NOL facepass, including storage and third-party sharing",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
  {
    slug: "nol-world-verified-member-ekyc",
    ko: "본인인증",
    art: "guide-nol",
    name: "Verified Member",
    koLine: "NOL World 본인인증 — 여권 촬영과 이름 순서",
    title: "NOL World Verified Member: passing the eKYC check from overseas",
    summary:
      "Some shows will not let you book at all until your passport has been verified. The check is a live passport-and-face capture, it cannot be redone casually, and the one instruction NOL World gives about timing is the one most people ignore.",
    glyph: "id",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers the Verified Member Only identity check on NOL World, as NOL World documents it: when it applies, what the capture needs, what happens to the name it saves, and what resets or restricts it. Korean passport holders are directed to NOL Ticket instead, which is a different check on a different site. Nothing here is a way around a verification.",
    readMinutes: 8,
    platforms: ["NOL World", "NOL Ticket"],
    intro: [
      "A Verified Member Only show is one you cannot book at all until your identity has been verified. Not a warning at checkout — the reservation simply is not available to an unverified account. Fans find this out at the moment the booking opens, which is the worst possible moment, because the verification is a live capture of your passport and your face and it takes as long as it takes.",
      "NOL World explains the service as a way to restrict access for unauthorised purposes such as ticket resale. That is worth taking at face value: the check exists to tie one person to one account, and almost every rule below follows from it.",
    ],
    steps: [
      {
        title: "Check whether your show needs it, and whether you are on the right site",
        body: "Verified Member Only is set per product, not per account — NOL World says only members who have completed identity verification on the product page can make reservations. So the first question is whether your show carries the flag at all. The second is whether you should be on NOL World: NOL World tells Korean passport holders to use the NOL Ticket site instead, which runs a different check entirely.",
        pitfall:
          "Assuming the identity check is a one-off chore the site will prompt you about. For a Verified Member Only show there is no prompt — the booking is just not there.",
        takes: "10 minutes",
        see: {
          slug: "nol-world-ticketing-guide",
          text: "Where overseas-customer verification sits in the wider NOL World flow",
        },
      },
      {
        title: "Do it one to two days before the booking opens",
        body: "This is NOL World's own instruction and the single most useful fact on this page: complete the verification at least one to two days in advance, because attempting it close to the ticket opening time means high traffic may cause difficulties. Once it is done, you can book any Verified Member Only show without verifying again. The cost of doing it early is an evening. The cost of doing it late is the show.",
        pitfall:
          "Starting the capture in the ten minutes before a presale. A verification that fails on traffic cannot be hurried, and the queue does not wait.",
        takes: "30 minutes, two days early",
        see: {
          slug: "kpop-ticketing-day-timezone",
          text: "Working out when the booking actually opens in your own time zone",
        },
      },
      {
        title: "Verify the account you are actually going to buy with",
        body: "Verification is one-time per account, and NOL World states the verified information cannot be reused — one passport verifies one account. If you have more than one account, this is the moment to decide which one is real, because the verification does not move afterwards. NOL World adds that deleting an account erases its verified information and frees it for another, but that an account restricted for misuse cannot be deleted at all.",
        pitfall:
          "Verifying on the account you happened to be logged into, then buying on the other one. The second account is unverified, and the show is Verified Member Only.",
        takes: "5 minutes of deciding",
      },
      {
        title: "Have the original passport, valid and unexpired",
        body: "Only valid passports are accepted, and NOL World is explicit that photos or copies are not: not a printed scan, not a screenshot, not a photo of the page on another screen. If your passport has expired you have to renew it before you can verify — there is no alternative document route on NOL World for a non-Korean passport holder.",
        pitfall:
          "Reaching for the passport photo already in your phone's camera roll because the real one is in a hotel safe. That attempt is recorded as an attempt with a copy.",
        takes: "—",
      },
      {
        title: "Get through the capture on the first attempt",
        body: "NOL World publishes what makes the capture fail, and the list reads like a list of things people do when rushing. Align the passport and your face with the on-screen guides. Keep glare and reflections off both the passport page and your face. Your face must match the photo in the passport. Hold the device steady for at least five seconds while it captures. And if the device is low-spec or the network is unstable, the data may not save correctly even when the capture looked fine. When it fails, the screen states the reason — read it rather than retrying blind.",
        pitfall:
          "Doing this one-handed, at night, under a ceiling light that reflects off the laminate. Overhead light on a passport page is the most common reason a capture will not read.",
        takes: "15 minutes",
      },
      {
        title: "Check the name that was actually saved",
        body: "Only English names are accepted. NOL World says that if your passport name is not in English or contains special characters, the reservation cannot proceed, and that you may be redirected to a name correction request — a submission, not a settings change. The saved name is visible on My Page, which is where to check it rather than assuming. This matters now because after verification you cannot modify your name, date of birth or email address at all: reservations can only be made with the verified information.",
        pitfall:
          "Leaving the name unchecked because the verification said it succeeded. Succeeding and saving the right characters are two different things, and one of them is no longer editable.",
        takes: "5 minutes",
      },
      {
        title: "Understand the name order — and what actually matters at the gate",
        body: "NOL World changed the stored name order on 16 April 2025. Members verified before that date hold First Name + (Middle Name) + Last Name; members verified after it hold Last Name + First Name + (Middle Name). NOL World states plainly that even if the order differs from your passport, ticket verification and entry at the venue are still possible — on-site verification is only restricted if the name itself differs from the passport name. Members verified before 16 April 2025 get the new format applied when they re-verify after a passport expiry.",
        pitfall:
          "Filing a name correction request because the order looks wrong. NOL World says the order is not the problem; a different name is. Correct characters, not sequence.",
        takes: "5 minutes",
      },
      {
        title: "Know what can undo a verification you already passed",
        body: "A completed verification can be cancelled afterwards. NOL World names two causes: attempting verification with a forged or altered ID — which it defines to include printed copies and screenshots — and the passport used for verification expiring. If yours is cancelled, re-verify using the existing account. NOL World specifically warns that trying a new account instead may lead to repeated system failures, and that a verification found to have been obtained by fraudulent means can cost you access to booking services.",
        pitfall:
          "Opening a fresh account to escape a reset. The reset followed the document, not the account, and the new account inherits the problem plus the suspicion.",
        takes: "—",
      },
      {
        title: "Know what the platform counts as fraud, and what it costs",
        body: "The reason the check is this strict is in NOL World's anti-fraud policy, and the consequences are published. Using stolen or fake IDs for verification is listed as fraudulent use. So is booking multiple tickets beyond normal use with identical or similar personal information — the same contact details, shipping address or payment information across accounts. Penalties run from a booking restriction of three months or more to permanent account suspension and cancellation of every ticket booked. The event organiser may add its own, including expulsion from the fan club. There is an appeal, and where fraudulent trading is clearly confirmed there is not.",
        pitfall:
          "Verifying several family accounts from one phone, one address and one card to raise your odds in a presale. That pattern is on the published list, and the stated penalty reaches every ticket on every one of those accounts.",
        takes: "10 minutes of reading",
        see: {
          slug: "buy-k-pop-concert-tickets-from-overseas",
          text: "What the revised Performances Act prohibits, and why platforms tightened",
        },
      },
    ],
    faq: [
      {
        q: "What does Verified Member Only actually mean on an event page?",
        a: "That the show is closed to unverified accounts. NOL World describes it as a service letting members verify their identity before purchasing, where only members who have completed verification on the product page can make reservations. It states the purpose as restricting access for unauthorised purposes such as ticket resale. Have your passport and smartphone to hand, because the check needs both.",
      },
      {
        q: "I hold a Korean passport. Can I just verify on NOL World?",
        a: "NOL World tells Korean passport holders to use the NOL ticket site instead. That is a different site with a different identity check — generally Korean mobile authentication or I-PIN — and a separate account.",
      },
      {
        q: "I am a Korean national living abroad with no Korean mobile number. What then?",
        a: "NOL World publishes a document route. It directs South Korean citizens residing abroad to NOL Ticket, where identity can be verified by mobile authentication or I-PIN; where there is no Korean resident registration number and mobile authentication is unavailable, it accepts supporting documents proving overseas Korean status — a Certificate of Overseas Korean Registration together with a South Korean passport, submitted through its customer support inquiry form with your account ID. It says the certificate can be obtained online through the Overseas Koreans Agency, and that a Foreign Registration Card may be accepted as a substitute where the certificate is difficult to obtain. It also warns that falsified documents mean immediate restriction.",
      },
      {
        q: "Is there a minimum age for identity verification?",
        a: "NOL World says there is no age limit on the verification itself, but that you may still be unable to book or attend products carrying age restrictions. Verifying is not the same as being eligible for a particular show.",
      },
      {
        q: "My name on My Page is in a different order from my passport. Will I be turned away?",
        a: "NOL World says no. It changed the stored order on 16 April 2025 and states that ticket verification and entry are possible even where the order differs from the passport. On-site verification is only restricted if the name itself differs — so check the spelling and the characters, not the sequence.",
      },
      {
        q: "My passport expired after I verified. Do I have to do anything?",
        a: "Yes. NOL World lists passport expiration as a cause for a completed verification being cancelled, so a renewal means re-verifying — on the existing account, not a new one. If you were verified before 16 April 2025, this is also when the new name order gets applied to your record.",
      },
      {
        q: "Can I verify with a family member's passport if mine has expired?",
        a: "No, and this is the one question with a published consequence rather than an opinion. NOL World lists using stolen or fake IDs for verification among the activities it treats as fraudulent use, and the stated penalties run to permanent account suspension and cancellation of every ticket booked. It also says identity verification may be conducted at the venue and asks you to book in your own name and account and bring valid photo ID. A ticket that cannot survive the door is not a ticket.",
      },
      {
        q: "My account was restricted. Is there an appeal?",
        a: "NOL World publishes one. It says users are generally granted a period of at least one day to provide an explanation, and that an appeal should be a detailed statement including your restricted account ID, full name and contact information, with no required format or template, sent through its customer support inquiry form. Review takes roughly 10 to 15 days and the result arrives by email. It also states the limits: miss the deadline or fail to clear the suspicion and bookings are force-cancelled, and where fraudulent trading is clearly confirmed tickets may be cancelled with no appeal at all.",
      },
    ],
    sources: [
      {
        label:
          "NOL World — FAQ: Verified Member Only, identity verification (eKYC), and the anti-fraud and cancellation policy",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — customer support inquiry form, used for document submission and appeals",
        url: "https://world.nol.com/en/my-info/inquiries/new",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
  {
    slug: "nol-world-cancel-ticket-refund",
    ko: "환불",
    art: "guide-card",
    name: "Cancel and refund",
    koLine: "예매 취소와 환불 — 마감 시각과 환율 손실",
    title: "Cancelling a NOL World ticket: the deadline, the fee, and the money you still lose",
    summary:
      "The cancellation deadline is the afternoon before the show in Korean time, Saturdays are earlier than the rest of the week, and a fully refunded ticket can still cost a foreign cardholder money. Also: sending the ticket to your friend takes the cancel button away.",
    glyph: "card",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers cancelling a performance ticket on NOL World, as NOL World documents it: the deadlines, where the fee is shown, how the refund reaches a foreign card, and what makes cancellation impossible. NOL World does not publish a central fee schedule and this page does not invent one. Tour and activity products follow their own policies and are only noted where they differ.",
    readMinutes: 7,
    platforms: ["NOL World"],
    intro: [
      "An overseas fan cancels for reasons a domestic fan rarely has: a visa, a connecting flight, a work rota that moved. So the cancellation rules matter more to this audience than to the one they were written for — and they are strict, time-zoned, and in two places asymmetric in ways nobody would guess.",
      "Two of the facts below are worth knowing before you book rather than after. Saturday shows close for cancellation six hours earlier than every other day. And a cancellation that NOL World processes in full can still leave a foreign cardholder out of pocket, which is nobody's mistake and is also nobody's problem to fix for you.",
    ],
    steps: [
      {
        title: "Learn the deadline before you book, because it is not the day of the show",
        body: "NOL World closes performance cancellations the day before, not on the day: 5pm KST on the day before the show for weekdays and holidays, and 11am KST on the day before for a Saturday show. The Saturday rule is the one that catches people — it is six hours earlier than the rest of the week, and it applies to the Saturday performance, so the deadline falls on Friday morning Korean time.",
        pitfall:
          "Working out \u0027the day before\u0027 on your own calendar. For a Saturday evening show in Seoul, 11am KST Friday is Thursday evening in New York. The deadline can land a full day earlier than it reads.",
        takes: "5 minutes, before you pay",
        see: {
          slug: "kpop-ticketing-day-timezone",
          text: "Converting a KST deadline without getting the date wrong",
        },
      },
      {
        title: "Use the free window if you are having second thoughts",
        body: "There is a no-fee period, and it is short: NOL World says that for tickets, cancelling by 11:59 PM on the day of your reservation means no cancellation fee. So the decision you can reverse for nothing is the one you make the same day you booked. After midnight it costs something.",
        pitfall:
          "Assuming that 11:59 PM is your own midnight. NOL World names KST explicitly on the other cancellation deadlines and does not name a zone on this one, so the safe reading is Korean time — and either way, a decision made in the last ten minutes of a window is a decision made too late.",
        takes: "—",
      },
      {
        title: "Know where the button is, and what it means when it is missing",
        body: "The route is App or Web, then Account/My, then My Reservations, then Ticket Reservation List, then the reservation, then Cancel Reservation on the details page. If the Cancel Reservation button is not on the details page at all, NOL World's instruction is to contact customer support rather than keep looking: a representative confirms cancellation eligibility, the fee and the refund amount with the supplier and then guides you. You can follow the request from the reservation details page, and a confirmation email follows when it completes.",
        pitfall:
          "Reading a missing button as a website fault and retrying it for an hour. It is a status, and the clock in step one is still running while you retry.",
        takes: "15 minutes, plus support time",
      },
      {
        title: "Expect no fee schedule, and get the number from your own reservation",
        body: "There is no published fee table to plan against. Asked how much the cancellation fee is, NOL World answers with a path — Web/App, Account/My, My Reservations, Reservation Details — because the figure is a property of your booking, not of the platform. For tour and activity products the fee and the refund amount are shown to you when you press Cancel Reservation, before you confirm. We are not going to print a percentage here that your reservation might not agree with.",
        pitfall:
          "Planning around a fee schedule from a blog post. Any guide quoting a fixed Korean cancellation percentage for your show is quoting something NOL World does not publish.",
        takes: "5 minutes",
      },
      {
        title: "Check partial cancellation while you are still booking",
        body: "Cancelling two seats out of four is possible for some shows and not for others, and NOL World's instruction is to check the partial-cancellation status while you are booking — which is to say, before it is the thing you need. Tour and activity products do not allow it at all: there the route is cancel the whole booking and rebook, and NOL World warns plainly that availability is not guaranteed afterwards and rebooking may not be possible.",
        pitfall:
          "Booking four seats on the assumption that the two uncertain friends can be dropped later. For a show without partial cancellation, the choice becomes all four or none.",
        takes: "2 minutes, at booking",
      },
      {
        title: "Understand that a full refund can still cost a foreign cardholder money",
        body: "This is the part written for this audience and almost never explained in English. NOL World states that where a foreign credit card was used, a profit or loss of foreign exchange can occur because of the difference between the exchange rate on the booking date and the rate on the cancellation date — and, separately, that international transaction fees could be applied even though the transaction has been cancelled. Neither is a deduction NOL World makes. Both are your card issuer, and NOL World's advice is to ask the issuer for the exact rates and fees.",
        pitfall:
          "Reading a refunded amount that is smaller than the amount charged as an error or a hidden fee. The gap can be the exchange rate moving between two dates, and the person who can explain it is your bank, not the ticketing platform.",
        takes: "A phone call to your bank",
        see: {
          slug: "foreign-card-declined-korean-ticketing",
          text: "Why a foreign card behaves differently on Korean ticketing in the first place",
        },
      },
      {
        title: "Give the refund the time the card network needs",
        body: "If the transaction has not yet reached your credit card company, NOL World says the cancellation completes right away. If it has, and the payment amount has been settled, expect roughly 5 to 7 days for the card company to reverse it, and the cancelled amount to be deducted from the following month's bill rather than returned as a payment. NOL World notes refund policies differ between card companies, so yours is the authority on its own timing.",
        pitfall:
          "Opening a dispute with your bank while the reversal is in progress. A chargeback on a transaction that is already being cancelled creates a second problem on an account you may want to book with again.",
        takes: "5-7 days",
      },
      {
        title: "Do not send the mobile ticket until you are certain you are going",
        body: "This is the trap worth the whole page. Mobile ticket sharing lets the purchaser send a ticket to the person attending — and NOL World states that once the mobile ticket has been successfully sent, cancellation of the reservation is restricted. The way back is the recipient's: if they deregister the ticket, cancellation becomes possible again. Before registration there are softer exits — the sender can press Cancel Send while the ticket is unregistered, and an unregistered ticket returns automatically after 24 hours or by the viewing date.",
        pitfall:
          "Sending tickets to friends the week you book, as the organised thing to do. The cancel button is now effectively theirs, and getting it back means asking them to give the ticket up first.",
        takes: "—",
        see: {
          slug: "nol-facepass-face-registration",
          text: "Why the person who holds the ticket is increasingly the person who must enter on it",
        },
      },
      {
        title: "Read tour and activity policies separately",
        body: "If your booking is a tour, a transfer or an activity rather than a performance ticket, none of the above is a safe default. NOL World says some of these products cannot be cancelled once purchased at all, and that a 100% cancellation fee may apply even on the day of purchase. The policy that governs is the one on the product's own details page and voucher, and NOL World asks you to read it before submitting a cancellation request.",
        pitfall:
          "Carrying the ticket rules across to a package booked in the same session. The same-day free window is a performance-ticket rule, and a tour product can be non-refundable from the moment you pay.",
        takes: "10 minutes per product",
      },
    ],
    faq: [
      {
        q: "What exactly is the cancellation deadline for a performance?",
        a: "The day before the show, in Korean time. NOL World gives 5pm KST on the day before for weekdays and holidays, and 11am KST on the day before for Saturday performances. Convert it against your own date carefully — an 11am KST Friday deadline is Thursday evening in much of the Americas.",
      },
      {
        q: "Is there any free cancellation?",
        a: "For performance tickets, yes, on the day you book: NOL World says cancelling by 11:59 PM on the day of your reservation carries no cancellation fee. It does not name a time zone on that one while naming KST on the others, so treat it as Korean time and do not cut it fine. Tour and activity products are different — some charge 100% even on the same day.",
      },
      {
        q: "How much is the cancellation fee?",
        a: "NOL World does not publish a schedule. Asked that question it gives a path instead — Web or App, Account/My, My Reservations, Reservation Details — because the figure belongs to your booking. For tour and activity products, pressing Cancel Reservation shows you the cancellation fee and the refund amount before you confirm. Any English guide quoting a fixed percentage for your show is quoting a number the platform does not state.",
      },
      {
        q: "I cancelled in time and got back less than I paid. Where did the rest go?",
        a: "Probably not to NOL World. It states that a foreign card can produce a foreign-exchange profit or loss from the difference between the booking-date and cancellation-date rates, and that international transaction fees could still apply even though the transaction was cancelled. Both sit with your card issuer, and NOL World's own advice is to ask the issuer for the exact rates and fees.",
      },
      {
        q: "How long does the money take to come back?",
        a: "If the transaction has not reached your card company yet, the cancellation completes immediately. If it has, NOL World says about 5 to 7 days for the card company to cancel the transaction, with the amount deducted from the following month's bill. Card companies differ, so yours is the one that can tell you.",
      },
      {
        q: "I already sent the mobile ticket to my friend. Can I still cancel?",
        a: "Not while they hold it. NOL World says cancellation of the reservation is restricted once a mobile ticket has been successfully sent, and becomes possible again if the recipient deregisters it. If the ticket has not been registered yet you have easier exits: the sender can press Cancel Send, and an unregistered ticket returns automatically after 24 hours or by the viewing date.",
      },
      {
        q: "Can I cancel two of my four seats?",
        a: "It depends on the show, and NOL World's advice is to check the partial-cancellation status when you book rather than when you need it. Tour and activity products do not support partial cancellation at all — you would cancel the whole booking and rebook, with no guarantee the inventory is still there.",
      },
      {
        q: "The Cancel Reservation button is not on my reservation page.",
        a: "NOL World treats that as a case for customer support rather than a fault to retry. A representative confirms eligibility, the fee and the refund amount with the supplier first. Contact them early, because the deadline in the first answer keeps running while you wait.",
      },
    ],
    sources: [
      {
        label:
          "NOL World — FAQ: cancellation deadlines, same-day cancellation, refund timing, foreign-card exchange differences, partial cancellation and mobile ticket sharing",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — customer support inquiry form, for a reservation with no cancel button",
        url: "https://world.nol.com/en/my-info/inquiries/new",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
  {
    slug: "nol-world-mobile-ticket-and-entry",
    ko: "모바일티켓",
    art: "guide-tickets",
    name: "Mobile ticket",
    koLine: "모바일 티켓과 입장 — QR·PIN·대리수령",
    title: "Your NOL World mobile ticket: the QR, the PIN, and getting through the gate",
    summary:
      "The ticket only opens on a phone, it is English-only and your browser's auto-translate will mangle it, a sent ticket has a 24-hour PIN clock, and arriving late is not a guaranteed entry. The last twenty minutes of the whole process, in order.",
    glyph: "ticket",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers the NOL World mobile ticket and venue entry as NOL World documents it: where the ticket opens, the two browser states that hide it, sending and receiving with the PIN clock, proxy collection, and late arrival. Entry rules are set per show and the venue decides on the night. Facial-recognition entry is a separate flow with its own guide.",
    readMinutes: 7,
    platforms: ["NOL World"],
    intro: [
      "Everything else on this site is preparation. This is the part where a flight, a hotel and a presale either turn into a seat or do not, and it runs on a phone you are holding in a crowd with bad signal.",
      "Most of what goes wrong here is not dramatic. It is a browser in the wrong mode showing a QR code where the ticket should be, a translation extension rewriting a gate number, a PIN that expired while a friend was asleep. All four are documented by NOL World and all four are avoidable the night before.",
    ],
    steps: [
      {
        title: "Know which kind of ticket you actually hold",
        body: "The delivery method was decided when you booked, and it determines everything below. A mobile ticket lives in your account and gets scanned from your screen. Pick-up at venue means a paper ticket from the box office on the day of the show, and NOL World does not release those early — the window opens an hour before, and a collected ticket cannot be re-issued if it is lost or stolen. Check which one you have now, not at the venue.",
        pitfall:
          "Assuming every booking is a mobile ticket because that is what the last concert used. It is a per-booking property, and the two routes fail in completely different ways.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-ticketing-guide",
          text: "What collection at the box office requires, and when it opens",
        },
      },
      {
        title: "Open the mobile ticket on the phone you will enter with",
        body: "NOL World states that mobile tickets are only available on the NOL World app or mobile web. Entry is by the QR code on the ticket. The route on a phone is app or mobile web, log in, Account/My, My Reservations, then the Mobile Ticket button. On a desktop the same button produces a QR code that is not your ticket — it is a handoff, meant to be scanned with your phone so the ticket opens there.",
        pitfall:
          "Screenshotting the ticket as a backup and planning to show the image. A ticket that renders live in an account is not the same artefact as a picture of one, and the gate is not where you want to discover the difference.",
        takes: "10 minutes, the night before",
      },
      {
        title: "Turn off browser translation before you go",
        body: "NOL World says mobile tickets are provided in English only, and that if you are seeing other languages it is your browser's automatic translation — the fix being to turn translation off and refresh the page. For this audience that is the default state of the browser rather than an edge case. An auto-translator rewriting a gate, a block or a seat row is a problem you will not notice until somebody at the door reads it back to you.",
        pitfall:
          "Leaving translate-on because it has been helpful all trip. It has been translating Korean pages for you; here the page is already English and the only thing it can do is damage.",
        takes: "2 minutes",
      },
      {
        title: "If you see a QR code where the ticket should be, fix the browser mode",
        body: "This is the single most common way the ticket appears to be missing, and it is not a fault. NOL World says that if your browser is in desktop mode, a QR code is shown instead of the mobile ticket — and that there is a View Tickets button below that QR which opens the ticket anyway. Otherwise switch the browser to mobile mode: in Chrome, the three-dot menu and View as mobile version; in Safari, the language button to the left of the address bar and Request Mobile Website; in Samsung Internet, the three-line menu and Mobile site.",
        pitfall:
          "Letting someone at the gate scan that QR code. It is the desktop handoff code, not your entry code, and the thing you need is one tap below it.",
        takes: "2 minutes",
      },
      {
        title: "Understand what sending a ticket commits you to",
        body: "Mobile ticket sharing goes one way: the purchaser sends to the attendee, and NOL World states that a received ticket cannot be sent on — only booked tickets can be sent. Sending stays possible until the day of the event. Not every product offers it; where the seller has withheld it, the Send button simply is not there. And the cost of sending is your own exit: once a ticket has been successfully sent, NOL World restricts cancellation of the reservation, which is only restored if the recipient deregisters.",
        pitfall:
          "Organising a group by sending everyone their ticket the week you book. You have just handed each person a veto over cancelling that reservation.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-cancel-ticket-refund",
          text: "Why a sent ticket is a cancellation problem as well as a logistics one",
        },
      },
      {
        title: "If you are receiving a ticket, treat the PIN as a 24-hour clock",
        body: "A received ticket is not usable until it is registered, and the window is short. NOL World says the PIN can only be registered within 24 hours of sending, and that an unregistered ticket returns to the sender after that — or if it is not registered by the viewing date. Registration runs from the URL in the message or email: Received Mobile Ticket, Ticket Register, then the PIN from the message. Afterwards the ticket lives under My Page, Received Mobile Ticket, Booking History. Returning one is the same path with the Return button, and NOL World says a registered ticket can still be returned.",
        pitfall:
          "Sending to a friend in a time zone where those 24 hours are mostly night. The ticket bounces back to you silently and the reservation is yours again, which is fine on Tuesday and not fine on the morning of the show.",
        takes: "5 minutes, inside 24 hours",
      },
      {
        title: "Check the show page before assuming someone else can collect for you",
        body: "NOL World does allow a non-purchaser to collect tickets, with real conditions attached. The process differs by venue, proxy collection may be restricted depending on the type of show, and NOL World's instruction is to check the notice on the details page of the show you booked. What the other person needs is the booking details printed from My Ticket, the confirmation number, and identification of the purchaser. Treat that last requirement as the limit it is: on a show that gates entry on the buyer's own verified identity, do not plan around a proxy.",
        pitfall:
          "Reading proxy collection as a general right. It is a per-venue, per-show allowance, and the shows most likely to refuse it are exactly the high-demand ones you needed a presale for.",
        takes: "10 minutes",
        see: {
          slug: "nol-world-verified-member-ekyc",
          text: "Why identity-verified shows tie the ticket to the buyer",
        },
      },
      {
        title: "Do not treat late arrival as a seat you still have",
        body: "NOL World is explicit that entry after the start depends on the show, and that some performances do not allow it at all — naming classical concerts and operas in particular. Where late entry exists it may mean waiting for the interval and watching the second half. And even when you are let in, NOL World says you may not be able to claim your seat until the interval, so a late arrival can mean standing or sitting elsewhere through the part you came for.",
        pitfall:
          "Budgeting arrival time from the start time. Budget it from the entry queue, the security check and the collection window, which all happen before the start time and none of which wait.",
        takes: "—",
      },
    ],
    faq: [
      {
        q: "There is a QR code where my ticket should be. Is my booking broken?",
        a: "No — your browser is in desktop mode. NOL World says that produces a QR code in place of the mobile ticket, and that a View Tickets button below it opens the ticket. You can also switch the browser to mobile mode: Chrome's three-dot menu has View as mobile version, Safari's language button offers Request Mobile Website, and Samsung Internet's three-line menu has Mobile site.",
      },
      {
        q: "My mobile ticket is showing in the wrong language.",
        a: "NOL World provides mobile tickets in English only, so another language means your browser is auto-translating. Turn translation off and refresh. Worth doing before you travel rather than at the gate, because a translated gate number or seat row is wrong in a way that is hard to spot.",
      },
      {
        q: "Can I show the ticket from my laptop at the door?",
        a: "NOL World says mobile tickets are only available on the app or mobile web. On a desktop the Mobile Ticket button gives you a QR code to scan with your phone, which then opens the actual ticket there. Plan to enter on a phone.",
      },
      {
        q: "Can my friend pick up my tickets at the box office?",
        a: "Sometimes. NOL World says a non-purchaser can collect, but that the process varies by venue and proxy collection may be restricted depending on the type of show — so the notice on your show's details page is the authority. They would need the booking details printed from My Ticket, the confirmation number and identification of the purchaser. On shows that verify the buyer's identity at entry, do not rely on it.",
      },
      {
        q: "I sent a mobile ticket by mistake. Can I take it back?",
        a: "If the recipient has not registered it yet, yes — NOL World says the sender can cancel the sharing with the Cancel Send button. It also returns automatically if the recipient does not register within 24 hours or by the viewing date. Once registered, getting it back is their action: they return it from My Page, Received Mobile Ticket, Booking History, Mobile Ticket, Return.",
      },
      {
        q: "What happens if my friend never registers the ticket I sent?",
        a: "It comes back to you. NOL World says an unregistered ticket is automatically returned to the sender after 24 hours, or if it has not been registered by the viewing date. That restores your reservation — including, per its cancellation rules, your ability to cancel it — but it is a silent process, so check rather than assume.",
      },
      {
        q: "I am going to be twenty minutes late. Will they let me in?",
        a: "It depends on the show and nobody can promise it. NOL World says entry after the start depends on the performance and that some do not permit it at all, classical concerts and operas especially; where it is allowed you may have to wait for the interval, and you may not be able to claim your own seat until then.",
      },
      {
        q: "Is the mobile ticket the same thing as facial-recognition entry?",
        a: "No. NOL facepass is a separate system where a camera at the door admits you without a ticket check, and support for it is set per event. The mobile ticket and its QR code are the ordinary route, and the one to keep working even if you have registered a face.",
      },
    ],
    sources: [
      {
        label:
          "NOL World — FAQ: mobile ticket use, sharing and PIN registration, browser mode and language, proxy collection and late entry",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
  {
    slug: "nol-world-play-stay-package",
    ko: "패키지",
    art: "fan-kit",
    name: "Play&Stay",
    koLine: "공연+숙박 패키지 — 하나의 상품, 변경 불가",
    title: "NOL World Play&Stay: one product, and almost nothing about it is changeable",
    summary:
      "A concert and a hotel sold as a single item. You cannot change the hotel, the dates or the nights, skipping the hotel refunds nothing, the seat is random and revealed on the day, and the tickets are handed only to you, in person, at the hotel, inside a window.",
    glyph: "star",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers NOL World's Play and Stay concert-plus-hotel packages as NOL World documents them: what is fixed, how tickets are collected, the identity and name requirements, and what its cancellation answers actually say. Individual packages carry their own cancellation policy and inclusions, and the product page governs. Shuttle service is noted only where a package includes one.",
    readMinutes: 9,
    platforms: ["NOL World"],
    intro: [
      "A package looks like the easy option: one payment, a hotel near the venue, a guaranteed seat grade, no fighting a queue. For an overseas fan with one shot at a trip, that is a genuinely attractive trade.",
      "It is also the most rigid product on the platform, and the rigidity is not obvious from the listing. Read NOL World's own answers in a row and a pattern appears: the package is one indivisible item. Not a ticket and a hotel room you can optimise separately — one thing, bought once, changeable almost nowhere. Everything below follows from that single fact, including the parts that will seem unfair when you need them.",
    ],
    steps: [
      {
        title: "Understand that you are buying one item, not two bookings",
        body: "This is the whole guide in one step. NOL World states that the number of nights in a package cannot be modified, that the check-in and check-out dates specified in the package cannot be changed, and that hotel changes are not permitted. Nights cannot be added at purchase either — extra stays are a separate conversation with the hotel, at the hotel's price and subject to its availability. And one account can buy one item, so this is not a thing you stack.",
        pitfall:
          "Booking the package intending to tidy the details later: arrive a day early, move to a hotel nearer a friend, trim a night off the end. Every one of those is a documented no.",
        takes: "15 minutes, before you pay",
      },
      {
        title: "Accept that skipping the hotel refunds nothing",
        body: "The question gets asked two ways in NOL World's FAQ and gets the same answer both times: you may choose not to stay at the hotel, but refunds for the hotel portion are not available, and the reservation is non-transferable to another person. So staying with a friend instead does not convert into money back, and the room you paid for cannot be handed to anyone else. Using one night and reclaiming the rest is also refused — the number of nights is fixed.",
        pitfall:
          "Treating the hotel half as a deposit you can walk away from. It is the half you cannot resell, cannot give away and cannot reclaim.",
        takes: "—",
      },
      {
        title: "Expect a random seat, and expect to learn it on the day",
        body: "The package guarantees a grade, not a location. NOL World says seating within sections and zones, aside from your chosen category, is assigned randomly — and that your seat assignment is shown when you pick up the ticket at the hotel on the performance day. You will not know where you are sitting until hours before the show. It also closes the obvious follow-up: being unsatisfied with the seat is not a refund reason, and a cancellation fee may apply anyway.",
        pitfall:
          "Planning around a seat position — a particular side for a fan project, a row for a lens. The grade is the promise; the rest is a draw you see on the day.",
        takes: "—",
      },
      {
        title: "Collect at the hotel desk, in person, inside the window",
        body: "There is exactly one way to get these tickets. NOL World says pickup is only at the NOL World ticket desk located in the hotel, only during the designated hours, and that tickets are issued exclusively to the reservation holder, who must pick them up in person. Asked whether someone eligible for a discount could collect and attend instead, its answer is that tickets can only be collected and used by the reservation holder, no exceptions. Miss the designated hours and the published answer is simply that tickets are available only during the specified time.",
        pitfall:
          "Scheduling the day around the venue. The binding appointment is at the hotel desk, in a window somebody else set, on the day of the show.",
        takes: "Build the day around it",
        see: {
          slug: "nol-world-mobile-ticket-and-entry",
          text: "How ordinary NOL World collection differs from this",
        },
      },
      {
        title: "Bring the documents the desk actually requires",
        body: "NOL World is specific: the valid original ID of the reservation holder, plus the reservation confirmation either printed or on a phone — and without these, tickets cannot be collected. For non-Korean nationals the accepted ID is a passport or a certificate of alien registration. Korean nationals have a longer list, including a resident registration card, driver's licence, passport, youth ID or a mobile ID issued through Government 24 or PASS.",
        pitfall:
          "Leaving the passport in the room safe because the desk is in the same building. It is the original ID that opens the ticket, and a photo of it is not on the list.",
        takes: "5 minutes of packing",
      },
      {
        title: "For a two-person package, both of you have to be at the desk",
        body: "This one reorganises a day and is easy to miss. NOL World says that for a package for two, both the reservation holder and the companion must be present to collect the tickets — and that the companion is also required to show identification, to confirm they meet the age requirement for entry. So the collection window is an appointment for two people with two IDs, not an errand one of you can run.",
        pitfall:
          "Splitting up on the day — one collecting tickets while the other sightsees or queues for merch. The desk will not release the tickets to one of you.",
        takes: "—",
      },
      {
        title: "Make the name match the passport exactly, now",
        body: "NOL World answers this with both consequences in one sentence: if the name provided at booking does not match your passport, ticket collection and hotel check-in will not be possible. Both halves of the package, blocked by the same error. The question it answers names the usual culprits — a misspelling, a missing middle name, capitalisation, spacing. Check the booking against the passport page itself rather than against memory.",
        pitfall:
          "Assuming a small difference will be waved through because the package is already paid. Paid is not the thing being checked at either counter.",
        takes: "10 minutes",
        see: {
          slug: "nol-world-verified-member-ekyc",
          text: "How NOL World stores your name, and why its order may differ from the passport",
        },
      },
      {
        title: "Do not wait for a hotel confirmation email, because there is not one",
        body: "This causes avoidable panic, so know it in advance. NOL World says hotel reservation confirmations are not sent out separately, and that if the payment went through, the hotel reservation is confirmed and valid. More usefully: reservation details are only passed to the hotel roughly two weeks before the stay, so the hotel genuinely cannot find you before then. If you ring earlier and they have never heard of you, that is the documented normal state.",
        pitfall:
          "Booking a backup room, or re-buying the package, because the hotel says there is no reservation six weeks out. Nothing was wrong, and now there are two bookings.",
        takes: "2 minutes of reassurance",
      },
      {
        title: "Check in as the purchaser, and read the small inclusions",
        body: "Hotel check-in is gated on the same person as the tickets: NOL World says check-in is only available on verifying the identity of the reservation holder, so a companion cannot check in first and wait. If you will arrive late, its instruction is to contact the hotel in advance — while warning it may not be possible depending on the hotel. Two more specifics worth knowing before you book: minors cannot stay without a legal guardian, and breakfast is not included unless your particular package includes it.",
        pitfall:
          "Sending a friend ahead to drop the bags and start the stay. The room opens on your identity, not on the booking reference.",
        takes: "—",
      },
      {
        title: "If there is a shuttle, treat it as one departure with no second chance",
        body: "Where a package includes a shuttle, NOL World's answers are unsentimental. Use of it is optional and not using it refunds nothing. There are no backup vehicles, so arriving late at the pick-up point means it has gone. A return-only shuttle is possible. A companion who did not book can ask the on-site shuttle manager, but seating is limited and cannot be guaranteed. And the detail that ruins an evening: you may bring a case onto the bus, but luggage storage inside the bus is not available once you arrive at the venue. The return boarding point and time are given to you when the tickets are handed over at the hotel.",
        pitfall:
          "Taking a suitcase to the concert because the bus allowed it on. At the venue there is nowhere to leave it, and you are carrying it through the show.",
        takes: "—",
      },
      {
        title: "Read the cancellation answers before you book, because they are no",
        body: "This is the step to take seriously while the trip is still a plan. NOL World publishes answers to the two hardest cases and both are refusals. On infection: following the downgrade in the COVID-19 risk classification, quarantine is no longer mandatory, and accordingly no reduction in the cancellation fee applies even if you are infected. On bereavement and hospitalisation after an accident: refunds for personal reasons are not available, and cancellation fees apply according to each product's own policy. Whether that reads as harsh or as merely clear, it tells you where the risk sits — with you, from the moment you pay. The instrument designed to carry it is travel insurance taken out before departure, and what it actually covers depends on the policy you buy, so read that document rather than assuming it.",
        pitfall:
          "Carrying the risk uninsured on the assumption that a serious enough reason will be accepted. NOL World has already published its answer to the two most serious reasons there are.",
        takes: "30 minutes with an insurance policy",
        see: {
          slug: "nol-world-cancel-ticket-refund",
          text: "How cancellation works on an ordinary ticket, which is more forgiving than this",
        },
      },
    ],
    faq: [
      {
        q: "Can I buy the package and not use the hotel?",
        a: "You can decline to stay, but NOL World states the hotel portion is not refundable and the reservation cannot be transferred to anyone else. Using fewer nights than the package contains and reclaiming the difference is also refused, because the number of nights cannot be modified.",
      },
      {
        q: "Can I extend the stay, shorten it, move the dates, or change hotel?",
        a: "Nights cannot be modified, the check-in and check-out dates in the package cannot be changed, and hotel changes are not permitted. Extra nights cannot be added at purchase either — NOL World's instruction is to contact the hotel directly about availability and price, and it may not be possible. A room upgrade is the same: ask the hotel, and pay the hotel directly on arrival.",
      },
      {
        q: "When do I find out my seat?",
        a: "When you collect the ticket at the hotel on the day of the performance. The package guarantees a grade; within that grade, NOL World assigns sections and seats randomly. Being unhappy with the result is not a refund reason.",
      },
      {
        q: "Can someone collect the tickets for me, or attend in my place?",
        a: "No. NOL World says tickets are issued exclusively to the reservation holder and must be collected in person, and that they can only be collected and used by the reservation holder, no exceptions. For a two-person package both people must be at the desk, and the companion must also show ID so their age can be confirmed.",
      },
      {
        q: "I have not received a hotel confirmation email.",
        a: "There is not one. NOL World says hotel confirmations are not sent separately, and that a successful payment means the hotel reservation is confirmed. It also says reservation details reach the hotel only about two weeks before check-in, so direct confirmation is possible only after that.",
      },
      {
        q: "I called the hotel and they cannot find my booking.",
        a: "Expected, if you called early. NOL World says details are sent to the hotel roughly two weeks before the stay and that confirmation is only possible after that, and that a properly completed package reservation and payment means the hotel booking is secure. Do not re-book.",
      },
      {
        q: "I tested positive, or had a family emergency. Will the cancellation fee be waived?",
        a: "NOL World's published answer is no in both cases. It says that with COVID-19 quarantine no longer mandatory, no reduction applies to the cancellation fee even if you are infected; and that refunds for personal reasons, including bereavement or hospitalisation after an accident, are not available, with fees applying per each product's policy. Travel insurance bought before you travel is the mechanism for this risk — what it covers depends on the policy, so read it.",
      },
      {
        q: "Do I have to use the shuttle, and can I take a suitcase on it?",
        a: "It is optional, and not using it refunds nothing. A case can come onto the bus, but NOL World warns that luggage storage inside the bus is not available once you reach the venue — so a suitcase you bring is a suitcase you carry. There are no backup vehicles if you miss the departure, and the return boarding point and time are given out with the tickets at the hotel.",
      },
    ],
    sources: [
      {
        label:
          "NOL World — FAQ: Play and Stay packages, covering ticket collection at the hotel, documents, hotel changes, shuttle service and cancellation",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
  {
    slug: "kpop-album-customs-duty-overseas",
    ko: "관세",
    art: "album-stack",
    name: "Customs and duty",
    koLine: "앨범 주문과 관세 — 면세 기준이 사라진 뒤",
    title: "Customs on a K-pop album order: what changed when duty-free went away",
    summary:
      "The United States suspended its 800-dollar duty-free threshold and the EU removed its low-value exemption in the same year. A Korean album order is now dutiable from the first dollar, and the only question left is whether you pay at checkout or at the door.",
    glyph: "parcel",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers the United States and the European Union, because those are the two changes we could read against primary sources — the CBP rules in the Federal Register and the Commission change as the US Postal Service states it. Not tax advice, and not a calculator: your own country, your parcel's contents and your carrier decide what you actually pay. Nothing here is a method for lowering a declared value.",
    readMinutes: 9,
    platforms: ["Weverse"],
    intro: [
      "For about a decade, an international fan ordering albums from Korea could ignore customs. A parcel under 800 dollars entered the United States free, most orders were nowhere near that, and the guides written in those years simply did not mention duty because there was nothing to mention.",
      "That is over, in both of the markets this audience mostly lives in, and it happened fast enough that essentially every English guide online still describes the old world. This page is what replaced it — with the dates and the citations, because the single most useful thing about a rule this new is knowing exactly how new it is.",
    ],
    steps: [
      {
        title: "Know that the US threshold is gone, and that waiting it out is not a plan",
        body: "The 800-dollar de minimis exemption has been suspended since 29 August 2025 under Executive Order 14324, and Executive Order 14388 continued that suspension on 20 February 2026. US Customs and Border Protection then wrote it into its own regulations for the postal network on 24 June 2026, effective 24 July 2026. The part that settles the question: Congress already terminated the exemption outright, effective 1 July 2027, in the One Big Beautiful Bill Act. So this is not a policy to sit out — the temporary version expires into a permanent one.",
        pitfall:
          "Treating this as a tariff story that will reverse. The statute does not reverse, and CBP states it issued its rule independently of the executive orders, so a court ruling on one would not restore the exemption by itself.",
        takes: "5 minutes",
      },
      {
        title: "Know that the EU did the same thing, five months earlier",
        body: "This is the half that almost no English guide covers. As the US Postal Service records in its own October 2026 rulemaking, the European Commission eliminated the de minimis exemption for most low-value goods entering the EU customs territory as of 1 July 2026, and established a new hierarchical system for deciding who is responsible for paying duties, taxes and import fees on them. Some EU destination postal operators now require items to be sent on a delivered-duty-paid basis, and where an item arrives duty unpaid and the money cannot be recovered from the addressee, the destination operator may pursue the sender instead.",
        pitfall:
          "Reading US coverage and assuming Europe is unaffected, or vice versa. Both markets removed their low-value exemptions in 2026, and a guide that mentions only one is describing half the world.",
        takes: "5 minutes",
      },
      {
        title: "Recalculate what an album order actually costs",
        body: "The practical effect is simple and unwelcome: a commercial parcel is now dutiable from the first dollar, in both markets. There is no value beneath which your order slips through, so the number that matters is landed cost — the album, the shipping, and the duty and tax your own country assesses on it. Work that out before you order rather than after, because the gap between the sticker price and the landed cost is now large enough to change which storefront you use.",
        pitfall:
          "Comparing two storefronts on item price. The cheaper listing can be the more expensive order, and you find out at the door.",
        takes: "15 minutes per order",
        see: {
          slug: "buy-k-pop-albums-from-overseas",
          text: "Where to order so the purchase still counts towards a chart",
        },
      },
      {
        title: "Work out whether you pay at checkout or at the door",
        body: "There are two shapes this takes and it is worth knowing which you are in. Historically, for a mail shipment valued at 2,500 dollars or less, a CBP officer prepared the entry by hand and the recipient paid the duties, taxes and fees — generally at the local post office, before taking possession of the parcel. CBP's new postal process moves that work to a filer who reports and remits, which is what makes prepayment at checkout possible. So the same duty reaches you either as a line on the order page or as a payment demanded before release.",
        pitfall:
          "Assuming a parcel marked as shipped is a parcel that is coming. Under the pay-on-arrival shape it waits until somebody pays, and nobody will chase you harder than the storage clock.",
        takes: "—",
      },
      {
        title: "Check whether your platform prepays, because one now does",
        body: "Weverse Shop changed its checkout on 3 February 2026. Its notice describes three things: taxes calculated from the final shipping or billing address at checkout; prices shown tax-exclusive for orders shipped outside Korea, where they used to be tax-inclusive; and prepaid duties and taxes collected at checkout instead of paid to customs on delivery — explicitly not for every country or region. It also added a billing-address field. If your order looks more expensive than it used to, that is the tax moving into view rather than a price rise.",
        pitfall:
          "Comparing a prepaid platform against a non-prepaid one and calling the prepaid one dearer. One of those prices includes the duty.",
        takes: "10 minutes",
        see: {
          slug: "order-from-weverse-shop-overseas",
          text: "The rest of the Weverse Shop ordering flow from overseas",
        },
      },
      {
        title: "Understand the gift exemption, and that it is genuinely a gift exemption",
        body: "The gift route survived, and it is narrower than people assume. CBP states that this rule does not touch the exemption for bona fide gifts valued at 100 dollars or less — 200 if from certain island possessions — sent from a person in a foreign country to a person in the United States, nor the 200-dollar exemption for personal or household articles accompanying a traveller. Its reasoning is that the lower volume and lower threshold raise different concerns. So if a friend in Seoul genuinely sends you a birthday present under 100 dollars, that is still duty-free, and nothing below changes it.",
        pitfall:
          "Hearing that as a shipping option. The word in the statute is bona fide: it means an actual gift between people, not a purchase described as one. We are not going to tell you how to get an order relabelled, and a false declaration is a customs offence that puts the parcel and the person who signed for it at risk rather than saving the duty.",
        takes: "—",
      },
      {
        title: "Know that some parcels now need a heavier kind of entry",
        body: "CBP's new postal informal entry process is limited to articles classifiable in chapters 1 to 97 of the US tariff schedule. Merchandise that carries additional duties under chapter 99, or is subject to quota, antidumping or countervailing duty orders, or needs Partner Government Agency data, or claims duty-free treatment under chapter 98 or a free trade agreement, requires formal entry instead. CBP delayed the compliance date for part of that requirement to 22 October 2026. For an album or a lightstick none of this normally bites, but it is the reason an unusual item can suddenly need a broker.",
        pitfall:
          "Assuming every small parcel gets the light-touch process. The category of the goods decides, not the price.",
        takes: "—",
      },
      {
        title: "Expect your parcel to carry far more data than it used to",
        body: "The new process runs on a dataset, and knowing what is in it explains most delays. The filer has to obtain and transmit a filer code and bond number, a description of the merchandise, its country of origin, every applicable 10-digit tariff classification, the quantity or weight where a specific duty rate is used, the duty rate, the value, the total duty owed, the carrier and conveyance, the tracking number generated by the foreign postal operator, and the arrival port and date — reported to CBP by the seventh day of the month after the parcel arrives. A vague or wrong description is now a missing field in somebody's return.",
        pitfall:
          "Asking a seller to write something non-committal on the declaration to be safe. Non-committal is exactly what the new process cannot process, and it is the surest way to have a parcel held.",
        takes: "—",
      },
      {
        title: "Keep your own paperwork, because you are the one who gets asked",
        body: "Under either shape, the person who can resolve a query about your parcel is you. Keep the order confirmation showing what you paid, including shipping, and keep the tracking number the Korean sender generated, since that is the field the entry is keyed on. If duty is charged on a value that does not match what you paid, that confirmation is the only document that settles it — and if your platform prepaid, keep the checkout receipt showing the tax line, because a second demand on arrival is a thing to dispute rather than pay twice.",
        pitfall:
          "Deleting the order email once the parcel ships. It stops being proof of purchase at the moment it becomes proof of value.",
        takes: "2 minutes per order",
      },
      {
        title: "Re-check this before a big order, and do not trust an undated guide",
        body: "Everything above is dated on purpose. This area moved three times inside eighteen months — a suspension in August 2025, a continuation in February 2026, regulations in June and July 2026, a statutory termination landing in July 2027 — and the EU's change arrived in the middle of it. Any English guide that tells you orders under 800 dollars arrive duty-free is describing the world before 29 August 2025, and the way to tell is that it carries no date at all. Check the date on this page too.",
        pitfall:
          "Planning a comeback-week group order against a rule you last checked last year. The number you need is the one in force on the day the parcel arrives, not the day you ordered.",
        takes: "10 minutes before a large order",
      },
    ],
    faq: [
      {
        q: "Is there still any amount I can order duty-free into the US?",
        a: "Not for a commercial purchase. The 800-dollar de minimis exemption has been suspended since 29 August 2025, CBP wrote the suspension into its postal regulations effective 24 July 2026, and Congress terminated the exemption outright effective 1 July 2027. Two narrower exemptions are untouched: bona fide gifts of 100 dollars or less sent person to person, and 200 dollars of personal or household articles accompanying a traveller.",
      },
      {
        q: "Why does my Weverse Shop order suddenly show tax at checkout?",
        a: "Weverse changed this on 3 February 2026. Its notice says taxes are now calculated from the final shipping or billing address at checkout, that prices for orders shipped outside Korea display tax-exclusive where they previously displayed tax-inclusive, and that duties and taxes are prepaid at checkout for some countries instead of collected on delivery. The total you see is closer to the real landed cost than it used to be.",
      },
      {
        q: "So do I pay at checkout, or when it arrives?",
        a: "Whichever your seller arranged. Where duty is prepaid you pay at checkout. Otherwise it is collected before you take possession — historically, for mail valued at 2,500 dollars or less, CBP prepared the entry and the recipient paid at the local post office. The duty is the same; only the moment differs.",
      },
      {
        q: "A friend in Korea wants to post me a present. Is that taxed now?",
        a: "CBP's rule explicitly leaves the gift exemption alone: a bona fide gift of 100 dollars or less, sent from a person abroad to a person in the United States, is still duty-free, and 200 dollars applies from certain island possessions. The statutory word is bona fide, so it has to be an actual gift rather than a purchase of yours in a different envelope.",
      },
      {
        q: "Can I ask the seller to mark it as a gift or write a lower value?",
        a: "No, and this page will not help with it. A false declaration is a customs offence, the exposure lands on the parcel and on the person it is addressed to, and the new postal process is built around matching declared values and tariff codes — so an invented one is more likely to get the parcel held than to save the duty. If the duty makes an order not worth it, the answer is not to place the order.",
      },
      {
        q: "What about the EU, or the UK?",
        a: "The EU removed the de minimis exemption for most low-value goods on 1 July 2026 and added a hierarchy for who pays, as the US Postal Service records in its own October 2026 rule — and some EU postal operators now require delivered-duty-paid shipping. We have not written the UK up because we could not read a primary source for it from here, and we are not going to summarise a tax rule from memory. Treat your own customs authority as the authority.",
      },
      {
        q: "My parcel is being held and nobody will say why.",
        a: "The likeliest causes are now structural rather than random. The new process needs a description, a country of origin, 10-digit tariff codes and a value that agree with each other; a parcel whose paperwork is vague or inconsistent is a parcel somebody cannot file. Some categories also need formal entry rather than the postal informal process. Your order confirmation and the sender's tracking number are the two documents that resolve most of it.",
      },
      {
        q: "Will any of this go back to how it was?",
        a: "The exemption itself will not. It is suspended now and terminated by statute from 1 July 2027, and CBP states it issued its postal rule under its own authority independently of the executive orders — so even a successful challenge to those would not restore duty-free entry on its own. What can still change is the mechanics: who files, who collects, and whether your platform prepays.",
      },
    ],
    sources: [
      {
        label:
          "CBP — Indefinite Suspension of the De Minimis Exemption for Mail Shipments and New Postal Informal Entry Process, 91 FR 37801 (24 June 2026, effective 24 July 2026)",
        url: "https://www.govinfo.gov/content/pkg/FR-2026-06-24/html/2026-12669.htm",
      },
      {
        label:
          "CBP — Indefinite Suspension of the De Minimis Exemption for Merchandise Arriving Through All Modes Other Than the International Postal Network, 91 FR 37789",
        url: "https://www.govinfo.gov/content/pkg/FR-2026-06-24/html/2026-12670.htm",
      },
      {
        label:
          "USPS — Customs Requirements and Payment Procedures, 91 FR 66000 (effective 19 October 2026), which states the EU removed its low-value exemption on 1 July 2026",
        url: "https://www.govinfo.gov/content/pkg/FR-2026-10-19/html/2026-21310.htm",
      },
      {
        label: "Weverse Shop — payment and customs service update, effective 3 February 2026",
        url: "https://shop.weverse.io/en/notices/12149",
      },
    ],
  },
  {
    slug: "nol-world-booking-fees-and-checkout-clock",
    ko: "수수료",
    art: "guide-card",
    name: "Fees and the clock",
    koLine: "예매수수료와 결제 시간 — 8천원, 10분, 7분",
    title: "NOL World checkout: the booking fee, the clock, and the currency you pay in",
    summary:
      "A concert ticket carries an 8,000 won service fee, you get ten minutes to choose seats and seven to pay, and the payment window asks you to pick a currency. Three money decisions and one timer, all of them published and none of them obvious.",
    glyph: "card",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers what NOL World publishes about the cost and the timing of its checkout: the service fee by genre, the two-stage purchase timer, the currency selection, coupons, and per-order limits. Fees and timers can be set per event and NOL World says so in both cases, so your event page overrides this. Nothing here is advice on which currency is cheaper for your particular card.",
    readMinutes: 7,
    platforms: ["NOL World"],
    intro: [
      "Most of what goes wrong at a Korean checkout is not the card. It is that the page is asking three questions with money attached and a timer running, and an overseas buyer meets all of it for the first time with about seven minutes left.",
      "All of it is published, and none of it is on the product page where you decided the ticket was affordable. So the point of this page is to move the surprises to the week before.",
    ],
    steps: [
      {
        title: "Add the service fee before you decide the ticket is affordable",
        body: "NOL World publishes its service fee by genre. Musicals and concerts carry 8,000 won — excluding certain products such as online concerts and fan club memberships. Other performances and sports are 3,000 won. Leisure and exhibitions are free. NOL World also says fees may vary by product and to check when purchasing, so treat these as the published baseline rather than a promise about your event.",
        pitfall:
          "Comparing a Korean ticket price against a ticket price at home and forgetting this sits on top. It is not large, and it is the kind of small surprise that makes a whole platform feel untrustworthy at the worst moment.",
        takes: "2 minutes",
      },
      {
        title: "Know what the fee is actually buying, because one line of it matters",
        body: "NOL World itemises what the service fee covers: website maintenance and related costs, payment processing that supports its fraud detection system, technology fees for preventing bot and macro-related fraudulent bookings, and system support for global reservations. That third item is the interesting one. The fee is partly funding the anti-macro machinery, which is the same enforcement direction as the identity checks and the revised Performances Act — and it is why the queue behaves like an adversarial system rather than a line.",
        pitfall:
          "Reading the fee as pure margin and the queue as incompetence. The platform is telling you it is spending the fee on keeping automated buyers out, which is also why the rules it imposes on you are strict.",
        takes: "2 minutes",
        see: {
          slug: "nol-world-queue-and-seat-selection",
          text: "How that anti-automation stance shows up in the queue itself",
        },
      },
      {
        title: "Understand the clock: ten minutes to choose, seven to pay",
        body: "The purchase timer is two stages and NOL World states both. From entering the booking page you have up to ten minutes to select seats. Once you move to the price step your seats are held for seven minutes while you complete payment, with a timer at the top of the page. Miss it and the seats are automatically released and you start the booking again. Unassigned or general admission bookings still get the ten-minute limit before payment. NOL World adds that limits can vary by event and that some events have none.",
        pitfall:
          "Opening your banking app to find a card number inside the seven minutes. Card details, billing address and your bank's approval app should all be ready before you enter the booking page, because the clock does not care that your phone is asking you to log in again.",
        takes: "17 minutes, if you use all of it",
      },
      {
        title: "Treat the currency question as a real decision",
        body: "NOL World supports payment in 24 currencies including Korean won, US dollars, yen and yuan, and the available ones appear after you enter your card details. The choice it offers is between the currency of your card's issuing country and Korean won. That is two different exchange rates set by two different parties — one by whoever converts at the payment page, one by your card network and issuer. We are not going to tell you which is cheaper for your card, because it depends on your issuer's margin and fees. What you can do is find out your issuer's foreign-transaction terms before the day, since that is the half you are able to check in advance.",
        pitfall:
          "Picking your home currency on reflex because the number looks familiar. Familiar is not the same as cheaper, and this is the one screen where you choose who does the conversion.",
        takes: "10 minutes, with your bank, beforehand",
        see: {
          slug: "nol-world-cancel-ticket-refund",
          text: "Why the same exchange-rate question comes back if you ever cancel",
        },
      },
      {
        title: "Apply the coupon before you pay, because there is no afterwards",
        body: "NOL World is direct about this: once payment is completed you cannot apply a coupon. The only route it offers is to cancel the same seat and rebook with the coupon applied — and it warns that cancelling and rebooking may incur fees under the event's own fee policy, so check those first. Weigh that honestly against the coupon's value, and remember the seat you release is not reserved for you while you rebook.",
        pitfall:
          "Cancelling a seat you actually have, to save a discount you might not get to use. The coupon is worth less than the ticket, and the inventory does not wait.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-cancel-ticket-refund",
          text: "What cancelling and rebooking actually costs",
        },
      },
      {
        title: "Expect a ticket limit, and expect it to be the organiser's",
        body: "NOL World says that depending on the organiser there may be a limit on how many tickets can be reserved per order or per member for a given performance — and that where concert tickets are sold combined with a tour or other admission tickets, the organiser may also impose a per-member limit. So the ceiling is not a platform-wide number you can look up; it is set per show, sometimes per person rather than per transaction, and it is a reason a group order can fail at the last step.",
        pitfall:
          "Planning a four-person order around a limit you read on another show. A per-member limit cannot be solved by splitting the order across your own accounts either — that pattern is on NOL World's published list of fraudulent use.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-verified-member-ekyc",
          text: "Why spreading an order across accounts is the wrong fix",
        },
      },
      {
        title: "Confirm the booking exists, in the place that shows status",
        body: "After payment, open the NOL World website or app and go to Account/My, then My Reservations. NOL World says basic reservation details and status are visible both in the list and on the booking detail page. Do that once while you are still at a desk rather than assuming the confirmation email is the whole truth — the reservation list is where a status that is not what you expected shows up, and it is the screen you will be asked about if you contact support.",
        pitfall:
          "Treating a payment that went through as a booking that exists. They are usually the same thing and the whole point of checking is the time they are not.",
        takes: "2 minutes",
      },
      {
        title: "Know what finished means for the thing you bought",
        body: "For performing arts and concerts, NOL World says the process is complete at payment and you collect at the venue box office. Tour and activity products are not uniform: some issue a QR or barcode to your My Page or email that admits you directly, and some require you to present the voucher or booking confirmation at an on-site counter to exchange for a physical ticket before entry. NOL World's instruction is to check the product page for which one applies, because the difference decides whether you need to find a counter before the entrance.",
        pitfall:
          "Assuming a QR code in your email is an entry pass. For an exchange-type product it is the thing you swap at a counter, and the counter has opening hours.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-mobile-ticket-and-entry",
          text: "The mobile ticket and the gate itself",
        },
      },
    ],
    faq: [
      {
        q: "How much is the booking fee on a concert ticket?",
        a: "NOL World publishes 8,000 won for musicals and concerts, excluding certain products such as online concerts and fan club memberships; 3,000 won for other performances and sports; and nothing for leisure and exhibitions. It also says fees may vary by product and to check at purchase, so confirm on your own event.",
      },
      {
        q: "How long do I actually have at checkout?",
        a: "Ten minutes to select seats from entering the booking page, then a seven-minute hold while you pay, with a timer shown at the top. Exceed it and the seats are released and you start over. General admission still gets the ten minutes. NOL World says the limits can vary by event and that some events have none.",
      },
      {
        q: "Should I pay in Korean won or my own currency?",
        a: "NOL World offers both — it supports 24 currencies and lets you choose between your card's issuing-country currency and Korean won, with the options shown after you enter your card details. Which is cheaper depends on your card issuer's exchange margin and fees against whatever rate the payment page applies, and we are not going to guess that for your card. Ask your issuer about its foreign-transaction terms before the day, because that is the side you can check in advance.",
      },
      {
        q: "I forgot to use my coupon. Can I add it now?",
        a: "No. NOL World says a coupon cannot be applied once payment is complete. The only route it gives is cancelling the same seat and rebooking with the coupon, and it warns that cancellation and rebooking may carry fees under the event's policy. Check the fee before you release a seat you already hold.",
      },
      {
        q: "Why can I only book two tickets when my friend booked four?",
        a: "Because the limit belongs to the organiser, not the platform. NOL World says a performance may limit tickets per order or per member, and that combined concert-plus-tour products may carry a per-member limit as well. A different show, or a different sale round, can have a different ceiling.",
      },
      {
        q: "Can I use a Korean credit card on NOL World?",
        a: "No. NOL World accepts only cards issued outside Korea; Korean-issued cards belong to verified domestic members on the Korean site. A Korean card refused here is the rule working, not a fault.",
      },
      {
        q: "Where do I check that my booking went through?",
        a: "The NOL World site or app, under Account/My then My Reservations. NOL World says reservation details and status appear both in the list and on the detail page. That screen, rather than the confirmation email, is what shows status.",
      },
      {
        q: "I have paid. Is there anything left to do before the show?",
        a: "For a concert or performing-arts ticket, no — NOL World says the process is complete and you collect at the venue box office. For a tour or activity product it depends: some send a QR or barcode that admits you directly, others need the voucher exchanged for a physical ticket at an on-site counter first. The product page says which.",
      },
    ],
    sources: [
      {
        label:
          "NOL World — FAQ: service fees by genre, purchase time limits, accepted currencies and cards, coupons, ticket quantity limits and post-booking steps",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
];

/**
 * A cross-link that points nowhere renders nothing, which is the quiet kind of
 * breakage — nobody notices a link that was never there. Checked here, at
 * module scope, so a mistyped slug fails the build instead.
 */
for (const guide of guides) {
  for (const step of guide.steps) {
    if (step.see && !guides.some((g) => g.slug === step.see!.slug)) {
      throw new Error(
        `${guide.slug} → step "${step.title}" links to an unknown guide: ${step.see.slug}`,
      );
    }
    if (step.see?.slug === guide.slug) {
      throw new Error(`${guide.slug} → step "${step.title}" links to itself`);
    }
    // A paid link pointing at a partner that is not on the public register
    // would be an undisclosed paid link, which is the one failure here that
    // is not recoverable. Fail the build rather than ship it.
    if (step.partner && !partners.some((x) => x.id === step.partner!.id)) {
      throw new Error(
        `${guide.slug} → step "${step.title}" has a paid link to an unknown ` +
          `partner: ${step.partner.id}. Every paid link must be declared in ` +
          `content/affiliates.ts, which is what /editorial-policy publishes.`,
      );
    }
  }
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const platformList: { ko: string; name: string; note: string }[] = [
  {
    ko: "위버스",
    name: "Weverse",
    note: "HYBE's own community and ticketing platform",
  },
  {
    ko: "놀 월드",
    name: "NOL World",
    note: "Overseas-facing — renamed from interpark Global, Dec 2025",
  },
  {
    ko: "놀 티켓",
    name: "NOL Ticket",
    note: "Korean-language — renamed from Interpark Ticket, Apr 2025",
  },
  {
    ko: "예스24",
    name: "YES24 Global",
    note: "Used for a range of Korean tours",
  },
  {
    ko: "멜론티켓",
    name: "Melon Ticket",
    note: "Also appears in Korean tour announcements",
  },
];

/**
 * The words a fan will actually read on a Korean booking screen. This is the
 * most immediately useful Korean content the site can carry, which is why the
 * Hangul here is content rather than decoration.
 */
export const glossary: { ko: string; en: string }[] = [
  { ko: "본인인증", en: "Identity verification" },
  { ko: "선예매", en: "Presale" },
  { ko: "예매", en: "Booking" },
  { ko: "좌석 선택", en: "Seat selection" },
  { ko: "결제", en: "Payment" },
  { ko: "매진", en: "Sold out" },
  { ko: "현장 수령", en: "Collect at venue" },
  { ko: "해외 발행 카드", en: "Overseas-issued card" },
  { ko: "취소", en: "Cancelled" },
];

/** Hangul consonants used to index the steps of a flow. */
export const jamo = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"];
