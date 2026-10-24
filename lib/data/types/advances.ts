import type { Id, IsoDateTime, Money } from "./common";
import type { YearMonth } from "./deal-tabs";
import type { AvatarColors } from "./funding";

/*
 * Funded deals (design/Funded.html): the advances being repaid, today's
 * payments, and what the book looks like. Findings worded by the system
 * (a flag on a deal, an early warning) are data; labels and headings are
 * in lib/copy/funded. Each advance points at its merchant by id; Merchants,
 * Renewals and Renewal rules read the same advances.
 */

export type AdvanceStatus = "ok" | "slow" | "late" | "soon" | "new";
export type PaymentMark = "cleared" | "returned" | "slow" | "upcoming";

export type Advance = {
  id: Id;
  merchantId: Id;
  /** the broker's short name */
  broker: string;
  fundedAt: IsoDateTime;
  amount: Money;
  payback: Money;
  /** collected so far */
  paid: Money;
  dailyPayment: Money;
  /** the last ten payments, oldest first */
  lastPayments: PaymentMark[];
  /** daily revenue now against the month it was funded; null before there's any */
  revenueChange: number | null;
  status: AdvanceStatus;
  payoff: { kind: "date"; month: YearMonth; part?: "early" | "late" } | { kind: "at-risk" } | { kind: "watch" };
  /** daily revenue since funding, as a share of the level at funding */
  trend: number[];
  flag: { text: string; tone: "good" | "watch" | "risk" | "none" };
  next: "renewal" | "call" | "plan" | "stacking" | "schedule";
  /** the last returned payment; null when none has bounced (another funder's advance shows up as a Stacking Watch alert) */
  lastReturnedAt: IsoDateTime | null;
};

export type FundedBook = {
  /** the advances on the book's first page, in the order it lists them */
  page: Id[];
  /** advances being repaid, by status */
  counts: Record<Exclude<AdvanceStatus, "new">, number>;
  outstanding: Money;
  collectedThisMonth: Money;
  /** collected as a share of what was scheduled this month */
  ofSchedule: number;
  atRisk: Money;
  paidOffThisMonth: number;
  renewedWithYou: number;
  today: {
    settleBy: IsoDateTime;
    cleared: { count: number; amount: Money };
    pending: { count: number; amount: Money };
    returned: { count: number; amount: Money };
  };
  warnings: { merchant: string; what: string; detail: string; tone: "red" | "amber"; opens: "stacking" | "book" }[];
  /** share collected so far, by month funded */
  vintages: { month: YearMonth; collected: number }[];
  vintagesOnPlan: boolean;
  reconciliation: { merchant: string; askedAt: IsoDateTime; salesChange: number; respondBy: IsoDateTime };
  /** expected collections a week ahead; the column heights are the design chart's, in px */
  forecast: { weekOf: IsoDateTime; expected: Money; atRisk: Money; height: number }[];
  returnedThisWeek: { count: number; amount: Money };
  returned: { merchant: string; amount: Money; reason: "funds" | "blocked"; next: { kind: "retry"; at: IsoDateTime } | { kind: "cleared" } | { kind: "call" } }[];
  recovery: { behind: { count: number; amount: Money }; contacted: { count: number; amount: Money }; plan: { count: number; amount: Money }; backOnTrack: number; writtenOff: { count: number; amount: Money } };
  returns: { perDollar: number; lossRate: number; writtenOff: Money; clawedBack: Money };
  payingOff: { count: number; amount: Money; first: { merchant: string; initials: string; colors: AvatarColors; month: YearMonth }[] };
};
