/**
 * Interface wording for Offers & funding (design/Offers.html and its
 * prototype). The offers, the funding queue, today's releases and the
 * funding desk come from the data layer (offersView); this file words
 * them: stage chips, net amounts, cut-offs, the release rule and the
 * commissions owed, which use Pricing's broker points.
 */
import type { FundingDesk, FundingSummary, IsoDateTime, LostReason, OfferStage, PipelineOffer, QueuedFunding, Release } from "@/lib/data/types";
import { clock12, clockTime, dateShort, daysBetween, money, moneyCompact, moneyShort, monthName, percent, plural, weekdayShort } from "@/lib/format";
import { hoursAndMinutes } from "./deal";

const firstName = (name: string) => name.split(" ")[0];
/** "5 pm" for a time on the hour, "4:30 pm" otherwise. */
const hourLabel = (at: IsoDateTime) => clock12(at).replace(":00 ", " ");
/** "$1.1M": millions with one decimal, as the capital tile shows them. */
const millions1 = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;
const isToday = (at: IsoDateTime, now: IsoDateTime) => daysBetween(now, at) === 0;

export const offersHeader = {
  title: "Offers & funding",
  line: (inProgress: number, expireToday: number) => `${inProgress} deals between yes and money sent · ${plural(expireToday, "offer")} expire today`,
};

/** Money funded this month and last, from the monthly history. Home and Reports read the same. */
export const monthFunding = (s: Pick<FundingSummary, "fundedByMonth">) => {
  const m = s.fundedByMonth;
  return { thisMonth: m[m.length - 1]?.amount ?? 0, lastMonth: m[m.length - 2]?.amount ?? 0 };
};

/** Change on last month, as "+12% vs September". */
export const monthChange = (s: Pick<FundingSummary, "fundedByMonth">, now: IsoDateTime) => {
  const { thisMonth, lastMonth } = monthFunding(s);
  const growth = thisMonth / lastMonth - 1;
  const [y, m] = [Number(now.slice(0, 4)), Number(now.slice(5, 7))];
  const lastMonthName = monthName(m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`, "long");
  return { sign: growth >= 0 ? "+" : "−", percent: percent(Math.abs(growth)), month: lastMonthName };
};

/** Offers still out that stop being valid today. */
export const expiringToday = (offers: PipelineOffer[], now: IsoDateTime) => offers.filter((o) => o.stage === "sent" && o.expiresAt && isToday(o.expiresAt, now));

export type StatTone = "mint" | "cream" | "grey" | "stone" | "mintLight";
export type StatTile = { label: string; value: string; unit?: string; note: string; tone: StatTone; noteTone?: "good" | "warn"; bar?: number };

/** The six tiles at the top, from the queue, the stage totals and the funding desk. */
export function offerStats(x: { queue: QueuedFunding[]; offers: PipelineOffer[]; summary: FundingSummary; desk: FundingDesk; now: IsoDateTime }): StatTile[] {
  const ready = x.queue.filter((q) => q.finalCheck.ok);
  const left = x.desk.dailyLimit - x.desk.committedToday;
  const change = monthChange(x.summary, x.now);
  return [
    { label: "Ready to fund", value: moneyShort(ready.reduce((n, q) => n + q.amount, 0)), note: `${plural(ready.length, "deal")} · next ACH cut-off ${clock12(x.desk.achCutoff)}`, tone: "mint" },
    { label: "Offers out", value: String(x.summary.stageTotals.sent), note: `${expiringToday(x.offers, x.now).length} expire today`, tone: "cream", noteTone: "warn" },
    { label: "Contracts out", value: String(x.summary.stageTotals.contract), note: "Waiting on signatures", tone: "grey" },
    { label: "Offer to funded", value: x.summary.medianDaysToFund.toFixed(1), unit: " days", note: "Median, last 30 days", tone: "stone" },
    { label: "Capital left today", value: millions1(left), note: `of a ${millions1(x.desk.dailyLimit)} daily limit`, tone: "grey", bar: Math.round((left / x.desk.dailyLimit) * 100) },
    { label: "Funded this month", value: moneyCompact(monthFunding(x.summary).thisMonth), note: `${change.sign}${change.percent} vs ${change.month}`, tone: "mintLight", noteTone: "good" },
  ];
}

export type ChipTone = "red" | "amber" | "blue" | "green" | "grey";

export const stageInfo: Record<OfferStage, { title: string; color: "amber" | "blue" | "purple" | "teal" | "teal-ink"; hint: string; action: string }> = {
  sent: { title: "Offer sent", color: "amber", hint: "Waiting for the merchant to accept", action: "Nudge broker" },
  accepted: { title: "Accepted", color: "blue", hint: "Contract goes out next", action: "Send contract" },
  contract: { title: "Contract out", color: "purple", hint: "Waiting for signatures", action: "Remind to sign" },
  checks: { title: "Signed, final steps", color: "teal", hint: "Last checks, then two-person release", action: "Go to funding" },
  funded: { title: "Funded today", color: "teal-ink", hint: "Money sent today", action: "View receipt" },
};

export const stageOrder: OfferStage[] = ["sent", "accepted", "contract", "checks", "funded"];

/** What an offer's chip says about where it stands: "Expires 5 pm", "1 of 2 signed", "Sent 9:15". */
export function offerChip(o: PipelineOffer, now: IsoDateTime): { text: string; tone: ChipTone } {
  switch (o.stage) {
    case "sent":
      if (o.countered) return { text: "Countered", tone: "amber" };
      if (o.expiresAt) return isToday(o.expiresAt, now) ? { text: `Expires ${hourLabel(o.expiresAt)}`, tone: "red" } : { text: `Expires ${weekdayShort(o.expiresAt)}`, tone: "amber" };
      return { text: "Waiting", tone: "grey" };
    case "accepted":
      if (o.renewal) return { text: "Renewal", tone: "blue" };
      return { text: o.contractDueAt && isToday(o.contractDueAt, now) ? "Contract today" : "Contract next", tone: "grey" };
    case "contract":
      if (o.signatures?.signed) return { text: `${o.signatures.signed} of ${o.signatures.needed} signed`, tone: "amber" };
      return { text: o.viewed ? "Viewed, not signed" : "Not opened yet", tone: "grey" };
    case "checks":
      return { text: "Ready to fund", tone: "green" };
    case "funded":
      return { text: o.sentAt ? `Sent ${clockTime(o.sentAt)}` : "Sent", tone: "green" };
  }
}

export const pipelineCopy = {
  title: "From offer to funded",
  subtitle: "Every approved deal, by where it is now",
  search: { label: "Search offers", placeholder: "Merchant or broker" },
  showLabel: "Show",
  stagesLabel: "Stages",
  views: [
    { key: "all", label: "Everyone" },
    { key: "mine", label: "Mine" },
  ] as { key: "all" | "mine"; label: string }[],
  more: (n: number) => `+ ${n} more · View all`,
  empty: "None of yours in this stage.",
  /** "$95K" on a row, and a stage's value in thousands */
  amount: (n: number) => `$${Math.round(n / 1000)}K`,
};

export const queueCopy = {
  title: "Funding queue",
  subtitle: "Approved, signed and checked. Pick what to send.",
  cutoff: (desk: FundingDesk) => `ACH by ${clock12(desk.achCutoff)} · wire by ${clock12(desk.wireCutoff)}`,
  columns: ["", "Merchant", "Advance → they get", "Pays out to", "Status"],
  select: (name: string) => `Select ${name}`,
  /** what the merchant actually receives */
  net: (q: QueuedFunding) => q.amount * (1 - q.fee) - q.payoff,
  netNote: (q: QueuedFunding) => (q.payoff ? `${money(q.payoff)} wired to the prior funder` : q.fee ? `${percent(q.fee)} fee taken` : "No fee"),
  bank: (q: QueuedFunding) => `${q.bank.name} ••${q.bank.last4}`,
  method: (q: QueuedFunding) => (q.method === "ach" ? "ACH, same day" : q.payoff ? "Wire, plus payoff wire" : "Wire"),
  status: { ready: "All clear · ready", pending: "Awaiting release", sent: "Sent", hold: (finding: string) => `${finding} · on hold` },
  summary: {
    label: "Send summary",
    caption: "Ready to send",
    selected: (n: number) => `${n} deals selected`,
    note: (undoMinutes: number, releaser: string) => ({
      ready: `A second person must release every payment. Undo within ${plural(undoMinutes, "minute")}.`,
      pending: "Waiting for a second person to release the money.",
      sent: `Released by ${releaser}. References appear in Money sent today.`,
    }),
    release: (releaser: string) => `Release as ${firstName(releaser)}`,
    fund: (n: number) => `Fund ${plural(n, "deal")}`,
    cancel: "Cancel",
    done: "Done",
    undo: (clock: string) => `Undo · ${clock}`,
    closed: "Sent. References appear in Money sent today.",
  },
};

export const expiringCopy = {
  title: "Expiring soon",
  detail: (o: PipelineOffer) => `${money(o.amount)} · ${o.broker}`,
  when: (at: IsoDateTime, now: IsoDateTime) => (isToday(at, now) ? `Today ${clock12(at)}` : weekdayShort(at)),
  extend: "Extend",
  nudge: "Nudge brokers",
};

export const commissionsCopy = {
  title: "Broker commissions",
  chip: "Paid on funding",
  note: "Owed on deals funded today",
  /** what each broker is owed on today's funded deals, at Pricing's points, largest first */
  rows: (funded: PipelineOffer[], points: number) => {
    const byBroker = new Map<string, number>();
    for (const o of funded) byBroker.set(o.broker, (byBroker.get(o.broker) ?? 0) + (o.amount * points) / 100);
    return [...byBroker.entries()].map(([broker, amount]) => ({ broker, amount })).sort((a, b) => b.amount - a.amount);
  },
};

const releaseStatus: Record<Release["status"], { text: string; tone: "green" | "blue" | "red" }> = {
  settled: { text: "Settled", tone: "green" },
  confirmed: { text: "Confirmed by bank", tone: "blue" },
  sent: { text: "Sent", tone: "blue" },
  returned: { text: "Returned", tone: "red" },
};

export const moneySentCopy = {
  title: "Money sent today",
  subtitle: "Each transfer with its reference, so the bank can trace it",
  chip: (returned: number) => `${returned} returned`,
  labels: { amount: "Amount", method: "Method", first: "First payment" },
  status: (r: Release) => releaseStatus[r.status],
  method: (r: Release) => `${r.method === "ach" ? "ACH" : "Wire"}, ${clockTime(r.sentAt)}`,
  first: (r: Release) => `${weekdayShort(r.firstPaymentAt)}, ${dateShort(r.firstPaymentAt)}`,
  ref: (r: Release, releaser: string) => `${r.method === "ach" ? "Trace" : "Ref"} ${r.reference} · released by ${releaser}`,
};

const lostLabel: Record<LostReason, { label: string; color: "red" | "amber" | "grey" | "purple" }> = {
  "other-funder": { label: "Took another funder's offer", color: "red" },
  payment: { label: "Payment too high", color: "amber" },
  expired: { label: "Offer expired, no reply", color: "grey" },
  checks: { label: "Failed final checks", color: "purple" },
};

export const lostCopy = {
  title: "Offers that didn't fund",
  subtitle: (lost: number, approved: number) => `Last 30 days · ${lost} of ${approved} approved offers`,
  chip: (lost: number, approved: number) => `${Math.round(((approved - lost) / approved) * 100)}% of offers fund`,
  reason: (r: LostReason) => lostLabel[r],
  percent: (count: number, lost: number) => Math.round((count / lost) * 100),
  note: (medianMinutes: number) =>
    `Most lost deals went to another funder. Faster offers usually win these; your median offer time is ${hoursAndMinutes(medianMinutes)}.`,
};

export const offersSections = { stats: "At a glance", bottom: "Expiring offers and broker commissions" };
