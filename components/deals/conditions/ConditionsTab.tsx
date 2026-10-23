"use client";

import { useMemo, useState } from "react";
import { useReportWaiting } from "@/components/deals/DealLive";
import { sideCardsLabel, type ComposerFacts } from "@/lib/copy/deal-conditions";
import type { Got, Waived } from "@/lib/deal-conditions";
import type { ConditionsTabData } from "@/lib/data/views/deal-tabs";
import { ConditionsBoard } from "./ConditionsBoard";
import { deriveConditions } from "./derive";
import { RequestComposer } from "./RequestComposer";
import { RunwayHero } from "./RunwayHero";
import { FinalChecksCard, RecommendedCard, TermsCard } from "./SideCards";

/**
 * The Conditions & stips tab from design/Deal-Conditions.html, for the
 * deal in `data` (from the data layer).
 * Row 1: the funding runway (status panel and the road to funding).
 * Row 2: the conditions board (open cards and the done strip).
 * Row 3: terms of approval, final checks and recommended items.
 * Row 4: the request composer.
 * The board's edits live here so the runway follows them, and the tab
 * bar's Conditions count follows the conditions still waiting.
 */
export function ConditionsTab({ data }: { data: ConditionsTabData }) {
  const { conditions: c } = data;
  const [got, setGot] = useState<Got>({});
  const [waived, setWaived] = useState<Waived>({});
  const d = useMemo(() => ({ ...deriveConditions(c.items, got, waived, data.now), reasons: waived }), [c.items, got, waived, data.now]);
  useReportWaiting(d.waitingCount);

  const toggle = (k: string) => setGot((g) => ({ ...g, [k]: !g[k] }));
  const waive = (k: string, reason: string) => setWaived((w) => ({ ...w, [k]: reason }));

  const ask = c.items.find((it) => it.acceptsFile) ?? c.items[0];
  const facts: ComposerFacts | null = ask
    ? {
        dealName: data.merchantName,
        dealId: data.id,
        brokerCompany: data.brokerName ?? c.parties.broker.name,
        parties: c.parties,
        ask,
        street: data.street,
        me: data.me.name,
        funder: data.funder,
      }
    : null;

  return (
    <>
      <RunwayHero d={d} />
      <ConditionsBoard id={data.id} d={d} parties={c.parties} myInitials={data.me.initials} senior={data.senior} amount={data.amount} onToggle={toggle} onWaive={waive} />
      <section aria-label={sideCardsLabel} className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <TermsCard terms={c.terms} />
        <FinalChecksCard checks={c.finalChecks} lastAt={c.lastFullCheckAt} now={data.now} />
        <RecommendedCard items={c.recommended} />
      </section>
      {facts ? <RequestComposer facts={facts} /> : null}
    </>
  );
}
