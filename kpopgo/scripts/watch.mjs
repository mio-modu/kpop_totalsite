/**
 * What this site rots by, and how to hear about it.
 *
 * A guide stops being true in three ways, and only one of them is visible from
 * inside the repository:
 *
 *   1. A source disappears. Ten external URLs carry the evidence for these
 *      five guides — a Yahoo Finance article, a korea.net press release, the
 *      platforms themselves. When one 404s, the claim it backed is still on
 *      the page, now unsupported, and nobody finds out until a reader clicks.
 *   2. A platform renames itself. This has happened twice in two years and is
 *      the reason the site exists. The brand check below is a crude tripwire
 *      for the third time.
 *   3. A check ages. lib/freshness.ts handles that one — the page downgrades
 *      itself, and a weaker check downgrades sooner — and this script reports
 *      it early so there is a window to act before the seal comes down.
 *
 * None of this verifies anything. Verification means a person walked the flow,
 * and no script can do that. What this does is answer "when should someone go
 * and look again", which is the question that otherwise goes unasked until the
 * answer is "months ago".
 *
 *   node scripts/watch.mjs          # check links and freshness
 *   node scripts/watch.mjs --offline # skip the network, check parsing only
 *
 * Exits non-zero when something needs a person.
 */
import { readFile, writeFile } from "node:fs/promises";

const OFFLINE = process.argv.includes("--offline");
/** Take a new baseline. Run this after deliberately re-reading the sources. */
const RECORD = process.argv.includes("--record");
const TODAY = new Date().toISOString().slice(0, 10);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ROOT = new URL("..", import.meta.url);

/**
 * The shelf lives come out of lib/freshness.ts rather than being repeated here.
 * Two copies of a threshold is two thresholds, and the one in a weekly cron is
 * the copy nobody notices has drifted. This is a plain script and that is
 * TypeScript, so it is read by pattern — and the pattern asserts it found
 * every status rather than trusting what it got.
 */
async function shelfLife() {
  const src = await read("lib/freshness.ts");
  const table = src.match(/SHELF_LIFE[^=]*=\s*\{([^}]*)\}/)?.[1];
  if (!table) throw new Error("Could not find SHELF_LIFE in lib/freshness.ts");
  const ratio = src.match(/WARN_FRACTION\s*=\s*(\d+)\s*\/\s*(\d+);/);
  if (!ratio) throw new Error("Could not find WARN_FRACTION in lib/freshness.ts");
  const fraction = Number(ratio[1]) / Number(ratio[2]);
  const warnOf = (life) => (life === null ? null : Math.round(life * fraction));

  const life = {};
  for (const [, status, value] of table.matchAll(/(\w+):\s*(null|\d+)/g)) {
    life[status] = value === "null" ? null : Number(value);
  }
  const statuses = [...src.matchAll(/^\s*(\w+): (?:null|\d+),$/gm)].length;
  if (Object.keys(life).length !== statuses || !("verified" in life)) {
    throw new Error(
      `Parsed ${Object.keys(life).length} of ${statuses} entries from SHELF_LIFE. ` +
        `Fix the pattern rather than ignoring it, or the watch checks the wrong clock.`,
    );
  }
  return { life, warnOf };
}

/** Pages whose brand name disappearing is itself the news. */
const BRAND_WATCH = [
  { url: "https://world.nol.com/en/ticket", expect: "NOL" },
  { url: "https://concerts.weverse.io/", expect: "Weverse" },
  { url: "https://ticket.yes24.com/", expect: "YES24" },
];

const findings = [];
const note = (level, msg) => findings.push({ level, msg });

async function read(path) {
  return readFile(new URL(path, ROOT), "utf8");
}

/**
 * The guides are TypeScript and this is a plain script, so the URLs come out
 * by pattern rather than by import. That is fragile in one specific way — a
 * refactor could change the shape and leave this quietly checking nothing — so
 * it asserts a plausible count rather than trusting what it found.
 */
async function sources() {
  const src = await read("content/guides.ts");
  const urls = [...src.matchAll(/url:\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const unique = [...new Set(urls)];
  if (unique.length < 8) {
    throw new Error(
      `Only ${unique.length} source URLs found in content/guides.ts. ` +
        `The extraction pattern has probably stopped matching — fix it rather ` +
        `than lowering this number, or the watch silently checks nothing.`,
    );
  }
  return unique;
}

/**
 * Anchored on indentation, not on proximity.
 *
 * A guide's own fields sit four spaces in; a step's `see: { slug }` sits ten.
 * A pattern that just looks for "slug ... status ... lastChecked" in order
 * matches the cross-link slugs too and then scans forward into whichever guide
 * comes next — which it did, reporting two guides twice and two not at all.
 * So each guide block is cut at the next top-level slug and read inside its
 * own bounds, and the count is checked against the number of blocks found.
 */
async function freshness() {
  const src = await read("content/guides.ts");
  const { life, warnOf } = await shelfLife();
  const today = new Date();
  const starts = [...src.matchAll(/^ {4}slug: "([^"]+)",$/gm)];
  if (starts.length === 0) throw new Error("No guides parsed from content/guides.ts");

  const research = src.match(/RESEARCH_DATE\s*=\s*"([\d-]+)"/)?.[1];
  let parsed = 0;
  for (let i = 0; i < starts.length; i++) {
    const slug = starts[i][1];
    const block = src.slice(starts[i].index, starts[i + 1]?.index ?? src.length);
    const status = block.match(/^ {4}status: "(\w+)",$/m)?.[1];
    const rawDate = block.match(/^ {4}lastChecked: (.+),$/m)?.[1];
    if (!status || !rawDate) continue;
    parsed++;
    const date = rawDate.trim() === "RESEARCH_DATE" ? research : rawDate.trim().replace(/"/g, "");
    if (!date) continue;
    if (!(status in life)) {
      note("fail", `${slug} — unknown status "${status}". lib/freshness.ts has no shelf life for it.`);
      continue;
    }
    const age = Math.floor((today - Date.parse(`${date}T00:00:00Z`)) / 86400000);
    const expires = life[status];
    const warn = warnOf(expires);
    if (expires === null) {
      note("info", `${slug} — ${status}, never expires (${age}d since ${date})`);
    } else if (age > expires) {
      note("fail", `${slug} — ${status} check EXPIRED, ${age}d since ${date} (limit ${expires}d). The page has downgraded itself.`);
    } else if (age > warn) {
      note("warn", `${slug} — ${status} ${age}d ago, expires at ${expires}d. ${expires - age}d left.`);
    } else {
      note("info", `${slug} — ${status}, ${expires - age}d left of ${expires}`);
    }
  }
  if (parsed !== starts.length) {
    throw new Error(
      `Found ${starts.length} guides but could only read ${parsed}. ` +
        `The parser has drifted from the file — fix it rather than ignoring it.`,
    );
  }
}

/**
 * Node's fetch ignores HTTPS_PROXY, and this repository is worked on from a
 * container that only reaches the internet through one. In CI there is no
 * proxy and fetch is the better client, so the fallback is conditional rather
 * than permanent — the weekly run and a local run should exercise the same
 * code path wherever they can.
 */
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || "";

async function viaCurl(url) {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  try {
    const { stdout } = await promisify(execFile)(
      "curl",
      ["-sS", "-L", "--max-time", "25", "-w", "\n__STATUS__%{http_code}", "-A", UA, url],
      { maxBuffer: 20_000_000 },
    );
    const at = stdout.lastIndexOf("\n__STATUS__");
    const status = Number(stdout.slice(at + 11).trim()) || 0;
    const body = at === -1 ? stdout : stdout.slice(0, at);
    return { ok: status >= 200 && status < 400, status, body };
  } catch (e) {
    return { ok: false, status: 0, body: "", error: String(e.message || e) };
  }
}

async function hit(url) {
  if (PROXY) return viaCurl(url);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": UA },
    });
    return { ok: res.ok, status: res.status, body: res.ok ? await res.text() : "" };
  } catch (e) {
    return { ok: false, status: 0, body: "", error: String(e.message || e) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * What a cited page says, reduced to something comparable week to week.
 *
 * Scripts and styles go first — a Next.js notice page carries its whole state
 * blob inline, and that changes on every deploy whether or not a word did.
 * What is left is the text a reader sees, lowercased and collapsed, which is
 * the thing a guide was written against.
 */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Recover the text of a page that only exists inside its JavaScript.
 *
 * visibleText strips <script>, which is right for a server-rendered page and
 * blind for an App Router one. NOL World's FAQ is the case that matters here:
 * three guides on this site are written from it, and the 113 answers never
 * appear in the markup at all — they live in the flight payload as compiled
 * MDX, so the link check saw 45 words of chrome and compared those. A source
 * the site leans on hardest was the one source drift could not see.
 *
 * This is not a renderer and does not try to be. It peels the payload's
 * escaping and keeps the string literals that read like prose, which is enough
 * for a word set that moves when the answers move. Markup vocabulary, module
 * ids and URLs are dropped because they churn on every deploy.
 */
function payloadText(html) {
  if (!html.includes("__next_f")) return "";
  let s = html;
  // The payload is a JS string literal containing JSON containing more
  // escaped JS, so the quoting is two or three deep. Peel until it settles.
  for (let i = 0; i < 4; i++) {
    const next = s
      .replace(/\\u0026/g, "&")
      .replace(/\\\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
    if (next === s) break;
    s = next;
  }
  const out = [];
  for (const m of s.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
    const t = m[1];
    if (t.length < 24 || !t.includes(" ")) continue;
    if (/[{}<>;=]|function |_jsx|_components|^https?:|^\/|use strict/.test(t)) continue;
    if (!/[a-z]{3}/i.test(t)) continue;
    out.push(t);
  }
  return out.join(" ").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Share of words the two versions still have in common. */
function similarity(a, b) {
  const A = new Set(a.split(" ").filter(Boolean));
  const B = new Set(b.split(" ").filter(Boolean));
  if (A.size === 0 && B.size === 0) return 1;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / new Set([...A, ...B]).size;
}

/**
 * A 200 is not evidence that a source still says what we cited it for.
 *
 * Weverse's shipping-exclusions notice is literally titled "updated on
 * Jul. 15, 2026" — it is edited in place. Add a country to that list tomorrow
 * and the URL still returns 200 while a step on this site quietly becomes
 * wrong. The link check cannot see that; comparing the text can.
 *
 * This reports that a source moved. It cannot tell whether the guide needs to
 * change — that is a judgement about meaning, and no script makes it. Same
 * division as the freshness system: automate noticing, not deciding.
 */
const DRIFT_LIMIT = 0.97;

/**
 * Which cited URLs are worth comparing week to week.
 *
 * A notice or an article is a fixed document: it says one thing, and if the
 * words move, something was edited and the guide citing it needs re-reading.
 * A storefront is not — world.nol.com rotates its featured concerts, so two
 * fetches minutes apart already differ by 12%, and comparing it would cry wolf
 * every week until nobody read the report. That is worse than not checking.
 *
 * Storefronts are still link-checked. They are cited as "go here", and the
 * thing that matters about them is that they still exist under that name,
 * which is what the brand watch covers.
 */
function isFixedDocument(url) {
  const path = new URL(url).pathname + new URL(url).search;
  // A platform's own purchase guide, FAQ or policy page is the most important
  // kind of fixed document there is — it is where the rules a step was written
  // from actually live. The first version of this pattern missed them and
  // classified YES24's English guide as a storefront.
  if (/\/(notice|news|press|article|view|blog|release|guide|faq|help|terms|policy|support)/i.test(path))
    return true;
  // A numeric id deep in the path is an article by another name.
  return /\/[^/]*\d{4,}/.test(path);
}

async function links(urls) {
  const path = new URL("content/source-fingerprints.json", ROOT);
  let prints = {};
  try {
    prints = JSON.parse(await readFile(path, "utf8"));
  } catch {
    note("info", "No source fingerprints yet — run `npm run watch -- --record` to take a baseline.");
  }
  const next = {};

  for (const url of urls) {
    const r = await hit(url);
    // 403 and 429 are a bot being turned away, not a dead page. Saying so
    // keeps the report honest instead of crying wolf every week.
    if (r.status === 403 || r.status === 429) {
      note("info", `${url} — ${r.status}, refused an automated request. Check by hand if it matters.`);
      if (prints[url]) next[url] = prints[url];
      continue;
    }
    if (!r.ok) {
      note("fail", `${url} — ${r.status || r.error}. A guide cites this.`);
      if (prints[url]) next[url] = prints[url];
      continue;
    }

    let text = visibleText(r.body);
    // A client-rendered page gives up almost nothing to the markup pass, so
    // fall back to its payload rather than skipping the comparison.
    if (text.split(" ").filter(Boolean).length < 200) {
      const fromPayload = payloadText(r.body);
      if (fromPayload.split(" ").filter(Boolean).length > text.split(" ").filter(Boolean).length) {
        text = fromPayload;
      }
    }
    const words = text.split(" ").filter(Boolean).length;
    // A page that came back as a shell — a login wall, an error rendered by
    // JavaScript — would otherwise read as a total rewrite every week.
    if (words < 40) {
      note("info", `${url} — only ${words} words of text came back; not comparing.`);
      if (prints[url]) next[url] = prints[url];
      continue;
    }

    if (!isFixedDocument(url)) {
      note("info", `${url} — a live page, link-checked only (its wording is expected to move).`);
      continue;
    }

    const before = prints[url];
    next[url] = { words, text: RECORD ? text : before?.text, seen: TODAY };
    if (!before?.text) {
      note("info", `${url} — no baseline recorded yet (${words} words).`);
      continue;
    }
    const same = similarity(before.text, text);
    if (same < DRIFT_LIMIT) {
      note(
        "warn",
        `${url} — the page changed since it was cited: ${Math.round((1 - same) * 100)}% of its ` +
          `wording is different (${before.words} → ${words} words, last seen ${before.seen}). ` +
          `Re-read it against the guide that cites it.`,
      );
    }
  }

  if (RECORD) {
    await writeFile(path, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`\n  Recorded ${Object.keys(next).length} source fingerprints.`);
  }
}

async function brands() {
  for (const { url, expect } of BRAND_WATCH) {
    const r = await hit(url);
    if (!r.ok) continue; // already reported by links()
    if (!r.body.includes(expect)) {
      note("warn", `${url} no longer contains "${expect}". These platforms have renamed twice; check whether it has happened again.`);
    }
  }
}

const t0 = Date.now();
await freshness();
if (OFFLINE) {
  const urls = await sources();
  note("info", `offline — parsed ${urls.length} source URLs, skipped the network`);
} else {
  const urls = await sources();
  await links(urls);
  await brands();
}

const fails = findings.filter((f) => f.level === "fail");
const warns = findings.filter((f) => f.level === "warn");

console.log(`\nkpopgo watch — ${new Date().toISOString().slice(0, 10)} (${((Date.now() - t0) / 1000).toFixed(1)}s)\n`);
for (const level of ["fail", "warn", "info"]) {
  for (const f of findings.filter((x) => x.level === level)) {
    console.log(`  ${{ fail: "✗", warn: "!", info: "·" }[level]} ${f.msg}`);
  }
}
console.log(`\n${fails.length} needing action, ${warns.length} worth a look.\n`);

process.exit(fails.length || warns.length ? 1 : 0);
