/**
 * Who pays this site, and for what.
 *
 * Built before the first affiliate link exists, on purpose. A disclosure that
 * someone has to remember to add is a disclosure that will eventually be
 * missing from one page, and the page it is missing from will be the one
 * somebody screenshots. So the rule here is the same one the status badges
 * follow: the disclosure is *derived from the content*, never written by hand.
 *
 * A step that carries a `partner` makes its guide show the paid-link notice,
 * automatically, above the first step. Remove the last partner from a guide
 * and the notice disappears by itself. Nobody has to notice.
 *
 * The other reason to build it first: knowing a section may one day carry a
 * paid link changes how the section is written today. A guide that names the
 * real trade-offs between payment methods is honest now and can carry a link
 * later. A guide that has no such section would have to grow one to fit a
 * link, and a reader can always tell when that has happened.
 *
 * ── Rules, which are not negotiable ─────────────────────────────────────
 *
 *  1. A link goes in only where the thing would have been named anyway.
 *     Never add a step, a sentence, or a recommendation because it pays.
 *  2. The commission never changes the advice. If the paying option is the
 *     worse one, the guide says the worse one is worse.
 *  3. Every paid link is `rel="sponsored"`, visibly marked, and disclosed
 *     above the content that contains it — not in a footer nobody reads.
 *     The US FTC requires disclosure to be clear and before the link; this
 *     site's audience is largely American, and its only asset is being
 *     believed.
 *  4. Every partner here is listed in public on /editorial-policy, with what
 *     they sell and how they pay us.
 *  5. `checked` is the day someone confirmed this partner still does what
 *     this file says. Same discipline as a guide, for the same reason.
 */

export type Partner = {
  /** Referenced from a step's `partner.id`. Checked at build time. */
  id: string;
  name: string;
  /** What they actually sell, in our words rather than theirs. */
  what: string;
  /** How we are paid, written for a reader rather than for an accountant. */
  howWeArePaid: string;
  /**
   * The destination, tracking parameters included. They live here and nowhere
   * else, so there is exactly one place to audit what is being passed along.
   */
  url: string;
  /** The day someone last confirmed the above is still true. */
  checked: string;
};

/**
 * Empty, and accurately so: this site carries no paid links today.
 *
 * /editorial-policy reads this list directly and says so in as many words, so
 * the claim on that page cannot drift from the truth in this file.
 */
export const partners: Partner[] = [];

export function getPartner(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}
