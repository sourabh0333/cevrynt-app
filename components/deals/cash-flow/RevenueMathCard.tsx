import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { revenueMath, type SetAsideKind } from "@/lib/sample-data/deal-cash-flow";

const stripe: Record<SetAsideKind, string> = {
  related: "stripe-amber",
  transfer: "stripe-sand",
  refund: "stripe-stone",
};
const segmentMin: Record<SetAsideKind, string> = {
  related: "min-w-[18px] rounded-[10px]",
  transfer: "min-w-[16px] rounded-[10px]",
  refund: "min-w-[12px] rounded-[8px]",
};
const num = "font-heading font-semibold tabular-nums tracking-[-0.03em]";
const delay = (s: number): CSSProperties & { "--delay"?: string } => ({ "--delay": `${s}s` });

/**
 * "From deposits to true revenue" from design/Deal-CashFlow.html: the
 * deposited → true revenue line, the striped breakdown bar, the set-aside
 * tiles (links into the transactions) and the four monthly share strips.
 * The bar and strips grow in from the left once. No hover.
 */
export function RevenueMathCard() {
  const { bar, tiles, loanProceeds, shares } = revenueMath;
  return (
    <Card as="article" aria-labelledby="h-math" padding={false} className="col-span-2 gap-[18px] p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="h-math" className="m-0 font-heading text-[20px] font-semibold">{revenueMath.title}</h2>
          <div className="mt-[3px] text-label text-hint">{revenueMath.subtitle}</div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-pill bg-teal px-3.5 py-2 text-white">
          <b className={`${num} text-[18px]`}>{revenueMath.monthly.value}</b>
          <span className="text-label text-cap-on-teal">{revenueMath.monthly.unit}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3.5">
        <span>
          <span className="block text-label text-hint">Deposited</span>
          <b className={`${num} text-[26px] leading-none`}>{revenueMath.deposited}</b>
        </span>
        <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-tile text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        <span>
          <span className="block text-label text-hint">True revenue</span>
          <b className={`${num} text-[26px] leading-none text-teal-deep`}>{revenueMath.trueRevenue}</b>
        </span>
        <span className="ml-auto rounded-pill bg-mint-bg px-[11px] py-[5px] text-[11.5px] font-semibold text-teal-dark">
          {revenueMath.countsChip}
        </span>
      </div>

      <div role="img" aria-label={bar.aria} className="anim-grow-x flex h-[52px] gap-1" style={delay(0.1)}>
        <span
          className="flex items-center rounded-[16px] bg-[linear-gradient(90deg,var(--color-teal-ink),var(--color-teal-bright))] px-4 text-body-sm font-semibold text-white"
          style={{ flex: bar.revenue.share }}
        >
          {bar.revenue.label}
        </span>
        {bar.setAside.map((s) => (
          <span key={s.kind} className={`${stripe[s.kind]} ${segmentMin[s.kind]}`} style={{ flex: s.share }} />
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        {tiles.map((t) => (
          <Link
            key={t.kind}
            href={t.href}
            className={`flex flex-col gap-1 rounded-[18px] px-3.5 py-3 text-ink no-underline ${t.warn ? "bg-amber-tint" : "bg-tile"}`}
          >
            <span className="flex items-center gap-2">
              <span className={`h-3.5 w-3.5 rounded-[4px] ${stripe[t.kind]}`} />
              <span className={`whitespace-nowrap text-label ${t.warn ? "text-amber-mute" : "text-muted"}`}>{t.label}</span>
            </span>
            <b className={`${num} text-[19px] ${t.warn ? "text-amber-deep" : ""}`}>{t.amount}</b>
            <span className={`text-[11.5px] ${t.warn ? "text-amber-mute" : "text-hint"}`}>{t.note}</span>
          </Link>
        ))}
        <span className="flex flex-col gap-1 rounded-[18px] border-[1.5px] border-dashed border-line-dash-soft px-3.5 py-3">
          <span className="whitespace-nowrap text-label text-muted">{loanProceeds.label}</span>
          <b className={`${num} text-[19px] text-hint`}>{loanProceeds.amount}</b>
          <span className="text-[11.5px] text-hint">{loanProceeds.note}</span>
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2.5 border-t border-line pt-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <b className="text-[13.5px]">{shares.title}</b>
          <span className="text-[11.5px] text-hint">{shares.hint}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 max-[700px]:grid-cols-2">
          {shares.months.map((m, i) => (
            <div key={m.month} className={`flex min-w-0 flex-col gap-2 rounded-[16px] p-3 ${m.warn ? "bg-amber-tint" : "bg-tile"}`}>
              <span className="flex items-baseline justify-between">
                <b className="text-body-sm">{m.month}</b>
                <b className={`${num} text-body-sm ${m.warn ? "text-amber-deep" : "text-teal-deep"}`}>{m.pct}</b>
              </span>
              <span className="anim-grow-x flex h-2.5 gap-[3px]" style={delay(0.3 + i * 0.08)}>
                <span className="rounded-[5px] bg-teal" style={{ flex: m.counted }} />
                <span className={`stripe-sm min-w-1.5 rounded-[5px] ${m.warn ? "stripe-amber" : "stripe-sand"}`} style={{ flex: 100 - m.counted }} />
              </span>
              <span className="truncate text-[11.5px] text-hint">{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
