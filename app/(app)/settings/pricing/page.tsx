import { Suspense } from "react";
import { PricingSkeleton } from "@/components/settings/pricing/PricingSkeleton";
import { PricingView } from "@/components/settings/pricing/PricingView";
import { Arrive } from "@/components/ui/Skeleton";
import { getPolicy, getPricing } from "@/lib/data/settings";

export const metadata = { title: "Pricing & disclosures · Settings · Cevrynt" };

/**
 * Settings → Pricing & disclosures, from design/Settings-Pricing.html and
 * its prototype. The server loads pricing (and the policy limits its notes
 * quote) through the data layer; the client view keeps the grid selection,
 * the guardrail sliders and the disclosure switches.
 */
export default function PricingPage() {
  return (
    <Suspense fallback={<PricingSkeleton />}>
      <PricingData />
    </Suspense>
  );
}

async function PricingData() {
  const [pricing, policy] = await Promise.all([getPricing(), getPolicy()]);
  return (
    <Arrive>
      <PricingView pricing={pricing} policy={{ limits: policy.limits, maxDebtShare: policy.maxDebtShare }} />
    </Arrive>
  );
}
