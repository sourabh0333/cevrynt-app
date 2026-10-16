"use client";

import { useState } from "react";
import { batchOptions } from "@/lib/sample-data/intake-bulk";

const input =
  "box-border h-[46px] rounded-tile border border-line-deep bg-card px-3.5 text-body text-ink outline-none focus:outline-2 focus:outline-offset-1 focus:outline-teal";

/** "For the whole batch": sent by, assignment and the two switches (design/Intake-Bulk.html). */
export function BulkOptions() {
  const [sentBy, setSentBy] = useState(batchOptions.sentBy);
  const [assign, setAssign] = useState(batchOptions.assign);
  const [tellBroker, setTellBroker] = useState(batchOptions.tellBroker);
  const [requestMissing, setRequestMissing] = useState(batchOptions.requestMissing);

  return (
    <article aria-labelledby="h-opt" className="flex flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <h2 id="h-opt" className="m-0 font-heading text-[19px] font-semibold">For the whole batch</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="k-br" className="text-label font-semibold text-grey-text">Sent by</label>
        <input id="k-br" value={sentBy} onChange={(e) => setSentBy(e.target.value)} className={input} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="k-as" className="text-label font-semibold text-grey-text">Assign deals</label>
        <input id="k-as" value={assign} onChange={(e) => setAssign(e.target.value)} className={input} />
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-white/65 px-3.5 py-3 text-body-sm">
        <span>Tell the broker about declines</span>
        <input type="checkbox" checked={tellBroker} onChange={(e) => setTellBroker(e.target.checked)} className="h-5 w-5 accent-teal" />
      </label>
      <label className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-white/65 px-3.5 py-3 text-body-sm">
        <span>Request missing documents automatically</span>
        <input type="checkbox" checked={requestMissing} onChange={(e) => setRequestMissing(e.target.checked)} className="h-5 w-5 accent-teal" />
      </label>
    </article>
  );
}
