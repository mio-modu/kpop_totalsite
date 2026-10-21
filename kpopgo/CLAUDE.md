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
check the page has had. All five are `sourced` today: every claim is traced to
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

Three languages today: Japanese on 18 guides, Traditional Chinese on 11,
Indonesian on 10, none native-reviewed. Each language skips the guides it has
no reader for rather than padding to a round number, and
`content/translations.ts` records which and why at the top — the timezone
guide is daylight-saving arithmetic and none of these three countries observes
it, and the customs guide is United States and EU law.

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
