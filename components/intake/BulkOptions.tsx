"use client";

import { useState } from "react";
import { bulkCopy } from "@/lib/copy/intake";
import type { BulkIntake } from "@/lib/data/types";

const t = bulkCopy.options;

const input =
  "box-border h-[46px] rounded-tile border border-line-deep bg-card px-3.5 text-body text-ink outline-none focus:outline-2 focus:outline-offset-1 focus:outline-teal";

/** "For the whole batch": sent by, assignment and the two switches (design/Intake-Bulk.html). */
export function BulkOptions({ options }: { options: BulkIntake["options"] }) {
  const [sentBy, setSentBy] = useState(options.sentBy);
  const [assign, setAssign] = useState(t.assignValue[options.assign]);
  const [tellBroker, setTellBroker] = useState(options.tellBroker);
  const [requestMissing, setRequestMissing] = useState(options.requestMissing);

  return (
    <article aria-labelledby="h-opt" className="flex flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <h2 id="h-opt" className="m-0 font-heading text-[19px] font-semibold">{t.title}</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="k-br" className="text-label font-semibold text-grey-text">{t.sentBy}</label>
        <input id="k-br" value={sentBy} onChange={(e) => setSentBy(e.target.value)} className={input} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="k-as" className="text-label font-semibold text-grey-text">{t.assign}</label>
        <input id="k-as" value={assign} onChange={(e) => setAssign(e.target.value)} className={input} />
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-white/65 px-3.5 py-3 text-body-sm">
        <span>{t.tellBroker}</span>
        <input type="checkbox" checked={tellBroker} onChange={(e) => setTellBroker(e.target.checked)} className="h-5 w-5 accent-teal" />
      </label>
      <label className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-white/65 px-3.5 py-3 text-body-sm">
        <span>{t.requestMissing}</span>
        <input type="checkbox" checked={requestMissing} onChange={(e) => setRequestMissing(e.target.checked)} className="h-5 w-5 accent-teal" />
      </label>
    </article>
  );
}
