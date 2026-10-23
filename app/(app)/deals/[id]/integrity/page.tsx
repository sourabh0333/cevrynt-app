import { Suspense } from "react";
import { notFound } from "next/navigation";
import { IntegritySkeleton } from "@/components/deals/integrity/IntegritySkeleton";
import { IntegrityTab } from "@/components/deals/integrity/IntegrityTab";
import { Arrive } from "@/components/ui/Skeleton";
import { integrityTabView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal integrity · Cevrynt" };

/**
 * Integrity, from design/Deal-Integrity.html and its prototype. The server
 * loads the deal's checks through the data layer; the score ring is the
 * integrity part of the deal's score, out of the policy's weight for it.
 */
export default function Page({ params }: PageProps<"/deals/[id]/integrity">) {
  return (
    <Suspense fallback={<IntegritySkeleton />}>
      <IntegrityData params={params} />
    </Suspense>
  );
}

async function IntegrityData({ params }: { params: PageProps<"/deals/[id]/integrity">["params"] }) {
  const { id } = await params;
  const data = await integrityTabView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <IntegrityTab data={data} />
    </Arrive>
  );
}
