import { PublicMessage } from "@/components/public/PublicMessage";
import { notFoundCopy } from "@/lib/copy/states";
import { funder, helpCard } from "@/lib/sample-data/merchant-link";

/** A Merchant Link token that doesn't exist or has expired: branded as the funder. */
export default function LinkNotFound() {
  const c = notFoundCopy.link;
  return (
    <PublicMessage title={c.title} text={c.text(funder.name)}>
      <a href={`tel:${helpCard.phone.replace(/[^\d]/g, "")}`} className="inline-flex h-11 items-center rounded-pill bg-teal px-5 text-body-sm font-semibold text-white no-underline">
        {c.call} · {helpCard.phone}
      </a>
    </PublicMessage>
  );
}
