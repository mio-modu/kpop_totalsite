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
verification wording at risk. Later languages get hand-reviewed translations.

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
