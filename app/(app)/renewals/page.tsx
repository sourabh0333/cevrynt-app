import { Suspense } from "react";
import { RenewalsSkeleton } from "@/components/renewals/RenewalsSkeleton";
import { RenewalsView } from "@/components/renewals/RenewalsView";
import { Arrive } from "@/components/ui/Skeleton";
import { renewalsView } from "@/lib/data/views/renewals";

export const metadata = { title: "Renewals · Cevrynt" };

/**
 * Renewals, from design/Renewals.html and its prototype. The server loads
 * the candidates, their advances, the pipeline, the saved rules and
 * Pricing's loyalty price and broker points through the data layer; the
 * client keeps the selection, amounts, sent offers and forgiven fees.
 */
export default function RenewalsPage() {
  return (
    <Suspense fallback={<RenewalsSkeleton />}>
      <RenewalsData />
    </Suspense>
  );
}

async function RenewalsData() {
  const data = await renewalsView();
  return (
    <Arrive>
      <RenewalsView data={data} />
    </Arrive>
  );
}
