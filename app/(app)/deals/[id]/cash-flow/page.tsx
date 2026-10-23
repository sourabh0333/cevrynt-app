import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CashFlowSkeleton } from "@/components/deals/cash-flow/CashFlowSkeleton";
import { CashFlowTab } from "@/components/deals/cash-flow/CashFlowTab";
import { Arrive } from "@/components/ui/Skeleton";
import { dealTabsView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal cash flow · Cevrynt" };

/**
 * Deal cash flow, from design/Deal-CashFlow.html and its prototype. The
 * server loads the deal's statements through the data layer; the
 * transactions list keeps its search and filters on the client.
 */
export default function Page({ params }: PageProps<"/deals/[id]/cash-flow">) {
  return (
    <Suspense fallback={<CashFlowSkeleton />}>
      <CashFlowData params={params} />
    </Suspense>
  );
}

async function CashFlowData({ params }: { params: PageProps<"/deals/[id]/cash-flow">["params"] }) {
  const { id } = await params;
  const data = await dealTabsView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <CashFlowTab data={data} />
    </Arrive>
  );
}
