import "server-only";
import type {
  DealBusiness,
  DealCashFlow,
  DealChecks,
  DealCondition,
  DealConditions,
  DealIntegrity,
  DealPositions,
  DealSummary,
  Id,
  IsoDateTime,
  Money,
  Policy,
  YearMonth,
} from "@/lib/data/types";
import { dealFiguresFrom, offerPolicyFrom, type DealFigures, type OfferInput, type OfferPolicy } from "@/lib/offer-math";
import { getNow } from "../clock";
import { getDeal, getDealBusiness, getDealCashFlow, getDealConditions, getDealIntegrity, getDealPositions, getDealSummary } from "../deals";
import { getPolicy, getPricing, getWorkspace } from "../settings";
import { getCurrentUser, listTeam } from "../team";

/**
 * Everything the Summary, Cash flow and Positions tabs show for one deal,
 * loaded in parallel: the three tab records, the policy lines they quote,
 * and the deal's figures and recommended offer for the shared offer math.
 */
export type DealTabsData = {
  id: Id;
  now: IsoDateTime;
  /** where each stored check stands (the deal's own record) */
  checks: DealChecks;
  /** the deal's conditions, which the conditions check is worked out from */
  conditions: DealCondition[];
  summary: DealSummary;
  cashFlow: DealCashFlow;
  positions: DealPositions;
  policy: Pick<Policy, "maxDebtShare" | "limits" | "scoreWeights" | "scoreBands">;
  /** the deal's figures for computeOffer: revenue, existing payments, card sales, commission */
  figures: DealFigures;
  /** the policy's debt limit and approval line, with the deal's range */
  offerPolicy: OfferPolicy;
  /** the recommended offer, as the offer math takes it */
  recommended: OfferInput;
};

/** The three tabs' data for one deal; null when there is no such deal (the layout shows "There's no deal …"). */
export async function dealTabsView(id: Id): Promise<DealTabsData | null> {
  const [deal, summary, cashFlow, positions, conditions, policy, pricing, now] = await Promise.all([
    getDeal(id),
    getDealSummary(id),
    getDealCashFlow(id),
    getDealPositions(id),
    getDealConditions(id),
    getPolicy(),
    getPricing(),
    getNow(),
  ]);
  if (!deal || !summary || !cashFlow || !positions) return null;
  const r = summary.recommendation;
  return {
    id: deal.id,
    now,
    checks: deal.checks,
    conditions: conditions?.items ?? [],
    summary,
    cashFlow,
    positions,
    policy: { maxDebtShare: policy.maxDebtShare, limits: policy.limits, scoreWeights: policy.scoreWeights, scoreBands: policy.scoreBands },
    figures: dealFiguresFrom(cashFlow, positions, pricing.brokerPoints.newDeal),
    offerPolicy: offerPolicyFrom(policy),
    recommended: { amount: r.amount, factor: r.factor, term: r.termMonths, freq: "daily", fee: 0, method: "ach", payoff: false },
  };
}

/* ---------- Integrity ---------- */

export type IntegrityTabData = {
  id: Id;
  integrity: DealIntegrity;
  /** the statements' account, for the evidence page header */
  bank: DealCashFlow["bank"];
  /** pages per statement month, for "p. 3 of 7" */
  pages: Record<YearMonth, number>;
  linesRead: number;
  /** the related-business transfer the "Jump before applying" check links to */
  relatedTransfer: Money | null;
  /** the integrity part of the score, out of the policy's weight for it */
  score: { points: number; outOf: number };
  /** the main owner, who is sent the bank link */
  owner: { name: string; possessive: string } | null;
  /** the signed-in underwriter, who signs off the review */
  reviewer: string;
};

/** The Integrity tab for one deal; null when there is no such deal. */
export async function integrityTabView(id: Id): Promise<IntegrityTabData | null> {
  const [deal, integrity, cashFlow, summary, business, policy, me] = await Promise.all([
    getDeal(id),
    getDealIntegrity(id),
    getDealCashFlow(id),
    getDealSummary(id),
    getDealBusiness(id),
    getPolicy(),
    getCurrentUser(),
  ]);
  if (!deal || !integrity || !cashFlow || !summary) return null;
  const owner = business?.owners[0];
  return {
    id: deal.id,
    integrity,
    bank: cashFlow.bank,
    pages: Object.fromEntries(cashFlow.months.map((m) => [m.month, m.pages])),
    linesRead: cashFlow.linesRead,
    relatedTransfer: cashFlow.setAside.find((s) => s.kind === "related")?.amount ?? null,
    score: {
      points: summary.score.parts.find((p) => p.part === "integrity")?.points ?? 0,
      outOf: policy.scoreWeights.find((w) => w.part === "integrity")?.points ?? 0,
    },
    owner: owner ? { name: owner.name, possessive: owner.possessive } : null,
    reviewer: me?.name ?? "",
  };
}

/* ---------- Business & owners ---------- */

export type BusinessTabData = {
  id: Id;
  now: IsoDateTime;
  business: DealBusiness;
  /** the industry isn't on the policy's restricted list */
  industryAllowed: boolean;
};

/** The Business & owners tab for one deal; null when there is no such deal. */
export async function businessTabView(id: Id): Promise<BusinessTabData | null> {
  const [deal, business, policy, now] = await Promise.all([getDeal(id), getDealBusiness(id), getPolicy(), getNow()]);
  if (!deal || !business) return null;
  const restricted = policy.restrictedIndustries.map((i) => i.toLowerCase());
  return { id: deal.id, now, business, industryAllowed: !restricted.includes(business.industry.label.toLowerCase()) };
}

/* ---------- Conditions & stips ---------- */

export type ConditionsTabData = {
  id: Id;
  now: IsoDateTime;
  conditions: DealConditions;
  /** the merchant and the broker's company, for the request message */
  merchantName: string;
  brokerName: string | null;
  /** the amount the conditions are set for (the recommended offer) */
  amount: Money;
  /** the business address the landlord letter is about */
  street: string;
  /** the signed-in underwriter: on "us" cards and signing the message */
  me: { name: string; initials: string };
  /** the senior underwriter who approves waived items */
  senior: string;
  /** the funder, signing the merchant's message */
  funder: string;
};

/** The Conditions & stips tab for one deal; null when there is no such deal. */
export async function conditionsTabView(id: Id): Promise<ConditionsTabData | null> {
  const [deal, conditions, summary, business, me, team, workspace, now] = await Promise.all([
    getDeal(id),
    getDealConditions(id),
    getDealSummary(id),
    getDealBusiness(id),
    getCurrentUser(),
    listTeam(),
    getWorkspace(),
    getNow(),
  ]);
  if (!deal || !conditions || !summary) return null;
  return {
    id: deal.id,
    now,
    conditions,
    merchantName: deal.merchantName,
    brokerName: deal.brokerName,
    amount: summary.recommendation.amount,
    street: business?.address.street ?? "",
    me: { name: me?.name ?? "", initials: me?.initials ?? "" },
    senior: team.find((m) => m.role === "senior")?.name ?? "",
    funder: workspace.name,
  };
}
