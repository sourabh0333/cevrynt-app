import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { paymentCells, position, type PaymentCell } from "@/lib/sample-data/deal-positions";

const chipTone = { purple: "bg-purple-bg text-purple-text", green: "bg-mint-bg text-teal-dark" };
const cellFill: Record<PaymentCell, string> = {
  pad: "bg-transparent",
  paid: "bg-purple",
  holiday: "bg-line",
  bounced: "bg-red",
};
const num = "font-heading font-semibold tabular-nums tracking-[-0.03em]";

/**
 * The Kingsway Capital position from design/Deal-Positions.html: funder
 * header with chips and actions, six fact tiles, the estimate note, and the
 * payment history grid (one 16px cell per business day, Mon–Fri rows,
 * weeks as columns). Cells fill in left to right once. No hover.
 */
export function PositionCard() {
  const { cells, debits } = paymentCells();
  const { history } = position;
  const bounced = cells.filter((c) => c === "bounced").length;

  return (
    <Card as="article" aria-labelledby="h-pos" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="grid h-[52px] w-[52px] flex-none place-items-center rounded-[16px] bg-[linear-gradient(140deg,var(--color-purple-text),var(--color-purple))] font-heading text-[17px] font-bold text-white">
            {position.initials}
          </span>
          <div>
            <div className="flex flex-wrap gap-1.5">
              {position.chips.map((c) => (
                <span key={c.label} className={`rounded-pill px-[9px] py-[3px] text-[10.5px] font-semibold ${chipTone[c.tone]}`}>{c.label}</span>
              ))}
            </div>
            <h2 id="h-pos" className="mt-1.5 mb-0 font-heading text-[22px] font-semibold">{position.name}</h2>
            <span className="text-label text-hint">
              {position.shownAs.before}
              <span className="font-mono">{position.shownAs.code}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-[12.5px] font-semibold text-ink">
            {position.actions.payoff}
          </button>
          <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-teal px-3.5 text-[12.5px] font-semibold text-white">
            {position.actions.debits.replace("{n}", String(debits))}
          </button>
        </div>
      </div>

      {/* Three columns so the six tiles never wrap as 5 + 1. */}
      <div className="grid grid-cols-3 gap-2 max-[600px]:grid-cols-2">
        {position.facts.map((f) => (
          <span key={f.label} className={`rounded-[16px] px-3.5 py-3 ${f.warn ? "bg-amber-tint" : "bg-tile"}`}>
            <span className={`text-[11.5px] ${f.warn ? "text-amber-mute" : "text-hint"}`}>{f.label}</span>
            {f.big ? (
              <b className={`${num} block text-[20px] ${f.warn ? "text-amber-deep" : ""}`}>
                {f.value}
                {f.suffix ? <span className="text-label font-medium text-hint"> {f.suffix}</span> : null}
              </b>
            ) : (
              <b className="mt-[3px] block text-[15px]">
                {f.value}
                {f.suffix ? <span className="text-label-sm font-medium text-hint"> {f.suffix}</span> : null}
              </b>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-start gap-2.5 rounded-tile bg-tile px-3 py-2.5 text-label text-muted">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-px flex-none text-hint">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>{position.estimateNote}</span>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12.5px]">
            <b>{history.title}</b> <span className="text-hint">{history.range}</span>
          </span>
          <span className="flex gap-3 text-label-sm text-muted">
            {history.legend.map((l) => (
              <span key={l.label} className="inline-flex items-center gap-[5px]">
                <span className={`h-2.5 w-2.5 rounded-[3px] ${l.color}`} />
                {l.label}
              </span>
            ))}
          </span>
        </div>
        <div className="scrollbar-none overflow-x-auto rounded-[18px] bg-tile p-3">
          <div className="flex items-start gap-2.5">
            <div className="grid grid-rows-[repeat(5,16px)] gap-1 text-[10px] leading-4 text-hint-soft">
              {history.weekdays.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div
              role="img"
              aria-label={`${debits} payments of $285 from June to September, ${bounced ? `${bounced} bounced` : "none bounced"}`}
              className="grid grid-flow-col grid-rows-[repeat(5,16px)] auto-cols-[16px] gap-1"
            >
              {cells.map((c, i) => {
                const style: CSSProperties & { "--delay"?: string } = { "--delay": `${i * 0.012}s` };
                return <span key={i} className={`h-4 w-4 rounded-[4px] ${cellFill[c]} ${c === "pad" ? "" : "anim-pop"}`} style={style} />;
              })}
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-[11.5px] font-semibold text-teal-dark">{debits} paid · {bounced} bounced</span>
          {history.chips.map((c) => (
            <span key={c} className="rounded-pill bg-tile px-2.5 py-1 text-[11.5px]">{c}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
