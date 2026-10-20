import Link from "next/link";
import { translationsFor } from "@/content/translations";
import { LOCALES } from "@/lib/i18n";

/**
 * The language picker, and it is per guide rather than site-wide.
 *
 * A global language setting is the obvious design and the wrong one here,
 * because only some guides are translated. A reader who switches the whole
 * site to Japanese and then meets English on fifteen of twenty pages has been
 * handed a worse experience than one who was never offered the switch — and a
 * toggle that 404s is worse still. So the offer appears on the pages that can
 * honour it and nowhere else, which is the same rule as hreflang.
 *
 * Renders nothing when a guide has no translations, so it costs an
 * untranslated page no space at all.
 */
export function LanguageLinks({ slug }: { slug: string }) {
  const available = translationsFor(slug);
  if (available.length === 0) return null;

  return (
    <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label="Other languages">
      <span className="data dim">Also in</span>
      {available.map((t) => {
        const info = LOCALES[t.locale];
        return (
          <Link
            key={t.locale}
            href={`${info.prefix}/guides/${slug}`}
            hrefLang={info.tag}
            lang={info.tag}
            className="chip data-sm tap hover:text-[var(--ink)]"
          >
            {info.native}
          </Link>
        );
      })}
    </nav>
  );
}
