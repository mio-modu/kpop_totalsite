# Handoff — 22 October 2026

Written at the end of a long session, for whoever picks this up next.

**Read `CLAUDE.md` first.** It is the real handoff: every rule in it is there
because breaking it cost something, and it is kept current deliberately. This
file holds only what CLAUDE.md cannot — the state of the work right now, what
is waiting on a person, and what is blocked.

---

## Where things stand

| | |
| --- | --- |
| Branch | a fresh branch off `main` per session — develop, commit and push there only |
| Open PR | none |
| Last merged | #60, `2974b58` — the four commits #59 left behind |
| Build | 267 static pages, 23 English guides, 10 languages, 193 translations |
| Suite | 61 tests, all passing |

Working practice in this repo: push to the branch, the owner merges, the next
change starts from the merged `main`. PR #58 merged as a merge commit, not a
squash, so the branch's history is clean — check this each time with
`git merge-base --is-ancestor <last-sha> origin/main` before assuming.

**That check is not a formality, and the pair of PRs below is why.** The venue
work was five commits on one branch. PR #59 was merged while the session was
still pushing to it, so `main` took the first commit and left the other four
behind — 806 lines, including the correction that the first drawing was
factually wrong, and including this file. Nothing was broken and nothing said
anything: the PR read as merged, the branch read as pushed, and for a while
`main` served a guide whose diagram was the false concentric-circle version.
PR #60 carried those four in. So run the ancestor check on **every** commit a
branch holds rather than on the last one a PR body names, and run it *after*
the merge rather than before.

**And write the branch name into this table only if you are going to keep it
current.** The row above used to name a specific branch, which was correct
while that branch was open and was read, by a later session, as an instruction
to push to a branch that had already been merged and deleted. A session's own
branch is assigned to it; the useful statement here is the practice, not the
name.

## What #59 and #60 contain

Two new venue guides' worth of work, in five commits, **all now in `main`** —
the SHAs below are the ones from the branch, and #60 rebased its four, so they
appear in `main` under different ones:

1. `1096c29` — the seat guide (`gocheok-sky-dome-finding-your-seat`), the
   `diagram` field, and a correction to the getting-there guide's station rows
   (this is the one #59 merged)
2. `3bf78bc` — the plan redrawn as a horseshoe, after measuring that the break
   in the seating is 44° / 71° / 91° / 96° by level rather than one gap
3. `77d9aaa` — the clockwise direction re-sourced: the chart's `alt` text is
   the operator saying 시계방향 in its own words
4. `ec4d6b3` — the venue's chart served from this site under 공공누리 제1유형,
   with hash watching and a test that the served copy is the recorded one
5. `2a96840` — this file

## Waiting on the owner

- **The allowlist is a partial paste again, and `www.kogl.or.kr` is one of the
  missing ones.** That is a host the *content* cites — the licence page the
  Gocheok chart is reproduced under — so the field needs the whole block from
  `npm run hosts`, supplied **inside a fenced code block** because pasting bare
  hostnames has twice come back markdown-linkified. Editing the field replaces
  it, so a partial paste is how hosts go dark.
- **Inspire Arena needs a live hostname, and that is the whole blocker.**
  `www.inspirekorea.com` was recorded here for weeks as blocked by the
  allowlist. It was never blocked: the gateway answers **502** to CONNECT for
  it where a refused host answers **403**, and a browser outside this container
  answers `DNS_PROBE_FINISHED_NXDOMAIN` — **the domain does not resolve.** It
  is the address Mohegan's own 2024 press releases give, so it was right once
  and is not now. The declaration is gone, with that evidence in
  `scripts/hosts.mjs` rather than a guess in its place. `inspireer.com` is the
  other address in circulation and was a pre-opening holding page in 2024, so
  it is a candidate to check and not an answer. Nothing in this container can
  resolve a domain the gateway has not been given, so finding the live host
  takes a browser or a current listing — not a paste.
- **GA4** — confirm the `scroll` key event and the internal-traffic filter are
  set to 사용 rather than 테스트.
- **Klook** — the accommodation commission rate is still unknown.
- **Verification.** All 23 guides are `sourced`. Nothing becomes `verified`
  until a person walks it; `VERIFY.md` Session A is the list.
- **One photograph would close a real gap.** Nobody publishes which gate at
  Gocheok faces which station exit — not the venue, not the map. A photo taken
  at Guil Station exit 2 showing the gate letter in front of you would finish
  the station → seat chain the seat guide currently has to work around.

## Known broken, not caused by this work

- `circlechart.kr` will not connect (`ws_closed_mid_exchange`, so it is the
  site failing rather than the allowlist). It is cited by the albums and
  Ktown4u guides. If it stays dead those citations need re-sourcing. Still
  dead when re-checked on 22 October 2026 — no response at all after 13
  seconds, which is the same failure rather than a slow page.
- The Yahoo rebrand page carries a 9% drift warning that is **standing on
  purpose** — its body does not extract cleanly. Never clear it with a plain
  `--record`; use `--record-new`.
- `scripts/hosts.mjs` declares `www.kspo.or.kr` as "KSPO Dome operator". That
  host is the sports foundation's corporate site, not the Olympic Park venue.
  Nobody has found the right hostname yet, so the comment is wrong and the
  KSPO guide is blocked on it.

## Next, in the order it was agreed

1. **Do not build a VENUES menu yet.** Two venues is not a section, and a menu
   promises coverage that does not exist. Three or four first.
2. **The next venue is whichever one actually hosts the most concerts
   reachable by overseas fans** — that needs checking, not assuming. KSPO and
   Inspire were the obvious guesses and both are blocked anyway.
3. Translation is finished and **ten languages is a hard ceiling**. CLAUDE.md
   records why, with the cost measured.

## Operational notes that cost time to learn

- **The layout check needs a production build**, not `next dev` — its own
  header says so, and a dev server gives unreliable measurements. Run
  `npm run build`, then `npx next start -p <port>`, then
  `BASE_URL=http://localhost:<port> node scripts/check-layout.mjs`.
- **`next dev` overwrites `.next`**, so a dev run between build and start
  leaves `next start` with no production build. Rebuild after any dev run.
- **A server from an earlier build can survive `pkill`** in this container and
  keep serving the old bundle on its port, which looks exactly like a change
  that did not apply. If a screenshot is identical to the previous one, check
  what is actually being served (`curl … | grep`) before editing anything.
- **Playwright** imports as a default export from this checkout's
  `kpopgo/node_modules/playwright/index.js`
  (`import pw from …; const { chromium } = pw;` — it is CommonJS). Resolve it
  against the repository root rather than writing an absolute path: the
  checkout directory is per container — `/home/user/kpop_totalsite` in this
  one, `/home/user/aiexpert` in the one that first wrote this line — and a
  stale absolute path fails as a missing module, which reads as a broken
  install rather than as a wrong path. Launch with
  `executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"` and
  `args: ["--no-sandbox"]`. Never run `playwright install`.
- **After any Korean text** run `node scripts/subset-fonts.mjs` and commit
  `app/fonts/`. The suite catches it, but only after the fact.
- **The content file mixes escape styles.** Some strings carry `'` and
  `"`; apostrophes and em dashes elsewhere are literal. Match whatever is
  actually on the line — grep it before writing a replacement.

## The two mistakes from this session worth not repeating

**A fact can be real and still be in the wrong place.** The getting-there
guide read the venue's four-column transit table one column out, giving Guro's
walking time to Gaebong and Sindorim's buses to Guro. Every individual fact
was true and from the real source. No check in the suite can see this, because
none of them knows which row a fact came from. Re-reading the source caught
it; re-reading the guide never would have.

**A drawing can be wrong, not just ugly.** The first venue plan drew four
concentric circles with one shared gap. Redrawing it honestly — four real
openings, measured — was also what made it legible. When a diagram looks like
a decoration, check whether it is lying before you restyle it.
