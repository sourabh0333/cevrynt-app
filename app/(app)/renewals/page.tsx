import { Suspense } from "react";
import { RenewalsView } from "@/components/renewals/RenewalsView";
import { getPricing } from "@/lib/data/settings";

export const metadata = { title: "Renewals · Cevrynt" };

// Renewals, from design/Renewals.html and its prototype.
export default function RenewalsPage() {
  return (
    <Suspense fallback={null}>
      <RenewalsData />
    </Suspense>
  );
}

/** The loyalty price and broker points come from Pricing, the same values Settings shows. */
async function RenewalsData() {
  const { loyaltyDiscount, brokerPoints } = await getPricing();
  return <RenewalsView loyaltyDiscount={loyaltyDiscount} brokerPoints={brokerPoints} />;
}
