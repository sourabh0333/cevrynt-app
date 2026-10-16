import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { busiestDays, cardSales, moneySources, type SourceColor } from "@/lib/sample-data/deal-cash-flow";

const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });
const sourceBg: Record<SourceColor, string> = {
  "teal-ink": "bg-teal-ink",
  teal: "bg-teal",
  "teal-soft": "bg-teal-soft",
  amber: "bg-amber",
  mint: "bg-mint",
  "line-dash-soft": "bg-line-dash-soft",
};
const title = "m-0 font-heading text-[20px] font-semibold";

/**
 * "Where money comes from" from design/Deal-CashFlow.html: the six-part
 * revenue bar (grows in), the legend and the concentration check.
 */
export function SourcesCard() {
  return (
    <Card as="article" aria-labelledby="h-src">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-src" className={title}>{moneySources.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-mint-bg px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-dark">{moneySources.chip}</span>
      </div>
      <div
        role="img"
        aria-label={moneySources.sources.map((s) => `${s.label} ${s.share}%`).join(", ")}
        className="anim-grow-x flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]"
        style={d(0.1)}
      >
        {moneySources.sources.map((s) => (
          <span key={s.label} className={sourceBg[s.color]} style={{ flex: s.share }} />
        ))}
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {moneySources.sources.map((s) => (
          <span key={s.label} className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${sourceBg[s.color]}`} />
            <span className="truncate">{s.label}</span>
            <b>{s.share}%</b>
          </span>
        ))}
      </div>
      <span className="mt-auto text-label text-muted">{moneySources.note}</span>
    </Card>
  );
}

/** "Card sales": monthly card volume as four bars on the sand card; September is teal. */
export function CardSalesCard() {
  return (
    <article aria-labelledby="h-card" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-card" className={title}>{cardSales.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-card px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-deep">{cardSales.chip}</span>
      </div>
      <div>
        <b className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
          {cardSales.value}
          <span className="text-body-sm font-medium text-muted">{cardSales.unit}</span>
        </b>
        <div className="mt-1 text-[11.5px] text-muted">{cardSales.hint}</div>
      </div>
      <svg role="img" aria-label={cardSales.aria} viewBox="0 0 260 110" className="h-[110px] w-full">
        <g className="fill-ink/12">
          {cardSales.months.map((m, i) => (
            <rect key={m.label} x={10 + i * 66} y="10" width="44" height="80" rx="12" />
          ))}
        </g>
        {cardSales.months.map((m, i) => (
          <rect
            key={m.label}
            className={`anim-grow-y ${i === cardSales.months.length - 1 ? "fill-teal" : "fill-ink"}`}
            style={d(0.1 + i * 0.1)}
            x={10 + i * 66}
            y={90 - m.height}
            width="44"
            height={m.height}
            rx="12"
          />
        ))}
        <g fontSize="11" fontWeight="600" className="fill-grey-text font-sans" textAnchor="middle">
          {cardSales.months.map((m, i) => (
            <text key={m.label} x={32 + i * 66} y="106">{m.label}</text>
          ))}
        </g>
      </svg>
      <span className="mt-auto text-label text-grey-text">{cardSales.note}</span>
    </article>
  );
}

const dayFill = { quiet: "bg-teal/7", soft: "bg-mint/55", peak: "bg-mint" };

/** "Busiest days": average deposits by weekday on the light mint card. Bars grow up. */
export function BusiestDaysCard() {
  return (
    <article
      aria-labelledby="h-days"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div>
        <h2 id="h-days" className={title}>{busiestDays.title}</h2>
        <div className="mt-[3px] text-label text-muted">{busiestDays.subtitle}</div>
      </div>
      <div role="img" aria-label="Average deposits by weekday, Saturday the busiest" className="grid h-[120px] grid-cols-7 items-end gap-1.5">
        {busiestDays.days.map((day, i) => (
          <span key={day.label} className="flex h-full flex-col justify-end">
            <span className={`anim-grow-y block rounded-[8px] ${dayFill[day.tone]}`} style={{ height: `${day.height}%`, ...d(0.1 + i * 0.07) }} />
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-label-sm text-muted">
        {busiestDays.days.map((day) => (
          <span key={day.label} className={day.tone === "peak" ? "font-semibold text-ink" : ""}>{day.label}</span>
        ))}
      </div>
      <span className="mt-auto text-label text-muted">{busiestDays.note}</span>
    </article>
  );
}
