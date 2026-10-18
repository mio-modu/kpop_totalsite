import type { Metadata } from "next";
import Link from "next/link";
import { guides, glossary, platformList } from "@/content/guides";
import { ObjectMark, StageScene, CrowdScene } from "@/components/Objects";
import { Artwork } from "@/components/Artwork";
import { VerifiedBadge } from "@/components/Badges";
import { AdSlot } from "@/components/AdSlot";

/**
 * The status this page shows is derived from today's date (lib/freshness.ts),
 * so a page frozen at build time would keep showing whatever was true on the
 * day it was deployed — the exact failure the expiry exists to prevent. One
 * day is short enough that a lapsed check is never live for long, and long
 * enough that this stays a static site with a daily regeneration rather than
 * a server rendering five pages per visitor.
 */
export const revalidate = 86400;

const cities = [
  "서울 Seoul",
  "로스앤젤레스 Los Angeles",
  "상파울루 São Paulo",
  "런던 London",
  "자카르타 Jakarta",
  "멕시코시티 Mexico City",
  "파리 Paris",
  "마닐라 Manila",
  "토론토 Toronto",
  "시드니 Sydney",
];

const failures = [
  {
    n: "01",
    en: "Wrong platform",
    ko: "예매처를 잘못 고름",
    d: "Guides map agencies to platforms one-to-one. Agencies switch between tours, and one tour can split its Korean and global sales.",
  },
  {
    n: "02",
    en: "Wrong check",
    ko: "본인인증 방식을 잘못 준비",
    d: "The identity check depends entirely on which site sells your show. Preparing for the wrong one burns the lead time that matters.",
  },
  {
    n: "03",
    en: "Wrong moment",
    ko: "결제 단계에서야 알게 됨",
    d: "Verification processing, bank fraud rules and membership cut-offs all need days. They get discovered at the payment step instead.",
  },
];

const renames = [
  { ko: "인터파크 티켓 → 놀 티켓", en: "Interpark Ticket → NOL Ticket", when: "Apr 2025" },
  { ko: "인터파크 글로벌 → 놀 월드", en: "interpark Global → NOL World", when: "01 Dec 2025" },
  { ko: "개정 공연법 시행", en: "Revised Performances Act in effect", when: "28 Aug 2025" },
];

/**
 * The root is the one page without a canonical of its own, because the layout's
 * metadataBase only resolves relative ones. Without it an index of
 * kpopgo.app/?ref=… or a trailing-slash variant competes with the page itself.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      {/* ─────────── Hero — T09 영화 같은 한 장면 ─────────── */}
      <section className="stage stage-hero band">
        <div className="stage-media">
          <Artwork name="hero-stage" fallback={<StageScene />} priority drop={false} />
        </div>
        <div className="stage-scrim" />
        <div className="prop prop-stick float" aria-hidden="true">
          <Artwork name="lightstick" fallback={null} drop={false} />
        </div>
        <div className="wrap stage-body py-16 sm:py-24 lg:py-32">
          <p className="data ju">Updated for NOL World · 01 Dec 2025</p>
          <h1 className="px mt-4 max-w-[15ch]">Buying K-pop tickets from outside Korea</h1>
          <p className="han-m mt-4">
            <span className="mark">이렇게 어려울 필요 없습니다</span>
          </p>
          <p className="t-lg mt-6">
            Which platform your show is on. What identity check it runs. Why your card got
            declined. Dated, sourced, walked step by step.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/guides/buy-k-pop-concert-tickets-from-overseas" className="btn">
              Start with the basics →
            </Link>
            <Link
              href="/guides/foreign-card-declined-korean-ticketing"
              className="btn btn-stage"
            >
              My card was declined
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── City ticker ─────────── */}
      <div className="band ticker flood" aria-hidden="true">
        <div className="ticker-in">
          {[0, 1].map((dup) => (
            <span key={dup}>
              {cities.map((c) => (
                <span key={c} className="flex items-center gap-6">
                  {c}
                  <span>✱</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────── T20: numbers as the subject ─────────── */}
      <section className="band tint">
        <div className="wrap proof grid gap-3.5 py-10 sm:grid-cols-3 sm:py-14">
          <div className="obj p-6">
            <ObjectMark name="id" />
            <span className="figure mt-4">05</span>
            <p className="data mt-3.5">Guides</p>
            <p className="han-lb mt-1">전체 절차 안내</p>
          </div>
          <div className="obj p-6">
            <ObjectMark name="card" />
            <span className="figure ju mt-4">00</span>
            <p className="data mt-3.5">Idol photos used</p>
            <p className="han-lb mt-1">초상권 리스크 없음</p>
          </div>
          <div className="obj p-6">
            <ObjectMark name="star" />
            <span className="figure mt-4">
              100<span className="text-[0.5em]">%</span>
            </span>
            <p className="data mt-3.5">Claims with a source</p>
            <p className="han-lb mt-1">출처 전부 표기</p>
          </div>
        </div>
      </section>

      {/* ─────────── The gap ─────────── */}
      <section className="band sect">
        <div className="wrap">
          <p className="data dim">01 / The gap</p>
          <h2 className="pl mt-4 max-w-[22ch]">
            Most guides describe a site that <span className="mark">got renamed.</span>
          </h2>
          <p className="han-m dim mt-3.5">이름이 바뀐 사이트를 설명하고 있습니다</p>
          <p className="t mt-5">
            Three things changed. The English guides ranking today reflect none of them —
            and neither does anything an answer engine learned before they happened.
          </p>

          <div className="obj mt-8 px-5 pt-2 pb-1">
            <div className="scroller">
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="w-[44%]">What changed</th>
                    <th className="w-[20%]">When</th>
                    <th>Ranking guides</th>
                  </tr>
                </thead>
                <tbody>
                  {renames.map((r, i) => (
                    <tr key={r.en} style={i === renames.length - 1 ? { borderBottom: 0 } : undefined}>
                      <td style={{ color: "var(--ink)" }}>
                        <span className="han">{r.ko}</span>
                        <br />
                        <span className="data-sm dim">{r.en}</span>
                      </td>
                      <td>
                        <span className="data">{r.when}</span>
                      </td>
                      <td>
                        <span className="data ju">Not covered</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-9 grid gap-3.5 sm:grid-cols-3">
            {failures.map((f, i) => (
              <div key={f.n} className="obj p-6">
                <ObjectMark name={(["id", "card", "ticket"] as const)[i]} />
                <p className="data ju mt-4">Failure {f.n}</p>
                <h3 className="pm mt-2">{f.en}</h3>
                <p className="han-lb mt-1.5">{f.ko}</p>
                <p className="t-sm mt-3">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Guides — photocards ─────────── */}
      <section id="guides" className="band sect" style={{ position: "relative" }}>
        <div className="prop prop-card float-b" aria-hidden="true">
          <Artwork name="pc-foil" fallback={null} />
        </div>
        <div className="wrap">
          <p className="data dim">02 / The guides</p>
          <h2 className="pl mt-4">
            Five <span className="foil-text">procedures</span>
          </h2>
          <p className="han-m dim mt-3">다섯 개의 절차</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {guides.map((g, i) => (
              <li
                key={g.slug}
                className={`pc ${i === 0 ? "sm:col-span-2" : ""}`}
              >
                <Link href={`/guides/${g.slug}`} className="block p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <span className="pc-han block">{g.ko}</span>
                      <h3 className="pm mt-3">{g.title}</h3>
                    </div>
                    <span className="pc-no shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="t-sm mt-4 max-w-[58ch]">{g.summary}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="chip data-sm">
                      {String(g.steps.length).padStart(2, "0")} steps
                    </span>
                    <span className="chip data-sm">
                      {String(g.readMinutes).padStart(2, "0")} min
                    </span>
                    <VerifiedBadge guide={g} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── Terms marquee ─────────── */}
      <section
        className="band ticker"
        aria-label="Korean words you will meet on a booking screen"
      >
        <div className="ticker-in">
          {[0, 1].map((dup) => (
            <span key={dup}>
              {glossary.map((w) => (
                <span key={w.ko} className="flex items-center gap-6">
                  <span className="han ju text-[1.05rem] normal-case">{w.ko}</span>
                  <span className="dim">{w.en}</span>
                  <span className="dim">／</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────── Crowd band ─────────── */}
      <section className="stage band" aria-label="A concert crowd with raised arms and handheld lights">
        <div className="stage-media">
          <Artwork name="band-crowd" fallback={<CrowdScene />} drop={false} />
        </div>
        <div className="stage-scrim stage-scrim-soft" />
        <div className="wrap stage-body py-14 sm:py-20">
          <p className="pm max-w-[24ch]">
            Hundreds of thousands clear this every tour
          </p>
          <p className="han-m mt-3" style={{ color: "rgba(246,243,238,.7)" }}>
            매 투어마다 수십만 명이 통과합니다
          </p>
          <p className="t-sm mt-4 max-w-[48ch]">
            It is not luck and it is not a secret. It is a sequence, and almost every
            failure happens at a step you can finish days in advance.
          </p>
        </div>
      </section>

      {/* ─────────── Platforms ─────────── */}
      <section id="platforms" className="band sect">
        <div className="wrap">
          <p className="data dim">03 / Platforms</p>
          <h2 className="pl mt-4 max-w-[19ch]">Never infer yours from the agency</h2>
          <p className="han-m dim mt-3">소속사로 예매처를 추측하지 마세요</p>
          <p className="t mt-5">
            There is no single K-pop ticketing site. The platform is chosen per tour and
            named in the official announcement. These are the Hangul names you will see on
            screen.
          </p>

          <div className="obj mt-8 px-5 pt-2 pb-1">
            <div className="scroller">
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="w-[20%]">한글</th>
                    <th className="w-[26%]">Platform</th>
                    <th>What it is</th>
                  </tr>
                </thead>
                <tbody>
                  {platformList.map((p, i) => (
                    <tr
                      key={p.name}
                      style={i === platformList.length - 1 ? { borderBottom: 0 } : undefined}
                    >
                      <td>
                        <span className="han ju text-[1.0625rem]">{p.ko}</span>
                      </td>
                      <td style={{ color: "var(--ink)" }}>
                        <span className="ps">{p.name}</span>
                      </td>
                      <td>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10">
            <p className="data dim">
              Words on the booking screen{" "}
              <span className="han text-[0.6875rem]">예매 화면에서 보게 될 단어</span>
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {glossary.map((w, i) => (
                <li
                  key={w.ko}
                  className={`sticker ${["", "sticker-cy", "sticker-vi"][i % 3]}`}
                >
                  <span className="ko">{w.ko}</span>
                  <span className="en">{w.en}</span>
                </li>
              ))}
            </ul>
            <p className="t-sm mt-5">
              <Link href="/words" className="ju underline underline-offset-4">
                All 55 words, grouped by where you meet them →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── Principles ─────────── */}
      <section className="band flood">
        <div className="wrap sect">
          <p className="data" style={{ opacity: 0.64 }}>
            04 / How we write these
          </p>
          <h2 className="pl mt-4 max-w-[20ch]">Four rules, no exceptions</h2>
          <p className="han-m mt-3" style={{ opacity: 0.76 }}>
            네 가지 원칙, 예외 없음
          </p>

          <div className="mt-9 grid">
            {[
              {
                t: "Dated, or it doesn't ship",
                d: "Every page carries the day it was last checked against the live platform.",
              },
              {
                t: "Sourced, or it doesn't ship",
                d: "Official announcements, platform help pages and press reporting — linked at the foot of every guide so you can check us.",
              },
              {
                t: "No identity-check workarounds",
                d: "Where a platform requires Korean 본인인증 we say so, and describe the official routes open to overseas fans instead.",
              },
              {
                t: "No idol photos",
                d: "Not one. Every object on this site was drawn for it, which keeps us clear of portrait and copyright claims — and lets us redraw a flow the day a platform changes it.",
              },
            ].map((p, i, arr) => (
              <div
                key={p.t}
                className="grid grid-cols-[48px_1fr] py-5"
                style={{
                  borderTop: "1px solid rgba(0,0,0,.22)",
                  borderBottom: i === arr.length - 1 ? "1px solid rgba(0,0,0,.22)" : undefined,
                }}
              >
                <span className="data" style={{ opacity: 0.6 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="ps">{p.t}</h3>
                  <p className="t-sm mt-2">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
