import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { weekGeometry, weeklyBars, weeklyCash } from "@/lib/sample-data/deal-cash-flow";

const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });

/**
 * "Cash in and out, week by week" from design/Deal-CashFlow.html and the
 * prototype's weekly series: 17 weeks of money in (teal, above the line)
 * and money out (sand, below), the amber net line and the "+$12K related"
 * flag. Bars grow from the baseline, the line draws, once. No hover.
 */
export function WeeklyCashCard() {
  const bars = weeklyBars();
  const { barWidth: bw, base } = weekGeometry;
  const net = "M" + bars.map((b) => `${(b.x + bw / 2).toFixed(1)} ${b.netY.toFixed(1)}`).join(" L");
  const flagX = (bars.find((b) => b.flag)?.x ?? 0) + bw + 4;

  return (
    <Card as="article" aria-labelledby="h-week" className="col-span-2 max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-week" className="m-0 font-heading text-[20px] font-semibold">{weeklyCash.title}</h2>
          <div className="mt-[3px] text-label text-hint">{weeklyCash.subtitle}</div>
        </div>
        <div className="flex gap-3.5 text-label">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-teal" />{weeklyCash.legend.in}</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-sand-bar" />{weeklyCash.legend.out}</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3.5 bg-amber" />{weeklyCash.legend.net}</span>
        </div>
      </div>

      <div className="rounded-tile-lg bg-tile px-2 pt-2.5 pb-1">
        <svg role="img" aria-label={weeklyCash.aria} viewBox="0 0 620 230" className="block h-[230px] w-full">
          <line x1="30" y1={base} x2="600" y2={base} className="stroke-line-dashed" strokeWidth="1" />
          <g fontSize="10" className="fill-hint-soft font-sans">
            <text x="0" y="31">{weeklyCash.axis[0]}</text>
            <text x="0" y="119">{weeklyCash.axis[1]}</text>
            <text x="0" y="207">{weeklyCash.axis[2]}</text>
          </g>
          <g className="stroke-line" strokeDasharray="2 5">
            <line x1="30" y1="27" x2="600" y2="27" />
            <line x1="30" y1="203" x2="600" y2="203" />
          </g>
          {bars.map((b, i) => (
            <g key={b.x}>
              <rect
                className="anim-grow-y fill-teal"
                style={d(i * 0.04)}
                x={b.x.toFixed(1)}
                y={(base - 2 - b.in).toFixed(1)}
                width={bw}
                height={b.in.toFixed(1)}
                rx="4"
              />
              <rect
                className="anim-grow-y-top fill-sand-bar"
                style={d(i * 0.04)}
                x={b.x.toFixed(1)}
                y={base + 2}
                width={bw}
                height={b.out.toFixed(1)}
                rx="4"
              />
            </g>
          ))}
          <path d={net} pathLength={1} fill="none" className="anim-draw stroke-amber" style={d(0.5)} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <g className="anim-fade" style={d(0.4)}>
            <rect x={flagX.toFixed(1)} y="16" width="74" height="18" rx="9" className="fill-amber-bg" />
            <text x={(flagX + 37).toFixed(1)} y="29" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-text font-sans">
              {weeklyCash.flag}
            </text>
          </g>
          <g fontSize="11" fontWeight="600" className="fill-grey-text font-sans" textAnchor="middle">
            {weeklyCash.months.map((m) => (
              <text key={m.label} x={m.x} y="226">{m.label}</text>
            ))}
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        {weeklyCash.stats.map((s) => (
          <span key={s.label} className="rounded-tile bg-tile px-3 py-2.5">
            <span className="text-[11.5px] text-hint">{s.label}</span>
            <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{s.value}</b>
          </span>
        ))}
      </div>
    </Card>
  );
}
