"use client";

import { useFunder } from "@/components/public/FunderContext";
import { PublicMessage } from "@/components/public/PublicMessage";
import { telHref } from "@/lib/copy/public";
import { notFoundCopy } from "@/lib/copy/states";

/** A Merchant Link token that doesn't exist or has expired: branded as the funder (the workspace record). */
export default function LinkNotFound() {
  const c = notFoundCopy.link;
  const funder = useFunder();
  return (
    <PublicMessage title={c.title} text={c.text(funder?.name ?? "")}>
      {funder ? (
        <a href={telHref(funder.supportPhone)} className="inline-flex h-11 items-center rounded-pill bg-teal px-5 text-body-sm font-semibold text-white no-underline">
          {c.call} · {funder.supportPhone}
        </a>
      ) : null}
    </PublicMessage>
  );
}
