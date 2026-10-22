/**
 * The pre-push metadata check.
 *
 * Every URL in the sitemap, fetched and read for the things a search engine
 * and a shared link depend on: that the page exists at all, that it has a
 * title, a description, a canonical and a share card, that it has exactly one
 * `h1`, and that no two pages claim the same title or description.
 *
 *   npm run build && npx next start -p 3000 &
 *   BASE_URL=http://localhost:3000 node scripts/check-meta.mjs
 *
 * It needs a production build for the same reason `check-layout.mjs` does:
 * `generateMetadata` and the `opengraph-image` routes are what is being
 * measured, and a dev server is not what ships.
 *
 * It exists because of what a first run found: **203 of 234 pages had no
 * `og:image`** — every translated guide and every language index, which is the
 * entire site outside English. Nothing could see it. The suite reads content
 * and source files; the layout check measures rendered width; a missing share
 * card is invisible to both and to every page that looks fine in a browser.
 * This site's early distribution is a link pasted into a fan community, so a
 * blank preview is a distribution cost paid silently, on the pages pasted into
 * the communities the translations exist for.
 *
 * The hard failures below are all defects of that kind — invisible on the page,
 * expensive off it. Length is reported and does not fail: Google rewrites
 * titles and descriptions often enough that a character count is a judgement
 * rather than a defect, and a check that fails on a judgement is one people
 * start ignoring.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

const res = await fetch(`${BASE}/sitemap.xml`);
if (!res.ok) {
  console.error(`Could not read ${BASE}/sitemap.xml (${res.status}). Is a production build running?`);
  process.exit(1);
}
const xml = await res.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// The sitemap is the list precisely because it is the list a crawler is given.
// A page missing from it is `app/sitemap.ts`'s own check to catch; a page *in*
// it that does not serve is this one's.
if (urls.length < 20) {
  console.error(`Only ${urls.length} URLs in the sitemap — that is not a whole site. Refusing to report a pass.`);
  process.exit(1);
}

const problems = [];
const notes = [];
const byTitle = new Map();
const byDesc = new Map();

const field = (head, re) => (head.match(re) ?? [])[1] ?? "";

for (const url of urls) {
  const path = new URL(url).pathname;
  const r = await fetch(new URL(path, BASE));
  const html = await r.text();
  const end = html.indexOf("</head>");
  const head = end === -1 ? html : html.slice(0, end + 7);

  if (!r.ok) {
    problems.push(`${path} — the sitemap offers this and it answers ${r.status}.`);
    continue;
  }

  const title = field(head, /<title>([^<]*)<\/title>/);
  const desc = field(head, /<meta name="description" content="([^"]*)"/);
  const canonical = field(head, /<link rel="canonical" href="([^"]*)"/);
  const ogImage = field(head, /<meta property="og:image" content="([^"]*)"/);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) problems.push(`${path} — no <title>.`);
  if (!desc) problems.push(`${path} — no meta description.`);
  if (!canonical) problems.push(`${path} — no canonical link.`);
  if (!ogImage) problems.push(`${path} — no og:image. A link to it previews blank.`);
  if (h1s !== 1) problems.push(`${path} — ${h1s} <h1> elements, expected exactly 1.`);

  if (title) byTitle.set(title, [...(byTitle.get(title) ?? []), path]);
  if (desc) byDesc.set(desc, [...(byDesc.get(desc) ?? []), path]);

  if (title.length > 60) notes.push(`${path} — title is ${title.length} chars; search results cut around 60.`);
  if (desc.length > 160) notes.push(`${path} — description is ${desc.length} chars; search results cut around 160.`);
}

// Two pages with one title are two pages competing for one result, and the
// usual cause is a template that stopped reading the thing that differs.
for (const [title, paths] of byTitle) {
  if (paths.length > 1) problems.push(`${paths.length} pages share the title "${title}": ${paths.join(", ")}`);
}
for (const [, paths] of byDesc) {
  if (paths.length > 1) problems.push(`${paths.length} pages share one meta description: ${paths.join(", ")}`);
}

console.log(`\nkpopgo meta — ${urls.length} URLs from the sitemap\n`);
for (const p of problems) console.log(`  ✗ ${p}`);
if (notes.length) {
  console.log(`\n  ${notes.length} over the length search engines display (not a failure):`);
  for (const n of notes.slice(0, 15)) console.log(`    · ${n}`);
  if (notes.length > 15) console.log(`    · … and ${notes.length - 15} more`);
}
console.log(
  problems.length === 0
    ? `\nALL CLEAN — every sitemap URL served, titled, described, canonical, carded and single-h1\n`
    : `\n${problems.length} PROBLEMS\n`,
);
process.exit(problems.length === 0 ? 0 : 1);
