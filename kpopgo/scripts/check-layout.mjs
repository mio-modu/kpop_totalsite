/**
 * The pre-push layout check.
 *
 * Every route, both themes, five widths. What it reports is horizontal
 * overflow, which is the failure this site keeps having: a utility class that
 * quietly sets `display` and overrides Tailwind's `hidden`, a nav bar that runs
 * past the viewport at 320px, an object that does not shrink. None of it shows
 * at desktop width, and all of it shows to most of the traffic.
 *
 *   npm run build && npm run start &
 *   node scripts/check-layout.mjs [outputDir]
 *
 * Screenshots land in the output directory at 390 and 1280. The browser is the
 * one already in the container — never run `playwright install`.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = process.argv[2] || ".layout-check";
const BASE = process.env.BASE_URL || "http://localhost:3000";
fs.mkdirSync(OUT, { recursive: true });

/**
 * Refuse to measure a page whose stylesheet has not fully applied.
 *
 * This check once reported ten confident failures on the home page — a
 * decoration that is `display: none` on a phone laid out at full width and
 * tripped the artwork cap at every width, in both themes. The page was
 * correct: the same element measured 0px at 390px and 274px at 1280px in
 * production, and the production CSS carried the right rules.
 *
 * So the measurement was wrong, not the page. The cause was never
 * established — it reproduced across two runs against a dev server and then
 * stopped reproducing against a cold one, which rules out the easy story
 * that `next dev` simply does not apply these rules. Whatever it was, it was
 * transient and it was silent.
 *
 * That is the part worth guarding. False alarms are the cheap half: the same
 * gap means a real overflow can be measured against an unstyled page and
 * reported clean, which is the failure this whole script exists to prevent.
 *
 * So rather than sniffing for a server type, the guard asserts the property
 * that actually broke: `.prop` must compute to `display: none` at phone
 * width, because that rule is in the stylesheet and nothing else sets it. If
 * it has not applied, nothing measured afterwards means anything, so stop
 * rather than report. The script's header already said to run this against
 * `npm run build && npm start`; that was a convention, and this is the part
 * of it a machine can hold.
 */
async function assertStylesApply(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 90_000 });
  const state = await page.evaluate(() => {
    const el = document.querySelector(".prop");
    return el ? getComputedStyle(el).display : "missing";
  });
  await ctx.close();
  if (state !== "none") {
    console.error(
      `\n  ✗ The stylesheet has not fully applied: .prop computes to ` +
        `"${state}" at 390px, and it must be "none".\n` +
        `    Nothing measured against this page describes production, in\n` +
        `    either direction, so this run is stopping rather than reporting.\n\n` +
        `    Serve a build and try again:\n` +
        `      npm run build && npm start &\n` +
        `      node scripts/check-layout.mjs\n`,
    );
    process.exit(2);
  }
}


/**
 * One translated route per locale, chosen by what actually overflows.
 *
 * This list used to be written by hand, under a comment claiming it held
 * "the longest guide in each" language. That was true the day it was written
 * and quietly stopped being true, which is the ordinary fate of a hand-kept
 * list — and the failure mode is bad: the check measures five pages, reports
 * ALL CLEAN, and the page somebody just edited was never among them. That
 * happened the day the chart guides gained `HF0082KTU001`; the English albums
 * guide was covered by luck and no translated page carrying the code was
 * looked at.
 *
 * What breaks a narrow column is not length. It is a run of characters with
 * nowhere to wrap: an identifier, a URL, a long affixed Indonesian word. So
 * each locale contributes the guide holding its longest unbreakable run, read
 * out of the register. Add a code or a link to a translation and that page
 * becomes the one measured, without anybody remembering to say so.
 */
function riskiestPerLocale() {
  const src = fs.readFileSync(new URL("../content/translations.ts", import.meta.url), "utf8");
  const starts = [...src.matchAll(/^ {4}locale: "([a-zA-Z-]+)",\n {4}slug: "([a-z0-9-]+)",/gm)];
  const best = new Map();
  for (const [i, m] of starts.entries()) {
    const block = src
      .slice(m.index, starts[i + 1]?.index ?? src.length)
      // Drop the structural fields. A slug is forty-five characters of
      // unbreakable ASCII and appears on every entry, so leaving it in makes
      // every locale pick whichever guide links to the longest-named one —
      // a property of the file, not of anything a reader sees.
      .replace(/^\s*(?:locale|slug|url|id|sourceChecked|translated|review|art|glyph):.*$/gm, "");
    // Latin letters, digits and the punctuation that joins them — the only
    // characters here with no break opportunity inside them. Measuring any
    // run of non-space instead makes every Japanese sentence a 350-character
    // "unbreakable" token, because Japanese sets no spaces; it wraps between
    // characters perfectly well, and the thing that does not is `HF0082KTU001`
    // or a URL sitting inside that sentence.
    const runs = block.match(/[A-Za-z0-9][A-Za-z0-9._/:+-]{6,}/g) ?? [];
    const longest = runs.reduce((n, r) => Math.max(n, r.length), 0);
    const [locale, slug] = [m[1], m[2]];
    if (!best.has(locale) || best.get(locale).longest < longest) {
      best.set(locale, { slug, longest });
    }
  }
  return [...best].map(([locale, { slug }]) => [
    `guide-${locale.toLowerCase()}`,
    `/${locale.toLowerCase()}/guides/${slug}`,
  ]);
}

/**
 * Every language index, one route each.
 *
 * Not narrowed to a riskiest one the way the guides are, because there is
 * nothing to narrow: all ten indexes list the same nineteen titles, so what
 * differs between them is the script and the word lengths — which is the whole
 * thing this check is for. Thai stacks marks two deep, Filipino has the
 * longest words on the site, and the card grid is new template rather than the
 * guide template with other words in it.
 */
function localeIndexes() {
  const src = fs.readFileSync(new URL("../content/translations.ts", import.meta.url), "utf8");
  const locales = [...new Set([...src.matchAll(/^    locale: "([A-Za-z-]+)",$/gm)].map((m) => m[1]))];
  return locales.map((l) => [`hub-${l.toLowerCase()}`, `/${l.toLowerCase()}`]);
}

const ROUTES = [
  ["home", "/"],
  ["guides", "/guides"],
  ["guide", "/guides/buy-k-pop-albums-from-overseas"],
  ["words", "/words"],
  ["about", "/about"],
  // The chooser carries six cards with their own lists, so it is the widest
  // thing on the site after the home page — and /editorial-policy grows every
  // time a correction is logged. Both were outside this check until they
  // weren't representative any more.
  ["where-to-buy", "/where-to-buy"],
  ["policy", "/editorial-policy"],
  ["report", "/report"],
  // The translated routes are derived, not listed — see riskiestPerLocale().
  ...riskiestPerLocale(),
  ...localeIndexes(),
];
const WIDTHS = [320, 360, 390, 768, 1280];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
await assertStylesApply(browser);

let bad = 0;
for (const theme of ["dark", "light"]) {
  for (const [name, path] of ROUTES) {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 },
        deviceScaleFactor: 1,
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      // A page that errored has no horizontal overflow either, and this script
      // once reported ALL CLEAN across a run where the home page and every
      // guide were returning 500. A check that passes on a broken page is
      // worse than no check, so the status is now part of the check.
      if (!res || res.status() >= 400) {
        bad++;
        console.log(`  ✗ HTTP ${res?.status() ?? "no response"} ${theme} ${name} @${w}`);
        await ctx.close();
        continue;
      }
      // Walk the page before measuring. Everything below the fold loads lazily,
      // and a full-page screenshot does not reliably trigger it — which cost an
      // hour once, chasing a decorative image that was rendering correctly and
      // simply had not been fetched when the shot was taken.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      const h = await page.evaluate(() => document.body.scrollHeight);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (over > 0) {
        bad++;
        console.log(`  ✗ OVERFLOW ${theme} ${name} @${w}: +${over}px`);
      }
      // Every real page here clears a thousand pixels. Anything shorter is an
      // error page, an empty render or a route that silently stopped existing.
      if (h < 1000) {
        bad++;
        console.log(`  ✗ TOO SHORT ${theme} ${name} @${w}: ${h}px — did it render?`);
      }
      // No in-flow object may eat half the screen before the reading starts.
      // This is here because the guide pages' cap silently did not apply for
      // a long time: `max-w-[420px]` sat on the same element as `.wrap`,
      // which sets max-width too, so equal specificity meant source order
      // decided and 1140px won. One piece rendered 1979px tall above the
      // first step, and nothing failed — a cap nobody measures is not a cap.
      //
      // Scoped to `.art-drop`, which is the cut-out treatment objects inside
      // the reading flow get. Full-bleed pieces pass `drop={false}` and are
      // deliberately large: the home hero is the page's opening image, not
      // something standing between a reader and a step.
      const tall = await page.evaluate(
        (vh) =>
          [...document.querySelectorAll("img.art-drop")]
            .map((el) => ({
              src: (el.getAttribute("src") || "").split("/").pop(),
              h: Math.round(el.getBoundingClientRect().height),
            }))
            .filter((x) => x.h > vh * 0.5),
        h === 0 ? 800 : (await page.viewportSize()).height,
      );
      for (const t of tall) {
        bad++;
        console.log(
          `  ✗ ARTWORK ${theme} ${name} @${w}: ${t.src} is ${t.h}px, over half the viewport`,
        );
      }
      if (w === 390 || w === 1280) {
        await page.screenshot({
          path: `${OUT}/${theme}-${name}-${w}.png`,
          fullPage: w === 1280,
        });
      }
      if (w === 1280 && theme === "dark") console.log(`  ${name}: ${h}px tall`);
      await ctx.close();
    }
  }
}
await browser.close();
console.log(bad === 0 ? "ALL CLEAN — every page served, rendered and fit" : `${bad} PROBLEMS`);
process.exit(bad === 0 ? 0 : 1);
