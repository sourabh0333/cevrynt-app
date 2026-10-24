import { Suspense } from "react";
import { StackingSkeleton } from "@/components/stacking/StackingSkeleton";
import { StackingView } from "@/components/stacking/StackingView";
import { Arrive } from "@/components/ui/Skeleton";
import { stackingView } from "@/lib/data/views/stacking";

export const metadata = { title: "Stacking Watch · Cevrynt" };

/**
 * Stacking Watch, from design/Stacking.html and its prototype. The server
 * loads the alerts, joined to their deals, queued funding and advances,
 * and the summary through the data layer; the client keeps the filter,
 * the selected alert, reviewed alerts and the rule switches.
 */
export default function StackingPage() {
  return (
    <Suspense fallback={<StackingSkeleton />}>
      <StackingData />
    </Suspense>
  );
}

async function StackingData() {
  const data = await stackingView();
  return (
    <Arrive>
      <StackingView data={data} />
    </Arrive>
  );
}
