import { Suspense } from "react";
import { IntakeHub } from "@/components/intake/IntakeHub";
import { IntakeSkeleton } from "@/components/intake/IntakeSkeletons";
import { Arrive } from "@/components/ui/Skeleton";
import { intakeHubView } from "@/lib/data/views/intake";

export const metadata = { title: "Intake · Cevrynt" };

/**
 * Intake hub, from design/Intake.html. The server loads today's arrivals
 * and the recent intakes through the data layer. The three channels that
 * arrive on their own are not live (CLAUDE.md) and show as "Coming soon"
 * cards.
 */
export default function IntakePage() {
  return (
    <Suspense fallback={<IntakeSkeleton />}>
      <IntakeData />
    </Suspense>
  );
}

async function IntakeData() {
  const data = await intakeHubView();
  return (
    <Arrive>
      <IntakeHub data={data} />
    </Arrive>
  );
}
