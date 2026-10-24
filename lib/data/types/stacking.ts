import type { Id, IsoDateTime, Money } from "./common";
import type { YearMonth } from "./deal-tabs";

/*
 * Stacking Watch (design/Stacking.html). Each alert points at the record
 * it is about: a deal in review, a deal in the funding queue, or a live
 * advance, so its merchant and deal stage are read from there. Offers'
 * on-hold funding, Funded deals' advances, Renewals' at-risk merchants and
 * the brokers' fraud flags all point back at these alerts.
 */

export type AlertKind = "ucc" | "debit" | "bank" | "duplicate" | "inquiry";
export type AlertSeverity = "high" | "medium";

/** What an alert is about. */
export type AlertTarget =
  | { kind: "deal"; dealId: Id }
  | { kind: "funding"; fundingId: Id }
  | { kind: "advance"; advanceId: Id }
  /** an advance the funded book counts but the sample doesn't list one by one */
  | { kind: "book"; merchant: string; repaid: number };

/** Two applications tied together through a shared bank account and phone. */
export type AlertConnection = {
  account: string;
  /** ten digits */
  phone: string;
  /** what each side is called on the map */
  labels: { here: string; other: string };
  owners: { here: string; other: string };
  other: { name: string; shortName: string; fundedMonth: YearMonth; broker: string };
};

export type StackingAlert = {
  id: Id;
  severity: AlertSeverity;
  kind: AlertKind;
  target: AlertTarget;
  seenAt: IsoDateTime;
  /** what happened, as Stacking Watch worded it */
  summary: string;
  /** the evidence, as captured */
  facts: [string, string][];
  advice: string;
  action: string;
  status: "open" | "reviewed";
  connection?: AlertConnection;
};

export type AutoRule = "hold" | "notify" | "broker" | "pause" | "renew";

export type StackingSummary = {
  /** merchants watched: with a live bank connection, and on filings and credit only */
  watched: { full: number; partial: number };
  month: { raised: number; real: number; stopped: { count: number; amount: Money }; falseAlarms: number };
  /** the automatic steps and whether each is on */
  rules: { key: AutoRule; on: boolean }[];
};
