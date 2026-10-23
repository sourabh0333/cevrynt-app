"use client";

import { PublicMessage } from "@/components/public/PublicMessage";
import { errorCopy } from "@/lib/copy/states";

/** A public page (Merchant Link, application form) failed to load: branded as the funder. */
export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const c = errorCopy.public;
  return (
    <PublicMessage title={c.title} text={c.text}>
      <button type="button" onClick={reset} className="h-11 cursor-pointer rounded-pill border-0 bg-teal px-5 text-body-sm font-semibold text-white">
        {c.retry}
      </button>
    </PublicMessage>
  );
}
