import type { Id, IsoDateTime } from "./common";

/*
 * My tasks (design/Tasks.html). A task's words (its title, why, what to
 * prepare) are written by the system or the person who added it, so they
 * are data; labels and headings are in lib/copy/tasks.
 */

export type TaskType = "decision" | "alert" | "review" | "call" | "docs" | "renewal" | "custom";

/** How the due time reads: "Now", "25 min", "Today", "4:00 pm", "Thu 10:00", "4 days". */
export type TaskDueStyle = "now" | "countdown" | "day" | "clock" | "weekday" | "days";

/** Where a task opens. */
export type TaskTarget =
  | { page: "stacking" | "submissions" | "renewals" | "funded" | "tasks" }
  | { page: "deal"; dealId: Id; tab: "decision" | "conditions" };

export type Task = {
  id: Id;
  type: TaskType;
  title: string;
  /** the line under the title: the merchant and where it stands */
  subject: string;
  assigneeId: Id;
  dueAt: IsoDateTime;
  dueStyle: TaskDueStyle;
  /** how much of the time to act is used up, 0–1 (the time-left bar) */
  used: number;
  why: string;
  /** a few words for summaries, e.g. "Mesa Auto Repair review" */
  short?: string;
  /** what to prepare; a broker's flags are counted from Stacking Watch */
  prep: (string | { kind: "broker-flags"; broker: string })[];
  target: TaskTarget;
  /** added by the system, or by a person from My tasks */
  source: "system" | "user";
};

/** Something the signed-in person is waiting on from someone else. */
export type WaitingItem = {
  id: Id;
  /** who it's from, and which side they're on */
  who: string;
  side: "broker" | "merchant" | "team";
  title: string;
  /** what it's about: the merchant, or a short note */
  about: string;
  status: { kind: "due"; at: IsoDateTime } | { kind: "sent"; at: IsoDateTime };
};

/** One team member's open tasks, for the Team view. */
export type TaskLoad = { memberId: Id; open: number; dueNow: number; overdue: number; approvalsForMe: number };

export type TaskBoard = {
  waiting: WaitingItem[];
  /** done today before the page opened, newest first as the design lists them */
  doneToday: { title: string; at: IsoDateTime }[];
  team: TaskLoad[];
  /** deals and teammates offered in the quick-add bar */
  quickDealIds: Id[];
  quickAssigneeIds: Id[];
};
