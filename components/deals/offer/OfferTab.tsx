"use client";

import { useMemo, useState } from "react";
import { computeOffer, recommendedOffer, type OfferInput } from "@/lib/offer-math";
import { MerchantPays } from "./MerchantPays";
import { OfferBuilder } from "./OfferBuilder";
import { PresetCards } from "./PresetCards";

/**
 * The Offer & disclosures tab from design/Deal-Offer.html. This step holds
 * the top half: the builder and the live result side by side, then the
 * three preset cards. The offer is the one piece of state; every number
 * comes from computeOffer in lib/offer-math.ts.
 */
export function OfferTab() {
  const [offer, setOffer] = useState<OfferInput>(recommendedOffer);
  const result = useMemo(() => computeOffer(offer), [offer]);
  const change = (patch: Partial<OfferInput>) => setOffer((o) => ({ ...o, ...patch }));

  return (
    <>
      <section aria-label="Offer builder and what the merchant pays" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <OfferBuilder offer={offer} result={result} onChange={change} onReset={() => setOffer(recommendedOffer)} />
        <MerchantPays offer={offer} result={result} />
      </section>
      <PresetCards offer={offer} onPick={change} />
    </>
  );
}
