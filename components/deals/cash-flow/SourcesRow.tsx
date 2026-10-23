import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { busiestDaysCopy, cardSalesCopy, sourcesCopy } from "@/lib/copy/deal-cash-flow";
import type { DealCashFlow } from "@/lib/data/types";
import { moneyK, monthName } from "@/lib/format";

const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });
/** Source colors in bar order, from the design: darkest first, "Other" last. */
const sourceBg = ["bg-teal-ink", "bg-teal", "bg-teal-soft", "bg-amber", "bg-mint", "bg-line-dash-soft"];
const title = "m-0 font-heading text-[20px] font-semibold";

/**
 * "Where money comes from" from design/Deal-CashFlow.html: the deal's
 * revenue sources as a bar (grows in), the legend and the concentration
 * check on its largest single customer.
 */
export function SourcesCard({ cashFlow: cf }: { cashFlow: DealCashFlow }) {
  const t = sourcesCopy;
  const largest = Math.max(0, ...cf.sources.filter((s) => s.customer).map((s) => s.share));
  return (
    <Card as="article" aria-labelledby="h-src">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-src" className={title}>{t.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-mint-bg px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-dark">
          {largest < 20 ? t.spread : t.concentrated}
        </span>
      </div>
      <div
        role="img"
        aria-label={cf.sources.map((s) => `${s.label} ${s.share}%`).join(", ")}
        className="anim-grow-x flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]"
        style={d(0.1)}
      >
        {cf.sources.map((s, i) => (
          <span key={s.label} className={sourceBg[i % sourceBg.length]} style={{ flex: s.share }} />
        ))}
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {cf.sources.map((s, i) => (
          <span key={s.label} className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${sourceBg[i % sourceBg.length]}`} />
            <span className="truncate">{s.label}</span>
            <b>{s.share}%</b>
          </span>
        ))}
      </div>
      <span className="mt-auto text-label text-muted">{t.note(largest)}</span>
    </Card>
  );
}

/** "Card sales": monthly card volume as bars on the sand card; the latest month is teal. */
export function CardSalesCard({ cashFlow: cf }: { cashFlow: DealCashFlow }) {
  const t = cardSalesCopy;
  const months = cf.cardSales.months;
  const top = Math.max(...months.map((m) => m.amount));
  const avg = months.reduce((s, m) => s + m.amount, 0) / months.length;
  return (
    <article aria-labelledby="h-card" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-card" className={title}>{t.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-card px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-deep">
          {cf.cardSales.splitPossible ? t.split : t.noSplit}
        </span>
      </div>
      <div>
        <b className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
          {moneyK(avg)}
          <span className="text-body-sm font-medium text-muted">{t.unit}</span>
        </b>
        <div className="mt-1 text-[11.5px] text-muted">{t.hint(cf.cardSales.processor, cf.cardSales.perDay)}</div>
      </div>
      <svg role="img" aria-label={t.aria(months)} viewBox="0 0 260 110" className="h-[110px] w-full">
        <g className="fill-ink/12">
          {months.map((m, i) => (
            <rect key={m.month} x={10 + i * 66} y="10" width="44" height="80" rx="12" />
          ))}
        </g>
        {months.map((m, i) => {
          const height = Math.round((m.amount / top) * 80);
          return (
            <rect
              key={m.month}
              className={`anim-grow-y ${i === months.length - 1 ? "fill-teal" : "fill-ink"}`}
              style={d(0.1 + i * 0.1)}
              x={10 + i * 66}
              y={90 - height}
              width="44"
              height={height}
              rx="12"
            />
          );
        })}
        <g fontSize="11" fontWeight="600" className="fill-grey-text font-sans" textAnchor="middle">
          {months.map((m, i) => (
            <text key={m.month} x={32 + i * 66} y="106">{monthName(m.month)}</text>
          ))}
        </g>
      </svg>
      <span className="mt-auto text-label text-grey-text">{t.note}</span>
    </article>
  );
}

const dayFill = { quiet: "bg-teal/7", soft: "bg-mint/55", peak: "bg-mint" };
/** The busiest day is the peak; days at 70% of it or more read as busy. */
const toneOf = (share: number) => (share >= 1 ? "peak" : share >= 0.7 ? "soft" : "quiet");

/** "Busiest days": average deposits by weekday on the light mint card. Bars grow up. */
export function BusiestDaysCard({ cashFlow: cf }: { cashFlow: DealCashFlow }) {
  const t = busiestDaysCopy;
  const busiest = cf.weekdays.indexOf(Math.max(...cf.weekdays));
  return (
    <article
      aria-labelledby="h-days"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div>
        <h2 id="h-days" className={title}>{t.title}</h2>
        <div className="mt-[3px] text-label text-muted">{t.subtitle}</div>
      </div>
      <div role="img" aria-label={t.aria(busiest)} className="grid h-[120px] grid-cols-7 items-end gap-1.5">
        {cf.weekdays.map((share, i) => (
          <span key={t.days[i]} className="flex h-full flex-col justify-end">
            <span className={`anim-grow-y block rounded-[8px] ${dayFill[toneOf(share)]}`} style={{ height: `${Math.round(share * 100)}%`, ...d(0.1 + i * 0.07) }} />
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-label-sm text-muted">
        {cf.weekdays.map((share, i) => (
          <span key={t.days[i]} className={toneOf(share) === "peak" ? "font-semibold text-ink" : ""}>{t.days[i]}</span>
        ))}
      </div>
      <span className="mt-auto text-label text-muted">{t.note(cf.weekendShare)}</span>
    </article>
  );
}
