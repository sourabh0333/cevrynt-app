"use client";

import { useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { balanceTrendLabel, monthVsStated, revenueChartCopy as t } from "@/lib/copy/deal-summary";
import type { DealCashFlow, DealSummary } from "@/lib/data/types";
import { daysBetween, moneyK, monthName } from "@/lib/format";
import { revenueTotals } from "@/lib/deal-figures";

type ChartView = "rev" | "bal";

const cap = "text-[9.5px] font-semibold tracking-[0.08em] uppercase";
const num = "block font-heading font-semibold tabular-nums tracking-[-0.03em]";
const legendRow = "flex flex-wrap gap-4 px-2 pt-1.5 pb-2 text-[11.5px] text-muted";
const legendItem = "inline-flex items-center gap-1.5";
const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });

// Chart box: 560×250, plot from x 20–520, baseline y 200, top y 20 (180 tall).
const PLOT_TOP = 20;
const BASE = 200;
/** y axis labels, in thousands. */
const REV_AXIS = [60, 40, 20, 0];
const BAL_AXIS = [20, 15, 10, 5, 0];
/** The four month columns and the balance chart's month labels and ticks, from the design. */
const BAR_X = [80, 210, 340, 470];
const BAL_MONTH_X = [81, 206, 333, 459];
const BAL_TICKS = [144, 269, 397];
/** The trend line is the design's drawn curve over Harbor Street's four months. */
const TREND = "M80 58.7 C140 57 150 55 210 54 S300 46 340 45.8 S430 45 470 45";

type Props = { summary: DealSummary; cashFlow: DealCashFlow };

/**
 * "Revenue & balance" from design/Deal-Summary.html and its prototype: a
 * stats column and a chart, switched between Monthly revenue (bars against
 * the dashed stated amount, with a trend line) and Daily balance (an area
 * line with the average and the lowest day). The figures come from the
 * deal's statements. Bars grow, lines draw, dots pop, once each time a
 * view opens. No hover.
 */
export function RevenueChart({ summary, cashFlow }: Props) {
  const [view, setView] = useState<ChartView>("rev");
  const months = cashFlow.months.map((m) => m.month);

  return (
    <Card as="article" aria-labelledby="h-trend" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="h-trend" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle(months)}</div>
        </div>
        <SegmentedSwitch
          options={t.views}
          value={view}
          onChange={(v) => setView(v as ChartView)}
          label={t.viewsLabel}
          className="[&>button]:h-[34px] [&>button]:px-3.5 [&>button]:text-label"
        />
      </div>

      <div className="flex flex-wrap items-stretch gap-[18px]">
        <div className="flex max-w-[220px] flex-[1_1_170px] flex-col gap-2.5">
          {view === "rev" ? <RevenueStats summary={summary} cashFlow={cashFlow} /> : <BalanceStats summary={summary} cashFlow={cashFlow} />}
        </div>
        <div className="min-w-0 flex-[999_1_420px] rounded-[22px] bg-tile px-3 pt-3.5 pb-1.5">
          {view === "rev" ? <RevenueBars key="rev" summary={summary} cashFlow={cashFlow} /> : <BalanceLine key="bal" cashFlow={cashFlow} />}
        </div>
      </div>
    </Card>
  );
}

function RevenueStats({ summary, cashFlow }: Props) {
  const revenue = revenueTotals(cashFlow).monthly;
  const related = cashFlow.setAside.find((s) => s.kind === "related");
  return (
    <>
      <div className="rounded-tile-lg bg-teal p-3.5 text-white">
        <span className={`${cap} text-cap-on-teal`}>{t.rev.avg.cap}</span>
        <b className={`${num} mt-1 text-[28px] leading-[1.1]`}>{moneyK(revenue)}</b>
        <span className="mt-2 inline-flex items-center gap-[5px] rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-mint">
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
          {t.rev.avg.chip(summary.revenueGrowth)}
        </span>
      </div>
      <StatTile cap={t.rev.stated.cap} value={moneyK(summary.statedRevenue)} hint={t.rev.stated.hint(revenue, summary.statedRevenue)} />
      {related ? <StatTile cap={t.rev.leftOut.cap} value={moneyK(related.amount)} hint={related.at ? t.rev.leftOut.hint(related.at) : ""} /> : null}
    </>
  );
}

function BalanceStats({ summary, cashFlow }: Props) {
  const below = cashFlow.months.reduce((s, m) => s + m.daysBelowZero, 0);
  const nsfs = cashFlow.months.reduce((s, m) => s + m.nsfs, 0);
  const low = cashFlow.lowestBalance;
  return (
    <>
      <div className="rounded-tile-lg bg-teal p-3.5 text-white">
        <span className={`${cap} text-cap-on-teal`}>{t.bal.avg.cap}</span>
        <b className={`${num} mt-1 text-[28px] leading-[1.1]`}>{moneyK(cashFlow.avgDailyBalance)}</b>
        <span className="mt-2 inline-flex rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-mint">{balanceTrendLabel(summary.balanceTrend)}</span>
      </div>
      <StatTile cap={t.bal.low.cap} value={moneyK(low.amount)} hint={t.bal.low.hint(low.at, low.after)} warn />
      <StatTile cap={t.bal.below.cap} value={String(below)} hint={t.bal.below.hint(cashFlow.months.length, nsfs)} />
    </>
  );
}

function StatTile({ cap: label, value, hint, warn = false }: { cap: string; value: string; hint: string; warn?: boolean }) {
  return (
    <div className={`rounded-[18px] px-3.5 py-3 ${warn ? "bg-amber-bg" : "bg-tile"}`}>
      <span className={`${cap} ${warn ? "text-amber-mute" : "text-hint"}`}>{label}</span>
      <b className={`${num} text-[18px]`}>{value}</b>
      <span className={`text-[11.5px] ${warn ? "text-amber-mute" : "text-hint"}`}>{hint}</span>
    </div>
  );
}

/** Monthly true revenue as bars inside dashed "stated" outlines, with a trend line. */
function RevenueBars({ summary, cashFlow }: Props) {
  const stated = summary.statedRevenue / 1000;
  const months = cashFlow.months.map((m) => ({ label: monthName(m.month), value: m.trueRevenue / 1000, text: moneyK(m.trueRevenue) }));
  // Scale: the stated amount fills the dashed outline (y 44.6 in the design).
  const unit = 155.4 / stated;
  const y = (v: number) => BASE - v * unit;
  const last = months.length - 1;

  return (
    <>
      <svg role="img" aria-label={t.rev.aria(summary.statedRevenue, cashFlow.months)} viewBox="0 0 560 250" className="block h-[250px] w-full">
        <defs>
          <linearGradient id="rbar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="[stop-color:var(--color-teal-bright)]" />
            <stop offset="1" className="[stop-color:var(--color-teal-ink)]" />
          </linearGradient>
          <linearGradient id="rbar2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="[stop-color:var(--color-mint)]" />
            <stop offset="1" className="[stop-color:var(--color-teal)]" />
          </linearGradient>
        </defs>
        <g className="stroke-grid-line" strokeWidth="1" strokeDasharray="2 5">
          {REV_AXIS.slice(0, -1).map((a) => (
            <line key={a} x1="20" y1={y(a).toFixed(1)} x2="520" y2={y(a).toFixed(1)} />
          ))}
        </g>
        <line x1="20" y1={BASE} x2="520" y2={BASE} className="stroke-line-dash-soft" strokeWidth="1" />
        <g fontSize="10.5" className="fill-hint-soft font-sans" textAnchor="start">
          {REV_AXIS.map((a) => (
            <text key={a} x="526" y={(y(a) + 4).toFixed(1)}>{a ? `$${a}K` : "$0"}</text>
          ))}
        </g>
        <g fill="none" className="stroke-stone-dash" strokeWidth="1.5" strokeDasharray="4 4">
          {BAR_X.map((x) => (
            <rect key={x} x={x - 28} y={y(stated).toFixed(1)} width="56" height={(stated * unit).toFixed(1)} rx="16" />
          ))}
        </g>
        {months.map((m, i) => (
          <rect
            key={m.label}
            className="anim-grow-y"
            style={d(i * 0.1)}
            x={BAR_X[i] - 22}
            y={y(m.value).toFixed(1)}
            width="44"
            height={(m.value * unit).toFixed(1)}
            rx="14"
            fill={i === last ? "url(#rbar2)" : "url(#rbar)"}
          />
        ))}
        <path d={TREND} pathLength={1} fill="none" className="anim-draw stroke-amber" style={d(0.4)} strokeWidth="2" strokeLinecap="round" />
        <g className="fill-white stroke-amber" strokeWidth="2.5">
          {months.map((m, i) => (
            <circle key={m.label} className="anim-pop-svg" style={d(0.9 + i * 0.15)} cx={BAR_X[i]} cy={y(m.value).toFixed(1)} r={i === last ? 5.5 : 4.5} />
          ))}
        </g>
        <g className="fill-ink font-heading" fontWeight="600" fontSize="15" textAnchor="middle">
          {months.slice(0, last).map((m, i) => (
            <text key={m.label} x={BAR_X[i]} y="24">{m.text}</text>
          ))}
        </g>
        <rect x={BAR_X[last] - 38} y="7" width="76" height="24" rx="12" className="fill-ink" />
        <text x={BAR_X[last]} y="24" textAnchor="middle" className="fill-white font-heading" fontWeight="600" fontSize="14">
          {months[last].text}
        </text>
        <g fontSize="12" fontWeight="600" className="fill-ink font-sans" textAnchor="middle">
          {months.map((m, i) => (
            <text key={m.label} x={BAR_X[i]} y="222">{m.label}</text>
          ))}
        </g>
        <g fontSize="10.5" fontWeight="600" className="font-sans" textAnchor="middle">
          {months.map((m, i) => (
            <text key={m.label} x={BAR_X[i]} y="240" className={i === last ? "fill-teal-deep" : "fill-amber-deep"}>
              {monthVsStated(m.value, stated, i === 0)}
            </text>
          ))}
        </g>
      </svg>
      <div className={legendRow}>
        <span className={legendItem}><span className="h-3 w-3 rounded-[4px] bg-teal" />{t.rev.legend.bars}</span>
        <span className={legendItem}><span className="box-border h-3 w-3 rounded-[4px] border-[1.5px] border-dashed border-stone-dash" />{t.rev.legend.stated(summary.statedRevenue)}</span>
        <span className={legendItem}><span className="h-0.5 w-3.5 bg-amber" />{t.rev.legend.trend}</span>
      </div>
    </>
  );
}

/** The end-of-day balance line: the series scaled $0–$20K onto y 200–20, plus the average and the lowest day. */
function balanceSeries(cf: DealCashFlow) {
  const vals = cf.dailyBalances;
  const days = vals.length, x0 = 20, x1 = 520, yTop = PLOT_TOP, yBot = BASE, maxV = BAL_AXIS[0] * 1000;
  const X = (i: number) => x0 + ((x1 - x0) * i) / (days - 1);
  const Y = (v: number) => yBot - ((yBot - yTop) * v) / maxV;
  const pts = vals.map((v, i) => `${X(i).toFixed(1)} ${Y(v).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  const area = `${line} L${X(days - 1).toFixed(1)} ${yBot} L${x0} ${yBot} Z`;
  const lowDay = daysBetween(`${cf.months[0].month}-01T12:00:00Z`, cf.lowestBalance.at);
  return { line, area, avgY: Y(cf.avgDailyBalance), min: { x: X(lowDay), y: Y(cf.lowestBalance.amount) } };
}

/** End-of-day balance as an area line, with the average and the lowest day marked. */
function BalanceLine({ cashFlow }: { cashFlow: DealCashFlow }) {
  const s = balanceSeries(cashFlow);
  const y = (k: number) => BASE - ((BASE - PLOT_TOP) * k) / BAL_AXIS[0];
  const avgY = s.avgY.toFixed(1);
  const ms = cashFlow.months;
  const low = cashFlow.lowestBalance;
  const below = ms.reduce((n, m) => n + m.daysBelowZero, 0);

  return (
    <>
      <svg
        role="img"
        aria-label={t.bal.aria(ms[0].month, ms[ms.length - 1].month, cashFlow.avgDailyBalance, low.amount, low.at, below)}
        viewBox="0 0 560 250"
        className="block h-[250px] w-full"
      >
        <defs>
          <linearGradient id="barea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="[stop-color:var(--color-teal)]" stopOpacity=".32" />
            <stop offset="1" className="[stop-color:var(--color-teal)]" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="stroke-grid-line" strokeWidth="1" strokeDasharray="2 5">
          {BAL_AXIS.slice(0, -1).map((a) => (
            <line key={a} x1="20" y1={y(a)} x2="520" y2={y(a)} />
          ))}
        </g>
        <line x1="20" y1={BASE} x2="520" y2={BASE} className="stroke-line-dash-soft" strokeWidth="1" />
        <g fontSize="10.5" className="fill-hint-soft font-sans">
          {BAL_AXIS.map((a) => (
            <text key={a} x="526" y={y(a) + 4}>{a ? `$${a}K` : "$0"}</text>
          ))}
        </g>
        <path d={s.area} fill="url(#barea)" className="anim-fade" style={d(-0.3)} />
        <path d={s.line} pathLength={1} fill="none" className="anim-draw stroke-teal" style={d(-0.2)} strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="20" y1={avgY} x2="520" y2={avgY} className="anim-fade stroke-ink" style={d(0)} strokeWidth="1.2" strokeDasharray="6 5" />
        <g className="anim-fade" style={d(0)}>
          <rect x="24" y={(s.avgY - 10).toFixed(1)} width="78" height="20" rx="10" className="fill-ink" />
          <text x="63" y={(s.avgY + 4).toFixed(1)} textAnchor="middle" fontSize="10.5" fontWeight="600" className="fill-white font-sans">{t.bal.avgText(cashFlow.avgDailyBalance)}</text>
        </g>
        <circle cx={s.min.x.toFixed(1)} cy={s.min.y.toFixed(1)} r="6" className="anim-pop-svg fill-white stroke-amber" style={d(0.9)} strokeWidth="3" />
        <g className="anim-fade" style={d(0.3)}>
          <rect x={(s.min.x - 52).toFixed(1)} y={(s.min.y - 40).toFixed(1)} width="104" height="22" rx="11" className="fill-amber" />
          <text x={s.min.x.toFixed(1)} y={(s.min.y - 25).toFixed(1)} textAnchor="middle" fontSize="10.5" fontWeight="600" className="fill-white font-sans">{t.bal.lowText(low.amount, low.at)}</text>
        </g>
        <g fontSize="12" fontWeight="600" className="fill-ink font-sans" textAnchor="middle">
          {ms.map((m, i) => (
            <text key={m.month} x={BAL_MONTH_X[i]} y="222">{monthName(m.month)}</text>
          ))}
        </g>
        <g className="stroke-line-dash-soft" strokeWidth="1">
          {BAL_TICKS.map((x) => (
            <line key={x} x1={x} y1={BASE} x2={x} y2={BASE + 6} />
          ))}
        </g>
      </svg>
      <div className={legendRow}>
        <span className={legendItem}><span className="h-0.5 w-3.5 bg-teal" />{t.bal.legend.line}</span>
        <span className={legendItem}><span className="w-3.5 border-t-[1.5px] border-dashed border-ink" />{t.bal.legend.avg(ms.length)}</span>
        <span className={legendItem}><span className="box-border h-2.5 w-2.5 rounded-full border-[2.5px] border-amber" />{t.bal.legend.low}</span>
      </div>
    </>
  );
}
