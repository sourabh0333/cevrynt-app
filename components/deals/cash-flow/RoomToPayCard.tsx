import type { CSSProperties } from "react";
import { roomToPay } from "@/lib/sample-data/deal-cash-flow";

const fill = { existing: "bg-purple-light", offer: "bg-mint", left: "bg-teal/7" };
const swatch = { existing: "bg-purple-light", offer: "bg-mint", left: "bg-white/20" };

/**
 * "Room to pay" from design/Deal-CashFlow.html: true revenue per business
 * day, a three-part bar (existing advance, recommended offer, what's left)
 * that grows in once, the legend and the policy note. No hover.
 */
export function RoomToPayCard() {
  const style: CSSProperties & { "--delay"?: string } = { "--delay": "0.2s" };
  return (
    <article
      aria-labelledby="h-pay"
      className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div>
        <h2 id="h-pay" className="m-0 font-heading text-[20px] font-semibold">{roomToPay.title}</h2>
        <div className="mt-[3px] text-label text-muted">{roomToPay.subtitle}</div>
      </div>
      <div>
        <span className="text-label text-muted">{roomToPay.perDay.label}</span>
        <b className="block font-heading text-[26px] leading-[1.1] font-semibold tabular-nums tracking-[-0.03em]">{roomToPay.perDay.value}</b>
      </div>
      <div className="anim-grow-x flex h-4 gap-0.5 overflow-hidden rounded-[8px] bg-teal/7" style={style}>
        {roomToPay.parts.map((p) => (
          <span key={p.key} className={fill[p.key]} style={{ flex: p.share }} />
        ))}
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {roomToPay.parts.map((p) => (
          <span key={p.key} className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${swatch[p.key]}`} />
            <span>{p.label}</span>
            <b>{p.value}</b>
          </span>
        ))}
      </div>
      <div className="mt-auto rounded-tile border border-mint/30 bg-mint/14 px-3 py-2.5 text-[12.5px] text-muted">
        {roomToPay.note.before}
        <b className="text-ink">{roomToPay.note.strong}</b>
        {roomToPay.note.after}
      </div>
    </article>
  );
}
