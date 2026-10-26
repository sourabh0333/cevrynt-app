import type { Id, Money } from "./common";
import type { RuleId } from "./policy";

/*
 * Reports (design/Reports.html). A period's snapshot holds only what no
 * other record has: its funnel, the median time to a decision and the
 * period before it. This month's funding, the loss rate, broker points and
 * cost per deal are read from Offers & funding, Funded deals, Pricing and
 * Plan & usage.
 */

export type ReportPeriod = "week" | "month" | "quarter" | "year";

/** How the deals that came in during a period moved, step by step. */
export type Funnel = { submitted: number; fitPolicy: number; reviewed: number; approved: number; accepted: number; funded: number };

export type ReportSnapshot = {
  period: ReportPeriod;
  /** money funded; null for the month, which Offers & funding's monthly history holds */
  funded: Money | null;
  funnel: Funnel;
  /** median minutes from submission to decision */
  decisionMinutes: number;
  /** the period before, for the change on each tile; null funded for the month (last month's history) and null loss rate where it is year to date */
  prev: { funded: Money | null; dealsFunded: number; approvalRate: number; pullThrough: number; decisionMinutes: number; lossRate: number | null };
  /** each key number's trend over the period, five points, in tile order */
  trends: number[][];
};

/** How a policy rule did this month: what it declined, and how deals it passed pay. */
export type RulePerformance = {
  rule: Extract<RuleId, "revenue" | "positions" | "age" | "industry" | "debt"> | "integrity";
  declined: number;
  /** late payments on deals it let through, 0–1 */
  latePassed: number;
  verdict: "working" | "tighten" | "watch" | "loosen";
  /** a value worth simulating, in the rule's own unit (positions, months); the debt rule tries the policy draft */
  simulate?: number;
};

/** Deals finished this year: what comes back for each $1 funded, in cents. */
export type UnitEconomics = { averageDeal: Money; averageFactor: number; averageTermMonths: number; lossCents: number; costCents: number };

/** An underwriter's quarter. */
export type TeamPerformance = { memberId: Id; decided: number; medianMinutes: number; approved: number; agrees: number; late: number };

export type ReportsBook = {
  rules: RulePerformance[];
  unit: UnitEconomics;
  team: TeamPerformance[];
};
