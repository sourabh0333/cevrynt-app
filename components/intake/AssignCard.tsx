"use client";

import Link from "next/link";
import { useState } from "react";
import { assignment } from "@/lib/sample-data/intake-package";

const input =
  "box-border h-[46px] rounded-tile border border-line-soft bg-tile px-3.5 text-body text-ink outline-none focus:outline-2 focus:outline-offset-1 focus:outline-teal";

/** "Sent by", "Assign to" and the Create deal button (design/Intake-Single.html). */
export function AssignCard() {
  const [sentBy, setSentBy] = useState(assignment.sentBy);
  const [assignTo, setAssignTo] = useState(assignment.assignTo);
  return (
    <article className="flex flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-br" className="text-label font-semibold text-grey-text">Sent by</label>
        <input id="s-br" value={sentBy} onChange={(e) => setSentBy(e.target.value)} className={input} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-as" className="text-label font-semibold text-grey-text">Assign to</label>
        <input id="s-as" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} className={input} />
      </div>
      <Link
        href={assignment.href}
        className="mt-1 grid h-[50px] place-items-center rounded-pill bg-teal text-[13.5px] font-semibold text-white no-underline"
      >
        {assignment.cta}
      </Link>
    </article>
  );
}
