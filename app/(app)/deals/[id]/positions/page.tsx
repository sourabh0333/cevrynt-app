import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PositionsSkeleton } from "@/components/deals/positions/PositionsSkeleton";
import { PositionsTab } from "@/components/deals/positions/PositionsTab";
import { Arrive } from "@/components/ui/Skeleton";
import { dealTabsView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal positions and debt · Cevrynt" };

/**
 * Positions and debt, from design/Deal-Positions.html and its prototype.
 * The server loads the deal's positions through the data layer; debt
 * shares and the payoff comparison come from the shared offer math,
 * measured against the policy's debt limit.
 */
export default function Page({ params }: PageProps<"/deals/[id]/positions">) {
  return (
    <Suspense fallback={<PositionsSkeleton />}>
      <PositionsData params={params} />
    </Suspense>
  );
}

async function PositionsData({ params }: { params: PageProps<"/deals/[id]/positions">["params"] }) {
  const { id } = await params;
  const data = await dealTabsView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <PositionsTab data={data} />
    </Arrive>
  );
}
