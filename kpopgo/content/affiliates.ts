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
 * /editorial-policy reads this list directly, so the claim on that page
 * cannot drift from the truth in this file.
 */
export const partners: Partner[] = [
  {
    id: "klook",
    name: "Klook",
    what: "Hotels, tours and transport in Korea, bookable from outside it.",
    // No rate quoted, because none has been confirmed yet. A percentage
    // invented to make this sentence sound specific would be the one lie on
    // the page whose whole job is being checkable. Add it here when Klook's
    // own dashboard states the accommodation rate, and move `checked`.
    howWeArePaid: "Klook pays this site a commission if a reader opens the link and books something. It costs the reader nothing extra, and the commission never decides what a step says — where the paying option is the worse one, the guide says it is worse.",
    /*
     * The long form rather than the short one Klook also offers.
     *
     * affiliate.klook.com/sl/1Ou1OuQ is tidier and says nothing: a reader
     * hovering it, and the next person auditing this file, both learn only
     * that it goes somewhere. The field's whole purpose is that there is one
     * place to see what is being passed along, and an opaque redirect defeats
     * it. The destination is also trimmed — Klook's generator appended `spm`
     * and a `clickId` minted in the browsing session that produced the link,
     * and neither belongs in a URL thousands of readers share. The attribution
     * is `aid` and `aff_adid`, which are untouched.
     */
    url: "https://affiliate.klook.com/redirect?aid=140222&aff_adid=1516924&k_site=https%3A%2F%2Fwww.klook.com%2Fen-US%2Fsearch%2Fresult%2F%3Fquery%3DSEOUL%26search_scope%3Dmain_search%26tab_key%3D54",
    checked: "2026-10-22",
  },
];

export function getPartner(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}
