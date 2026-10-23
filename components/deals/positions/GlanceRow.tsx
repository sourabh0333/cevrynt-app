import type { CSSProperties } from "react";
import { glanceCopy as t } from "@/lib/copy/deal-positions";
import type { DealTabsData } from "@/lib/data/views/deal-tabs";
import { debtToday, ofLimit } from "@/lib/deal-figures";
import { moneyK } from "@/lib/format";
import { computeOffer } from "@/lib/offer-math";

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
 * (payments today, positions found, after our offer). Today's share is the
 * latest statement month's debt payments; after our offer comes from the
 * shared offer math. Both bars fill against the policy's debt limit and
 * grow in from the left. No hover.
 */
export function GlanceRow({ data }: { data: DealTabsData }) {
  const { positions: p, policy } = data;
  const today = debtToday(data.cashFlow);
  const offer = computeOffer(data.recommended, data.figures, data.offerPolicy);
  const mca = p.positions.filter((x) => x.kind === "mca").length;
  const undisclosed = p.positions.filter((x) => !x.disclosed).length;

  return (
    <section aria-label="Debt at a glance" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article
        aria-labelledby="h-now"
        className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
      >
        <div className="flex items-center justify-between">
          <h2 id="h-now" className={`${h2} text-muted`}>{t.today.title}</h2>
          <span className="rounded-pill bg-mint/18 px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-deep">{t.today.chip(today.share)}</span>
        </div>
        <b className={big}>
          {moneyK(today.perMonth)}
          <span className="text-body font-medium text-muted">{t.today.unit}</span>
        </b>
        <ShareBar
          percent={ofLimit(today.share, policy.maxDebtShare)}
          track="bg-teal/7"
          fill="bg-mint"
          marker="bg-red-light"
          share={t.today.share(today.share)}
          max={t.today.max(policy.maxDebtShare)}
          delay={0.1}
        />
      </article>

      <article aria-labelledby="h-cnt" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
        <div className="flex items-center justify-between">
          <h2 id="h-cnt" className={`${h2} text-muted`}>{t.found.title}</h2>
          <span className="rounded-pill bg-mint-bg px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-dark">{t.found.chip(undisclosed)}</span>
        </div>
        <div className="flex gap-2.5">
          {[
            { value: mca, label: t.found.mca },
            { value: p.otherLoans, label: t.found.loans },
          ].map((c) => (
            <span key={c.label} className="flex-1 rounded-[16px] bg-tile px-3 py-2.5">
              <b className={`${big} block`}>{c.value}</b>
              <span className="text-[11.5px] text-hint">{c.label}</span>
            </span>
          ))}
        </div>
        <span className="text-label text-muted">{t.found.note(p.statedAdvances, mca)}</span>
      </article>

      <article aria-labelledby="h-after" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
        <div className="flex items-center justify-between">
          <h2 id="h-after" className={`${h2} text-grey-text`}>{t.after.title}</h2>
          <span className="rounded-pill bg-card px-[9px] py-[3px] text-[10.5px] font-semibold text-grey-text">{t.after.chip(p.positions.length + 1)}</span>
        </div>
        <b className={big}>
          {moneyK(data.figures.existingMonthly + offer.perMonth)}
          <span className="text-body font-medium text-muted">{t.after.unit}</span>
        </b>
        <ShareBar
          percent={ofLimit(offer.share, policy.maxDebtShare)}
          track="bg-white/70"
          fill="bg-ink"
          marker="bg-red"
          share={t.after.share(offer.share)}
          max={t.after.max(policy.maxDebtShare)}
          delay={0.2}
        />
      </article>
    </section>
  );
}
