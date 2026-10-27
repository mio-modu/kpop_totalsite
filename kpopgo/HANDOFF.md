# Handoff — 27 October 2026

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
| Last merged | #68, `0694bbc` — the venue index and the Jangchung guide |
| Build | 322 static pages, 321 in the sitemap, 30 English guides, 10 languages, 273 translations |
| Suite | 101 tests, all passing |

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

## 27 October: the eight untranslated guides, and why they were a gap

The register was complete at its intended counts on 22 October, measured
against **twenty-one** English guides. There were twenty-nine by 27 October,
and the eight written in between carried no translation and no recorded
reason for having none. That is the state worth naming, because in a count it
is indistinguishable from the two guides that are deliberately English-only —
the timezone and customs guides, which have a documented test behind them
(a page whose subject is a jurisdiction the reader is not in). These eight
had only a chronology.

All eight are now in all ten languages: the TicketLink platform guide, both
halves of Gocheok, both halves of Seoul World Cup Stadium, Jangchung, the
venue hub, and the Weverse Shop / Ktown4u comparison. **Eighty pages.** The
sitemap went 240 → 321 and `check-meta` passes over every one of them with no
duplicate titles or descriptions.

Three checks had to be looked at rather than worked around, and each
narrowing carries a test that fires on the case the original check was built
for:

- **Hangul is no longer banned outright in a translation.** It may stay when
  the English field it translates carries the same run — which is the venue
  guides' whole case, since 고척스카이돔 and 시계방향 are in the English
  *because* the reader cannot read Korean and has to show the name to a taxi
  driver or match it on a chart. Derived from the English rather than
  declared in a list, so it cannot drift. A leak still fails: no English step
  says 제보자.
- **`Line` is in ALIASES for the messaging app**, and a venue guide saying
  "Guil Station on Line 1" demanded the app's name in a sentence about a
  train. The numbered sense is removed from the English before the nouns are
  read off it.
- **`--record-new` could not see a staged `sourceText: ""`.** The field is
  required by the type, so a new entry has to carry it empty; the pattern
  wanted at least one hex character, so the script inserted a *second*
  `sourceText` above each empty one. The later key wins in JavaScript, so
  every hash it reported writing was dead on arrival and the whole suite
  agreed. Only `tsc` objected, as TS1117.

`CLAUDE.md` now records where the KOGL conditions bind: the seat guide exists
in eleven editions and exactly one reproduces the chart, because the
translated template renders no document and no diagram. The instinct on
noticing would be to add the credit to the ten translations, which would
attribute a reproduction that is not there.

**Still true and still waiting on a person:** no guide is `verified`. Every
one is `sourced` or `reported`. That rung needs somebody to walk a flow —
`VERIFY.md` Session A.

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

- **Booking.com, through CJ Affiliate — signed up 23 October 2026, not usable
  yet.** The CJ publisher account exists and its **Account ID (PID) is
  `8107329`**, which is the number every Booking link will carry. Nothing is in
  `content/affiliates.ts` for it, deliberately: CJ approval is two-stage, the
  Booking.com programme has not approved the application yet, and a registered
  partner with no working advertiser link is a paid link that earns nothing —
  which `scripts/affiliate.test.mjs` would refuse anyway, since it has no URL
  to check attribution on. Six onboarding tasks have to be completed before the
  application is even submitted; `kpopgo.app` goes in under Promotional
  Properties, and the tax form for a Korean partner is a W-8BEN. When the
  programme approves, the things needed here are that PID and one generated
  advertiser link — the link reveals which CJ redirect domain the account uses
  (`anrdoezrs.net`, `kqzyfj.com`, `jdoqocy.com` or `tkqlhce.com`), which is
  what `scripts/hosts.mjs` then needs to declare.

- **Nothing is waiting on `www.ksponco.or.kr`, and that line was wrong.** It
  was offered here as the KSPO DOME host on the strength of search results,
  flagged as unread, and a later session settled it by probing instead:
  `www.kspo.or.kr` answers 200 and is the foundation's corporate site with no
  venue page on it, and the hall's own operator is Olympic Park, whose host
  drops the connection on every attempt even once allowlisted. KSPO DOME is
  not writable from here at all — see the venue section in `CLAUDE.md`.
  Allowlisting one more host does not change that.

  The transferable part is the mistake: a hostname taken from search results
  reads exactly like one taken from the site, and the only difference is
  whether anybody fetched it. Probe before declaring.
- **An allowlist edit does reach a running container — it just is not
  instant.** An earlier version of this file said the opposite, and said it
  from one measurement: the three hosts were pasted, all three still answered
  403 a minute later, and that was written down as "needs a new session". Two
  of them answered 200 on a retry some minutes afterwards. The wrong half of
  that conclusion is the expensive half, because it sends the next session to
  open a new one for nothing. **Re-probe a denied host after a few minutes
  before concluding anything about the paste** — and note the shape of the
  error: one measurement, written up as a rule, in a session whose whole
  subject was that exact mistake.
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
- **The Yahoo rebrand page's drift is live market tickers, and it can never be
  cleared by re-baselining.** It was written down here as "its body does not
  extract cleanly", which is true and too vague to act on. Re-read on 22
  October 2026: the page returns 696 words and most of them are Yahoo's
  chrome — nav, plus a strip of live index prices (Straits Times, Nikkei, Hang
  Seng, Bitcoin). Those move every day, so the fingerprint moves every day
  whatever the article does. A baseline taken today drifts tomorrow. The real
  fix is to re-source to the PR Newswire original the page is a syndication
  of, which needs `prnewswire.com` on the allowlist first — do not declare it
  before somebody can read it.
- **1 December 2025 is right, and nothing we cite says so. That is the open
  item — a sourcing gap, not a factual error.** Found by doing what the drift
  warning asks: re-reading the page against the guides citing it. The Yahoo
  page carries no 1 December date anywhere — its byline is 2 December 2025 and
  the press release's own dateline is **SEOUL … Dec. 3, 2025 /PRNewswire/**.

  The site asserts 1 December in six places in `content/guides.ts` and in
  twenty-plus translation strings across at least five languages, so it was
  worth settling rather than guessing. It is settled, and the date stands:
  NOL World's own account announced the change as taking effect 1 December,
  its site ran a rebranding giveaway from 1 to 24 December, 디지털데일리 and
  파이낸셜뉴스 reported the 개편 on 2 December, and 나무위키 records 1 December.
  The press release is the announcement of a change that had already
  happened, which is why its dateline is later. Both source *labels* claimed
  "1 Dec 2025" for that announcement and are corrected to the date it
  actually carries.

  **What is left is a citation that states the date.** The convergent evidence
  above came from search results, not from a page anybody here read, and that
  is not what this site counts as a source. The one to cite is NOL World's own
  rebranding article —
  `world.nol.com/en/content/articles/46e54f60-eb89-4f75-b1de-d33536f3b1f3`
  ("We're rebranding") — which cannot be read from this container, since
  `world.nol.com` 403s from CloudFront. Read it, confirm it gives 1 December,
  and add it to both guides' `sources`. Until then the site's most-repeated
  date rests on a page that does not contain it.
- **KSPO DOME is closed, not pending.** The old `www.kspo.or.kr` declaration
  calling it "KSPO Dome operator" was wrong — that is the foundation that owns
  the park, and its site carries no seating page. `www.ksponco.or.kr` was my
  replacement guess and it was no better, because it came from search results
  rather than from a fetch. Probed properly, the operator is Olympic Park and
  its host closes the connection every time once allowlisted, which means the
  source cannot be fingerprinted or link-checked and citing it would put a
  dead citation in the weekly report forever. Seoul World Cup Stadium was
  written instead.
- **Inspire Arena is blocked on sources, not on the allowlist, and three
  routes to it are now closed.** The official hostname in Mohegan's 2024 press
  releases, `www.inspirekorea.com`, no longer resolves (NXDOMAIN in a real
  browser). `inspireer.com`, the other address in circulation, answers 504.
  And NOL World — which does carry an Inspire Arena venue page and is already
  declared — answers **403 from CloudFront** to this container, which is the
  site refusing automation rather than the allowlist refusing the site, the
  same state `tkglobal.melon.com` is declared under. So the venue has no
  readable source from here at all. Its ticketing runs through NOL/Interpark,
  which is worth knowing: a NOL World venue page read by a person is a more
  honest source for this site's scope than a resort's marketing site would
  have been.

## Next, in the order it was agreed

1. **Do not build a VENUES menu yet.** Two venues is not a section, and a menu
   promises coverage that does not exist. Three or four first.
2. **The next venue is whichever one actually hosts the most concerts
   reachable by overseas fans** — that needs checking, not assuming. KSPO and
   Inspire were the obvious guesses and both were blocked.

   Checked on 22 October 2026 as far as this container allows, which is not
   far: **no per-venue count of concerts exists in any source reachable from
   here.** The ticketing sites that hold the answer — Interpark/NOL venue
   pages, YES24, TicketLink — are either undeclared or block automation, and
   `world.nol.com` 403s from CloudFront. So the check cannot be completed
   here, and that is the finding rather than a reason to fall back on the
   guess.

   What the 2026 schedules visible in search do say, directionally and not as
   a count: KSPO DOME carries by far the most K-pop dates of the four — NCT
   Dream over six, ZEROBASEONE three, plus TWS, DAY6, TWICE and BOYNEXTDOOR
   across the summer — against two aespa dates at Gocheok, a handful at
   Inspire, and nothing found at KINTEX. The second half of that reasoning
   has since been overtaken: KSPO DOME looked like the only one whose official
   source this site could read, and probing found the opposite — its
   operator's host will not serve this container at all. Venue choice
   therefore runs on what is *fetchable* as much as on what is busy, which is
   how Seoul World Cup Stadium came to be second. The count itself is still
   the thing nobody has: a person with one ticketing site open settles it in
   ten minutes.
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
