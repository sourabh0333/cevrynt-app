"use client";

import { useMemo, useState } from "react";
import type { ConditionKey } from "@/lib/sample-data/deal-conditions";
import { ConditionsBoard } from "./ConditionsBoard";
import { deriveConditions, type Got, type Waived } from "./derive";
import { RequestComposer } from "./RequestComposer";
import { RunwayHero } from "./RunwayHero";
import { FinalChecksCard, RecommendedCard, TermsCard } from "./SideCards";

/**
 * The Conditions & stips tab from design/Deal-Conditions.html.
 * Row 1: the funding runway (status panel and the road to funding).
 * Row 2: the conditions board (open cards and the done strip).
 * Row 3: terms of approval, final checks and recommended items.
 * Row 4: the request composer.
 * The board's edits live here so the runway follows them.
 */
export function ConditionsTab() {
  const [got, setGot] = useState<Got>({});
  const [waived, setWaived] = useState<Waived>({});
  const d = useMemo(() => ({ ...deriveConditions(got, waived), reasons: waived }), [got, waived]);

  const toggle = (k: ConditionKey) => setGot((g) => ({ ...g, [k]: !g[k] }));
  const waive = (k: ConditionKey, reason: string) => setWaived((w) => ({ ...w, [k]: reason }));

  return (
    <>
      <RunwayHero d={d} />
      <ConditionsBoard d={d} onToggle={toggle} onWaive={waive} />
      <section aria-label="Terms, final checks and recommended items" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <TermsCard />
        <FinalChecksCard />
        <RecommendedCard />
      </section>
      <RequestComposer />
    </>
  );
}
