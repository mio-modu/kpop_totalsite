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
import { reports, reportCount } from "./reports";

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

/**
 * A document from somebody else, reproduced on the page.
 *
 * Everything else pictured on this site was drawn or rendered for it, which
 * is the artwork rule and is about portrait and copyright risk. This is the
 * deliberate exception and it needs its own rules, because the risk is a
 * different one: an authoritative document is worth reproducing exactly, and
 * reproducing somebody else's work exactly is only allowed on terms.
 *
 * So the terms are data rather than a thing somebody remembers — the same
 * shape as the paid-link register and for the same reason. A reproduced
 * document that cannot name its licence and its source does not render, and
 * the check at the bottom of this file fails the build rather than letting it
 * ship with the credit missing from exactly the page that gets screenshotted.
 *
 * `upstream` is the file at the operator's own address, and it is separate
 * from `sourceUrl` on purpose: the page can stay up while the image under it
 * is replaced. `scripts/watch.mjs` fingerprints that file by hash, because the
 * fingerprinting everywhere else in this repo compares visible text and would
 * see nothing at all here. The failure it prevents is this site's own premise
 * turned against it — a stale copy of an official document, served with
 * confidence, which is precisely what the guides this site replaces are.
 */
export type ReproducedDocument = {
  /** Path under public/, served as-is so the original stays downloadable. */
  file: string;
  width: number;
  height: number;
  /** Written here, in English. The source's own alt text is Korean. */
  alt: string;
  /** One line saying what the document is. */
  caption: string;
  /** Who made it. Required by every licence worth reproducing under. */
  credit: string;
  /** The licence, named the way the licence names itself. */
  licence: string;
  licenceUrl: string;
  /** The page it was published on, which must be among the guide's sources. */
  sourceUrl: string;
  /** The file itself at the operator's address. Watched by hash. */
  upstream: string;
  /** The day this copy was taken. */
  taken: string;
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
  /**
   * What goes above the scope box, in place of the booking-screen graphic.
   *
   * Every guide used to get the same three stacked booking screens, with a
   * caption about a name that does not match the fan club record. That is the
   * right graphic for the eleven guides about buying something and the wrong
   * one for a guide about a building: a reader who came to find block 417 was
   * shown a payment screen and a warning that has nothing to do with the page
   * they are on. A guide that sets this renders its own diagram instead.
   *
   * It is deliberately a small closed union rather than a component slot,
   * because the content layer is data and stays data — the mapping from this
   * key to a component lives in the route that renders it.
   */
  diagram?: "gocheok-bowl";
  /** An official document reproduced on the page, under a named licence. */
  document?: ReproducedDocument;
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
        see: {
          slug: "ticketlink-global-ticketing-guide",
          text: "If it names TicketLink, none of the usual three apply",
        },
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
        see: {
          slug: "nol-world-queue-and-seat-selection",
          text:
            "What the queue does when you refresh it, and what a second device costs you.",
        },
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
        url: "https://concert.weverse.io/",
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
        see: {
          slug: "nol-world-play-stay-package",
          text:
            "None of this applies if you bought a Play&Stay package — those tickets are handed to you at the hotel desk, not the box office, and the window is a different one.",
        },
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
        q: "Is NOL Global the same thing? What about NOL Korea?",
        a: "Those are the names people reach for when they half-remember the rename, and they are worth saying out loud because they are what gets typed. There are two sites: NOL World, the overseas-facing one, which was interpark Global until 1 December 2025; and NOL Ticket, the Korean-language one, which was Interpark Ticket until April 2025. If you were sent to \u0022NOL Global\u0022, \u0022NOL Korea\u0022 or \u0022NOL KR\u0022, the site you are looking for is almost certainly NOL World.",
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
        see: {
          slug: "weverse-membership-renewal-overseas",
          text:
            "Auto Payment is summarised here and set up elsewhere: the currency rule, the hour it charges and the point after which reactivation is gone are in the membership renewal guide.",
        },
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
        url: "https://concert.weverse.io/",
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
    lastChecked: "2026-10-21",
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
        see: {
          slug: "weverse-shop-vs-ktown4u",
          text: "The two shops most readers are choosing between, side by side",
        },
      },
      {
        title: "Check whether the seller reports to the Korean charts",
        body: "Hanteo publishes the list, so this is checkable rather than a matter of trust. Its certified Family stores are searchable at hanteochart.com in English and Spanish as well as Korean, each carrying a family code: Ktown4U is HF0082KTU001 and Weverse is HF0082BTS001. Hanteo also requires every online Family store to display the Family mark in its footer, linked back to hanteochart.com — so the footer is the thirty-second check on any shop, and the register is the confirmation. Hanteo\u0027s own instruction to buyers is to check both the code and the certification mark, which is reissued each year.",
        pitfall:
          "The register lists most store names in Korean even on the English page, so a shop can be on it and look absent to a search in English. And a third-party marketplace listing of a genuine album is the common miss: the album is real, the seller is not a Family store, and the contribution is not there.",
        takes: "15 minutes",
        see: {
          slug: "ktown4u-ordering-shipping-and-fees",
          text: "One of the shops most international fans actually use, and what its notices say",
        },
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
        body: "Shipping from Korea can exceed the album price, and whether you pay import charges on top depends on your own country's rules. Check what those are now rather than assuming: the United States suspended its 800-dollar threshold in August 2025 and the EU removed its 150-euro one on 1 July 2026, so for readers in either, there is no longer a value small enough to arrive free. Group orders reduce per-item shipping. Work out the landed cost before you commit.",
        pitfall:
          "Planning around a duty-free allowance that no longer exists where you live. Where one does still exist, combining several albums into one parcel can push the declared value over it and cost more than shipping them separately — run both numbers.",
        takes: "20 minutes",
        see: {
          slug: "kpop-album-customs-duty-overseas",
          text: "What replaced those thresholds, with the dates and the rules",
        },
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
        a: "\u0022The Korean charts\u0022 is two different things and only one of them is about your purchase at all. Hanteo counts sales reported by its certified Family stores, so the shop decides rather than your location — check it against the register. Circle Chart is built the other way round: it defines its Album Chart as wholesale shipment units to retailers, minus returns, which means that album was counted when it left the distributor and your order does not move it. Circle runs a separate Retail Album Chart that does count retail sales, in real time. What neither publishes is a rule saying an overseas order from a listed store is treated the same as a domestic one, so buying from a listed shop is the furthest you can check, not a guarantee.",
      },
      {
        q: "Is a group order worth it?",
        a: "Usually yes for shipping, because the per-item cost drops sharply. Weigh it against your country's import rules — where a duty-free allowance still exists, a single high-value parcel can attract charges that separate smaller ones would not. In the United States and the EU that calculation has changed: both removed their low-value exemptions, so there is no threshold left to stay under.",
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
      {
        label: "Hanteo Chart — certified Family stores, with each store\u0027s family code",
        url: "https://www.hanteochart.com/en/family/search",
      },
      {
        label: "Hanteo Chart — Family guide: online stores must show the mark in the footer",
        url: "https://www.hanteochart.com/en/family/guide",
      },
      {
        label: "Circle Chart — FAQ, including how each chart is counted",
        url: "https://circlechart.kr/page_community/faq.circle",
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
    lastChecked: "2026-10-21",
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
        body: "Your default currency decides which payment methods you are offered. Weverse states these per currency: USD gets PayPal, Eximbay, Alipay+, Apple Pay, WeChat Pay and Grab Pay. JPY gets the same list without Grab Pay. CNY drops PayPal. MXN is only PayPal and Apple Pay. KRW adds Korean cards and the Korean wallets — Toss, NAVER Pay, Kakao Pay, PAYCO. MXN is the shortest of the four non-Korean lists and the one worth planning around: two methods, both digital, no cash option. If neither is set up, there is no third button at checkout.",
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
        see: {
          slug: "weverse-data-leak-what-to-do",
          text:
            "Why a real payment request and a fake one now look alike, after the leak of Weverse purchase records",
        },
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
        q: "I am in Mexico. Which payment methods do I actually get?",
        a: "Two. Weverse's payment notice lists MXN as PayPal and Apple Pay — the shortest of the four non-Korean currency lists, and both of them digital. There is no cash option and no third button, so set one of the two up before a pre-order window rather than inside it.",
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
    lastChecked: "2026-10-21",
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
        body: "This is the whole guide in one line. Because Korea never shifts and you do, the local hour of a Korean sale depends on which side of your own daylight saving change the date falls on. At 20:00 KST, a sale lands at 06:00 in New York in January and 07:00 in July. Los Angeles moves 03:00 to 04:00, Toronto 06:00 to 07:00, London 11:00 to 12:00, Berlin, Madrid and Paris 12:00 to 13:00.",
        pitfall:
          "Converting in a search box today for a sale three weeks away. If a clock change falls in between, the answer you get is an hour wrong — and it is wrong in the direction of being late.",
        takes: "3 minutes",
      },
      {
        title: "If you are in Australia, the gap moves the other way",
        body: "Southern hemisphere daylight saving runs opposite to northern. At 20:00 KST a sale is 22:00 in Sydney in January and 21:00 in July — the gap narrows in the northern summer rather than widening. Santiago does the same, 08:00 in January and 07:00 in July, and it is the only capital in Spanish-speaking Latin America whose clocks move at all. Across a full year the Sydney offset swings an hour in the opposite direction to every North American and European figure above, so a conversion borrowed from a US fan is wrong by two hours.",
        pitfall:
          "Most guides for this are written for American readers. Australian and New Zealand fans inherit their arithmetic and arrive an hour or two late.",
        takes: "2 minutes",
      },
      {
        title: "Check whether a clock change falls between now and the sale",
        body: "The changeover dates are not the same in each country, which creates short windows where the usual conversion is wrong even between two countries that both observe it. In 2027 New York changes on 14 March, London on 28 March, Sydney on 4 April; Berlin, Madrid and Paris change with London and go back on 31 October. Most of Spanish-speaking Latin America does not change at all \u2014 Bogot\u00e1, Lima and Buenos Aires hold a fixed gap to Korea alongside Mexico City, as does Manila. For those readers this step simply does not apply, which is worth knowing in itself. If the sale date sits on the far side of your own changeover, set your alarm from the converted time for that date.",
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
        see: {
          slug: "gocheok-sky-dome-getting-there",
          text: "Why the nearest station is the slow one on a concert night",
        },
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
        body: "This is the whole guide in one step. NOL World states that the number of nights in a package cannot be modified, that the check-in and check-out dates specified in the package cannot be changed, and that hotel changes are not permitted. Nights cannot be added at purchase either — extra stays are a separate conversation with the hotel, at the hotel's price and subject to its availability. And one account can buy one item, so this is not a thing you stack. If the hotel will not take them, those nights stop being part of this booking at all and become an ordinary hotel reservation you make yourself.",
        pitfall:
          "Booking the package intending to tidy the details later: arrive a day early, move to a hotel nearer a friend, trim a night off the end. Every one of those is a documented no.",
        // The link sits on the one thing this step already sends a reader
        // away to do. NOL World's own answer is that the extra nights may
        // simply not be possible, which leaves the reader needing a room this
        // booking will never contain — a gap the guide created and did not
        // close.
        partner: { id: "klook", text: "Seoul hotels on Klook" },
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
        body: "This is the half that almost no English guide covers. As the US Postal Service records in its own October 2026 rulemaking, the European Commission eliminated the de minimis exemption for most low-value goods entering the EU customs territory as of 1 July 2026, and established a new hierarchical system for deciding who is responsible for paying duties, taxes and import fees on them. Weverse Shop puts a number on what went: orders under 150 euros were previously exempt, that exemption is gone, and duty now applies regardless of the purchase amount. It also names the basis, which matters more than the date itself — the change applies to shipments clearing local customs from 1 July 2026, by clearance date rather than order date. Some EU destination postal operators now require items to be sent on a delivered-duty-paid basis, and where an item arrives duty unpaid and the money cannot be recovered from the addressee, the destination operator may pursue the sender instead.",
        pitfall:
          "Reading US coverage and assuming Europe is unaffected, or vice versa. Both markets removed their low-value exemptions in 2026, and a guide that mentions only one is describing half the world. The clearance-date basis is the other trap: an order placed before 1 July 2026 that cleared after it was caught anyway.",
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
        a: "The EU removed the de minimis exemption for most low-value goods on 1 July 2026 and added a hierarchy for who pays, as the US Postal Service records in its own October 2026 rule — and some EU postal operators now require delivered-duty-paid shipping. Weverse Shop states the figure that went: the exemption had covered orders under 150 euros, and duty now applies whatever the amount, judged by the date a shipment clears local customs rather than the date it was ordered. We have not written the UK up because we could not read a primary source for it from here, and we are not going to summarise a tax rule from memory. Treat your own customs authority as the authority.",
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
      {
        label:
          "Weverse Shop — Notice Regarding New EU Customs Policy and Potential Import Duties, which gives the 150-euro figure and the clearance-date basis",
        url: "https://shop.weverse.io/en/notices/13627",
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
        body: "NOL World supports payment in 24 currencies including Korean won, US dollars, yen and yuan, and the available ones appear after you enter your card details. The choice it offers is between the currency of your card's issuing country and Korean won. That is two different exchange rates set by two different parties — one by whoever converts at the payment page, one by your card network and issuer. Choosing your own currency is dynamic currency conversion, and the party doing the converting sets the rate and takes a margin on it, so paying in won is usually the cheaper of the two. Usually, not always: your own card's foreign-transaction fee applies either way, and a poor issuer margin can close the gap. The half you can actually check before the day is your issuer's terms, so check those.",
        pitfall:
          "Picking your home currency because the number looks familiar. Familiar is the more expensive option here more often than not, and this is the one screen where you choose who does the conversion.",
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
        a: "Usually won. NOL World supports 24 currencies and lets you choose between your card's issuing-country currency and Korean won, shown after you enter your card details. Choosing your own currency is dynamic currency conversion, where the converting party sets the rate and adds a margin — so won is generally cheaper. Your card's own foreign-transaction fee applies either way, which is the part to check with your issuer before the day.",
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
  {
    slug: "nol-world-account-recovery-and-booking-errors",
    ko: "계정",
    art: "fan-kit",
    name: "Account and errors",
    koLine: "계정 찾기와 예매 오류 — 로그인 방식이 전부를 결정합니다",
    title: "Locked out of NOL World: finding the account, and fixing the page that will not open",
    summary:
      "Which login you used decides every recovery route, password reset exists only for email signups, and an unverified email can make an account hard to find at all. Plus the booking page errors that are not errors.",
    glyph: "id",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers account recovery, account deletion and the booking-page failures NOL World documents: browser and app requirements, the mobile seat map, and the pop-ups that look like faults. Queue mechanics are in their own guide. Nothing here helps anyone into an account that is not theirs.",
    readMinutes: 8,
    platforms: ["NOL World"],
    intro: [
      "Two things go wrong on a ticketing site that have nothing to do with tickets. You cannot get into the account, or the page simply will not do what it is supposed to do — and both happen on the morning of a sale, when there is no time to read anything.",
      "Almost all of it is decided by one choice you made months earlier without thinking: whether you signed up with an email address or with Google, Apple or Line. That single fact determines whether a password reset even exists for you, so it is the place to start.",
    ],
    steps: [
      {
        title: "Find out which login type you actually have",
        body: "NOL World accounts are created either with an email address or through a social login — Google, Apple or Line among others. The consequence is sharper than it sounds: NOL World states that password recovery is only available for users who signed up with an email address. If you used a social login there is no NOL World password to reset, because there was never one. Work out which you are now, while nothing is urgent.",
        pitfall:
          "Assuming you have an email account because you remember typing an email address. A social login shows your email too, and the recovery routes are completely different.",
        takes: "5 minutes",
      },
      {
        title: "Verify your email, because this is the one that cannot be undone",
        body: "NOL World's own closing line on account recovery is the most important sentence in this area: it may be difficult to find accounts which were not verified via email. Everything else here is a procedure with an outcome. This one is a door that may simply not open — support is matching you to a record, and an unverified email is the strongest match they have. If you are reading this with an account that works, check that the email on it is verified and leave it verified.",
        pitfall:
          "Skipping the verification mail at signup because you were in a hurry to reach a sale. It costs nothing on the day and it is the difference between a recoverable account and a lost one.",
        takes: "3 minutes, now",
      },
      {
        title: "For a social login, look on the provider's side first",
        body: "If you cannot remember whether you ever had a NOL World account, the provider knows. NOL World publishes where to look: in Google, under Google Account then Security then your connections to third-party apps and services. In Apple, under Settings, your name and Apple ID, then Sign-In & Security, then Sign in with Apple. In Line, under Settings then Account then Authorized apps. If NOL World is listed there, the account exists and you know which provider opens it.",
        pitfall:
          "Trying each social button in turn on the login page to see which one works. That can create a second account rather than finding the first, and now there are two — one of which holds your bookings.",
        takes: "10 minutes",
      },
      {
        title: "If that fails, send support the five things it asks for",
        body: "NOL World will search for an account, and it names what it needs: the email address you may have used, the login type (Google, Line, Apple or email), your nickname, and the type of products you booked together with the reservation numbers. It also tells you where to find that last one — the reservation number is in the email voucher sent at the time of booking. Gather all of it before you write, because a request missing the reservation number is a request asking them to guess.",
        pitfall:
          "Deleting old booking confirmation emails as clutter. They hold the reservation numbers, which are the strongest identifier you can offer when the account itself is the thing you have lost.",
        takes: "20 minutes",
      },
      {
        title: "A new phone does not lose your bookings — a different account does",
        body: "This is the most common false alarm and NOL World answers it plainly: changing your phone or logging in again does not erase your history. What it asks you to check is whether you are logged in with a different account from the one you originally used. That is almost always the real cause, and social login is why — a fresh phone offers whichever provider is most convenient, and tapping the wrong one lands you in an empty but perfectly valid second account.",
        pitfall:
          "Concluding the booking is gone and re-buying. The tickets are in the other account, and the second purchase is a real purchase.",
        takes: "5 minutes",
      },
      {
        title: "Use a browser the booking page expects, and only the official channels",
        body: "NOL World says it builds to web standards and recommends Google Chrome or Microsoft Edge on both desktop and mobile. If the booking window will not open its instruction is specific: update the browser to the latest version, clear the cache, and try again. For the app, update it from the App Store or Google Play. And it states where tickets can be bought at all — the NOL World website at world.nol.com/ticket and the NOL World app, and nowhere else.",
        pitfall:
          "Troubleshooting on a browser that was never supported, in an in-app webview opened from a social media link. Open the booking page in Chrome or Edge directly before you conclude the site is broken.",
        takes: "15 minutes, the day before",
      },
      {
        title: "If the seat map will not work on mobile web, switch to the app",
        body: "There is a documented device problem rather than a general one. NOL World says that on some devices the mobile web environment enlarges the browser when you zoom in and out, which makes seat selection impossible — and that the route through it is to download the NOL World app. It names the device confirmed so far: the Galaxy Fold. If you are on a folding or unusually proportioned screen, install the app before the sale instead of discovering this inside a seven-minute payment window.",
        pitfall:
          "Pinching to zoom on a seat map to find a specific seat. On the affected devices that gesture is the thing that breaks selection.",
        takes: "10 minutes, in advance",
        see: {
          slug: "nol-world-booking-fees-and-checkout-clock",
          text: "The seven minutes you do not want to spend installing an app",
        },
      },
      {
        title: "Know which pop-ups are not faults",
        body: "Two messages read like errors and are not. NOL World says the pop-up telling you this seat has already been selected appears when you choose the same seat at around the same moment as another user — nothing is wrong with your session, somebody was a second faster. And it says available seats update automatically without refreshing, so a seat map that looks frozen is usually a seat map that is working. Treat both as information rather than as something to fix.",
        pitfall:
          "Reloading the page to clear a pop-up. On a queued sale that is the one action that costs you your place.",
        takes: "—",
        see: {
          slug: "nol-world-queue-and-seat-selection",
          text: "Why refreshing is the expensive reflex here",
        },
      },
      {
        title: "Read the multiple-tabs advice against the fraud policy",
        body: "NOL World asks for one device per account, and says simultaneous access from multiple devices on the same account may restrict your booking. It then gives technical advice for people booking simultaneously — that multiple tabs cause session conflicts, and to use completely separate browsers such as Chrome and Edge, or different devices. Read that carefully, because its own anti-fraud policy lists booking across accounts using identical or similar personal information as fraudulent use. The safe reading of the advice is about separate platforms: NOL World in one browser while another ticketing site runs in another. It is not permission to run several of your own accounts at once.",
        pitfall:
          "Taking a session-conflict tip as a sanctioned strategy for multiple accounts. The pages sit awkwardly together, and the one with published penalties attached is the fraud policy.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-verified-member-ekyc",
          text: "What the anti-fraud policy actually lists, and what it costs",
        },
      },
      {
        title: "If you delete the account, know exactly what goes and what stays",
        body: "Deletion is irreversible and NOL World itemises it. Deleted: your account and profile information, your reservation history, your trips, and your list of liked places. Retained: reviews and photos you left for a place. On the website any login method can delete the account. In the app with an email login the path is My Account, Settings, Delete Account, then your password; with a social login it is the same path but you verify through Google, Line or Apple instead. Two things from elsewhere in its documentation belong next to this: deleting erases your identity verification and frees it for another account, and an account restricted for misuse cannot be deleted at all.",
        pitfall:
          "Deleting an account to clear a problem with it. A restricted account cannot be deleted, and a verified one takes your verification with it — the reservation history goes and the reviews do not.",
        takes: "—",
        see: {
          slug: "nol-world-verified-member-ekyc",
          text: "What deletion does to a completed identity verification",
        },
      },
    ],
    faq: [
      {
        q: "I cannot remember my password. How do I reset it?",
        a: "Only if you signed up with an email address — NOL World says password recovery is available for email signups only. The path is the login screen, Find Password, enter the signup email, then follow the reset link that arrives. If you used Google, Apple or Line there is no NOL World password; you sign in through the provider.",
      },
      {
        q: "I do not even know which account I used.",
        a: "Check the provider side first. NOL World publishes the paths: Google Account then Security then your connections to third-party apps and services; Apple's Settings then your Apple ID then Sign-In & Security then Sign in with Apple; Line's Settings then Account then Authorized apps. If NOL World appears, that is the account.",
      },
      {
        q: "None of that worked. Will support find it?",
        a: "They will look, with what you give them: the email you may have used, the login type, your nickname, and the types of product you booked with their reservation numbers — which NOL World says are in the email voucher sent when you booked. It also warns that accounts never verified by email may be difficult to find, so send everything you have.",
      },
      {
        q: "I changed phones and my bookings are gone.",
        a: "They are almost certainly not. NOL World says changing phone or logging in again does not erase history, and asks you to check whether you are signed in with a different account from the original. With social login that is easy to do by accident — a new phone offers the most convenient provider, not necessarily the one you used.",
      },
      {
        q: "The booking window will not open at all.",
        a: "NOL World's own steps: use a standard browser, and it names Chrome and Edge; update it to the latest version; clear the cache; try again. For the app, update to the latest version from the App Store or Google Play. It also states that tickets can only be bought on world.nol.com/ticket or in the NOL World app.",
      },
      {
        q: "I cannot select a seat on my phone's browser.",
        a: "There is a known device issue. NOL World says that on some devices zooming in and out enlarges the whole mobile browser, which makes seat selection impossible, and that the answer is to use the NOL World app. The device it names as confirmed is the Galaxy Fold. Install the app ahead of the sale rather than during it.",
      },
      {
        q: "Can I open two tabs to improve my chances?",
        a: "No, and NOL World asks for one device per account — it says simultaneous access from multiple devices on the same account may restrict your booking. Its advice about separate browsers is about session conflicts when you are genuinely using two different ticketing platforms, not an endorsement of running several of your own accounts. Booking across accounts on similar personal details is on its published fraudulent-use list.",
      },
      {
        q: "What happens to my data if I delete my account?",
        a: "NOL World says deletion cannot be undone, and lists what goes: account and profile information, reservation history, trips, and liked places. Reviews and photos you left for a place are retained. Elsewhere it says deleting also erases your identity verification, freeing it for another account, and that an account restricted for misuse cannot be deleted.",
      },
    ],
    sources: [
      {
        label:
          "NOL World — FAQ: account recovery and social logins, password reset, missing booking history, account deletion, browser and app requirements, and mobile seat selection",
        url: "https://world.nol.com/en/my-info/faqs",
      },
      {
        label: "NOL World — customer support inquiry form, used for account searches",
        url: "https://world.nol.com/en/my-info/inquiries/new",
      },
      {
        label: "NOL World — the overseas-facing ticketing site",
        url: "https://world.nol.com/en/ticket",
      },
    ],
  },
  {
    slug: "weverse-shop-shipping-delays-and-cancellation",
    ko: "배송",
    art: "pc-foil",
    name: "Shipping and delays",
    koLine: "위버스샵 배송 지연과 주문 취소 — 상태가 바뀌면 끝입니다",
    title: "Why your Weverse Shop order is late, and when you can still cancel it",
    summary:
      "The cancel button disappears on a status change rather than a deadline, the EU scrapped its 150-euro duty-free limit, the US added a second inspection regime on top of the duty one, and a Korean holiday has a cutoff measured to the minute.",
    glyph: "parcel",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers what happens after a Weverse Shop order is placed, from Weverse Shop's own notices: the cancellation window, the customs changes it has warned about for the EU and US, holiday and logistics delays, and who you are actually buying from. Holiday dates are 2026's and will be wrong next year — the notices page is the live version. Ordering itself has its own guide.",
    readMinutes: 8,
    platforms: ["Weverse"],
    intro: [
      "Weverse Shop publishes a steady stream of notices about deliveries, and almost nobody reads them until a parcel is late. They are where the real answers live: which customs change applies to you, which holiday ate four days, and the exact minute an order stopped being cancellable.",
      "This is that stream, read in one go. Two of the items below are genuinely new rules rather than seasonal delays, and one of them is the moment your money stops being refundable.",
    ],
    steps: [
      {
        title: "Know that the cancel window closes on a status, not a clock",
        body: "This is the fact worth knowing before anything goes wrong. Weverse Shop gives the cancellation path as the Weverse app, then More, then My Orders, then Order Details, then Cancel Order — and states that once your order status changes to Shipping Soon or In Transit, you will not be able to cancel the order. There is no stated grace period and no hours-after-ordering rule. The window is open until a warehouse changes a status, which can happen sooner than you expect on a popular release.",
        pitfall:
          "Deciding overnight whether to keep an impulse pre-order. The deadline is not a time you can look up — it is an event you do not control, and it can pass while you sleep.",
        takes: "5 minutes, immediately",
      },
      {
        title: "If you are in the EU, the 150-euro exemption is gone",
        body: "Weverse Shop's own notice is specific where general coverage is vague. From 1 July 2026 the EU revised its rules for low-value imports: previously orders under 150 euros were exempt from customs duties, and that exemption has been eliminated, so duties now apply regardless of the purchase amount. The detail that matters most is the basis — Weverse says it applies to shipments clearing local customs from 1 July 2026, by local clearance date rather than order date. An order placed before the change can still be caught by it.",
        pitfall:
          "Assuming a small order is too cheap to be dutiable. There is no longer a floor, and the date that decides it is one you cannot see from the order page.",
        takes: "10 minutes",
        see: {
          slug: "kpop-album-customs-duty-overseas",
          text: "The rules behind this, in both the US and the EU",
        },
      },
      {
        title: "Expect customs, or the courier, to ask you for money directly",
        body: "Weverse Shop says EU orders may incur duties during local clearance, that you may receive separate payment instructions from local customs or the courier, and that failure to pay those duties may delay or prevent delivery. That is a different experience from a charge at checkout: a message arrives from a company you have no relationship with, asking for money before a parcel you already paid for will move. It is not a scam by default — but it is also exactly what a scam imitates, so check the tracking number against your order rather than following a link in the message.",
        pitfall:
          "Ignoring a customs or courier payment request as phishing and letting the parcel sit. Non-payment is one of the documented ways an order simply never arrives.",
        takes: "—",
      },
      {
        title: "If you are in the US, know there are two separate changes, not one",
        body: "The duty change gets all the coverage and it is not the only thing slowing US parcels. Weverse Shop warns separately that from 8 July 2026 the US Consumer Product Safety Commission enforces a mandatory eFiling policy, bringing stricter local customs inspections on all goods imported into the US, and that clearance is expected to take a few days longer than the standard delivery timeframe. That is a product-safety filing regime rather than a tariff — so a US order can be slow for a reason that has nothing to do with how much duty is owed.",
        pitfall:
          "Reading every US delay as the de minimis change and waiting for a duty bill that never comes. One of these two changes costs money and the other costs days.",
        takes: "5 minutes",
      },
      {
        title: "Treat a Korean holiday as a cutoff measured in minutes",
        body: "Weverse Shop publishes a cutoff schedule for each Korean holiday, and the times are precise. For Chuseok 2026 the order cutoff for addresses outside South Korea was 23 September at 11:00 KST, with express delivery resuming on 28 September; for Korean addresses the courier cutoff was 22 September at 11:00 KST, resuming the same day. Orders placed after the cutoff ship sequentially from the resumption date. Weverse adds two caveats: items shipped on the cutoff date may still arrive after the holiday depending on area, and the schedule comes from the courier and may change.",
        pitfall:
          "Reading those dates as this year's. They are the 2026 Chuseok figures, and the pattern — a cutoff at 11:00 KST a day or two before, resumption roughly a week later — is the part that carries over. The dates themselves have to be looked up each time.",
        takes: "10 minutes before a holiday order",
      },
      {
        title: "If your address is in China, a second holiday calendar applies",
        body: "Weverse Shop issues separate notices for Chinese holidays, affecting orders with shipping addresses in China, because Chinese customs offices close and clearance stops. For the 2026 Mid-Autumn Festival on 25 to 27 September and National Day from 1 to 7 October, it said orders fully paid by 15 September at 11:00 KST were likely to be delivered during the National Day holiday, and orders paid after that would start shipping once the holiday ended on 8 October. Note it is the payment being complete that counts, not the order being placed.",
        pitfall:
          "A pre-order whose payment completes later than you think. Where the cutoff is defined by full payment, an order sitting unpaid is an order on the far side of a three-week gap.",
        takes: "10 minutes",
      },
      {
        title: "Separate a freight disruption from a lost parcel",
        body: "Some delays are neither customs nor holidays. In April 2026 Weverse Shop notified customers of delivery delays across all of Europe and selected Middle Eastern countries caused by fluctuations in global logistics routes and air and sea freight schedules, affecting orders shipped after 1 April 2026 that were in international transit. The useful part is what it says about tracking: because of rerouting, tracking updates and local arrivals can take longer than usual, and the package is still in transit. Silent tracking during a known disruption is the expected symptom, not evidence of loss.",
        pitfall:
          "Opening a lost-parcel claim because tracking has not moved for a week. Check the notices page for an active disruption covering your region first — a claim filed against a parcel that is merely rerouted wastes the time you would need for a real one.",
        takes: "10 minutes",
      },
      {
        title: "Check whether Weverse is actually the seller",
        body: "Weverse Shop states on its own pages that some products are offered by individual third-party sellers, that in those cases Weverse Company acts solely as an e-commerce intermediary and is not a party to the transaction, and that it assumes no responsibility for the product information or for transactions conducted by those sellers. That changes who you are dealing with when something is wrong — for a third-party item the counterparty is the seller, not Weverse. Worth establishing before you need to complain rather than during.",
        pitfall:
          "Assuming everything on the store carries the same backing because it sits behind the same checkout. The intermediary disclaimer is published, and it decides who owes you a remedy.",
        takes: "5 minutes",
      },
      {
        title: "Read the notices yourself, because this page will go out of date faster than most",
        body: "Everything above came from Weverse Shop's notices page, and that page is the live version. The customs changes are durable; the holiday schedules, the freight disruptions and the courier cutoffs are not — they are reissued for each occasion and superseded without the old notice changing. Before a holiday order or when a parcel is late, read the notices list rather than trusting any guide's dates, this one included. The date at the top of this page is when we last did that.",
        pitfall:
          "Trusting a cutoff time from a guide written last year. The structure repeats and the numbers do not.",
        takes: "5 minutes",
        see: {
          slug: "order-from-weverse-shop-overseas",
          text: "The ordering side: currency, tax, addresses and shipping availability",
        },
      },
    ],
    faq: [
      {
        q: "Can I still cancel my order?",
        a: "Only while the status allows it. Weverse Shop's path is the Weverse app, More, My Orders, Order Details, Cancel Order — and it states that once the status changes to Shipping Soon or In Transit, cancellation is no longer possible. There is no published grace period, so the answer depends on the order rather than the clock.",
      },
      {
        q: "I am in the EU and my order has a customs bill. Is that right?",
        a: "Probably. Weverse Shop says that from 1 July 2026 the EU eliminated the duty exemption that previously covered orders under 150 euros, so duties now apply regardless of amount, based on shipments clearing local customs from that date. It also warns you may get separate payment instructions from customs or the courier, and that not paying can delay or prevent delivery.",
      },
      {
        q: "Why is my US order slow if there is no duty to pay?",
        a: "Because there are two changes. Alongside the duty rules, Weverse Shop warns that from 8 July 2026 the US Consumer Product Safety Commission enforces mandatory eFiling, bringing stricter inspections on all goods imported into the US, with clearance expected to take a few days longer. That one costs time rather than money.",
      },
      {
        q: "I got a message asking me to pay customs. Is it a scam?",
        a: "It can legitimately be real — Weverse Shop says EU customers may receive separate payment instructions from local customs or the courier. It is also exactly what a scam imitates. Verify by matching the tracking number to your own order and going to the courier's site yourself rather than following a link in the message.",
      },
      {
        q: "What is the holiday cutoff for a Korean holiday order?",
        a: "Weverse Shop publishes one per holiday, to the minute. For Chuseok 2026 the cutoff for addresses outside Korea was 23 September at 11:00 KST, with express delivery resuming 28 September. It warns the schedule comes from the courier and can change, and that items shipped on the cutoff day may still arrive after the holiday. Look up the current one rather than reusing these dates.",
      },
      {
        q: "My tracking has not updated in a week. Is my parcel lost?",
        a: "Check the notices page for a disruption covering your region first. When Weverse Shop notified delays for Europe and the Middle East in April 2026 it said rerouting means tracking updates and local arrivals take longer than usual and the package is still in transit — so static tracking during a known disruption is the symptom rather than the problem.",
      },
      {
        q: "Something is wrong with my item. Do I deal with Weverse?",
        a: "Not always. Weverse Shop states that some products are sold by individual third-party sellers, that Weverse Company then acts solely as an intermediary and is not a party to the transaction, and that it takes no responsibility for those sellers' product information or transactions. Check which kind of item you bought before deciding who to approach.",
      },
      {
        q: "Does the Chinese holiday schedule affect me if I am not in China?",
        a: "The notices say those schedules apply to orders with shipping addresses in China, because Chinese customs offices close over the holidays. If your address is elsewhere, the Korean holiday cutoffs and any active freight disruption are the ones to watch instead.",
      },
    ],
    sources: [
      {
        label: "Weverse Shop — Notice Regarding New EU Customs Policy and Potential Import Duties",
        url: "https://shop.weverse.io/en/notices/13627",
      },
      {
        label: "Weverse Shop — Notice Regarding Potential US Customs Clearance and Delivery Delays",
        url: "https://shop.weverse.io/en/notices/13626",
      },
      {
        label:
          "Weverse Shop — Notice of Delivery Delays for Europe and the Middle East due to Global Logistics Changes",
        url: "https://shop.weverse.io/en/notices/12868",
      },
      {
        label: "Weverse Shop — 2026 Chuseok Holiday Shipping Schedule, Global Shop",
        url: "https://shop.weverse.io/en/notices/14336",
      },
      {
        label:
          "Weverse Shop — Regarding Shipping during the 2026 Holidays of China, including the cancellation path",
        url: "https://shop.weverse.io/en/notices/14331",
      },
      {
        label: "Weverse Shop — the notices page, which is the live version of all of the above",
        url: "https://shop.weverse.io/en/notices",
      },
    ],
  },
  {
    slug: "weverse-data-leak-what-to-do",
    ko: "유출",
    art: "fan-kit",
    name: "The data leak",
    koLine: "위버스 개인정보 유출 — 무엇이 유출됐고, 무엇은 아닌가",
    title: "The Weverse data leak: what actually leaked, and the one risk it creates",
    summary:
      "422,584 accounts, confirmed by Weverse itself. No names, no contact details, no card numbers — an internal identifier and your purchase history. That combination is not a drained account; it is the raw material for a message that knows what you bought.",
    glyph: "id",
    status: "sourced",
    lastChecked: "2026-10-20",
    scope:
      "Covers what Weverse Company published about the leak it confirmed in September 2026, read in both the English and Korean versions of its notice. We are not security auditors and this is not legal advice: everything attributed to Weverse is its own statement, not a finding we verified. A security story can develop, and this page carries the date we last checked it.",
    readMinutes: 8,
    platforms: ["Weverse"],
    intro: [
      "In September 2026 the president of Weverse Company published a notice confirming that customer personal information had been leaked. Every reader of this site has a Weverse account, so the question is not whether it matters but what it actually changes — and the answer is narrower and more specific than either a shrug or a panic.",
      "What follows is the notice read closely, in both languages it was published in. The useful part is not the number. It is that the particular combination of data that left is almost useless for stealing from you and unusually good for convincing you.",
    ],
    steps: [
      {
        title: "Read the two lists, because the difference decides everything",
        body: "Weverse itemises what leaked under two headings. As personal information: internal identification information — a unique internal number generated for user identification when you registered. As general information it classifies as not personal: purchase type meaning payment method, the payment gateway name, the currency, the purchase amount, the cancellation amount, the purchase date and time, the purchase status, and the refund date and time where an order was cancelled. The scale is 422,584 cases counted in account ID units. What is not on either list is the point: no names, no contact details, no card numbers or payment credentials.",
        pitfall:
          "Reading 422,584 and filling in the rest from memories of other breaches. The response to a credential leak and the response to this are different, so the itemised list is worth more than the headline.",
        takes: "5 minutes",
      },
      {
        title: "Weigh Weverse's reassurance fairly, including its limit",
        body: "Weverse states that the leaked internal identifier is not information that directly identifies an individual, such as a name or contact details; that it is a value used only within Weverse Company's internal systems and cannot be used externally; and that payment forgery or unauthorised fund transfers are unlikely to occur from these data items alone. On its face that reasoning holds — an internal row number is not an identity, and none of these fields is a credential. The honest limit is that an internal identifier becomes identifying the moment it is joined to another dataset that also contains it, and nobody outside the company can measure how likely that is. That is the residual exposure: correlation, not theft.",
        pitfall:
          "Treating a reasonable reassurance as a guarantee, or treating it as spin. It is a specific claim about specific fields, and it is strongest exactly where it is narrowest.",
        takes: "5 minutes",
      },
      {
        title: "Understand the actual risk: a message that knows what you bought",
        body: "Look at the leaked fields together — payment method, gateway, currency, amount, date, status, refund date. That is not the equipment for charging your card. It is the equipment for writing a message that passes the only test most people apply to a suspicious email, which is whether the sender knows real details about a real order. A note quoting your actual purchase amount, on the actual date, in the actual currency, through the actual payment provider, is far more convincing than anything a random scammer could compose.",
        pitfall:
          "Using \u0027they know my order details\u0027 as proof that a message is genuine. After this leak that test has stopped working, and it is the test almost everyone uses.",
        takes: "5 minutes",
      },
      {
        title: "Know why this lands on top of a real process",
        body: "This matters more for this audience than for most, because legitimate strangers already ask Weverse customers for money. Weverse Shop warns EU buyers that they may receive separate payment instructions from local customs or the courier, and that not paying can delay or prevent delivery. So the genuine experience and the fraudulent one now look alike: a company you have no relationship with, referencing an order you really placed, asking for a payment before your parcel moves. The leak did not create that overlap, but it sharpened it.",
        pitfall:
          "Resolving the ambiguity by paying, or by ignoring everything. One loses money and the other loses the parcel.",
        takes: "—",
        see: {
          slug: "weverse-shop-shipping-delays-and-cancellation",
          text: "What a legitimate customs or courier payment request looks like",
        },
      },
      {
        title: "Use a check that does not depend on what the message knows",
        body: "The way through is to stop assessing the message and start assessing the claim. Take the tracking number or order reference out of it, then go to the courier or to Weverse Shop yourself — typed address or saved bookmark, never a link in the message — and see whether that reference matches an order of yours and whether anything is genuinely owed. If the message is real, the same information is on the other side. If it is not, nothing is, and you have learned that without clicking anything.",
        pitfall:
          "Following the link because the details were right. The details being right is now the expected state of a fake.",
        takes: "5 minutes per message",
      },
      {
        title: "Do not mistake a password change for the fix",
        body: "The reflex after any breach is to change the password, and here it addresses almost nothing: what was exposed was an identifier and purchase metadata through a payment-information API, not login credentials. Rotating the password costs nothing and harms nothing, so do it if it settles your mind — but do it knowing it is hygiene rather than a remedy, and that the thing that actually protects you is the verification habit in the previous step. Enabling whatever two-factor option your login provider offers is worth doing on general principle, and it is not a response to this leak either.",
        pitfall:
          "Changing the password, feeling finished, and then trusting the next message that quotes your order. Reflexive advice is comfortable and it crowds out the advice that works.",
        takes: "10 minutes",
        see: {
          slug: "nol-world-account-recovery-and-booking-errors",
          text: "Why your login type decides what you can even change",
        },
      },
      {
        title: "Find out whether you were affected, from the account rather than from a guide",
        body: "Weverse says it carried out a separate procedure, in accordance with the criteria set by the relevant laws and regulations, to notify the customers whose data was in the leak. So the answer is in your own account: the email address registered on it, and your in-app notifications. No guide can tell you, this one included, and any third party claiming to check whether you were in the leak is a reason for suspicion rather than a service.",
        pitfall:
          "Searching for a lookup tool that will tell you if you were affected. For a leak of internal identifiers there is nothing meaningful such a tool could check, and the search itself is what a phishing page is waiting for.",
        takes: "10 minutes",
      },
      {
        title: "Note what the company says it did, and what remains a promise",
        body: "Weverse's account of its response, in its words: it strengthened access control on the payment information processing API and removed the internal identifier from it so the data would not be externally exposed; on 4 September it filed a breach incident report with the Korea Internet & Security Agency; and it notified affected customers. Its stated plans are a full investigation of all externally exposed APIs, tighter access control and minimised exposed information, tighter control of deployment processes, and more sensitive security monitoring. It also says it has asked the external actor who accessed the data to return it, and intends to pursue legal responsibility. Keep the two categories apart: the first group are claims about completed work that nobody outside can audit, and the second are intentions.",
        pitfall:
          "Reading a list of planned improvements as a list of fixes already in place. The notice does not claim that, and neither should a summary of it.",
        takes: "5 minutes",
      },
      {
        title: "Give the handling its due, in proportion",
        body: "The timeline Weverse describes is short: contacted by KISA on 3 September after an external reporter disclosed a vulnerability, immediate internal inspection and emergency response, a breach report filed with KISA on 4 September, and a public notice over the chief executive's name itemising what left — including the fields it argues are not legally personal information, which it did not have to enumerate. We read the Korean original against the English and they say the same thing, which is its own small signal. None of that undoes a leak. But a site that only ever reports incidents as scandals teaches its readers nothing about what competent handling looks like, and this is nearer to it than most.",
        pitfall:
          "Concluding from a calm assessment that nothing happened. 422,584 accounts is a real failure that a prompt disclosure does not cancel.",
        takes: "—",
      },
      {
        title: "Think twice before deleting the account, and know what deletion is not",
        body: "Deleting the account is the other reflex, and it is a larger decision than it looks. Weverse Shop and NOL World both tie real things to an account: order and reservation history, saved addresses, a paid membership, and on the ticketing side a completed identity verification. The decisive point is simpler though. Deletion removes your data from the service going forward; it does not retract data that has already left. Whatever was in this leak was in it before you decided anything, and closing the account afterwards cannot reach it.",
        pitfall:
          "Deleting an account as a response to a leak. It is a reasonable thing to want and it is not a remedy for this, and it costs you the history you would need if a purchase were ever disputed.",
        takes: "—",
        see: {
          slug: "nol-world-account-recovery-and-booking-errors",
          text: "What account deletion removes, and what it keeps",
        },
      },
    ],
    faq: [
      {
        q: "Was my name, address or card number leaked?",
        a: "Not according to Weverse's own itemisation. What it lists is an internal identification number plus purchase metadata — payment method, payment gateway name, currency, purchase and cancellation amounts, purchase date and time, purchase status, and refund date and time. Names, contact details and payment credentials are not on the list.",
      },
      {
        q: "Should I change my Weverse password?",
        a: "It will not hurt, and it is not the fix. The exposure was an identifier and purchase metadata through a payment-information API rather than login credentials, so a new password does not address it. Do it if it helps you feel settled, then spend the real effort on verifying payment requests independently, which is what actually protects you here.",
      },
      {
        q: "How do I know if I was one of the 422,584?",
        a: "Through your own account. Weverse says it ran a separate notification procedure for affected customers under the relevant laws, so check the email registered to the account and your in-app notifications. No external tool can tell you, and anything advertising that it can should be treated as a phishing attempt.",
      },
      {
        q: "Can someone use this to charge my card?",
        a: "Weverse says payment forgery or unauthorised transfers are unlikely from these items alone, and on the face of the list that is sound — none of the leaked fields is a card number or a credential. The realistic risk is not a direct charge but a convincing message that persuades you to make a payment yourself.",
      },
      {
        q: "If it is not personal information, why does it matter?",
        a: "Because usefulness to an attacker and legal classification are different questions. Purchase amounts, dates, payment methods and currencies are exactly what makes a fraudulent message credible — and the usual way people judge a suspicious email is whether the sender knows real details about a real order. That test no longer works for anyone in this leak.",
      },
      {
        q: "Should I delete my Weverse account?",
        a: "It is a defensible choice and it is not a remedy. Deletion stops future collection; it cannot retract data that has already left, which includes anything in this leak. It also costs you order and reservation history, saved addresses, any paid membership, and on the ticketing side a completed identity verification — so decide it on whether you still want the service, not as a response to this.",
      },
      {
        q: "What has Weverse actually done?",
        a: "By its own account: strengthened access control on the payment information API and removed the internal identifier from it, filed a breach incident report with KISA on 4 September 2026, and notified affected customers. It also lists planned work — auditing all externally exposed APIs, tightening deployment controls, raising monitoring sensitivity — and says it has requested the data's return from the actor involved and intends to pursue legal responsibility. The completed items are its claims rather than audited findings.",
      },
      {
        q: "Is there anything newer than this?",
        a: "Not as of the date at the top of this page, which is when we last read Weverse Shop's notices list. A security matter can develop, so that list is the live version — if a follow-up notice exists, it will be there before it is here.",
      },
    ],
    sources: [
      {
        label:
          "Weverse Shop — Notice to Our Weverse Customers, the leak confirmation from the president of Weverse Company",
        url: "https://shop.weverse.io/en/notices/14265",
      },
      {
        label: "Weverse Shop — the same notice in Korean, read against the English for consistency",
        url: "https://shop.weverse.io/ko/notices/14265",
      },
      {
        label: "Weverse Shop — the notices page, where any follow-up would appear first",
        url: "https://shop.weverse.io/en/notices",
      },
    ],
  },
  {
    slug: "ktown4u-ordering-shipping-and-fees",
    ko: "주문",
    art: "album-stack",
    name: "Ktown4u",
    koLine: "케이타운포유 주문 — 6시간 결제 시한과 배송비",
    title: "Ordering from Ktown4u: the six-hour payment clock and the fees nobody mentions",
    summary:
      "An unpaid order is cancelled after six hours, not twenty-four. US parcels can carry a USD 12 charge collected at your door. International shipping went up 7% in February 2026, and two European countries quietly lost a shipping method entirely.",
    glyph: "parcel",
    status: "sourced",
    lastChecked: "2026-10-21",
    scope:
      "Covers ordering physical albums and goods from Ktown4u for delivery outside Korea, from Ktown4u\u0027s own notices: the payment clock, shipping fees and methods, holiday pauses, and customer support hours. Whether a Ktown4u purchase reports to the Korean album charts is answered from Hanteo\u0027s own register of certified stores rather than from Ktown4u. Notices are reissued and superseded, so the notices list is the live version.",
    readMinutes: 7,
    platforms: ["Ktown4u"],
    intro: [
      "Ktown4u is where a large share of international fans actually buy albums, and almost nothing about how it works is written down in English outside its own notices page — which is in English, dated, and read by nobody until a parcel is late.",
      "This is that page read in one go. The first item is the one that costs people orders, and it changed in 2025 without most buyers noticing.",
    ],
    steps: [
      {
        title: "Know that an unpaid order dies in six hours, not a day",
        body: "This is the fact worth knowing before you place anything. Ktown4u held unpaid orders for 24 hours and cut that to 6, effective 19 February 2025 KST, with unpaid orders automatically cancelled six hours after they are placed. For a fan ordering at midnight in Europe or the Americas, six Korean hours can elapse entirely while you sleep — and a pre-order placed and not paid is a pre-order that was never placed.",
        pitfall:
          "Reserving the item now and paying when your card or your pay day allows. That worked under the old window and does not under this one.",
        takes: "Pay at the time you order",
      },
      {
        title: "If you are in the US, budget for a charge collected at your door",
        body: "From 2 June 2025 Ktown4u applies a UPS fee policy to US shipments: where customs duties, taxes or other government charges are owed, an additional USD 12 is charged if those duties were not prepaid electronically before delivery. Ktown4u names it the International Collect on Delivery fee, and says it is billed to the recipient in the US at the time of delivery. The way out is also published — prepay the duties through the UPS Import Prepaid Duties and Taxes system, which it says accepts Apple Pay, Google Pay, or a Visa, Mastercard or Discover card.",
        pitfall:
          "Treating the checkout total as the total. This fee is not charged by Ktown4u at purchase; it arrives with the parcel, and it is twelve dollars on top of whatever duty is actually owed.",
        takes: "10 minutes, before the parcel ships",
        see: {
          slug: "kpop-album-customs-duty-overseas",
          text: "Why US parcels now attract duty at all, after the de minimis change",
        },
      },
      {
        title: "Price the shipping against the current rate, not last year\u0027s",
        body: "Ktown4u raised international shipping fees by 7% effective 1 February 2026 at 00:00 KST, which it attributes to a regular rate adjustment by the carriers. That is small per parcel and large across a group order, and it is the kind of change that makes a shipping estimate from a year-old blog post quietly wrong. The figure that counts is the one the cart shows you at the moment you order.",
        pitfall:
          "Budgeting a group order from a spreadsheet someone made last season. Rate adjustments are regular, which means there will be another one.",
        takes: "5 minutes",
      },
      {
        title: "Check your country still has the shipping method you expect",
        body: "Shipping methods are withdrawn by country, not just delayed. Ktown4u suspended K-Packet service to Germany and Spain from 17 January 2025, because the German and Spanish postal operators withdrew from the Prime Group arrangement it runs on. Its stated handling is to email affected customers about moving to another shipping service and the additional cost — so an order already placed can change price after the fact. The method you used last time is not a method you still have.",
        pitfall:
          "Choosing the cheapest method out of habit and not reading the follow-up email. The email is where the replacement service and its extra cost are named.",
        takes: "5 minutes, at checkout",
      },
      {
        title: "Read the per-country disruption notices, which are unusually specific",
        body: "Ktown4u publishes delivery disruptions down to postal codes. Its EMS notice for Slovakia of 4 April 2025 names the affected postal codes — 930 07, 930 06, 930 04, 930 03 and 900 68 — and the cause, a foot-and-mouth outbreak in southwestern Slovakia and a state of emergency from 25 March 2025, with parcels held at the local post office and recipients notified. The detail is the point: when tracking stops for your region, the notices page usually says why, and that is a different situation from a lost parcel.",
        pitfall:
          "Opening a lost-parcel claim during a disruption that is published and explained. Check the notices list for your country before you spend the afternoon on a claim.",
        takes: "10 minutes",
      },
      {
        title: "Treat a Korean holiday as a week with no despatch and no support",
        body: "Ktown4u pauses both halves of its operation over Korean holidays, and publishes the dates each time. For Lunar New Year 2026 parcel delivery was paused 14 to 18 February with deliveries resuming sequentially from 19 February, and customer support was unavailable across the same days. For Chuseok 2025 the pause ran 3 to 9 October with both resuming on the 10th. It warns each time that delays can run past the resumption date because of the volume of orders built up behind it.",
        pitfall:
          "Reading the resumption date as a delivery date. It is the day the queue starts moving, and your order is somewhere in it.",
        takes: "10 minutes before a holiday order",
      },
      {
        title: "Write to support inside the hours it actually keeps",
        body: "Ktown4u moved its customer service channel to weekdays 10:00 to 17:00 KST from 1 November 2023, with a lunch break from 12:30 to 13:30. That is a five-and-a-half hour window, on Korean weekdays, which for most readers of this site falls in the middle of the night. It matters most in combination with the six-hour payment clock: an order placed on a Friday evening in Europe can expire before anyone is at a desk to be asked about it.",
        pitfall:
          "Expecting a reply before you act. Convert those hours into your own once, write them down, and assume nothing outside them.",
        takes: "5 minutes, once",
      },
      {
        title: "Ktown4u is a Hanteo certified store, and you can check that yourself",
        body: "This guide used to say the question could not be answered, because Ktown4u does not state it on its own notices. It is answerable from the other end: Hanteo publishes its certified Family stores, and Ktown4U is on that register with the family code HF0082KTU001. Hanteo requires every online Family store to show the Family mark linked back to hanteochart.com, and Ktown4u\u0027s own storefront links to that same register — so the shop and the chart agree, from both ends. Check it rather than take it from here: registers change, and Hanteo\u0027s instruction is to confirm the code and the certification mark, which is reissued each year.",
        pitfall:
          "Reading this as \u0022my order will appear on every Korean chart\u0022. Hanteo counts sales its Family stores report; Circle Chart\u0027s main Album Chart counts wholesale shipments to retailers instead, so no retail order moves it at all. And neither publishes a rule on whether an overseas order is treated like a domestic one.",
        takes: "15 minutes",
        see: {
          slug: "buy-k-pop-albums-from-overseas",
          text: "What chart contribution depends on, and how to decide what you want from a purchase",
        },
      },
    ],
    faq: [
      {
        q: "How long do I have to pay for a Ktown4u order?",
        a: "Six hours. Ktown4u cut the holding time for unpaid orders from 24 hours to 6, effective 19 February 2025 KST, and says unpaid orders are automatically cancelled six hours after placement. Pay at the time you order rather than planning to come back to it.",
      },
      {
        q: "What is the USD 12 charge on my US delivery?",
        a: "Ktown4u\u0027s International Collect on Delivery fee for UPS shipments to the US, in force since 2 June 2025. It applies where customs duties, taxes or other government charges are owed and were not prepaid electronically before delivery, and it is billed to the recipient at delivery. Prepaying through the UPS Import Prepaid Duties and Taxes system avoids it — Ktown4u lists Apple Pay, Google Pay and Visa, Mastercard or Discover as the ways to do that.",
      },
      {
        q: "Why is shipping more expensive than it was?",
        a: "Ktown4u raised international shipping fees by 7% from 1 February 2026 at 00:00 KST, attributing it to a regular rate adjustment by the carriers. Regular means there will be another one, so price a group order from the cart rather than from an older estimate.",
      },
      {
        q: "My usual shipping method has disappeared. What happened?",
        a: "Methods are withdrawn by country. Ktown4u suspended K-Packet to Germany and Spain from 17 January 2025 after the German and Spanish postal operators withdrew from the Prime Group arrangement, and said it would email affected customers about switching service and the additional cost. If an order was already placed, that email is where the new method and price are named.",
      },
      {
        q: "My tracking has not moved. Is the parcel lost?",
        a: "Check the notices list for your country first. Ktown4u publishes disruptions in unusual detail — its Slovakia EMS notice of 4 April 2025 named the five affected postal codes and the quarantine measures behind the delay, and said parcels would be held at the local post office with recipients notified. A published disruption is a different problem from a lost parcel.",
      },
      {
        q: "What happens to my order over a Korean holiday?",
        a: "Despatch and customer support both stop. For Lunar New Year 2026 parcel delivery paused 14 to 18 February, resuming sequentially from the 19th, with support unavailable on the same days; Chuseok 2025 ran 3 to 9 October with both resuming on the 10th. Ktown4u warns each time that the backlog can push deliveries past the resumption date.",
      },
      {
        q: "When can I actually reach customer service?",
        a: "Weekdays 10:00 to 17:00 KST, with a lunch break 12:30 to 13:30, as set from 1 November 2023. Convert that into your own time zone before you need it, because combined with the six-hour payment clock an order can expire outside those hours.",
      },
      {
        q: "Does buying from Ktown4u count toward the Korean charts?",
        a: "Ktown4U is a Hanteo certified Family store, listed with the code HF0082KTU001, so for Hanteo the shop is a reporting one — which is as far as a public source goes. Hanteo does not publish a rule on whether an overseas order is treated like a domestic one, and Circle Chart is a separate question again: its main Album Chart counts wholesale shipments to retailers rather than retail sales, so an order there changes nothing either way. If a specific release is the point, the artist\u0027s own announcement usually names the participating retailers for it.",
      },
    ],
    sources: [
      {
        label: "Ktown4u — Notice Regarding Change in Non-Payment Order Holding Time, 7 Feb 2025",
        url: "https://www.ktown4u.com/notices/7001",
      },
      {
        label: "Ktown4u — International Fee for UPS Shipments to the U.S., 2 Jun 2025",
        url: "https://www.ktown4u.com/notices/7123",
      },
      {
        label: "Ktown4u — International Shipping Fee Adjustment, effective 1 Feb 2026",
        url: "https://www.ktown4u.com/notices/7360",
      },
      {
        label: "Ktown4u — Suspension of K-Packet Shipping Service in Germany and Spain, 17 Jan 2025",
        url: "https://www.ktown4u.com/notices/6960",
      },
      {
        label: "Ktown4u — EMS International Parcel Delivery Delay (Slovakia), 4 Apr 2025",
        url: "https://www.ktown4u.com/notices/7056",
      },
      {
        label: "Ktown4u — Lunar New Year 2026 delivery and support pause",
        url: "https://www.ktown4u.com/notices/7386",
      },
      {
        label: "Ktown4u — the notices page, which is the live version of all of the above",
        url: "https://www.ktown4u.com/notices",
      },
      {
        label: "Hanteo Chart — certified Family stores, where Ktown4U is listed as HF0082KTU001",
        url: "https://www.hanteochart.com/en/family/search",
      },
      {
        label: "Circle Chart — FAQ: the Album Chart counts wholesale shipments, not retail sales",
        url: "https://circlechart.kr/page_community/faq.circle",
      },
    ],
  },
  {
    slug: "gocheok-sky-dome-getting-there",
    ko: "공연장",
    art: "lightstick",
    name: "Gocheok Sky Dome",
    koLine: "고척스카이돔 가는 길 — 가장 가까운 역이 정답이 아닙니다",
    title: "Getting to Gocheok Sky Dome: the nearest station is not the right station",
    summary:
      "Twenty-five thousand people, 484 parking spaces, and a venue that tells you in its own words to get off one stop early. The nearest exit is a three-minute walk and is the one you should probably avoid.",
    glyph: "star",
    status: "sourced",
    lastChecked: "2026-10-22",
    scope:
      "Covers reaching Gocheok Sky Dome for a concert, from the Seoul Facilities Corporation pages that operate it: the stations, the exits, the walking times, the crowd advice the venue publishes itself, and the car park. One venue, deliberately. KSPO Dome and Inspire Arena need their own pages and their operators\u0027 own sources, which this does not substitute for. Nothing here is event-specific — what you may carry in and when doors open come from the promoter, not the building.",
    readMinutes: 6,
    platforms: ["Gocheok Sky Dome"],
    intro: [
      "A ticket tells you the hall and the hour. It does not tell you that the station attached to the hall is the one every other ticket-holder is also walking out of, and that the operator of the building says so on its own website in plain Korean.",
      "This is one venue read end to end, in the words of the corporation that runs it. The useful part is not the address. It is that two of the four stations on the list exist to take people away from the nearest one.",
    ],
    steps: [
      {
        title: "Confirm which hall your show is actually in",
        body: "Seoul has several large halls and their English names overlap badly. Gocheok Sky Dome — 고척스카이돔 — is in Guro-gu at 430 Gyeongin-ro, postcode 08223, and is run by the Seoul Facilities Corporation. It is not KSPO Dome, which is inside Olympic Park in Songpa-gu and run by a different organisation entirely, and it is not Inspire Arena, which is in Incheon. Check the venue name on the booking page against the address before you plan anything, because the three are an hour apart from each other.",
        pitfall:
          "Reading \u0022Dome\u0022 and assuming there is only one. Two of Seoul\u0027s biggest halls have Dome in the name, they are on opposite sides of the city, and a fan who learns this at 18:00 does not make the show.",
        takes: "2 minutes",
        see: {
          slug: "gocheok-sky-dome-finding-your-seat",
          text: "And what the block number on that ticket is telling you",
        },
      },
      {
        title: "Know the nearest station, and that it is three minutes away",
        body: "Line 1, Guil Station, exit 2: about 150 metres straight ahead, which the venue gives as a three-minute walk. That is the closest approach and it is genuinely short. The other three routes it publishes are longer. Gaebong Station on Line 1, exit 2 — 200 metres straight, right, then 650 metres, and the dome is on your right: about fifteen minutes, or village bus 06 towards Gocheok Bridge. Guro Station on Line 1 — left out of the exit, a kilometre straight, over Gocheok Bridge and the dome is on your left: about twenty minutes, or buses 5712 and 5626. Sindorim on Lines 1 and 2 — bus from exit 1, three stops, ten routes running, the 160 among them.",
        pitfall:
          "Taking the three-minute walk as the obvious answer. It is the shortest route and the next step is the venue explaining why it may be the wrong one. One number on that page also disagrees with itself: the station table gives Guro as exit 1, while the turn-by-turn directions printed below it and the venue\u0027s own area map both say exit 2. Two sources out of three say 2, and both exits are inside the same station, so the cost of guessing wrong is a minute.",
        takes: "5 minutes",
      },
      {
        title: "Read the crowd advice the venue prints itself",
        body: "This is the part worth the page, and it is published by the operator rather than inferred from a blog. The access page carries two lines above the station table: people coming from Seoul and the Suwon or Anyang direction are told they can avoid the congestion by getting off at Guro Station, and people coming from the Incheon or Bucheon direction are told the same about Gaebong Station. The building is telling you that on a full night the station at its door does not clear, and naming which stop to use instead depending on where you boarded.",
        pitfall:
          "Following a route app that optimises for distance. It will send you to Guil every time, because it does not know what the venue knows about the exit at turnout.",
        takes: "5 minutes, before the day",
      },
      {
        title: "Understand why the crush is worse than a baseball crowd",
        body: "The same hall holds two different numbers. For baseball the venue gives 16,601 seats; for cultural events — concerts, award shows — it says around 25,000 people can be accommodated at once. A concert night therefore puts about fifty per cent more people through the same doors and onto the same platform than the building\u0027s regular use does, which is the arithmetic behind the advice in the previous step.",
        pitfall:
          "Judging the crowd from a baseball visit, or from a friend who went to one. The concert configuration is a different building as far as the exits are concerned.",
        takes: "—",
      },
      {
        title: "Do not plan to park, and know the reason is not capacity",
        body: "The venue has 484 parking spaces across three levels, open 08:00 to 22:00, charged at 150 won per five minutes — 900 won for thirty minutes, 1,800 for an hour, 10,800 for six. Against a concert crowd of 25,000 that is one space for every fifty-two people, which would already settle it. But the operator adds the sentence that actually decides it: on baseball and event days the car park is taken over in full by the organiser, and public use is restricted. So the constraint is not that it fills up. It is that it may not be open to you at all.",
        pitfall:
          "Booking a taxi or a rental on the assumption that arriving by road is the comfortable option. The road option ends at a car park that the promoter has taken for the night.",
        takes: "5 minutes",
      },
      {
        title: "Ask the building only what the building knows",
        body: "The operator answers questions about the building: access, parking, facilities, the dome itself. Its contact for that is the Dome Operations Division, operations team, on 02-2128-2300. What it does not set is your show — the entry time, what you may carry in, where your queue forms and when doors open are the promoter\u0027s, and they are published per event on the ticketing page rather than by the venue. Asking the venue about bag rules gets you a polite answer about the building\u0027s general policy, which is not the answer you needed.",
        pitfall:
          "Treating a venue phone call as confirmation of an event rule. The two are different authorities and only one of them is on your ticket.",
        takes: "10 minutes",
        see: {
          slug: "nol-world-mobile-ticket-and-entry",
          text: "What the ticket itself has to do at the gate",
        },
      },
    ],
    faq: [
      {
        q: "Which station is Gocheok Sky Dome?",
        a: "Guil Station on Line 1, exit 2, about 150 metres and a three-minute walk. It also publishes three longer routes: Gaebong Station exit 2, about fifteen minutes on foot or village bus 06 towards Gocheok Bridge; Guro Station, about twenty minutes on foot across Gocheok Bridge or buses 5712 and 5626; and Sindorim on Lines 1 and 2, three stops by bus from exit 1 with ten routes running, the 160 among them. The venue\u0027s own table and its turn-by-turn directions disagree on whether Guro is exit 1 or exit 2; the directions and the area map both say 2.",
      },
      {
        q: "If Guil is three minutes away, why would I get off anywhere else?",
        a: "Because the venue says so. Its access page tells people arriving from Seoul and the Suwon or Anyang direction to get off at Guro to avoid congestion, and people arriving from Incheon or Bucheon to get off at Gaebong. That is the operator describing its own station at turnout, not a traveller\u0027s opinion.",
      },
      {
        q: "How many people are there on a concert night?",
        a: "The venue gives about 25,000 for cultural events, against 16,601 seats for baseball. Roughly fifty per cent more people leave through the same exits than on a regular match day, which is why the crowd advice exists.",
      },
      {
        q: "Can I drive or take a taxi and park there?",
        a: "Plan on no. There are 484 spaces, open 08:00 to 22:00 at 150 won per five minutes, but the operator states that on baseball and event days the car park is fully reserved by the organiser and public use is restricted. One space per fifty-two people would be the problem if the lot were even open to you.",
      },
      {
        q: "Is Gocheok Sky Dome the same as KSPO Dome?",
        a: "No, and they are not near each other. Gocheok Sky Dome is at 430 Gyeongin-ro in Guro-gu, western Seoul, run by the Seoul Facilities Corporation. KSPO Dome is inside Olympic Park in Songpa-gu, in the south-east, under a different operator. Check the venue name on your booking page against the address.",
      },
      {
        q: "Who do I ask what I can bring in?",
        a: "The promoter, not the venue. The building publishes access, parking and facilities; entry time, bag rules, queue position and door time are set per event and appear on the ticketing page for your show. The venue\u0027s own line is the Dome Operations Division on 02-2128-2300, and it can only tell you about the building.",
      },
    ],
    sources: [
      {
        label:
          "서울시설공단 고척스카이돔 — 찾아오시는길: the station list, exits, walking times and the congestion advice",
        url: "https://www.sisul.or.kr/open_content/skydome/introduce/location.jsp",
      },
      {
        label: "서울시설공단 고척스카이돔 — 주차장: 484 spaces, hours, tariff and the event-day restriction",
        url: "https://www.sisul.or.kr/open_content/skydome/guidance/parking.jsp",
      },
      {
        label: "서울시설공단 고척스카이돔 — 시설안내: 16,601 seats and the facility figures",
        url: "https://www.sisul.or.kr/open_content/skydome/introduce/facility.jsp",
      },
      {
        label: "서울시설공단 고척스카이돔 — 이용안내: the 25,000 cultural-event capacity",
        url: "https://www.sisul.or.kr/open_content/skydome/guidance/dome.jsp",
      },
    ],
  },
  {
    slug: "gocheok-sky-dome-finding-your-seat",
    ko: "좌석",
    art: "guide-tickets",
    name: "Gocheok seats",
    koLine: "고척스카이돔 좌석번호 — 한 방향으로 돌아갑니다",
    title: "Finding your seat at Gocheok Sky Dome: what the block number on your ticket means",
    summary:
      "Four levels, one direction, and a single break in the loop. Three digits read correctly will walk you to your block from any entrance, without a map and without knowing which way is north.",
    glyph: "ticket",
    diagram: "gocheok-bowl",
    document: {
      file: "docs/gocheok-seat-2026.jpg",
      width: 653,
      height: 954,
      alt: "The venue's seating chart: four rings of numbered blocks around a baseball field, lettered gates A to G outside them, and ticket offices marked 2, 3 and 4.",
      caption:
        "The chart this page is read from. It is drawn for baseball — the dugouts are on it — and it is the authority on where a numbered block is, not on what is sold for your show.",
      credit: "서울시설공단 (Seoul Facilities Corporation)",
      licence: "공공누리 제1유형: 출처표시 (KOGL Type 1: Attribution)",
      licenceUrl: "https://www.kogl.or.kr/info/license.do",
      sourceUrl: "https://www.sisul.or.kr/open_content/skydome/introduce/seat.jsp",
      upstream: "https://www.sisul.or.kr/open_content/skydome/images/seat2026.jpg",
      taken: "2026-10-22",
    },
    status: "sourced",
    lastChecked: "2026-10-22",
    scope:
      "Covers how Gocheok Sky Dome numbers its permanent seating, read off the Seoul Facilities Corporation's own chart and facility pages: the four levels, which direction the numbers run, where the sequence breaks, and where the gates and ticket offices sit relative to it. The chart it is read from is drawn for baseball — it has dugouts on it. The bowl blocks are poured concrete and do not move, so a concert ticket naming block 304 means this 304; but which blocks are sold, what sits on the floor, which gate your ticket admits you through and when doors open are the promoter's, set per show, and nothing here replaces the chart on your own booking page. One venue. KSPO Dome and Inspire Arena number themselves differently and need their own pages.",
    readMinutes: 7,
    platforms: ["Gocheok Sky Dome"],
    intro: [
      "A seating chart is drawn for somebody who already knows how the building is organised. It is a flat picture of 123 numbers, and it answers the question you have at home — is this a good seat — rather than the question you have at 18:40 standing against a concrete wall with a number on it that is not yours.",
      "That second question has a short answer, because the numbering is a system rather than a list. Four levels, one direction, one break. Learn those three things and you stop needing the chart.",
    ],
    steps: [
      {
        title: "Decide first whether your seat is in the building or on the floor",
        body: "Three digits between 101 and 435 mean a permanent block in the bowl, and the rest of this page locates it. Anything else — a letter on its own, FLOOR, 플로어, a standing zone, a table or box name — is on the field, which has no permanent seats at all. The field is bare floor that the promoter covers, divides and names for each show, so only that show's own chart places it.",
        pitfall:
          "Matching a letter on your ticket to a letter on the venue's chart. There are three different alphabets on this one building: the seven gates are lettered A to G, the chart prints field-level baseball zones in T, S and D series, and a concert's floor blocks are lettered by the promoter. A letter is only meaningful next to the thing that issued it.",
        takes: "2 minutes",
      },
      {
        title: "The first digit is the level, and there are four of them",
        body: "101 to 132 is the lowest ring, closest to the floor. 201 to 222 is a short second tier. 301 to 334 is the third. 401 to 435 is the top. That matches the building the venue describes — four storeys above ground over two basement levels — so the hundreds digit is a floor number, not a zone name. A 4 is as high as the building goes.",
        pitfall:
          "Expecting the 200 level to behave like the others. It is the shortest, 22 blocks against 32, 34 and 35, and it is the only one with holes in the middle of it: the chart shows stretches along the far side of the building carrying no 200-level seating at all. Consecutive numbers there are not necessarily neighbours on the ground.",
        takes: "1 minute",
      },
      {
        title: "The other two digits are a position on a loop that turns one way",
        body: "Inside a level the numbers run in a single direction all the way round, and that is the venue's own word for it rather than something measured off the picture: the description published with the chart says the blocks run 시계방향 — clockwise — starting from the bottom right of the infield side, and then lists them in that order. Every level starts from the same side of the building. So the step from 401 to 405 is the same rotation as the step from 301 to 305, in the same direction, at a different height. There is no left half and right half to learn, and no odd and even side.",
        pitfall:
          "Expecting the levels to stack block for block. They hold 32, 22, 34 and 35 blocks, so they drift apart as they go round: only the line they start from is shared. 417 is not above 317, and a friend in 210 is not below you in 310.",
        takes: "2 minutes",
      },
      {
        title: "The loop has exactly one break, and there is no gate in it",
        body: "The seating does not close into a full circle. On the side the chart draws at the right there is a wedge of building with no seats at any level, and that is where the numbering restarts — 132 and 101 face each other across it, and so do 435 and 401. That break is not one width: measured off the chart it is about 44 degrees at the 100 level, 71 at the 200, 91 at the 300 and 96 at the 400, because the upper decks stop short of that corner while the lowest ring nearly closes around it. The seating is a horseshoe that opens as it rises. The seven gates run clockwise in the same direction the numbers do: A, B, C, D and E along the near side, then F and G across the far one. A is the first gate after the break; G is the last one before it. Gate letters and block numbers are one scale, which is the whole reason the building can be navigated without a compass.",
        pitfall:
          "Assuming a gate you can see is a gate you may use. The venue's own chart marks gate C, the one at the centre, as an entrance reserved for R.d-club and skybox season-ticket holders rather than a general one. The nearest door is not always yours.",
        takes: "3 minutes",
      },
      {
        title: "Arrive on a side you can work with",
        body: "Guil Station on Line 1, exit 2, is about 150 metres and three minutes from the venue, and on a concert night the operator publishes advice to get off a stop earlier — Guro if you boarded from Seoul or the Suwon and Anyang direction, Gaebong if you came from Incheon or Bucheon. Which you take changes which part of the perimeter you reach first, and therefore how far round you walk. It does not change the rule in the next step, which works from any entrance.",
        pitfall:
          "Planning the walk to the building and not the walk around it. Twenty-five thousand people arrive at a ring roughly 600 metres round, and the last two hundred of your metres are the ones with a crowd in them.",
        takes: "5 minutes, before the day",
        see: {
          slug: "gocheok-sky-dome-getting-there",
          text: "The stations, the exits, and why the nearest is not the right one",
        },
      },
      {
        title: "At the wall, read two block numbers and you know which way to walk",
        body: "You do not need to know which compass direction the chart's top points to, and the venue does not publish it. You need two numbers in a row. Read a block number where you are standing, walk a few metres, read the next one. Now you know which way the sequence rises. If yours is higher, keep going; if lower, turn round. Because the loop turns one way at every level, the answer you get on the outside of the building is still true on the stairs and still true on the concourse.",
        pitfall:
          "Steering by the floor instead of by the signs. A dome has no view out of it and every stretch of concourse looks like every other stretch; the block numbers are the only thing in the building that tells you where you are. The one place the two-number rule fails is the break, and the break announces itself, because the numbers stop.",
        takes: "5 minutes on the night",
      },
      {
        title: "Know which half of this the promoter decides",
        body: "The building fixes the block numbers, the four levels, the gate letters and the ticket offices — the chart marks three, numbered 2, 3 and 4, with the infield one beside gate E and the two outfield ones flanking gates F and G. The promoter fixes everything that changes per show: which blocks are sold at all, because a stage against one end of the floor kills the blocks behind it; what the floor sections are called; which gate your ticket admits you through; and when the doors open. Where your ticket and this page disagree, your ticket is right.",
        pitfall:
          "Treating the venue's chart as your show's chart. It is drawn for baseball and has dugouts on it. It is the authority on where 304 is and on nothing else about your night.",
        takes: "5 minutes",
        see: {
          slug: "nol-world-mobile-ticket-and-entry",
          text: "What the ticket itself has to do at the gate",
        },
      },
    ],
    faq: [
      {
        q: "What does a block number like 304 actually tell me?",
        a: "Two things. The 3 is the level — the third of four, counting the lowest ring as 1. The 04 is a position on a loop that runs one direction all the way round that level, starting from a fixed side of the building. So 304 is low-numbered, which puts it near where the numbering begins, a short walk clockwise from the break in the seating.",
      },
      {
        q: "Which direction do the numbers run?",
        a: "Clockwise, and the venue says so itself: the description published with its chart reads 시계방향, starting from the bottom right of the infield side, and the block ranges it then lists match the picture on both sides. The same direction at every level. The gate letters run the same way: A, B, C, D, E along the near side and F, G across the far side. That means letters and numbers rise together — if you pass gate D on your way to gate E, your block numbers are rising too.",
      },
      {
        q: "Is block 417 directly above block 317?",
        a: "No. The levels hold different numbers of blocks — 32, 22, 34 and 35 from the bottom up — so they share only the line their numbering starts from and drift apart from there. Use the level you are actually on to navigate, not the one your friend is on.",
      },
      {
        q: "Why do the numbers stop and start again?",
        a: "Because the seating is a horseshoe, not a ring. There is a wedge of the building with no seats in it at any level, and the numbering restarts there: 132 faces 101 across it, 435 faces 401. It is also the one stretch of the perimeter with no gate in it, which makes it easy to recognise. It is wider the higher you are — about 44 degrees of the circle at the 100 level against 96 at the 400 — so on the top level more of the ring is missing and walking the long way round costs more.",
      },
      {
        q: "Can I go in through whichever gate is closest?",
        a: "Not necessarily. Gate access is set per event by the promoter and printed on your ticket, and at least one gate is not general even on an ordinary day — the venue's chart marks the centre gate as an entrance for R.d-club and skybox season-ticket holders. Read your ticket, then find that gate.",
      },
      {
        q: "The chart on the venue site looks like a baseball stadium. Is it the right one?",
        a: "It is the right chart for the question this page answers and the wrong one for most others. It is drawn for baseball, dugouts included, and the venue seats 16,601 for a match against about 25,000 for a concert — so a concert is a different arrangement of the same building. What does not change is the concrete: the numbered blocks are permanent, so the chart tells you where 304 is. It cannot tell you whether 304 is sold for your show, or what is on the floor.",
      },
    ],
    sources: [
      {
        label:
          "서울시설공단 고척스카이돔 — 좌석배치도: the seating chart, and the text description published with it, which states the clockwise direction and lists every block range on each side",
        url: "https://www.sisul.or.kr/open_content/skydome/introduce/seat.jsp",
      },
      {
        label:
          "서울시설공단 고척스카이돔 — 시설안내: four storeys above ground over two basement levels, and 16,601 seats",
        url: "https://www.sisul.or.kr/open_content/skydome/introduce/facility.jsp",
      },
      {
        label:
          "서울시설공단 고척스카이돔 — 이용안내: the 25,000 cultural-event capacity the concert configuration is drawn against",
        url: "https://www.sisul.or.kr/open_content/skydome/guidance/dome.jsp",
      },
      {
        label:
          "서울시설공단 고척스카이돔 — 찾아오시는길: the stations, exits and walking distances",
        url: "https://www.sisul.or.kr/open_content/skydome/introduce/location.jsp",
      },
    ],
  },
  {
    slug: "ticketlink-global-ticketing-guide",
    ko: "\uD2F0\uCF13\uB9C1\uD06C",
    art: "guide-tickets",
    name: "TicketLink",
    koLine: "\uD2F0\uCF13\uB9C1\uD06C \uAE00\uB85C\uBC8C \u2014 \uD398\uC774\uCF54 \uACC4\uC815\uC774 \uBA3C\uC800\uC785\uB2C8\uB2E4",
    title: "TicketLink for overseas buyers: the PAYCO account, the eight-minute clock, and the collection problem",
    summary:
      "The fourth Korean ticketing platform, and the one English guides leave out. It has a real English site, it will not let you book without a PAYCO account, and its only documented delivery route is domestic.",
    glyph: "ticket",
    status: "sourced",
    lastChecked: "2026-10-23",
    scope:
      "Covers booking on TicketLink from outside Korea, read from the English pages NHN LINK publishes for its global site on 23 October 2026: where the global site actually is, the account it requires, the documented purchase steps and their clock, and every ticket-collection route it describes. It is deliberate about what it does not claim. TicketLink\u0027s English documentation does not state which payment cards it accepts, whether its confirmation SMS can reach a number outside Korea, or what PAYCO asks for at sign-up, and this page says so rather than filling those gaps from elsewhere. Nobody from this site has booked on it.",
    readMinutes: 7,
    platforms: ["TicketLink", "PAYCO"],
    intro: [
      "English guides to Korean ticketing name three platforms and stop. TicketLink is the fourth, it is run by NHN rather than by any of the other three, and a show sold exclusively through it is a show the other three guides cannot help you with at all.",
      "It does have an English site. What it also has is an account requirement that sits outside TicketLink entirely, a checkout clock measured in minutes, and a delivery section whose only shipping route is marked Domestic.",
    ],
    steps: [
      {
        title: "Check whether your show is on TicketLink at all",
        body: "TicketLink sells concerts, musicals, theatre, classical and dance, family shows, exhibitions and esports, and some concerts carry an Exclusive Sale badge, which means that platform is the only place the show is sold. The official announcement is what tells you; the platform is not something to infer from the artist or the venue. If the announcement names TicketLink, none of the NOL World, Weverse or YES24 procedures apply to you.",
        pitfall:
          "Assuming the big three cover everything. They do not, and a reader who learns on sale day that their show is a TicketLink exclusive has lost the time they needed to set up an account.",
        takes: "5 minutes",
        see: {
          slug: "buy-k-pop-concert-tickets-from-overseas",
          text: "Where the announcement is, and what else it decides",
        },
      },
      {
        title: "Go to the right address, which is not the one you would guess",
        body: "The English site is a path on the main domain: www.ticketlink.co.kr/global/en/home. There is no global subdomain \u2014 a browser asked for global.ticketlink.co.kr answers NXDOMAIN, and /global, /en and /english on the main host all return 404. The same global section runs in Japanese and Chinese at /global/ja/ and /global/zh/, so the language you get is decided by the path, not by a setting.",
        pitfall:
          "Searching for a TicketLink global site and landing on the Korean one. They are the same host, so nothing warns you; you simply find yourself on a page in Korean with a different help section behind it.",
        takes: "2 minutes",
      },
      {
        title: "Get a PAYCO account before you need one",
        body: "This is the step that catches people, and TicketLink states it plainly: you sign in with a PAYCO ID, and \u0022our reservation service is not offered to non-members.\u0022 PAYCO is NHN\u0027s own account and payment service, separate from TicketLink. Its sign-up, as TicketLink describes it, is the Create account link at the foot of the sign-in page, then an email address and a password, and you have to agree to grant PAYCO access to your personal information.",
        pitfall:
          "Leaving this to the sale. You are not creating one account under time pressure, you are creating an account on a second company\u0027s service and then using it to sign in, and the eight-minute clock in the next step does not start until you are already signed in.",
        takes: "20 minutes, days ahead",
      },
      {
        title: "Know the clock: eight minutes from seat to payment",
        body: "TicketLink documents five steps. Date and round, where the button reads To Be Sold until the sale opens and you refresh to turn it into Reserve. Class and seat, choosing by zone first or by class first, with either automatic assignment or your own pick. Then ticket type and amount, where the page says the seats are held and you must purchase within eight minutes. Then delivery and confirmation, which repeats the eight minutes and requires you to agree to the cancellation fee policy. Then payment. The hold is on the seats, so the clock is the whole of what remains, not one screen of it.",
        pitfall:
          "Pop-ups. TicketLink\u0027s own instructions tell you to enable them, because the booking window is a pop-up \u2014 so a blocker set and forgotten takes the sale without an error message anyone would recognise as one.",
        takes: "8 minutes, and not a minute more",
        see: {
          slug: "nol-world-booking-fees-and-checkout-clock",
          text: "The same clock on NOL World, which runs differently",
        },
      },
      {
        title: "Plan to collect, because delivery is domestic",
        body: "TicketLink describes four ways to get a ticket and one of them is closed to you. Delivery arrives within ten business days and the page marks it Domestic. On-site pickup is at the box office, presenting a confirmation SMS or your ticket number, and for performances and exhibitions the window is between one hour and thirty minutes before the show. Home Ticket is a barcode inside the TicketLink app. Smart Ticket is issued to your phone, from midnight on the day for same-day events, and cannot be cancelled once issued.",
        pitfall:
          "Two conditions on the app routes that are easy to miss. Everyone on one booking has to enter together on a Home Ticket barcode, so a group that planned to arrive separately cannot; and if you already hold a paper ticket you cannot issue a Smart Ticket, because the two may not exist at once.",
        takes: "10 minutes, before the day",
      },
      {
        title: "Read what TicketLink does not say, because that is where you are exposed",
        body: "Three things its English pages do not answer. Step five of the purchase guide says a payment window appears and you select a method; it never lists which methods, so whether your card works is not documented anywhere in English. On-site pickup leans on a confirmation SMS, and nothing says whether that SMS can reach a number outside Korea. And PAYCO sign-up is described by TicketLink in one sentence, so what PAYCO itself asks for is a question for PAYCO. There is a claim circulating in English that this site takes overseas cards with passport verification and needs no Korean phone number. It may be true. It is not in TicketLink\u0027s documentation, and this page will not repeat it until somebody checks.",
        pitfall:
          "Treating an undocumented thing as a permitted thing. The gap between \u0022they do not say no\u0022 and \u0022it works\u0022 is where a sale is lost, and it is the whole reason this step exists rather than a confident paragraph.",
        takes: "5 minutes",
      },
      {
        title: "Ask the right desk, in English",
        body: "TicketLink runs an English-only customer line on 1644-3850 and prints it on every page of its global help section, alongside a 1:1 Inquiry form and membership@nhnlink.co.kr. Its English FAQ index carries a standing entry titled \u0022Can foreigners also join the membership?\u0022 dated June 2022, and three separate entries about being shown a restricted-access screen or an IP restriction during sign-up, login and booking. Those titles are worth reading before sale day rather than during it. The operator is NHN LINK Corporation, at 586 Gangnam-daero, Gangnam-gu, Seoul.",
        pitfall:
          "Reaching for a VPN when a restricted-access screen appears. That is a subscription sold against a problem it does not reliably fix, it can break a payment that was going to work, and this site will not tell you to do it \u2014 the English line exists for exactly this question.",
        takes: "15 minutes",
        see: {
          slug: "nol-world-account-recovery-and-booking-errors",
          text: "What a booking error usually turns out to be",
        },
      },
    ],
    faq: [
      {
        q: "Do I need a Korean account to use TicketLink?",
        a: "You need a PAYCO account, which is NHN\u0027s own service rather than TicketLink\u0027s. TicketLink states that its reservation service is not offered to non-members and that you sign in with a PAYCO ID. It describes PAYCO sign-up as an email address and a password, plus agreeing to grant PAYCO access to your personal information. What PAYCO asks for beyond that is not covered in TicketLink\u0027s English pages.",
      },
      {
        q: "Where is TicketLink\u0027s English site?",
        a: "At www.ticketlink.co.kr/global/en/home \u2014 a path on the main domain, not a separate one. There is no global.ticketlink.co.kr; that hostname does not resolve. The same section also runs in Japanese at /global/ja/ and Chinese at /global/zh/.",
      },
      {
        q: "How long do I have to pay once I have a seat?",
        a: "Eight minutes. TicketLink says the seats are held and must be purchased within eight minutes at the ticket-amount step, and repeats the eight minutes at the delivery and confirmation step. The hold is on the seats, so that window covers everything still ahead of you, payment included.",
      },
      {
        q: "Can TicketLink post my tickets to me abroad?",
        a: "Its documented delivery route is marked Domestic and quoted at ten business days, so plan on collecting instead. The alternatives it describes are on-site pickup at the box office with a confirmation SMS or ticket number, a Home Ticket barcode in the TicketLink app, and a Smart Ticket issued to your phone.",
      },
      {
        q: "Which cards does TicketLink accept from overseas?",
        a: "Its English documentation does not say. The purchase guide\u0027s payment step says only that a payment window appears and you select a method. Until somebody checks it on a real booking, this page will not name a card that works \u2014 and neither should anything else you read.",
      },
      {
        q: "I get a restricted-access screen. What is it?",
        a: "TicketLink\u0027s English FAQ index carries three entries on this, about restricted access during booking and an IP restriction during sign-up and login, dated between June 2022 and June 2023. That it is answered three times suggests it is common. Ask the English-only line on 1644-3850 or the 1:1 Inquiry form rather than reaching for a VPN, which is a subscription sold against a problem it may not fix and can break a payment that would otherwise have worked.",
      },
    ],
    sources: [
      {
        label:
          "TicketLink Global \u2014 Sign in & Sign Up: the PAYCO requirement and that booking is members-only",
        url: "https://www.ticketlink.co.kr/global/en/help/guide/signup",
      },
      {
        label:
          "TicketLink Global \u2014 Purchase tickets: the five steps and the eight-minute seat hold",
        url: "https://www.ticketlink.co.kr/global/en/help/guide/reservation",
      },
      {
        label:
          "TicketLink Global \u2014 Ticket Pickup: delivery marked Domestic, on-site pickup, Home Ticket and Smart Ticket",
        url: "https://www.ticketlink.co.kr/global/en/help/guide/ticket",
      },
      {
        label:
          "TicketLink Global \u2014 Service Center: the English-only line, the 1:1 Inquiry form and the FAQ index",
        url: "https://www.ticketlink.co.kr/global/en/help/main",
      },
      {
        label: "TicketLink Global \u2014 home, where the operator and the category list are published",
        url: "https://www.ticketlink.co.kr/global/en/home",
      },
    ],
  },
  {
    slug: "weverse-shop-vs-ktown4u",
    ko: "\uCD08\uB3D9",
    art: "album-stack",
    name: "Shop or Ktown4u",
    koLine: "\uC704\uBC84\uC2A4\uC0F5 vs \uCF00\uC774\uD0C0\uC6B4\uD3EC\uC720 \u2014 \uB458 \uB2E4 \uD55C\uD130\uC5D0 \uC7A1\uD799\uB2C8\uB2E4",
    title: "Weverse Shop or Ktown4u: the comparison nobody writes, because both pages are about one store",
    summary:
      "They both report to Hanteo, so the chart question does not decide it. What decides it is which store has your release, whose clock you can meet, and \u2014 more than either \u2014 which one publishes the thing you need to know.",
    glyph: "parcel",
    status: "sourced",
    lastChecked: "2026-10-21",
    scope:
      "A head-to-head on the two shops an overseas fan actually chooses between for a Korean album. It is assembled from claims this site checked on 21 October 2026 against Hanteo\u0027s certified-store register and each shop\u0027s own notices, which is why it carries that date rather than today\u0027s: the comparison is new, the facts in it are not re-checked. It covers chart reporting, catalogue, payment deadlines, where cost appears, shipping refusals and support hours. It does not rank them on price or speed, because neither is a property of the shop \u2014 both depend on your country, your release and the week.",
    readMinutes: 8,
    platforms: ["Weverse Shop", "Ktown4u", "Hanteo"],
    intro: [
      "This site has a guide to ordering from Weverse Shop and a guide to ordering from Ktown4u, and neither mentions the other once. That is fine for a reader who has already chosen, and useless for the much larger number who have not.",
      "The answer is not the one most threads give. Both shops are Hanteo-certified, so the chart argument that usually settles this is not an argument at all. What actually separates them is narrower and stranger: they publish different things, and the gaps are not in the same places.",
    ],
    steps: [
      {
        title: "Settle the chart question first, because it is the one people get wrong",
        body: "The common belief is that buying from the official shop counts and buying from a reseller does not. For these two it is simply false, and it is checkable rather than a matter of trust. Hanteo publishes its certified Family stores with a code each: Ktown4U is HF0082KTU001 and Weverse is HF0082BTS001. Hanteo also requires every online Family store to display the Family mark in its footer, linked back to hanteochart.com, so the shop and the register confirm each other from both ends. Certification is reissued each year, so check the code rather than take it from this page.",
        pitfall:
          "Choosing the more expensive shop to protect a chart contribution that was never at risk. If the chart is the whole reason you are paying more, you are paying for something you already had.",
        takes: "5 minutes",
        see: {
          slug: "buy-k-pop-albums-from-overseas",
          text: "What the chart actually counts, and what it does not",
        },
      },
      {
        title: "Ask which store has your release before you compare anything else",
        body: "This decides more orders than price does, and it is asymmetric. Ktown4u is a general retailer and carries releases across labels. Weverse Shop is not one store at all: there is a GLOBAL shop and there are region shops, they carry different stock, they run different pre-order windows and they ship from different places. An item a fan in another country ordered may not exist in yours. So the comparison is often not Weverse against Ktown4u \u2014 it is Ktown4u against whichever Weverse Shop you happen to be in.",
        pitfall:
          "Reading a pre-order deadline off somebody else\u0027s Weverse Shop. A cut-off in one store tells you nothing about the others, and the inclusions are tied to the window rather than to the album.",
        takes: "10 minutes",
        see: {
          slug: "order-from-weverse-shop-overseas",
          text: "Working out which Weverse Shop you are in",
        },
      },
      {
        title: "Know whose clock you have to meet",
        body: "Ktown4u publishes one and it is short. An unpaid order is cancelled automatically six hours after it is placed \u2014 cut from twenty-four, effective 19 February 2025 KST. For a fan ordering at midnight in Europe or the Americas, six Korean hours can pass entirely while asleep, and a pre-order placed but not paid is a pre-order that was never placed. Weverse Shop publishes no equivalent deadline in the notices this site reads, which is not the same as there being none. The asymmetry is the practical point: one shop tells you how long you have.",
        pitfall:
          "Placing a Ktown4u pre-order to secure it and paying in the morning. That is the one habit the six-hour rule exists to defeat, and it defeats it silently \u2014 nothing alerts you, the order is simply gone.",
        takes: "5 minutes",
        see: {
          slug: "ktown4u-ordering-shipping-and-fees",
          text: "The six-hour clock, and the other Ktown4u rules under it",
        },
      },
      {
        title: "Expect the cost to appear in different places",
        body: "Neither shop\u0027s product page is the price you pay, and they diverge after that. Since 3 February 2026 Weverse calculates tax from your shipping and billing address: orders to Korea show tax-inclusive prices throughout, orders anywhere else show the price without tax and add the destination\u0027s tax at checkout once an address is entered. Ktown4u\u0027s additions land later and land differently \u2014 it raised international shipping by 7% effective 1 February 2026, and for US shipments since 2 June 2025 it applies a USD 12 charge where duties are owed and were not prepaid electronically, collected from the recipient at delivery.",
        pitfall:
          "Comparing two carts. Weverse has already added the tax by then and Ktown4u has not yet added the twelve dollars, so the cart that looks cheaper at checkout is not reliably the one that costs less at the door.",
        takes: "15 minutes",
      },
      {
        title: "Check which one will ship to you, in the form each of them says it",
        body: "Both refuse some destinations and they announce it differently. Weverse maintains a list of countries and regions it cannot ship to from South Korea; the 15 July 2026 revision names Myanmar, the Democratic Republic of the Congo, Iraq, Iran, Lebanon, Mali, Russia, Andorra, Ukraine, Belarus, Afghanistan, the Netherlands Antilles, Israel and Turkey. Ktown4u does it per method rather than per country: it suspended K-Packet to Germany and Spain from 17 January 2025 when those postal operators left the arrangement it runs on, and it publishes disruptions down to individual postal codes. One list tells you whether you can order at all; the other tells you whether the method you used last time still exists.",
        pitfall:
          "Assuming a country that appears on neither list is clear. Ktown4u\u0027s stated handling when a method is withdrawn is to email affected customers about moving to another service and the extra cost \u2014 so an order already placed can change price after the fact.",
        takes: "10 minutes",
      },
      {
        title: "Read the payment lists, and notice that only one shop has them",
        body: "Weverse publishes what you can pay with, per currency, and the lists are not the same length. USD gets PayPal, Eximbay, Alipay+, Apple Pay, WeChat Pay and Grab Pay. JPY gets that list without Grab Pay. CNY drops PayPal. MXN is the shortest at two \u2014 PayPal and Apple Pay, both digital, no cash option. KRW adds Korean cards and the Korean wallets. Your default currency therefore decides your buttons before you reach checkout. Ktown4u publishes no comparable list in its notices, so what it accepts has to be read off its own checkout.",
        pitfall:
          "Setting a currency for the price rather than for the payment method. If neither of a short list is set up for you, there is no third button at checkout and no workaround at that point.",
        takes: "10 minutes",
      },
      {
        title: "Work out who you can reach when it goes wrong, and when",
        body: "Ktown4u states its hours: customer service on weekdays 10:00 to 17:00 KST since 1 November 2023, with a lunch break from 12:30 to 13:30. That is five and a half hours on Korean weekdays, which for most readers here is the middle of the night, and it compounds with the six-hour payment clock \u2014 an order placed on a Friday evening in Europe can expire before anyone is at a desk. It also pauses both despatch and support over Korean holidays and publishes the dates each time. Weverse Shop does not publish support hours in the same place; its cancellation behaviour is the better-documented half and has a guide of its own here.",
        pitfall:
          "Treating a Korean public holiday as a delivery delay. Ktown4u pauses support across the same days, so the week you most want to ask about a parcel is the week nobody answers.",
        takes: "10 minutes",
        see: {
          slug: "weverse-shop-shipping-delays-and-cancellation",
          text: "When a Weverse Shop order can still be cancelled",
        },
      },
    ],
    faq: [
      {
        q: "Does a Ktown4u order count toward the Korean charts, or do I have to buy from Weverse?",
        a: "Both count. Hanteo lists both as certified Family stores \u2014 Ktown4U as HF0082KTU001 and Weverse as HF0082BTS001 \u2014 and requires each to show the Family mark in its footer linked back to the register. Certification is reissued each year, so confirm the code on hanteochart.com rather than taking it from here.",
      },
      {
        q: "Which one is cheaper?",
        a: "Neither, as a property of the shop. What the album costs you depends on your country, the release and the week: Weverse adds your destination\u0027s tax at checkout, Ktown4u raised international shipping 7% in February 2026 and adds USD 12 on US deliveries where duties were not prepaid. Compare the landed cost for your address on the day, not the two product pages.",
      },
      {
        q: "Which one ships faster?",
        a: "Not answerable in general, and the question that is answerable matters more: which methods still run to your country. Ktown4u withdraws shipping methods by country \u2014 K-Packet to Germany and Spain from January 2025 \u2014 and publishes disruptions down to postal codes, while Weverse publishes a list of destinations it cannot ship to at all. Check the current notice for your country before comparing delivery estimates.",
      },
      {
        q: "Can I just order the same album from both?",
        a: "You can, and it is a real strategy for pre-order inclusions, which are tied to the window and often to the specific retailer rather than to the album. Price it as two landed costs rather than two album prices, and remember the inclusions stop when the window closes, not when the album is released.",
      },
      {
        q: "I am in the United States. Does that change the answer?",
        a: "It changes one line of it. Since 2 June 2025 Ktown4u applies a USD 12 charge on US shipments where duties, taxes or other government charges are owed and were not prepaid electronically before delivery, billed to the recipient at the door. Ktown4u publishes the way out as well: prepay through UPS\u0027s import duties and taxes system. That is a flat addition to compare against whatever tax Weverse adds at your checkout.",
      },
      {
        q: "Why does this page compare so few things?",
        a: "Because the rest is not published. The honest finding of putting the two side by side is that they document different halves: Ktown4u states its payment deadline, its support hours and its per-country shipping changes; Weverse states its payment methods per currency, its tax behaviour and its shipping exclusions. Where a shop does not publish something this page says so instead of estimating it, which is why there is no speed ranking and no price verdict.",
      },
    ],
    sources: [
      {
        label: "Hanteo Chart \u2014 certified Family stores, where Ktown4U is HF0082KTU001 and Weverse is HF0082BTS001",
        url: "https://www.hanteochart.com/en/family/search",
      },
      {
        label: "Hanteo Chart \u2014 Family store guide: the footer mark, and the instruction to check the code",
        url: "https://www.hanteochart.com/en/family/guide",
      },
      {
        label: "Weverse Shop \u2014 tax calculated from the shipping and billing address, 3 February 2026",
        url: "https://shop.weverse.io/en/notices/12149",
      },
      {
        label: "Weverse Shop \u2014 countries and regions Korea cannot ship to, revised 15 July 2026",
        url: "https://shop.weverse.io/en/notices/216",
      },
      {
        label: "Ktown4u \u2014 unpaid orders cancelled after six hours, effective 19 February 2025",
        url: "https://www.ktown4u.com/notices/7001",
      },
      {
        label: "Ktown4u \u2014 the USD 12 charge on US deliveries where duties were not prepaid, from 2 June 2025",
        url: "https://www.ktown4u.com/notices/7123",
      },
      {
        label: "Ktown4u \u2014 international shipping raised 7%, effective 1 February 2026",
        url: "https://www.ktown4u.com/notices/7360",
      },
      {
        label: "Ktown4u \u2014 K-Packet suspended to Germany and Spain from 17 January 2025",
        url: "https://www.ktown4u.com/notices/6960",
      },
      {
        label: "Ktown4u \u2014 the notices page, which is the live version of all of the above",
        url: "https://www.ktown4u.com/notices",
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

/**
 * A reproduced document renders its credit or it does not render.
 *
 * This is the paid-link rule applied to somebody else's copyright: a credit
 * that a person has to remember is one that will be missing from the page
 * that gets screenshotted, and here the cost of that is not an awkward
 * conversation but a licence breach. Every field is required, `file` is a
 * path under public/ rather than a remote URL so the copy is the one that was
 * checked, and the page it came from has to be among the guide's own sources
 * — a document reproduced from somewhere the guide does not cite is a claim
 * with no trail back to it.
 */
for (const guide of guides) {
  const doc = guide.document;
  if (!doc) continue;
  for (const [key, value] of Object.entries(doc)) {
    if (typeof value === "string" ? value.trim() === "" : !(value > 0)) {
      throw new Error(
        `${guide.slug} reproduces a document with an empty "${key}". Every ` +
          `field is required: the licence and the credit are the terms the ` +
          `copy is allowed to exist on.`,
      );
    }
  }
  if (doc.file.startsWith("/") || doc.file.includes("..")) {
    throw new Error(
      `${guide.slug} document.file must be a path under public/img, not ` +
        `"${doc.file}".`,
    );
  }
  if (!guide.sources.some((x) => x.url === doc.sourceUrl)) {
    throw new Error(
      `${guide.slug} reproduces a document from ${doc.sourceUrl}, which is ` +
        `not among its sources. Cite the page before reproducing what is on it.`,
    );
  }
}

/**
 * `reported` is derived from field reports, and cannot be written by hand.
 *
 * This is the same rule as the paid-link disclosure and the expiry seal, for
 * the same reason: a claim about evidence that somebody types is a claim that
 * will eventually be typed without the evidence. `draft` and `sourced` are
 * things an author can attest to alone, so the content sets those. `reported`
 * asserts that other people walked the flow, which is only true if their
 * reports are in content/reports.ts — so it is lifted from there, and setting
 * it in the content fails the build.
 *
 * `verified` stays hand-set, because it means a person on this side went
 * through the flow, and no register can establish that for them.
 */
for (const guide of guides) {
  if (guide.status === "reported") {
    throw new Error(
      `${guide.slug} sets status "reported" by hand. That rung is derived ` +
        `from content/reports.ts — add the field reports that justify it and ` +
        `set "sourced" here, or the page claims evidence nobody holds.`,
    );
  }
}

for (const report of reports) {
  if (!guides.some((g) => g.slug === report.slug)) {
    throw new Error(
      `content/reports.ts has a report for an unknown guide: ${report.slug}`,
    );
  }
  if (Date.parse(`${report.walked}T00:00:00Z`) > Date.now()) {
    throw new Error(
      `${report.slug}: a field report claims to have been walked on ` +
        `${report.walked}, which is in the future.`,
    );
  }
  if (report.checked < report.walked) {
    throw new Error(
      `${report.slug}: a field report was checked on ${report.checked}, ` +
        `before the ${report.walked} walk it describes.`,
    );
  }
  const guide = guides.find((g) => g.slug === report.slug)!;
  const most = guide.steps.length;
  for (const n of report.steps) {
    if (n < 1 || n > most || !Number.isInteger(n)) {
      throw new Error(
        `${report.slug}: a field report names step ${n}, and the guide has ` +
          `${most} steps.`,
      );
    }
  }
}

// The lift itself, after validation so it cannot run on a bad register.
for (const guide of guides) {
  if (guide.status === "sourced" && reportCount(guide.slug) > 0) {
    guide.status = "reported";
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
