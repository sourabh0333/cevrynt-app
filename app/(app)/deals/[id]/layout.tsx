import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DealHeader } from "@/components/deals/DealHeader";
import { DealTabs } from "@/components/deals/DealTabs";
import { getDealHeader } from "@/lib/sample-data/deal";

/**
 * The deal workspace frame shared by all nine deal tabs
 * (design/Deal-Summary.html): breadcrumb and tools, the deal header card
 * and the tab bar. Each tab's page renders below it.
 *
 * With cacheComponents on, params are read inside a Suspense boundary.
 * The page itself (children) stays outside it so the router can swap it
 * on every tab change.
 */
export default function DealLayout({ children, params }: LayoutProps<"/deals/[id]">) {
  return (
    <>
      <Suspense fallback={null}>
        <DealFrame params={params} />
      </Suspense>
      {children}
    </>
  );
}

async function DealFrame({ params }: { params: LayoutProps<"/deals/[id]">["params"] }) {
  const { id } = await params;
  const deal = getDealHeader(id);
  if (!deal) notFound();

  return (
    <>
      <DealHeader deal={deal} />
      <DealTabs dealId={deal.id} />
    </>
  );
}
