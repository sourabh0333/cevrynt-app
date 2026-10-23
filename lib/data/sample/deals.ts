import type { Deal, DealQueueStats, DealQueueSummary } from "@/lib/data/types";
import { harborChecks } from "./deal-tabs";
import { workspace } from "./workspace";

/**
 * Sample deal records, copied from design/prototypes/Submissions.dc.html
 * and Deal-Summary.dc.html. Pages get them through lib/data/deals. The
 * sample day is Tuesday Oct 13 (see clock.ts): "yesterday" is Oct 12 and
 * "Fri" is Oct 9.
 *
 * Deadlines are stored as the backend will send them, already counted in
 * working hours: minutes left and the share of the target used. A deal
 * that has just arrived has the full decision target left, read from the
 * workspace, so Submissions and Settings › Workspace always agree.
 *
 * Every deal carries its checks (the Summary cards and the tab dots). Only
 * Harbor Street is designed, so the others share its checks, the same as
 * the tab content they show, until they get sample data of their own.
 *
 * Merchant and broker names sit on the deal until those areas move to the
 * data layer; then they become ids.
 */
const today = (time: string) => `2026-10-13T${time}:00-04:00`;
const yesterday = (time: string) => `2026-10-12T${time}:00-04:00`;
const friday = (time: string) => `2026-10-09T${time}:00-04:00`;
const none = { revenue: null, avgBalance: null, nsfs: null, positions: null };
const running = "Analysis is running. Results appear here in about a minute.";

export const deals: Deal[] = [
  {
    id: "APP-7H2K4Q", merchantName: "Harbor Street Bakery LLC", merchantInitials: "HB", brokerName: "Apex Funding Partners",
    requested: 45000, recommended: 40000, offered: null, renewal: false, analysis: "complete", score: 88, risk: "low", status: "ready",
    deadline: { kind: "left", minutes: 70, used: 0.7 }, ownerId: "usr_maya", receivedAt: today("09:40"), channel: "upload",
    metrics: { revenue: 61400, avgBalance: 9800, nsfs: 0, positions: 1 }, findings: [],
    summary: "Nothing unusual. Statements reconcile and the one position was disclosed.", nextStep: "Make a decision",
    profile: { industry: "Bakery", city: "Portland", state: "ME", since: 2016, ownerName: "Elena Brooks", firstDeal: true }, checks: harborChecks,
  },
  {
    id: "APP-RN4D2C", merchantName: "Coastal Dental Group", merchantInitials: "CD", brokerName: "Apex Funding Partners",
    requested: 80000, recommended: 80000, offered: null, renewal: true, analysis: "complete", score: 92, risk: "low", status: "ready",
    deadline: { kind: "left", minutes: 125, used: 0.5 }, ownerId: "usr_maya", receivedAt: yesterday("15:20"), channel: "renewal",
    metrics: { revenue: 118000, avgBalance: 22400, nsfs: 0, positions: 1, positionsNote: "ours" }, findings: [],
    summary: "Renewal. 72% of the current advance is paid and revenue is up 18% since funding.", nextStep: "Approve renewal and send offer",
    profile: null, checks: harborChecks,
  },
  {
    id: "APP-9K2M7R", merchantName: "Mesa Auto Repair", merchantInitials: "MA", brokerName: "BlueRock Advisors",
    requested: 35000, recommended: null, offered: null, renewal: false, analysis: "complete", score: 54, risk: "high", status: "review",
    deadline: { kind: "left", minutes: 25, used: 0.92 }, ownerId: "usr_maya", receivedAt: today("08:55"), channel: "bulk-zip",
    metrics: { revenue: 38200, avgBalance: 4100, nsfs: 3, positions: 3 },
    findings: [
      { text: "March statement balance does not match its own transactions", severe: true },
      { text: "New UCC filing found yesterday", severe: true },
      { text: "1 position was not disclosed on the application", severe: false },
    ],
    summary: null, nextStep: "Review integrity findings", profile: null, checks: harborChecks,
  },
  {
    id: "APP-0SP4PD", merchantName: "Sunrise Pediatric Dental", merchantInitials: "SP", brokerName: "BlueRock Advisors",
    requested: 90000, recommended: null, offered: null, renewal: false, analysis: "complete", score: 62, risk: "high", status: "review",
    deadline: { kind: "overdue", minutes: 15 }, ownerId: "usr_ari", receivedAt: yesterday("16:10"), channel: "bulk-zip",
    metrics: { revenue: 74000, avgBalance: 6200, nsfs: 1, positions: 4 },
    findings: [
      { text: "4 positions take 31% of revenue", severe: true },
      { text: "Deadline passed 15 minutes ago", severe: true },
    ],
    summary: null, nextStep: "Decide or hand to a senior underwriter", profile: null, checks: harborChecks,
  },
  {
    id: "APP-2GL7RT", merchantName: "Golden Lotus Restaurant", merchantInitials: "GL", brokerName: null,
    requested: 30000, recommended: null, offered: null, renewal: false, analysis: "complete", score: 77, risk: "medium", status: "review",
    deadline: { kind: "left", minutes: 220, used: 0.25 }, ownerId: "usr_maya", receivedAt: today("13:10"), channel: "upload",
    metrics: { revenue: 41700, avgBalance: 5500, nsfs: 2, positions: 1 },
    findings: [{ text: "2 NSFs in September", severe: false }],
    summary: null, nextStep: "Finish review", profile: null, checks: harborChecks,
  },
  {
    id: "APP-3QW8LP", merchantName: "Northline HVAC Services", merchantInitials: "NH", brokerName: "Summit Capital ISO",
    requested: 120000, recommended: 95000, offered: null, renewal: false, analysis: "complete", score: 81, risk: "low", status: "docs",
    deadline: { kind: "paused" }, ownerId: "usr_maya", receivedAt: friday("14:30"), channel: "manual",
    metrics: { revenue: 142000, avgBalance: 18900, nsfs: 0, positions: 2 },
    findings: [{ text: "Waiting on voided check for 2 days", severe: false }],
    summary: null, nextStep: "Remind merchant about the voided check", profile: null, checks: harborChecks,
  },
  {
    id: "APP-5TY6UB", merchantName: "Brightside Cleaning Co", merchantInitials: "BC", brokerName: null,
    requested: 25000, recommended: null, offered: null, renewal: false, analysis: "partial", score: null, risk: null, status: "docs",
    deadline: { kind: "paused" }, ownerId: "usr_maya", receivedAt: today("12:05"), channel: "merchant-link",
    metrics: none, findings: [{ text: "July statement missing", severe: false }],
    summary: null, nextStep: "Wait for July statement via Merchant Link", profile: null, checks: harborChecks,
  },
  {
    id: "APP-6RB3LO", merchantName: "Riverbend Landscaping LLC", merchantInitials: "RL", brokerName: "Summit Capital ISO",
    requested: 65000, recommended: null, offered: null, renewal: false, analysis: "running", score: null, risk: null, status: "new",
    deadline: { kind: "left", minutes: 235, used: 0.05 }, ownerId: null, receivedAt: today("10:42"), channel: "broker-upload",
    metrics: none, findings: [], summary: running, nextStep: "Assign an underwriter", profile: null, checks: harborChecks,
  },
  {
    id: "APP-4OD8VD", merchantName: "Oakview Deli", merchantInitials: "OD", brokerName: "Apex Funding Partners",
    requested: 20000, recommended: null, offered: null, renewal: false, analysis: "running", score: null, risk: null, status: "new",
    // Just arrived: the whole decision target is left.
    deadline: { kind: "left", minutes: workspace.decisionTargetHours * 60, used: 0.02 }, ownerId: null, receivedAt: today("14:05"), channel: "bulk-zip",
    metrics: none, findings: [], summary: running, nextStep: "Assign an underwriter", profile: null, checks: harborChecks,
  },
  {
    id: "APP-1TS5PC", merchantName: "Tri-State Plumbing Co", merchantInitials: "TP", brokerName: "Keystone Brokerage",
    requested: 150000, recommended: null, offered: 110000, renewal: false, analysis: "complete", score: 79, risk: "medium", status: "offer",
    deadline: { kind: "offer-expires", at: "2026-10-15T17:00:00-04:00", used: 0.4 }, ownerId: "usr_jordan", receivedAt: friday("11:15"), channel: "upload",
    metrics: { revenue: 186000, avgBalance: 24100, nsfs: 1, positions: 2 },
    findings: [{ text: "Counter-offer sent at $110K, 1.32 factor", severe: false }],
    summary: null, nextStep: "Wait for broker response", profile: null, checks: harborChecks,
  },
  {
    id: "APP-8PL2MN", merchantName: "Pinecrest Fitness Studio", merchantInitials: "PF", brokerName: "Keystone Brokerage",
    requested: 60000, recommended: 55000, offered: null, renewal: false, analysis: "complete", score: 84, risk: "low", status: "ready",
    deadline: { kind: "left", minutes: 200, used: 0.3 }, ownerId: "usr_jordan", receivedAt: today("11:02"), channel: "bulk-zip",
    metrics: { revenue: 71300, avgBalance: 11200, nsfs: 0, positions: 1 },
    findings: [{ text: "Landlord letter still needed before funding", severe: false }],
    summary: null, nextStep: "Make a decision", profile: null, checks: harborChecks,
  },
  {
    id: "APP-7CK2CF", merchantName: "Copper Kettle Café LLC", merchantInitials: "CK", brokerName: "Apex Funding Partners",
    requested: 40000, recommended: null, offered: null, renewal: false, analysis: "pending", score: null, risk: null, status: "new",
    deadline: { kind: "left", minutes: 230, used: 0.06 }, ownerId: "usr_maya", receivedAt: today("09:20"), channel: "manual",
    metrics: { ...none, positions: 1, positionsNote: "disclosed" },
    findings: [{ text: "2 statements and owner ID requested through Merchant Link", severe: false }],
    summary: null, nextStep: "Wait for the merchant to upload", profile: null, checks: harborChecks,
  },
];

export const queueSummary: DealQueueSummary = {
  open: 28,
  byStatus: { new: 6, docs: 4, review: 7, ready: 7, offer: 4 },
  pastDeadline: 2,
  reviewPastDeadline: 2,
  offersExpiringToday: 1,
  unassigned: 3,
  deadlineAtRisk: 4,
  overdueByOwner: { usr_ari: 1 },
};

export const queueStats: DealQueueStats = {
  waits: [
    { status: "new", medianMinutes: 38, bar: 0.12 },
    { status: "docs", medianMinutes: 2592, bar: 1 },
    { status: "review", medianMinutes: 130, bar: 0.3 },
    { status: "ready", medianMinutes: 55, bar: 0.16 },
    { status: "offer", medianMinutes: 2016, bar: 0.78 },
  ],
  closedToday: { approved: 8, countered: 2, declined: 4 },
  declineReasons: [
    { reason: "Revenue below policy minimum", count: 2 },
    { reason: "Too many existing positions", count: 1 },
    { reason: "Statement could not be verified", count: 1 },
  ],
};
