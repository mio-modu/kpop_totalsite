import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getArt } from "@/content/artwork";

/**
 * Renders a generated image when one has been dropped into public/img/, and the
 * drawn SVG fallback until then.
 *
 * The check runs at build time on the server, so there is no client-side probe
 * and no flash of a missing image. A piece that has not been rendered yet simply
 * keeps its SVG — which is why the site has always been shippable without any
 * image assets.
 */
export function Artwork({
  name,
  fallback,
  priority = false,
  className,
  drop = true,
  maxHeight,
}: {
  name: string;
  fallback: React.ReactNode;
  priority?: boolean;
  className?: string;
  /** Cut-outs get a drawn shadow; full-bleed frames do not. */
  drop?: boolean;
  /**
   * A vertical budget, as any CSS length.
   *
   * Width is the wrong axis to cap these on, and the guide pages proved it:
   * the pieces are not the same shape — `pc-foil` is 720x1286 and
   * `guide-tickets` is 720x420 — so one width cap renders the first three
   * times taller than the second. A height cap gives every piece the same
   * share of the screen whatever its proportions, which is what the page
   * actually wants to control.
   */
  maxHeight?: string;
}) {
  const art = getArt(name);
  if (!art) return <>{fallback}</>;

  const file = path.join(process.cwd(), "public", "img", art.file);
  if (!fs.existsSync(file)) return <>{fallback}</>;

  return (
    <Image
      src={`/img/${art.file}`}
      alt={art.alt}
      width={art.width}
      height={art.height}
      priority={priority}
      className={[drop ? "art-drop" : "", className].filter(Boolean).join(" ")}
      sizes={maxHeight ? "(max-width: 640px) 60vw, 420px" : "(max-width: 900px) 100vw, 50vw"}
      // Inline, so it wins the cascade — which is the whole reason the guide
      // page's `max-w-[420px]` silently did nothing for as long as it did.
      // With a height budget the width has to be free, or capping one axis
      // squashes the piece instead of scaling it.
      style={
        maxHeight
          ? { width: "auto", height: "auto", maxWidth: "100%", maxHeight }
          : { width: "100%", height: "auto" }
      }
    />
  );
}
