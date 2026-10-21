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
  ["www.kspo.or.kr", "KSPO Dome operator — the main Seoul K-pop arena"],
  ["kspo.or.kr", "KSPO Dome, apex"],
  ["www.sisul.or.kr", "Seoul Facilities Corporation — Gocheok Sky Dome and Jamsil"],
  ["www.inspirekorea.com", "Inspire Arena, Incheon — the newest large venue"],
  ["www.kintex.com", "KINTEX, Goyang — hosts arena-scale concerts and fan events"],
  ["english.visitseoul.net", "Seoul tourism, English — transport and access pages"],
  ["www.seoulmetro.co.kr", "Seoul Metro — the line and exit a venue is reached from"],
  // Loaded by the reader's browser, not by this container — but the headless
  // browser in scripts/check-layout.mjs is in this container, so allowing
  // them keeps the layout check rendering the page a reader actually gets.
  ["www.googletagmanager.com", "GA4, loaded client-side"],
  ["pagead2.googlesyndication.com", "AdSense, loaded client-side once ids are set"],
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
