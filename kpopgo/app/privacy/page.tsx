import type { Metadata } from "next";
import { RESEARCH_DATE } from "@/content/guides";
import { site } from "@/lib/site";
import { Contact } from "@/components/Contact";
import { adsConfigured } from "@/lib/ads";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What KPOPGO collects, what third parties set cookies here, and how to opt out.",
  alternates: { canonical: "/privacy" },
};

/**
 * AdSense will not approve a site without this page, and the requirement is
 * reasonable: ads set cookies in the reader's browser, so the reader has to be
 * told. It also has to stay true — the advertising section only claims ads are
 * served once they actually are.
 */
export default function Privacy() {
  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="pl max-w-[18ch]">Privacy</h1>
      <p className="han-m dim mt-3.5">개인정보 처리방침</p>
      <p className="data dim mt-5">Last updated {RESEARCH_DATE}</p>

      <div className="mt-10 grid max-w-[68ch] gap-8">
        <section>
          <h2 className="pm">What this site collects</h2>
          <p className="t mt-3">
            KPOPGO has no accounts, no sign-in and no comment form, so there is nothing
            here that asks you for your name, your email address or any other personal
            detail. Nothing you type is stored, because there is nothing to type into.
          </p>
        </section>

        <section>
          <h2 className="pm">Analytics</h2>
          <p className="t mt-3">
            This site uses Google Analytics 4 to count visits and measure how long people
            spend reading a guide, which is how we tell whether a guide is actually
            useful. Google Analytics sets cookies and processes data including your IP
            address, approximate location, device and browser. We never see your identity
            and we do not try to work it out.
          </p>
          {site.clarityId ? (
            <p className="t mt-3">
              We also use Microsoft Clarity, which is a different kind of measurement and
              worth describing as one: it records a session — scrolling, clicks, and the
              point in a ten-step guide where somebody stops — and replays it to us
              anonymously. That is how we find the step that is written badly, which a
              visit count cannot show. Microsoft says Clarity masks sensitive page content
              by default, so what we see is the shape of a session rather than anything you
              typed, and Microsoft processes the data under its own privacy statement.
            </p>
          ) : null}
          <p className="t mt-3">
            You can opt out for every site at once with Google&apos;s browser add-on, or
            by blocking the scripts in your browser. The site works normally either way,
            and blocking covers the session recording as well as the visit count.
          </p>
        </section>

        <section>
          <h2 className="pm">Advertising</h2>
          {adsConfigured ? (
            <>
              <p className="t mt-3">
                This site shows advertising through Google AdSense. Google and its
                partners use cookies to serve ads based on your previous visits to this
                and other sites, and third-party vendors may do the same. These are
                clearly labelled &quot;Advertisement&quot; and are never editorial
                recommendations — nothing on this site is a paid placement, and no
                advertiser has any say over what the guides say.
              </p>
              <p className="t mt-3">
                You can turn off personalised advertising in Google&apos;s Ads Settings,
                and opt out of third-party vendors at aboutads.info. Ads still appear;
                they are just no longer based on your browsing.
              </p>
            </>
          ) : (
            <p className="t mt-3">
              This site does not currently show advertising. If that changes, this section
              will say what is served, who sets cookies, and how to opt out — before any
              ad appears, not after.
            </p>
          )}
        </section>

        <section>
          <h2 className="pm">Links out</h2>
          <p className="t mt-3">
            Guides link to ticketing platforms, official announcements and press
            reporting. Those sites have their own privacy practices and this policy does
            not cover them. We are not affiliated with any of them.
          </p>
        </section>

        <section>
          <h2 className="pm">Your choices</h2>
          <p className="t mt-3">
            Blocking cookies or using an ad blocker costs you nothing here: every guide
            is readable with scripts disabled. Depending on where you live you may have a
            right to ask what data about you has been processed — in which case the place
            to ask is Google, since this site holds none of it itself.
          </p>
        </section>

        <section>
          <h2 className="pm">Contact</h2>
          <p className="t mt-3">
            Questions about this policy, a correction to a guide, or a takedown request:{" "}
            <Contact what="A privacy request" />
          </p>
        </section>
      </div>
    </div>
  );
}
