import { Suspense } from "react";
import { DealNotFoundCard } from "@/components/deals/DealNotFoundCard";
import { getWorkspace } from "@/lib/data/settings";

/**
 * A deal id that doesn't exist. It sits on /deals rather than /deals/[id]
 * because the deal layout is what calls notFound(), and a layout's
 * notFound() is caught one level up.
 */
export default function DealNotFound() {
  return (
    <Suspense fallback={null}>
      <WithWorkspace />
    </Suspense>
  );
}

async function WithWorkspace() {
  const workspace = await getWorkspace().catch(() => null);
  return <DealNotFoundCard workspace={workspace?.name ?? null} />;
}
