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
 *   node scripts/watch.mjs --offline     # skip the network, check parsing only
 *   node scripts/watch.mjs --record-new  # baseline only sources that have none
 *
 * Exits non-zero when something needs a person.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OFFLINE = process.argv.includes("--offline");
/** Take a new baseline. Run this after deliberately re-reading the sources. */
const RECORD = process.argv.includes("--record");
/**
 * Take a baseline only for sources that have none yet.
 *
 * `--record` re-baselines everything it can fetch, which is right after a
 * deliberate re-read of the sources and wrong at every other time: a page
 * already showing drift is silenced by it, and silenced is indistinguishable
 * from checked. That is not hypothetical. The Yahoo rebrand page has carried
 * a standing 9% warning on purpose — its body does not extract cleanly, and
 * a warning nobody has resolved is more honest than a baseline nobody read —
 * and a plain `--record` run to pick up a new guide's sources would have
 * quietly cleared it.
 *
 * So adding a guide uses this instead. It writes the entries that are
 * missing, leaves every existing baseline exactly as it was, and therefore
 * cannot clear a warning it did not look at.
 */
const RECORD_NEW = process.argv.includes("--record-new");
const WRITES = RECORD || RECORD_NEW;
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
  // Singular. `concerts.weverse.io` 302s here, and the guides were corrected
  // for that earlier — this list was not, because it is a different list.
  { url: "https://concert.weverse.io/", expect: "Weverse" },
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
 * This used to branch on HTTPS_PROXY: curl in the container, node's fetch in
 * CI, on the reasoning that fetch is the better client where it works. The
 * comment even said both runs "should exercise the same code path wherever
 * they can" — which they could not, because the proxy is exactly what decides
 * which one runs. So the path a change was written against was never the path
 * CI ran, and a cookie bug sat in both for weeks with nothing to compare.
 *
 * curl is present in both places. One path.
 */

/**
 * One cookie jar for the whole run, which is what a browser is.
 *
 * `korea.net` was reported as a dead citation for weeks — "an endless 302
 * loop", recorded in this repo as nothing to fix because the page opens fine
 * for a reader. That diagnosis was wrong. The site sets a session cookie and
 * redirects once; a client that does not keep the cookie is sent back to the
 * same URL forever, which is what the redirect counter was actually showing.
 * With a jar it answers 200 with 771 words on the first try.
 *
 * A permanent false alarm is worse than no alarm, because it teaches everyone
 * reading the weekly report to skip that line — and the next line like it.
 *
 * curl keeps cookies per domain, so one jar across the run is the browser's
 * behaviour rather than a shortcut. It lives in a temp file that goes away
 * with the process.
 */
const JAR = join(tmpdir(), `kpopgo-watch-${process.pid}.cookies`);

/**
 * Everything goes through curl, including where node's fetch would work.
 *
 * There used to be two paths — curl behind a proxy, `fetch` otherwise — and
 * they did not behave the same. This script runs in a proxied container and
 * on a GitHub runner, so the path exercised while writing a change was never
 * the path that ran in CI. One implementation is worth more here than the few
 * milliseconds the other saved, and curl is present in both places.
 *
 * **One attempt was reporting three live pages as dead citations**, which is
 * the korea.net mistake with a different cause. `circlechart.kr` has been
 * written down in this repo as permanently unreachable; it answers 200 five
 * times out of five when asked five times. Two TicketLink help pages were in
 * the same report, and the proxy named the cause for all three:
 * `ws_closed_mid_exchange`, the site declining, with an identical signature —
 * 517 bytes sent, 39 received, closed after 8 seconds. Two unrelated Korean
 * hosts resetting the TLS handshake the same way, on some requests and not
 * others, while `www.ticketlink.co.kr` answered on other paths in the same
 * run. That is a WAF, not a dead host.
 *
 * So a transport failure is retried and an HTTP status never is. A 404 is a
 * 404 and asking again only slows the sweep; a connection reset is a question
 * that has a different answer a second later. Three attempts takes a
 * one-in-five reset to well under one in a hundred.
 *
 * **It reports how many attempts it took**, and that is the part that keeps
 * this from becoming the quiet version of the same bug. A silent retry makes
 * a host that needs three goes every week look identical to a healthy one,
 * which is exactly how the report stops being worth reading.
 */
const SETTLE = (ms) => new Promise((r) => setTimeout(r, ms));

async function hit(url, tries = 3) {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);
  let error = "";
  for (let attempt = 1; attempt <= tries; attempt++) {
    const r = await once(url, run, attempt);
    if (!r.transportFailure) return r;
    error = r.error;
    if (attempt < tries) await SETTLE(attempt * 1500);
  }
  return { ok: false, status: 0, body: "", error, attempts: tries };
}

async function once(url, run, attempt) {
  try {
    const { stdout } = await run(
      "curl",
      [
        "-sS", "-L",
        // A real loop still has to end; 10 is past any legitimate chain.
        "--max-redirs", "10",
        "--cookie-jar", JAR, "--cookie", JAR,
        "--max-time", "25",
        "-w", "\n__STATUS__%{http_code}",
        "-A", UA,
        url,
      ],
      { maxBuffer: 20_000_000 },
    );
    const at = stdout.lastIndexOf("\n__STATUS__");
    const status = Number(stdout.slice(at + 11).trim()) || 0;
    const body = at === -1 ? stdout : stdout.slice(0, at);
    // Any answer from curl is an answer, including a 404. Only a transport
    // failure — curl exiting non-zero — is worth asking again.
    return { ok: status >= 200 && status < 400, status, body, attempts: attempt };
  } catch (e) {
    return { transportFailure: true, error: String(e.message || e) };
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
 * Page chrome that moves on its own, declared per source.
 *
 * The Yahoo rebrand article reported 9% drift every week, and this repo wrote
 * it off as a page whose "body does not extract cleanly" and left the warning
 * standing on purpose. That was the korea.net failure wearing a different
 * cause: a warning that can never be cleared teaches everyone reading the
 * report to skip that line, and then the next one like it.
 *
 * Diffed rather than reasoned about. Every differing token, both directions:
 *
 *   stored   5,404.02 -7.98 -0.15% 64,075.42 -841.28 -1.30% …
 *   live     5,422.16 +7.02 +0.13% 62,693.16 -214.68 -0.34% …
 *
 * It is the market-ticker strip Yahoo Finance puts above every article. Not
 * one word of the article changed, and the numbers change every trading day,
 * so that warning was guaranteed to fire forever.
 *
 * **Declared per source rather than applied globally**, which is the whole
 * design of it. A pattern loose enough to drop a market quote is also loose
 * enough to drop a fee, and a cited fee changing from 3,000 to 8,000 is the
 * single thing this script exists to catch. Scoped to the host that earned
 * it, it cannot reach any other source — and the next page needing one has
 * to state its own reason here, with the diff that justified it.
 */
const CHROME = [
  {
    host: "sg.finance.yahoo.com",
    // A market quote: optional sign, grouped digits, exactly two decimals,
    // optional percent. Deliberately not "any number".
    drop: /(?<=^|\s)[+-]?\d[\d,]*\.\d{2}%?(?=\s|$)/g,
    why: "the market-ticker strip above every Yahoo Finance article",
  },
];

/** The same reduction on both sides, so old baselines still compare. */
function stripChrome(url, text) {
  let out = text;
  for (const c of CHROME) {
    if (!url.includes(c.host)) continue;
    out = out.replace(c.drop, " ");
  }
  return out.replace(/\s+/g, " ").trim();
}

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
      const tried = r.attempts > 1 ? ` after ${r.attempts} attempts` : "";
      note("fail", `${url} — ${r.status || r.error}${tried}. A guide cites this.`);
      if (prints[url]) next[url] = prints[url];
      continue;
    }
    // A page that answered only on the second or third go is working and is
    // not healthy, and the report has to be able to say both. Silently
    // retrying until something succeeds is how a host that resets most
    // requests comes to look identical to one that never does.
    if (r.attempts > 1) {
      const n = r.attempts - 1;
      note(
        "info",
        `${url} — answered on attempt ${r.attempts} of 3; ` +
          `${n === 1 ? "the first was" : `the first ${n} were`} refused at the transport.`,
      );
    }

    let text = stripChrome(url, visibleText(r.body));
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
    // --record overwrites; --record-new fills a hole and never overwrites.
    const keep = before?.text;
    const take = RECORD || (RECORD_NEW && !keep);
    next[url] = {
      words: take ? words : (before?.words ?? words),
      text: take ? text : keep,
      seen: take ? TODAY : (before?.seen ?? TODAY),
    };
    if (!before?.text) {
      note("info", `${url} — no baseline recorded yet (${words} words).`);
      continue;
    }
    const same = similarity(stripChrome(url, before.text), text);
    if (same < DRIFT_LIMIT) {
      note(
        "warn",
        `${url} — the page changed since it was cited: ${Math.round((1 - same) * 100)}% of its ` +
          `wording is different (${before.words} → ${words} words, last seen ${before.seen}). ` +
          `Re-read it against the guide that cites it.`,
      );
    }
  }

  if (WRITES) {
    await writeFile(path, `${JSON.stringify(next, null, 2)}\n`);
    const held = Object.keys(next).filter((u) => prints[u]?.text).length;
    console.log(
      `\n  Wrote ${Object.keys(next).length} source fingerprints` +
        (RECORD_NEW ? ` — ${held} existing baselines left untouched.` : "."),
    );
  }
}

async function brands() {
  for (const { url, expect } of BRAND_WATCH) {
    const r = await hit(url);
    if (!r.ok) continue; // already reported by links()

    // Read what a reader reads. This used to test `r.body`, the raw HTML, so
    // a brand name surviving only inside a <script> blob counted as present
    // and a page that renders it from JSON counted as renamed. Neither is the
    // question being asked.
    const text = visibleText(r.body);
    const words = text.split(" ").filter(Boolean).length;

    // The same threshold the fingerprint path uses, for the same reason. A
    // page that came back as a shell has not told us anything about its own
    // branding, and `ticket.yes24.com` does exactly this from some networks
    // and not others: 26 words on a GitHub runner, 319 words and the brand
    // present from this container on the same day. Claiming it had been
    // renamed was a false alarm invented by whichever network asked.
    if (words < 40) {
      note("info", `${url} — only ${words} words of text came back; cannot judge its branding.`);
      continue;
    }
    // visibleText() lowercases, because the fingerprint comparison wants a
    // case-insensitive diff. Comparing a brand name against it directly
    // reported NOL, Weverse and YES24 as all renamed on the same run, which
    // is how this nearly shipped as three false alarms instead of one.
    if (!text.includes(expect.toLowerCase())) {
      note("warn", `${url} no longer contains "${expect}". These platforms have renamed twice; check whether it has happened again.`);
    }
  }
}

/**
 * A reproduced document, checked by hash.
 *
 * Everything else here compares visible text, which sees exactly nothing in a
 * JPEG. The site now serves its own copy of the venue's seating chart under
 * 공공누리 제1유형, and that copy is the one thing on the site that can go
 * wrong silently in the way this whole script exists to prevent: the file is
 * literally called seat2026.jpg, so the operator replacing it is a scheduled
 * event rather than a hypothetical, and our copy would go on being served
 * with confidence afterwards.
 *
 * Byte-for-byte is the right comparison and a blunt one. An image re-encoded
 * at a different quality with the same content would report as changed, which
 * is a false alarm — but the alternative is a threshold nobody can justify on
 * a picture, and the failure this guards against is the expensive one. A
 * person re-reads the chart and re-records; that is the same deal every other
 * line in this report offers.
 */
async function documents() {
  const src = await read("content/guides.ts");
  const urls = [...src.matchAll(/upstream:\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  if (urls.length === 0) return;

  const store = new URL("content/document-fingerprints.json", ROOT);
  let have = {};
  try {
    have = JSON.parse(await readFile(store, "utf8"));
  } catch {
    have = {};
  }

  const { createHash } = await import("node:crypto");
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  let wrote = 0;

  for (const url of [...new Set(urls)]) {
    const tmp = join(tmpdir(), `kpopgo-doc-${process.pid}-${wrote}.bin`);
    let bytes;
    try {
      await promisify(execFile)(
        "curl",
        ["-sS", "-L", "--max-redirs", "10", "--max-time", "40",
         "--cookie-jar", JAR, "--cookie", JAR, "-A", UA, "-o", tmp, url],
        { maxBuffer: 1_000_000 },
      );
      bytes = await readFile(tmp);
    } catch (e) {
      note("fail", `${url} — the reproduced document could not be fetched: ${String(e.message || e)}`);
      continue;
    } finally {
      await rm(tmp, { force: true }).catch(() => {});
    }

    // A proxy or an error page answers 200 with HTML. Judging that against a
    // stored image hash would report a change that is really a failed fetch.
    if (bytes.length < 2000 || bytes.subarray(0, 400).includes(Buffer.from("<html"))) {
      note("fail", `${url} — came back as ${bytes.length} bytes that are not an image; cannot judge it.`);
      continue;
    }

    const sha = createHash("sha256").update(bytes).digest("hex");
    const seen = have[url];

    if (!seen) {
      note("info", `${url} — no baseline recorded yet (${bytes.length} bytes).`);
      if (RECORD || RECORD_NEW) {
        have[url] = { bytes: bytes.length, sha256: sha, recorded: TODAY };
        wrote++;
      }
      continue;
    }

    if (seen.sha256 !== sha) {
      note(
        "fail",
        `${url} — the document has been replaced since our copy was taken ` +
          `(${seen.bytes} → ${bytes.length} bytes, last seen ${seen.recorded}). ` +
          `public/img/docs holds the old one. Re-read it, replace the file, and ` +
          `move the guide\u0027s document.taken date.`,
      );
      if (RECORD) {
        have[url] = { bytes: bytes.length, sha256: sha, recorded: TODAY };
        wrote++;
      }
      continue;
    }

    note("info", `${url} — unchanged since ${seen.recorded}.`);
  }

  if (wrote) {
    await writeFile(store, JSON.stringify(have, null, 2) + "\n");
    note("info", `Recorded ${wrote} document fingerprint(s).`);
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
  await documents();
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
