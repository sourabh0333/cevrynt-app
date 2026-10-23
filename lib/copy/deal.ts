/**
 * Interface wording for deals, shared by Submissions and the deal frame
 * (the header and tab bar on every deal tab, design/Deal-Summary.html).
 * The deal records come from the data layer (lib/data/deals); this file
 * turns their plain values into what people read: statuses, deadlines,
 * received times, amounts and the quick-look figures.
 */
import type { CheckKey, CheckState, Deal, DealCheckSet, DealDeadline, DealRisk, DealStatus, IsoDateTime } from "@/lib/data/types";
import { daysBetween, money, moneyK, moneyShort, timeOfDay, weekdayShort } from "@/lib/format";

export const dealStatusLabel: Record<DealStatus, string> = {
  new: "New",
  docs: "Needs docs",
  review: "In review",
  ready: "Decision ready",
  offer: "Offer out",
};

const riskWords: Record<DealRisk, string> = { low: "Low", medium: "Medium", high: "High" };
export const riskLabel = (risk: DealRisk | null) => (risk === null ? "Not scored" : riskWords[risk]);

/** The broker's name, or "Direct merchant" when there is none. */
export const brokerLabel = (d: Pick<Deal, "brokerName">) => d.brokerName ?? "Direct merchant";

/** "1h 10m", "2h 05m", "25m", "4h" */
export const hoursAndMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? (m ? `${h}h ${String(m).padStart(2, "0")}m` : `${h}h`) : `${m}m`;
};

/** "1h 10m left", "15m overdue", "Paused", "Expires Thu" */
export function deadlineLabel(d: DealDeadline) {
  switch (d.kind) {
    case "left":
      return `${hoursAndMinutes(d.minutes)} left`;
    case "overdue":
      return `${hoursAndMinutes(d.minutes)} overdue`;
    case "paused":
      return "Paused";
    case "offer-expires":
      return `Expires ${weekdayShort(d.at)}`;
  }
}

/** Minutes left at or under which a deadline counts as getting close. */
export const DEADLINE_CLOSE_MINUTES = 30;

/** 0 fine, 1 getting close, 2 overdue, 3 paused or not timed */
export function deadlineLevel(d: DealDeadline): 0 | 1 | 2 | 3 {
  if (d.kind === "left") return d.minutes <= DEADLINE_CLOSE_MINUTES ? 1 : 0;
  if (d.kind === "overdue") return 2;
  return 3;
}

/** How full the deadline bar is, 0–100. */
export function deadlinePercent(d: DealDeadline) {
  if (d.kind === "overdue") return 100;
  if (d.kind === "paused") return 0;
  return Math.round(d.used * 100);
}

const channelToday: Record<Deal["channel"], string> = {
  upload: ", uploaded",
  "broker-upload": " by upload",
  "bulk-zip": " by bulk ZIP",
  manual: ", manual",
  "merchant-link": " via Merchant Link",
  renewal: ", renewal",
};
const channelEarlier: Record<Deal["channel"], string> = { ...channelToday, "bulk-zip": ", bulk ZIP" };

/** "09:40, uploaded", "yesterday, renewal", "Fri, manual" */
export function receivedLabel(d: Pick<Deal, "receivedAt" | "channel">, now: IsoDateTime) {
  const days = daysBetween(d.receivedAt, now);
  if (days <= 0) return timeOfDay(d.receivedAt) + channelToday[d.channel];
  return (days === 1 ? "yesterday" : weekdayShort(d.receivedAt)) + channelEarlier[d.channel];
}

/** The line under the amount: "Rec. $40K", "Renewal · rec. $80K", "Offered $110K", "Analysing", "Not set" */
export function recommendedLabel(d: Pick<Deal, "offered" | "recommended" | "renewal" | "analysis">) {
  if (d.offered !== null) return `Offered ${moneyShort(d.offered)}`;
  if (d.recommended !== null) return d.renewal ? `Renewal · rec. ${moneyShort(d.recommended)}` : `Rec. ${moneyShort(d.recommended)}`;
  if (d.analysis === "running") return "Analysing";
  if (d.analysis === "pending") return "Waiting on docs";
  return "Not set";
}

/** The four quick-look figures, as the queue preview shows them. */
export function metricLabels(d: Pick<Deal, "metrics" | "analysis">) {
  const m = d.metrics;
  const unknown = d.analysis === "running" ? "Running" : "Pending";
  const positions =
    m.positions === null ? "—" : m.positionsNote === "ours" ? `${m.positions} (ours)` : m.positionsNote === "disclosed" ? `${m.positions} disclosed` : String(m.positions);
  return {
    revenue: m.revenue === null ? unknown : `${moneyK(m.revenue)}/mo`,
    balance: m.avgBalance === null ? unknown : moneyK(m.avgBalance),
    nsfs: m.nsfs === null ? "—" : String(m.nsfs),
    positions,
  };
}

/* ---------- The deal frame: header and tabs ---------- */

export const dealActions = {
  secondary: ["Request documents", "Decline"],
  primary: "Make a decision",
};

/**
 * The header card. A deal with the merchant's profile gets the design's
 * full header (about line, full amounts, "In 1h 10m"); the others show
 * what the queue knows about them, so every "Open deal" lands on a real
 * frame.
 */
export const dealHeader = {
  crumb: { label: "Submissions", href: "/submissions" },
  facts: { requested: "Requested", recommended: "Recommended", broker: "Broker", underwriter: "Underwriter", due: "Decision due" },
  dueBar: "Time left before the decision is due",
  unassigned: "Not assigned yet",
  merchantHref: "/merchants",
  about: (d: Deal, now: IsoDateTime) =>
    d.profile
      ? `${d.profile.industry} · ${d.profile.city}, ${d.profile.state} · since ${d.profile.since} · Owner ${d.profile.ownerName}`
      : `${brokerLabel(d)} · received ${receivedLabel(d, now)}`,
  merchantNote: (d: Deal) => (d.profile?.firstDeal ? "First deal with you · see merchant" : "See merchant"),
  requested: (d: Deal) => (d.profile ? money(d.requested) : moneyShort(d.requested)),
  recommended: (d: Deal) => {
    if (d.offered !== null) return `Offered ${moneyShort(d.offered)}`;
    if (d.recommended !== null) return d.profile ? money(d.recommended) : moneyShort(d.recommended);
    return recommendedLabel(d);
  },
  due: (d: Deal) => (d.profile && d.deadline.kind === "left" ? `In ${hoursAndMinutes(d.deadline.minutes)}` : deadlineLabel(d.deadline)),
};

/** The nine tabs, in design order. `path` is appended to /deals/[id]. */
export type DealTabKey = "summary" | "cash-flow" | "positions" | "integrity" | "business" | "conditions" | "offer" | "decision" | "activity";

export type DealTab = {
  key: DealTabKey;
  label: string;
  path: string;
  /** browser tab title */
  title: string;
};

/*
 * The dots and counts after the labels come from each deal's own data
 * (see tabStates and DealTabs).
 */
export const dealTabs: DealTab[] = [
  { key: "summary", label: "Summary", path: "", title: "Deal summary" },
  { key: "cash-flow", label: "Cash flow", path: "/cash-flow", title: "Deal cash flow" },
  { key: "positions", label: "Positions & debt", path: "/positions", title: "Deal positions and debt" },
  { key: "integrity", label: "Integrity", path: "/integrity", title: "Deal integrity" },
  { key: "business", label: "Business & owners", path: "/business", title: "Deal business and owners" },
  { key: "conditions", label: "Conditions & stips", path: "/conditions", title: "Deal conditions and stips" },
  { key: "offer", label: "Offer & disclosures", path: "/offer", title: "Deal offer and disclosures" },
  { key: "decision", label: "Decision & memo", path: "/decision", title: "Deal decision and memo" },
  { key: "activity", label: "Activity", path: "/activity", title: "Deal activity" },
];

export const dealTabsLabel = "Deal sections";

/** A check's dot in the tab bar: teal when clear, amber when it needs a look. */
export const checkDot = (c: CheckState): "teal" | "amber" => (c.state === "ok" ? "teal" : "amber");

/**
 * The tabs that show a check after the label: a count of open items when
 * there are some (Conditions), otherwise the check's dot.
 */
export const tabCheck: Partial<Record<DealTabKey, CheckKey>> = {
  "cash-flow": "cashFlow",
  positions: "positions",
  integrity: "integrity",
  business: "business",
  conditions: "conditions",
};

/** Where a tab stands: a check's state, or nothing to show yet. */
export type TabState = CheckState | { state: "none" };

/** What a tab shows after its label: a count of open items, a dot, or nothing. */
export const tabMark = (c: TabState): { dot?: "teal" | "amber"; count?: number } =>
  c.state === "none" ? {} : c.state === "open" ? { count: c.count } : { dot: checkDot(c) };

/** The deal's progress the Offer, Decision and Activity tabs show. */
export type DealProgress = { offerSent: boolean; decided: boolean; unreadMessages: number };

/**
 * Every tab's state from the deal's own data: the checks for the analysis
 * tabs, then a teal dot once the offer is sent or a decision recorded, and
 * a count of messages nobody has opened on Activity. Before any of that
 * (as on the sample deal) those three show nothing, as in the design.
 */
export function tabStates(checks: DealCheckSet, progress: DealProgress): Partial<Record<DealTabKey, TabState>> {
  const states: Partial<Record<DealTabKey, TabState>> = {};
  for (const [tab, key] of Object.entries(tabCheck) as [DealTabKey, CheckKey][]) states[tab] = checks[key];
  states.offer = progress.offerSent ? { state: "ok" } : { state: "none" };
  states.decision = progress.decided ? { state: "ok" } : { state: "none" };
  states.activity = progress.unreadMessages ? { state: "open", count: progress.unreadMessages } : { state: "none" };
  return states;
}

export const dealTabHref = (id: string, tab: Pick<DealTab, "path">) => `/deals/${id}${tab.path}`;

/** Where "Open deal" goes. */
export const dealHref = (id: string) => `/deals/${id}`;
