import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SummarySkeleton } from "@/components/deals/summary/SummarySkeleton";
import { SummaryTab } from "@/components/deals/summary/SummaryTab";
import { Arrive } from "@/components/ui/Skeleton";
import { dealTabsView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal summary · Cevrynt" };

/**
 * Deal summary, from design/Deal-Summary.html and its prototype. The
 * server loads the deal's summary, statements and positions through the
 * data layer (with the policy lines they're measured against); the client
 * parts keep the recommendation slider and the chart switch.
 */
export default function Page({ params }: PageProps<"/deals/[id]">) {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <SummaryData params={params} />
    </Suspense>
  );
}

async function SummaryData({ params }: { params: PageProps<"/deals/[id]">["params"] }) {
  const { id } = await params;
  const data = await dealTabsView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <SummaryTab data={data} />
    </Arrive>
  );
}
