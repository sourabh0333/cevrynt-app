import type { Task, TaskBoard } from "@/lib/data/types";

/**
 * Sample records for My tasks, copied from design/prototypes/Tasks.dc.html
 * (look: design/Tasks.html). Times are on the sample day (SAMPLE_NOW,
 * Tuesday Oct 13, 10:45), so "25 min" and "Within the hour" are worked
 * out from them. Pages get them through lib/data/tasks.
 */

const at = (day: number, time: string) => `2026-10-${day}T${time}:00-04:00`;

export const tasks: Task[] = [
  {
    id: "lake", type: "alert", title: "Review the new UCC filing", subject: "Lakeshore Auto Body · funding on hold", assigneeId: "usr_maya",
    dueAt: at(13, "10:45"), dueStyle: "now", used: 1,
    why: "A new advance was filed this morning on a deal that was ready to fund. Funding stays on hold until you review it.",
    short: "Lakeshore UCC filing",
    prep: ["Filing: Northpoint Funding, Oct 11", "Not on the application", "Ready to fund at $60K"], target: { page: "stacking" }, source: "system",
  },
  {
    id: "mesa", type: "review", title: "Finish reviewing Mesa Auto Repair", subject: "Mesa Auto Repair · $35K asked", assigneeId: "usr_maya",
    dueAt: at(13, "11:10"), dueStyle: "countdown", used: 0.88,
    why: "Two warning signs: a statement that doesn’t reconcile and an undisclosed UCC filing. The decision deadline is close.",
    short: "Mesa Auto Repair review",
    prep: ["Integrity score is low", { kind: "broker-flags", broker: "BlueRock" }, "Decline or ask for fresh statements"], target: { page: "submissions" }, source: "system",
  },
  {
    id: "harbor", type: "decision", title: "Decide Harbor Street Bakery", subject: "Harbor Street Bakery · $40K suggested", assigneeId: "usr_maya",
    dueAt: at(13, "11:55"), dueStyle: "countdown", used: 0.62,
    why: "Everything is checked. Cevrynt suggests approving $40,000 at 1.32 over 6 months.",
    prep: ["Score 88, all 8 policy rules met", "Integrity reviewed at 10:12", "Landlord letter still to come before funding"],
    target: { page: "deal", dealId: "APP-7H2K4Q", tab: "decision" }, source: "system",
  },
  {
    id: "pine", type: "renewal", title: "Send renewal offer to Pine Ridge", subject: "Pine Ridge Vet Clinic · $70K suggested", assigneeId: "usr_maya",
    dueAt: at(13, "17:00"), dueStyle: "day", used: 0.4,
    why: "Another funder checked their credit two days ago. Renewing now keeps them with you.",
    prep: ["58% repaid, revenue up 12%", "Loyalty price 1.28", "No returned payments"], target: { page: "renewals" }, source: "system",
  },
  {
    id: "north", type: "docs", title: "Chase the voided check", subject: "Northline HVAC · waiting 2 days", assigneeId: "usr_maya",
    dueAt: at(13, "16:00"), dueStyle: "clock", used: 0.5,
    why: "The only item missing before you can decide. A reminder to the merchant usually does it.",
    prep: ["Merchant Link already sent", "Offer expires today 5 pm", "Broker: Summit Capital ISO"], target: { page: "submissions" }, source: "system",
  },
  {
    id: "call", type: "call", title: "Funding call with Elena Brooks", subject: "Harbor Street Bakery", assigneeId: "usr_maya",
    dueAt: at(15, "10:00"), dueStyle: "weekday", used: 0.16,
    why: "A short recorded call to confirm the terms before funding.",
    prep: ["After the contract is signed", "About 10 minutes", "Script ready in the deal"], target: { page: "deal", dealId: "APP-7H2K4Q", tab: "conditions" }, source: "system",
  },
  {
    id: "kest", type: "review", title: "Answer Kestrel’s reconciliation request", subject: "Kestrel Plumbing · sales down 22%", assigneeId: "usr_maya",
    dueAt: at(17, "12:00"), dueStyle: "days", used: 0.1,
    why: "The merchant asked to pay less because sales fell. A reply is expected within 5 days.",
    prep: ["Deposits down 22% in 3 weeks", "One returned payment", "48% repaid"], target: { page: "funded" }, source: "system",
  },
];

export const taskBoard: TaskBoard = {
  waiting: [
    { id: "w1", who: "Dana Ruiz", side: "broker", title: "Landlord letter", about: "Harbor Street Bakery", status: { kind: "due", at: at(14, "17:00") } },
    { id: "w2", who: "Elena Brooks", side: "merchant", title: "Credit check permission", about: "Merchant Link", status: { kind: "sent", at: at(13, "09:43") } },
    { id: "w3", who: "Priya Shah", side: "team", title: "Approve policy version 4", about: "your proposal", status: { kind: "sent", at: at(13, "10:20") } },
  ],
  doneToday: [
    { title: "Marked integrity reviewed, Harbor Street", at: at(13, "10:12") },
    { title: "Asked Dana for the landlord letter", at: at(13, "10:05") },
    { title: "Proposed policy version 4", at: at(13, "10:20") },
    { title: "Replied to Elena on Merchant Link", at: at(13, "10:01") },
    { title: "Reviewed Golden Lotus statements", at: at(13, "09:30") },
  ],
  team: [
    { memberId: "usr_maya", open: 7, dueNow: 2, overdue: 0, approvalsForMe: 0 },
    { memberId: "usr_ari", open: 9, dueNow: 0, overdue: 1, approvalsForMe: 0 },
    { memberId: "usr_jordan", open: 5, dueNow: 0, overdue: 0, approvalsForMe: 0 },
    { memberId: "usr_priya", open: 4, dueNow: 0, overdue: 0, approvalsForMe: 1 },
  ],
  quickDealIds: ["APP-7H2K4Q", "APP-9K2M7R"],
  quickAssigneeIds: ["usr_jordan", "usr_priya"],
};
