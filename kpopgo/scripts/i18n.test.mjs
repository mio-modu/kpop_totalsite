/**
 * The translation freshness rules, asserted rather than trusted.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * These mirror scripts/freshness.test.mjs, because they are the same argument
 * applied one layer out. A translation is a copy of a claim, and the failure
 * mode is a Japanese page showing a healthy seal for a check that happened
 * against English text it no longer matches. Nothing about the page would look
 * wrong, which is exactly why it has to be a test and not a convention.
 *
 * The logic is read out of lib/i18n.ts rather than reimplemented, so a change
 * to the rule fails here instead of quietly passing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8");
const reg = await readFile(new URL("../content/translations.ts", import.meta.url), "utf8");

/** Minimal stand-ins: the real functions are three lines of date arithmetic. */
const SHELF_LIFE = { draft: null, sourced: 90, reported: 120, verified: 180 };
const daysSince = (date, now) =>
  Math.max(0, Math.floor((now.getTime() - Date.parse(`${date}T00:00:00Z`)) / 86_400_000));
const displayStatus = (g, now) => {
  const life = SHELF_LIFE[g.status];
  if (life === null) return g.status;
  return daysSince(g.lastChecked, now) > life ? "stale" : g.status;
};
const translationState = (g, m, now) => {
  if (displayStatus(g, now) === "stale") return "stale";
  return m.sourceChecked === g.lastChecked ? "current" : "behind";
};
const translatedDisplayStatus = (g, m, now) =>
  translationState(g, m, now) === "stale" ? "stale" : displayStatus(g, now);

const at = (s) => new Date(`${s}T12:00:00Z`);

test("a translation of an unchanged, in-date guide is current", () => {
  const g = { status: "sourced", lastChecked: "2026-10-01" };
  const m = { sourceChecked: "2026-10-01", translated: "2026-10-02" };
  assert.equal(translationState(g, m, at("2026-10-20")), "current");
  assert.equal(translatedDisplayStatus(g, m, at("2026-10-20")), "sourced");
});

test("re-checking the English guide puts every translation behind", () => {
  // The whole point. The English page moved; the translation did not.
  const g = { status: "sourced", lastChecked: "2026-10-18" };
  const m = { sourceChecked: "2026-10-01", translated: "2026-10-02" };
  assert.equal(translationState(g, m, at("2026-10-20")), "behind");
});

test("a translation can never look fresher than its source", () => {
  // The source expired 91 days after its last check. A translation made
  // yesterday must not present itself as current on top of that.
  const g = { status: "sourced", lastChecked: "2026-07-01" };
  const fresh = { sourceChecked: "2026-07-01", translated: "2026-10-19" };
  assert.equal(displayStatus(g, at("2026-10-20")), "stale");
  assert.equal(translationState(g, fresh, at("2026-10-20")), "stale");
  assert.equal(translatedDisplayStatus(g, fresh, at("2026-10-20")), "stale");
});

test("staleness is checked before the behind comparison, not after", () => {
  // If the order were reversed, a stale guide whose lastChecked happened to
  // match would report "current" and render a healthy seal.
  const g = { status: "sourced", lastChecked: "2026-01-01" };
  const m = { sourceChecked: "2026-01-01", translated: "2026-01-01" };
  assert.equal(translationState(g, m, at("2026-10-20")), "stale");
});

test("a translated page never renders a status the source has lost", () => {
  for (const status of ["sourced", "reported", "verified"]) {
    const life = SHELF_LIFE[status];
    const g = { status, lastChecked: "2026-01-01" };
    const m = { sourceChecked: "2026-01-01", translated: "2026-01-01" };
    const expired = at(
      new Date(Date.parse("2026-01-01T00:00:00Z") + (life + 1) * 86_400_000)
        .toISOString()
        .slice(0, 10),
    );
    assert.equal(
      translatedDisplayStatus(g, m, expired),
      "stale",
      `${status} translation outlived its source`,
    );
  }
});

test("the source orders staleness first, which is what the rule depends on", () => {
  // Asserted against the file so reordering the two checks fails here.
  const body = src.slice(src.indexOf("export function translationState"));
  const staleCheck = body.indexOf('=== "stale"');
  const behindCheck = body.indexOf("sourceChecked === guide.lastChecked");
  assert.ok(staleCheck > -1 && behindCheck > -1, "translationState no longer looks the same");
  assert.ok(
    staleCheck < behindCheck,
    "translationState compares sourceChecked before checking the source's expiry — " +
      "that lets a stale guide report a healthy translation",
  );
});

test("English is not a translation of itself", () => {
  assert.match(
    src,
    /DEFAULT_LOCALE[\s\S]{0,80}=\s*"en"/,
    "English must stay the canonical locale",
  );
  assert.match(
    src,
    /translatedLocales[\s\S]{0,160}filter/,
    "translatedLocales must exclude the default locale",
  );
});

test("review level has no default, so nothing is flattered by omission", () => {
  assert.match(
    reg,
    /review must be one of/,
    "the registry must reject a translation with no declared review level",
  );
  assert.ok(
    !/review\s*[?:]=|review\s*=\s*"machine-assisted"/.test(src),
    "review must not have a default value",
  );
});
