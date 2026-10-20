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
        body: "Payment with an overseas-issued card commonly depends on your account having been verified as an overseas customer first, which typically means submitting passport information and waiting for it to be processed. Processing is not instant. Do this days ahead of any sale you care about.",
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
        body: "Where collection requires identity confirmation, the document generally has to be the one the booking was made under. If you booked on your passport, bring that passport — not a driving licence, not a photo of it.",
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
        body: "A second card from the same issuer will usually fail for the same reason. A different issuer, a different network, or the platform's supported alternative method if it offers one, is a real backup.",
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
