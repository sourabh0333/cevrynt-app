import "server-only";
import type { IsoDateTime, Task, TaskBoard } from "@/lib/data/types";
import { getNow } from "../clock";
import { listDeals } from "../deals";
import { getTaskBoard, listTasks } from "../tasks";
import { getCurrentUser, listTeam } from "../team";
import { brokerFlagCounts } from "./brokers";

export type TasksData = {
  now: IsoDateTime;
  tasks: Task[];
  board: TaskBoard;
  /** the signed-in person */
  me: { id: string; name: string };
  /** everyone with a task load, in team order: the Team view and hand-offs */
  team: { id: string; name: string; load: TaskBoard["team"][number] }[];
  /** the deals and teammates offered in the quick-add bar, by name */
  quickDeals: string[];
  quickAssignees: string[];
  /** fraud flags per broker (by short name), for prep lines that quote them */
  brokerFlags: Record<string, number>;
};

/** Everything My tasks shows, loaded in parallel. */
export async function tasksView(): Promise<TasksData> {
  const [tasks, board, deals, members, me, brokerFlags, now] = await Promise.all([listTasks(), getTaskBoard(), listDeals(), listTeam(), getCurrentUser(), brokerFlagCounts(), getNow()]);
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "";
  return {
    now,
    tasks,
    board,
    me: { id: me?.id ?? "", name: me?.name ?? "" },
    team: board.team.map((load) => ({ id: load.memberId, name: nameOf(load.memberId), load })),
    quickDeals: board.quickDealIds.map((id) => deals.find((d) => d.id === id)?.merchantName ?? "").filter(Boolean),
    quickAssignees: board.quickAssigneeIds.map(nameOf).filter(Boolean),
    brokerFlags,
  };
}
