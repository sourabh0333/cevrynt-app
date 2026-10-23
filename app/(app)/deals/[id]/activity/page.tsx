import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ActivitySkeleton } from "@/components/deals/activity/ActivitySkeleton";
import { ActivityTab } from "@/components/deals/activity/ActivityTab";
import { Arrive } from "@/components/ui/Skeleton";
import { activityTabView } from "@/lib/data/views/deal-tabs";

export const metadata = { title: "Deal activity · Cevrynt" };

/**
 * Activity, from design/Deal-Activity.html and its prototype. The server
 * loads the deal's timeline, stages, messages and access log through the
 * data layer.
 */
export default function Page({ params }: PageProps<"/deals/[id]/activity">) {
  return (
    <Suspense fallback={<ActivitySkeleton />}>
      <ActivityData params={params} />
    </Suspense>
  );
}

async function ActivityData({ params }: { params: PageProps<"/deals/[id]/activity">["params"] }) {
  const { id } = await params;
  const data = await activityTabView(id);
  if (!data) notFound();
  return (
    <Arrive>
      <ActivityTab data={data} />
    </Arrive>
  );
}
