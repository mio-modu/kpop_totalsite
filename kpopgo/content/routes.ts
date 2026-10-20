/**
 * The chooser: which door a fan is standing at.
 *
 * The obvious design for this page is a list of groups — pick your artist,
 * get your instructions. We did not build that, and the reason is the whole
 * point of the file.
 *
 * Which platform sells a given group's tickets is decided **per tour**, by the
 * promoter, and it moves. A group whose last tour sold through one platform
 * can sell the next through another, and the same tour can use different
 * platforms in different territories. An artist-to-platform table would
 * therefore be wrong somewhere from the day it shipped, would need re-checking
 * every time any tour was announced, and would expire constantly — which on a
 * site whose product is dated accuracy is worse than having no page.
 *
 * So this routes on what the reader can actually observe: the platform named
 * in the official announcement, or where their fan club already lives. Both are
 * facts in front of them rather than facts we would be guessing on their
 * behalf. One structural relationship is stable enough to state — Weverse is
 * HYBE's own platform, so HYBE artists' fan clubs live there — and it is
 * marked as structural rather than as a tour prediction.
 *
 * `gap: true` marks a platform we have not written a guide for. Saying so is
 * the point: a reader who buys through Melon Ticket should learn that in five
 * seconds rather than after reading three pages that do not apply.
 */
import { guides } from "./guides";

export type Route = {
  id: string;
  /** The platform's name as the Korean announcement writes it. */
  ko: string;
  name: string;
  /** One line: who this is. */
  who: string;
  /** How a reader recognises that this is their route. */
  tells: string[];
  /** Guides in reading order. Slugs are checked at module scope. */
  then: string[];
  /** Said plainly when we have nothing for this platform yet. */
  gap?: string;
  note?: string;
};

export const routes: Route[] = [
  {
    id: "weverse",
    ko: "위버스",
    name: "Weverse",
    who: "HYBE's own platform, and the one place where the fan club and the presale are the same account.",
    tells: [
      "Your group's official fan club lives on Weverse",
      "The announcement mentions a Weverse membership or a membership-only round",
      "You already pay for a membership and are not sure it is still active",
    ],
    then: [
      "weverse-membership-renewal-overseas",
      "fan-club-presale-checklist",
      "order-from-weverse-shop-overseas",
    ],
    note:
      "Structural, not a prediction: Weverse is HYBE's platform, so HYBE artists' communities are there. Where the tickets themselves are sold is still set per tour.",
  },
  {
    id: "nol-world",
    ko: "놀 월드",
    name: "NOL World",
    who: "The overseas-facing ticketing site, and the most likely route if you are buying from outside Korea.",
    tells: [
      "The announcement names NOL World, or an older guide sent you to interpark Global",
      "The booking page is in English and asks for a passport",
      "The show is marked Verified Member Only",
    ],
    then: [
      "nol-world-ticketing-guide",
      "nol-world-verified-member-ekyc",
      "nol-world-queue-and-seat-selection",
      "nol-facepass-face-registration",
      "nol-world-mobile-ticket-and-entry",
      "nol-world-cancel-ticket-refund",
      "nol-world-play-stay-package",
    ],
    note:
      "Renamed from interpark Global on 1 December 2025. Most English guides still use the old name.",
  },
  {
    id: "nol-ticket",
    ko: "놀 티켓",
    name: "NOL Ticket",
    who: "The Korean-language site. Usually not your route, and it is worth knowing why before you spend an evening on it.",
    tells: [
      "The page is only in Korean and asks for a Korean mobile number",
      "Verification offers 휴대폰 본인인증 or I-PIN and nothing else",
      "You hold a Korean passport, or you are an overseas Korean national",
    ],
    then: ["buy-k-pop-concert-tickets-from-overseas"],
    note:
      "Separate accounts from NOL World — registering on one does not give you the other. NOL World directs Korean passport holders here, and publishes a document route for overseas Korean nationals without a Korean number.",
  },
  {
    id: "yes24",
    ko: "예스24",
    name: "YES24 Global",
    who: "Used for a range of Korean tours, with its own English flow and its own account.",
    tells: [
      "The announcement links to ticket.yes24.com",
      "You were sent to an English booking page that is not NOL World",
    ],
    then: ["yes24-global-ticketing-guide"],
  },
  {
    id: "melon",
    ko: "멜론티켓",
    name: "Melon Ticket",
    who: "Appears in Korean tour announcements, including its global site.",
    tells: [
      "The announcement names Melon Ticket or 멜론티켓",
      "You were sent to tkglobal.melon.com",
    ],
    then: [],
    gap:
      "We have no guide for this one. Its global site refuses automated requests, so we have not been able to read its rules against a source — and we are not going to describe a payment and identity flow we could not check. Use the official announcement for your show as the authority.",
  },
  {
    id: "ticketlink",
    ko: "티켓링크",
    name: "TicketLink",
    who: "Another Korean vendor that appears in tour announcements, with a separate global site.",
    tells: ["The announcement names TicketLink or 티켓링크"],
    then: [],
    gap:
      "No guide yet, for the same reason: we have not had a readable source to write one from. The announcement for your show governs.",
  },
  {
    id: "albums",
    ko: "앨범",
    name: "Buying an album, not a ticket",
    who: "A different process end to end — different sites, different payment problems, and customs.",
    tells: [
      "You want the purchase to count towards a chart",
      "You are ordering merch or an album rather than booking a seat",
      "Your order arrived with a customs bill, or your checkout total went up",
    ],
    then: [
      "buy-k-pop-albums-from-overseas",
      "order-from-weverse-shop-overseas",
      "kpop-album-customs-duty-overseas",
    ],
  },
];

/**
 * A route pointing at a guide that does not exist renders a dead end, and a
 * chooser with a dead end is worse than no chooser. Checked here so a mistyped
 * slug fails the build.
 */
for (const route of routes) {
  for (const slug of route.then) {
    if (!guides.some((g) => g.slug === slug)) {
      throw new Error(`route "${route.id}" points at an unknown guide: ${slug}`);
    }
  }
  if (route.then.length === 0 && !route.gap) {
    throw new Error(
      `route "${route.id}" has no guides and no gap note — it would render an ` +
        `empty card. Say what is missing instead.`,
    );
  }
}

export const routeCount = routes.length;
export const coveredRoutes = routes.filter((r) => r.then.length > 0).length;
