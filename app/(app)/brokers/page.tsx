import { Suspense } from "react";
import { BrokersSkeleton } from "@/components/brokers/BrokersSkeleton";
import { BrokersView } from "@/components/brokers/BrokersView";
import { Arrive } from "@/components/ui/Skeleton";
import { brokersView } from "@/lib/data/views/brokers";

export const metadata = { title: "Brokers · Cevrynt" };

/**
 * Brokers, from design/Brokers.html and its prototype. The server loads
 * the brokers, their fraud flags from Stacking Watch, today's funded deals
 * for commission, Pricing's points and the policy through the data layer;
 * the client keeps the sort, the selected broker and paused brokers.
 */
export default function BrokersPage() {
  return (
    <Suspense fallback={<BrokersSkeleton />}>
      <BrokersData />
    </Suspense>
  );
}

async function BrokersData() {
  const data = await brokersView();
  return (
    <Arrive>
      <BrokersView data={data} />
    </Arrive>
  );
}
