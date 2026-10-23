import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { dealTabHref } from "@/lib/copy/deal";
import { checksCopy as t } from "@/lib/copy/deal-summary";
import type { CheckKey, CheckState, DealCheckSet, Id } from "@/lib/data/types";

/** Where each check card opens: its deal tab, or Stacking Watch. */
const checkPath: Record<CheckKey, string> = {
  cashFlow: "/cash-flow",
  positions: "/positions",
  integrity: "/integrity",
  business: "/business",
  conditions: "/conditions",
  stacking: "",
};

function Status({ status }: { status: CheckState }) {
  if (status.state === "open") {
    return (
      <span className="rounded-pill bg-card px-2 py-0.5 text-label-sm font-semibold text-amber-text">{t.open(status.count)}</span>
    );
  }
  if (status.state === "warn") {
    return (
      <span aria-label={t.warn} className="grid h-[22px] w-[22px] place-items-center rounded-full bg-amber text-label font-bold text-white">
        !
      </span>
    );
  }
  return (
    <span aria-label={t.ok} className="grid h-[22px] w-[22px] place-items-center rounded-full bg-teal">
      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

/**
 * "Every check at a glance" from design/Deal-Summary.html: six cards, one
 * per check, each linking to its tab. Clear checks are white with a teal
 * tick; the ones that need a look sit on amber. The states are the deal's
 * own checks, the same ones the tab bar shows; the conditions one is
 * worked out from the deal's conditions. No hover.
 */
export function ChecksCard({ id, checks }: { id: Id; checks: DealCheckSet }) {
  return (
    <Card as="article" aria-labelledby="h-checks" className="col-span-2 max-[980px]:col-span-1">
      <div className="flex items-center justify-between">
        <h2 id="h-checks" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="text-[11.5px] text-hint">{t.hint}</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
        {t.order.map((key) => {
          const c = checks[key];
          const warn = c.state !== "ok";
          const href = key === "stacking" ? "/stacking" : dealTabHref(id, { path: checkPath[key] });
          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col gap-1.5 rounded-tile-lg p-3.5 text-ink no-underline ${warn ? "bg-amber-bg" : "bg-tile"}`}
            >
              <span className="flex items-center justify-between">
                <b className="text-[13.5px]">{t.label[key]}</b>
                <Status status={c} />
              </span>
              <span className={`text-[11.5px] ${warn ? "text-amber-mute" : "text-hint"}`}>{c.note}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
