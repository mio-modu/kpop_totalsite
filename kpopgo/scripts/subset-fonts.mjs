/**
 * Cut the Korean webfonts down to the Korean this site actually sets.
 *
 *   node scripts/subset-fonts.mjs
 *
 * A Hangul font carries 11,172 syllables. This site sets 241 of them — every
 * Korean word on it is one a fan meets on a real booking screen, and that is a
 * closed list, not prose. Shipping the other 10,931 cost 1.6MB, which was 98%
 * of the page weight and most of a mobile performance score, to draw nothing.
 *
 * `subsets: ["latin"]` in next/font/google does not help here: it governs
 * which ranges are preloaded, not which exist, and the browser still fetches
 * the Korean ranges the moment Korean renders. The fix is to ask Google for a
 * font containing exactly these characters — the documented `text=` parameter
 * — and self-host what comes back.
 *
 * The files are committed rather than fetched during the build. A build that
 * reaches out to fonts.googleapis.com is a build that fails when Google has a
 * bad afternoon, and it would also mean the bytes shipped to readers were
 * never reviewed by anyone.
 *
 * scripts/fonts.test.mjs fails if any Hangul in the content is missing from
 * covered.json, which is the one way this can silently rot: add a word with a
 * new syllable and it would otherwise render in the fallback face.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url);
const OUT = new URL("app/fonts/", ROOT);

/** Chrome, because Google serves woff2 only to browsers that admit to it. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FACES = [
  { file: "gothic-a1-400", family: "Gothic+A1", weight: "400" },
  { file: "gothic-a1-700", family: "Gothic+A1", weight: "700" },
  { file: "gothic-a1-900", family: "Gothic+A1", weight: "900" },
  { file: "black-han-sans-400", family: "Black+Han+Sans", weight: "400" },
];

const SOURCES = [
  "content/*.ts",
  "app/**/*.tsx",
  "app/**/*.ts",
  "components/*.tsx",
];

/** Every Hangul syllable and jamo the site sets, from the files that set it. */
export async function usedHangul() {
  const chars = new Set();
  for (const pattern of SOURCES) {
    for await (const file of glob(pattern, { cwd: ROOT })) {
      const text = await readFile(new URL(file, ROOT), "utf8");
      for (const ch of text) {
        if ((ch >= "가" && ch <= "힣") || (ch >= "ㄱ" && ch <= "ㆎ")) {
          chars.add(ch);
        }
      }
    }
  }
  return [...chars].sort().join("");
}

async function fetchFace({ family, weight }, text) {
  const url =
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}&display=swap`;
  const css = await (await fetch(url, { headers: { "user-agent": UA } })).text();
  // A text= subset is served from /l/font?kit=… with no file extension, so
  // match the url() and verify the format from the declaration beside it
  // rather than from the path.
  const src = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!src || !/format\(['"]woff2['"]\)/.test(css)) {
    throw new Error(
      `No woff2 src in the CSS for ${family} ${weight}.\n${css.slice(0, 300)}`,
    );
  }
  const bytes = Buffer.from(await (await fetch(src)).arrayBuffer());
  // A subset of 241 glyphs lands around 20–30KB. Anything near the full face
  // means text= was ignored and we are about to commit 1.6MB by accident.
  if (bytes.length > 200_000) {
    throw new Error(
      `${family} ${weight} came back at ${(bytes.length / 1024).toFixed(0)}KB — ` +
        `that is a full face, not a subset. Refusing to write it.`,
    );
  }
  return bytes;
}

/*
 * Everything below runs only when this file is the program, never on import.
 *
 * It used to run on import, and scripts/fonts.test.mjs imports `usedHangul`
 * from here — so the test regenerated the subset as a side effect and then
 * compared the content against the file it had just written. It could not
 * fail. Six characters were missing from the committed faces on 22 October
 * 2026 (길 까 닙 답 돔 척, from a new guide's Korean line) and the suite
 * reported three passes.
 *
 * That is precisely the rot CLAUDE.md says this test exists to prevent: a new
 * syllable renders in the fallback face and reads as a typo nobody catches.
 * A test that fixes the thing it is checking is worse than no test, because
 * it also reports success.
 */
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const text = await usedHangul();
  await mkdir(OUT, { recursive: true });

  let total = 0;
  for (const face of FACES) {
    const bytes = await fetchFace(face, text);
    await writeFile(new URL(`${face.file}.woff2`, OUT), bytes);
    total += bytes.length;
    console.log(`  ${face.file.padEnd(20)} ${(bytes.length / 1024).toFixed(1).padStart(6)} KB`);
  }

  await writeFile(
    new URL("covered.json", OUT),
    `${JSON.stringify({ generated: new Date().toISOString().slice(0, 10), count: [...text].length, chars: text }, null, 2)}\n`,
  );

  console.log(`\n  ${[...text].length} characters, ${(total / 1024).toFixed(1)} KB total.`);
  console.log("  Run `npm test` to confirm nothing in the content falls outside it.");
}
