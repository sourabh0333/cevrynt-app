import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BusinessSkeleton } from "@/components/deals/business/BusinessSkeleton";
import { BusinessTab } from "@/components/deals/business/BusinessTab";
import { Arrive } from "@/components/ui/Skeleton";
import { businessTabView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal business and owners · Cevrynt" };

/**
 * Business & owners, from design/Deal-Business.html. The server loads the
 * deal's registry, owners and records through the data layer; whether the
 * industry is allowed comes from the policy's restricted list.
 */
export default function Page({ params }: PageProps<"/deals/[id]/business">) {
  return (
    <Suspense fallback={<BusinessSkeleton />}>
      <BusinessData params={params} />
    </Suspense>
  );
}

async function BusinessData({ params }: { params: PageProps<"/deals/[id]/business">["params"] }) {
  const { id } = await params;
  const data = await businessTabView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <BusinessTab data={data} />
    </Arrive>
  );
}
