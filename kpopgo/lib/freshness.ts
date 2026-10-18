import type { Guide, GuideStatus } from "@/content/guides";

/**
 * How a claim ages — and how fast, depending on what kind of claim it is.
 *
 * The site's whole premise is that it is not stale, and the guides it competes
 * with are stale precisely because someone checked them once and the page kept
 * saying so for years. A stored status has the same failure built in: it is a
 * claim made on one day that keeps being displayed on every day after.
 *
 * So what renders is derived, not stored. `status` in the content is what a
 * person did; `displayStatus` is what the page is still entitled to say about
 * it. Past the shelf life the seal comes down on its own — nobody has to
 * remember, which is the point, because nobody does.
 *
 * "stale" is deliberately not the same as "draft". Draft means nobody ever
 * checked it. Stale means somebody did, on a date you can see, and that date
 * is now old enough that you should check the official announcement yourself.
 * Collapsing the two would throw away true information.
 */

/**
 * Days a status stays current. `null` never expires, because it asserts
 * nothing that could go out of date.
 *
 * The ladder is not arbitrary, and the weaker claim is the one that goes off
 * faster. "verified" means a person went through the flow and saw the screens,
 * so six months is a fair shelf life. "sourced" means the official
 * documentation said so on a date — and out-of-date documentation is exactly
 * what is wrong with every guide this site competes against, so it gets three
 * months. A claim nobody walked must never be allowed to outlive one somebody
 * did.
 */
export const SHELF_LIFE: Record<GuideStatus, number | null> = {
  draft: null,
  sourced: 90,
  reported: 120,
  verified: 180,
};

/**
 * CI starts complaining two thirds of the way through a shelf life, leaving
 * the last third as the window to act in. It is derived rather than stored as
 * a second table so the two cannot drift apart — and it lands on 120 days for
 * a verified guide, which is where the threshold already was.
 */
export const WARN_FRACTION = 2 / 3;

export type DisplayStatus = GuideStatus | "stale";

/** Whole days between a YYYY-MM-DD date and now. A future date reads as 0. */
export function daysSince(date: string, now: Date = new Date()): number {
  const then = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(then)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((now.getTime() - then) / 86_400_000));
}

/** Days this status is good for, or null if it never expires. */
export function expiresAfter(status: GuideStatus): number | null {
  return SHELF_LIFE[status];
}

/** Days after which this status is worth re-checking, or null. */
export function warnsAfter(status: GuideStatus): number | null {
  const life = SHELF_LIFE[status];
  return life === null ? null : Math.round(life * WARN_FRACTION);
}

export function displayStatus(guide: Guide, now: Date = new Date()): DisplayStatus {
  const life = SHELF_LIFE[guide.status];
  if (life === null) return guide.status;
  return daysSince(guide.lastChecked, now) > life ? "stale" : guide.status;
}

/** True once a dated claim is close enough to expiry to be worth re-checking. */
export function needsAttention(guide: Guide, now: Date = new Date()): boolean {
  const warn = warnsAfter(guide.status);
  return warn !== null && daysSince(guide.lastChecked, now) > warn;
}

/** Days until this claim expires. Negative once it already has. */
export function daysLeft(guide: Guide, now: Date = new Date()): number | null {
  const life = SHELF_LIFE[guide.status];
  return life === null ? null : life - daysSince(guide.lastChecked, now);
}
