import { contact, contactWorks } from "@/lib/site";

/**
 * The address, or an honest account of why there isn't one yet.
 *
 * One component rather than four inline spans, because four copies is how the
 * site ended up printing a bouncing address on four pages at once: the string
 * was assembled from the host in each of them, so there was no single place
 * where anybody could have noticed that no mailbox existed behind it.
 *
 * When the inbox is unconfirmed this says so plainly. That reads worse than an
 * address and is worth far more: a reader who writes a correction to a dead
 * address believes they have reported it, stops thinking about it, and the
 * site keeps the error. Telling them the inbox is not ready costs the site
 * some credibility in the moment and costs the reader nothing.
 */
export function Contact({ what = "A correction" }: { what?: string }) {
  if (contactWorks) {
    return <span className="ju">{contact.address}</span>;
  }
  return (
    <span className="dim">
      — and there is no inbox for it yet. {what} would be read, so the address
      is being set up rather than printed here before it works. Until it does,
      nothing sent to this domain arrives anywhere.
    </span>
  );
}

/**
 * A mailto, or nothing.
 *
 * Returns null rather than a dead link: a button that opens a mail client
 * addressed to a bouncing mailbox is worse than an absent button, because the
 * reader does the work and never learns it went nowhere.
 */
export function MailtoButton({
  subject,
  body,
  children,
  className = "btn px-5 py-3",
}: {
  subject: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!contactWorks) return null;
  const href = `mailto:${contact.address}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
