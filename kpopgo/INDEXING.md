# Getting the pages indexed

Written 22 October 2026, against a site of 232 sitemap URLs.

This is a working list, not a policy. It exists because Search Console's
"Request indexing" button has a daily quota **per property, shared by everyone
with access**, and spending that quota in the wrong order wastes weeks. The
order below is chosen so that each request does the most work.

## What the sitemap now holds

| Section | URLs |
| --- | --- |
| English guides | 21 |
| Language indexes (`/ja`, `/vi`, …) | 10 |
| Translated guides | 193 |
| Hubs and policy pages | 8 |
| **Total** | **232** |

`https://kpopgo.app/sitemap.xml` is submitted and is the thing that does the
bulk of the work. Manual requests only buy speed, so they are worth spending
on pages that unlock other pages.

## The order to request

### 1. The ten language indexes — first, before anything else

```
https://kpopgo.app/ja
https://kpopgo.app/zh-hant
https://kpopgo.app/id
https://kpopgo.app/de
https://kpopgo.app/es
https://kpopgo.app/pt-br
https://kpopgo.app/fr
https://kpopgo.app/vi
https://kpopgo.app/th
https://kpopgo.app/fil
```

These are new as of 22 October 2026 and they are the highest-leverage URLs on
the site. Each one links to all 19–20 guides in its language, so indexing one
index gives the crawler a door into a whole edition. Before they existed, the
translated pages were reachable only from each other and from the sitemap.

Ten requests is roughly one day's quota. Spend the first day on exactly this.

### 2. English guides that are not yet indexed

Check with `site:kpopgo.app/guides` in Google and request whatever is missing.
The English pages are the canonical ones — every translated page points at its
English original with `hreflang`, so an indexed English guide helps its ten
translations be understood as translations rather than as duplicates.

### 3. Translated guides, by market

Only after 1 and 2. Within this, the order worth following is the arrivals
data the editions were chosen from — the markets that send the most visitors
to Korea:

1. `/fil` — Philippines, 454,000 visitors Jan–Aug 2026, fastest growing
2. `/vi` — Vietnam, 407,000
3. `/id` — Indonesia, 295,000
4. `/th` — Thailand, 230,000
5. `/ja`, `/zh-hant` — established markets, already partly indexed
6. `/es`, `/pt-br`, `/de`, `/fr` — the European and Latin American editions

Inside a language, start with the guide that the others link to most:
`nol-world-ticketing-guide`, then `buy-k-pop-concert-tickets-from-overseas`,
then `nol-world-verified-member-ekyc`. Those three are the best-connected
pages in every edition, so indexing them seeds the internal link graph.

## What not to spend requests on

- `/privacy`, `/report`, `/editorial-policy` — they will be found, and nobody
  searches for them.
- Any page you have already requested. A second request for the same URL does
  nothing except consume the quota.
- Pages that changed in a way that does not change what they say. A re-request
  is for new or materially changed content.

## Things that are already done

- `sitemap.xml` lists all 232 URLs with `lastModified` dates taken from the
  verification dates, not from the build.
- `hreflang` is reciprocal on every guide and every index: each language names
  the English page and the English page names all ten back. Google discards
  one-sided annotations, so this had to be done on both sides.
- Each language index carries `ItemList` structured data with `inLanguage` set,
  so a crawler is told the nineteen titles are Vietnamese rather than left to
  guess from URL shape.
- A footer row links to all ten indexes from every page on the site, which is
  the internal crawl path. Before it, no anchor on any English page pointed at
  a translated one.

## The thing this list cannot fix

100% of traffic arriving as Direct is an indexing problem, not a measurement
problem — but the slowest input is time, not requests. Sitemap submission plus
the internal linking above is what makes a site get crawled on its own
schedule. The manual requests shorten the first few weeks and then stop
mattering.
