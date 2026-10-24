import "server-only";
import type { IsoDateTime, Money, StackingAlert, StackingSummary } from "@/lib/data/types";
import { getFundingQueue } from "../funding";
import { listDeals } from "../deals";
import { listRenewalCandidates } from "../renewals";
import { getStackingSummary, listStackingAlerts } from "../stacking";
import { portfolio } from "./portfolio";

/** Where the deal an alert is about stands, read from that deal, queued funding or advance. */
export type AlertStage =
  | { key: "review"; asked: Money; dealId: string }
  | { key: "fund"; amount: Money; dealId: string }
  | { key: "funded"; repaid: number }
  | { key: "renew"; amount: Money };

/** An alert with its merchant, stage and the broker who sent the deal joined on. */
export type AlertRow = StackingAlert & { merchant: string; stage: AlertStage; broker: string | null };

/**
 * Every alert joined to the record it is about: the deal in Submissions,
 * the funding in the Offers queue, or the advance in Funded deals (a
 * renewal when Renewals has it ready and not yet offered). Stacking Watch,
 * Brokers and the sidebar badge read alerts through this.
 */
export async function alertRows(): Promise<{ now: IsoDateTime; rows: AlertRow[] }> {
  const [alerts, deals, queue, candidates, p] = await Promise.all([listStackingAlerts(), listDeals(), getFundingQueue(), listRenewalCandidates(), portfolio()]);
  const rows = alerts.map((a): AlertRow => {
    const t = a.target;
    if (t.kind === "deal") {
      const d = deals.find((x) => x.id === t.dealId)!;
      return { ...a, merchant: d.merchantName, stage: { key: "review", asked: d.requested, dealId: d.id }, broker: d.brokerName };
    }
    if (t.kind === "funding") {
      const q = queue.find((x) => x.id === t.fundingId)!;
      const d = deals.find((x) => x.id === q.dealId);
      return { ...a, merchant: q.merchant, stage: { key: "fund", amount: q.amount, dealId: q.dealId }, broker: d?.brokerName ?? null };
    }
    if (t.kind === "advance") {
      const adv = p.advances.find((x) => x.id === t.advanceId)!;
      const c = candidates.find((x) => x.advanceId === adv.id);
      const stage: AlertStage =
        c && !c.offer && p.readyIds.includes(adv.id) ? { key: "renew", amount: c.suggested } : { key: "funded", repaid: adv.paid / adv.payback };
      return { ...a, merchant: adv.merchant.name, stage, broker: adv.broker };
    }
    return { ...a, merchant: t.merchant, stage: { key: "funded", repaid: t.repaid }, broker: null };
  });
  return { now: p.now, rows };
}

export type StackingData = {
  now: IsoDateTime;
  /** the last week's alerts, as the list shows them */
  alerts: AlertRow[];
  /** every alert still open, listed or not */
  openCount: number;
  summary: StackingSummary;
};

/** How far back the alerts list goes. */
const LIST_DAYS = 7;
const daysAgo = (at: IsoDateTime, now: IsoDateTime) => (Date.parse(now) - Date.parse(at)) / 86_400_000;

/** Everything Stacking Watch shows, loaded in parallel. */
export async function stackingView(): Promise<StackingData> {
  const [{ now, rows }, summary] = await Promise.all([alertRows(), getStackingSummary()]);
  return {
    now,
    alerts: rows.filter((a) => a.status === "open" && daysAgo(a.seenAt, now) <= LIST_DAYS),
    openCount: rows.filter((a) => a.status === "open").length,
    summary,
  };
}
