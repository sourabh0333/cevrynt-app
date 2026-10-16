"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { scenarioCard, type ScenarioKey } from "@/lib/sample-data/deal-positions";

const num = "block font-heading text-[26px] font-semibold tabular-nums tracking-[-0.03em]";
const tile = "rounded-[18px] border border-teal/7 bg-white/10 p-3.5";
const barFill = { "amber-light": "bg-amber-light", mint: "bg-mint" };

/**
 * "Second position or payoff?" from design/Deal-Positions.html and its
 * prototype: a Keep both / Pay off Kingsway switch on the mint card, with
 * the four figures, the share bar and the verdict updating. The bar grows
 * in each time the scenario changes. No hover.
 */
export function ScenarioCard() {
  const [which, setWhich] = useState<ScenarioKey>("keep");
  const sc = scenarioCard.scenarios[which];
  const { labels } = scenarioCard;
  const barStyle: CSSProperties & { "--delay"?: string } = { width: `${sc.sharePercent}%`, "--delay": "0.1s" };

  return (
    <article
      aria-labelledby="h-scn"
      className="box-border flex min-w-0 flex-col gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink col-span-2 max-[980px]:col-span-1"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="h-scn" className="m-0 font-heading text-[21px] font-semibold">{scenarioCard.title}</h2>
          <div className="mt-[3px] text-[12.5px] text-muted">{scenarioCard.subtitle}</div>
        </div>
        <div role="group" aria-label="Scenario" className="flex gap-0.5 rounded-pill bg-white/10 p-1">
          {scenarioCard.options.map((o) => {
            const on = o.value === which;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                onClick={() => setWhich(o.value)}
                className={`h-[34px] cursor-pointer rounded-pill border-0 px-3.5 text-label font-semibold ${on ? "bg-card text-ink" : "bg-transparent text-muted"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5" aria-live="polite">
        <span className={tile}>
          <span className="text-label text-muted">{labels.cash}</span>
          <b className={num}>{sc.cash}</b>
          <span className="text-[11.5px] text-muted">{sc.cashNote}</span>
        </span>
        <span className={tile}>
          <span className="text-label text-muted">{labels.daily}</span>
          <b className={num}>{sc.daily}</b>
          <span className="text-[11.5px] text-muted">{sc.dailyNote}</span>
        </span>
        <span className={tile}>
          <span className="text-label text-muted">{labels.share}</span>
          <b className={num}>{sc.share}</b>
          <span className="mt-1.5 block h-1.5 rounded-[3px] bg-teal/7">
            <span key={which} className={`anim-grow-x block h-1.5 rounded-[3px] ${barFill[sc.shareColor]}`} style={barStyle} />
          </span>
        </span>
        <span className={tile}>
          <span className="text-label text-muted">{labels.position}</span>
          <b className={num}>{sc.position}</b>
          <span className="text-[11.5px] text-muted">{sc.positionNote}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-white/20 bg-teal/7 px-3.5 py-3">
        <span className="text-[12.5px] text-muted">{sc.verdict}</span>
        <Link
          href={scenarioCard.cta.href}
          className="inline-flex h-[38px] items-center whitespace-nowrap rounded-pill bg-teal px-4 text-[12.5px] font-semibold text-white no-underline shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
        >
          {scenarioCard.cta.label}
        </Link>
      </div>
    </article>
  );
}
