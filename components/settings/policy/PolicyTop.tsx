"use client";

import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/Switch";
import {
  outcomeLabel,
  policyHeader as ph,
  ruleGroups as groups,
  ruleParts,
  ruleSentence,
  rulesCard as rc,
  simulator as sm,
  sliderText,
  type RulePart,
} from "@/lib/copy/policy";
import type { Policy, RuleOutcome } from "@/lib/data/types";
import { simInputFrom, simRanges, simulatePolicy, type SimInput, type SimTone } from "@/lib/policy-sim";

const outcomeChip: Record<RuleOutcome, string> = {
  decline: "bg-red-bg text-red-text",
  review: "bg-amber-bg text-amber-text",
  flag: "bg-blue-bg text-blue-text",
};
const deltaTone: Record<SimTone, string> = { flat: "text-hint", good: "text-teal-deep", bad: "text-coral-text" };

/** A changeable value inside a rule sentence. */
function GreenValue({ children }: { children: string }) {
  return (
    <span className="mx-0.5 inline-flex items-center rounded-[8px] bg-mint-bg px-[9px] py-0.5 font-heading font-bold tabular-nums tracking-[-0.03em] text-teal-dark">
      {children}
    </span>
  );
}

function Sentence({ parts, sim }: { parts: RulePart[]; sim: SimInput }) {
  return (
    <span className="min-w-0 text-body-sm leading-[1.7]">
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : "value" in p ? (
          <GreenValue key={i}>{p.value}</GreenValue>
        ) : (
          <GreenValue key={i}>{sliderText[p.slider](sim[p.slider])}</GreenValue>
        ),
      )}
    </span>
  );
}

/**
 * The top of Settings → Policy from design/Settings.html and its prototype:
 * the mint header with Publish, the Rules card, and the Policy simulator.
 * Moving a slider updates the simulator's tiles and verdict live (shared
 * math in lib/policy-sim.ts) and the matching green value in the rules.
 * Any change, a slider or a rule switched off, turns "Published" into
 * "Publish as version 4". The simulator sticks while the rules scroll and
 * never scrolls or shrinks itself. The rules, their values and the
 * simulator's starting point all come from the live policy (props).
 */
export function PolicyTop({ policy }: { policy: Policy }) {
  const live = useMemo(() => simInputFrom(policy), [policy]);
  const ruleGroups = useMemo(
    () =>
      groups.map((g) => ({
        title: g.title,
        rules: g.ids.flatMap((id) => {
          const r = policy.rules.find((x) => x.id === id);
          return r ? [{ ...r, parts: ruleParts[id](policy) }] : [];
        }),
      })),
    [policy],
  );
  const [sim, setSim] = useState<SimInput>(live);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(policy.rules.map((r) => [r.id, r.on])));

  const result = simulatePolicy(sim, live);
  const rulesChanged = ruleGroups.some((g) => g.rules.some((r) => on[r.id] !== r.on));
  const changed = result.changed || rulesChanged;
  const verdictBox = !result.changed ? "bg-card text-grey-text" : result.risky ? "bg-red-bg text-red-text" : "bg-mint-light text-teal-dark";

  return (
    <>
      <section
        aria-labelledby="h-pol"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill bg-tile px-[11px] py-1 text-[11.5px] font-semibold text-teal-deep">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {ph.live(policy.version)}
          </span>
          <h2 id="h-pol" className="m-0 font-heading text-[24px] font-semibold">{ph.title}</h2>
          <span className="text-[12.5px] text-grey-text">{ph.text(policy.rules.length)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
            {ph.upload}
          </button>
          <button
            type="button"
            disabled={!changed}
            aria-live="polite"
            className={`h-[42px] rounded-pill border-0 px-4 text-[12.5px] font-semibold ${changed ? "cursor-pointer bg-teal text-white" : "cursor-default bg-white/60 text-hint"}`}
          >
            {changed ? ph.publishNext(policy.version + 1) : ph.published}
          </button>
        </div>
      </section>

      {/* @container so the simulator only sticks while it sits beside the rules. */}
      <div className="@container">
        <div className="flex flex-wrap items-start gap-3.5">
          <section aria-labelledby="h-rules" className="box-border flex min-w-0 flex-[999_1_460px] flex-col gap-3.5 rounded-card-lg bg-card p-5 text-ink">
            <div className="flex flex-wrap items-end justify-between gap-2.5">
              <div>
                <h2 id="h-rules" className="m-0 font-heading text-[19px] font-semibold">{rc.title}</h2>
                <span className="text-label text-hint">{rc.subtitle}</span>
              </div>
              <button type="button" className="h-9 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-ink">
                {rc.add}
              </button>
            </div>
            {ruleGroups.map((g) => (
              <div key={g.title} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between px-1 pt-1.5 pb-0.5">
                  <b className="text-[13.5px]">{g.title}</b>
                  <span className="text-[11.5px] text-hint">{rc.count(g.rules.length)}</span>
                </div>
                {g.rules.map((r) => (
                  <div
                    key={r.id}
                    className={`grid grid-cols-[minmax(0,1fr)_92px_44px] items-center gap-3 rounded-[16px] bg-tile px-3.5 py-3 ${on[r.id] ? "" : "text-hint"}`}
                  >
                    <Sentence parts={r.parts} sim={sim} />
                    <span className={`justify-self-start whitespace-nowrap rounded-pill px-2.5 py-1 text-label-sm font-bold ${on[r.id] ? outcomeChip[r.outcome] : "bg-page text-hint"}`}>
                      {outcomeLabel[r.outcome]}
                    </span>
                    <Switch
                      className="justify-self-end"
                      checked={on[r.id]}
                      onChange={(v) => setOn((x) => ({ ...x, [r.id]: v }))}
                      label={ruleSentence(r.parts, sim)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </section>

          <aside
            aria-labelledby="h-sim"
            className="sticky top-0 box-border flex min-w-0 max-w-full flex-[1_1_320px] flex-col gap-3.5 self-start rounded-card-lg border border-line bg-tile p-5 text-ink shadow-[0_18px_40px_-30px_rgba(15,21,19,.35)] [&>*]:flex-shrink-0 @max-[794px]:static"
          >
            <div>
              <span className="mb-1.5 inline-block rounded-pill bg-mint-bg px-[9px] py-0.5 text-[10.5px] font-bold text-teal-dark">{sm.chip}</span>
              <h2 id="h-sim" className="m-0 font-heading text-[19px] font-semibold">{sm.title}</h2>
              <span className="text-label text-hint">{sm.subtitle}</span>
            </div>
            <div className="flex flex-col gap-3">
              {sm.sliders.map((s) => {
                const range = simRanges[s.key];
                return (
                  <div key={s.key}>
                    <div className="flex justify-between text-[12.5px]">
                      <label htmlFor={`s-${s.key}`}>{s.label}</label>
                      <b>{sliderText[s.key](sim[s.key])}</b>
                    </div>
                    <input
                      id={`s-${s.key}`}
                      type="range"
                      min={range.min}
                      max={range.max}
                      step={range.step}
                      value={sim[s.key]}
                      aria-valuetext={sliderText[s.key](sim[s.key])}
                      onChange={(e) => setSim((x) => ({ ...x, [s.key]: Number(e.target.value) }))}
                      className="w-full cursor-pointer accent-teal"
                    />
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-1.5" aria-live="polite">
              {result.tiles.map((t) => (
                <span key={t.key} className="min-w-0 rounded-[16px] bg-card p-3">
                  <span className="block text-label-sm text-hint">{sm.tileLabel[t.key]}</span>
                  <b className="block font-heading text-[19px] tabular-nums tracking-[-0.03em]">{t.value}</b>
                  <span className={`text-label-sm font-bold ${deltaTone[t.tone]}`}>{t.delta}</span>
                </span>
              ))}
            </div>
            <div className={`rounded-[16px] px-3.5 py-3 text-[12.5px] ${verdictBox}`}>{sm.verdict[result.verdict]}</div>
            <button
              type="button"
              onClick={() => setSim(live)}
              className="h-10 min-h-10 cursor-pointer rounded-pill border-0 bg-card text-[12.5px] font-semibold text-ink"
            >
              {sm.reset}
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}
