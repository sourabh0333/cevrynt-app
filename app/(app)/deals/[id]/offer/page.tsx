import { Suspense } from "react";
import { OfferTab } from "@/components/deals/offer/OfferTab";
import { getPolicy, getPricing } from "@/lib/data/settings";
import { offerPolicyFrom } from "@/lib/offer-math";

export const metadata = { title: "Deal offer and disclosures · Cevrynt" };

// Offer & disclosures, from design/Deal-Offer.html and its prototype.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <OfferData />
    </Suspense>
  );
}

/**
 * The offer is checked against the live policy (debt limit, approval line)
 * and priced with Pricing's early payoff table, both from the data layer.
 * The deal's own range is still the sample deal's until the deal tabs move.
 */
async function OfferData() {
  const [policy, pricing] = await Promise.all([getPolicy(), getPricing()]);
  return <OfferTab policy={offerPolicyFrom(policy)} earlyPayoffTiers={pricing.earlyPayoff} />;
}
