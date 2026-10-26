"use client";

import type { CSSProperties } from "react";
import { money, moneyShort, renewalOffer } from "@/lib/offer-math";
import { offerPanel as t, radar, radarPosition, radarSize, statusLabel, type RenewalMerchant, type RenewalStatus } from "@/lib/copy/renewals";
import { TickBox } from "@/components/ui/TickBox";

type Delay = CSSProperties & { "--delay"?: string };

const dotFill: Record<RenewalStatus, string> = { ready: "bg-teal text-white", sent: "bg-blue text-white", accepted: "bg-mint text-ink", soon: "bg-line-dashed text-ink" };
const statusChip: Record<RenewalStatus, string> = {
  ready: "bg-amber-bg text-amber-text",
  sent: "bg-blue-bg text-blue-text",
  accepted: "bg-mint-bg text-teal-dark",
  soon: "bg-page text-grey-text",
};

export type RenewalState = {
  sel: string;
  amounts: Record<string, number>;
  sent: Record<string, boolean>;
  forgive: Record<string, boolean>;
};

type Props = {
  merchants: RenewalMerchant[];
  /** the saved rules' repaid line, marked on the radar */
  renewalLine: number;
  s: RenewalState;
  /** Pricing's loyalty price, taken off the base factor */
  loyaltyDiscount: number;
  onPick: (id: string) => void;
  onAmount: (id: string, amount: number) => void;
  onSend: (id: string) => void;
  onForgive: (id: string) => void;
};

export const statusOf = (m: RenewalMerchant, sent: Record<string, boolean>): RenewalStatus => (sent[m.id] ? "sent" : m.status);
export const amountOf = (m: RenewalMerchant, amounts: Record<string, number>) => amounts[m.id] ?? m.suggested;

/**
 * "Renewal radar" and the offer panel from design/Renewals.html and its
 * prototype. Dots sit by share repaid and revenue change, sized by the
 * renewal amount, and pop in one by one; clicking one selects the
 * merchant. The panel prices the renewal through the shared offer math:
 * the amount with − / +, the payoff vs new cash split, the loyalty
 * factor, the daily payment against today's, the re-check chips and the
 * disclosure with the forgive switch. No hover.
 */
export function RadarRow({ merchants, renewalLine, s, loyaltyDiscount, onPick, onAmount, onSend, onForgive }: Props) {
  const m = merchants.find((x) => x.id === s.sel) ?? merchants[0];
  const st = statusOf(m, s.sent);
  const amount = amountOf(m, s.amounts);
  const can = m.suggested > 0;
  const r = renewalOffer({ amount, baseFactor: m.baseFactor, left: m.left, paid: m.paid, currentFactor: m.currentFactor }, loyaltyDiscount);
  const forgive = !!s.forgive[m.id];
  const clamp = (v: number) => Math.max(t.amount.min, Math.min(m.max, v));
  const q = radar.quadrants;

  return (
    <div className="flex flex-wrap items-stretch gap-3.5">
      <section aria-labelledby="h-radar" className="flex min-w-0 flex-[999_1_560px] flex-col gap-3.5 rounded-card-lg bg-card p-[22px] text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-radar" className="m-0 font-heading text-[22px] font-semibold">{radar.title}</h2>
            <div className="mt-[3px] text-label text-hint">{radar.subtitle}</div>
          </div>
          <div className="flex flex-wrap gap-3 text-[11.5px] text-muted">
            {radar.legend.map((l) => (
              <span key={l.label} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        {/* The chart fills whatever height the card has (layout rule 1). */}
        <div className="flex min-h-0 flex-1 gap-2.5">
          <div className="rotate-180 text-center text-label-sm text-hint [writing-mode:vertical-rl]">{radar.yAxis}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="relative grid min-h-[340px] flex-1 grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-[22px]">
              <div className="bg-tile p-3 text-[11.5px] font-semibold text-hint">
                {q.nurture.title}
                <span className="block font-normal">{q.nurture.sub}</span>
              </div>
              <div className="bg-mint-light p-3 text-right text-[11.5px] font-semibold text-teal-deep">
                {q.renew.title}
                <span className="block font-normal">{q.renew.sub}</span>
              </div>
              <div className="flex items-end bg-tile p-3 text-[11.5px] font-semibold text-hint-soft">{q.early.title}</div>
              <div className="flex flex-col items-end justify-end bg-amber-tint p-3 text-right text-[11.5px] font-semibold text-amber-deep">
                {q.soft.title}
                <span className="font-normal">{q.soft.sub}</span>
              </div>
              <span aria-hidden="true" className="absolute top-1/2 right-0 left-0 border-t-[1.5px] border-dashed border-line-dashed" />
              <span aria-hidden="true" className="absolute top-0 bottom-0 left-1/2 border-l-[1.5px] border-dashed border-line-dashed" />
              {merchants.map((x, i) => {
                const on = x.id === s.sel;
                const xs = statusOf(x, s.sent);
                const pos = radarPosition(x);
                const size = radarSize(x, amountOf(x, s.amounts));
                const style: Delay = { left: `${pos.x}%`, top: `${pos.y}%`, "--delay": `${0.3 + i * 0.09}s` };
                return (
                  <button
                    key={x.id}
                    type="button"
                    aria-label={radar.dotLabel(x)}
                    aria-pressed={on}
                    onClick={() => onPick(x.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 ${on ? "z-[3]" : "z-[2]"}`}
                    style={style}
                  >
                    <span
                      className={`anim-pop box-border grid place-items-center rounded-full border-[3px] text-[10px] font-bold shadow-[0_8px_18px_-10px_rgba(15,21,19,.6)] ${dotFill[xs]} ${on ? "border-ink" : "border-white"}`}
                      style={{ width: size, height: size, ...style }}
                    >
                      {x.ini}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-label-sm text-hint">
              {radar.xAxis(renewalLine).map((a) => (
                <span key={a}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside
        aria-labelledby="h-off"
        aria-live="polite"
        className="box-border flex min-w-0 max-w-full flex-[1_1_320px] flex-col gap-3.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-[22px] text-ink"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-[16px] text-[15px] font-bold text-white" style={{ background: `linear-gradient(140deg, ${m.g[0]}, ${m.g[1]})` }}>
            {m.ini}
          </span>
          <span className="min-w-0">
            <span className={`rounded-pill px-[9px] py-[3px] text-[10.5px] font-semibold ${statusChip[st]}`}>{statusLabel[st]}</span>
            <h2 id="h-off" className="mt-1.5 mb-0 font-heading text-[20px] leading-[1.15] font-semibold">{m.name}</h2>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <span className="rounded-tile bg-teal/7 p-2.5">
            <span className="block text-[10.5px] text-muted">{t.stats.repaid}</span>
            <b className="font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">{m.paid}%</b>
          </span>
          <span className="rounded-tile bg-teal/7 p-2.5">
            <span className="block text-[10.5px] text-muted">{t.stats.revenue}</span>
            <b className={`font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em] ${m.rev >= 0 ? "text-teal-deep" : "text-coral-text"}`}>
              {m.rev >= 0 ? "+" : "−"}
              {Math.abs(m.rev)}%
            </b>
          </span>
          <span className="rounded-tile bg-teal/7 p-2.5">
            <span className="block text-[10.5px] text-muted">{t.stats.score}</span>
            <b className="font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">{m.score}</b>
          </span>
        </div>

        <div className="flex flex-col gap-3 rounded-tile-lg border border-white/10 bg-teal/7 p-4">
          <div className="flex items-center justify-between gap-2.5">
            <button type="button" aria-label={t.amount.lower} aria-disabled={!can} onClick={() => can && onAmount(m.id, clamp(amount - t.amount.step))} className="h-[38px] w-[38px] cursor-pointer rounded-full border-0 bg-teal/7 text-[18px] text-ink">
              −
            </button>
            <span className="text-center">
              <span className="block text-label-sm text-muted">{t.amount.label}</span>
              <b className="block font-heading text-[26px] leading-[1.05] font-semibold tabular-nums tracking-[-0.03em]">{can ? money(amount) : t.amount.notYet}</b>
              <span className="text-label-sm text-muted">{t.amount.upTo(m.max ? moneyShort(m.max) : "—")}</span>
            </span>
            <button type="button" aria-label={t.amount.raise} aria-disabled={!can} onClick={() => can && onAmount(m.id, clamp(amount + t.amount.step))} className="h-[38px] w-[38px] cursor-pointer rounded-full border-0 bg-teal/7 text-[18px] text-ink">
              +
            </button>
          </div>
          <div key={`${m.id}-${amount}`} role="img" aria-label={t.cashLabel(r.cashPercent)} className="anim-grow-x flex h-2.5 gap-0.5 overflow-hidden rounded-[5px]" style={{ "--delay": "0.1s" } as Delay}>
            <span className="bg-white/30" style={{ flex: Math.max(0, 100 - Math.round(r.cashPercent)) }} />
            <span className="bg-mint" style={{ flex: Math.round(r.cashPercent) }} />
          </div>
          <div className="flex justify-between text-[11.5px]">
            <span className="text-muted">{t.split.paysOff(money(m.left))}</span>
            <span className="font-semibold text-teal-deep">{t.split.newCash(money(can ? r.cash : 0))}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <span className="rounded-tile bg-teal/7 p-3">
            <span className="block text-[10.5px] text-muted">{t.factor.label}</span>
            <b className="font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{r.loyaltyFactor.toFixed(2)}</b>
          </span>
          <span className="rounded-tile bg-teal/7 p-3">
            <span className="block text-[10.5px] text-muted">{t.daily.label(money(m.now))}</span>
            <b className="font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{can ? money(r.daily) : "—"}</b>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {t.checks.map((c) => (
            <span key={c} className="rounded-pill bg-mint/14 px-[9px] py-1 text-label-sm font-semibold text-teal-deep">
              {c}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-[18px] bg-card p-3.5 text-ink">
          <span className="flex items-center justify-between gap-2">
            <b className="text-body-sm">{t.disclosure.title}</b>
            <span className="text-[10.5px] text-hint">{t.disclosure.shown}</span>
          </span>
          <span className="flex justify-between gap-2 text-label">
            <span className="text-muted">{t.disclosure.payout}</span>
            <b className="font-heading font-semibold tabular-nums tracking-[-0.03em]">{money(m.left)}</b>
          </span>
          <span className="flex justify-between gap-2 text-label">
            <span className="text-muted">{t.disclosure.fees}</span>
            <b className={`whitespace-nowrap text-[12.5px] ${forgive ? "text-teal-deep" : "text-amber-deep"}`}>{forgive ? t.disclosure.no : t.disclosure.yes(money(r.unearnedFee))}</b>
          </span>
          <label className="flex cursor-pointer items-center justify-between gap-2 border-t border-line pt-2 text-label">
            <span>
              <b>{t.disclosure.forgive.label}</b>
              <span className="block text-hint">{t.disclosure.forgive.note}</span>
            </span>
            <TickBox checked={forgive} onChange={() => onForgive(m.id)} className="m-0 h-5 w-5 accent-teal" />
          </label>
        </div>

        <button
          type="button"
          aria-disabled={st !== "ready"}
          onClick={() => st === "ready" && onSend(m.id)}
          className={`mt-auto h-[46px] rounded-pill border-0 text-body-sm font-semibold ${st === "ready" ? "cursor-pointer bg-card text-ink" : "bg-mint/18 text-teal-deep"}`}
        >
          {t.send[st]}
        </button>
        <span className="text-center text-[11.5px] text-muted">{t.foot}</span>
      </aside>
    </div>
  );
}
