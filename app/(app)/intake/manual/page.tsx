import { Suspense } from "react";
import { ManualLeadForm } from "@/components/intake/ManualLeadForm";
import { ManualSkeleton } from "@/components/intake/IntakeSkeletons";
import { Arrive } from "@/components/ui/Skeleton";
import { manualLeadView } from "@/lib/data/views/intake";

export const metadata = { title: "New manual lead · Cevrynt" };

/**
 * Manual lead, from design/Intake-Manual.html and its prototype. The server
 * loads the draft, its lookups and the policy the live fit check runs
 * against through the data layer.
 */
export default function ManualLeadPage() {
  return (
    <Suspense fallback={<ManualSkeleton />}>
      <ManualData />
    </Suspense>
  );
}

async function ManualData() {
  const data = await manualLeadView();
  return (
    <Arrive>
      <ManualLeadForm data={data} />
    </Arrive>
  );
}
