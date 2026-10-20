import type { Guide } from "@/content/guides";
import { getPartner } from "@/content/affiliates";

/**
 * Paid links, and saying so.
 *
 * Both pieces here take the guide or the step rather than a boolean, so
 * neither can be rendered by mistake and neither can be left off. The notice
 * appears because a step carries a partner, not because someone remembered;
 * remove the last partner and the notice goes with it.
 */

/**
 * Shown above step one on any guide containing a paid link.
 *
 * Above, not in the footer: the US FTC asks for disclosure that is clear and
 * placed before the link, and most of the readers this site is written for
 * are American. The practical reason is the same as the legal one — a notice
 * under a 5,000px page has not been read by anybody.
 */
export function PaidDisclosure({ guide }: { guide: Guide }) {
  const ids = [...new Set(guide.steps.flatMap((s) => (s.partner ? [s.partner.id] : [])))];
  if (ids.length === 0) return null;

  const names = ids.map((id) => getPartner(id)?.name ?? id);
  const list =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
      : names[0];

  return (
    <div className="obj p-5 sm:p-6">
      <p className="data ju">
        Some links here are paid <span className="han text-[0.6875rem]">유료 링크</span>
      </p>
      <p className="t-sm mt-3">
        If you open a link marked <span className="paid-tag">Paid</span> and buy
        something, {list} pays this site a commission. It costs you nothing extra.
      </p>
      <p className="t-sm mt-3">
        A paid link is only ever on a thing this guide would have named anyway, and the
        commission never changes what a step says — if the option that pays is the worse
        one, the step says it is worse. Who pays us and for what is listed on{" "}
        <a href="/editorial-policy" className="ju underline underline-offset-4">
          how we check things
        </a>
        .
      </p>
    </div>
  );
}

/**
 * The link itself.
 *
 * `rel="sponsored"` is what Google asks for on a paid link, and `nofollow`
 * alongside it costs nothing. The visible tag is the part that matters to a
 * reader: a paid link that looks exactly like an unpaid one is disclosed in
 * the legal sense and hidden in every sense that counts.
 *
 * An unknown partner renders nothing rather than an unmarked link. The build
 * already fails on one (content/guides.ts), so this only ever fires if that
 * check is removed — in which case silence is the safe direction.
 */
export function AffiliateLink({ id, text }: { id: string; text: string }) {
  const partner = getPartner(id);
  if (!partner) return null;
  return (
    <p className="paid">
      <a
        href={partner.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
      >
        <span className="paid-tag">Paid</span>
        <span>{text}</span>
      </a>
    </p>
  );
}
