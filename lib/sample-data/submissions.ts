/**
 * Sample data for Submissions, copied from design/prototypes/Submissions.dc.html
 * (look: design/Submissions.html). Real API calls replace this later behind
 * the same types.
 */
import type { ChipColor } from "@/components/ui/Chip";

/**
 * The decision target: every new deal gets this many working hours. A deal
 * that has just arrived shows the full "4h left"; Settings › Workspace shows
 * the same target under Working hours.
 */
export const DECISION_TARGET_HOURS = 4;

export type DealStatus = "new" | "docs" | "review" | "ready" | "offer";
export type Risk = "Low" | "Medium" | "High" | "Not scored";
/** 0 fine, 1 getting close, 2 overdue, 3 paused or not timed */
export type SlaLevel = 0 | 1 | 2 | 3;

export type DealFlag = { text: string; severe: boolean };

export type Deal = {
  id: string;
  name: string;
  initials: string;
  /** two gradient stops for the 40px tile */
  gradient: [string, string];
  broker: string;
  requested: string;
  recommended: string;
  score: number | null;
  risk: Risk;
  status: DealStatus;
  sla: string;
  slaPercent: number;
  slaLevel: SlaLevel;
  owner: { initials: string; name: string } | null;
  received: string;
  preview: {
    revenue: string;
    balance: string;
    nsfs: string;
    positions: string;
    flags: DealFlag[];
    calm?: string;
    next: string;
  };
};

export const statusInfo: Record<DealStatus, { label: string; chip: ChipColor; dot: string }> = {
  new: { label: "New", chip: "grey", dot: "bg-grey-dot" },
  docs: { label: "Needs docs", chip: "amber", dot: "bg-amber" },
  review: { label: "In review", chip: "blue", dot: "bg-blue" },
  ready: { label: "Decision ready", chip: "green", dot: "bg-teal" },
  offer: { label: "Offer out", chip: "purple", dot: "bg-purple" },
};

export const riskChip: Record<Risk, ChipColor> = {
  Low: "green",
  Medium: "amber",
  High: "red",
  "Not scored": "grey",
};

/** Deadline text and bar colors by level. */
export const slaStyle: { text: string; bar: string }[] = [
  { text: "text-ink", bar: "bg-teal" },
  { text: "text-amber-deep", bar: "bg-amber" },
  { text: "text-coral-text", bar: "bg-red" },
  { text: "text-hint", bar: "bg-line-dashed" },
];

export type StatusCard = {
  key: DealStatus | "all";
  label: string;
  count: number;
  sub: string;
  dot: string;
};

export const statusCards: StatusCard[] = [
  { key: "all", label: "All open", count: 28, sub: "Across your team", dot: "bg-mint" },
  { key: "new", label: "New", count: 6, sub: "Not assigned or opened", dot: "bg-grey-dot" },
  { key: "docs", label: "Needs docs", count: 4, sub: "Waiting on stips", dot: "bg-amber" },
  { key: "review", label: "In review", count: 7, sub: "2 past deadline", dot: "bg-blue" },
  { key: "ready", label: "Decision ready", count: 7, sub: "Analysis complete", dot: "bg-teal" },
  { key: "offer", label: "Offer out", count: 4, sub: "1 expires today", dot: "bg-purple" },
];

export const submissionsHeader = {
  title: "Submissions",
  line: "28 open deals · 2 past their deadline",
};

export const savedViews = [
  { value: "all", label: "Everything" },
  { value: "mine", label: "Mine · 7" },
  { value: "unassigned", label: "Unassigned · 3" },
  { value: "risk", label: "Deadline at risk · 4", dot: true },
];

export const activeFilters = {
  applied: [{ label: "Received", value: "Last 7 days" }],
  more: ["Broker", "Channel", "Amount", "Industry", "Risk", "Assigned to"],
};

const maya = { initials: "MC", name: "Maya Chen" };
const ari = { initials: "AK", name: "Ari Kaplan" };
const jordan = { initials: "JR", name: "Jordan Reyes" };

export const deals: Deal[] = [
  { id: "APP-7H2K4Q", name: "Harbor Street Bakery LLC", initials: "HB", gradient: ["#0E6B5C", "#3FA58C"], broker: "Apex Funding Partners", requested: "$45K", recommended: "Rec. $40K", score: 88, risk: "Low", status: "ready", sla: "1h 10m left", slaPercent: 70, slaLevel: 0, owner: maya, received: "09:40, uploaded",
    preview: { revenue: "$61.4K/mo", balance: "$9.8K", nsfs: "0", positions: "1", flags: [], calm: "Nothing unusual. Statements reconcile and the one position was disclosed.", next: "Make a decision" } },
  { id: "APP-RN4D2C", name: "Coastal Dental Group", initials: "CD", gradient: ["#24588A", "#4F86BD"], broker: "Apex Funding Partners", requested: "$80K", recommended: "Renewal · rec. $80K", score: 92, risk: "Low", status: "ready", sla: "2h 05m left", slaPercent: 50, slaLevel: 0, owner: maya, received: "yesterday, renewal",
    preview: { revenue: "$118K/mo", balance: "$22.4K", nsfs: "0", positions: "1 (ours)", flags: [], calm: "Renewal. 72% of the current advance is paid and revenue is up 18% since funding.", next: "Approve renewal and send offer" } },
  { id: "APP-9K2M7R", name: "Mesa Auto Repair", initials: "MA", gradient: ["#A3341F", "#C2412D"], broker: "BlueRock Advisors", requested: "$35K", recommended: "Not set", score: 54, risk: "High", status: "review", sla: "25m left", slaPercent: 92, slaLevel: 1, owner: maya, received: "08:55 by bulk ZIP",
    preview: { revenue: "$38.2K/mo", balance: "$4.1K", nsfs: "3", positions: "3", flags: [{ text: "March statement balance does not match its own transactions", severe: true }, { text: "New UCC filing found yesterday", severe: true }, { text: "1 position was not disclosed on the application", severe: false }], next: "Review integrity findings" } },
  { id: "APP-0SP4PD", name: "Sunrise Pediatric Dental", initials: "SP", gradient: ["#57418A", "#8670B8"], broker: "BlueRock Advisors", requested: "$90K", recommended: "Not set", score: 62, risk: "High", status: "review", sla: "15m overdue", slaPercent: 100, slaLevel: 2, owner: ari, received: "yesterday, bulk ZIP",
    preview: { revenue: "$74.0K/mo", balance: "$6.2K", nsfs: "1", positions: "4", flags: [{ text: "4 positions take 31% of revenue", severe: true }, { text: "Deadline passed 15 minutes ago", severe: true }], next: "Decide or hand to a senior underwriter" } },
  { id: "APP-2GL7RT", name: "Golden Lotus Restaurant", initials: "GL", gradient: ["#0A5E50", "#2F8F7A"], broker: "Direct merchant", requested: "$30K", recommended: "Not set", score: 77, risk: "Medium", status: "review", sla: "3h 40m left", slaPercent: 25, slaLevel: 0, owner: maya, received: "13:10, uploaded",
    preview: { revenue: "$41.7K/mo", balance: "$5.5K", nsfs: "2", positions: "1", flags: [{ text: "2 NSFs in September", severe: false }], next: "Finish review" } },
  { id: "APP-3QW8LP", name: "Northline HVAC Services", initials: "NH", gradient: ["#A85C0B", "#D98A2B"], broker: "Summit Capital ISO", requested: "$120K", recommended: "Rec. $95K", score: 81, risk: "Low", status: "docs", sla: "Paused", slaPercent: 0, slaLevel: 3, owner: maya, received: "Fri, manual",
    preview: { revenue: "$142K/mo", balance: "$18.9K", nsfs: "0", positions: "2", flags: [{ text: "Waiting on voided check for 2 days", severe: false }], next: "Remind merchant about the voided check" } },
  { id: "APP-5TY6UB", name: "Brightside Cleaning Co", initials: "BC", gradient: ["#3E4A46", "#6B7873"], broker: "Direct merchant", requested: "$25K", recommended: "Not set", score: null, risk: "Not scored", status: "docs", sla: "Paused", slaPercent: 0, slaLevel: 3, owner: maya, received: "12:05 via Merchant Link",
    preview: { revenue: "Pending", balance: "Pending", nsfs: "—", positions: "—", flags: [{ text: "July statement missing", severe: false }], next: "Wait for July statement via Merchant Link" } },
  { id: "APP-6RB3LO", name: "Riverbend Landscaping LLC", initials: "RL", gradient: ["#4D6B2E", "#7FA05A"], broker: "Summit Capital ISO", requested: "$65K", recommended: "Analysing", score: null, risk: "Not scored", status: "new", sla: "3h 55m left", slaPercent: 5, slaLevel: 0, owner: null, received: "10:42 by upload",
    preview: { revenue: "Running", balance: "Running", nsfs: "—", positions: "—", flags: [], calm: "Analysis is running. Results appear here in about a minute.", next: "Assign an underwriter" } },
  { id: "APP-4OD8VD", name: "Oakview Deli", initials: "OD", gradient: ["#8A5A2B", "#B98552"], broker: "Apex Funding Partners", requested: "$20K", recommended: "Analysing", score: null, risk: "Not scored", status: "new", sla: `${DECISION_TARGET_HOURS}h left`, slaPercent: 2, slaLevel: 0, owner: null, received: "14:05 by bulk ZIP",
    preview: { revenue: "Running", balance: "Running", nsfs: "—", positions: "—", flags: [], calm: "Analysis is running. Results appear here in about a minute.", next: "Assign an underwriter" } },
  { id: "APP-1TS5PC", name: "Tri-State Plumbing Co", initials: "TP", gradient: ["#2C5F73", "#5A90A6"], broker: "Keystone Brokerage", requested: "$150K", recommended: "Offered $110K", score: 79, risk: "Medium", status: "offer", sla: "Expires Thu", slaPercent: 40, slaLevel: 3, owner: jordan, received: "Fri, uploaded",
    preview: { revenue: "$186K/mo", balance: "$24.1K", nsfs: "1", positions: "2", flags: [{ text: "Counter-offer sent at $110K, 1.32 factor", severe: false }], next: "Wait for broker response" } },
  { id: "APP-8PL2MN", name: "Pinecrest Fitness Studio", initials: "PF", gradient: ["#6B4FA0", "#9C86C9"], broker: "Keystone Brokerage", requested: "$60K", recommended: "Rec. $55K", score: 84, risk: "Low", status: "ready", sla: "3h 20m left", slaPercent: 30, slaLevel: 0, owner: jordan, received: "11:02 by bulk ZIP",
    preview: { revenue: "$71.3K/mo", balance: "$11.2K", nsfs: "0", positions: "1", flags: [{ text: "Landlord letter still needed before funding", severe: false }], next: "Make a decision" } },
  { id: "APP-7CK2CF", name: "Copper Kettle Café LLC", initials: "CK", gradient: ["#7A4A2A", "#B07A52"], broker: "Apex Funding Partners", requested: "$40K", recommended: "Waiting on docs", score: null, risk: "Not scored", status: "new", sla: "3h 50m left", slaPercent: 6, slaLevel: 0, owner: maya, received: "09:20, manual",
    preview: { revenue: "Pending", balance: "Pending", nsfs: "—", positions: "1 disclosed", flags: [{ text: "2 statements and owner ID requested through Merchant Link", severe: false }], next: "Wait for the merchant to upload" } },
];

/** Score ring color, as the prototype draws it. */
export function scoreColor(score: number): "teal" | "amber" | "red" {
  return score < 65 ? "red" : score < 80 ? "amber" : "teal";
}

export const initialSelected = "APP-9K2M7R";

/** Bulk action bar, shown once a deal is ticked (design/Submissions.dc.html). */
export const bulkActions = ["Assign", "Request documents", "Decline"];

export type Workload = { initials: string; name: string; open: number; percent: number; overdue?: number; warn?: boolean };
export const teamWorkload = {
  subtitle: "Open deals per underwriter, out of a daily capacity of 10",
  people: [
    { initials: "MC", name: "Maya Chen", open: 7, percent: 70 },
    { initials: "AK", name: "Ari Kaplan", open: 9, percent: 90, overdue: 1, warn: true },
    { initials: "JR", name: "Jordan Reyes", open: 6, percent: 60 },
    { initials: "PS", name: "Priya Shah", open: 3, percent: 30 },
  ] as Workload[],
  unassigned: 3,
};

export const whereDealsWait = {
  subtitle: "Median time in each status, last 30 days",
  stages: [
    { label: "New", value: "38 min", percent: 12 },
    { label: "Needs docs", value: "1.8 days", percent: 100, warn: true },
    { label: "In review", value: "2h 10m", percent: 30 },
    { label: "Decision ready", value: "55 min", percent: 16 },
    { label: "Offer out", value: "1.4 days", percent: 78 },
  ],
  note: "Deals spend the longest waiting for documents. Merchant Link reminders can shorten this.",
};

export const closedToday = {
  subtitle: "Deals that left this queue",
  total: 14,
  outcomes: [
    { label: "Approved", value: 8, color: "text-teal-deep" },
    { label: "Countered", value: 2, color: "text-amber-deep" },
    { label: "Declined", value: 4, color: "text-coral-text" },
  ],
  reasons: [
    { label: "Revenue below policy minimum", count: 2 },
    { label: "Too many existing positions", count: 1 },
    { label: "Statement could not be verified", count: 1 },
  ],
  href: "/funded",
};

export const keyboardHint = [
  { key: "J", alt: "K", text: "to move" },
  { key: "Enter", text: "to open" },
  { key: "A", text: "to assign" },
  { key: "X", text: "to select" },
];
