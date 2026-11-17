"use client";

import { useEffect, useRef, useState } from "react";
import { ads, adEnabled, type AdPlacement } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One AdSense unit.
 *
 * Four things this does on purpose:
 *
 *  · Reserves its height before the unit loads. An ad that pushes the article
 *    down as it arrives is a Cumulative Layout Shift, which Google measures and
 *    ranks on — so an unreserved ad slot costs search position to buy
 *    impressions, which is the wrong trade on a site whose whole channel is
 *    search.
 *
 *  · Labels itself. AdSense requires ads be distinguishable from content, and
 *    on a page whose product is "you can trust what this says", an ad that
 *    reads as a recommendation does more damage than it earns.
 *
 *  · Renders nothing when unconfigured, rather than an empty box.
 *
 *  · Shows its box only once an ad has actually filled it. The third rule
 *    above has a hole, and it was visible on the live site: ids configured
 *    and serving not yet enabled is a state the `adEnabled` guard cannot
 *    see. AdSense creates its frame regardless and paints it white, so a
 *    dark page carried a 280px white rectangle under the word
 *    ADVERTISEMENT, mid-article, during the days Google was reviewing the
 *    site for approval. The label is worse than the rectangle: a notice
 *    saying an advertisement is here, over nothing, on a page whose product
 *    is being accurate.
 *
 *    So the chrome — background, border, label — and the unit itself are
 *    hidden until `data-ad-status` reads `filled`. **Hidden, not removed**:
 *    the reserved height does not change, so revealing a real ad shifts
 *    nothing and the first rule is not traded away for the fourth.
 *
 *    After approval this stops mattering on its own, because AdSense marks
 *    an unsold slot `unfilled` and collapses it itself. It still earns its
 *    place for the reader whose request returns no ad, and for the one
 *    running a blocker.
 */
export function AdSlot({
  placement,
  className = "",
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const pushed = useRef(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!adEnabled(placement) || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // A blocked or failed loader leaves the reserved space empty, which is
      // the correct outcome — never a broken page.
    }
  }, [placement]);

  useEffect(() => {
    if (!adEnabled(placement)) return;
    const el = insRef.current;
    if (!el) return;

    // AdSense writes `data-ad-status` when a response arrives — `filled` when
    // it sent an ad, `unfilled` when it had none. Before serving is enabled
    // for the site it writes neither, which is the state this watches for:
    // absent is not the same as empty, and only `filled` reveals the box.
    const read = () => {
      if (el.getAttribute("data-ad-status") === "filled") setFilled(true);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });
    return () => observer.disconnect();
  }, [placement]);

  if (!adEnabled(placement)) return null;

  return (
    <aside
      className={`ad-slot ${filled ? "is-filled" : ""} ${className}`.trim()}
      aria-label="Advertisement"
      // Not part of the guide, so it stays out of the reading order's content.
      role="complementary"
      // Nothing is announced until there is something to announce.
      aria-hidden={filled ? undefined : true}
    >
      <p className="data-sm dim ad-label">Advertisement</p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ads.client}
        data-ad-slot={ads.slots[placement]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
