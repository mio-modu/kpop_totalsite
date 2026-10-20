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
        body: "Buy from the official store for that artist. Keep the order confirmation and the membership number. If the membership is a physical kit with a digital code, allow for the code's delivery and activation time, which is not instant.",
        pitfall:
          "Resold or gifted membership codes frequently fail verification because the registered name will not match your ticketing account.",
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
