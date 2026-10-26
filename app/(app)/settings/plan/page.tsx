import { Suspense } from "react";
import { PlanSkeleton } from "@/components/settings/plan/PlanSkeleton";
import { PlanView } from "@/components/settings/plan/PlanView";
import { Arrive } from "@/components/ui/Skeleton";
import { planView } from "@/lib/data/views/settings";

export const metadata = { title: "Plan & usage · Settings · Cevrynt" };

/**
 * Settings → Plan & usage, from design/Settings-Plan.html and its
 * prototype. The server loads the plan, Intake's monthly channel counts
 * and the team's seats through the data layer; the client keeps the spend
 * limit, Monthly / Yearly and the warn switch.
 */
export default function PlanPage() {
  return (
    <Suspense fallback={<PlanSkeleton />}>
      <PlanData />
    </Suspense>
  );
}

async function PlanData() {
  const data = await planView();
  return (
    <Arrive>
      <PlanView data={data} />
    </Arrive>
  );
}
