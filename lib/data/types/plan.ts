import type { IsoDateTime, Money } from "./common";
import type { YearMonth } from "./deal-tabs";

/*
 * Settings › Plan & usage (design/Settings-Plan.html). The deals used this
 * month are not stored here: they are Intake's monthly channel counts. The
 * cost per deal is worked out from the plan price and those deals, so
 * Plan & usage and Reports quote the same figure. Seats are the team.
 */

export type PlanTier = {
  name: string;
  monthly: Money;
  deals: number;
  seats: number;
  /** which of the plan features it includes, in the order lib/copy/plan lists them */
  features: boolean[];
};

export type Plan = {
  /** the current plan */
  current: PlanTier;
  renewsAt: IsoDateTime;
  /** price of each deal past the included ones */
  extraDeal: Money;
  /** the monthly spend limit on extra deals */
  spendLimit: Money;
  /** warn when this share of the included deals is used */
  warn: { on: boolean; at: number };
  yearlyDiscount: number;
  usage: {
    /** blank pages, cover sheets and duplicates skipped this month */
    pagesSkipped: number;
    linkSessions: number;
    /** deals analyzed per working day, oldest first; the last is today */
    perDay: number[];
    avgPerDay: number;
    /** where the month is heading */
    pace: number;
  };
  /** the other plans, cheapest first; the current one sits between them */
  otherTiers: { below: PlanTier[]; above: PlanTier[] };
  invoices: { month: YearMonth; amount: Money; paid: boolean }[];
  payment: { last4: string; kind: string; expires: string; billingEmail: string };
};
