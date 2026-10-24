import type { Id, IsoDateTime, Money } from "./common";

/** The policy's money lines, in dollars. Shared by Policy, Team & roles, the Offer tab and the application form. */
export type PolicyLimits = {
  /** smallest offer */
  minAmount: Money;
  /** deals over this need a senior underwriter; also what an underwriter approves alone */
  seniorAbove: Money;
  /** what a senior underwriter can approve alone */
  seniorLimit: Money;
  /** largest offer; above this a deal is outside policy */
  maxAmount: Money;
};

export type RuleId = "age" | "industry" | "kyc" | "revenue" | "nsf" | "negdays" | "positions" | "debt" | "amount" | "stated" | "senior";
export type RuleOutcome = "decline" | "review" | "flag";
/** Whether a rule is switched on and what happens when it fails. Its sentence lives in lib/copy/policy. */
export type PolicyRule = { id: RuleId; outcome: RuleOutcome; on: boolean };

export type ScorePart = "cashFlow" | "debt" | "integrity" | "business" | "policyFit";

export type PolicyVersion = {
  version: number;
  /** what changed, as the person who published it wrote it */
  title: string;
  /** a team member's id; null when imported */
  byId: Id | null;
  at: IsoDateTime;
  live: boolean;
};

/** A change proposed and waiting for its second approver. */
export type PolicyDraft = { version: number; title: string; byId: Id; approverId: Id };

/** A new version tried on a share of new deals beside the live one. */
export type PolicyLiveTest = {
  name: string;
  day: number;
  days: number;
  /** share of new deals on the test, 0–1 */
  testShare: number;
  approvalRate: { current: number; test: number };
  earlyLate: { current: number; test: number };
  dealsInTest: number;
};

export type Policy = {
  version: number;
  limits: PolicyLimits;
  /** the values inside the rule sentences */
  minBusinessMonths: number;
  minMonthlyRevenue: Money;
  maxNsfsPerMonth: number;
  negativeDaysFlag: number;
  maxPositions: number;
  /** all debt payments as a share of revenue, 0–1 (0.65). Read by the Offer tab and Pricing. */
  maxDebtShare: number;
  /** most offered, as a multiple of monthly true revenue */
  maxRevenueMultiple: number;
  /** stated revenue above this multiple of verified is flagged */
  statedRevenueFlag: number;
  restrictedIndustries: string[];
  /** industries the fit check knows are fine; anything on neither list needs a look */
  approvedIndustries: string[];
  /** months of bank statements every deal needs */
  requiredStatementMonths: number;
  /** the most of the money still to collect allowed in one industry, and in one business, 0–1 */
  concentration: { industryMax: number; merchantMax: number };
  rules: PolicyRule[];
  scoreWeights: { part: ScorePart; points: number }[];
  /** scores under declineBelow suggest a decline; approvalFrom and up is the approval line */
  scoreBands: { declineBelow: number; approvalFrom: number };
  exceptions: { reason: string; byId: Id }[];
  /** share of approvals that were exceptions this month, and the level to watch */
  exceptionRate: number;
  exceptionWatch: number;
  draft: PolicyDraft | null;
  liveTest: PolicyLiveTest | null;
  versions: PolicyVersion[];
};

/** A score band's prices, one factor per term in Pricing.terms. */
export type ScoreBandPrice = { minScore: number; maxScore: number | null; factors: number[] };

export type DisclosureStatus = "active" | "update" | "register";
export type StateDisclosure = {
  states: string;
  template: string;
  /** shown on the disclosure, not needed, or required from a date */
  apr: "shown" | "not-needed" | { from: IsoDateTime };
  counselReviewAt: IsoDateTime;
  status: DisclosureStatus;
};

export type Pricing = {
  /** months, in the grid's column order */
  terms: number[];
  grid: ScoreBandPrice[];
  /** taken off the factor when a merchant renews. Read by Renewals and Renewal rules. */
  loyaltyDiscount: number;
  secondPositionAdd: number;
  weeklyAdd: number;
  originationFee: { min: number; max: number };
  /** most of each day's sales taken, 0–1 */
  maxDailyHold: number;
  firstPaymentBusinessDays: number;
  collectBy: ("ach" | "split")[];
  /** broker commission caps, in points. Read by Renewals and Renewal rules. */
  brokerPoints: { newDeal: number; renewal: number };
  /** paying everything within `days` charges the smaller of this factor and the offer's. Read by the Offer tab. */
  earlyPayoff: { days: number; factor: number }[];
  industryAdjustments: { industry: string; delta: number }[];
  /** most offered as a multiple of monthly true revenue, by score band */
  sizing: { minScore: number; maxScore: number | null; multiple: number }[];
  guardrails: { brokerUpsellPoints: number; minMarginPercent: number };
  disclosures: StateDisclosure[];
  forgiveUnearnedFees: boolean;
  showBrokerPay: boolean;
};
