"use client";

import { useMemo, useState } from "react";
import { decisionCard, decisionSections, policyRows, type Outcome } from "@/lib/copy/deal-decision";
import type { DecisionTabData } from "@/lib/data/views/deal-tabs";
import { computeOffer, money } from "@/lib/offer-math";
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
 * The Decision & memo tab from design/Deal-Decision.html, for the deal in
 * `data` (from the data layer).
 * Row 1: your decision (two columns) and the policy check.
 * Row 2: the credit memo with its sticky Sections menu.
 * Row 3: who signs off and the decision record (two columns).
 * The decision state lives here so the sign-off and record follow it.
 * Offer figures come from the shared offer math with the deal's own
 * figures; the policy check and approval line come from the policy.
 */
export function DecisionTab({ data }: { data: DecisionTabData }) {
  const suggested = useMemo(() => Object.fromEntries(data.decision.suggestedReasons.map((k) => [k, true])), [data.decision.suggestedReasons]);
  const [s, setS] = useState<DecisionState>({
    out: "approve",
    picked: suggested,
    extra: decisionCard.conditions.start,
    counter: data.decision.counter,
    counterFactorText: data.decision.counter.factor.toFixed(2),
    note: "",
  });
  const [recordedAt, setRecordedAt] = useState<Date | null>(null);

  const pick = (out: Outcome) => {
    setRecordedAt(null);
    setS((x) => ({ ...x, out, picked: out === "decline" ? {} : suggested }));
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

  const recommended = data.recommended;
  const share = computeOffer(recommended, data.figures, data.offerPolicy).share;
  const rules = policyRows(data, recommended.amount, share);
  const label = decisionCard.label(s.out, money(recommended.amount), money(s.counter.amount));

  return (
    <>
      <section aria-label={decisionSections.decision} className={row}>
        <DecisionCard
          data={data}
          s={s}
          recordedAt={recordedAt}
          onPick={pick}
          onToggleReason={toggle("picked")}
          onToggleExtra={toggle("extra")}
          onCounter={counter}
          onNote={(note) => setS((x) => ({ ...x, note }))}
          onRecord={() => setRecordedAt((r) => (r ? null : new Date()))}
        />
        <PolicyCard rules={rules} version={data.policy.version} />
      </section>
      <CreditMemo data={data} rules={rules} />
      <section aria-label={decisionSections.signOff} className={row}>
        <WhoSignsOff recorded={recordedAt !== null} amount={recommended.amount} limit={data.policy.limits.seniorAbove} me={data.me} senior={data.senior} />
        <DecisionRecord
          recordedAt={recordedAt}
          label={label}
          agrees={s.out === "approve"}
          me={data.me.name}
          suggested={{ amount: recommended.amount, score: data.score, version: data.policy.version, at: data.decision.suggestedAt }}
        />
      </section>
    </>
  );
}
