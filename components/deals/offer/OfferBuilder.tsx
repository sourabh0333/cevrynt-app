import { Card } from "@/components/ui/Card";
import { builder, factorOptions } from "@/lib/copy/deal-offer";
import { money, percent, type OfferInput, type OfferPolicy, type OfferResult } from "@/lib/offer-math";
import { Pills } from "./Pills";

type Props = {
  offer: OfferInput;
  result: OfferResult;
  /** the policy limits and this deal's range, from the data layer */
  policy: OfferPolicy;
  /** the recommended amount, marked under the slider */
  recommended: number;
  /** the pricing band the deal's score is in ("score 80+") */
  scoreBandFrom: number | null;
  /** the existing advance the offer can pay off; no tick box without one */
  payoff: { funder: string; balance: number } | null;
  onChange: (patch: Partial<OfferInput>) => void;
  onReset: () => void;
};

type Rule = { ok: boolean; warn?: boolean; label: string; note: string };

const label = "text-body-sm font-semibold";

/**
 * "Offer builder" from design/Deal-Offer.html and its prototype: the amount
 * slider, the factor, term, payments, fee and collect-from pill groups, the
 * payoff tick box for the existing advance, and the four live policy checks. No hover.
 */
export function OfferBuilder({ offer, result, policy: p, recommended, scoreBandFrom, payoff, onChange, onReset }: Props) {
  const r = result.rules;
  const rules: Rule[] = [
    { ok: r.debtShare, label: builder.rules.debtShare.label(percent(result.share)), note: builder.rules.debtShare.note(p.maxShare) },
    { ok: r.ceiling, label: builder.rules.ceiling.label, note: builder.rules.ceiling.note(p.ceiling) },
    { ok: r.factor, label: builder.rules.factor.label, note: builder.rules.factor.note(p.factorMin, p.factorMax, scoreBandFrom) },
    { ok: r.approval, warn: true, label: r.approval ? builder.rules.approval.ok : builder.rules.approval.warn, note: builder.rules.approval.note(p.approvalLimit) },
  ];

  return (
    <Card as="article" aria-labelledby="h-build" padding={false} className="col-span-2 gap-[18px] p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-build" className="m-0 font-heading text-[22px] font-semibold">{builder.title}</h2>
          <div className="mt-[3px] text-label text-hint">{builder.subtitle}</div>
        </div>
        <button type="button" onClick={onReset} className="h-9 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-ink">
          {builder.reset}
        </button>
      </div>

      <div className="flex flex-col gap-2.5 rounded-[22px] bg-tile p-[18px]">
        <div className="flex items-baseline justify-between gap-2.5">
          <label htmlFor="o-amt" className={label}>
            {builder.amount.label}
          </label>
          <b className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{money(offer.amount)}</b>
        </div>
        <input
          id="o-amt"
          type="range"
          min={p.floor}
          max={p.ceiling}
          step={builder.amount.step}
          value={offer.amount}
          onChange={(e) => onChange({ amount: Number(e.target.value) })}
          className="m-0 w-full cursor-pointer accent-teal"
        />
        <div className="flex justify-between text-[11.5px] text-hint">
          <span>{builder.amount.floor(p.floor)}</span>
          <span className="font-semibold text-teal-deep">{builder.amount.recommended(recommended)}</span>
          <span>{builder.amount.ceiling(p.ceiling)}</span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <div className="flex flex-col gap-2">
          <span className={label}>{builder.factor.label}</span>
          <Pills label={builder.factor.label} options={factorOptions(p.factorMin, p.factorMax).map((f) => ({ value: f, label: f.toFixed(2) }))} value={offer.factor} onChange={(factor) => onChange({ factor })} />
        </div>
        <div className="flex flex-col gap-2">
          <span className={label}>{builder.term.label}</span>
          <Pills label={builder.term.group} options={builder.term.options.map((t) => ({ value: t, label: builder.term.option(t) }))} value={offer.term} onChange={(term) => onChange({ term })} compact />
        </div>
        <div className="flex flex-col gap-2">
          <span className={label}>{builder.freq.label}</span>
          <Pills label={builder.freq.group} options={builder.freq.options} value={offer.freq} onChange={(freq) => onChange({ freq })} />
        </div>
        <div className="flex flex-col gap-2">
          <span className={label}>{builder.fee.label}</span>
          <Pills label={builder.fee.label} options={builder.fee.options} value={offer.fee} onChange={(fee) => onChange({ fee })} />
        </div>
        <div className="flex flex-col gap-2">
          <span className={label}>{builder.method.label}</span>
          <Pills label={builder.method.group} options={builder.method.options} value={offer.method} onChange={(method) => onChange({ method })} />
        </div>
        {payoff ? (
          <label className="flex min-h-12 cursor-pointer items-center justify-between gap-2.5 self-end rounded-[16px] bg-tile px-3.5 text-body-sm">
            <span>
              <b className="block">{builder.payoff.label(payoff.funder)}</b>
              <span className="text-[11.5px] text-hint">{builder.payoff.note(payoff.balance)}</span>
            </span>
            <input type="checkbox" checked={offer.payoff} onChange={(e) => onChange({ payoff: e.target.checked })} className="m-0 h-5 w-5 accent-teal" />
          </label>
        ) : null}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2" aria-live="polite">
        {rules.map((x) => {
          const tone = x.ok ? "bg-mint-light" : x.warn ? "bg-amber-tint" : "bg-red-bg";
          const dot = x.ok ? "bg-teal" : x.warn ? "bg-amber" : "bg-red";
          return (
            <span key={x.note} className={`flex items-start gap-2 rounded-tile px-3 py-2.5 ${tone}`}>
              <span className={`mt-[5px] h-2 w-2 flex-none rounded-full ${dot}`} />
              <span className="min-w-0">
                <b className="block text-[12.5px]">{x.label}</b>
                <span className="text-label-sm text-hint">{x.note}</span>
              </span>
            </span>
          );
        })}
      </div>
    </Card>
  );
}
