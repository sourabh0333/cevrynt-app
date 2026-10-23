import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { weeklyCopy as t } from "@/lib/copy/deal-cash-flow";
import type { DealCashFlow } from "@/lib/data/types";
import { monthName } from "@/lib/format";

const d = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });

/* Chart geometry from the design: weeks from x 34, 33.4 apart, 18 wide; $25K is 88 units either side of the baseline at y 115. */
const X0 = 34;
const STEP = 33.4;
const BAR = 18;
const BASE = 115;
const K = 88 / 25000;
const AXIS = ["$25K", "$0", "$25K"];
/** Where each month's label sits under the weeks. */
const MONTH_X = [80, 215, 365, 515];

/**
 * "Cash in and out, week by week" from design/Deal-CashFlow.html: the
 * deal's weeks of money in (teal, above the line) and money out (sand,
 * below), the amber net line and the flag on the week with the
 * related-business transfer. Bars grow from the baseline, the line draws,
 * once. No hover.
 */
export function WeeklyCashCard({ cashFlow: cf }: { cashFlow: DealCashFlow }) {
  const bars = cf.weeks.map((w, i) => ({
    x: X0 + i * STEP,
    in: w.in * K,
    out: w.out * K,
    netY: BASE - Math.max(-30, Math.min(30, (w.in - w.out) * K * 3)),
    flag: !!w.related,
  }));
  const net = "M" + bars.map((b) => `${(b.x + BAR / 2).toFixed(1)} ${b.netY.toFixed(1)}`).join(" L");
  const flagX = (bars.find((b) => b.flag)?.x ?? 0) + BAR + 4;
  const more = cf.weeks.filter((w) => w.in > w.out).length;
  const related = cf.setAside.find((s) => s.kind === "related");
  const first = cf.months[0].month;
  const last = cf.months[cf.months.length - 1].month;

  return (
    <Card as="article" aria-labelledby="h-week" className="col-span-2 max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-week" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle(cf.weeks.length)}</div>
        </div>
        <div className="flex gap-3.5 text-label">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-teal" />{t.legend.in}</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-sand-bar" />{t.legend.out}</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3.5 bg-amber" />{t.legend.net}</span>
        </div>
      </div>

      <div className="rounded-tile-lg bg-tile px-2 pt-2.5 pb-1">
        <svg
          role="img"
          aria-label={t.aria(first, last, more, cf.weeks.length, related?.at ?? "", related?.amount ?? 0)}
          viewBox="0 0 620 230"
          className="block h-[230px] w-full"
        >
          <line x1="30" y1={BASE} x2="600" y2={BASE} className="stroke-line-dashed" strokeWidth="1" />
          <g fontSize="10" className="fill-hint-soft font-sans">
            <text x="0" y="31">{AXIS[0]}</text>
            <text x="0" y="119">{AXIS[1]}</text>
            <text x="0" y="207">{AXIS[2]}</text>
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
                y={(BASE - 2 - b.in).toFixed(1)}
                width={BAR}
                height={b.in.toFixed(1)}
                rx="4"
              />
              <rect
                className="anim-grow-y-top fill-sand-bar"
                style={d(i * 0.04)}
                x={b.x.toFixed(1)}
                y={BASE + 2}
                width={BAR}
                height={b.out.toFixed(1)}
                rx="4"
              />
            </g>
          ))}
          <path d={net} pathLength={1} fill="none" className="anim-draw stroke-amber" style={d(0.5)} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {related ? (
            <g className="anim-fade" style={d(0.4)}>
              <rect x={flagX.toFixed(1)} y="16" width="74" height="18" rx="9" className="fill-amber-bg" />
              <text x={(flagX + 37).toFixed(1)} y="29" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-text font-sans">
                {t.flag(related.amount)}
              </text>
            </g>
          ) : null}
          <g fontSize="11" fontWeight="600" className="fill-grey-text font-sans" textAnchor="middle">
            {cf.months.map((m, i) => (
              <text key={m.month} x={MONTH_X[i]} y="226">{monthName(m.month, "long")}</text>
            ))}
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        {[
          { label: t.stats.more.label, value: t.stats.more.value(more, cf.weeks.length) },
          { label: t.stats.drop.label, value: t.stats.drop.value(cf.biggestWeeklyDrop) },
          { label: t.stats.cushion.label, value: t.stats.cushion.value(cf.cashCushionDays) },
        ].map((s) => (
          <span key={s.label} className="rounded-tile bg-tile px-3 py-2.5">
            <span className="text-[11.5px] text-hint">{s.label}</span>
            <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{s.value}</b>
          </span>
        ))}
      </div>
    </Card>
  );
}
