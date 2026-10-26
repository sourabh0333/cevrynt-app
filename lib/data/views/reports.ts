import "server-only";
import type { FundingSummary, IsoDateTime, Policy, ReportsBook, ReportSnapshot, RenewalSummary, TeamMember } from "@/lib/data/types";
import { costPerDeal, dealsUsed } from "@/lib/copy/plan";
import { getFundedBook } from "../advances";
import { getNow } from "../clock";
import { getFundingSummary } from "../funding";
import { getIntakeSummary } from "../intake";
import { getRenewalSummary } from "../renewals";
import { getReportsBook, listReportSnapshots } from "../reports";
import { getPlan, getPolicy, getPricing } from "../settings";
import { listTeam } from "../team";

export type ReportsData = {
  now: IsoDateTime;
  snapshots: ReportSnapshot[];
  /** money funded each month, from Offers & funding */
  funding: Pick<FundingSummary, "fundedByMonth">;
  /** renewals funded each month, from Renewals */
  renewalsByMonth: RenewalSummary["fundedByMonth"];
  /** the funded book's loss rate */
  lossRate: number;
  book: ReportsBook;
  /** the rule values the declines quote, and the draft the debt rule would try */
  policy: Pick<Policy, "minMonthlyRevenue" | "maxPositions" | "minBusinessMonths" | "maxDebtShare" | "latePaymentTarget"> & { draftDebtShare: number | null };
  /** Pricing's broker points on a new deal: the commission out of every $1 */
  brokerPoints: number;
  /** what a deal costs this month, as Plan & usage works it out */
  costPerDeal: string;
  team: TeamMember[];
};

/** Everything Reports shows, read from the records the other pages use. */
export async function reportsView(): Promise<ReportsData> {
  const [snapshots, funding, renewals, fundedBook, book, policy, pricing, plan, intake, team, now] = await Promise.all([
    listReportSnapshots(),
    getFundingSummary(),
    getRenewalSummary(),
    getFundedBook(),
    getReportsBook(),
    getPolicy(),
    getPricing(),
    getPlan(),
    getIntakeSummary(),
    listTeam(),
    getNow(),
  ]);
  return {
    now,
    snapshots,
    funding: { fundedByMonth: funding.fundedByMonth },
    renewalsByMonth: renewals.fundedByMonth,
    lossRate: fundedBook.returns.lossRate,
    book,
    policy: {
      minMonthlyRevenue: policy.minMonthlyRevenue,
      maxPositions: policy.maxPositions,
      minBusinessMonths: policy.minBusinessMonths,
      maxDebtShare: policy.maxDebtShare,
      latePaymentTarget: policy.latePaymentTarget,
      draftDebtShare: policy.draft?.change.maxDebtShare ?? null,
    },
    brokerPoints: pricing.brokerPoints.newDeal,
    costPerDeal: costPerDeal(plan, dealsUsed(intake.month)),
    team,
  };
}
