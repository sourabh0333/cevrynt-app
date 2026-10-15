/**
 * Sample data for My tasks, copied from design/prototypes/Tasks.dc.html
 * (look: design/Tasks.html). Real API calls replace this later behind the
 * same types.
 */
export type TaskType = "decision" | "alert" | "review" | "call" | "docs" | "renewal" | "custom";
export type TaskWhen = "now" | "today" | "week";

export type Task = {
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

/** Teammates shown on the Team view and offered for hand-offs. */
export type Teammate = { name: string; summary: string; alert?: boolean };
export const teammates: Teammate[] = [
  { name: "Maya Chen", summary: "7 open · 2 due now" },
  { name: "Ari Kaplan", summary: "9 open · 1 overdue", alert: true },
  { name: "Jordan Reyes", summary: "5 open" },
  { name: "Priya Shah", summary: "4 open · 1 approval for you" },
];
export const teamSummary = "4 people · 25 open tasks";

/** Choices in the quick-add bar. */
export const quickAdd = {
  placeholder: "What needs doing? e.g. Call Dana about the landlord letter",
  deals: ["Link a deal", "Harbor Street Bakery", "Mesa Auto Repair"],
  due: [
    { value: "today", label: "Today", when: "today" as TaskWhen, urgency: 40 },
    { value: "tomorrow", label: "Tomorrow", when: "week" as TaskWhen, urgency: 25 },
    { value: "week", label: "This week", when: "week" as TaskWhen, urgency: 15 },
  ],
  assignees: ["Me", "Jordan Reyes", "Priya Shah"],
};

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

export const tasks: Task[] = [
  { id: "lake", type: "alert", when: "now", title: "Review the new UCC filing", deal: "Lakeshore Auto Body · funding on hold", due: "Now", why: "A new advance was filed this morning on a deal that was ready to fund. Funding stays on hold until you review it.", prep: ["Filing: Northpoint Funding, Oct 11", "Not on the application", "Ready to fund at $60K"], href: "/stacking", action: "Open the alert", urgency: 100 },
  { id: "mesa", type: "review", when: "now", title: "Finish reviewing Mesa Auto Repair", deal: "Mesa Auto Repair · $35K asked", due: "25 min", why: "Two warning signs: a statement that doesn’t reconcile and an undisclosed UCC filing. The decision deadline is close.", prep: ["Integrity score is low", "BlueRock sent it, 3 flags this quarter", "Decline or ask for fresh statements"], href: "/submissions", action: "Open the deal", urgency: 88 },
  { id: "harbor", type: "decision", when: "today", title: "Decide Harbor Street Bakery", deal: "Harbor Street Bakery · $40K suggested", due: "1h 10m", why: "Everything is checked. Cevrynt suggests approving $40,000 at 1.32 over 6 months.", prep: ["Score 88, all 8 policy rules met", "Integrity reviewed at 10:12", "Landlord letter still to come before funding"], href: "/deals/APP-7H2K4Q/decision", action: "Make the decision", urgency: 62 },
  { id: "pine", type: "renewal", when: "today", title: "Send renewal offer to Pine Ridge", deal: "Pine Ridge Vet Clinic · $70K suggested", due: "Today", why: "Another funder checked their credit two days ago. Renewing now keeps them with you.", prep: ["58% repaid, revenue up 12%", "Loyalty price 1.28", "No returned payments"], href: "/renewals", action: "Open Renewals", urgency: 40 },
  { id: "north", type: "docs", when: "today", title: "Chase the voided check", deal: "Northline HVAC · waiting 2 days", due: "4:00 pm", why: "The only item missing before you can decide. A reminder to the merchant usually does it.", prep: ["Merchant Link already sent", "Offer expires today 5 pm", "Broker: Summit Capital ISO"], href: "/submissions", action: "Open the deal", urgency: 50 },
  { id: "call", type: "call", when: "week", title: "Funding call with Elena Brooks", deal: "Harbor Street Bakery", due: "Thu 10:00", why: "A short recorded call to confirm the terms before funding.", prep: ["After the contract is signed", "About 10 minutes", "Script ready in the deal"], href: "/deals/APP-7H2K4Q/conditions", action: "Open conditions", urgency: 16 },
  { id: "kest", type: "review", when: "week", title: "Answer Kestrel’s reconciliation request", deal: "Kestrel Plumbing · sales down 22%", due: "4 days", why: "The merchant asked to pay less because sales fell. A reply is expected within 5 days.", prep: ["Deposits down 22% in 3 weeks", "One returned payment", "48% repaid"], href: "/funded", action: "Open the funded deal", urgency: 10 },
];

export type WaitingItem = {
  id: string;
  initials: string;
  tile: string;
  title: string;
  detail: string;
  status: string;
};

export const waitingOnOthers: WaitingItem[] = [
  { id: "w1", initials: "DR", tile: "bg-blue-bg text-blue-text", title: "Landlord letter", detail: "Dana Ruiz · Harbor Street Bakery", status: "Due Wed" },
  { id: "w2", initials: "EB", tile: "bg-sand text-ink", title: "Credit check permission", detail: "Elena Brooks · Merchant Link", status: "Sent 9:43" },
  { id: "w3", initials: "PS", tile: "bg-blue-bg text-ink", title: "Approve policy version 4", detail: "Priya Shah · your proposal", status: "Sent 10:20" },
];

export type DoneItem = { title: string; time: string };

/** Already done before the page opened. Ticked tasks are added in front. */
export const doneEarlier: DoneItem[] = [
  { title: "Marked integrity reviewed, Harbor Street", time: "10:12" },
  { title: "Asked Dana for the landlord letter", time: "10:05" },
  { title: "Proposed policy version 4", time: "10:20" },
  { title: "Replied to Elena on Merchant Link", time: "10:01" },
  { title: "Reviewed Golden Lotus statements", time: "09:30" },
];
