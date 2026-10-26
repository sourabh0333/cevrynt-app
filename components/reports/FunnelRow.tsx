import type { CSSProperties } from "react";
import { fundedMonthly, funnel, type FunnelTone } from "@/lib/copy/reports";
import type { ReportsData } from "@/lib/data/views/reports";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const toneClass: Record<FunnelTone, string> = {
  "teal-ink": "bg-teal-ink text-white",
  teal: "bg-teal text-white",
  "teal-mid": "bg-teal-mid text-white",
  "teal-soft": "bg-teal-soft text-white",
  "mint-mid": "bg-mint-mid text-teal-dark",
  mint: "bg-mint text-teal-dark",
};

/**
 * "From submitted to funded": a tapering funnel. Each step's bottom edge
 * meets the next step's width, the chip shows the share kept from the step
 * before, and the biggest drop is red. Steps grow out from the center one
 * by one.
 */
function FunnelCard({ data }: { data: ReportsData }) {
  const fn = funnel(data.snapshots.find((x) => x.period === "month") ?? data.snapshots[0]);
  const s = fn.stages;
  const kept = s.map((x, i) => (i === 0 ? null : Math.round((x.count / s[i - 1].count) * 100)));
  const worst = kept.reduce<number>((w, k, i) => (k !== null && (kept[w] === null || k < (kept[w] as number)) ? i : w), 1);
  const end = Math.round((s[s.length - 1].count / s[0].count) * 100);
  const label = s.map((x, i) => `${i ? x.label.toLowerCase() : x.label} ${x.count}`).join(", ");

  return (
    <article aria-labelledby="h-fun" className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg bg-card p-[22px] text-ink">
      <div className="flex items-start justify-between gap-2.5">
        <div>
          <h2 id="h-fun" className="m-0 font-heading text-[20px] font-semibold">{fn.title}</h2>
          <div className="mt-[3px] text-label text-hint">{fn.subtitle}</div>
        </div>
        <span className="text-right">
          <b className="block font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-teal-deep">{end}%</b>
          <span className="text-[11.5px] text-hint">{fn.endLabel}</span>
        </span>
      </div>
      <div role="img" aria-label={label} className="flex flex-col gap-1.5 rounded-[22px] bg-tile p-3.5">
        {s.map((x, i) => {
          const next = i < s.length - 1 ? s[i + 1].width : fn.lastBottom;
          const inset = (((x.width - next) / 2 / x.width) * 100).toFixed(1);
          const k = kept[i];
          return (
            <div key={x.label} className="grid grid-cols-[110px_minmax(0,1fr)_84px] items-center gap-3">
              <span className="text-[12.5px] font-semibold">{x.label}</span>
              <div className="flex justify-center">
                <div
                  className={`anim-fn-seg grid h-10 place-items-center text-body font-bold ${toneClass[x.tone]}`}
                  style={{ width: `${x.width}%`, clipPath: `polygon(0 0, 100% 0, ${100 - Number(inset)}% 100%, ${inset}% 100%)`, ...d(0.2 + i * 0.1) }}
                >
                  {x.count}
                </div>
              </div>
              {k === null ? (
                <span />
              ) : (
                <span className={`justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-bold ${i === worst ? "bg-red-bg text-red-text" : "bg-tile text-grey-text"}`}>
                  {fn.kept(k)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <span className="flex items-center gap-2.5 rounded-tile bg-red-bg px-3 py-2.5 text-label text-red-deep">
        <span className="h-2 w-2 flex-none rounded-full bg-red" />
        {fn.note}
      </span>
    </article>
  );
}

/* Chart geometry from design/Reports.html: 640 × 262, months 112 apart from x 30, $0 at y 230. */
const X0 = 30;
const STEP = 112;
const BASE = 230;
const PER_M = 146.2; // px per $1M
const x = (i: number) => X0 + i * STEP;
const y = (v: number) => +(BASE - v * PER_M).toFixed(1);

/** A smooth path through the points: each segment eases out flat at both ends, like the design's curves. */
function curve(pts: [number, number][], move = true) {
  return pts
    .map(([px, py], i) => {
      if (i === 0) return `${move ? "M" : "L"}${px} ${py}`;
      const [qx, qy] = pts[i - 1];
      const mid = qx + (px - qx) / 2;
      return `C${mid} ${qy} ${mid} ${py} ${px} ${py}`;
    })
    .join(" ");
}

/**
 * "Funded each month": new deals and renewals stacked as two areas that
 * rise, the total line draws, the month dots pop in one by one and the
 * October label fades in last. Three facts below.
 */
function MonthlyCard({ data }: { data: ReportsData }) {
  const fm = fundedMonthly(data);
  const ms = fm.months;
  const totals: [number, number][] = ms.map((m, i) => [x(i), y(m.total)]);
  const news: [number, number][] = ms.map((m, i) => [x(i), y(m.total - m.renewals)]);
  const last = totals[totals.length - 1];
  const newArea = `${curve(news)} L${x(ms.length - 1)} ${BASE} L${X0} ${BASE} Z`;
  const renArea = `${curve(totals)} ${curve([...news].reverse(), false)} Z`;

  return (
    <article aria-labelledby="h-vol" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-line bg-tile p-[22px] text-ink">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div>
          <h2 id="h-vol" className="m-0 font-heading text-[20px] font-semibold">{fm.title}</h2>
          <div className="mt-[3px] text-label text-hint">{fm.subtitle}</div>
        </div>
        <div className="flex gap-3 text-label">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-teal" />
            {fm.legend.newDeals}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-mint" />
            {fm.legend.renewals}
          </span>
        </div>
      </div>
      <div className="rounded-[22px] bg-card px-2.5 pt-3 pb-1.5">
        <svg role="img" aria-label={fm.chartLabel} viewBox="0 0 640 262" className="block h-[262px] w-full font-sans">
          <defs>
            <linearGradient id="rp-new" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-teal)" stopOpacity=".9" />
              <stop offset="1" stopColor="var(--color-teal)" stopOpacity=".55" />
            </linearGradient>
          </defs>
          {fm.gridlines.map((g) => (
            <g key={g}>
              <line x1={X0} x2={x(ms.length - 1)} y1={y(g)} y2={y(g)} strokeDasharray="3 5" className="stroke-panel-border" />
              <text x="598" y={y(g) + 4} fontSize="10.5" className="fill-hint-soft">
                ${g.toFixed(1)}M
              </text>
            </g>
          ))}
          <path d={newArea} fill="url(#rp-new)" className="anim-ar-rise" style={d(0.2)} />
          <path d={renArea} fillOpacity=".75" className="anim-ar-rise fill-mint" style={d(0.45)} />
          <path d={curve(totals)} fill="none" strokeWidth="2.5" pathLength={1} className="anim-ar-line stroke-teal" />
          {totals.map(([px, py], i) => (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={i === totals.length - 1 ? 5 : 3.5}
              strokeWidth="2.5"
              className="anim-ar-pt fill-tile stroke-teal"
              style={d(0.5 + i * 0.2)}
            />
          ))}
          <line x1={last[0]} x2={last[0]} y1={last[1]} y2={BASE} strokeDasharray="3 4" className="stroke-ink" />
          <g className="anim-ar-tip">
            <rect x={last[0] - 112} y={0.8} width="104" height="36" rx="12" className="fill-ink" />
            <text x={last[0] - 60} y={15.8} textAnchor="middle" fontSize="11" className="fill-tip-cap">
              {fm.tip.month}
            </text>
            <text x={last[0] - 60} y={30.8} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-white">
              {fm.tip.value}
            </text>
          </g>
          {ms.map((m, i) => (
            <text key={m.m} x={x(i)} y="252" textAnchor="middle" fontSize="11.5" className="fill-hint">
              {m.m}
            </text>
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {fm.facts.map((f) => (
          <span key={f.label} className="min-w-0 rounded-tile bg-card px-3 py-2.5">
            <span className="block truncate text-label-sm text-hint">{f.label}</span>
            <b className={`block truncate font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em] ${f.good ? "text-teal-deep" : ""}`}>{f.value}</b>
          </span>
        ))}
      </div>
    </article>
  );
}

/** Row 2 of design/Reports.html: the funnel beside the monthly chart, equal heights. */
export function FunnelRow({ data }: { data: ReportsData }) {
  return (
    <section aria-label="Funnel and monthly volume" className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
      <FunnelCard data={data} />
      <MonthlyCard data={data} />
    </section>
  );
}
