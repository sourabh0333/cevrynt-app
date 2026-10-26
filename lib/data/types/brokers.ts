import type { Id, IsoDateTime, Money } from "./common";
import type { AvatarColors } from "./funding";

/*
 * Brokers (design/Brokers.html). Fraud flags are not stored: they are the
 * Stacking Watch alerts on the deals and advances each broker sent. What a
 * broker is owed adds today's funded deals, at Pricing's broker points, to
 * what they earned earlier in the pay period.
 */

export type Broker = {
  id: Id;
  name: string;
  /** how deals and advances name them ("BlueRock" for BlueRock Advisors) */
  shortName: string;
  initials: string;
  colors: AvatarColors;
  contact: { name: string; email: string };
  score: number;
  /** last 90 days */
  submitted: number;
  funded: number;
  fundedVolume: Money;
  /** share of files complete on first send, 0–1 */
  completeFirstSend: number;
  /** share of their merchants' payments made late, 0–1 */
  paidLate: number;
  stipReplyHours: number;
  /** a lower rate than Pricing's, if agreed; and whether they're paid on renewals */
  commission: { newDealPoints: number | null; onRenewals: boolean };
  /** how long they keep a merchant's renewals; null for none */
  renewalRightsMonths: number | null;
  /** submissions per week, last 8 weeks */
  weeklySubmissions: number[];
  declineReasons: { reason: string; count: number; fraud?: boolean }[];
  note: { text: string; tone: "good" | "neutral" | "risk" };
  /** commission earned this pay period before today */
  earned: { deals: number; amount: Money };
  /** deals sent and funded this month */
  thisMonth: { submitted: number; funded: number };
};

export type BrokerBook = {
  active: number;
  /** this quarter */
  fundedThroughBrokers: Money;
  shareOfFunding: number;
  avgFundRate: number;
  completeFirstSend: number;
  /** commission taken back this pay period */
  clawbacks: { brokerId: Id; amount: Money; reason: string }[];
  /** day of the week commission is paid, 0 = Sunday */
  payoutWeekday: number;
  ownership: {
    merchant: string;
    winner: { brokerId: Id; completeAt: IsoDateTime };
    other: { brokerId: Id } & ({ outcome: "told"; sentAt: IsoDateTime } | { outcome: "incomplete"; missing: string });
  }[];
  applicants: { name: string; note: { appliedAt: IsoDateTime } | { text: string }; checks: ["ok" | "wait" | "bad", "ok" | "wait" | "bad", "ok" | "wait" | "bad"]; result: "approve" | "waiting" | "decline" }[];
  paperwork: { label: string; have: number }[];
  /** industries named on the weekly appetite sheet */
  appetiteIndustries: string[];
};
