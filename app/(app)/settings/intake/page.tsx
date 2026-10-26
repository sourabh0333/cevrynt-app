import { Suspense } from "react";
import { IntakeChannelsSkeleton } from "@/components/settings/intake/IntakeChannelsSkeleton";
import { IntakeChannelsView } from "@/components/settings/intake/IntakeChannelsView";
import { Arrive } from "@/components/ui/Skeleton";
import { intakeChannelsView } from "@/lib/data/views/settings";

export const metadata = { title: "Intake channels · Settings · Cevrynt" };

/**
 * Settings → Intake channels, from design/Settings-Intake.html and its
 * prototype. The server loads Merchant Link's set-up, Intake's monthly
 * channel counts, the brand and the API key through the data layer; the
 * client keeps the channel tabs and the Merchant Link switches.
 */
export default function IntakeChannelsPage() {
  return (
    <Suspense fallback={<IntakeChannelsSkeleton />}>
      <IntakeChannelsData />
    </Suspense>
  );
}

async function IntakeChannelsData() {
  const data = await intakeChannelsView();
  return (
    <Arrive>
      <IntakeChannelsView data={data} />
    </Arrive>
  );
}
