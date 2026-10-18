import type { NextConfig } from "next";

/**
 * The one hostname this site is allowed to be served on.
 *
 * Taken from the same environment variable lib/site.ts uses for the canonical
 * origin, because a redirect target that disagrees with the canonical tag is
 * worse than having neither: the tag would point one way and the 308 the
 * other, and a crawler resolving that has to pick.
 *
 * A set-but-unparseable value fails the build on purpose. The failure it
 * prevents — every URL quietly indexed under the wrong host — is not visible
 * for weeks and takes months to undo, which is exactly the kind of mistake
 * that should not be allowed to ship quietly.
 */
function primaryHost(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return "kpopgo.app";
  try {
    const host = new URL(raw).host;
    if (!host) throw new Error("no host");
    return host;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is set to "${raw}", which is not a URL with a host. ` +
        `It drives the canonical tag, the sitemap and the host redirect, so a ` +
        `broken value would split the search index three ways.`,
    );
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * One host, one set of URLs.
   *
   * A Vercel project answers on more names than the one you bought:
   * kpopgo.app, www.kpopgo.app, the project's own *.vercel.app alias, and the
   * per-deployment alias. Serving the same pages on all of them splits the
   * ranking signals between them, and Google decides for itself which is the
   * original — sometimes the .vercel.app one.
   *
   * The canonical tags already name the right URL, but a canonical tag is a
   * hint. This is not: anything arriving on another host gets a 308 to the
   * same path on the primary one.
   *
   * Production only. On a preview deployment this would bounce every review
   * URL to the live site, which would make previews useless — and Vercel
   * already serves previews with X-Robots-Tag: noindex, so they are not the
   * ones splitting the index.
   */
  async redirects() {
    if (process.env.VERCEL_ENV !== "production") return [];
    const host = primaryHost();
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: host }],
        destination: `https://${host}/:path*`,
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The site has no forms and no uploads, so framing it serves nobody
          // but a clickjacker.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin to third parties, never the full path. An ad
          // network does not need to know which guide somebody was reading.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here uses these, and AdSense should not acquire them
          // through a frame either.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
      {
        // Cut-outs and stage frames are content-addressed by name and only
        // change when the artwork does, so they can be cached hard.
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
