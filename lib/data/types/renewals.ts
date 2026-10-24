import type { Id, IsoDateTime, Money } from "./common";
import type { YearMonth } from "./deal-tabs";

/*
 * Renewals (design/Renewals.html) and Settings › Renewal rules
 * (design/Settings-Renewals.html). The saved rules decide who is ready;
 * lib/renewal-rules.ts runs them over every live advance. Candidates hold
 * only what a renewal adds (the suggested amount and its price); repaid
 * shares, revenue, balances and health come from the advance and the
 * merchant.
 */

/** Who counts as ready to renew. Settings › Renewal rules edits these. */
export type RenewalRules = {
  /** repaid at least, % */
  paid: number;
  /** no returned payments in this many days (0 = any time) */
  ret: number;
  /** revenue now vs at funding, % */
  rev: number;
  /** health score at least */
  score: number;
  /** no new advances from other funders */
  noStack: boolean;
};

export type OutreachKind = "heads-up" | "pre-approved" | "call" | "last-chance";

/** Everything saved on Settings › Renewal rules. */
export type RenewalSettings = {
  rules: RenewalRules;
  autoApprove: { on: boolean; upTo: Money };
  /** each step fires at this % repaid */
  outreach: { kind: OutreachKind; at: number; on: boolean }[];
  terms: {
    /** most offered, as a multiple of monthly revenue now */
    maxRevenueMultiple: number;
    /** how long the broker keeps a merchant's renewals */
    brokerKeepsMonths: number;
  };
  limits: { offerValidDays: number; minDaysBetween: number; reviewAfter: number; minNewCash: number };
};

/** A merchant on the renewal radar. */
export type RenewalCandidate = {
  advanceId: Id;
  /** suggested renewal and the most allowed; 0 while one can't be priced yet */
  suggested: Money;
  maxOffer: Money;
  /** the factor a new customer would get; the loyalty price comes off it */
  baseFactor: number;
  /** an offer already out or accepted; otherwise the rules decide */
  offer: "sent" | "accepted" | null;
};

export type RiskSignal = "credit-check" | "payoff-letter" | "competitor-offer";

/** The renewal pipeline as a whole. */
export type RenewalSummary = {
  /** what renewing everyone ready would fund */
  readyValue: Money;
  fundedByMonth: { month: YearMonth; amount: Money }[];
  /** reaching the paid line in the next 30 days */
  comingUp: { count: number; first: { advanceId: Id; reachesLineAt: IsoDateTime | null }[] };
  /** offers out before today */
  offersOut: number;
  accepted: { count: number; amount: Money };
  /** this quarter */
  renewed: { count: number; amount: Money };
  /** automatic outreach this month */
  outreach: { sent: number; replied: number };
  /** broker commission saved on renewals this quarter */
  commissionSaved: Money;
  /** spotted by Stacking Watch: an alert when it raised one, otherwise the signal it saw */
  atRisk: (({ alertId: Id } | { advanceId: Id; signal: RiskSignal }) & { likelihood: number; actBy: "today" | "week" })[];
};
