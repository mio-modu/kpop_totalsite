/**
 * Field reports, and the rung they are the only route onto.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * `reported` is the one status on this site that asserts something about other
 * people: that readers walked the flow and said what they saw. Every other
 * rung is something the author can attest to alone — `draft` and `sourced` are
 * claims about their own work, and `verified` is a claim about their own feet.
 *
 * A claim about other people is exactly the kind that rots when it is stored
 * rather than derived. Somebody types `reported` because it feels true, or
 * because a guide was improved after a conversation nobody wrote down, and the
 * page then says readers walked a flow that no record shows anyone walking.
 * That is the failure this file exists to make impossible, and it is the same
 * failure the expiry seal and the paid-link disclosure were each built against.
 *
 * So: the content may not set it, the register has to justify it, and the
 * page's wording has to come from the register rather than from a sentence
 * somebody wrote once.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const GUIDES = await read("content/guides.ts");
const REPORTS = await read("content/reports.ts");
const POLICY = await read("app/editorial-policy/page.tsx");
const GUIDE_PAGE = await read("app/guides/[slug]/page.tsx");
const REPORT_PAGE = await read("app/report/page.tsx");

const guideSlugs = [...GUIDES.matchAll(/^ {4}slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);

test("no guide sets `reported` by hand", () => {
  const hand = [...GUIDES.matchAll(/^ {4}status: "(\w+)",$/gm)]
    .map((m) => m[1])
    .filter((s) => s === "reported");
  assert.deepEqual(
    hand,
    [],
    "a guide sets status \"reported\" in the content. That rung is derived from " +
      "content/reports.ts — the page would be claiming that readers walked a flow " +
      "with no record that anyone did.",
  );
});

test("the build refuses a hand-written `reported`", () => {
  // Asserted against the source because it is the enforcement, not a style
  // point: without this throw the rule above is a convention, and a convention
  // is what the paid-link disclosure was before it failed the build.
  assert.match(
    GUIDES,
    /guide\.status === "reported"[\s\S]{0,400}?throw new Error/,
    "content/guides.ts no longer fails the build on a hand-set `reported`",
  );
  assert.match(
    GUIDES,
    /reportCount\(guide\.slug\) > 0/,
    "content/guides.ts no longer lifts `sourced` to `reported` from the register",
  );
});

test("every report names a guide that exists, in the past, checked after the walk", () => {
  const entries = [...REPORTS.matchAll(/\{\s*slug: "([a-z0-9-]+)",\s*walked: "([\d-]+)",[\s\S]*?checked: "([\d-]+)",/g)];
  for (const [, slug, walked, checked] of entries) {
    assert.ok(guideSlugs.includes(slug), `report names unknown guide ${slug}`);
    assert.ok(walked <= new Date().toISOString().slice(0, 10), `${slug}: walked in the future`);
    assert.ok(checked >= walked, `${slug}: checked ${checked} before the ${walked} walk`);
  }
});

test("the register is honest about being empty", () => {
  const empty = /export const reports: FieldReport\[\] = \[\];/.test(REPORTS);
  const claims = /\d+ readers have reported/.test(REPORT_PAGE);
  assert.ok(
    !(empty && claims),
    "the register is empty and /report prints a hard-coded count of readers",
  );
});

test("the pages read the register instead of stating a number", () => {
  assert.match(
    GUIDE_PAGE,
    /reportsFor\(/,
    "the guide page no longer derives its report count from the register",
  );
  assert.doesNotMatch(
    POLICY,
    /Today all \{guides\.length\} guides are <strong>Sourced<\/strong>/,
    "the policy page states every guide is sourced as a fixed sentence, which " +
      "goes wrong the day the first field report lands",
  );
  assert.match(
    POLICY,
    /byStatus\.reported/,
    "the policy page does not count reported guides from the register",
  );
});

test("/report asks for nothing that identifies the reader", () => {
  // The questions are the contract with somebody who is about to send a
  // stranger an account of a transaction they just made. Asking for a booking
  // reference would be asking for the one thing that is not ours to hold.
  const questions = REPORTS.slice(REPORTS.indexOf("export const QUESTIONS"));
  for (const bad of ["passport number", "booking reference", "password", "order number"]) {
    assert.doesNotMatch(
      questions,
      new RegExp(bad, "i"),
      `the report questions ask for a ${bad}`,
    );
  }
  assert.match(
    REPORT_PAGE,
    /will not ask you for/i,
    "/report no longer says what it will not ask for, which is the half a " +
      "reader needs before sending anything at all",
  );
});

test("/report sends to the site's one address, and only if it works", () => {
  // The first version of this test asserted the opposite: that /report fell
  // back to `hello@${site.host}`. That was the defect written down as a rule —
  // the fallback pointed at a mailbox nobody had created, so the test was
  // guarding the thing that was broken. Worth leaving the note: a test can
  // encode a bug as a requirement and then defend it.
  assert.match(
    REPORT_PAGE,
    /REPORT_TO \|\| contact\.address/,
    "/report builds its own destination instead of using the site's one address",
  );
  assert.match(
    REPORT_PAGE,
    /contactWorks/,
    "/report offers to send without checking that anything receives it",
  );
});

/**
 * No page prints an email address it assembled itself.
 *
 * This is the assertion that would have caught the original defect. Four pages
 * built `hello@${site.host}` inline, so the string existed in four places and
 * nowhere did anything know whether a mailbox stood behind it. Registering a
 * domain does not create one; it bounced, and the site spent months inviting
 * readers to send corrections into nothing.
 *
 * A reader who writes a correction to a dead address believes they reported
 * it and stops thinking about it, so the error stays and nobody is looking
 * for it any more. That is strictly worse than publishing no address, which
 * is why the component says so plainly when the inbox is unconfirmed.
 */
const SITE = await read("lib/site.ts");
const CONTACT = await read("components/Contact.tsx");

test("no page assembles its own email address", async () => {
  const pages = [
    "app/report/page.tsx",
    "app/editorial-policy/page.tsx",
    "app/privacy/page.tsx",
    "app/about/page.tsx",
  ];
  for (const page of pages) {
    const src = await read(page);
    assert.doesNotMatch(
      src,
      /[\w.]+@\$\{|[\w.]+@[\w.]+\.(app|com|io|kr)/,
      `${page} prints an email address directly instead of using <Contact>, ` +
        `which is how four pages came to publish one that bounced`,
    );
  }
});

test("the address is not shown until a person has watched mail arrive", () => {
  assert.match(
    SITE,
    /confirmed: "(\d{4}-\d{2}-\d{2})?"/,
    "lib/site.ts no longer records when the inbox was last proved to work",
  );
  assert.match(
    CONTACT,
    /if \(contactWorks\)/,
    "<Contact> no longer gates the address on the inbox having been tested",
  );
  assert.match(
    CONTACT,
    /if \(!contactWorks\) return null/,
    "<MailtoButton> renders a mailto even when nothing receives it",
  );
});

test("a confirmed date is a real past date", () => {
  const m = SITE.match(/confirmed: "([^"]*)"/);
  assert.ok(m, "no confirmed field");
  if (m[1] === "") return; // untested, which the pages state honestly
  assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/, `confirmed "${m[1]}" is not a date`);
  assert.ok(
    m[1] <= new Date().toISOString().slice(0, 10),
    `the inbox is recorded as confirmed on ${m[1]}, which is in the future`,
  );
});
