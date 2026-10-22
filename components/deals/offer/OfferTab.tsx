"use client";

import { useMemo, useState } from "react";
import { computeOffer, recommendedOffer, type OfferInput } from "@/lib/offer-math";
import { DisclosureCard, SendCard } from "./DisclosureRow";
import { EarlyPayoffCard, OfferHistoryCard } from "./EarlyPayoffRow";
import { MerchantPays } from "./MerchantPays";
import { OfferBuilder } from "./OfferBuilder";
import { PresetCards } from "./PresetCards";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Offer & disclosures tab from design/Deal-Offer.html.
 * Row 1: the builder and the live result. Row 2: the three presets.
 * Row 3: early payoff tiers and the offer history.
 * Row 4: the cost disclosure and the send card.
 * The builder edits `offer`; "Use this offer" copies it into `chosen`,
 * which the disclosure and the send card print. Every number on the tab
 * comes from lib/offer-math.ts.
 */
export function OfferTab() {
  const [offer, setOffer] = useState<OfferInput>(recommendedOffer);
  const [chosen, setChosen] = useState<OfferInput>(recommendedOffer);
  const result = useMemo(() => computeOffer(offer), [offer]);
  const chosenResult = useMemo(() => computeOffer(chosen), [chosen]);
  const change = (patch: Partial<OfferInput>) => setOffer((o) => ({ ...o, ...patch }));

  return (
    <>
      <section aria-label="Offer builder and what the merchant pays" className={row}>
        <OfferBuilder offer={offer} result={result} onChange={change} onReset={() => setOffer(recommendedOffer)} />
        <MerchantPays offer={offer} result={result} onUse={() => setChosen(offer)} />
      </section>
      <PresetCards offer={offer} onPick={change} />
      <section aria-label="Early payoff and offer history" className={row}>
        <EarlyPayoffCard offer={offer} />
        <OfferHistoryCard />
      </section>
      <section aria-label="Cost disclosure and sending the offer" className={row}>
        <DisclosureCard offer={chosen} />
        <SendCard needsSenior={chosenResult.needsSenior} withinPolicy={chosenResult.withinPolicy} />
      </section>
    </>
  );
}
