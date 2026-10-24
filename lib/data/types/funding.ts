import type { Id, IsoDateTime, Money } from "./common";

/*
 * Offers & funding (design/Offers.html): approved offers on their way to
 * funded, the funding queue, the releases a second person makes, and the
 * funding desk's own settings. Labels and headings are in lib/copy/offers.
 */

export type OfferStage = "sent" | "accepted" | "contract" | "checks" | "funded";

/** An avatar's two gradient stops, as the merchant's tile shows them. */
export type AvatarColors = [string, string];

export type PipelineOffer = {
  id: Id;
  merchant: string;
  initials: string;
  colors: AvatarColors;
  broker: string;
  amount: Money;
  stage: OfferStage;
  /** the underwriter who owns it ("Mine") */
  ownerId: Id;
  /** when an offer still out stops being valid */
  expiresAt?: IsoDateTime;
  /** the broker sent back their own terms */
  countered?: boolean;
  renewal?: boolean;
  /** an accepted offer whose contract goes out today */
  contractDueAt?: IsoDateTime;
  /** contract signatures so far */
  signatures?: { signed: number; needed: number };
  /** the merchant opened the contract */
  viewed?: boolean;
  /** money sent, for funded offers */
  sentAt?: IsoDateTime;
};

/** One deal in the funding queue: approved, signed and checked. */
export type QueuedFunding = {
  id: Id;
  dealId: Id;
  merchant: string;
  initials: string;
  colors: AvatarColors;
  amount: Money;
  /** origination fee, as a share of the amount */
  fee: number;
  /** wired straight to the prior funder from this advance */
  payoff: Money;
  bank: { name: string; last4: string };
  method: "ach" | "wire";
  /** what the last check before money moves found */
  finalCheck: { ok: true } | { ok: false; finding: string };
};

/** Money sent: who started it, who released it, and the bank's reference. */
export type Release = {
  id: Id;
  merchant: string;
  broker: string;
  amount: Money;
  method: "ach" | "wire";
  startedById: Id;
  startedAt: IsoDateTime;
  releasedById: Id;
  sentAt: IsoDateTime;
  reference: string;
  status: "sent" | "confirmed" | "settled" | "returned";
  firstPaymentAt: IsoDateTime;
};

export type LostReason = "other-funder" | "payment" | "expired" | "checks";

/** The funding desk: cut-offs, the daily capital limit and how releases work. */
export type FundingDesk = {
  achCutoff: IsoDateTime;
  wireCutoff: IsoDateTime;
  dailyLimit: Money;
  /** capital already committed today */
  committedToday: Money;
  /** how long a release can be undone */
  undoMinutes: number;
};

export type FundingSummary = {
  /** deals between an approval and money sent */
  inProgress: number;
  /** deals in each stage, including the ones the list doesn't show */
  stageTotals: Record<OfferStage, number>;
  /** median days from offer to funded, last 30 days */
  medianDaysToFund: number;
  fundedThisMonth: Money;
  fundedLastMonth: Money;
  lost: { reason: LostReason; count: number }[];
  /** approved offers in the last 30 days */
  approved: number;
  /** median minutes from a complete file to an offer */
  medianMinutesToOffer: number;
};
