import "server-only";
import type { Task, TaskBoard } from "@/lib/data/types";
import { source } from "./source";

/** The signed-in person's open tasks, in the order My tasks lists them. */
export async function listTasks(): Promise<Task[]> {
  return source.tasks.list();
}

/** What My tasks shows around the tasks: waiting on others, done today, the team's load. */
export async function getTaskBoard(): Promise<TaskBoard> {
  return source.tasks.getBoard();
}
