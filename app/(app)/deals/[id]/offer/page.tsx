import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OfferSkeleton } from "@/components/deals/offer/OfferSkeleton";
import { OfferTab } from "@/components/deals/offer/OfferTab";
import { Arrive } from "@/components/ui/Skeleton";
import { offerTabView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal offer and disclosures · Cevrynt" };

/**
 * Offer & disclosures, from design/Deal-Offer.html and its prototype. The
 * server loads the deal's range, presets and offer history through the data
 * layer; every figure comes from the shared offer math with the deal's own
 * figures, checked against the policy's limits.
 */
export default function Page({ params }: PageProps<"/deals/[id]/offer">) {
  return (
    <Suspense fallback={<OfferSkeleton />}>
      <OfferData params={params} />
    </Suspense>
  );
}

async function OfferData({ params }: { params: PageProps<"/deals/[id]/offer">["params"] }) {
  const { id } = await params;
  const data = await offerTabView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <OfferTab data={data} />
    </Arrive>
  );
}
