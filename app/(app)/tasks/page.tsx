import { Suspense } from "react";
import { TasksSkeleton } from "@/components/tasks/TasksSkeleton";
import { TasksView } from "@/components/tasks/TasksView";
import { Arrive } from "@/components/ui/Skeleton";
import { tasksView } from "@/lib/data/views/tasks";

export const metadata = { title: "My tasks · Cevrynt" };

/**
 * My tasks, from design/Tasks.html and design/prototypes/Tasks.dc.html.
 * The server loads the signed-in person's tasks, the waiting list, today's
 * done items and the team's load through the data layer.
 */
export default function TasksPage() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksData />
    </Suspense>
  );
}

async function TasksData() {
  const data = await tasksView();
  return (
    <Arrive>
      <TasksView data={data} />
    </Arrive>
  );
}
