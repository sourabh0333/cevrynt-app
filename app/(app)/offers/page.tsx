import { Suspense } from "react";
import { OffersSkeleton } from "@/components/offers/OffersSkeleton";
import { OffersView } from "@/components/offers/OffersView";
import { Arrive } from "@/components/ui/Skeleton";
import { offersView } from "@/lib/data/views/funding";

export const metadata = { title: "Offers & funding · Cevrynt" };

/**
 * Offers & funding, from design/Offers.html and its prototype. The server
 * loads the offers, the funding queue, today's releases and the funding
 * desk through the data layer; the client keeps the stage, view, search,
 * ticks and the fund and release steps.
 */
export default function OffersPage() {
  return (
    <Suspense fallback={<OffersSkeleton />}>
      <OffersData />
    </Suspense>
  );
}

async function OffersData() {
  const data = await offersView();
  return (
    <Arrive>
      <OffersView data={data} />
    </Arrive>
  );
}
