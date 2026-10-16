"use client";

import { useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { balanceSeries, revenueChart, type ChartView } from "@/lib/sample-data/deal";

const cap = "text-[9.5px] font-semibold tracking-[0.08em] uppercase";
const num = "block font-heading font-semibold tabular-nums tracking-[-0.03em]";
const legendRow = "flex flex-wrap gap-4 px-2 pt-1.5 pb-2 text-[11.5px] text-muted";
const legendItem = "inline-flex items-center gap-1.5";
const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });

// Chart box: 560×250, plot from x 20–520, baseline y 200, top y 20 (180 tall).
const PLOT_TOP = 20;
const BASE = 200;

/**
 * "Revenue & balance" from design/Deal-Summary.html and its prototype: a
 * stats column and a chart, switched between Monthly revenue (bars against
 * the dashed stated amount, with a trend line) and Daily balance (an area
 * line with the average and the lowest day). Bars grow, lines draw, dots
 * pop, once each time a view opens. No hover.
 */
export function RevenueChart() {
  const [view, setView] = useState<ChartView>("rev");

  return (
    <Card as="article" aria-labelledby="h-trend" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="h-trend" className="m-0 font-heading text-[20px] font-semibold">{revenueChart.title}</h2>
          <div className="mt-[3px] text-label text-hint">{revenueChart.subtitle}</div>
        </div>
        <SegmentedSwitch
          options={revenueChart.views}
          value={view}
          onChange={(v) => setView(v as ChartView)}
          label="Chart view"
          className="[&>button]:h-[34px] [&>button]:px-3.5 [&>button]:text-label"
        />
      </div>

      <div className="flex flex-wrap items-stretch gap-[18px]">
        <div className="flex max-w-[220px] flex-[1_1_170px] flex-col gap-2.5">
          {view === "rev" ? <RevenueStats /> : <BalanceStats />}
        </div>
        <div className="min-w-0 flex-[999_1_420px] rounded-[22px] bg-tile px-3 pt-3.5 pb-1.5">
          {view === "rev" ? <RevenueBars key="rev" /> : <BalanceLine key="bal" />}
        </div>
      </div>
    </Card>
  );
}

function RevenueStats() {
  const { avg, stated, leftOut } = revenueChart.rev.stats;
  return (
    <>
      <div className="rounded-tile-lg bg-teal p-3.5 text-white">
        <span className={`${cap} text-cap-on-teal`}>{avg.cap}</span>
        <b className={`${num} mt-1 text-[28px] leading-[1.1]`}>{avg.value}</b>
        <span className="mt-2 inline-flex items-center gap-[5px] rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-mint">
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
          {avg.chip}
        </span>
      </div>
      <StatTile cap={stated.cap} value={stated.value} hint={stated.hint} />
      <StatTile cap={leftOut.cap} value={leftOut.value} hint={leftOut.hint} />
    </>
  );
}

function BalanceStats() {
  const { avg, low, below } = revenueChart.bal.stats;
  return (
    <>
      <div className="rounded-tile-lg bg-teal p-3.5 text-white">
        <span className={`${cap} text-cap-on-teal`}>{avg.cap}</span>
        <b className={`${num} mt-1 text-[28px] leading-[1.1]`}>{avg.value}</b>
        <span className="mt-2 inline-flex rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-mint">{avg.chip}</span>
      </div>
      <StatTile cap={low.cap} value={low.value} hint={low.hint} warn />
      <StatTile cap={below.cap} value={below.value} hint={below.hint} />
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
function RevenueBars() {
  const { months, stated, statedText, axis, trend, aria } = revenueChart.rev;
  // Scale: the stated amount fills the dashed outline (y 44.6 in the design).
  const unit = 155.4 / stated;
  const y = (v: number) => BASE - v * unit;
  const xs = [80, 210, 340, 470];
  const last = months.length - 1;

  return (
    <>
      <svg role="img" aria-label={aria} viewBox="0 0 560 250" className="block h-[250px] w-full">
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
          {axis.slice(0, -1).map((a) => (
            <line key={a} x1="20" y1={y(a).toFixed(1)} x2="520" y2={y(a).toFixed(1)} />
          ))}
        </g>
        <line x1="20" y1={BASE} x2="520" y2={BASE} className="stroke-line-dash-soft" strokeWidth="1" />
        <g fontSize="10.5" className="fill-hint-soft font-sans" textAnchor="start">
          {axis.map((a) => (
            <text key={a} x="526" y={(y(a) + 4).toFixed(1)}>{a ? `$${a}K` : "$0"}</text>
          ))}
        </g>
        <g fill="none" className="stroke-stone-dash" strokeWidth="1.5" strokeDasharray="4 4">
          {xs.map((x) => (
            <rect key={x} x={x - 28} y={y(stated).toFixed(1)} width="56" height={(stated * unit).toFixed(1)} rx="16" />
          ))}
        </g>
        {months.map((m, i) => (
          <rect
            key={m.label}
            className="anim-grow-y"
            style={d(i * 0.1)}
            x={xs[i] - 22}
            y={y(m.value).toFixed(1)}
            width="44"
            height={(m.value * unit).toFixed(1)}
            rx="14"
            fill={i === last ? "url(#rbar2)" : "url(#rbar)"}
          />
        ))}
        <path d={trend} pathLength={1} fill="none" className="anim-draw stroke-amber" style={d(0.4)} strokeWidth="2" strokeLinecap="round" />
        <g className="fill-white stroke-amber" strokeWidth="2.5">
          {months.map((m, i) => (
            <circle key={m.label} className="anim-pop-svg" style={d(0.9 + i * 0.15)} cx={xs[i]} cy={y(m.value).toFixed(1)} r={i === last ? 5.5 : 4.5} />
          ))}
        </g>
        <g className="fill-ink font-heading" fontWeight="600" fontSize="15" textAnchor="middle">
          {months.slice(0, last).map((m, i) => (
            <text key={m.label} x={xs[i]} y="24">{m.text}</text>
          ))}
        </g>
        <rect x={xs[last] - 38} y="7" width="76" height="24" rx="12" className="fill-ink" />
        <text x={xs[last]} y="24" textAnchor="middle" className="fill-white font-heading" fontWeight="600" fontSize="14">
          {months[last].text}
        </text>
        <g fontSize="12" fontWeight="600" className="fill-ink font-sans" textAnchor="middle">
          {months.map((m, i) => (
            <text key={m.label} x={xs[i]} y="222">{m.label}</text>
          ))}
        </g>
        <g fontSize="10.5" fontWeight="600" className="font-sans" textAnchor="middle">
          {months.map((m, i) => (
            <text key={m.label} x={xs[i]} y="240" className={i === last ? "fill-teal-deep" : "fill-amber-deep"}>{m.vs}</text>
          ))}
        </g>
      </svg>
      <div className={legendRow}>
        <span className={legendItem}><span className="h-3 w-3 rounded-[4px] bg-teal" />True revenue</span>
        <span className={legendItem}><span className="box-border h-3 w-3 rounded-[4px] border-[1.5px] border-dashed border-stone-dash" />Stated {statedText}</span>
        <span className={legendItem}><span className="h-0.5 w-3.5 bg-amber" />Trend</span>
      </div>
    </>
  );
}

/** End-of-day balance as an area line, with the average and the lowest day marked. */
function BalanceLine() {
  const { axis, avgText, lowText, monthLabels, ticks, aria } = revenueChart.bal;
  const s = balanceSeries();
  const y = (k: number) => BASE - ((BASE - PLOT_TOP) * k) / axis[0];
  const avgY = s.avgY.toFixed(1);

  return (
    <>
      <svg role="img" aria-label={aria} viewBox="0 0 560 250" className="block h-[250px] w-full">
        <defs>
          <linearGradient id="barea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="[stop-color:var(--color-teal)]" stopOpacity=".32" />
            <stop offset="1" className="[stop-color:var(--color-teal)]" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="stroke-grid-line" strokeWidth="1" strokeDasharray="2 5">
          {axis.slice(0, -1).map((a) => (
            <line key={a} x1="20" y1={y(a)} x2="520" y2={y(a)} />
          ))}
        </g>
        <line x1="20" y1={BASE} x2="520" y2={BASE} className="stroke-line-dash-soft" strokeWidth="1" />
        <g fontSize="10.5" className="fill-hint-soft font-sans">
          {axis.map((a) => (
            <text key={a} x="526" y={y(a) + 4}>{a ? `$${a}K` : "$0"}</text>
          ))}
        </g>
        <path d={s.area} fill="url(#barea)" className="anim-fade" style={d(-0.3)} />
        <path d={s.line} pathLength={1} fill="none" className="anim-draw stroke-teal" style={d(-0.2)} strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="20" y1={avgY} x2="520" y2={avgY} className="anim-fade stroke-ink" style={d(0)} strokeWidth="1.2" strokeDasharray="6 5" />
        <g className="anim-fade" style={d(0)}>
          <rect x="24" y={(s.avgY - 10).toFixed(1)} width="78" height="20" rx="10" className="fill-ink" />
          <text x="63" y={(s.avgY + 4).toFixed(1)} textAnchor="middle" fontSize="10.5" fontWeight="600" className="fill-white font-sans">{avgText}</text>
        </g>
        <circle cx={s.min.x.toFixed(1)} cy={s.min.y.toFixed(1)} r="6" className="anim-pop-svg fill-white stroke-amber" style={d(0.9)} strokeWidth="3" />
        <g className="anim-fade" style={d(0.3)}>
          <rect x={(s.min.x - 52).toFixed(1)} y={(s.min.y - 40).toFixed(1)} width="104" height="22" rx="11" className="fill-amber" />
          <text x={s.min.x.toFixed(1)} y={(s.min.y - 25).toFixed(1)} textAnchor="middle" fontSize="10.5" fontWeight="600" className="fill-white font-sans">{lowText}</text>
        </g>
        <g fontSize="12" fontWeight="600" className="fill-ink font-sans" textAnchor="middle">
          {monthLabels.map((m) => (
            <text key={m.label} x={m.x} y="222">{m.label}</text>
          ))}
        </g>
        <g className="stroke-line-dash-soft" strokeWidth="1">
          {ticks.map((x) => (
            <line key={x} x1={x} y1={BASE} x2={x} y2={BASE + 6} />
          ))}
        </g>
      </svg>
      <div className={legendRow}>
        <span className={legendItem}><span className="h-0.5 w-3.5 bg-teal" />End-of-day balance</span>
        <span className={legendItem}><span className="w-3.5 border-t-[1.5px] border-dashed border-ink" />4-month average</span>
        <span className={legendItem}><span className="box-border h-2.5 w-2.5 rounded-full border-[2.5px] border-amber" />Lowest day</span>
      </div>
    </>
  );
}
