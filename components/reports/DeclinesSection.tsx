import Link from "next/link";
import type { CSSProperties } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { declines, type RuleTone, type Verdict } from "@/lib/copy/reports";
import type { ReportsData } from "@/lib/data/views/reports";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const toneBg: Record<RuleTone, string> = {
  "teal-ink": "bg-teal-ink",
  teal: "bg-teal",
  red: "bg-red",
  "teal-soft": "bg-teal-soft",
  mint: "bg-mint",
  "stone-mid": "bg-stone-mid",
};
const verdictChip: Record<Verdict, string> = {
  working: "bg-mint-bg text-teal-dark",
  tighten: "bg-red-bg text-red-text",
  watch: "bg-amber-bg text-amber-text",
  loosen: "bg-blue-bg text-blue-text",
};
const verdictDot: Record<Verdict, string> = {
  working: "bg-teal shadow-[0_0_0_1px_var(--color-teal)]",
  tighten: "bg-red shadow-[0_0_0_1px_var(--color-red)]",
  watch: "bg-amber shadow-[0_0_0_1px_var(--color-amber)]",
  loosen: "bg-blue shadow-[0_0_0_1px_var(--color-blue)]",
};

/*
 * Design .rr: rule, declines, late-payment track, verdict, action, with an
 * 860px minimum and sideways scroll. Here the columns flex instead, sized
 * by the table's own width (container queries): the action link hides
 * below 820px and the declines bar below 600px.
 */
const cols =
  "grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.3fr)_110px_140px] items-center gap-4 @max-[820px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.3fr)_110px] @max-[820px]:[&>:nth-child(5)]:hidden @max-[600px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_100px] @max-[600px]:[&>:nth-child(2)]:hidden @max-[600px]:gap-3";

/** Late payments on the 0–6% track: the tinted area past the black target line (the policy's late-payment target), and the rule's dot with its value. */
function LateTrack({ dc, late, verdict, delay }: { dc: ReturnType<typeof declines>; late: number; verdict: Verdict; delay: number }) {
  const at = `${Math.round((late / dc.trackMax) * 100)}%`;
  const target = `${(dc.target / dc.trackMax) * 100}%`;
  return (
    <span role="img" aria-label={`${late.toFixed(1)}% paid late, target ${dc.target}%`} className="relative block h-[30px]">
      <span className="absolute inset-x-0 top-3.5 h-0.5 rounded-[1px] bg-line-strong" />
      <span className="absolute right-0 top-2 h-3.5 rounded-r-[7px] bg-red/8" style={{ left: target }} />
      <span className="absolute top-[5px] h-5 w-0.5 bg-ink" style={{ left: target }} />
      {/* The outer span places the dot; the inner one pops so the two transforms never clash. */}
      <span className="absolute top-[15px] -translate-x-1/2 -translate-y-1/2" style={{ left: at }}>
        <span className={`anim-pop block box-border h-3.5 w-3.5 rounded-full border-[3px] border-tile ${verdictDot[verdict]}`} style={d(delay)} />
      </span>
      <b className="anim-pop absolute -top-2 font-heading text-label-sm tabular-nums tracking-[-0.03em]" style={{ left: at, translate: "-50% 0", ...d(delay + 0.1) }}>
        {late.toFixed(1)}%
      </b>
    </span>
  );
}

/** "Declines and the rules behind them": the total, the share bar with its legend, and one row per rule. */
export function DeclinesSection({ data }: { data: ReportsData }) {
  const dc = declines(data.snapshots.find((s) => s.period === "month") ?? data.snapshots[0], data);
  const max = Math.max(...dc.rules.map((r) => r.count));
  return (
    <section aria-labelledby="h-rule" className="box-border flex min-w-0 flex-col gap-4 rounded-card-lg bg-card p-[22px] text-ink">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="h-rule" className="m-0 font-heading text-[20px] font-semibold">{dc.title}</h2>
          <div className="mt-[3px] text-label text-hint">{dc.subtitle}</div>
        </div>
        <span className="flex items-baseline gap-1.5">
          <b className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{dc.total}</b>
          <span className="text-[11.5px] text-hint">{dc.totalLabel}</span>
        </span>
      </div>

      <div className="flex flex-col gap-2.5 rounded-[22px] bg-tile p-4">
        <div role="img" aria-label={dc.shareLabel} className="anim-grow-x flex h-4 gap-[3px] overflow-hidden rounded-[8px]" style={d(0.3)}>
          {dc.rules.map((r) => (
            <span key={r.reason} title={r.reason} className={toneBg[r.tone]} style={{ flex: r.count }} />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-x-[18px] gap-y-2">
          {dc.rules.map((r) => (
            <span key={r.reason} className="flex min-w-0 items-center gap-2 text-label">
              <span className={`h-2.5 w-2.5 flex-none rounded-[3px] ${toneBg[r.tone]}`} />
              <span className="min-w-0 flex-1 truncate">{r.reason}</span>
              <b className="font-heading tabular-nums tracking-[-0.03em]">{r.count}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="@container flex flex-col gap-1.5">
        <div className={`${cols} items-end px-4 pb-0.5 text-[10px] leading-[1.3] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {dc.columns.map((c, i) => (
            <span key={i} className="min-w-0 break-words">
              {c}
            </span>
          ))}
        </div>
        {dc.rules.map((r, i) => (
          <div key={r.rule} className={`${cols} rounded-[18px] bg-tile px-4 py-3`}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span className={`h-[34px] w-2.5 flex-none rounded-[5px] ${toneBg[r.tone]}`} />
              <span className="min-w-0">
                <b className="block truncate text-body-sm">{r.rule}</b>
                <span className="block truncate text-[11.5px] text-hint">{r.reason}</span>
              </span>
            </span>
            <span className="flex min-w-0 items-center gap-2.5">
              <ProgressBar className="flex-1" value={(r.count / max) * 100} height={8} color="ink" track="faint" delay={0.2 + i * 0.06} />
              <b className="w-[26px] text-right font-heading tabular-nums tracking-[-0.03em]">{r.count}</b>
            </span>
            <LateTrack dc={dc} late={r.late} verdict={r.verdict} delay={0.3 + i * 0.08} />
            <span className={`justify-self-start whitespace-nowrap rounded-pill px-2.5 py-1 text-label-sm font-bold ${verdictChip[r.verdict]}`}>{dc.verdictLabel[r.verdict]}</span>
            <Link href={r.action.href} className="justify-self-end truncate text-label font-semibold text-teal">
              {r.action.label}
            </Link>
          </div>
        ))}
      </div>
      <span className="flex items-center gap-2.5 text-label text-muted">
        <span className="inline-flex h-3 w-[26px] flex-none rounded-r-[6px] border-l-2 border-ink bg-red/12" />
        {dc.note}
      </span>
    </section>
  );
}
