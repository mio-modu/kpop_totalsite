# KPOPGO

Step-by-step guides for international K-pop fans buying tickets, memberships and albums
from outside Korea.

**Live design preview:** https://claude.ai/artifact/2X8kuEmbiyUuB8UZ3WkSn3

---

## Why this and not a K-pop information site

The schedule and profile niches are taken. Billboard runs a full 2026 K-pop concert list,
Soompi runs a tour masterlist, Vivid Seats has K-pop ticket pages, and there are already
city-level specialists like `bostonkpopconcerts.com`. A new domain does not outrank
Billboard on a schedule query.

The *procedure* niche is not taken. Searching how to actually buy returns travel-agency
blogs (Creatrip, KKday), a prepaid-card company's content marketing (namanecard) and
personal blogs. No high-authority news domain writes how-to content. That is a winnable
competitive set.

And the existing pages are stale in a specific, checkable way:

| What changed | When | Covered by ranking guides |
| --- | --- | --- |
| Interpark Ticket → NOL Ticket (Yanolja Core brand consolidation) | April 2025 | No |
| interpark Global → **NOL World** | 1 December 2025 | No |
| Revised Performances Act takes effect (resale rules) | 28 August 2026 | No |

Platform renames and policy changes also age out whatever an AI answer engine learned, and
a fan who fails the process does not get the ticket — so the search intent is urgent and
the reader needs a source they can date.

## What this site deliberately does not do

- **No identity-check workarounds.** Where a platform requires Korean identity
  verification, the guide says so and describes the official routes open to overseas fans.
- **No idol photos, lyrics or audio.** Every visual is drawn for this site. That removes
  portrait-rights and copyright exposure entirely, and it means a flow can be redrawn the
  day a platform changes it.
- **No scaled page generation.** Roughly 25 guide pages, each with distinct content.
- **No resale promotion for Korean shows.** The revised Performances Act makes above-face
  commercial resale a legal problem; affiliate relationships with resale marketplaces are
  scoped to non-Korean tour dates only, if used at all.

## Content integrity rules

Enforced by the `Guide` type in `content/guides.ts`:

- `sources[]` — every claim links where it came from
- `lastChecked` — the date a human last held it against the live platform
- `status` — which *kind* of check it has had, not how far along it is
- `scope` — what the guide covers and what it does not

| `status` | What it means | Shelf life |
| --- | --- | --- |
| `draft` | Being written. Not yet traced to a source for every claim | never expires — it claims nothing |
| `sourced` | Every step traced to the platform's own docs, the official announcement, or press reporting, each linked and dated. Nobody from this site went through the flow | **90 days** |
| `reported` | The above, plus the failure points cross-checked against fans who did it from outside Korea | **120 days** |
| `verified` | Somebody created an account and walked it end to end | **180 days** |

Every page currently ships as `status: "sourced"`, which is accurate: the content is
traced to official announcements, platform help pages and press reporting — all linked
and dated — and nobody has yet created an account and gone through a purchase. Getting a
guide to `"verified"` is week 2's job and is the actual product work.

**The shelf lives are ordered on purpose.** A page nobody walked must never outlive one
somebody did, or the ladder becomes a way of making a weaker claim last longer.
`scripts/freshness.test.mjs` asserts that ordering, so it cannot be quietly relaxed.

What renders is derived, not stored: `displayStatus` in `lib/freshness.ts` downgrades a
page to **Expired** past its shelf life, so a lapsed check stops asserting itself without
anyone having to remember. Because that depends on today's date, every route showing a
status carries `export const revalidate = 86400` — a fully static page would freeze its
status on the day it deployed.

## Stack

| | |
| --- | --- |
| Framework | Next.js 15 (App Router), statically prerendered |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens |
| Content | Typed TS modules — no database needed at this size |
| SEO | Per-page metadata, `HowTo` + `FAQPage` + `BreadcrumbList` JSON-LD, sitemap, robots |
| Analytics | GA4 via `NEXT_PUBLIC_GA_ID` — engagement time is measured here, **not** in Search Console |
| Deploy | Vercel |
| Security | Frame denial, nosniff, referrer and permissions policy in `next.config.ts` |

Design follows the webdesign-style system:

- **T13 보송한 3D 사물** — identity. Every object (passport, ticket, card, phone) is
  built from flat tonal faces with one soft contact shadow. T13's rule is
  반짝임 금지 · 표면은 보송하게, so there is no specular highlight and no glossy
  gradient anywhere, and the light sits upper-left for everything on the site.
- **T21 화면 캡처 겹치기** — the booking screens, stacked in a staircase with the
  front one casting the hardest shadow. T21 says 진짜 데이터만, so the values are
  real and the warning on the front screen is the failure the guides prevent.
- **T20 숫자로 증명하기** — the proof blocks, numbers as the subject with their
  sources beside them.

Palette is obangsaek-derived rather than the usual cream-and-terracotta:
주朱 vermilion, 군청 indigo, 백 bone, 흑 ink. The verification badge is a 인장 seal,
because a seal is a mark of authentication and that is this site's product.

Hangul is content, never ornament — every Korean word on the page is one a fan
meets on the real booking screen (본인인증, 선예매, 결제), and the steps are indexed
ㄱ ㄴ ㄷ ㄹ ㅁ. English stays canonical: the paying audience is Tier-1 English
speakers, machine translation would put the legal and verification wording at
risk, and there is essentially no Korean-language demand for a guide to buying
Korean tickets. Later languages get hand-reviewed translations, not a translate
widget.

Type: Archivo (wide poster display), Gothic A1 and Black Han Sans (Hangul),
JetBrains Mono (verification dates and platform codes). Light theme is the
resting state, full dark theme included.

Every illustration is drawn in-repo as inline SVG — see `components/Objects.tsx`.
No photographs, no idol likenesses, no external image assets, so the site builds
and ships with zero image files.

The home page opens on a photographed stage (`public/img/hero-stage.jpg`) with a
crowd band further down. Both are anonymous backlit silhouettes — the language
of a concert poster, and the reason the site can look like K-pop without using
anyone's likeness.

Rendered artwork is an upgrade path rather than a dependency. `content/artwork.ts`
holds the file names and the generation briefs; dropping a PNG into `public/img/`
makes `<Artwork>` swap it in at build time, and anything not yet rendered keeps
its SVG. See `public/img/README.md`.

Share cards are generated at build time by `next/og` (`app/opengraph-image.tsx`
and the per-guide one), so every guide has its own card carrying its
verification date. Known gap: they render in the default font weight, because
loading a custom face would make the build depend on a font fetch — a card that
always builds beats a bolder one that can fail a deploy.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

## 30-day validation plan

| Week | Work | Gate |
| --- | --- | --- |
| 1 | English how-to keyword research; audit the 10 ranking guides for what is stale or wrong | 20 target queries + a documented error list |
| 2 | **Walk NOL World, Weverse and YES24 Global end to end.** Register, verify, reach payment. Record every failure point and real elapsed time | Each guide walked moves from `sourced` to `status: "verified"` |
| 3 | Draw the step diagrams; wire GA4; publish | 5 pages live and indexable |
| 4 | Submit to Search Console; share in fan communities | Measure against the gates below |

Week 2 is the whole business. The failure points recorded there are the original data no
competing blog has.

### Stop / continue gates

Separate the three questions instead of collapsing them into one traffic number — a new
domain can take months to index, so low impressions alone does not mean no market.

- **Product:** all five guides accurate after a real walk-through; maintenance under
  5 h/week
- **Demand:** 10+ substantive community responses (questions, corrections, shares)
- **Search:** pages indexed; impressions trending up; GA4 average engagement time above
  2 minutes

Failing *search* alone → diagnose indexing versus content. Failing *product* or *demand* →
stop.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Stage hero, the gap, the five guides, platforms, principles |
| `/guides` | Index |
| `/guides/[slug]` | A procedure, with its sources and verification date |
| `/words` | The Korean on a booking screen, grouped by where you meet it |
| `/about` | Who writes this, how it is checked, what it will not do |
| `/privacy` | Required for AdSense, and only claims ads exist once they do |
| `/ads.txt` | Generated from the publisher id, 404 while none is set |

`/words` is the page most likely to be linked by other people. A reference
someone bookmarks is worth more than a guide they read once, and it is the one
thing here no competitor offers at all.

## Advertising

Ad slots are in place and inert. Each one renders nothing until its id is set,
so the site looks finished through the weeks before approval rather than
carrying empty grey boxes:

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=…   # between the steps and the FAQ
NEXT_PUBLIC_ADSENSE_SLOT_FOOT=…      # after the FAQ, before the sources
NEXT_PUBLIC_ADSENSE_SLOT_LIST=…      # below a list of guides
```

Three decisions worth keeping:

- **Every slot reserves its height.** An ad that arrives and pushes the article
  down is a layout shift, and layout shift is something Google ranks on. On a
  site whose only channel is search, an unreserved slot spends search position
  to buy impressions.
- **Every slot is labelled.** AdSense requires ads be distinguishable, and on a
  page whose product is "you can trust what this says", an ad that reads as a
  recommendation costs more than it earns.
- **At most two per page**, never above the fold, never between a step and its
  warning.

`/ads.txt` is generated from the same publisher id, and 404s while none is set —
an ads.txt naming nobody is worse than none.

Approval needs `/about` and `/privacy`, which exist and are linked from every
page, plus content and real traffic. Expect to apply once the guides have been
verified and there is a few weeks of search data, not before.

### Monetisation order

1. AdSense, to measure a real page RPM
2. Travel-adjacent programmes (accommodation, eSIM, transport) — confirm sign-up terms
   before assuming anything
3. Direct advertising to the payment and travel companies already doing content marketing
   on these keywords

Raptive's entry is 25,000 monthly pageviews, and between 25,000 and 99,999 it requires 50%
of traffic from the US, UK, Canada, Australia or New Zealand. English procedure queries
skew that way naturally, which is the point of choosing this niche — but it has to be
designed for, not hoped for.

Expect roughly zero revenue for the first three to four months.

---

Not affiliated with any agency, artist or ticketing platform. Not legal, financial or
immigration advice.

---

## Deploying

The production domain is `kpopgo.app`. `.app` is HTTPS-only and HSTS-preloaded in
browsers, so there is no http variant to canonicalise and no certificate to buy —
Vercel issues and renews one automatically. Do not purchase an SSL product from
the registrar.

1. Import the repo in Vercel and set **Root Directory** to `kpopgo`.

   The repository root holds a different project — a Vite app whose
   `vercel.json` declares `"framework": "vite"` and `"outputDirectory":
   "dist"`. Vercel reads that on import and will carry the Vite preset into
   the project settings, so the Next build runs, succeeds, and then fails with
   `STATIC_BUILD_NO_OUT_DIR` looking for a `dist` this framework never
   produces. `kpopgo/vercel.json` names the framework here so the answer lives
   in the repo rather than in dashboard state. If a project was already
   imported under the wrong preset, set Framework Preset to **Next.js** and
   clear any Output Directory override once; `vercel.json` holds it after
   that.
2. Add `NEXT_PUBLIC_GA_ID` (GA4) — engagement time is measured there, not in
   Search Console.

   If you are deploying to the free `*.vercel.app` host first, to collect
   Search Console data before committing to a domain, also set
   `NEXT_PUBLIC_SITE_URL` to that host (no trailing slash). It is not
   optional: `lib/site.ts` builds every canonical tag, the whole sitemap,
   robots.txt and all the structured data from it, so leaving it at the
   production domain tells Google each page really lives somewhere that does
   not resolve. Clear the variable when the domain is attached.

   Note what the free host does and does not cost you. Only Preview and
   superseded Production deployments carry `X-Robots-Tag: noindex`; the live
   `*.vercel.app` URL indexes and ranks, and because `vercel.app` is on the
   Public Suffix List, Google treats it as a site of its own rather than a
   subdirectory of someone else's. What you lose is the click-through a real
   domain earns in a results page, the links nobody gives a `*.vercel.app`
   address, and — this is the one that matters here — AdSense. Approval wants
   a domain you demonstrably control, which a host subdomain is not.
3. Add `kpopgo.app` under Domains, then point the registrar's nameservers or add
   the A/CNAME records Vercel shows.
4. Verify the property in Google Search Console and submit
   `https://kpopgo.app/sitemap.xml`.

Changing the domain later is one line in `lib/site.ts` — sitemap, robots,
canonicals and OpenGraph all derive from it.
