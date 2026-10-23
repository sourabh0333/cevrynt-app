import type { Id, IsoDateTime, Money } from "./common";

export type DealStatus = "new" | "docs" | "review" | "ready" | "offer";
export type DealRisk = "low" | "medium" | "high";

/**
 * How the package came in: uploaded by the team, uploaded by the broker,
 * a bulk ZIP, a manual lead, Merchant Link, or a renewal of our own advance.
 */
export type DealChannel = "upload" | "broker-upload" | "bulk-zip" | "manual" | "merchant-link" | "renewal";

/** Where the analysis stands: done, still running, or waiting on statements (none yet, or some missing). */
export type DealAnalysis = "complete" | "running" | "pending" | "partial";

/**
 * Time left on the decision target, worked out by the backend in working
 * hours (nights, weekends and paused deals don't count). `used` is the share
 * of the target already gone, 0–1, for the deadline bar.
 */
export type DealDeadline =
  | { kind: "left"; minutes: number; used: number }
  | { kind: "overdue"; minutes: number }
  | { kind: "paused" }
  | { kind: "offer-expires"; at: IsoDateTime; used: number };

/** Something the checks found that needs a look. */
export type DealFinding = { text: string; severe: boolean };

/** What the merchant told us about themselves, shown in the deal header. */
export type MerchantProfile = { industry: string; city: string; state: string; since: number; ownerName: string; firstDeal: boolean };

export type Deal = {
  /** public form, e.g. "APP-7H2K4Q" */
  id: Id;
  merchantName: string;
  merchantInitials: string;
  /** null when the merchant applied directly */
  brokerName: string | null;
  requested: Money;
  /** Cevrynt's suggested amount, once there is one */
  recommended: Money | null;
  /** the amount in an offer already sent */
  offered: Money | null;
  renewal: boolean;
  analysis: DealAnalysis;
  /** underwriting score, null until analysed */
  score: number | null;
  risk: DealRisk | null;
  status: DealStatus;
  deadline: DealDeadline;
  /** a team member's id; null while unassigned */
  ownerId: Id | null;
  receivedAt: IsoDateTime;
  channel: DealChannel;
  /** the quick-look figures; null while not known yet */
  metrics: {
    revenue: Money | null;
    avgBalance: Money | null;
    nsfs: number | null;
    positions: number | null;
    /** "ours" for our own advance on a renewal, "disclosed" when only the application says so */
    positionsNote?: "ours" | "disclosed";
  };
  findings: DealFinding[];
  /** the one-line all-clear when nothing was found */
  summary: string | null;
  nextStep: string;
  /** the merchant's own details, where we have them */
  profile: MerchantProfile | null;
};

/** Counts across the whole open queue (the list itself is one page of it). */
export type DealQueueSummary = {
  open: number;
  byStatus: Record<DealStatus, number>;
  pastDeadline: number;
  /** in review and past the deadline */
  reviewPastDeadline: number;
  offersExpiringToday: number;
  unassigned: number;
  deadlineAtRisk: number;
  /** overdue deals per team member id */
  overdueByOwner: Record<Id, number>;
};

/* ---------- Page-shaped joins (lib/data/views) ---------- */

/** The team member a deal is assigned to. */
export type DealOwner = { id: Id; initials: string; name: string };

/** A deal with its owner joined in, as lists and the deal header show it. */
export type DealListItem = Deal & { owner: DealOwner | null };

/** One underwriter's load today, for "Team workload". */
export type WorkloadRow = DealOwner & { open: number; capacity: number; overdue: number };

/** How the queue moved: median wait per status (last 30 days) and today's closed deals. */
export type DealQueueStats = {
  waits: { status: DealStatus; medianMinutes: number; bar: number }[];
  closedToday: { approved: number; countered: number; declined: number };
  declineReasons: { reason: string; count: number }[];
};
