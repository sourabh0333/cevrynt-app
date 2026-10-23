import { Suspense } from "react";
import { RenewalRulesView } from "@/components/settings/renewals/RenewalRulesView";
import { getPricing } from "@/lib/data/settings";

export const metadata = { title: "Renewal rules · Settings · Cevrynt" };

// Settings → Renewal rules, from design/Settings-Renewals.html and its prototype.
export default function RenewalRulesPage() {
  return (
    <Suspense fallback={null}>
      <RenewalRulesData />
    </Suspense>
  );
}

/** "What they're offered" quotes Pricing: the loyalty price, broker points and the forgive switch. */
async function RenewalRulesData() {
  const { loyaltyDiscount, brokerPoints, forgiveUnearnedFees } = await getPricing();
  return <RenewalRulesView terms={{ loyaltyDiscount, brokerPoints, forgiveUnearnedFees }} />;
}
