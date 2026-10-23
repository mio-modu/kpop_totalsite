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
import { fetchRelayStatus, relayVerdict, relayFinding } from "./relay.mjs";

/**
 * The proxy's status document, fetched at most once for the whole run.
 *
 * It is only consulted when something fails, so the common case never pays
 * for it, and a sweep with several unreachable hosts must not ask the gateway
 * about itself once per URL. `null` — no proxy, as on a GitHub runner — is a
 * perfectly good cached answer, so the memo stores it rather than retrying.
 */
let relayStatusMemo;
const relayStatus = async () => {
  if (relayStatusMemo === undefined) relayStatusMemo = await fetchRelayStatus();
  return relayStatusMemo;
};

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

/**
 * Re-baseline the sources whose URL contains this string, and nothing else.
 *
 *   npm run watch -- --record-only=interpark-global-rebrands
 *
 * `--record-new` closed one half of the asymmetry above. This closes the
 * other, and the Yahoo page is again the case that shows why. Its 9% drift
 * warning stands on purpose, and the honest way to clear a drift warning is
 * to re-read the page against the guide that cites it — but the only tool for
 * writing a baseline after a re-read was `--record`, which re-baselines
 * *everything it can fetch*. So resolving one warning meant silently
 * accepting every other page's current wording as read, including any that
 * had drifted since the last run and had not been looked at yet.
 *
 * Which means the warning could not be cleared honestly at all: one option
 * left it standing forever, the other cleared more than anybody had read. A
 * check with no honest way to go green is a check people learn to ignore,
 * which is the same failure as a permanent false alarm, arriving from the
 * opposite direction.
 *
 * Two guards, because a flag that silently records nothing is worse than no
 * flag: a match that selects no source fails, and a match that selects every
 * comparable source fails as well — that is `--record` wearing a disguise,
 * and if that is what somebody means they should type it.
 */
const RECORD_ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith("--record-only"));
  if (!arg) return null;
  const match = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1).trim() : "";
  if (!match) {
    throw new Error(
      "--record-only needs a URL fragment to match, e.g. " +
        "`--record-only=interpark-global-rebrands`. Without one it would " +
        "match every source, which is what --record is for.",
    );
  }
  return match;
})();

if (RECORD && RECORD_ONLY) {
  throw new Error(
    "--record and --record-only together are contradictory: one re-baselines " +
      "everything, the other exactly what you re-read. Pick the one you mean.",
  );
}

const WRITES = RECORD || RECORD_NEW || RECORD_ONLY;
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
  // `url:` catches every entry in a guide's `sources`, and `licenceUrl:`
  // catches the one URL that is not in that list and matters most.
  //
  // The site reproduces the venue's seating chart, and the *only* thing that
  // makes that allowed is 공공누리 제1유형, declared on a page at kogl.or.kr.
  // That page was watched by nothing: `sources()` matched `url:` alone, a
  // `licenceUrl` is not spelled that way, and `documents()` watches the
  // picture's bytes rather than the terms. So the one claim on this site with
  // a legal consequence rested on a page no check had ever fetched.
  //
  // Found by asking why `www.kogl.or.kr` never appeared in a sweep. It is the
  // `sourceUrl` rule's own logic applied one field over: reproducing
  // something under a licence you have not re-read is a claim with no trail
  // back to it.
  const urls = [...src.matchAll(/(?:url|licenceUrl):\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
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
 */
async function hit(url) {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  try {
    const { stdout } = await promisify(execFile)(
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
    return { ok: status >= 200 && status < 400, status, body };
  } catch (e) {
    return { ok: false, status: 0, body: "", error: String(e.message || e) };
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
  // A licence page belongs here for the same reason `terms` and `policy` do,
  // and more sharply: the chart on the seat guide is served only because
  // 공공누리 제1유형 permits it, so a change to that page's wording is the one
  // source change on this site with a legal consequence rather than an
  // editorial one. `license.do` matches no other word in this list.
  // `transport` joined this list the day a guide started quoting taxi fares off
  // Seoul's tourism transport page. It is worth being honest about what that
  // means: this heuristic reads the URL, and the question it is standing in for
  // is "does a guide quote figures from this page?" — which a path cannot
  // answer. The two agree often enough to be useful and will disagree again.
  // **When you add a source you quote a number from, check the next sweep
  // compares it rather than reporting it link-checked only.** A storefront
  // whose wording is meant to move is the case this list exists to exclude;
  // a page you took a fare, a deadline or a fee from is never that.
  if (/\/(notice|news|press|article|view|blog|release|guide|faq|help|terms|policy|support|licen[cs]e|transport)/i.test(path))
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
  // Which sources this run actually compared, and which of them
  // `--record-only` selected. Both guards below read these.
  const comparable = [];
  const rebaselined = [];

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
      // A `000` behind this container's proxy is three different failures
      // wearing one number, and only one of them is ours. Ask the proxy which
      // it was before calling a cited source dead — see `scripts/relay.mjs`
      // for what each verdict means and which of them cost weeks.
      //
      // `relayFinding` returns null wherever there is nothing better to say,
      // including on a GitHub runner where there is no proxy to ask, so the
      // line below is still the one this check has always printed.
      const explained =
        r.status === 0
          ? relayFinding(url, new URL(url).hostname, relayVerdict(new URL(url).hostname, await relayStatus()))
          : null;
      if (explained) note(explained.level, explained.msg);
      else note("fail", `${url} — ${r.status || r.error}. A guide cites this.`);
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
    // --record overwrites; --record-new fills a hole and never overwrites;
    // --record-only overwrites exactly what its match selects.
    const keep = before?.text;
    const picked = RECORD_ONLY !== null && url.includes(RECORD_ONLY);
    const take = RECORD || (RECORD_NEW && !keep) || picked;
    comparable.push(url);
    if (picked) rebaselined.push(url);
    next[url] = {
      words: take ? words : (before?.words ?? words),
      text: take ? text : keep,
      seen: take ? TODAY : (before?.seen ?? TODAY),
    };
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

  // Both guards run before anything is written, so a bad match changes
  // nothing on disk.
  if (RECORD_ONLY !== null) {
    if (rebaselined.length === 0) {
      throw new Error(
        `--record-only=${RECORD_ONLY} matched none of the ${comparable.length} ` +
          `comparable sources, so it would have written nothing while reporting ` +
          `success. Check the fragment against the URL in content/guides.ts.`,
      );
    }
    if (comparable.length > 1 && rebaselined.length === comparable.length) {
      throw new Error(
        `--record-only=${RECORD_ONLY} matched every one of the ${comparable.length} ` +
          `comparable sources. That is --record, and re-baselining a page nobody ` +
          `re-read is the thing these flags exist to prevent. Narrow the fragment.`,
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
    // Naming them is the point: a re-baseline is a claim that somebody read
    // those pages, so the run says which pages it just made that claim about.
    if (RECORD_ONLY !== null) {
      console.log(
        `  Re-baselined ${rebaselined.length} of ${comparable.length} comparable source(s), ` +
          `on the understanding that these were re-read:`,
      );
      for (const u of rebaselined) console.log(`    ${u}`);
    }
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

/**
 * Every paid link still resolves, and still carries the attribution.
 *
 * This is the one check here whose failure costs money rather than accuracy,
 * and it is invisible from every other angle. A redirect that stops working,
 * a programme that ends, a network that rewrites its parameters — the page
 * goes on rendering a perfectly ordinary, correctly disclosed paid link, the
 * reader goes on clicking it, and nothing is credited. Nobody finds out until
 * somebody thinks to read a dashboard, which on a site with no revenue yet
 * could be months.
 *
 * `scripts/affiliate.test.mjs` already holds the *stored* URLs to the
 * attribution they are supposed to carry. That is a string comparison and it
 * cannot see the network. This follows one hop and reads what the redirect
 * actually hands over, which is the only place the truth lives.
 *
 * One hop deliberately. The destination is a storefront whose wording is meant
 * to move, so there is nothing here to fingerprint; what matters is that the
 * hop happens and that the identifiers survive it.
 */
async function affiliates() {
  const src = await read("content/affiliates.ts");
  const urls = [...src.matchAll(/url: "(https:\/\/[^"]+)"/g)].map((m) => m[1]);
  if (urls.length === 0) {
    note("info", "No paid links registered.");
    return;
  }

  // Read the identifiers off the first registered link rather than hardcoding
  // them, so this keeps working when the account or the campaign changes.
  const expect = [...urls[0].matchAll(/[?&](aid|aff_adid)=([^&]+)/g)].map((m) => `${m[1]}=${m[2]}`);
  if (expect.length === 0) {
    note("warn", "The first registered paid link carries no aid/aff_adid — cannot check attribution.");
    return;
  }

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");

  for (const url of urls) {
    let status = 0;
    let dest = "";
    try {
      const { stdout } = await promisify(execFile)(
        "curl",
        // No -L: the redirect itself is the thing being read.
        ["-sS", "-o", "/dev/null", "-w", "%{http_code} %{redirect_url}", "--max-time", "25", "-A", UA, url],
        { maxBuffer: 1_000_000 },
      );
      const [code, ...rest] = stdout.trim().split(" ");
      status = Number(code) || 0;
      dest = rest.join(" ");
    } catch {
      status = 0;
    }

    const short = url.replace(/\?.*$/, "");
    const query = decodeURIComponent(url).match(/query=([^&]+)/)?.[1] ?? "site-wide";

    if (status === 0) {
      const host = new URL(url).hostname;
      const explained = relayFinding(url, host, relayVerdict(host, await relayStatus()));
      if (explained) note(explained.level, explained.msg);
      else note("fail", `${short} (${query}) — the paid link did not resolve. A reader clicking it gets nothing.`);
      continue;
    }

    if (status < 300 || status >= 400 || !dest) {
      note(
        "fail",
        `${short} (${query}) — answered ${status} instead of redirecting. ` +
          `A paid link that does not hand off is a click that earns nothing.`,
      );
      continue;
    }

    const lost = expect.filter((p) => !dest.includes(p));
    if (lost.length) {
      note(
        "fail",
        `${short} (${query}) — the redirect dropped ${lost.join(" and ")}. ` +
          `The link works, the reader books, and none of it is credited.`,
      );
      continue;
    }

    note("info", `${short} (${query}) — resolves, attribution intact.`);
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
  await affiliates();
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
