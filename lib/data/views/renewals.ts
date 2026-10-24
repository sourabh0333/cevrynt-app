import "server-only";
import type { IsoDateTime, Money, Pricing, RenewalCandidate, RenewalSettings, RenewalSummary, RiskSignal } from "@/lib/data/types";
import type { ReadinessMerchant } from "@/lib/renewal-rules";
import { getFundedBook } from "../advances";
import { getRenewalSummary, listRenewalCandidates } from "../renewals";
import { getPricing } from "../settings";
import { portfolio, type LiveAdvance } from "./portfolio";

/** A merchant on the radar: the renewal, the advance it renews and whether the saved rules call it ready. */
export type CandidateRow = { candidate: RenewalCandidate; advance: LiveAdvance; ready: boolean };

export type RenewalsData = {
  now: IsoDateTime;
  candidates: CandidateRow[];
  /** merchants ready under the saved rules */
  readyCount: number;
  summary: RenewalSummary;
  /** the first few reaching the paid line, with their advance's repaid share */
  comingUp: { name: string; paid: number; reachesLineAt: IsoDateTime | null }[];
  /** merchants who might go elsewhere, with the renewal at stake */
  atRisk: { name: string; shortName: string; amount: Money; signal: RiskSignal; likelihood: number; actBy: "today" | "week" }[];
  settings: Pick<RenewalSettings, "rules" | "outreach">;
  /** renewed with you this month, as Funded deals counts it */
  renewedThisMonth: number;
  pricing: Pick<Pricing, "loyaltyDiscount" | "brokerPoints">;
};

/** Everything Renewals shows, loaded in parallel. */
export async function renewalsView(): Promise<RenewalsData> {
  const [p, candidates, summary, book, pricing] = await Promise.all([portfolio(), listRenewalCandidates(), getRenewalSummary(), getFundedBook(), getPricing()]);
  const advance = (id: string) => p.advances.find((a) => a.id === id)!;
  const paidOf = (a: LiveAdvance) => p.inputs.find((m) => m.id === a.id)!.paid;
  return {
    now: p.now,
    candidates: candidates.map((c) => ({ candidate: c, advance: advance(c.advanceId), ready: p.readyIds.includes(c.advanceId) })),
    readyCount: p.readyIds.length,
    summary,
    comingUp: summary.comingUp.first.map((c) => {
      const a = advance(c.advanceId);
      return { name: a.merchant.name, paid: paidOf(a), reachesLineAt: c.reachesLineAt };
    }),
    atRisk: summary.atRisk.map((r) => {
      const a = advance(r.advanceId);
      const amount = candidates.find((c) => c.advanceId === r.advanceId)?.suggested ?? 0;
      return { name: a.merchant.name, shortName: a.merchant.shortName ?? a.merchant.name, amount, signal: r.signal, likelihood: r.likelihood, actBy: r.actBy };
    }),
    settings: { rules: p.settings.rules, outreach: p.settings.outreach },
    renewedThisMonth: book.renewedWithYou,
    pricing: { loyaltyDiscount: pricing.loyaltyDiscount, brokerPoints: pricing.brokerPoints },
  };
}

export type RenewalRulesData = {
  /** every live advance as the rules see it, in list order */
  merchants: ReadinessMerchant[];
  settings: RenewalSettings;
  /** the renewal price terms "What they're offered" quotes from Pricing */
  terms: Pick<Pricing, "loyaltyDiscount" | "brokerPoints" | "forgiveUnearnedFees">;
};

/** Everything Settings › Renewal rules shows, loaded in parallel. */
export async function renewalRulesView(): Promise<RenewalRulesData> {
  const [p, pricing] = await Promise.all([portfolio(), getPricing()]);
  const { loyaltyDiscount, brokerPoints, forgiveUnearnedFees } = pricing;
  return { merchants: p.inputs, settings: p.settings, terms: { loyaltyDiscount, brokerPoints, forgiveUnearnedFees } };
}
