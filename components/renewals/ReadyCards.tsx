import type { CSSProperties } from "react";
import { moneyShort } from "@/lib/offer-math";
import { readyCards as t, renewalMerchants, statusLabel, type RenewalStatus } from "@/lib/sample-data/renewals";
import { amountOf, statusOf, type RenewalState } from "./RadarRow";

type RingVars = CSSProperties & { "--p"?: string; "--delay"?: string };

const ringColor: Record<RenewalStatus, string> = {
  ready: "var(--color-teal)",
  sent: "var(--color-blue)",
  accepted: "var(--color-mint)",
  soon: "var(--color-line-dashed)",
};
const statusChip: Record<RenewalStatus, string> = {
  ready: "bg-amber-bg text-amber-text",
  sent: "bg-blue-bg text-blue-text",
  accepted: "bg-mint-bg text-teal-dark",
  soon: "bg-page text-grey-text",
};

/**
 * "Ready to renew" from design/Renewals.html and its prototype: a card per
 * merchant with a progress ring that sweeps in, the status chip, the
 * suggested amount and the revenue chip. The chosen card is outlined and
 * picking one selects that merchant in the offer panel too. No hover.
 */
export function ReadyCards({ s, onPick }: { s: RenewalState; onPick: (ini: string) => void }) {
  const cards = renewalMerchants.filter((m) => m.status !== "soon");
  return (
    <section aria-labelledby="h-cards" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2.5 px-1 pt-1">
        <div>
          <h2 id="h-cards" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <button type="button" className="h-[38px] cursor-pointer rounded-pill border-0 bg-card px-3.5 text-label font-semibold text-ink">
          {t.action}
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {cards.map((m, i) => {
          const on = m.ini === s.sel;
          const st = statusOf(m, s.sent);
          const ring: RingVars = { "--p": `${m.paid}%`, "--delay": `${0.2 + i * 0.08}s`, background: `conic-gradient(${ringColor[st]} var(--p), var(--color-line) 0)` };
          return (
            <button
              key={m.ini}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(m.ini)}
              className={`flex cursor-pointer flex-col items-start gap-3 rounded-[26px] border-2 bg-card p-4 text-left text-ink ${on ? "border-ink" : "border-transparent"}`}
            >
              <span className="flex w-full items-center justify-between">
                <span role="img" aria-label={`${m.paid}% repaid`} className="anim-conic grid h-[52px] w-[52px] place-items-center rounded-full" style={ring}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-card text-[11.5px] font-bold text-ink">{m.paid}%</span>
                </span>
                <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${statusChip[st]}`}>{statusLabel[st]}</span>
              </span>
              <span className="w-full">
                <b className="block truncate text-[14.5px]">{m.name}</b>
                <span className="text-[11.5px] text-hint">
                  {m.industry} · {m.broker}
                </span>
              </span>
              <span className="flex w-full items-end justify-between">
                <span>
                  <span className="block text-[10.5px] text-hint">{t.suggested}</span>
                  <b className="font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em]">{moneyShort(amountOf(m, s.amounts))}</b>
                </span>
                <span className={`whitespace-nowrap rounded-pill px-[9px] py-1 text-label font-bold ${m.rev >= 0 ? "bg-mint-light text-teal-deep" : "bg-red-bg text-red-text"}`}>{t.revenue(m.rev)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
