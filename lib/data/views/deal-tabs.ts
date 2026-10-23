import "server-only";
import type { DealCashFlow, DealChecks, DealPositions, DealSummary, Id, IsoDateTime, Policy } from "@/lib/data/types";
import { dealFiguresFrom, offerPolicyFrom, type DealFigures, type OfferInput, type OfferPolicy } from "@/lib/offer-math";
import { getNow } from "../clock";
import { getDeal, getDealCashFlow, getDealPositions, getDealSummary } from "../deals";
import { getPolicy, getPricing } from "../settings";

/**
 * Everything the Summary, Cash flow and Positions tabs show for one deal,
 * loaded in parallel: the three tab records, the policy lines they quote,
 * and the deal's figures and recommended offer for the shared offer math.
 */
export type DealTabsData = {
  id: Id;
  now: IsoDateTime;
  /** where each check stands (the deal's own record) */
  checks: DealChecks;
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
  const [deal, summary, cashFlow, positions, policy, pricing, now] = await Promise.all([
    getDeal(id),
    getDealSummary(id),
    getDealCashFlow(id),
    getDealPositions(id),
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
    summary,
    cashFlow,
    positions,
    policy: { maxDebtShare: policy.maxDebtShare, limits: policy.limits, scoreWeights: policy.scoreWeights, scoreBands: policy.scoreBands },
    figures: dealFiguresFrom(cashFlow, positions, pricing.brokerPoints.newDeal),
    offerPolicy: offerPolicyFrom(policy),
    recommended: { amount: r.amount, factor: r.factor, term: r.termMonths, freq: "daily", fee: 0, method: "ach", payoff: false },
  };
}
