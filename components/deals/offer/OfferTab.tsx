"use client";

import { useMemo, useState } from "react";
import type { Pricing } from "@/lib/data/types";
import { computeOffer, harborFigures, recommendedOffer, type OfferInput, type OfferPolicy } from "@/lib/offer-math";
import { DisclosureCard, SendCard } from "./DisclosureRow";
import { EarlyPayoffCard, OfferHistoryCard } from "./EarlyPayoffRow";
import { MerchantPays } from "./MerchantPays";
import { OfferBuilder } from "./OfferBuilder";
import { PresetCards } from "./PresetCards";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

type Props = {
  /** the workspace policy's debt limit and approval line, plus this deal's range */
  policy: OfferPolicy;
  /** Pricing's early payoff table */
  earlyPayoffTiers: Pricing["earlyPayoff"];
};

/**
 * The Offer & disclosures tab from design/Deal-Offer.html.
 * Row 1: the builder and the live result. Row 2: the three presets.
 * Row 3: early payoff tiers and the offer history.
 * Row 4: the cost disclosure and the send card.
 * The builder edits `offer`; "Use this offer" copies it into `chosen`,
 * which the disclosure and the send card print. Every number on the tab
 * comes from lib/offer-math.ts, checked against the policy and priced with
 * the early payoff table the page loaded from the data layer.
 */
export function OfferTab({ policy, earlyPayoffTiers }: Props) {
  const [offer, setOffer] = useState<OfferInput>(recommendedOffer);
  const [chosen, setChosen] = useState<OfferInput>(recommendedOffer);
  const result = useMemo(() => computeOffer(offer, harborFigures, policy), [offer, policy]);
  const chosenResult = useMemo(() => computeOffer(chosen, harborFigures, policy), [chosen, policy]);
  const change = (patch: Partial<OfferInput>) => setOffer((o) => ({ ...o, ...patch }));

  return (
    <>
      <section aria-label="Offer builder and what the merchant pays" className={row}>
        <OfferBuilder offer={offer} result={result} policy={policy} onChange={change} onReset={() => setOffer(recommendedOffer)} />
        <MerchantPays offer={offer} result={result} maxShare={policy.maxShare} onUse={() => setChosen(offer)} />
      </section>
      <PresetCards offer={offer} policy={policy} onPick={change} />
      <section aria-label="Early payoff and offer history" className={row}>
        <EarlyPayoffCard offer={offer} table={earlyPayoffTiers} />
        <OfferHistoryCard />
      </section>
      <section aria-label="Cost disclosure and sending the offer" className={row}>
        <DisclosureCard offer={chosen} policy={policy} />
        <SendCard needsSenior={chosenResult.needsSenior} withinPolicy={chosenResult.withinPolicy} approvalLimit={policy.approvalLimit} />
      </section>
    </>
  );
}
