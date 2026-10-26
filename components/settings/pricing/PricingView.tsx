"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  adjustments,
  bandLabel,
  disclosures as dc,
  earlyPayoffCard,
  example as ex,
  factorGrid as fg,
  guardrails as gr,
  industryAdjustments as ia,
  limits,
  pricingHeader as ph,
  rateTone,
  signedFactor,
  sizing,
  toneOf,
  type Tone,
} from "@/lib/copy/pricing";
import type { DisclosureStatus, Policy, Pricing } from "@/lib/data/types";
import { money, offerTerms } from "@/lib/offer-math";

/* Six shades from the prototype, cheap (mint) to expensive (amber). */
const rateFill = ["bg-mint-bg", "bg-rate-2", "bg-rate-3", "bg-amber-bg", "bg-rate-5", "bg-rate-6"];
const toneText: Record<Tone, string> = { good: "text-teal-deep", cost: "text-amber-deep", flat: "text-hint" };
const statusChip: Record<DisclosureStatus, string> = {
  active: "bg-mint-bg text-teal-dark",
  update: "bg-blue-bg text-blue-text",
  register: "bg-amber-bg text-amber-text",
};

const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";
const whiteCard = "box-border flex min-w-0 flex-col gap-2 rounded-card-lg border border-line bg-tile p-5 text-ink";
const greyCard = "box-border flex min-w-0 flex-col rounded-card-lg bg-card p-5 text-ink";
const mintCard = "box-border flex min-w-0 flex-col rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink";
const h2 = "m-0 font-heading text-card-title font-semibold";

/*
 * Design table: minmax(140px,1.2fr) minmax(140px,1.2fr) 110px 120px 110px
 * with a 640px minimum and sideways scroll. Here the columns flex, and
 * "Counsel review" then "Estimated APR" hide as the table narrows.
 */
const discCols =
  "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_110px_120px_minmax(0,140px)] items-center gap-3 @max-[640px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_110px_minmax(0,140px)] @max-[640px]:[&>:nth-child(4)]:hidden @max-[480px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,120px)] @max-[480px]:[&>:nth-child(3)]:hidden";

/**
 * Settings → Pricing & disclosures from design/Settings-Pricing.html and
 * its prototype. Clicking a rate in the grid selects it and the example
 * beside it is worked out with the shared offer math (computeOffer), so it
 * matches the Offer tab. Early payoff reads the same tier table the Offer
 * tab uses. The guardrail sliders update the highest factor any merchant
 * can see, and the two disclosure switches work. No hover. Every price
 * comes from the data layer (props); the sizing note quotes the policy.
 */
export function PricingView({ pricing: p, policy }: { pricing: Pricing; policy: Pick<Policy, "limits" | "maxDebtShare"> }) {
  const [cell, setCell] = useState(fg.start);
  const [up, setUp] = useState(p.guardrails.brokerUpsellPoints);
  const [floor, setFloor] = useState(p.guardrails.minMarginPercent);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => ({ forgive: p.forgiveUnearnedFees, brokerPay: p.showBrokerPay }));

  const bands = p.grid.map((b, i) => ({ band: bandLabel(b.minScore, b.maxScore), sub: fg.bandSub(i, p.grid.length), factors: b.factors }));
  const [r, c] = cell.split("-").map(Number);
  const band = bands[r];
  const factor = band.factors[c];
  const term = p.terms[c];
  // The example is the offer builder's own math, with the workspace's commission.
  const offer = offerTerms({ amount: ex.amount, factor, term, freq: "daily", fee: 0, method: "ach", payoff: false }, p.brokerPoints.newDeal / 100);

  const highestGrid = Math.max(...p.grid.flatMap((b) => b.factors));
  const highestIndustry = Math.max(...p.industryAdjustments.map((x) => x.delta));
  const highest = (highestGrid + highestIndustry + up / 100).toFixed(2);
  const maxMultiple = Math.max(...p.sizing.map((x) => x.multiple));
  const lowestScore = Math.min(...p.grid.map((b) => b.minScore));

  return (
    <>
      <section
        aria-labelledby="h-pr"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="h-pr" className="m-0 font-heading text-[24px] font-semibold">{ph.title}</h2>
          <span className="text-[12.5px] text-grey-text">{ph.text}</span>
        </div>
        <span role="status" className="inline-flex h-[42px] items-center rounded-pill bg-white/70 px-4 text-[12.5px] font-semibold text-hint">
          {ph.saved}
        </span>
      </section>

      {/* Grid beside its example: equal heights, the example's note sits at the bottom. */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-grid" className="box-border flex min-w-0 flex-[999_1_440px] flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
          <div className="flex flex-wrap items-end justify-between gap-2.5">
            <div>
              <h2 id="h-grid" className="m-0 font-heading text-[19px] font-semibold">{fg.title}</h2>
              <span className="text-label text-hint">{fg.subtitle}</span>
            </div>
            <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">
              {fg.edit}
            </button>
          </div>
          <div role="group" aria-label={fg.title} className="grid grid-cols-[110px_repeat(3,minmax(0,1fr))] gap-1.5">
            <span />
            {p.terms.map((t) => (
              <span key={t} className="text-center text-cap font-semibold uppercase text-hint">
                {fg.termLabel(t)}
              </span>
            ))}
            {bands.map((b, ri) => (
              <div key={b.band} className="contents">
                <span className="flex flex-col justify-center px-1.5">
                  <b className="text-body-sm">{b.band}</b>
                  <span className="text-[11.5px] text-hint">{b.sub}</span>
                </span>
                {b.factors.map((f, ci) => {
                  const key = `${ri}-${ci}`;
                  const on = key === cell;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      aria-label={`Score ${b.band}, ${p.terms[ci]} months, factor ${f.toFixed(2)}`}
                      onClick={() => setCell(key)}
                      className={`h-[54px] cursor-pointer rounded-tile border-0 font-heading text-card-title-sm font-bold tabular-nums ${on ? "bg-teal text-white shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]" : `${rateFill[rateTone(f)]} text-ink`}`}
                    >
                      {f.toFixed(2)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <span className="text-[11.5px] text-hint">{fg.note(lowestScore)}</span>
        </section>

        <aside
          aria-labelledby="h-ex"
          aria-live="polite"
          className="box-border flex min-w-0 flex-[1_1_280px] flex-col gap-2.5 rounded-card-lg border border-line bg-tile p-5 text-ink shadow-[0_18px_40px_-30px_rgba(15,21,19,.35)]"
        >
          <span className="self-start rounded-pill bg-mint-bg px-[9px] py-0.5 text-[10.5px] font-bold text-teal-dark">{ex.chip(ex.amount)}</span>
          <h2 id="h-ex" className="m-0 font-heading text-[19px] font-semibold">{ex.title(band.band, term, factor)}</h2>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              [ex.tiles.payback, money(offer.payback), ""],
              [ex.tiles.daily, money(offer.daily), ""],
              [ex.tiles.apr, `${Math.round(offer.apr)}%`, ""],
              [ex.tiles.margin, money(offer.margin), "text-teal-deep"],
            ].map(([k, v, cls]) => (
              <span key={k} className="min-w-0 rounded-tile bg-card px-3 py-2.5">
                <span className="block text-label-sm text-hint">{k}</span>
                <b className={`font-heading text-card-title-sm tabular-nums tracking-[-0.03em] ${cls}`}>{v}</b>
              </span>
            ))}
          </div>
          <span className="mt-auto text-label text-muted">{ex.note(p.brokerPoints.newDeal)}</span>
        </aside>
      </div>

      <div className="@container flex flex-col gap-3.5">
        <section aria-label="Adjustments, limits and early payoff" className={row3}>
          <article aria-labelledby="h-adj" className={whiteCard}>
            <h2 id="h-adj" className={h2}>{adjustments.title}</h2>
            {adjustments.rows(p).map((a) => (
              <span key={a.label} className="flex justify-between gap-2 rounded-tile bg-card px-3 py-2.5 text-[12.5px]">
                <span>{a.label}</span>
                <b className={a.delta !== undefined ? toneText[toneOf(a.delta)] : ""}>{a.delta !== undefined ? signedFactor(a.delta) : a.text}</b>
              </span>
            ))}
          </article>

          <article aria-labelledby="h-limits" className={`${greyCard} gap-2`}>
            <h2 id="h-limits" className={h2}>{limits.title}</h2>
            {limits.rows(p).map((l) => (
              <span key={l.label} className="flex justify-between gap-2 rounded-tile bg-tile px-3 py-2.5 text-[12.5px]">
                <span>{l.label}</span>
                <b className="text-right">{l.value}</b>
              </span>
            ))}
          </article>

          <article aria-labelledby="h-early" className={`${mintCard} gap-2`}>
            <h2 id="h-early" className={h2}>{earlyPayoffCard.title}</h2>
            <span className="text-label text-grey-text">{earlyPayoffCard.text}</span>
            <div className="mt-auto grid grid-cols-3 gap-1.5">
              {p.earlyPayoff.map((t) => (
                <span key={t.days} className="min-w-0 rounded-[16px] bg-tile px-2.5 py-3 text-center">
                  <b className="block font-heading text-card-title-lg tabular-nums tracking-[-0.03em]">{t.factor.toFixed(2)}</b>
                  <span className="text-label-sm text-muted">{earlyPayoffCard.dayLabel(t.days)}</span>
                </span>
              ))}
            </div>
          </article>
        </section>

        <section aria-label="Industry, sizing and guardrails" className={row3}>
          <article aria-labelledby="h-ind" className={whiteCard}>
            <div className="flex items-center justify-between">
              <h2 id="h-ind" className={h2}>{ia.title}</h2>
              <button type="button" className="h-[30px] cursor-pointer rounded-pill border-0 bg-card px-3 text-[11.5px] font-semibold text-ink">
                {ia.edit}
              </button>
            </div>
            <span className="text-label text-hint">{ia.text}</span>
            {p.industryAdjustments.map((x) => (
              <span key={x.industry} className="flex items-center justify-between gap-2 rounded-[12px] bg-card px-3 py-[9px] text-[12.5px]">
                <span>{x.industry}</span>
                <b className={`font-heading tabular-nums tracking-[-0.03em] ${toneText[toneOf(x.delta)]}`}>{signedFactor(x.delta)}</b>
              </span>
            ))}
          </article>

          <article aria-labelledby="h-size" className={`${greyCard} gap-2.5`}>
            <h2 id="h-size" className={h2}>{sizing.title}</h2>
            <span className="text-label text-hint">{sizing.text}</span>
            {/* Label and value columns size to their text (shared across rows) so the bars get the room. */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-2.5 gap-y-2.5 rounded-[18px] bg-white/55 p-3.5">
              {p.sizing.map((s, i) => {
                const label = bandLabel(s.minScore, s.maxScore);
                return (
                  <div key={label} className="grid grid-cols-subgrid col-span-3 items-center text-[12.5px]">
                    <b>{label}</b>
                    <ProgressBar value={(s.multiple / maxMultiple) * 100} height={10} track="tile" delay={0.2 + i * 0.1} aria-label={`${label}: up to ${sizing.multipleLabel(s.multiple)} monthly revenue`} />
                    <b className="text-right font-heading tabular-nums tracking-[-0.03em]">{sizing.multipleLabel(s.multiple)}</b>
                  </div>
                );
              })}
            </div>
            <span className="mt-auto text-[11.5px] text-muted">{sizing.note(policy)}</span>
          </article>

          <article aria-labelledby="h-up" className={`${mintCard} gap-2.5`}>
            <h2 id="h-up" className={h2}>{gr.title}</h2>
            <div className="flex flex-col gap-1.5 rounded-[16px] bg-tile px-3.5 py-3">
              <span className="flex justify-between gap-2 text-[12.5px]">
                <b>{gr.upsell.label}</b>
                <b className="font-heading tabular-nums tracking-[-0.03em]">{up ? `+0.0${up}` : gr.upsell.none}</b>
              </span>
              <input
                type="range"
                aria-label={gr.upsell.aria}
                min={gr.upsell.min}
                max={gr.upsell.max}
                step={gr.upsell.step}
                value={up}
                aria-valuetext={up ? `+0.0${up}` : gr.upsell.none}
                onChange={(e) => setUp(Number(e.target.value))}
                className="w-full cursor-pointer accent-teal"
              />
              <span className="text-[11.5px] text-hint">{gr.upsell.hint}</span>
            </div>
            <div className="flex flex-col gap-1.5 rounded-[16px] bg-tile px-3.5 py-3">
              <span className="flex justify-between gap-2 text-[12.5px]">
                <b>{gr.floor.label}</b>
                <b className="font-heading tabular-nums tracking-[-0.03em]">{floor}%</b>
              </span>
              <input
                type="range"
                aria-label={gr.floor.aria}
                min={gr.floor.min}
                max={gr.floor.max}
                step={gr.floor.step}
                value={floor}
                aria-valuetext={`${floor}%`}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full cursor-pointer accent-teal"
              />
              <span className="text-[11.5px] text-hint">{gr.floor.hint}</span>
            </div>
            <span className="mt-auto text-[11.5px] text-grey-text" aria-live="polite">
              {gr.highest} <b className="font-heading tabular-nums tracking-[-0.03em]">{highest}</b>
            </span>
          </article>
        </section>

        <section aria-labelledby="h-disc" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-[22px] text-ink">
          <div className="flex flex-wrap items-end justify-between gap-2.5">
            <div>
              <h2 id="h-disc" className="m-0 font-heading text-[19px] font-semibold">{dc.title}</h2>
              <span className="text-label text-hint">{dc.subtitle}</span>
            </div>
            <button type="button" className="h-9 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-ink">
              {dc.add}
            </button>
          </div>
          <div className="@container flex flex-col gap-1.5">
            <div className={`${discCols} px-3.5 pb-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
              {dc.columns.map((col) => (
                <span key={col} className="truncate">
                  {col}
                </span>
              ))}
            </div>
            {p.disclosures.map((d) => (
              <div key={d.states} className={`${discCols} rounded-[16px] bg-tile px-3.5 py-[11px] text-[12.5px]`}>
                <b className="truncate">{d.states}</b>
                <span className="truncate text-grey-text">{d.template}</span>
                <span className="truncate">{dc.apr(d.apr)}</span>
                <span className="truncate text-hint">{dc.review(d)}</span>
                <span className={`max-w-full justify-self-start truncate rounded-pill px-[9px] py-[3px] text-label-sm font-bold ${statusChip[d.status]}`}>{dc.statusLabel[d.status]}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2">
            {dc.toggles.map((t) => (
              <label key={t.key} className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px]">
                <span className="min-w-0">
                  <b className="block">{t.title}</b>
                  <span className="text-[11.5px] text-hint">{t.hint}</span>
                </span>
                <input
                  type="checkbox"
                  checked={!!toggles[t.key]}
                  onChange={() => setToggles((x) => ({ ...x, [t.key]: !x[t.key] }))}
                  className="m-0 h-5 w-5 flex-none cursor-pointer accent-teal"
                />
              </label>
            ))}
          </div>
          <span className="text-[11.5px] text-hint">{dc.note}</span>
        </section>
      </div>
    </>
  );
}
