"use client";

import { useState } from "react";
import { money, recommendedOffer } from "@/lib/offer-math";
import { counterStart, decisionCard, type Outcome } from "@/lib/sample-data/deal-decision";
import { CreditMemo } from "./CreditMemo";
import { DecisionCard } from "./DecisionCard";
import { PolicyCard } from "./PolicyCard";
import { DecisionRecord, WhoSignsOff } from "./SignOffRow";

export type DecisionState = {
  out: Outcome;
  picked: Record<string, boolean>;
  extra: Record<string, boolean>;
  counter: { amount: number; factor: number; term: number };
  /** the factor field as typed, so "1.3" can become "1.36" */
  counterFactorText: string;
  note: string;
};

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Decision & memo tab from design/Deal-Decision.html.
 * Row 1: your decision (two columns) and the policy check.
 * Row 2: the credit memo with its sticky Sections menu.
 * Row 3: who signs off and the decision record (two columns).
 * The decision state lives here so the sign-off and record follow it.
 */
export function DecisionTab() {
  const [s, setS] = useState<DecisionState>({
    out: "approve",
    picked: decisionCard.reasons.start,
    extra: decisionCard.conditions.start,
    counter: counterStart,
    counterFactorText: counterStart.factor.toFixed(2),
    note: "",
  });
  const [recordedAt, setRecordedAt] = useState<Date | null>(null);

  const pick = (out: Outcome) => {
    setRecordedAt(null);
    setS((x) => ({ ...x, out, picked: out === "decline" ? {} : decisionCard.reasons.start }));
  };
  const toggle = (field: "picked" | "extra") => (k: string) => setS((x) => ({ ...x, [field]: { ...x[field], [k]: !x[field][k] } }));
  const counter = (patch: Partial<DecisionState["counter"]> & { factorText?: string }) =>
    setS((x) => {
      const { factorText, ...rest } = patch;
      const next = { ...x, counter: { ...x.counter, ...rest } };
      if (factorText !== undefined) {
        next.counterFactorText = factorText;
        const n = Number(factorText);
        if (Number.isFinite(n) && n > 1 && n < 2) next.counter = { ...next.counter, factor: n };
      }
      return next;
    });

  const label = decisionCard.label(s.out, money(recommendedOffer.amount), money(s.counter.amount));

  return (
    <>
      <section aria-label="Your decision and the policy check" className={row}>
        <DecisionCard
          s={s}
          recordedAt={recordedAt}
          onPick={pick}
          onToggleReason={toggle("picked")}
          onToggleExtra={toggle("extra")}
          onCounter={counter}
          onNote={(note) => setS((x) => ({ ...x, note }))}
          onRecord={() => setRecordedAt((r) => (r ? null : new Date()))}
        />
        <PolicyCard />
      </section>
      <CreditMemo />
      <section aria-label="Who signs off and the decision record" className={row}>
        <WhoSignsOff recorded={recordedAt !== null} />
        <DecisionRecord recordedAt={recordedAt} label={label} agrees={s.out === "approve"} />
      </section>
    </>
  );
}
