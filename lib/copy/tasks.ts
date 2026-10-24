/**
 * Interface wording for My tasks (design/Tasks.html and its prototype).
 * The tasks, the waiting list, today's done items and the team's load come
 * from the data layer (tasksView); this file words them: due times, the
 * groups they fall in, where each task opens and what its button says.
 */
import type { IsoDateTime, Task, TaskBoard, TaskTarget, TaskType, WaitingItem } from "@/lib/data/types";
import { clock12, clockTime, daysBetween, plural, timeOfDay, weekdayShort } from "@/lib/format";
import { hoursAndMinutes } from "./deal";

export type TaskWhen = "now" | "today" | "week";

/** A task as a row shows it. Tasks added on the page are made in this shape too. */
export type TaskView = {
  id: string;
  type: TaskType;
  when: TaskWhen;
  title: string;
  deal: string;
  due: string;
  why: string;
  prep: string[];
  href: string;
  action: string;
  /** how much of the time-left bar is filled, 0–100 */
  urgency: number;
  /** overrides the type's source line ("From you" for tasks you add) */
  source?: string;
};

export type TaskTypeInfo = {
  label: string;
  initials: string;
  /** chip and icon tile colors */
  bg: string;
  text: string;
  /** solid dot color */
  dot: string;
  source: string;
};

export const taskTypes: Record<TaskType, TaskTypeInfo> = {
  decision: { label: "Decision", initials: "DC", bg: "bg-blue-bg", text: "text-blue-text", dot: "bg-blue", source: "From the deal" },
  alert: { label: "Alert", initials: "AL", bg: "bg-red-bg", text: "text-red-text", dot: "bg-red", source: "From Stacking Watch" },
  review: { label: "Review", initials: "RV", bg: "bg-amber-bg", text: "text-amber-text", dot: "bg-amber", source: "From Submissions" },
  call: { label: "Call", initials: "CL", bg: "bg-purple-bg", text: "text-purple-text", dot: "bg-purple", source: "From Conditions & stips" },
  docs: { label: "Documents", initials: "DO", bg: "bg-page", text: "text-grey-text", dot: "bg-grey-dot", source: "From Conditions & stips" },
  renewal: { label: "Renewal", initials: "RN", bg: "bg-mint-bg", text: "text-teal-dark", dot: "bg-teal", source: "From Renewals" },
  custom: { label: "Task", initials: "TK", bg: "bg-page", text: "text-grey-text", dot: "bg-grey-dot", source: "From you" },
};

export const fromYou = "From you";

/** Where a task opens, and what its button says. */
const targetHref = (t: TaskTarget) => (t.page === "deal" ? `/deals/${t.dealId}/${t.tab}` : `/${t.page}`);
const targetAction = (t: TaskTarget) =>
  t.page === "deal"
    ? t.tab === "decision"
      ? "Make the decision"
      : "Open conditions"
    : { stacking: "Open the alert", submissions: "Open the deal", renewals: "Open Renewals", funded: "Open the funded deal", tasks: "Open" }[t.page];

const minutesUntil = (at: IsoDateTime, now: IsoDateTime) => Math.round((new Date(at).getTime() - new Date(now).getTime()) / 60000);

/** "Now", "25 min", "1h 10m", "Today", "4:00 pm", "Thu 10:00", "4 days" */
export function dueLabel(t: Pick<Task, "dueAt" | "dueStyle">, now: IsoDateTime) {
  const mins = Math.max(0, minutesUntil(t.dueAt, now));
  switch (t.dueStyle) {
    case "now":
      return "Now";
    case "countdown":
      return mins < 60 ? `${mins} min` : hoursAndMinutes(mins);
    case "day":
      return "Today";
    case "clock":
      return clock12(t.dueAt);
    case "weekday":
      return `${weekdayShort(t.dueAt)} ${timeOfDay(t.dueAt)}`;
    case "days":
      return plural(daysBetween(now, t.dueAt), "day");
  }
}

/** Within the hour, later today, or this week, by the workspace's calendar. */
export function taskWhen(dueAt: IsoDateTime, now: IsoDateTime): TaskWhen {
  if (minutesUntil(dueAt, now) <= 60) return "now";
  return daysBetween(now, dueAt) === 0 ? "today" : "week";
}

export const toTaskView = (t: Task, now: IsoDateTime): TaskView => ({
  id: t.id,
  type: t.type,
  when: taskWhen(t.dueAt, now),
  title: t.title,
  deal: t.subject,
  due: dueLabel(t, now),
  why: t.why,
  prep: t.prep,
  href: targetHref(t.target),
  action: targetAction(t.target),
  urgency: Math.round(t.used * 100),
  source: t.source === "user" ? fromYou : undefined,
});

/** A teammate on the Team view: "9 open · 1 overdue". */
export const loadSummary = (l: TaskBoard["team"][number]) =>
  [
    `${l.open} open`,
    l.dueNow ? `${l.dueNow} due now` : "",
    l.overdue ? `${l.overdue} overdue` : "",
    l.approvalsForMe ? `${l.approvalsForMe} ${l.approvalsForMe === 1 ? "approval" : "approvals"} for you` : "",
  ]
    .filter(Boolean)
    .join(" · ");

export const teamSummary = (people: number, open: number) => `${plural(people, "person", "people")} · ${open} open tasks`;

/** Choices in the quick-add bar. */
export const quickAdd = {
  placeholder: "What needs doing? e.g. Call Dana about the landlord letter",
  noDeal: "Link a deal",
  noDealLine: "No deal linked",
  me: "Me",
  due: [
    { value: "today", label: "Today", when: "today" as TaskWhen, urgency: 40 },
    { value: "tomorrow", label: "Tomorrow", when: "week" as TaskWhen, urgency: 25 },
    { value: "week", label: "This week", when: "week" as TaskWhen, urgency: 15 },
  ],
  forWhom: (name: string) => ` · for ${name}`,
  why: "Added by you from My tasks.",
  action: "Open",
  href: "/tasks",
};

/** "Harbor Street Bakery" from "Harbor Street Bakery LLC", as the quick-add bar lists deals. */
export const shortMerchant = (name: string) => name.replace(/,? (LLC|Inc\.?|Co\.?)$/i, "");

export const digestStorageKey = "cevrynt-tasks-digest";

export type TaskGroupInfo = {
  when: TaskWhen;
  title: string;
  /** pill, dot and due-text colors, plus the time-left bar color */
  pill: string;
  dot: string;
  due: string;
  bar: "red" | "blue" | "grey";
};

export const taskGroups: TaskGroupInfo[] = [
  { when: "now", title: "Within the hour", pill: "bg-red-bg text-red-text", dot: "bg-red", due: "text-coral-text", bar: "red" },
  { when: "today", title: "Later today", pill: "bg-blue-bg text-blue-text", dot: "bg-blue", due: "text-blue-text", bar: "blue" },
  { when: "week", title: "This week", pill: "bg-tile text-grey-text", dot: "bg-grey-dot", due: "text-muted", bar: "grey" },
];

export const taskFilters: { value: TaskType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "decision", label: "Decisions" },
  { value: "review", label: "Reviews" },
  { value: "alert", label: "Alerts" },
  { value: "docs", label: "Documents" },
  { value: "renewal", label: "Renewals" },
  { value: "call", label: "Calls" },
];

const waitingTile: Record<WaitingItem["side"], string> = {
  broker: "bg-blue-bg text-blue-text",
  merchant: "bg-sand text-ink",
  team: "bg-blue-bg text-ink",
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** A waiting item as the list shows it: "Dana Ruiz · Harbor Street Bakery", "Due Wed", "Sent 9:43". */
export const waitingView = (w: WaitingItem) => ({
  id: w.id,
  initials: initialsOf(w.who),
  tile: waitingTile[w.side],
  title: w.title,
  detail: `${w.who} · ${w.about}`,
  status: w.status.kind === "due" ? `Due ${weekdayShort(w.status.at)}` : `Sent ${clockTime(w.status.at)}`,
});

export const tasksCopy = {
  title: "My tasks",
  headline: (open: number, urgent: number) => `${open} to do · ${urgent} due within the hour`,
  day: "Your day",
  waitingAndDone: "Waiting and done",
  first: (due: string) => `Do this first · ${due}`,
  markDone: "Mark done",
  undo: "Undo",
  ringLabel: (done: number, all: number) => `${done} of ${all} tasks done today`,
  ringCaption: "done today",
  counts: { now: "within the hour", today: "later today", week: "this week", waiting: "waiting on others" },
  agenda: { mine: "Your agenda", team: "Team agenda", line: (open: number, urgent: number) => `${open} open · ${urgent} due within the hour` },
  whose: { label: "Whose tasks", mine: "Mine", team: "Team" },
  add: "Add task",
  addForm: { label: "Add a task", input: "New task", deal: "Deal", due: "Due", assign: "Assign to", submit: "Add" },
  typeLabel: "Type",
  columns: { task: "Task", left: "Time left", type: "Type" },
  empty: "Nothing here. Pick another type above.",
  digest: "Email me this list every morning at 8:00",
  waiting: { title: "Waiting on others", hint: "A task appears when they reply" },
  done: { title: "Done today", now: "now" },
  doneTime: (at: IsoDateTime) => timeOfDay(at),
  row: {
    done: (title: string) => `Mark ${title} done`,
    open: "Open",
    with: (name: string) => ` · with ${name}`,
    snoozedLine: " · snoozed 1 hour",
    note: "Note:",
    snooze: "Snooze 1 hour",
    snoozed: "Snoozed",
    hand: "Hand to a teammate",
    withName: (name: string) => `With ${name}`,
    addNote: "Add a note",
    editNote: "Edit note",
    handTo: "Hand to:",
    handGroup: "Hand to",
    keep: "Keep it",
    noteLabel: "Note",
    notePlaceholder: "Add a note for yourself or the team",
    save: "Save",
  },
};
