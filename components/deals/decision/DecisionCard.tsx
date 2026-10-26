"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { dealTabHref } from "@/lib/copy/deal";
import { decisionCard as t, outcomes, type Outcome } from "@/lib/copy/deal-decision";
import type { IsoDateTime } from "@/lib/data/types";
import type { DecisionTabData } from "@/lib/data/views/deal-tabs";
import { clockTime } from "@/lib/format";
import { computeOffer, formatOffer, money } from "@/lib/offer-math";
import type { DecisionState } from "./DecisionTab";

const input =
  "box-border h-[42px] min-w-0 rounded-[12px] border border-amber-light/60 bg-card px-3 text-body font-semibold text-ink outline-none focus:outline-2 focus:outline-offset-1 focus:outline-teal";

type Props = {
  data: DecisionTabData;
  s: DecisionState;
  recordedAt: IsoDateTime | null;
  onPick: (o: Outcome) => void;
  onToggleReason: (k: string) => void;
  onToggleExtra: (k: string) => void;
  onCounter: (patch: Partial<DecisionState["counter"]> & { factorText?: string }) => void;
  onNote: (v: string) => void;
  onRecord: () => void;
};


/**
 * "Your decision" from design/Deal-Decision.html and its prototype: the four
 * outcomes, the amount and terms from the shared offer math, the extra
 * panel each outcome opens (counter terms, extra conditions, decline
 * notice), the reasons, the note, and the record button. Recording shows
 * "What happens now". No hover.
 */
export function DecisionCard({ data, s, recordedAt, onPick, onToggleReason, onToggleExtra, onCounter, onNote, onRecord }: Props) {
  const rec = recordedAt !== null;
  const isDecline = s.out === "decline";
  const isCounter = s.out === "counter";
  const reasons = isDecline ? t.reasons.decline : t.reasons.approve(data.facts.years);
  const nPicked = reasons.filter((r) => s.picked[r.key]).length;
  const canRecord = nPicked > 0;

  const recommended = data.recommended;
  const offer = isCounter ? { ...recommended, ...s.counter } : recommended;
  const f = formatOffer(offer, computeOffer(offer, data.figures, data.offerPolicy));
  const label = t.label(s.out, money(recommended.amount), money(s.counter.amount));
  const parties = { broker: data.broker, owner: data.owner, validHours: data.validHours, openItems: data.openConditions.length };
  const declineList = reasons.filter((r) => s.picked[r.key]).map((r) => r.label.toLowerCase()).join(", ") || t.decline.none;

  return (
    <Card as="article" aria-labelledby="h-dec" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-dec" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle(recommended.amount)}</div>
        </div>
        <span className={`rounded-pill px-2.5 py-1 text-label-sm font-semibold ${rec ? "bg-mint-bg text-teal-dark" : "bg-amber-tint text-amber-deep"}`}>
          {rec ? t.chip.recorded : t.chip.open}
        </span>
      </div>

      <div role="group" aria-label={t.outcomeGroup} className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        {outcomes.map((o) => {
          const on = o.key === s.out;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(o.key)}
              className={`flex cursor-pointer flex-col items-start gap-1.5 rounded-[18px] border-0 p-3.5 text-left ${on ? "bg-teal text-white" : "bg-tile text-ink"}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${o.dot}`} />
              <b className="text-body">{o.label}</b>
              <span className="text-[11.5px] opacity-75">{o.sub}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5" aria-live="polite">
        <div className="rounded-[18px] bg-tile p-3.5">
          <span className="text-[11.5px] text-hint">{t.amount.label}</span>
          <b className="block font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em]">{isDecline ? t.amount.none : f.amount}</b>
          <Link href={dealTabHref(data.id, { path: "/offer" })} className="text-[11.5px] font-semibold text-teal no-underline">
            {t.amount.link}
          </Link>
        </div>
        <div className="rounded-[18px] bg-tile p-3.5">
          <span className="text-[11.5px] text-hint">{t.terms.label}</span>
          <b className="mt-1 block text-[15px]">{isDecline ? t.terms.none : t.terms.line(offer.factor, offer.term)}</b>
          <span className="text-[11.5px] text-hint">{isDecline ? t.terms.noneSub : t.terms.sub(f, data.bank)}</span>
        </div>
      </div>

      {isCounter ? (
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-amber-tint p-4">
          <span className="text-body-sm font-semibold text-amber-mute">{t.counter.title}</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
            <label className="flex flex-col gap-1 text-[11.5px] text-amber-mute">
              {t.counter.fields.amount}
              <input
                value={money(s.counter.amount)}
                onChange={(e) => onCounter({ amount: Number(e.target.value.replace(/\D/g, "")) || 0 })}
                className={input}
              />
            </label>
            <label className="flex flex-col gap-1 text-[11.5px] text-amber-mute">
              {t.counter.fields.factor}
              <input
                value={s.counterFactorText}
                onChange={(e) => onCounter({ factorText: e.target.value })}
                className={input}
              />
            </label>
            <label className="flex flex-col gap-1 text-[11.5px] text-amber-mute">
              {t.counter.fields.term}
              <input
                value={t.counter.term(s.counter.term)}
                onChange={(e) => onCounter({ term: Number(e.target.value.replace(/\D/g, "")) || 1 })}
                className={input}
              />
            </label>
          </div>
          <span className="text-label text-amber-mute">{t.counter.note}</span>
        </div>
      ) : null}

      {s.out === "conditions" ? (
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-mint-light p-4">
          <span className="text-body-sm font-semibold text-teal-dark">{t.conditions.title}</span>
          <div className="flex flex-wrap gap-1.5">
            {t.conditions.options(data.positions[0]?.funder ?? null).map((x) => {
              const on = !!s.extra[x.key];
              return (
                <button
                  key={x.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggleExtra(x.key)}
                  className={`h-[34px] cursor-pointer rounded-pill px-3.5 text-label font-semibold ${on ? "border-0 bg-teal text-white" : "border border-mint-soft bg-card text-teal-dark"}`}
                >
                  {x.label}
                </button>
              );
            })}
          </div>
          <span className="text-label text-teal-deep">{t.conditions.note}</span>
        </div>
      ) : null}

      {isDecline ? (
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-red-bg p-4">
          <span className="text-body-sm font-semibold text-red-text">{t.decline.title}</span>
          <span className="rounded-tile bg-card px-3.5 py-3 text-[12.5px] leading-[1.55]">{t.decline.notice(data.merchantName, data.id, declineList)}</span>
          <label className="flex items-center gap-2 text-[12.5px] text-red-deep">
            <input type="checkbox" defaultChecked className="m-0 h-[18px] w-[18px] accent-coral-text" />
            {t.decline.alsoMerchant}
          </label>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-semibold">{isDecline ? t.reasons.title.decline : t.reasons.title.approve}</span>
        <div className="flex flex-wrap gap-1.5">
          {reasons.map((r) => {
            const on = !!s.picked[r.key];
            const onClass = isDecline ? "border-0 bg-red-bg text-red-text" : "border-0 bg-mint-bg text-teal-dark";
            return (
              <button
                key={r.key}
                type="button"
                aria-pressed={on}
                onClick={() => onToggleReason(r.key)}
                className={`h-[34px] cursor-pointer rounded-pill px-3.5 text-label font-semibold ${on ? onClass : "border border-line-soft bg-card text-grey-text"}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="d-note" className="text-body-sm font-semibold">
          {t.note.label}
        </label>
        <textarea
          id="d-note"
          rows={2}
          value={s.note}
          onChange={(e) => onNote(e.target.value)}
          placeholder={t.note.placeholder}
          className="box-border resize-y rounded-tile border border-line-soft bg-tile px-3.5 py-3 font-sans text-body-sm text-ink outline-none placeholder:text-hint focus:outline-2 focus:outline-offset-1 focus:outline-teal"
        />
      </div>

      {s.out !== "approve" ? (
        <div className="flex items-center gap-2.5 rounded-[16px] bg-amber-tint px-3.5 py-3 text-[12.5px] text-amber-mute">
          <span className="h-2 w-2 flex-none rounded-full bg-amber" />
          {t.differs}
        </div>
      ) : null}

      {rec ? (
        <div className="flex flex-col gap-2 rounded-[18px] bg-teal p-3.5 text-white">
          <span className="text-label font-semibold text-mint">{t.next.title}</span>
          {t.next.steps(s.out, parties).map((step) => (
            <span key={step} className="flex items-center gap-2.5 text-[12.5px]">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-mint" />
              {step}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <span className="text-label text-hint" aria-live="polite">
          {rec ? t.foot.recorded(data.me.name, clockTime(recordedAt)) : canRecord ? t.foot.ready : t.foot.pick}
        </span>
        <button
          type="button"
          aria-disabled={!rec && !canRecord}
          onClick={() => {
            if (rec || canRecord) onRecord();
          }}
          className={`h-[46px] rounded-pill border-0 px-5 text-body-sm font-semibold ${
            rec ? "cursor-pointer bg-tile text-ink" : canRecord ? `cursor-pointer text-white ${isDecline ? "bg-coral-text" : "bg-teal"}` : "bg-line text-hint-soft"
          }`}
        >
          {rec ? t.record.undo : `${t.record.prefix}${label}`}
        </button>
      </div>
    </Card>
  );
}
