"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
  return (
    <header
      className="sticky z-50"
      style={{
        top: "env(safe-area-inset-top, 0px)",
        background: "var(--paper)",
        borderBottom: "1px solid var(--rule-soft)",
      }}
    >
      <nav className="wrap flex h-15 items-center gap-3 sm:h-17">
        <Link href="/" className="logo-link tap">
          <span
            className="font-latin text-[1.3125rem] font-black uppercase tracking-[-0.045em]"
            style={{ fontVariationSettings: '"wdth" 114' }}
          >
            KPOP<span className="ju">GO</span>
          </span>
        </Link>
        <span className="han-lb ml-2 hidden sm:inline">케이팝 해외 예매 안내</span>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/where-to-buy"
            className="data dim tap nav-compact px-2 transition-colors hover:text-[var(--ink)]"
          >
            Where to buy
          </Link>
          <Link
            href="/guides"
            className="data dim tap hidden px-2 transition-colors hover:text-[var(--ink)] sm:inline-flex"
          >
            Guides
          </Link>
          <Link
            href="/words"
            className="data dim tap hidden px-2 transition-colors hover:text-[var(--ink)] sm:inline-flex"
          >
            Words
          </Link>
          <ThemeToggle />
          <Link
            href="/guides/buy-k-pop-concert-tickets-from-overseas"
            className="btn nav-cta px-4 py-2.5 text-[0.8125rem]"
          >
            Start
          </Link>
        </div>
      </nav>
    </header>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("kpopgo-theme");
    } catch {
      // Private mode or blocked storage — the OS preference still applies.
    }
    const isDark =
      stored === "dark" || stored === "light"
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("kpopgo-theme", next ? "dark" : "light");
    } catch {
      // Not persisting is acceptable; the toggle still works for this view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      className="grid size-11 place-items-center rounded-full sm:size-9"
      style={{ border: "1px solid var(--rule)" }}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4 7.2 7.2M16.8 16.8l1.8 1.8M18.6 5.4 16.8 7.2M7.2 16.8l-1.8 1.8" />
          </>
        ) : (
          <path d="M20.4 14.6A8.8 8.8 0 0 1 9.4 3.6a8.8 8.8 0 1 0 11 11Z" />
        )}
      </svg>
    </button>
  );
}
