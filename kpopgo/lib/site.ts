/**
 * The canonical origin, and everything derived from it.
 *
 * `url` is not cosmetic. It builds every canonical tag (through the layout's
 * metadataBase), every entry in sitemap.xml, the sitemap line in robots.txt
 * and every @id in the structured data. Point it at a host the site is not
 * actually served from and each page tells Google its real address is
 * somewhere else — which, if that somewhere does not resolve, is an
 * instruction to drop the page.
 *
 * So it is overridable. Deploying to the free `*.vercel.app` host to collect
 * Search Console data before committing to a domain is a reasonable thing to
 * do, and it needs this set to that host for the duration. Set
 * NEXT_PUBLIC_SITE_URL in the Vercel project (no trailing slash); the default
 * stays the production domain so a forgotten variable cannot silently
 * canonicalise the live site onto a preview host.
 */
const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kpopgo.app").replace(/\/+$/, "");

export const site = {
  name: "KPOPGO",
  /**
   * What goes in a <title> and on a share card.
   *
   * The slogan below used to do this job, and Google threw it away: the home
   * page was submitted as "KPOPGO — Get verified. Get tickets. Go." and
   * rendered in results as plain "KPOPGO". Search rewrites a title when it
   * decides the words help nobody who is searching, and a slogan is exactly
   * that — it means something once you already know the site. The most
   * valuable title tag on the site was spent on a phrase that only works
   * after arrival.
   *
   * It stays a hub description rather than a how-to, because
   * `buy-k-pop-concert-tickets-from-overseas` already owns "how to buy K-pop
   * tickets" and two pages chasing one query split it between them.
   */
  headline: "K-pop ticketing guides for international fans",
  /** Still a good slogan — it just is not a title. Used where a feed reader
   *  shows a source name, which is a place a slogan reads correctly. */
  tagline: "Get verified. Get tickets. Go.",
  description:
    "Step-by-step guides for international K-pop fans: ticketing platforms, identity verification, foreign card payments, fan club presales and album orders — checked against the live platforms and dated.",
  /**
   * .app is HTTPS-only and HSTS-preloaded in browsers, so there is no http
   * variant to canonicalise and no certificate to buy — Vercel issues one.
   */
  url: origin,
  /** The bare host, for the places that show an address rather than link one. */
  host: origin.replace(/^https?:\/\//, ""),
  locale: "en",
  /** Set NEXT_PUBLIC_GA_ID in the environment to switch GA4 on. */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  /**
   * Search engine ownership tokens.
   *
   * Google and Naver both verify a site by looking for a meta tag in the
   * homepage head. Neither can be registered before the domain resolves, so
   * these sit empty until then and the tags are simply not rendered — an
   * empty verification tag is worse than none, since it tells the crawler a
   * claim was made and abandoned.
   *
   * They are environment variables rather than code because the token arrives
   * from a dashboard, at a moment when the thing standing between the site and
   * its first visitor should not be a deploy.
   *
   * Naver is here because this site's subject is Korean even though its
   * readers are not: a fan searching 본인인증 or 선예매 in Korean reaches Naver,
   * and Naver's index is not Google's.
   */
  verifyGoogle: process.env.NEXT_PUBLIC_VERIFY_GOOGLE ?? "",
  verifyNaver: process.env.NEXT_PUBLIC_VERIFY_NAVER ?? "",
} as const;
