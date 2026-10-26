import "server-only";
import type { Broker, BrokerBook, IsoDateTime, Money, Policy, Pricing } from "@/lib/data/types";
import { isFraudFlag } from "@/lib/copy/stacking";
import { daysBetween } from "@/lib/format";
import { getBrokerBook, listBrokers } from "../brokers";
import { listPipeline } from "../funding";
import { getPolicy, getPricing } from "../settings";
import { alertRows } from "./stacking";

/** A broker with the fraud flags Stacking Watch raised on their deals in the last 90 days. */
export type BrokerRow = Broker & { flags: { merchant: string; status: "open" | "reviewed" }[] };

export type BrokersData = {
  now: IsoDateTime;
  brokers: BrokerRow[];
  book: BrokerBook;
  /** deals funded today, by the broker who sent them, for commission owed */
  fundedToday: { brokerId: string; amount: Money; renewal: boolean }[];
  pricing: Pick<Pricing, "brokerPoints">;
  /** what "What we fund this week" quotes */
  policy: Pick<Policy, "limits" | "minMonthlyRevenue" | "minBusinessMonths" | "maxPositions" | "restrictedIndustries">;
};

/** Flags count back this far. */
const FLAG_DAYS = 90;

/** A broker named either way deals and advances name them. */
const sentBy = (b: Broker, name: string | null) => name === b.name || name === b.shortName;

/** Each broker's fraud flags in the last 90 days, by short name (as tasks name them). */
export async function brokerFlagCounts(): Promise<Record<string, number>> {
  const [brokers, { now, rows }] = await Promise.all([listBrokers(), alertRows()]);
  const flags = rows.filter((a) => isFraudFlag(a) && daysBetween(a.seenAt, now) <= FLAG_DAYS);
  return Object.fromEntries(brokers.map((b) => [b.shortName, flags.filter((a) => sentBy(b, a.broker)).length]));
}

/** Everything Brokers shows, loaded in parallel. */
export async function brokersView(): Promise<BrokersData> {
  const [brokers, book, { now, rows }, pipeline, pricing, policy] = await Promise.all([listBrokers(), getBrokerBook(), alertRows(), listPipeline(), getPricing(), getPolicy()]);
  const flags = rows.filter((a) => isFraudFlag(a) && daysBetween(a.seenAt, now) <= FLAG_DAYS);
  return {
    now,
    brokers: brokers.map((b) => ({ ...b, flags: flags.filter((a) => sentBy(b, a.broker)).map((a) => ({ merchant: a.merchant, status: a.status })) })),
    book,
    fundedToday: pipeline
      .filter((o) => o.stage === "funded" && o.sentAt && daysBetween(o.sentAt, now) === 0)
      .flatMap((o) => {
        const b = brokers.find((x) => sentBy(x, o.broker));
        return b ? [{ brokerId: b.id, amount: o.amount, renewal: !!o.renewal }] : [];
      }),
    pricing: { brokerPoints: pricing.brokerPoints },
    policy: {
      limits: policy.limits,
      minMonthlyRevenue: policy.minMonthlyRevenue,
      minBusinessMonths: policy.minBusinessMonths,
      maxPositions: policy.maxPositions,
      restrictedIndustries: policy.restrictedIndustries,
    },
  };
}
