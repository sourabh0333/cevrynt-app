"use client";

import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  book as t,
  bookSegments,
  detail as dt,
  fundedDeals,
  statuses,
  trendPaths,
  type FlagTone,
  type FundedDeal,
  type PayMark,
  type PayStatus,
} from "@/lib/sample-data/funded";

type Delay = CSSProperties & { "--delay"?: string };

/*
 * Design .fcols: merchant, repaid, payment, last 10 payments, revenue now,
 * status. Instead of the design's 760px minimum the columns flex and names
 * truncate; the payment column hides below 1100px and revenue below 860px.
 */
const cols =
  "grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_84px_110px_80px_110px] items-center gap-3 max-[1100px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_110px_80px_110px] max-[1100px]:[&>:nth-child(3)]:hidden max-[860px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_110px_110px] max-[860px]:[&>:nth-child(5)]:hidden";

const statusChip: Record<PayStatus, string> = {
  ok: "bg-mint-bg text-teal-dark",
  slow: "bg-amber-bg text-amber-text",
  late: "bg-red-bg text-red-text",
  soon: "bg-blue-bg text-blue-text",
  new: "bg-page text-grey-text",
};
const barColor = (s: PayStatus) => (s === "late" ? "red" : s === "slow" ? "amber" : "teal");
const dotColor: Record<PayMark, string> = { c: "bg-teal", r: "bg-red", s: "bg-amber", n: "bg-line" };
const revColor = (rev: string) => (rev.startsWith("+") ? "text-teal-deep" : rev.startsWith("−") ? "text-coral-text" : "text-grey-dot");
const flagBox: Record<FlagTone, string> = {
  g: "bg-mint-light text-teal-dark",
  a: "bg-amber-tint text-amber-mute",
  r: "bg-red-bg text-red-text",
  n: "bg-tile text-grey-text",
};

function Avatar({ d, size }: { d: FundedDeal; size: 36 | 46 }) {
  return (
    <span
      className={`grid flex-none place-items-center font-bold text-white ${size === 46 ? "h-[46px] w-[46px] rounded-[15px] text-body" : "h-9 w-9 rounded-[12px] text-label-sm"}`}
      style={{ background: `linear-gradient(140deg, ${d.g[0]}, ${d.g[1]})` }}
    >
      {d.ini}
    </span>
  );
}

/** The detail panel's chart: daily revenue against the dashed level at funding. The line draws, then the fill fades in. */
function TrendChart({ d }: { d: FundedDeal }) {
  const p = trendPaths(d.trend);
  const down = p.direction === "down";
  return (
    <div className="relative min-h-[70px] flex-[1_1_70px] rounded-[16px] bg-tile p-2.5">
      <svg
        key={d.ini}
        role="img"
        aria-label={dt.trend.label(d.name)}
        viewBox="0 0 280 70"
        preserveAspectRatio="none"
        className="absolute inset-2.5 h-[calc(100%-20px)] w-[calc(100%-20px)]"
      >
        <line x1="0" y1={p.baseY} x2="280" y2={p.baseY} vectorEffect="non-scaling-stroke" strokeDasharray="4 4" className="anim-fade stroke-line-dashed" style={{ "--delay": "-0.8s" } as Delay} />
        <path d={p.area} className={`anim-fade ${down ? "fill-red/12" : "fill-teal/12"}`} />
        {/* No non-scaling-stroke here: it would turn the draw animation's dash into screen pixels. */}
        <path d={p.line} pathLength={1} fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`anim-draw ${down ? "stroke-red" : "stroke-teal"}`} />
      </svg>
    </div>
  );
}

/**
 * "Your book" and the deal detail from design/Funded.html and its
 * prototype. The list has the search, the filter chips on one scrolling
 * line, and a row per deal with its repayment bar, the last ten payments
 * (dots pop in one by one, row by row) and the revenue change. Clicking a
 * row updates the detail panel, which matches the book's height with the
 * chart filling the extra space and the buttons at the bottom. No hover.
 */
export function BookView() {
  const [seg, setSeg] = useState<PayStatus | "all">("all");
  const [sel, setSel] = useState(t.startSelected);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const rows = fundedDeals.filter((d) => (seg === "all" || d.status === seg) && (!q || d.name.toLowerCase().includes(q)));
  const d = fundedDeals.find((x) => x.ini === sel) ?? fundedDeals[0];
  const direction = trendPaths(d.trend).direction;

  return (
    <div className="flex flex-wrap items-stretch gap-3.5">
      <section aria-labelledby="h-book" className="flex min-w-0 flex-[999_1_640px] flex-col gap-3 rounded-card-lg bg-card p-[18px] text-ink">
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 pt-1">
          <h2 id="h-book" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
          <label className="flex h-[38px] min-w-[200px] items-center gap-2 rounded-pill bg-tile px-3.5 text-hint">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              aria-label={t.search.label}
              placeholder={t.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-hint"
            />
          </label>
        </div>

        <div role="group" aria-label="Show" className="scrollbar-none flex flex-nowrap gap-1.5 overflow-x-auto overflow-y-hidden px-1 pb-0.5">
          {bookSegments.map((g) => {
            const on = g.key === seg;
            return (
              <button
                key={g.key}
                type="button"
                aria-pressed={on}
                onClick={() => setSeg(g.key)}
                className={`inline-flex h-[34px] flex-none cursor-pointer items-center gap-2 rounded-pill border-0 pr-1.5 pl-3 text-[12.5px] font-semibold ${on ? "bg-teal text-white" : "bg-tile text-grey-text"}`}
              >
                <span className={`h-[7px] w-[7px] rounded-full ${on && g.onDot ? g.onDot : g.dot}`} />
                {g.label}
                <span className={`rounded-pill px-[7px] py-0.5 text-label-sm ${on ? "bg-teal/8" : "bg-card"}`}>{g.count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1" key={seg + q}>
          <div className={`${cols} px-3 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
            {t.columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {rows.map((r, ri) => {
            const on = r.ini === sel;
            return (
              <button
                key={r.ini}
                type="button"
                aria-pressed={on}
                onClick={() => setSel(r.ini)}
                className={`${cols} box-border w-full cursor-pointer rounded-[16px] border-0 px-3 py-[9px] text-left text-ink ${on ? "bg-tile shadow-[inset_0_0_0_1.5px_var(--color-ink)]" : "bg-transparent"}`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar d={r} size={36} />
                  <span className="min-w-0">
                    <b className="block truncate text-body-sm">{r.name}</b>
                    <span className="block truncate text-[11.5px] text-hint">
                      {r.funded} · {r.when}
                    </span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="flex justify-between text-label">
                    <b>{r.paid}%</b>
                    <span className="text-hint">{t.left(r.left)}</span>
                  </span>
                  <ProgressBar value={r.paid} height={6} track="line" color={barColor(r.status)} delay={0.1 + ri * 0.05} className="mt-1" />
                </span>
                <span className="font-heading text-body-sm font-semibold tabular-nums tracking-[-0.03em]">{r.pay}</span>
                <span className="flex items-center gap-0.5" aria-label={`Last 10 payments: ${r.hist.split("").filter((c) => c === "r").length} returned`}>
                  {r.hist.split("").map((c, di) => (
                    <span key={di} className={`anim-pay-dot h-3.5 w-2 rounded-[3px] ${dotColor[c as PayMark]}`} style={{ "--delay": `${(0.2 + ri * 0.08 + di * 0.045).toFixed(3)}s` } as Delay} />
                  ))}
                </span>
                <span className={`text-[12.5px] font-bold ${revColor(r.rev)}`}>{r.rev}</span>
                <span className={`justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${statusChip[r.status]}`}>{statuses[r.status]}</span>
              </button>
            );
          })}
          {rows.length === 0 ? <div className="rounded-[18px] bg-tile p-7 text-center text-[12.5px] text-hint">{t.empty}</div> : null}
        </div>
      </section>

      {/* The detail panel stretches to the book's height; the chart takes the extra space and the buttons sit at the bottom. */}
      <aside aria-labelledby="h-det" className="flex min-w-0 max-w-full flex-[1_1_320px] flex-col" aria-live="polite">
        <article className="box-border flex flex-1 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
          <div className="flex items-center gap-3">
            <Avatar d={d} size={46} />
            <span className="min-w-0">
              <h2 id="h-det" className="m-0 font-heading text-[19px] leading-[1.15] font-semibold">{d.name}</h2>
              <span className="text-[11.5px] text-hint">{dt.funded(d.funded, d.when, d.broker)}</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <span className="rounded-tile bg-tile px-3 py-2.5">
              <span className="text-label-sm text-hint">{dt.labels.left}</span>
              <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{d.left}</b>
            </span>
            <span className="rounded-tile bg-tile px-3 py-2.5">
              <span className="text-label-sm text-hint">{dt.labels.payoff}</span>
              <b className="mt-0.5 block text-body">{d.payoff}</b>
            </span>
          </div>
          <span className="text-cap font-semibold uppercase text-hint">{dt.labels.chart}</span>
          <TrendChart d={d} />
          <span className="text-label text-muted">{dt.trend[direction]}</span>
          <div className={`rounded-tile px-3.5 py-3 text-[12.5px] ${flagBox[d.flagTone]}`}>{d.flag}</div>
          <div className="mt-auto flex gap-2">
            <Button href="#" className="h-10 flex-1 text-[12.5px]">
              {d.action}
            </Button>
            <Button href="#" variant="secondary" className="h-10 bg-tile text-[12.5px]">
              {dt.open}
            </Button>
          </div>
        </article>
      </aside>
    </div>
  );
}
