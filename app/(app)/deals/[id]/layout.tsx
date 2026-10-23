import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DealFrameSkeleton } from "@/components/deals/DealFrameSkeleton";
import { DealHeader } from "@/components/deals/DealHeader";
import { DealTabs } from "@/components/deals/DealTabs";
import { Arrive } from "@/components/ui/Skeleton";
import { dealFrameView } from "@/lib/data/views/deals";

/**
 * The deal workspace frame shared by all nine deal tabs
 * (design/Deal-Summary.html): breadcrumb and tools, the deal header card
 * and the tab bar. Each tab's page renders below it.
 *
 * With cacheComponents on, params are read inside a Suspense boundary; its
 * fallback is the frame's skeleton. The deal comes from the data layer, and
 * an unknown id calls notFound(), which shows /deals/not-found.tsx ("There's
 * no deal …"). The page itself (children) stays outside the boundary so the
 * router can swap it on every tab change.
 */
export default function DealLayout({ children, params }: LayoutProps<"/deals/[id]">) {
  return (
    <>
      <Suspense fallback={<DealFrameSkeleton />}>
        <DealFrame params={params} />
      </Suspense>
      {children}
    </>
  );
}

async function DealFrame({ params }: { params: LayoutProps<"/deals/[id]">["params"] }) {
  const { id } = await params;
  const frame = await dealFrameView(id);
  if (!frame) notFound();

  return (
    <Arrive>
      <DealHeader deal={frame.deal} now={frame.now} />
      <DealTabs dealId={frame.deal.id} />
    </Arrive>
  );
}
