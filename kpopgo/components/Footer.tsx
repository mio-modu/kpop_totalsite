import Link from "next/link";
import { guides, RESEARCH_DATE } from "@/content/guides";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule-soft)" }}>
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
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
          <h2 className="data dim">Guides</h2>
          <ul className="mt-4 grid gap-2.5">
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
          <h2 className="data dim">How this works</h2>
          <ul className="t-sm mt-4 grid gap-2.5">
            <li>Every page says what kind of check it has had, and when.</li>
            <li>Every claim links its source.</li>
            <li>No identity-check workarounds, ever.</li>
            <li>No idol photos — every object is drawn for this site.</li>
          </ul>
          <ul className="t-sm mt-5 flex flex-wrap gap-x-5 gap-y-2">
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
              <Link href="/privacy" className="tap hover:text-[var(--ink)]">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

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
