import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Guide } from "@/content/guides";

/**
 * An official document reproduced on the page, with the terms it is
 * reproduced on attached to it.
 *
 * Everything else pictured on this site was drawn or rendered for it. This is
 * the exception, and it earns it: the schematic above the steps teaches the
 * rule, and a reader who needs to know whether block 417 or 418 is the one
 * beside gate D needs the operator's own drawing, not somebody's reading of
 * it. The two do different jobs and the page is better with both.
 *
 * Three things are deliberate.
 *
 * The credit, the licence and the source are rendered from the register
 * rather than written into the JSX, so there is no version of this component
 * that displays the picture without them — the same derivation the paid-link
 * disclosure uses, for a stricter reason.
 *
 * The original file is linked as well as displayed. `next/image` serves a
 * resized, re-encoded derivative, which is right for the page and wrong for
 * verification: a reader checking this against the venue should be able to
 * open the bytes that were taken, and the byte-for-byte copy is what
 * `scripts/watch.mjs` fingerprints.
 *
 * It is not `priority`. The piece is below the steps on a long page, it is
 * 230KB, and on a site whose only channel is search an eager fetch of it
 * would spend ranking to buy nothing.
 */
export function SourceDocument({ guide }: { guide: Guide }) {
  const doc = guide.document;
  if (!doc) return null;

  // Checked on the server at build time, the way <Artwork> does it: a missing
  // file renders nothing rather than a broken frame.
  if (!fs.existsSync(path.join(process.cwd(), "public", "img", doc.file))) {
    return null;
  }

  return (
    <figure className="obj overflow-hidden">
      <Image
        src={`/img/${doc.file}`}
        alt={doc.alt}
        width={doc.width}
        height={doc.height}
        sizes="(max-width: 640px) 100vw, 520px"
        className="mx-auto block h-auto w-full max-w-[520px]"
      />
      <figcaption className="border-t border-[var(--rule-soft)] p-5 sm:p-6">
        <p className="t-sm">{doc.caption}</p>
        <dl className="mt-4 grid gap-1.5">
          <div className="flex flex-wrap gap-x-3">
            <dt className="data-sm dim">Source</dt>
            <dd className="t-sm">
              {doc.credit} &mdash;{" "}
              <a href={doc.sourceUrl} rel="noopener" className="underline">
                the page it is published on
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="data-sm dim">Licence</dt>
            <dd className="t-sm">
              <a href={doc.licenceUrl} rel="noopener" className="underline">
                {doc.licence}
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="data-sm dim">This copy</dt>
            <dd className="t-sm">
              Taken {doc.taken}.{" "}
              <a href={`/img/${doc.file}`} rel="noopener" className="underline">
                The file as it was taken
              </a>
              , and{" "}
              <a href={doc.upstream} rel="noopener" className="underline">
                the operator&rsquo;s own copy
              </a>{" "}
              to check it against.
            </dd>
          </div>
        </dl>
      </figcaption>
    </figure>
  );
}
