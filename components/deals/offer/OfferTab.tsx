"use client";

import { useMemo, useState } from "react";
import { offerSections } from "@/lib/copy/deal-offer";
import type { OfferTabData } from "@/lib/data/views/deal-tabs";
import { computeOffer, type OfferInput } from "@/lib/offer-math";
import { DisclosureCard, SendCard } from "./DisclosureRow";
import { EarlyPayoffCard, OfferHistoryCard } from "./EarlyPayoffRow";
import { MerchantPays } from "./MerchantPays";
import { OfferBuilder } from "./OfferBuilder";
import { PresetCards } from "./PresetCards";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Offer & disclosures tab from design/Deal-Offer.html, for the deal in
 * `data` (from the data layer).
 * Row 1: the builder and the live result. Row 2: the deal's presets.
 * Row 3: early payoff tiers and the offer history.
 * Row 4: the cost disclosure and the send card.
 * The builder edits `offer`; "Use this offer" copies it into `chosen`,
 * which the disclosure and the send card print. Every number on the tab
 * comes from lib/offer-math.ts with the deal's own figures, checked against
 * the policy and the deal's range and priced with Pricing's early payoff
 * table.
 */
export function OfferTab({ data }: { data: OfferTabData }) {
  const { figures, offerPolicy: policy, recommended } = data;
  const [offer, setOffer] = useState<OfferInput>(recommended);
  const [chosen, setChosen] = useState<OfferInput>(recommended);
  const result = useMemo(() => computeOffer(offer, figures, policy), [offer, figures, policy]);
  const chosenResult = useMemo(() => computeOffer(chosen, figures, policy), [chosen, figures, policy]);
  const change = (patch: Partial<OfferInput>) => setOffer((o) => ({ ...o, ...patch }));

  return (
    <>
      <section aria-label={offerSections.builder} className={row}>
        <OfferBuilder
          offer={offer}
          result={result}
          policy={policy}
          recommended={recommended.amount}
          scoreBandFrom={data.scoreBandFrom}
          payoff={data.payoff}
          onChange={change}
          onReset={() => setOffer(recommended)}
        />
        <MerchantPays offer={offer} result={result} maxShare={policy.maxShare} bank={data.bank} onUse={() => setChosen(offer)} />
      </section>
      <PresetCards offer={offer} recommended={recommended} presets={data.offer.presets} figures={figures} policy={policy} onPick={change} />
      <section aria-label={offerSections.early} className={row}>
        <EarlyPayoffCard offer={offer} table={data.earlyPayoff} owner={data.owner} />
        <OfferHistoryCard history={data.offer.history} />
      </section>
      <section aria-label={offerSections.disclosure} className={row}>
        <DisclosureCard offer={chosen} figures={figures} policy={policy} id={data.id} state={data.state} funder={data.workspace} />
        <SendCard
          needsSenior={chosenResult.needsSenior}
          withinPolicy={chosenResult.withinPolicy}
          approvalLimit={policy.approvalLimit}
          senior={data.senior}
          validHours={data.offer.validHours}
        />
      </section>
    </>
  );
}
