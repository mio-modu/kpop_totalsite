/**
 * What readers report after actually walking a flow.
 *
 * This file exists because of the gap it fills. `status` is a ladder of
 * evidence — `draft`, `sourced`, `reported`, `verified` — and every guide on
 * this site sits on the second rung. `sourced` means every claim traces to a
 * linked, dated official source. `verified` means a person went through the
 * flow and saw the screens. Nobody has, so nothing is verified, and the site's
 * entire argument is that it is more accurate than the stale guides that
 * currently rank.
 *
 * One person cannot walk twenty flows across four platforms from one country.
 * But a reader in Taipei who just passed the eKYC check has already walked one
 * of them, and the only thing standing between that and evidence is somewhere
 * to put it. That is the whole idea here, and the rung it fills — `reported` —
 * was built into the ladder from the start and has been empty ever since.
 *
 * ── Why this is not a comment section ───────────────────────────────────
 *
 * It was going to be. A comment section on these pages fails in four specific
 * ways, and three of them are not recoverable:
 *
 *  1. The first thing it fills with is identity-check workarounds. That is
 *     what fans most want to know and what this site refuses to publish, so an
 *     open box on these pages is an intake pipe for the one category of
 *     content the project has banned. A reader who follows that advice loses
 *     their order.
 *  2. A stranger's guess renders in the same typeface as a sourced claim, and
 *     the reader cannot tell them apart. The site's only product is being
 *     right, and one confidently wrong comment spends it.
 *  3. Reader-submitted links are an AdSense policy problem before they are a
 *     spam problem, and a rejection carries a cooldown.
 *  4. Moderating free text about resale law, customs declarations and
 *     biometric retention, in four languages, is unbounded work.
 *
 * So submissions are structured, and **nothing a reader sends publishes
 * itself**. A report lands with a human, who reads it, and if it holds up it
 * is entered here by hand. What the page then shows is not a stranger's
 * opinion but a count against this site's own evidence standard: three
 * readers reported walking this, on these dates. That is a stronger claim than
 * a comment thread, not a weaker one, and it carries none of the four costs.
 *
 * ── Why the destination is empty ────────────────────────────────────────
 *
 * `REPORT_TO` is unset, so /report renders the questions and the template and
 * no submit target. Same pattern as `AdSlot` with no ad ids and this file's
 * sibling `affiliates.ts` with no partners: the machinery lands first and the
 * page is honest about what it cannot yet do. Setting it is a decision about
 * publishing an address on a website, which belongs to whoever owns the
 * address — and a dedicated one, not a personal one, because this string goes
 * in the HTML where anything can read it.
 */

/**
 * One reader, one flow, one day.
 *
 * Deliberately narrow. A report is not a review and not a thread — it answers
 * "did this page match the screens, on what day, from where", which is the
 * only question the status ladder needs answering.
 */
export type FieldReport = {
  /** The guide walked. Checked against the register at build time. */
  slug: string;
  /** The day the reader walked it, not the day they wrote in. YYYY-MM-DD. */
  walked: string;
  /**
   * Where they were buying from. Import rules, payment behaviour and which
   * site a reader is even eligible for all turn on this, so a report without
   * it cannot be weighed.
   */
  country: string;
  /** The platform they actually used, in the platform's own name. */
  platform: string;
  /**
   * Which steps they got through, by number. A report that covers steps 1-4
   * of a nine-step guide is still evidence, and pretending otherwise would
   * throw it away — but so would recording it as if it covered all nine.
   */
  steps: number[];
  /**
   * What the screens said, in the reader's words, trimmed to the facts.
   *
   * Not published verbatim: it is the raw material for correcting the English,
   * and quoting a stranger on a page whose product is accuracy reintroduces
   * the problem the structure exists to avoid.
   */
  saw: string;
  /** The day someone read this report and decided it holds up. */
  checked: string;
};

/**
 * Empty, and accurately so: nobody has reported walking anything yet.
 *
 * /editorial-policy reads this directly, so the page cannot claim evidence
 * this file does not hold.
 */
export const reports: FieldReport[] = [];

/**
 * Where a report goes. Empty until an address exists for it.
 *
 * A `mailto:` keeps the whole thing at zero cost and zero infrastructure,
 * which matters on a site with no server routes at all, and keeps submissions
 * private by default — the two properties that make this work rather than
 * become a comment section with extra steps.
 */
export const REPORT_TO = "";

/** Reports for one guide, oldest walk first. */
export function reportsFor(slug: string): FieldReport[] {
  return reports
    .filter((r) => r.slug === slug)
    .sort((a, b) => a.walked.localeCompare(b.walked));
}

/** How many readers have reported walking this flow. */
export function reportCount(slug: string): number {
  return reports.filter((r) => r.slug === slug).length;
}

/**
 * The questions /report asks, and the order it asks them in.
 *
 * Here rather than in the page because the same list builds the form, the
 * copy-ready template and the test that checks the two cannot drift apart. A
 * question added to the page and not the template is a field that never
 * arrives.
 */
export const QUESTIONS: { key: string; ask: string; why: string }[] = [
  {
    key: "guide",
    ask: "Which guide did you follow?",
    why: "The page title or its address is enough.",
  },
  {
    key: "walked",
    ask: "What date did you do it?",
    why: "Platforms change. A report without a date ages into the thing this site exists to replace.",
  },
  {
    key: "country",
    ask: "Which country were you buying from?",
    why: "Payment behaviour, import rules and which site you are even eligible for all turn on this.",
  },
  {
    key: "platform",
    ask: "Which platform did you actually use?",
    why: "Its own name, as it appeared on the screen.",
  },
  {
    key: "steps",
    ask: "Which steps did you get through?",
    why: "Step numbers. Getting partway is still useful — say where you stopped.",
  },
  {
    key: "saw",
    ask: "What did the screens actually say?",
    why: "The wording, the button labels, the error. This is the part that corrects the guide.",
  },
  {
    key: "wrong",
    ask: "Was anything on the page wrong?",
    why: "The most valuable answer on this list. Quote the sentence if you can.",
  },
];

/**
 * A plain-text template a reader can copy, built from the same questions.
 *
 * It exists so the page is useful before `REPORT_TO` is set, and so a reader
 * who would rather send this through any other channel can.
 */
export const TEMPLATE = QUESTIONS.map((q) => `${q.ask}\n`).join("\n");
