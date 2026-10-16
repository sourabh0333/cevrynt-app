import type { CSSProperties } from "react";
import { debtGlance } from "@/lib/sample-data/deal-positions";

const h2 = "m-0 text-body-sm font-semibold";
const big = "font-heading text-[28px] leading-none font-semibold tabular-nums tracking-[-0.03em]";
const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });

function ShareBar({ percent, track, fill, marker, share, max, delay }: { percent: number; track: string; fill: string; marker: string; share: string; max: string; delay: number }) {
  return (
    <div>
      <div className={`relative h-2 rounded-[4px] ${track}`}>
        <div className={`anim-grow-x h-full rounded-[4px] ${fill}`} style={{ width: `${percent}%`, ...d(delay) }} />
        <span className={`absolute top-[-4px] right-0 h-4 w-0.5 rounded-[1px] ${marker}`} />
      </div>
      <div className="mt-1.5 flex justify-between text-label-sm text-muted">
        <span>{share}</span>
        <span className="text-coral-text">{max}</span>
      </div>
    </div>
  );
}

/**
 * "Debt at a glance" from design/Deal-Positions.html: three tiles in a row
 * (payments today, positions found, after our offer). The share bars grow
 * in from the left. No hover.
 */
export function GlanceRow() {
  const { today, found, after } = debtGlance;
  return (
    <section aria-label="Debt at a glance" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article
        aria-labelledby="h-now"
        className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
      >
        <div className="flex items-center justify-between">
          <h2 id="h-now" className={`${h2} text-muted`}>{today.title}</h2>
          <span className="rounded-pill bg-mint/18 px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-deep">{today.chip}</span>
        </div>
        <b className={big}>
          {today.value}
          <span className="text-body font-medium text-muted">{today.unit}</span>
        </b>
        <ShareBar percent={today.percent} track="bg-teal/7" fill="bg-mint" marker="bg-red-light" share={today.share} max={today.max} delay={0.1} />
      </article>

      <article aria-labelledby="h-cnt" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
        <div className="flex items-center justify-between">
          <h2 id="h-cnt" className={`${h2} text-muted`}>{found.title}</h2>
          <span className="rounded-pill bg-mint-bg px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-dark">{found.chip}</span>
        </div>
        <div className="flex gap-2.5">
          {found.counts.map((c) => (
            <span key={c.label} className="flex-1 rounded-[16px] bg-tile px-3 py-2.5">
              <b className={`${big} block`}>{c.value}</b>
              <span className="text-[11.5px] text-hint">{c.label}</span>
            </span>
          ))}
        </div>
        <span className="text-label text-muted">{found.note}</span>
      </article>

      <article aria-labelledby="h-after" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
        <div className="flex items-center justify-between">
          <h2 id="h-after" className={`${h2} text-grey-text`}>{after.title}</h2>
          <span className="rounded-pill bg-card px-[9px] py-[3px] text-[10.5px] font-semibold text-grey-text">{after.chip}</span>
        </div>
        <b className={big}>
          {after.value}
          <span className="text-body font-medium text-muted">{after.unit}</span>
        </b>
        <ShareBar percent={after.percent} track="bg-white/70" fill="bg-ink" marker="bg-red" share={after.share} max={after.max} delay={0.2} />
      </article>
    </section>
  );
}
