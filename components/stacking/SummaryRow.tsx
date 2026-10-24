import { Card } from "@/components/ui/Card";
import { signals, stackingSections, summaryCopy as summary } from "@/lib/copy/stacking";
import type { StackingSummary } from "@/lib/data/types";

/** Row 1 of design/Stacking.html: the "kept safe" hero with its four tiles, and the six signals we watch. */
export function SummaryRow({ fresh, open, summary: s }: { fresh: number; open: number; summary: StackingSummary }) {
  return (
    <section aria-label={stackingSections.glance} className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article
        aria-labelledby="h-prot"
        className="col-span-2 box-border flex min-w-0 flex-wrap items-center gap-[22px] rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink max-[980px]:col-span-1"
      >
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill bg-tile px-[11px] py-[5px] text-[11.5px] font-semibold text-teal-deep">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {summary.chip}
          </span>
          <h2 id="h-prot" className="m-0 font-heading text-[24px] leading-[1.15] font-semibold">{summary.title(s)}</h2>
          <span className="text-body-sm text-grey-text">{summary.text(s)}</span>
        </div>
        <div className="grid flex-[2_1_360px] grid-cols-4 gap-2 max-[640px]:grid-cols-2">
          {summary.tiles(fresh, open, s).map((t) => (
            <span key={t.label} className="rounded-[18px] bg-tile p-3.5">
              <b className="block font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{t.value}</b>
              <span className="text-[11.5px] text-muted">{t.label}</span>
            </span>
          ))}
        </div>
      </article>

      <Card as="article" aria-labelledby="h-src" className="gap-2.5">
        <div className="flex items-center justify-between">
          <h2 id="h-src" className="m-0 font-heading text-[18px] font-semibold">{signals.title}</h2>
          <span className="rounded-pill bg-mint-bg px-[9px] py-[3px] text-label-sm font-semibold text-teal-dark">{signals.chip}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-label">
          {signals.items.map((s) => (
            <span key={s} className="rounded-[12px] bg-tile px-2.5 py-[9px]">
              {s}
            </span>
          ))}
        </div>
      </Card>
    </section>
  );
}
