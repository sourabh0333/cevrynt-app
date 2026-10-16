"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { recommendation as rec } from "@/lib/sample-data/deal";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const short = (n: number) => `$${Math.round(n / 1000)}K`;

/**
 * "Recommendation" from design/Deal-Summary.html: the suggested amount on
 * the deeper sand card, a floor-to-ceiling slider, and the three terms
 * (factor, term, daily) that update as the slider moves. The daily payment
 * is amount × factor over the term's payment days. No hover.
 */
export function RecommendationCard() {
  const [amount, setAmount] = useState(rec.amount);
  const pct = ((amount - rec.floor) / (rec.ceiling - rec.floor)) * 100;
  const daily = Math.round((amount * rec.factor) / rec.paymentDays);
  const diff = rec.requested - amount;
  const note =
    diff > 0
      ? `${money(diff)} below request ${rec.reason}`
      : diff === 0
        ? "Matches the requested amount."
        : `${money(-diff)} above the request.`;
  const fill: CSSProperties & { "--delay"?: string } = { width: `${pct}%`, "--delay": "0.2s" };

  return (
    <article aria-labelledby="h-rec" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-rec" className="m-0 font-heading text-[20px] font-semibold">{rec.title}</h2>
        <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{rec.chip}</span>
      </div>

      <div>
        <b className="font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em]" aria-live="polite">
          {money(amount)}
        </b>
        <div className="mt-1 text-[11.5px] text-muted">{note}</div>
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
            aria-label="Advance amount"
            min={rec.floor}
            max={rec.ceiling}
            step={rec.step}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="absolute top-[-8px] left-0 m-0 h-6 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold tracking-[0.08em] uppercase text-muted">
          <span>Floor {short(rec.floor)}</span>
          <span>Ceiling {short(rec.ceiling)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <Term label="Factor" value={rec.factor.toFixed(2)} />
        <Term label="Term" value={`${rec.termMonths} mo`} />
        <Term label="Daily" value={money(daily)} />
      </div>

      <Link
        href={rec.cta.href}
        className="mt-auto grid h-11 place-items-center rounded-pill bg-teal text-body-sm font-semibold text-white no-underline"
      >
        {rec.cta.label}
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
