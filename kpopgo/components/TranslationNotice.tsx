import Link from "next/link";
import type { Guide } from "@/content/guides";
import type { Translation } from "@/content/translations";
import { translationState } from "@/lib/i18n";

/**
 * What a translated page is allowed to claim, said on the page itself.
 *
 * Two separate admissions, and both are above the steps rather than in a
 * footer, for the same reason the paid-link disclosure is: a notice under
 * 5,000px of page has been read by nobody.
 *
 *  · How it was produced. A machine-assisted translation of a page about
 *    customs offences and biometric retention is useful and is not the same
 *    artefact as one a native speaker has read.
 *  · Whether the English page has moved since. If it has, the English is the
 *    authority and the link is right here.
 *
 * The wording is localised through `labels` on the translation, because a
 * notice about a translation that is itself in English is a notice for
 * somebody who did not need the translation.
 */
export function TranslationNotice({
  guide,
  tr,
}: {
  guide: Guide;
  tr: Translation;
}) {
  const state = translationState(guide, tr);

  return (
    <aside className="tint mt-8 p-5 sm:p-6" aria-label="About this translation">
      <p className="data dim">
        {tr.review === "native-reviewed"
          ? tr.labels.reviewedNative
          : tr.labels.reviewedMachine}
      </p>

      {state !== "current" && (
        <p className="t-sm mt-3 max-w-[62ch]">
          {state === "stale" ? tr.labels.sourceStale : tr.labels.sourceMoved}
        </p>
      )}

      <p className="t-sm mt-3">
        <Link
          href={`/guides/${guide.slug}`}
          className="tap foil-text hover:underline"
          hrefLang="en"
        >
          {tr.labels.readEnglish}
        </Link>
      </p>
    </aside>
  );
}
