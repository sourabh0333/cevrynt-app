import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ConditionsSkeleton } from "@/components/deals/conditions/ConditionsSkeleton";
import { ConditionsTab } from "@/components/deals/conditions/ConditionsTab";
import { Arrive } from "@/components/ui/Skeleton";
import { conditionsTabView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal conditions and stips · Cevrynt" };

/**
 * Conditions & stips, from design/Deal-Conditions.html and its prototype.
 * The server loads the deal's conditions through the data layer; the
 * runway, the board and the tab bar's count all follow them.
 */
export default function Page({ params }: PageProps<"/deals/[id]/conditions">) {
  return (
    <Suspense fallback={<ConditionsSkeleton />}>
      <ConditionsData params={params} />
    </Suspense>
  );
}

async function ConditionsData({ params }: { params: PageProps<"/deals/[id]/conditions">["params"] }) {
  const { id } = await params;
  const data = await conditionsTabView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <ConditionsTab data={data} />
    </Arrive>
  );
}
