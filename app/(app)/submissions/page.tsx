import { Suspense } from "react";
import { SubmissionsSkeleton } from "@/components/submissions/SubmissionsSkeleton";
import { SubmissionsView } from "@/components/submissions/SubmissionsView";
import { Arrive } from "@/components/ui/Skeleton";
import { submissionsView } from "@/lib/data/views/deals";

export const metadata = { title: "Submissions · Cevrynt" };

/**
 * Submissions, from design/Submissions.html and its prototype. The server
 * loads the queue, its counts, the waits and the team workload through the
 * data layer; the client view keeps the filters, selection, search, ticks
 * and keyboard shortcuts.
 */
export default function SubmissionsPage() {
  return (
    <Suspense fallback={<SubmissionsSkeleton />}>
      <SubmissionsData />
    </Suspense>
  );
}

async function SubmissionsData() {
  const data = await submissionsView();
  return (
    <Arrive>
      <SubmissionsView data={data} />
    </Arrive>
  );
}
