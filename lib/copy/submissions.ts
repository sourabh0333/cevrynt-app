/**
 * Interface wording for Submissions (design/Submissions.html and its
 * prototype). The deals, queue counts, waits and workload come from the
 * data layer (submissionsView); this file holds what people read around
 * them. Lines that quote a count are functions of it.
 */
import type { DealQueueSummary, DealStatus } from "@/lib/data/types";
import { dealStatusLabel } from "./deal";

export const submissionsHeader = {
  title: "Submissions",
  line: (s: Pick<DealQueueSummary, "open" | "pastDeadline">) => `${s.open} open deals · ${s.pastDeadline} past their deadline`,
  archived: { label: "Archived", href: "/submissions" },
};

export type StatusCardKey = DealStatus | "all";

/** The six status cards, all open first. */
export const statusCards = (s: DealQueueSummary): { key: StatusCardKey; label: string; count: number; sub: string }[] => [
  { key: "all", label: "All open", count: s.open, sub: "Across your team" },
  { key: "new", label: dealStatusLabel.new, count: s.byStatus.new, sub: "Not assigned or opened" },
  { key: "docs", label: dealStatusLabel.docs, count: s.byStatus.docs, sub: "Waiting on stips" },
  { key: "review", label: dealStatusLabel.review, count: s.byStatus.review, sub: `${s.reviewPastDeadline} past deadline` },
  { key: "ready", label: dealStatusLabel.ready, count: s.byStatus.ready, sub: "Analysis complete" },
  { key: "offer", label: dealStatusLabel.offer, count: s.byStatus.offer, sub: `${s.offersExpiringToday} expires today` },
];

export const toolbar = {
  filterLabel: "Filter by status",
  toolbarLabel: "Search and views",
  searchLabel: "Search submissions",
  searchPlaceholder: "Merchant, owner, APP ID or broker",
  viewsLabel: "Views",
  saveView: "+ Save view",
  filters: "Filters",
  sort: "Deadline first",
};

/** Saved views; the counts are my deals today, unassigned and deadline at risk. */
export const savedViews = (mine: number, s: Pick<DealQueueSummary, "unassigned" | "deadlineAtRisk">): { value: string; label: string; dot?: boolean }[] => [
  { value: "all", label: "Everything" },
  { value: "mine", label: `Mine · ${mine}` },
  { value: "unassigned", label: `Unassigned · ${s.unassigned}` },
  { value: "risk", label: `Deadline at risk · ${s.deadlineAtRisk}`, dot: true },
];

export const activeFilters = {
  label: "Active filters",
  title: "Filters",
  applied: [{ label: "Received", value: "Last 7 days" }],
  more: ["Broker", "Channel", "Amount", "Industry", "Risk", "Assigned to"],
  clear: "Clear all",
};

export const queue = {
  title: "Deals",
  bulk: { label: "Bulk actions", selected: (n: number) => `${n} selected`, actions: ["Assign", "Request documents", "Decline"], clear: "Clear" },
  selectAll: "Select all deals shown",
  select: (name: string) => `Select ${name}`,
  preview: (name: string) => `Preview ${name}`,
  columns: ["Merchant", "Amount", "Score · risk", "Status", "Deadline"],
  scoreLabel: (score: number) => `Score ${score}`,
  notScored: "Not scored",
  assignedTo: (name: string) => `Assigned to ${name}`,
  unassigned: "Not assigned yet",
  empty: "No deals match. Try another status or search.",
  showing: (n: number, total: number) => `Showing ${n} of ${total}`,
  previous: "Previous",
  next: "Next",
};

export const quickPreview = {
  cap: "Quick preview",
  sub: (broker: string, requested: string) => `${broker} · requested ${requested}`,
  stats: { revenue: "True revenue", balance: "Avg balance", nsfs: "NSFs · 4 mo", positions: "Positions" },
  open: "Open deal",
};

export const needsALook = {
  title: "What needs a look",
  found: (n: number) => `${n} found`,
  clear: "All clear",
  next: "Next step",
};

export const workloadCard = {
  title: "Team workload",
  subtitle: (capacity: number) => `Open deals per underwriter, out of a daily capacity of ${capacity}`,
  overdue: (n: number) => ` · ${n} overdue`,
  unassigned: (n: number) => `${n} unassigned`,
  unassignedAfter: " deals",
  autoAssign: "Auto-assign",
};

/** "38 min", "2h 10m", "1.8 days" */
export const waitLabel = (minutes: number) =>
  minutes < 60 ? `${minutes} min` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${(minutes / 1440).toFixed(1)} days`;

export const waitsCard = {
  title: "Where deals wait",
  subtitle: "Median time in each status, last 30 days",
  note: "Deals spend the longest waiting for documents. Merchant Link reminders can shorten this.",
};

export const closedCard = {
  title: "Closed today",
  subtitle: "Deals that left this queue",
  outcomes: { approved: "Approved", countered: "Countered", declined: "Declined" },
  reasons: "Top decline reasons",
  link: { label: "See closed deals", href: "/funded" },
};

export const keyboardHint = {
  lead: "Keyboard:",
  keys: [
    { key: "J", alt: "K", text: "to move" },
    { key: "Enter", text: "to open" },
    { key: "A", text: "to assign" },
    { key: "X", text: "to select" },
  ] as { key: string; alt?: string; text: string }[],
};
