/**
 * What this site got wrong, and when it was fixed.
 *
 * A site whose product is being right has to publish the times it was not.
 * Any page can say "we check our sources"; the only evidence that means
 * anything is a dated list of the occasions the checking failed. A corrections
 * log that stays empty is either a very young site or a dishonest one, and
 * this one started with an entry.
 *
 * Rules for adding to it:
 *  - Every factual error that reached a published page goes here. Typos and
 *    wording changes do not — this is for claims a reader could have acted on.
 *  - `found` records how it surfaced, because "a reader told us" and "we
 *    noticed" are different claims about how well the process works.
 *  - Never edit an entry to make it sound smaller. Correct it in place only if
 *    the correction itself was wrong, and say so.
 */

export type Correction = {
  /** The day the fix shipped. */
  date: string;
  /** Where the error was, in words a reader can locate. */
  where: string;
  /** What was wrong. Stated plainly, not minimised. */
  wrong: string;
  /** What is true, with the source that settles it. */
  right: string;
  /** How it came to light. */
  found: string;
};

export const corrections: Correction[] = [
  {
    date: "2026-10-19",
    where:
      "The home page timeline, step 7 of the ticketing guide, and the 부정거래 entry in the glossary",
    wrong:
      "All three said South Korea's revised Performances Act took effect on 28 August 2025.",
    right:
      "It came into force on 28 August 2026 — amended by the National Assembly on 29 January 2026 and promulgated on 27 February. The law had been in effect for seven weeks, not fourteen months, which changes how settled its enforcement is.",
    found:
      "An outside review checked the cited sources rather than the prose. Nobody here caught it in four days of publication.",
  },
];
