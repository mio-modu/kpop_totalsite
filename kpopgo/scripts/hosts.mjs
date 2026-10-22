/**
 * Print the complete outbound host allowlist this project needs.
 *
 *   npm run hosts
 *
 * The container reaches the internet through a proxy with an allowlist, and
 * that allowlist is a single text field: editing it replaces it. Three times
 * now it has been pasted over with a partial list, and each time the hosts
 * left out went dark — the source watcher started reporting seven cited pages
 * as unreachable, which looks exactly like seven dead links.
 *
 * The failure was never the field. It was that the correct contents lived in
 * somebody's memory, so every edit was a reconstruction. This script is the
 * answer: the output IS the field contents, derived from the content for the
 * cited half and declared below for the fixed half. Run it, paste the whole
 * thing, and nothing can quietly shrink.
 *
 * Add a guide citing a new domain and it appears here automatically.
 *
 * Two things about the field itself, both learned by hitting them:
 *
 *  - **The apex and the www host are different entries.** Adding `klook.com`
 *    and expecting `www.klook.com` to follow does not work: the apex answered
 *    301 and the www host answered a 403 policy denial, from the same run.
 *    Whatever a site actually serves pages from is the host to list, and for
 *    most of the web that is the www one.
 *  - **A hand-typed entry survives only until the next paste.** Anything
 *    added by hand and not printed here is gone the moment somebody runs this
 *    script and pastes the block, which is the correct behaviour and the
 *    reason to put a host in the content or in FIXED rather than in the form.
 */
import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const ROOT = new URL("..", import.meta.url);

/**
 * Hosts that no citation will ever mention, because they are not sources.
 *
 * Each one is here for a reason that is not obvious six months from now, so
 * the reason is written down. Removing one of these breaks a workflow rather
 * than a page, which is why they cannot be derived.
 */
const FIXED = [
  ["api.figma.com", "Figma API — design handoff"],
  ["figma-alpha-api.s3.us-west-2.amazonaws.com", "Figma image exports"],
  ["s3-alpha-sig.figma.com", "Figma signed asset URLs"],
  ["webdesign-style.vercel.app", "The design system this site is built against"],
  ["service-confirm.netlify.app", "Deploy verification"],
  ["kpopgo.app", "This site, for checking production"],
  ["gyesanmoa.co.kr", "Sibling site"],
  ["badeuldon.co.kr", "Sibling site"],
  ["ticket.melon.com", "Melon Ticket — Korean-language, appears in tour announcements"],
  ["tkglobal.melon.com", "Melon Ticket Global — blocks automated requests, kept for retries"],
  ["www.ticketlink.co.kr", "TicketLink — appears in tour announcements"],
  ["global.ticketlink.co.kr", "TicketLink Global"],
  ["www.juso.go.kr", "Korean address lookup — shipping and billing fields"],
  ["www.epost.go.kr", "Korea Post"],
  ["ems.epost.go.kr", "Korea Post EMS — international parcels"],
  ["unipass.customs.go.kr", "Korea Customs Service"],
  ["www.federalregister.gov", "US rulemaking — de minimis and duty"],
  ["www.govinfo.gov", "US statutes and the Federal Register of record"],
  ["www.cbp.gov", "US Customs and Border Protection"],
  ["www.ipc.be", "International Post Corporation — cross-border mail status"],
  // Venues. A fan who gets through the queue then has to physically arrive
  // somewhere, and the English-language coverage of what that takes — which
  // gate, which exit, what you may carry in, when doors open — is worse than
  // the ticketing coverage this site already replaced. These are the operators
  // of record for the halls K-pop tours actually play, and nothing can be
  // written about a venue without reading its own pages first.
  // KSPO DOME took two hosts to get right, and the wrong one was declared for
  // weeks as "the operator". kspo.or.kr is the foundation that owns the park
  // (서울올림픽기념국민체육진흥공단) and its site is corporate — it answers 302
  // to a main.do and has no seating chart on it. The venue's own pages are
  // published by the operating company, 한국체육산업개발, under
  // ksponco.or.kr/olympicpark, which is where the KSPO-DOME page, its seating
  // chart and the rental guidance live. Both stay: the foundation is the body
  // a policy or a closure notice comes from, the company is the venue of
  // record. Declared from search results rather than from the pages
  // themselves, because the company's host is not reachable from here yet —
  // read it before writing a word of the guide.
  ["www.ksponco.or.kr", "한국체육산업개발 — operates Olympic Park, publishes the KSPO DOME pages"],
  ["www.kspo.or.kr", "KSPO, the foundation that owns Olympic Park — corporate, not the venue"],
  ["kspo.or.kr", "KSPO, apex"],
  ["www.sisul.or.kr", "Seoul Facilities Corporation — Gocheok Sky Dome and Jamsil"],
  ["www.inspirekorea.com", "Inspire Arena, Incheon — the newest large venue"],
  ["www.kintex.com", "KINTEX, Goyang — hosts arena-scale concerts and fan events"],
  ["english.visitseoul.net", "Seoul tourism, English — transport and access pages"],
  ["www.seoulmetro.co.kr", "Seoul Metro — the line and exit a venue is reached from"],

  // The two Korean album charts were declared here and are not any more,
  // which is the whole lifecycle of a declaration and worth leaving a note
  // about rather than a silent deletion.
  //
  // They were declared before being cited, the one case that justifies it: a
  // page cannot be cited until it can be read, and it cannot be read until
  // the allowlist carries it. Both are cited now — by the albums guide and
  // the Ktown4u guide, which no longer answer "we cannot say" on whether a
  // shop reports to the charts — so both hosts come out of the content and a
  // declaration would claim they are underivable when they are not. If the
  // citations are ever removed, the hosts go with them, and that is correct:
  // nothing here needs them for their own sake.
  // Loaded by the reader's browser, not by this container — but the headless
  // browser in scripts/check-layout.mjs is in this container, so allowing
  // them keeps the layout check rendering the page a reader actually gets.
  ["www.googletagmanager.com", "GA4, loaded client-side"],
  ["pagead2.googlesyndication.com", "AdSense, loaded client-side once ids are set"],
  ["www.clarity.ms", "Microsoft Clarity, loaded client-side once the id is set"],
];

/**
 * URLs that look like hosts and are not.
 *
 * schema.org appears in every JSON-LD block as an @context namespace. Nothing
 * ever fetches it, and listing it in an allowlist invites the belief that
 * structured data stops working without it.
 */
const NOT_FETCHED = new Set(["schema.org", "www.w3.org", "purl.org"]);

/** Every host the published content links to. */
const SOURCES = ["content/*.ts", "lib/*.ts", "app/**/*.tsx"];

const cited = new Set();
for (const pattern of SOURCES) {
  for await (const file of glob(pattern, { cwd: ROOT })) {
    const text = await readFile(new URL(file, ROOT), "utf8");
    for (const m of text.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
      const host = m[1].toLowerCase().replace(/\.$/, "");
      if (!NOT_FETCHED.has(host)) cited.add(host);
    }
  }
}

const fixedHosts = new Set(FIXED.map(([h]) => h));
const all = [...new Set([...fixedHosts, ...cited])].sort();

console.log(`\n  ${all.length} hosts. Paste the whole block — the field replaces, it does not append.\n`);
console.log(all.join("\n"));

const citedOnly = [...cited].filter((h) => !fixedHosts.has(h)).sort();
console.log(`\n  ${citedOnly.length} of these are cited by the content:`);
for (const h of citedOnly) console.log(`    ${h}`);
console.log(`\n  ${FIXED.length} are fixed infrastructure:`);
for (const [h, why] of FIXED) console.log(`    ${h.padEnd(44)} ${why}`);
console.log();
