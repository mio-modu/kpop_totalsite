# KPOPGO — working rules

Step-by-step guides for international K-pop fans buying tickets, memberships and
albums from outside Korea. English is canonical. Production domain is
`kpopgo.app`.

Read this before changing anything. Most of what follows is a constraint that
looks arbitrary until it is violated, and then costs the site something it
cannot buy back.

## The three rules that are not negotiable

**No idol photographs, likenesses, or AI-generated faces.** Not one, anywhere.
Agencies enforce portrait rights aggressively, and a takedown can reach the
AdSense account as well as the page. Every figure on the site is an anonymous
backlit silhouette — the language of a concert poster — and every object was
drawn or rendered for this site. Generating an idol's face rather than copying
a photograph does not help: copyright and the right of publicity are separate
rights, and the second one is the problem.

**No identity-check workarounds.** Where a platform requires Korean 본인인증 we
say so and describe the official routes open to overseas fans. We do not
explain how to get around a verification, borrow a Korean number, or use
someone else's membership. A reader who follows that advice loses their order;
a site that gives it loses the only thing it sells.

**Nothing is marked verified until a person has walked it.** Every guide in
`content/guides.ts` carries `status`, `lastChecked`, `scope` and `sources`.
`status` is a ladder of evidence, not a progress bar — `draft`, `sourced`,
`reported`, `verified` — and each rung renders a notice saying which kind of
check the page has had. All twenty are `sourced` today: every claim is traced to
a linked, dated official source, and nobody has walked a flow end to end. The
entire premise is being more accurate than the stale guides that currently
rank, so claiming a verification that did not happen makes us one of them.

**A weaker claim expires sooner.** `SHELF_LIFE` in `lib/freshness.ts` gives
`sourced` 90 days and `verified` 180, and `displayStatus` derives what the page
is still entitled to say rather than trusting what is stored. That ordering is
what keeps `sourced` from being a loophole, and `scripts/freshness.test.mjs`
asserts it. Do not add a rung without a shelf life shorter than the rung above
it, and do not stretch a shelf life to avoid re-checking something.

**A cited source can change without the link breaking.** `scripts/watch.mjs`
fingerprints the visible text of every fixed document a guide cites and
reports when the wording moves — Weverse's shipping-exclusions notice is
literally titled "updated on Jul. 15, 2026" and is edited in place, so a 200
proves nothing. Storefronts are link-checked only; their wording is supposed
to move. Take a new baseline with `npm run watch -- --record` *after*
deliberately re-reading a source, never to silence a warning.

That last sentence was the whole safeguard, and a rule that lives only in a
sentence gets broken by the next person in a hurry — which here was me.
Adding the Ktown4u guide left its seven notices with no baseline, and the
obvious fix, a plain `--record` run, would also have re-baselined the Yahoo
rebrand page, clearing a 9% drift warning that is standing **on purpose**
because that page's body does not extract cleanly. A silenced warning and a
checked source look identical afterwards.

So `npm run watch -- --record-new` now writes only the entries that are
missing and leaves every existing baseline untouched. Use it when a new guide
brings new sources; keep `--record` for a deliberate re-read, which is the one
case where overwriting is the point.

**And `--record-only=<url fragment>` closes the other half, which was that a
single warning could not be cleared honestly at all.** The honest way to clear
a drift warning is to re-read that page against the guide citing it — but the
only tool for writing a baseline afterwards was `--record`, which re-baselines
everything it can fetch. So resolving one warning meant accepting every other
page's current wording as read. One option left the warning standing forever,
the other cleared more than anybody had looked at, and a check with no honest
route to green is a check people learn to ignore — the same failure as a
permanent false alarm, from the opposite direction. Two guards, since a flag
that silently records nothing is worse than no flag: a fragment matching no
source fails, and a fragment matching *every* comparable source fails too,
because that is `--record` in disguise. The run then names the URLs it
re-baselined, since a re-baseline is a claim that somebody read those pages.
All four refusal paths were proved by running them, and nothing is written
when a guard fires.

**The Yahoo page turned out not to be a case for it, which is worth knowing
before reaching for the flag.** Its drift was recorded here as "its body does
not extract cleanly" — true, and too vague to act on. Re-read on 22 October
2026: of 696 words, most are Yahoo's chrome, including a strip of live index
prices. Those move daily, so the fingerprint moves daily whatever the article
does, and a baseline taken today drifts tomorrow. Re-sourcing to the PR
Newswire original is the fix; re-baselining is not. A warning that no
re-baseline can clear is a signal about the citation, not about the page.

**Doing what that warning asked found something much worse than drift**, and
it is recorded in `HANDOFF.md` rather than here because it needs a decision:
the site dates the NOL World rename to 1 December 2025 in six places, and the
cited page carries no 1 December date anywhere — Yahoo's byline is the 2nd and
the press release's own dateline is the 3rd. Twenty-plus translation strings
carry the date too. Every fact on the page real, one of them in the wrong
place, nothing in the suite able to see it: the station rows again. Note the asymmetry is real: that run
reported `1 needing action, 1 worth a look` **after** writing, because leaving
a warning standing is what it is for.

**A permanent false alarm is worse than no alarm.** `korea.net` was reported
as a dead citation week after week and written off in this repo as an endless
302 loop that only affects bots — the page opens fine in a browser, so nothing
to fix. That was wrong, and it was wrong in the direction that costs most: it
taught everyone reading the weekly report to skip that line, and then the next
one like it. The site sets a session cookie and redirects once; a client that
does not keep the cookie is sent back to the same URL forever, which is what
the redirect counter was really showing. `scripts/watch.mjs` now carries a
cookie jar, and korea.net answers 200 with 757 words — confirmed on a GitHub
runner too, where that `✗` is now gone.

**YES24 was not the same bug, and claiming it was is the mistake worth keeping
written down.** Its storefront came back as 26 words of shell, the cookie jar
turned that into 319 words from this container, and the obvious conclusion was
wrong: on a GitHub runner, the same commit on the same day still gets 26
words. The difference is the network, not the cookie. A fix verified in one
environment and announced for both is how a false alarm gets re-badged as
fixed.

So the brand check stopped guessing. It read `r.body`, the raw HTML, where a
name surviving inside a `<script>` blob counts as present and a page rendering
it from JSON counts as renamed — neither is the question. It now reads the
visible text, and refuses to judge a page that came back under the same
40-word threshold the fingerprint comparison uses, saying it cannot judge
rather than inventing a rename. `ticket.yes24.com` is exactly that page from
some networks and not others.

Two things that nearly shipped from this, both caught by running it rather
than reading it: `visibleText()` lowercases, so comparing `"NOL"`, `"Weverse"`
and `"YES24"` against it reported all three as renamed at once — one false
alarm would have become three. And `BRAND_WATCH` still pointed at
`concerts.weverse.io`, which 302s to the singular host; the guides were
corrected for that earlier in the day and this list was not, because it is a
different list.

The same change retired a conditional that made this hard to see. The script
used to pick curl behind a proxy and node's `fetch` otherwise, with a comment
saying a local run and the weekly run "should exercise the same code path
wherever they can" — which they never could, because the proxy is exactly what
decides. The path a change was written against was never the path CI ran.
There is one path now, and curl exists in both places.

The weekly workflow also stopped commenting on every run. It had sixty-three
`Still open as of this run` comments on one issue, which is an alarm nobody
hears. It now compares the lines that ask for a person — the `✗` and `!` ones,
not the header's date or the per-guide day counters, which change on their own
— and comments only when that set changes. The issue body is refreshed every
run regardless, so the current state is never stale; only the notification is
held back.

**The checks did not run on most changes, and now they do.**
`.github/workflows/kpopgo-watch.yml` sweeps the network weekly and keeps its
test step, correctly: several assertions are date-dependent and go red as
shelf lives expire rather than because anyone edited anything, so the schedule
needs them. But its push trigger is narrowed to `content/guides.ts` and
`scripts/watch.mjs`, so that a network sweep does not fire on every commit —
and the effect was that a change to the translation register, to `lib/`, to
`app/`, or to the test files themselves ran nothing. A commit adding a test to
this repo was not tested by it.

`.github/workflows/kpopgo-checks.yml` is the per-change gate: the suite and
`tsc --noEmit` on anything under `kpopgo/`. The suite imports only node
builtins and one local module, so that job installs nothing and takes
seconds. `next build` is deliberately absent — Vercel builds every push and
reports it as a commit status — as is `next lint`, which in Next 15.5 prompts
for an ESLint config this project does not have and cannot complete
unattended. The repository is public, so the minutes are free.

**A derived status needs a rebuild to come down.** Every route that shows one
carries `export const revalidate = 86400`. A fully static page freezes the
status on the day it deploys, which is the exact failure the expiry exists to
prevent — so if you add a page that renders a status, give it the same line.

## Why this site exists

The English guides ranking for "how to buy K-pop concert tickets" describe a
ticketing site that has since been renamed, under rules that have since
changed:

| What changed | When |
| --- | --- |
| Interpark Ticket → NOL Ticket | April 2025 |
| interpark Global → **NOL World** | 1 December 2025 |
| Revised Performances Act in force | 28 August 2026 |

The schedule and profile niches are taken — Billboard and Soompi run tour
lists, and there are city-level specialists. The *procedure* niche is not: the
competition there is travel-agency blogs and a prepaid-card company's content
marketing. That is a winnable set, and it is why the site is a how-to and not
a wiki.

## Design

Built against the webdesign-style system, mixing codes per section rather than
committing to one across the whole site:

| Section | Code |
| --- | --- |
| Home hero, crowd band | **T09 영화 같은 한 장면** — 빛은 뒤에서 |
| Numbers, proof blocks | **T20 숫자로 증명하기** |
| Objects, cards | **T13 보송한 3D 사물** — 반짝임 금지 |
| Booking screens | **T21 화면 캡처 겹치기** — 진짜 데이터만 |

T09 and T13 conflict on purpose and both sit in the DEPTH group, so they read
as one set. T17 is deliberately unused: its no-gradient rule would make the
hero's backlit glow impossible.

**Dark is the resting state.** A first pass led with cream paper and matte
objects — a passport, a bank card, a parcel box. It was well made and it was
wrong: it read as a fintech or a shipping service, and a fan arriving from a
fan community saw nothing of their own world. Every surface this audience
already lives on is black with saturated light on it.

Palette: 주朱 vermilion leads, with electric cyan and hot violet behind it —
the lightstick trio, so the page is never monochrome, which no K-pop surface
is. The three combine into `--foil`, used **only on edges and marks**, never as
a background wash. That distinction is the whole thing: a photocard's edge
really is iridescent, so the gradient describes an object rather than
decorating a box.

**A large vermilion field is not a large version of a small one.** `.flood`
is right where it is used as a mark — the city ticker is a 48px strip and
reads as saturated light on a black page, which is the brief. The same fill
over a 700px section stops being a mark and becomes a room, and in dark mode
an inverted one: a bright field with near-black text inside a near-black page,
so the eye adapts twice while scrolling a single page. The rule is **area, not
hue**. Below the threshold the fill stays vermilion; above it, `.flood-band`
makes the section black with vermilion light on it — the T09 code the hero
already uses, 빛은 뒤에서, rather than a new idea. Light mode keeps the fill at
both sizes, because on cream paper the red band is the dark element and
nothing inverts.

The hairlines, numerals and Korean subtitle in that band moved from inline
styles to theme tokens in the same change. `rgba(0,0,0,.22)` was correct on a
red ground and invisible on a dark one, which is exactly what a token exists
to stop — if a value has to change with the theme, it cannot live in JSX.

A guide is a **photocard** (`.pc`): a Korean word as its face, an outlined
tracklist number that fills on hover, and a foil edge that lights only on hover
or focus. Korean terms are **stickers** (`.sticker`). The verification badge is
a 인장 seal, because a seal is a mark of authentication and that is the product.

The energy lives in the chrome — hero, cards, bands, marquees. The reading body
stays calm, because what the site sells is being right, and a page that shouts
through an instruction undercuts it.

Type: Archivo (wide poster display), Gothic A1 and Black Han Sans (Hangul),
JetBrains Mono (dates, platform codes, step timings).

**The Hangul faces are self-hosted subsets, not Google imports.** A Hangul
font carries 11,172 syllables; this site sets 241, because every Korean word
on it comes from a real booking screen and that is a closed list. Imported
whole they were 1.6MB, 98% of the page weight, to draw nothing — and
`subsets: ["latin"]` does not help, since it governs which ranges are
preloaded, not which exist.

After adding any Korean text, run `node scripts/subset-fonts.mjs` and commit
`app/fonts/`. `scripts/fonts.test.mjs` fails if the content outgrows the
subset, which is the only way this rots quietly: a new syllable renders in the
fallback face and reads as a typo nobody catches.

## Hangul is content, not ornament

Every Korean word on the site is one a fan meets on a real booking screen —
본인인증, 선예매, 결제 — and `/words` exists to teach exactly those. Do not add
Hangul as decoration, and do not translate the site into Korean: the paying
audience is Tier-1 English speakers, there is no Korean-language demand for a
guide to buying Korean tickets, and machine translation would put the legal and
verification wording at risk. Other languages are handled under **Languages**
below, which replaces an earlier promise that they would all be hand-reviewed:
that rule was unkeepable at this scale and the honest version is a declared
`review` level per translation, so a page says which kind it is instead of a
policy claiming a standard nobody is meeting.

## Languages

English is canonical and carries no path prefix. `content/translations.ts` is
the register, and the machinery landed before the first translated word, as it
did for paid links, because a translation added to a site with no freshness
rules becomes the undated guide this site exists to replace.

Ten languages today, none native-reviewed, and all ten **complete at their
intended counts** as of 22 October 2026: Japanese, Traditional Chinese,
Indonesian, Brazilian Portuguese, Vietnamese, Thai and Filipino on 19 of the 21
guides, German, Spanish and French on 20. Each language skips the guides it has
no reader for rather than padding to a round number, and
`content/translations.ts` records which and why at the top.

That completion is worth dating rather than simply asserting, because the file
spent most of its life in progress and will be again the next time a language
is added. A count that has stopped moving and a count nobody is moving look
identical from outside.

**Ten is the ceiling. Do not add an eleventh**, decided 22 October 2026 with
the cost measured rather than estimated. Two edits that same day are the
evidence, and neither was a translation job:

- Adding the word *Paris* to one line of the timezone guide meant editing
  three translations of that step.
- Adding one sentence to Play&Stay step 1, so a paid link had somewhere
  honest to sit, meant editing **ten**.

Neither is visible to any assertion in the suite. The step and FAQ counts
catch a translation that is short an *item*; a body string that grew a
sentence is invisible to every check there is, so the multiplication is
carried by a person who has to remember. The register already says the real
cost is maintenance rather than translation — this is the number that
sentence was missing.

The benefit side does not argue back. The next candidates on the arrivals
list are markets an existing edition or English already reaches, so an
eleventh language would multiply every future edit by eleven to reach readers
who are not currently unreached.

**The precondition for ever raising it** is a check that fails when an
English field changes and its translations do not — a stored fingerprint per
translated field, the same shape as `sourceChecked` but for the text rather
than for the source. Until that exists, adding a language adds a maintenance
burden no test can see, and ten is the number.

**Vietnamese, Thai and Filipino were chosen from arrivals data, not from a
sense of which markets feel large** — because that sense is exactly what put
Europe first. Korea received about 15.05 million international visitors from
January to August 2026, and among Southeast Asian source markets the ranking
was Philippines 454,000 (fastest growing, up 16.1%), Vietnam 407,000,
Indonesia 295,000, Singapore 243,000, Thailand 230,000, Malaysia 207,000.
Indonesia was already covered; Singapore is skipped because English is a
working language there; Malaysia is skipped because Malay and Indonesian are
close enough that the `id` edition largely reaches those readers. That leaves
the top three uncovered markets, and they are exactly these three.

**The Filipino edition is an explicit bet, and it is recorded as one.** English
is an official language of the Philippines, so unlike a Vietnamese or Thai
reader a Filipino reader can already read the English pages. The bet is that a
procedure read under time pressure — a seven-minute checkout, a cancellation
deadline in a foreign time zone — is read more carefully in a first language.
If those pages draw nothing, the bet was wrong, and `lib/i18n.ts` says so in
those words so that the next person knows it was a decision rather than an
oversight. The tag is `fil` rather than `tl` deliberately: Filipino is the
standardised national language and what hreflang expects, and Tagalog would be
a narrower claim than this edition makes.

All three refuse both excluded guides, on the tests the earlier editions were
already given rather than new ones, and the timezone half was verified rather
than inherited: `zdump -v` on Asia/Ho_Chi_Minh, Asia/Bangkok and Asia/Manila
prints no transition at all, so 20:00 KST is 18:00 in Hanoi and Bangkok and
19:00 in Manila in January and in July alike. Worth checking rather than
assuming, because the Philippines has legislated daylight saving before and
could again. Thai also needed one thing the nine other editions did not: a
font stack and a `line-height` of its own, because Thai stacks vowel and tone
marks two deep above the line and the 1.85 that works for Japanese and Chinese
clips them.

**French carries no region, and that is the honest scope rather than a
shortcut.** Brazil's region decided a page; France's would decide nothing. Its
readers are spread across zones that agree on everything this site covers —
Paris, Brussels and Montreal all observe daylight saving — and the one
francophone zone that does not, Dakar, is not a market with a reader here. So
`fr`, not `fr-FR`.

It lands with German and Spanish on both exclusions, on the tests they were
already given rather than new ones. France observes daylight saving and Korea
does not, so the timezone guide applies: checked against this container's
zoneinfo, 20:00 KST is 12:00 in Paris in January and 13:00 in July, which is
exactly the Berlin and Madrid line the English page converts for. France is in
the EU, so the customs guide is refused for the reason counted there.

**Paris is now named in that line, and the way it was added is the pattern.**
Arithmetically it changed nothing — `zdump -v` shows Europe/Paris and
Europe/Berlin transitioning in the same second, 28 March and 31 October 2027
included — but a French reader should not have to know that Paris is Berlin to
use the sentence. So the city went into the English page and into all three
translations of that step in the same commit. Not into the English alone:
there is no check that would have caught it. The step and FAQ counts catch a
translation that is short an item; a sentence that grew a word inside a body
string is invisible to every assertion in the suite, which is exactly the
"silently short" case the register warns about.

`lastChecked` deliberately did not move. It records when a source was last
held against the live platform, not when the English text was edited — so
moving it would have put a "the English was re-checked" banner on ten
editions to report a word, and the honest way to clear that banner is to
re-check the sources, which nobody did.

French needed one check no other edition did. It groups thousands with a
space rather than a period, so a correctly written `8 000` read as a missing
`8,000` and would have failed every page quoting a fee. All three spaces that
appear in honest French text are accepted — plain, no-break, and the narrow
no-break one typography actually asks for — rather than picking one and
failing the other two.

**Each language has an index page at its own prefix, and until 22 October
2026 it did not.** `/vi`, `/ja` and the rest were 404s, and the nineteen pages
of an edition were reachable only from each other through the related rail.
That graph is connected — checked rather than assumed, every page reachable
from the hub guide — but its thinnest page had one sibling link, and no page
anywhere named everything a given language had. On a site whose only channel
is search, that is the difference between a section and nineteen pages that
happen to exist.

`app/[lang]/page.tsx` is that index: the language's own name for itself, the
edition's machine-assistance notice said once for the set, every guide in the
language in the English editorial order, and one link out to the English
index. It lists nothing the language does not have — no English titles, no
"coming soon" rows, no count of what is missing — which is the related rail's
rule applied to a bigger surface. **Order is the English editorial order and
not a per-language one.** The lead-order note below is about which guides each
edition translated first; it has never been a display order, and inventing one
here would be a claim the file cannot back.

The hreflang is reciprocal by construction: each index names `/guides` as its
English equivalent and `/guides` names all ten back, because Google discards
an annotation the other side does not confirm. Both sides read
`translatedLocales`, so the eleventh language appears in both by existing.

Two invariants keep it from drifting. `generateStaticParams` is driven by the
register rather than the locale list, so a language declared but not yet
translated produces no index page instead of an empty one — and a module-scope
check fails the build if those two lists disagree, so that state is loud. The
second is in `content/translations.ts`: every entry in a locale must carry the
same `labels` object by reference, because the index reads its wording off
whichever entry comes first and must not depend on which that is.

**`pt-BR` opened at two guides, not one, because one is not allowed.** The
orphan check refuses a translated guide with no sibling in its own language,
which is the right answer — a language with a single page is a dead end whose
only route in is the sitemap. Two was the smallest honest increment, and the
pair was the hub guide and the NOL World guide it links to. It is complete at
nineteen now, but the constraint is worth keeping written down, because it
applied again on the first day of each of the three that followed and will
apply on the first day of the eleventh.

The region in the code is load-bearing rather than decorative. Brazil
abolished daylight saving in 2019, so the timezone guide — which is really a
daylight-saving guide — teaches arithmetic a Brazilian reader never has to do.
Checked against this container's zoneinfo rather than recalled:
America/Sao_Paulo, America/Manaus and America/Recife hold the same offset in
January and July, and 20:00 KST is 08:00 in São Paulo on both dates. That is
the Tokyo and Jakarta situation, not the Madrid one, so the exclusion is a
decision and not a gap. Portugal does observe it, which is exactly why a
generic `pt` edition would have to carry that guide for half its readers and
waste it on the other half.

They no longer sit on one set, and that is the system working rather than
drifting. The customs guide is still refused everywhere, because its subject
is a jurisdiction no reader of these ten is in — Brazil included, which is
why `pt-BR` refuses it on the same test rather than a new one, and the three
Southeast Asian editions most of all: a page explaining CBP's executive orders
to a reader whose parcel clears the Philippine Bureau of Customs is not merely
useless, it is confidently about the wrong country. The timezone guide used to
be refused everywhere too — correctly for Japanese, Chinese and Indonesian,
whose readers observe no daylight saving at all, and wrongly for German and
Spanish, whose readers do. It is translated for those two now.

Closing that gap meant editing the English first, which is the pattern worth
keeping: the English page converted for New York, Los Angeles, Toronto,
London and Sydney, so a German or Spanish edition could either carry American
cities or change the numbers, and changing numbers is what the checks exist to
stop. The cities belong in the English page, so that is where they went.

The six Asian editions still refuse that guide, and correctly: checked
against the IANA database the guide itself cites, Asia/Tokyo, Asia/Taipei,
Asia/Jakarta, Asia/Ho_Chi_Minh, Asia/Bangkok and Asia/Manila have no
transition in the next decade, so the gap to KST is a fixed zero, one or two
hours permanently. For those readers the arithmetic the guide exists to teach
does not exist.

**A language's edition leads with what its readers came for, but it does not
stop there — and German is the correction, not the rule.** The Asian editions
lead with ticketing, because a fan in Taipei or Jakarta flies to Seoul for the
show; Taiwan sent 1.66 million visitors to Korea in the first eight months of
2026. German led with commerce, because a German fan sees the tour in Berlin,
sold by a local promoter, which this site's scope excludes.

German was then held at **commerce only** on that reasoning, and that was
wrong. The reasoning holds for the acts large enough to run a European leg and
fails for everyone else: a fan of a mid-tier group that never leaves Asia
flies to Seoul from Berlin exactly as they would from Taipei, and for that
reader the German edition had nothing at all. The restriction is gone and
German carries the ticketing guides too. **Lead order is an editorial
judgement; it is not a reason to withhold a page from a reader who needs it.**

Spanish is the inverse case and is why the correction matters. Mexico alone is
the fifth-largest K-pop market on Spotify — 14 million-plus listeners, 500%
growth in five years — and K-pop is 34.9% of Hallyu consumption across Latin
America. BTS's 2026 Arirang tour reached Mexico City, Bogotá, Lima, Santiago
and Buenos Aires, and those were the band's **first full-group shows ever** in
Colombia, Peru and Argentina. A region that waits that long for its first date
from the biggest act in the genre is a region whose fans fly to Seoul for
everybody else, so the ticketing guides matter more there than in Europe, not
less.

Spanish also carries one correction that is not a translation: Weverse entered
Latin America through EBANX in April 2025, launching in Mexico with **OXXO
Pay** — cash settlement at a convenience store, chosen because only around a
quarter of Mexicans use payment cards at all. A straight translation of the
declined-card guide is therefore half wrong for a Mexican reader, who has a
route the English page does not know exists. That guide needs its own
paragraph in Spanish, checked against Weverse's own help pages rather than
against the 2025 launch coverage.

**The customs guide is the one exclusion worth re-opening and the one that
survives it.** Germany and Spain are in the EU, and the guide covers the EU,
so the German commerce-only mistake looked like it might be repeating. It is
not, and the composition is why: of ten steps, five are US-specific — CBP,
executive orders, US tariff chapters — one is EU-specific, and four are
region-neutral. A German edition would be half American law to buy one EU
step. And that step's fact, the EU scrapping its 150-euro exemption, is
already carried in German and Spanish by the shipping guide, which is wholly
theirs. Counted rather than asserted, so the next person to have this hunch
can check it instead of re-litigating it.

**The timezone guide was the one page German and Spanish should have had and
did not**, for the exact reason the Asian editions skip it: Germany and Spain
observe daylight saving and Korea does not, so the local hour of a Korean sale
moves twice a year for those readers — the guide's entire thesis, absent in
Tokyo, Taipei and Jakarta. That gap is closed. It is left written down because
the useful part is not the gap but how it was found: a note in the register
saying an exclusion was a gap rather than a decision, carried across several
changes until somebody acted on it.

A translation is a copy of a claim made on a particular day from a source
checked on a particular day. The moment the English page is re-checked, the
translation stops being that copy **and nothing about it looks different** —
which is the exact failure the status system exists to prevent. So
`lib/i18n.ts` gives it the same treatment, with two asymmetric rules:

- **A translation can never look fresher than its source.** If the English
  guide has gone stale, so has every translation of it, whatever date the
  translation carries. `translationState` checks the source's expiry *before*
  comparing dates, and `scripts/i18n.test.mjs` asserts that ordering against
  the source file — reverse the two checks and a stale guide would render a
  healthy seal in every language it was translated into.
- **A translation goes `behind` the moment the source's `lastChecked` moves.**
  Not wrong, but no longer a copy of anything anybody checked, so the page
  says so and links to the English.

`review` is the other half: `machine-assisted` or `native-reviewed`, with no
default, because the default would be the flattering one. A machine-assisted
translation of a page about customs offences or biometric retention is useful
and is not the same artefact as one a native speaker has read — the same
distinction as `sourced` against `verified`, for the same reason.

The register fails the build on a translation that names an unknown guide,
claims a `sourceChecked` in the future (which would pin it to `current`
forever), was translated before the check it claims, omits `review`, or drops
or adds a step, and `content/translations.ts` fails it on a FAQ count that
does not match the English, which is not the same check as the step count:
`lastChecked` tracks source checking rather than content editing, so editing
an English FAQ left its translations short while every date still read
`current`. `/editorial-policy` reads the register directly and prints each
language with how many guides it covers and how many a native speaker has
read, so it cannot claim a coverage the file does not hold.

Routing is `app/[lang]/guides/[slug]`, driven entirely by the register with
`dynamicParams = false`, so an untranslated path 404s rather than serving an
empty shell. Static segments win over the dynamic one, so `/guides` and
`/words` are unaffected — verify that after touching it, along with an
untranslated path under a live locale still returning 404. hreflang is emitted
only where a translation exists, because advertising a language that 404s is
worse than advertising none.

**The URL segment is not the locale code.** `zh-Hant` is written with a
capital H because hreflang wants it that way, and a URL path is
case-sensitive, so the path is `/zh-hant` and the two cannot be the same
string. The route generates and resolves its segment through `segmentOf` and
`localeFromSegment`, both derived from `prefix`, because they drifted once:
the route generated `/zh-Hant` while every link was built from `prefix` and
pointed at `/zh-hant`, and with `dynamicParams` off that is not a redirect but
every Chinese page returning 404 from every link to it. `scripts/i18n.test.mjs`
now asserts the route against the prefix, so never cast the segment to a
`Locale`.

The translated template renders **less** than the English one: no artwork and
no booking graphic. Those carry English text, and a translated page that
funnels into English is worse than one that stops honestly. Sources stay in
their original language — a citation is only checkable in the words the source
uses.

It does now carry a **related rail, in its own language only**. That was
excluded for the same reason as the rest, and the reason inverted once a
language had several pages: six translated pages with no links between them
are six dead ends whose only route in is the sitemap. `relatedTranslations`
builds it from the `see` cross-references already authored into the English
guide's steps — not from tags or platform overlap, because somebody decided
those were the guides worth sending a reader to and a similarity score did
not — and drops anything with no translation in that locale, which is the
original rule working rather than being abandoned.

It reads those references **both ways**. A `see` says two guides belong
together and that is symmetric even though the field is not: one-way, the
albums guide had no rail despite three guides pointing at it, and the queue
guide was an orphan in both directions. `scripts/i18n.test.mjs` fails on any
translated guide with no sibling in its own language, and the fix is usually
in the English: the queue guide was an orphan because no English guide linked
to it, so guide 01's sale-day step now does.

**Reading it both ways is right for the rail and hides one thing, so there is
a second check that reads it one way.** Symmetry means a guide that links out
three times has three siblings whether or not anything points back at it — so
it has a rail, passes the check above, and is still a page no other guide
sends a reader to. `weverse-membership-renewal-overseas` and
`nol-world-play-stay-package` sat in exactly that state: three outbound links
each, zero inbound, both checks green. They were found by building the
directed graph by hand, which is not a thing anyone does twice, so
`scripts/links.test.mjs` now does it: no dangling `see`, none pointing at its
own guide, and every guide with at least one inbound and one outbound edge.

The inbound rule is a hard failure and the consequence is accepted rather
than softened: if a new guide has no step anywhere that a reader would
genuinely leave from, it is not yet part of the subject. Adding a decorative
link to clear the check is the thing the restraint rule forbids, one step
removed. Both guides got a real one — the presale checklist already summarised
Weverse Auto Payment in two sentences, and the NOL World collection step tells
readers tickets come from the box office on the day, which is simply untrue
for a Play&Stay buyer collecting at a hotel desk.

The same file carries the crawler's version of the question. Guide and
translation entries in `app/sitemap.ts` are built from the content and cannot
drift; the eight pages that are not guides are written out by hand, correctly,
since they have nothing to derive from — and are therefore the one place a
page can be added and silently left out. That is not a broken page, just a
slower-found one, which is the kind of defect that never announces itself. The
check walks `app/**/page.tsx`, skips the dynamic segments as the derived half,
and fails if a hand-written page has no entry. Both directions were proved by
planting them: a new page with no entry, and an entry removed from a page that
still exists.

`scripts/translations.test.mjs` is the net under a machine-assisted
translation, and it exists because the errors that hurt a reader are not
errors of style. A deadline that reads 17時 where the source says 11時, a fee
of 3,000 against 8,000, a 2026 that became 2025 — each is a factual error
wearing fluent prose, and reading it back does not catch them reliably. The
checks are: every number of two digits or more survives into the translation,
product names and currencies are not quietly renamed, no stray Hangul or
Cyrillic, no script belonging to another target language, brackets balance,
and no prose field is far outside the length band a real translation sits in.

That last one earns its place. The number and name checks caught three
invented intros only because those paragraphs happened to contain a year; one
that did not would have passed. The ratio check is the smoke alarm for a
field somebody wrote fresh instead of translating. Headings are excluded,
because Japanese compresses a sixty-character English step title into a dozen
characters and is right to.

**Every check runs against every locale in the register, and that is load
bearing.** The first version was scoped to `locale: "ja"`, which was fine
while Japanese was the only language and became a silent hole the day it was
not: four Chinese translations landed and the suite reported the same 28
passes, having read none of them. The same pass found the entry boundary was
wrong too — `locale` sits above `slug`, so splitting the register on `slug`
gave each entry the *next* one's locale and dropped the last translation
entirely. A check scoped to one locale stops existing when the second arrives,
so the suite asserts that every locale present has checked pairs.

The band is **per locale**, because the fraction is a property of the writing
system and not of translation. Japanese sits at 0.35–0.65, Chinese lower
again having no kana, and Indonesian runs *longer* than English, because its
affixes and full prepositional phrases cost characters English does not spend.
A single band wide enough for all three would catch nothing. Indonesian also
gets a check the others do not need: a field left in English passes every
other assertion, since the numbers survive, the names survive and the ratio is
exactly 1.0 — only a comparison against the source catches it, and only
Indonesian can reach that state, the other two being written in another
script.

Two exclusions in the number check were earned by false positives rather than
guessed at: a 12-hour clock time is correctly written as 24-hour in Japanese,
so the converted hour is offered as an alternative rather than the check being
dropped; and COVID-19 is 新型コロナウイルス and carries no 19, so the name is
checked as a product name instead. A third followed: the minutes of an
o'clock time are dropped, because 11:00 KST is 11時 and 上午11時 and the `00`
legitimately disappears in both — nothing is lost, since the hour is itself a
two-digit number in the same string and still checked, so an 11:00 that became
17時 still fails, and so does an 11:30 that lost its 30.

Chinese gets one more: a table of high-frequency **Simplified** characters
whose traditional forms this content uses. Traditional over Simplified is a
distribution decision — Google is blocked in mainland China, so Traditional
reaches the readers who can actually reach the page — and a page mixing the
two reads as careless to exactly the Taiwanese and Hong Kong readers it is
for.

**None of this makes a translation native-reviewed.** It makes the facts in it
trustworthy. `review` stays at `machine-assisted` until a native speaker has
actually read the page, for the same reason no guide is `verified` until a
person has walked it, and these assertions must never be used to argue
otherwise.

**The real cost is maintenance, not translation.** Every source re-check now
has N pages to follow, and a translation nobody follows becomes exactly the
stale guide this site was built against. That is why the freshness rules
landed before the first word of Japanese, and why a language is added only
with its checks generalised in the same change rather than after it.

## Artwork

`content/artwork.ts` holds every piece's file name, dimensions, alt text and
its generation brief. `<Artwork>` checks for the file at build time and falls
back to the drawn SVG in `components/Objects.tsx` when it is missing, so the
site is complete with zero image assets and gets richer as renders land.

The object vocabulary is **fandom**, not finance. The first set — a passport, a
bank card, a parcel box — is the single clearest reason an early version read
as a shipping service. Lightstick, photocard, ticket stub, slogan banner,
album case. If a brief could as easily illustrate a bank, it is the wrong brief.

Cut-outs ship with **no baked shadow** — a shadow the render chose cannot
follow the theme. They are hard silhouettes and `.art-drop` draws the shadow
from `--cast-soft`. Full-bleed frames pass `drop={false}`. A cut-out laid over
a photograph is a `.prop`: out of flow, `lg` and up only, because it is
decoration and must never cost the hero its height on a phone.

Never write *where the headline sits* into a photographic brief. The hero came
back with a brush mark painted into that corner, as a placeholder for type the
generator was never going to set. Say the corner stays dark and uncluttered,
and say no placeholder shapes.

Export cut-outs as **PNG with alpha**. Recovery from a flattened checkerboard
is in `public/img/README.md` along with the case it fails on — a bone-white
part touching the checker — which is why guides 03 and 04 are still fallbacks.

## Venue pages

Two guides cover Gocheok Sky Dome, because a reader fails at two different
points: getting there, and finding the seat once there. The second is not a
footnote to the first — somebody lost at 18:40 is lost about the building, not
about the train.

**The seat guide teaches a system, not a map.** The venue publishes one flat
JPEG with 123 block numbers on it, drawn for baseball, dugouts included. It
answers the question a reader has at home and not the one they have standing
against a concrete wall with somebody else's number on it. The system under it
is four facts — the hundreds digit is the level, the other two digits run one
way round, the loop has exactly one break, and the gate letters run the same
way as the numbers — and those four work from any entrance without a compass,
which the venue does not publish anyway.

The honest line is drawn at the concrete. Blocks are poured and painted, so a
concert ticket naming 304 means that 304. Everything else about the night is
the promoter's and set per show: which blocks are sold at all, what the floor
is called, which gate admits you, when doors open. The page says that twice,
in the scope and in its last step, because it is the sentence a reader will
act against.

**`diagram` on a guide replaces the booking-screen graphic.** Every guide used
to get the same three stacked screens with the same caption about a name that
does not match the fan club record. Right for the eleven guides about buying
something; wrong for a guide about a building, where somebody who came to find
block 417 was shown a payment screen. It is a small closed union in the content
layer with the mapping to a component in the route, so the content stays data.

`components/VenuePlan.tsx` draws the plan in theme tokens and computes its
geometry from bearings rather than hard-coded points, for the reason the
band's hairlines left their inline styles. Nothing in it is traced — it is a
diagram of the rule at this site's own proportions, and the caption says
schematic, because a reader who needs to know whether 417 or 418 is the one
beside gate D has to open the venue's chart.

**Its first version drew four concentric circles with one shared gap, and
that was not merely a duller picture — it was a false one.** Measured off the
chart, the break is 44° at the 100 level, 71° at the 200, 91° at the 300 and
96° at the 400: the upper decks stop short of that corner while the lowest
ring nearly closes around it. Drawing the four real openings on four ellipses
is what makes the shape a horseshoe rather than a target, so the honest
version and the legible one turned out to be the same drawing. The fact went
into the guide text in the same change, because it is navigational — more of
the ring is missing the higher you sit.

Four things it took passes to get right, every one of them only visible
rendered:

- Four range labels at one bearing **stack into a block** that reads as a list
  standing in front of the drawing, worst at phone width. `labelAt` fans them.
- A band tone that inverts between themes puts **dark text on a dark band** in
  light mode, so each label sits on a plate of `--paper`.
- Four levels ending at four bearings make a polyline through them **step**,
  and a stepped red dash beside a band end reads as a rendering fault. The two
  edges of the opening are smoothed through their points instead.
- The direction arrow was drawn **across the break**, which points the one way
  a reader cannot walk: clockwise through that wedge is the jump from 132 back
  to 101, the single place the rule does not apply. It is three chevrons on
  the band now, on the left flank — the one long stretch of perimeter with no
  gate on it.

**The venue's own chart is now served from this site, and that is the one
deliberate exception to the artwork rule.** Everything else pictured here was
drawn or rendered for the site, which is a portrait-and-copyright rule. This
is a different question: an authoritative document is worth reproducing
exactly, and the only thing that makes that allowed is the licence. The chart
page carries `공공누리 제1유형 · 출처표시` — KOGL Type 1, free commercial use
and modification with attribution — declared on the page itself.

**That licence has two conditions beyond attribution, and neither was checked
until the licence page was finally read on 22 October 2026.** It had never
been fetched by anything — see the `licenceUrl` note below — so "free
commercial use and modification with attribution" was quoted here from the
mark rather than from the terms. It is true and it is not all of them:

- **The hyperlink is a term, not manners.** 제1유형's 개별조건 say that where a
  hyperlink to the source is possible online, it must be provided. The fields
  render from the register so they cannot go missing, but nothing stopped them
  being rendered as plain text — which would satisfy every other check and
  breach the licence. `scripts/documents.test.mjs` now asserts the component
  renders `sourceUrl` and `licenceUrl` as `href`s.
- **Nothing may suggest the institution sponsors us.** The same conditions
  forbid any presentation that would have a third party mistake the public
  body for a sponsor or a partner. The in-article ad slot was rendering
  *directly beneath* 서울시설공단's own chart, with the credit line between
  them, and only on document guides — the document section was the one thing
  that came between the steps and that slot. The slot moved above the
  document, which changes nothing on every other guide, and the order is
  asserted rather than left to a comment in the route.

Both assertions were proved by planting the violation: the licence link
rendered as a `<span>`, and the ad slot put back below the document. Both go
red, and green again on restore.

The no-crop decision is a licence matter too, not only taste: 제1유형 asks that
a modified work respect the author's moral rights, and gives cropping a
photograph so that it differs markedly from the author's intent as its own
example. The chart is served whole, and the untouched original is linked.

So the terms are **data, not a thing anybody remembers**. `ReproducedDocument`
in `content/guides.ts` carries the file, the credit, the licence, its URL, the
page it came from and the day the copy was taken; `components/SourceDocument.tsx`
renders all of it from that register, so there is no version of the component
that shows the picture without the credit. A module-scope check fails the
build on an empty field, on a `file` that is not a path under `public/img`, and
on a `sourceUrl` the guide does not already cite — reproducing something from
a page you have not cited is a claim with no trail back to it. That is the
paid-link rule applied to somebody else's copyright.

**Two checks, because one of them can be silenced.** The upstream file is
called `seat2026.jpg`, so the operator replacing it is a scheduled event
rather than a hypothesis, and our copy would go on being served with
confidence afterwards — this site's premise turned against it.
`scripts/watch.mjs` fingerprints it by SHA-256, because the text comparison
every other source gets sees exactly nothing in a JPEG. But `--record` clears
that warning, and nothing in the script makes anyone replace
`public/img/docs/` while they do it. So `scripts/documents.test.mjs` asserts
that the stored baseline is the hash of the file on disk. Re-recording without
replacing the copy now fails a test instead of producing a green report over a
stale picture. Proved by appending one byte and watching it fail with both
hashes named.

Byte-for-byte is blunt on purpose: a re-encode at the same content would read
as changed. That is a false alarm somebody clears in a minute, and the
alternative is a similarity threshold nobody can justify on a picture.

**The licence itself went unwatched until 22 October 2026, and it is the one
claim here with a legal consequence.** `sources()` collected `url:` and a
`licenceUrl` is not spelled that way, while `documents()` watches the
picture's bytes rather than the terms — so the page that makes reproducing the
chart allowed at all was the one page no check had ever fetched. It is
collected now, and `isFixedDocument` counts a licence path alongside `terms`
and `policy`, so its wording is compared rather than merely link-checked. The
gap was found by asking why `www.kogl.or.kr` never appeared in a sweep, and it
is the `sourceUrl` rule's own logic one field over: reproducing something
under a licence nobody has re-read is a claim with no trail back to it. Its
first sweep returned the allowlist failure above rather than a baseline, so it
still needs a `--record-new` once the host is reachable.

The document renders **after** the steps rather than beside the schematic. The
two do different jobs — the drawing teaches the rule in English and weighs
nothing, the chart is the authority on where block 417 is and weighs 230KB —
and the step that says "the venue's chart is the authority" is the step a
reader leaves from. It is not `priority`, and the original file is linked as
well as displayed, because `next/image` serves a re-encoded derivative and
verification wants the bytes that were taken.

**The station rows were wrong, and the shape of the error is what is worth
keeping.** The venue prints its transit information twice — a four-column
table and a turn-by-turn list under it — and the first version of the
getting-there guide read the table one column out, handing Guro's exit and
walking time to Gaebong and Sindorim's bus routes to Guro. Every individual
fact on the page was a real fact from the real source. Nothing in the suite
could see it, because no check knows which row a fact came from. Re-reading
the source caught it; re-reading the guide never would have.

The same source disagrees with itself, and the page now says so rather than
choosing: the table gives Guro as exit 1 while the turn-by-turn directions and
the venue's own area map both say exit 2. An official source with two answers
is reported as two answers.

## Advertising

Slots live in `components/AdSlot.tsx` and render nothing until their ids are
set, so the site looks finished through the weeks before approval. Rules:

- **Reserve the height.** An ad that pushes the article down is a layout
  shift, and Google ranks on it. On a site whose only channel is search, an
  unreserved slot spends search position to buy impressions.
- **Label every unit.** On a page whose product is trust, an ad that reads as
  a recommendation costs more than it earns.
- At most two per page, never above the fold, never between a step and its
  warning.

Do not apply for AdSense before the guides are verified and there is real
search data — a rejection carries a cooldown that makes a premature
application the slower path.

## Paid links

`content/affiliates.ts` is the register, and it is empty: this site carries no
paid link today. The machinery exists first on purpose, because knowing a
section may one day hold a paid link changes how it is written now — a guide
that already names the real trade-offs can carry a link honestly, and one that
would have to grow a section to fit a link reads exactly like what it is.

- **The disclosure is derived, never remembered.** A step carrying `partner`
  makes its guide render `<PaidDisclosure>` above step one. Remove the last
  partner and the notice goes by itself. A disclosure somebody has to remember
  is one that will be missing from the page that gets screenshotted.
- **Above the steps, not in the footer.** The FTC asks for disclosure that is
  clear and before the link, most of these readers are American, and a notice
  under 5,000px of page has been read by nobody.
- **A link goes in only where the thing would have been named anyway**, and the
  commission never changes the advice. If the paying option is worse, the step
  says it is worse.
- **Every partner is published** on `/editorial-policy`, which reads the
  register directly, so the page cannot claim something the file does not say.
- A paid link to an unregistered partner **fails the build** —
  `scripts/affiliate.test.mjs` covers what a build cannot see: a `rel` that
  loses `sponsored`, a link that loses its visible tag, a notice that drifts
  below the steps.

**Four categories are refused regardless of what they pay**, written down
because every one of them is actively sold to sites like this one and the
refusal has to survive the next person who is offered money for it:

- **VPNs.** The pitch is that one gets an overseas fan past a Korean
  restriction. That is the identity-check workaround rule, wearing a
  subscription. Most of the English guides that currently outrank this site
  carry a VPN link, which is a reason to be sure, not a reason to match them.
- **Ticket resale and secondary marketplaces.** The revised Performances Act
  exists because of touts, and half this site explains the verification that
  exists to stop them. Taking resale money would contradict the premise.
- **Korean phone numbers, 본인인증 proxies, "verification help".** The same
  rule, less disguised.
- **Anything with no step that already names it.** Not an ethics rule, a
  content one: a partner that needs a new section written for it is a section
  that reads exactly like what it is. The Klook link went where it did because
  NOL World's own answer leaves a reader needing a room this booking will
  never contain — the gap was already there and already written.

The test for a new partner is the fourth bullet applied first: find the
sentence it would sit on **before** finding out what it pays. If no sentence
exists, there is no partnership, however good the rate.

**And no affiliate network's script goes on the site.** Travelpayouts asked
for its "Drive" tag during signup, advertised as up to 30% more earnings, and
it was refused on 22 October 2026. The snippet injects
`https://emrldtp.cc/NTg5MDYz.js` — a host that is not travelpayouts.com, with
a filename that base64-decodes to the account number — carrying
`nowprocket`, `data-noptimize`, `data-cfasync="false"`,
`data-wpfc-render="false"`, `seraph-accel-crit` and `data-no-defer`, which is
six different instructions not to defer or touch it.

Four reasons, the first of which is the one that would still apply if the
other three were answered:

1. **It is remote code that can change after it is reviewed.** Everything
   else that runs on this site is in this repository. Reading the file once
   proves nothing about what it serves next week.
2. **It places offers into the page**, which is worse than the link
   rewriting first assumed and is not an inference — the last screen of the
   signup says it in Travelpayouts' own words: *"Drive finds and places
   offers where readers are most likely to book."* Finds and places. The
   same screen adds that continuing *"automatically connects you to these
   programs"*, so the offers would come from partners nobody here evaluated.

   Every disclosure on this site is **derived from the content**: the notice
   above step one exists because a step carries a `partner`, and the build
   fails on a paid link to a partner missing from the register. An offer
   injected into the page at runtime is invisible to all of it — no `Paid`
   tag, no `rel="sponsored"`, no notice, and `/editorial-policy` still
   listing a partner set that is no longer the truth. It is the exact failure
   the machinery was built to make impossible, arriving by the one route the
   machinery cannot see.

   It also decides *where* a link goes, which is the first rule inverted: a
   link belongs only where the thing would have been named anyway, and this
   places them where a model thinks they convert.
3. **Six anti-deferral attributes on a site whose only channel is search.**
   The network says it does not affect page speed; the markup says it refuses
   to be optimised.
4. **It is not needed.** The Klook link is hand-placed in the register,
   disclosed, tagged and auditable. Network links work the same way without
   the tag.

Dashboard reporting is the real thing given up, and it is worth less than
being able to say that every link on the page is one somebody chose.

## Phone width

Most of the traffic will be on a phone, so the narrow layout is not a
degradation of the wide one:

- The booking graphic swaps drawing, not scale. The three-screen staircase is
  right on a desktop and wrong on a phone — at 390px its Korean labels land
  about five pixels tall and the name-mismatch warning, the entire reason the
  graphic exists, stops being readable. `SingleScreen` renders instead below
  `sm`.
- Object marks sit above a card's title below 560px so the text column keeps
  the full screen.
- The three proof tiles become two-up with the first spanning, rather than
  three full-height cards to scroll past.
- Below 360px the nav drops its text link: the logo still goes home and the
  footer carries full navigation, and at that width the bar otherwise runs
  past the viewport.
- `.tap` adds vertical padding only. An earlier version set `display` and
  silently overrode Tailwind's `hidden`, which put a nav item back on screen
  at phone width — check both when touching it.

Verify at 320, 360, 390 and 414 before pushing — `node scripts/check-layout.mjs`
walks every route in both themes at five widths and reports horizontal
overflow. Every tap target should clear 44px tall.

**Its translated routes are derived, because the hand-written list went
stale.** One route per locale used to be typed in under a comment claiming it
held "the longest guide in each", which was true when written and silently
stopped being. The failure is the quiet kind: the check measures five pages,
prints ALL CLEAN, and the page somebody just edited was never among them —
which is exactly what happened the day the chart guides gained
`HF0082KTU001`. The English albums guide was covered by luck; no translated
page carrying the code was looked at.

`riskiestPerLocale()` reads the register instead and gives each locale the
guide holding its longest **unbreakable** run. Length is not the risk — a run
of characters with nowhere to wrap is, so it measures Latin letters, digits
and the punctuation joining them, and skips the structural fields. Both
exclusions were earned: counting any non-space run made every Japanese
sentence a 350-character token, because Japanese sets no spaces and wraps
between characters perfectly well; and leaving `slug` in made every locale
pick whichever guide links to the longest-named one, a property of the file
rather than of the page. It now selects `world.nol.com/ticket`,
`mendokumentasikannya:` and `Fanclub-Verifizierungsfenster` — the real ones.
Proved by planting a 55-character token in a different guide and watching the
Japanese route move to it, then back.

## Outbound hosts

The container reaches the internet through a proxy with an allowlist, and that
allowlist is one text field: editing it **replaces** it. It has been pasted
over with a partial list three times, and each time the omitted hosts went
dark — `npm run watch` then reports cited sources as unreachable, which is
indistinguishable from seven dead links.

The field's correct contents were living in memory, so every edit was a
reconstruction. They are now derived:

```bash
npm run hosts      # prints the complete list; paste the whole block
```

Cited hosts come from the content, so a new guide citing a new domain appears
automatically. Fixed infrastructure — Figma, the design system, sibling sites,
the platforms we retry, the customs and postal sources — is declared in
`scripts/hosts.mjs` with a one-line reason each, because none of it is
derivable and none of it is obvious six months later.

Two hosts in that list are loaded by the reader's browser rather than by this
container. They are there because `scripts/check-layout.mjs` drives a headless
browser *inside* the container, so excluding them would have the layout check
render a page no reader gets. `schema.org` is deliberately absent: it is a
JSON-LD namespace and nothing fetches it.

**A denied host and a broken host both read as `000`, and the gateway knows
which is which.** `curl` reports `000` either way, so a host missing from the
allowlist is indistinguishable from a site that will not answer — which is how
`www.inspirekorea.com` spent weeks recorded as "blocked, waiting on the
allowlist" while the allowlist was not its problem at all. The proxy keeps the
verdict:

```bash
curl -sS "$HTTPS_PROXY/__agentproxy/status" | python3 -c \
  "import sys,json;[print(f['host'],f['detail']) for f in json.load(sys.stdin)['recentRelayFailures']]"
```

**`scripts/watch.mjs` asks that endpoint now, so the weekly report says which
it was.** A `000` used to print `✗ … A guide cites this`, one line for all
three cases, which is how both of the above sat in the handoff for weeks as
blocked sources. A policy denial is a **fail** naming the allowlist and
`npm run hosts`, because it is ours and it is one paste; an upstream failure
or a dropped tunnel is a **warn** that says to open the page in a browser,
because a reader may well be able to. The classification lives in
`scripts/relay.mjs` with `scripts/relay.test.mjs` on it, and it degrades to
exactly the old message where there is no proxy to ask — which is the GitHub
runner, and is deliberately not the two-code-path mistake recorded above,
since the request itself still goes through one implementation.

**`403` to CONNECT is the policy refusing the host — add it to the allowlist.
`502` is the policy allowing it and the fetch failing anyway — the allowlist
will never fix that one.** Checked on 22 October 2026: `www.kogl.or.kr`,
`www.ksponco.or.kr` and the apex `inspirekorea.com` answer 403, so they are
simply absent from the field; `www.inspirekorea.com` answers 502 on every
attempt, so it is declared, permitted, and failing upstream. The 403 list is
also the proof that the field is a partial paste again — `www.kogl.or.kr` is
*cited by the content*, and it is the licence page the Gocheok chart is
reproduced under.

There is a third verdict and it is the one that is nobody's to fix here:
`tunnel closed (code 1006) after Ns` means the host was permitted, the gateway
reached it, and the site dropped the exchange. `circlechart.kr`,
`badeuldon.co.kr` and `unipass.customs.go.kr` all answer that way, which is why
the first of them is written down as a dead citation rather than as a blocked
one. Sweeping all 46 declared hosts on 22 October 2026 put eight at `000` and
those eight into exactly these three groups — three denied, two permitted and
failing upstream, three dropped by the site — and one more,
`www.seoulmetro.co.kr`, that answered `000` once and `200` on the retry, which
is the reason to re-probe a single failure before recording it.

Do not use container DNS to tell these apart. `getent hosts` resolves some
allowlisted hosts and not others — `www.ktown4u.com` resolves,
`www.kogl.or.kr` does not, and both are declared — because the gateway does the
resolving for some of them. A blank from `getent` says nothing about whether a
domain exists.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

Screenshots in this container use the preinstalled browser; do not run
`playwright install`:

```js
chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
})
```

## Before pushing

- `npm run typecheck` and `npm run build` both clean
- Check both themes and phone width — the hero headline must stay legible over
  the scrim, and nothing may scroll sideways
- Any new claim carries a source and a date
