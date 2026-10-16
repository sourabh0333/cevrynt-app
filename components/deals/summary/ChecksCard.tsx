import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { checks, type CheckStatus } from "@/lib/sample-data/deal";

function Status({ status }: { status: CheckStatus }) {
  if (status.kind === "count") {
    return (
      <span className="rounded-pill bg-card px-2 py-0.5 text-label-sm font-semibold text-amber-text">{status.label}</span>
    );
  }
  if (status.kind === "warn") {
    return (
      <span aria-label="Needs a look" className="grid h-[22px] w-[22px] place-items-center rounded-full bg-amber text-label font-bold text-white">
        !
      </span>
    );
  }
  return (
    <span aria-label="Clear" className="grid h-[22px] w-[22px] place-items-center rounded-full bg-teal">
      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

/**
 * "Every check at a glance" from design/Deal-Summary.html: six cards, one
 * per check, each linking to its tab. Clear checks are white with a teal
 * tick; the ones that need a look sit on amber. No hover.
 */
export function ChecksCard() {
  return (
    <Card as="article" aria-labelledby="h-checks" className="col-span-2 max-[980px]:col-span-1">
      <div className="flex items-center justify-between">
        <h2 id="h-checks" className="m-0 font-heading text-[20px] font-semibold">{checks.title}</h2>
        <span className="text-[11.5px] text-hint">{checks.hint}</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
        {checks.cards.map((c) => {
          const warn = c.status.kind !== "ok";
          return (
            <Link
              key={c.label}
              href={c.href}
              className={`flex flex-col gap-1.5 rounded-tile-lg p-3.5 text-ink no-underline ${warn ? "bg-amber-bg" : "bg-tile"}`}
            >
              <span className="flex items-center justify-between">
                <b className="text-[13.5px]">{c.label}</b>
                <Status status={c.status} />
              </span>
              <span className={`text-[11.5px] ${warn ? "text-amber-mute" : "text-hint"}`}>{c.note}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
