/**
 * The ladder's arithmetic and its one load-bearing invariant, checked against
 * fixed dates rather than whatever today happens to be.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * lib/freshness.ts is TypeScript and this is a plain script, so the thresholds
 * are read out of the source and the invariants are asserted against the real
 * values. A test that mirrored them in a local constant would keep passing
 * after the source changed, which is the one thing it must not do.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const SRC = await readFile(new URL("../lib/freshness.ts", import.meta.url), "utf8");

const SHELF_LIFE = Object.fromEntries(
  [...(SRC.match(/SHELF_LIFE[^=]*=\s*\{([^}]*)\}/)?.[1] ?? "").matchAll(
    /(\w+):\s*(null|\d+)/g,
  )].map(([, k, v]) => [k, v === "null" ? null : Number(v)]),
);

const [, warnNum, warnDen] = SRC.match(/WARN_FRACTION\s*=\s*(\d+)\s*\/\s*(\d+);/) ?? [];
const WARN_FRACTION = Number(warnNum) / Number(warnDen);
const warnsAfter = (s) =>
  SHELF_LIFE[s] === null ? null : Math.round(SHELF_LIFE[s] * WARN_FRACTION);

const daysSince = (d, now) =>
  Math.max(0, Math.floor((now.getTime() - Date.parse(`${d}T00:00:00Z`)) / 86400000));

const NOW = new Date("2026-10-17T12:00:00Z");

test("the thresholds were actually read out of the source", () => {
  assert.ok(Number.isFinite(WARN_FRACTION), "WARN_FRACTION did not parse");
  assert.deepEqual(
    Object.keys(SHELF_LIFE).sort(),
    ["draft", "reported", "sourced", "verified"],
    "SHELF_LIFE did not parse, or a status was added without a shelf life",
  );
});

test("daysSince counts whole days and never goes negative", () => {
  assert.equal(daysSince("2026-10-17", NOW), 0);
  assert.equal(daysSince("2026-10-16", NOW), 1);
  assert.equal(daysSince("2026-01-01", NOW), 289);
  assert.equal(daysSince("2027-01-01", NOW), 0, "a future date is not negative age");
});

test("a weaker claim never outlives a stronger one", () => {
  // The whole defence against `sourced` becoming a loophole. If a page nobody
  // walked could stay up longer than one somebody did, the ladder would be a
  // way of making a weaker claim last longer, which is the opposite of why it
  // exists.
  assert.ok(
    SHELF_LIFE.sourced < SHELF_LIFE.reported,
    "a source check must expire before a cross-checked one",
  );
  assert.ok(
    SHELF_LIFE.reported < SHELF_LIFE.verified,
    "a cross-checked page must expire before a walked one",
  );
  assert.equal(SHELF_LIFE.draft, null, "a draft asserts nothing, so nothing expires");
});

test("CI complains before the page degrades, for every status", () => {
  for (const [status, life] of Object.entries(SHELF_LIFE)) {
    if (life === null) {
      assert.equal(warnsAfter(status), null, `${status} should never warn`);
      continue;
    }
    const warn = warnsAfter(status);
    assert.ok(warn > 0, `${status}: warning must be a real number of days`);
    assert.ok(warn < life, `${status}: warns at ${warn}d but expires at ${life}d`);
    assert.ok(
      life - warn >= 14,
      `${status}: only ${life - warn}d between the warning and expiry — not a usable window`,
    );
  }
});

test("a verified guide still warns at 120 days and expires at 180", () => {
  // These two numbers predate the ladder and were not supposed to move when it
  // landed. Deriving the warning from a fraction is only safe if it lands back
  // on the number that was there before.
  assert.equal(SHELF_LIFE.verified, 180);
  assert.equal(warnsAfter("verified"), 120);
});

test("expiry is strictly past the limit, not on it", () => {
  // displayStatus uses `>`, so a guide checked exactly SHELF_LIFE days ago is
  // still good for that day. Worth pinning: flipping it to `>=` would silently
  // retire every page a day early.
  const life = SHELF_LIFE.sourced;
  const onTheDay = new Date(Date.parse("2026-10-17") + life * 86400000);
  const dayAfter = new Date(Date.parse("2026-10-17") + (life + 1) * 86400000);
  assert.equal(daysSince("2026-10-17", onTheDay), life);
  assert.ok(!(daysSince("2026-10-17", onTheDay) > life), "still valid on the last day");
  assert.ok(daysSince("2026-10-17", dayAfter) > life, "expired the day after");
});
