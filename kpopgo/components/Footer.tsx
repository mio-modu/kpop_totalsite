import Link from "next/link";
import { guides, RESEARCH_DATE } from "@/content/guides";
import { localesWithContent } from "@/content/translations";
import { LOCALES } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule-soft)" }}>
      {/* The guide column sets the proportions: at twenty guides it was a
          single column taller than the other two put together, which made the
          footer a page of its own on every route. It runs two-up from sm, so
          the brand and policy columns give back the width it needs. */}
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.15fr_1.7fr_1.15fr]">
        <div>
          <span
            className="text-[1.125rem] font-black uppercase tracking-[-0.045em]"
            style={{ fontVariationSettings: '"wdth" 114' }}
          >
            KPOP<span className="ju">GO</span>
          </span>
          <p className="han-lb mt-2">케이팝 해외 예매 안내 · 비공식 팬 자료</p>
          <p className="t-sm dim mt-4 max-w-[62ch] text-[0.8125rem]">
            An independent fan resource. Not affiliated with, endorsed by or operated by
            any agency, artist or ticketing platform. Platform rules change — the official
            announcement for your show always overrides anything written here.
          </p>
        </div>

        <nav aria-label="Guides">
          <h2 className="data col-head">Guides</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="t-sm tap hover:text-[var(--ink)]">
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="data col-head">How this works</h2>
          <ul className="t-sm mt-4 grid gap-2.5">
            <li>Every page says what kind of check it has had, and when.</li>
            <li>Every claim links its source.</li>
            <li>No identity-check workarounds, ever.</li>
            <li>No idol photos — every object is drawn for this site.</li>
          </ul>
          <ul className="t-sm mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/where-to-buy" className="tap hover:text-[var(--ink)]">
                Where to buy
              </Link>
            </li>
            <li>
              <Link href="/words" className="tap hover:text-[var(--ink)]">
                Korean words
              </Link>
            </li>
            <li>
              <Link href="/about" className="tap hover:text-[var(--ink)]">
                About
              </Link>
            </li>
            <li>
              <Link href="/editorial-policy" className="tap hover:text-[var(--ink)]">
                How we check
              </Link>
            </li>
            <li>
              <Link href="/report" className="tap hover:text-[var(--ink)]">
                Report what you saw
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="tap hover:text-[var(--ink)]">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/*
        Ten links to the language indexes, on every page.

        This is not the site-wide language switcher LanguageLinks refuses, and
        the difference is what makes it safe. That component is per guide
        because only some guides are translated, so a global toggle would
        either 404 or drop a reader onto English fifteen pages out of twenty.
        These links go to an *index* — a page that exists for every language
        listed and shows exactly what that language has. Nothing here can
        promise a translation that is not there.

        It is also the only reader-visible route from the English site into
        the other editions. hreflang tells a crawler they exist and tells a
        reader nothing, and before this row no anchor anywhere on an English
        page pointed at /ja or /th. One line in the footer is also the
        cheapest crawl path into the indexes that root each edition.

        Each name is set in its own language, with `lang` so a screen reader
        pronounces it rather than spelling it out in English, and `hrefLang`
        so the relationship is stated rather than inferred from the href. The
        list comes from the register, so a language appears here when it has
        pages and not when it is merely declared.
      */}
      <nav
        aria-label="Languages"
        className="wrap py-5"
        style={{ borderTop: "1px solid var(--rule-soft)" }}
      >
        <ul className="t-sm flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="data-sm dim">Read in</li>
          {localesWithContent().map((code) => (
            <li key={code}>
              <Link
                href={LOCALES[code].prefix}
                className="tap hover:text-[var(--ink)]"
                hrefLang={LOCALES[code].tag}
                lang={LOCALES[code].tag}
              >
                {LOCALES[code].native}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className="wrap flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderTop: "1px solid var(--rule-soft)" }}
      >
        <p className="data-sm dim">
          Research compiled {RESEARCH_DATE} · Not legal, financial or immigration advice
        </p>
        <p className="data-sm dim">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
