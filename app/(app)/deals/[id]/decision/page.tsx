import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DecisionSkeleton } from "@/components/deals/decision/DecisionSkeleton";
import { DecisionTab } from "@/components/deals/decision/DecisionTab";
import { Arrive } from "@/components/ui/Skeleton";
import { decisionTabView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal decision and memo · Cevrynt" };

/**
 * Decision & memo, from design/Deal-Decision.html and its prototype. The
 * server loads Cevrynt's suggestion, the memo and the deal's figures through
 * the data layer; the policy check and approval line come from the policy.
 */
export default function Page({ params }: PageProps<"/deals/[id]/decision">) {
  return (
    <Suspense fallback={<DecisionSkeleton />}>
      <DecisionData params={params} />
    </Suspense>
  );
}

async function DecisionData({ params }: { params: PageProps<"/deals/[id]/decision">["params"] }) {
  const { id } = await params;
  const data = await decisionTabView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <DecisionTab data={data} />
    </Arrive>
  );
}
