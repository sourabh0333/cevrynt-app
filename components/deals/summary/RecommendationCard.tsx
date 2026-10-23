"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { dealTabHref } from "@/lib/copy/deal";
import { recommendationCopy as t } from "@/lib/copy/deal-summary";
import type { DealTabsData } from "@/lib/data/views/deal-tabs";
import { computeOffer } from "@/lib/offer-math";
import { money } from "@/lib/format";

/** The slider's step, from the design. */
const STEP = 500;

/**
 * "Recommendation" from design/Deal-Summary.html: the suggested amount on
 * the deeper sand card, a floor-to-ceiling slider (the deal's own range,
 * the same as the offer builder's), and the three terms (factor, term,
 * daily) that update as the slider moves. The daily payment comes from the
 * shared offer math. No hover.
 */
export function RecommendationCard({ data }: { data: DealTabsData }) {
  const rec = data.summary.recommendation;
  const { floor, ceiling } = data.offerPolicy;
  const [amount, setAmount] = useState(rec.amount);
  const pct = ((amount - floor) / (ceiling - floor)) * 100;
  const daily = computeOffer({ ...data.recommended, amount }, data.figures, data.offerPolicy).daily;
  const fill: CSSProperties & { "--delay"?: string } = { width: `${pct}%`, "--delay": "0.2s" };

  return (
    <article aria-labelledby="h-rec" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-rec" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{t.decision[rec.decision]}</span>
      </div>

      <div>
        <b className="font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em]" aria-live="polite">
          {money(amount)}
        </b>
        <div className="mt-1 text-[11.5px] text-muted">{t.note(rec.requested - amount, rec.reason)}</div>
      </div>

      <div>
        <div className="relative h-2 rounded-[4px] bg-ink/10">
          <div className="anim-grow-x absolute left-0 h-full rounded-[4px] bg-teal" style={fill} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-5px] box-border h-[18px] w-[18px] -ml-[9px] rounded-full border-[3px] border-teal bg-card"
            style={{ left: `${pct}%` }}
          />
          <input
            type="range"
            aria-label={t.slider}
            min={floor}
            max={ceiling}
            step={STEP}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="absolute top-[-8px] left-0 m-0 h-6 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold tracking-[0.08em] uppercase text-muted">
          <span>{t.floor(floor)}</span>
          <span>{t.ceiling(ceiling)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <Term label={t.terms.factor} value={rec.factor.toFixed(2)} />
        <Term label={t.terms.term} value={t.termValue(rec.termMonths)} />
        <Term label={t.terms.daily} value={money(daily)} />
      </div>

      <Link
        href={dealTabHref(data.id, { path: "/offer" })}
        className="mt-auto grid h-11 place-items-center rounded-pill bg-teal text-body-sm font-semibold text-white no-underline"
      >
        {t.cta}
      </Link>
    </article>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-tile bg-white/65 px-2.5 py-[9px]">
      <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-hint">{label}</span>
      <b className="block font-heading text-[16px] tabular-nums tracking-[-0.03em]">{value}</b>
    </span>
  );
}
