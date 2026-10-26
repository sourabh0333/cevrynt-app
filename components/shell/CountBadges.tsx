import { getQueueSummary } from "@/lib/data/deals";
import { listTasks } from "@/lib/data/tasks";
import { getCurrentUser } from "@/lib/data/team";
import { portfolio } from "@/lib/data/views/portfolio";
import { NavBadgeMarks } from "./Sidebar";

/**
 * The sidebar's quiet count badges, counted from the records through the
 * data layer with the same figures the pages show: My tasks (the signed-in
 * person's tasks), Submissions (open deals) and Renewals (merchants ready).
 * Each is a server component in its own Suspense with no placeholder, so
 * the number simply appears; if the records can't be loaded, or the count
 * is zero, there is no badge.
 */
async function Count({ load }: { load: () => Promise<number> }) {
  const count = await load().catch(() => 0);
  return count ? <NavBadgeMarks count={count} tone="quiet" /> : null;
}

export function TasksBadge() {
  return (
    <Count
      load={async () => {
        const [tasks, me] = await Promise.all([listTasks(), getCurrentUser()]);
        return tasks.filter((t) => t.assigneeId === me?.id).length;
      }}
    />
  );
}

export function SubmissionsBadge() {
  return <Count load={async () => (await getQueueSummary()).open} />;
}

export function RenewalsBadge() {
  return <Count load={async () => (await portfolio()).readyIds.length} />;
}
