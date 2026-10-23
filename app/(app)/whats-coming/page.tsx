import { Suspense } from "react";
import { ComingSkeleton } from "@/components/coming/ComingSkeleton";
import { ComingView } from "@/components/coming/ComingView";
import { Arrive } from "@/components/ui/Skeleton";
import { listRoadmapFeatures } from "@/lib/data/roadmap";

export const metadata = { title: "What's coming · Cevrynt" };

/**
 * What's coming, from design/Coming.html and its prototype. The first page
 * on the data layer (DATA-PLAN.md, step 1): the server loads the features,
 * the client view keeps all the interaction. The skeleton shows while they
 * load and the content fades in.
 */
export default function WhatsComingPage() {
  return (
    <Suspense fallback={<ComingSkeleton />}>
      <ComingData />
    </Suspense>
  );
}

async function ComingData() {
  const features = await listRoadmapFeatures();
  return (
    <Arrive>
      <ComingView features={features} />
    </Arrive>
  );
}
