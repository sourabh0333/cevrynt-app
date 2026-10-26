/**
 * Interface wording for Settings › Plan & usage (design/Settings-Plan.html
 * and its prototype). The plan, Intake's monthly channel counts and the
 * team's seats come from the data layer (planView). The cost per deal is
 * worked out here from the plan price and the deals used, and Reports
 * quotes the same function, so both pages always agree.
 */
import type { IntakeSummary, IsoDateTime, Plan, PlanTier } from "@/lib/data/types";
import { dateShort, money, monthName, percent, plural } from "@/lib/format";
import { channelLabel } from "./intake";

/** Deals analyzed this month, all channels together. */
export const dealsUsed = (month: IntakeSummary["month"]) => month.reduce((n, c) => n + c.deals, 0);

/** What a deal works out to this month: the plan price over the deals used, to the nearest 10 cents ("$5.20"). */
export const costPerDeal = (plan: Pick<Plan, "current">, used: number) => `$${(Math.round((plan.current.monthly / used) * 10) / 10).toFixed(2)}`;

export const usageByChannel = (month: IntakeSummary["month"]) => month.map((c) => ({ channel: channelLabel[c.channel], deals: c.deals }));

export const planHeader = (p: Plan, used: number) => ({
  chip: `${p.current.name} plan`,
  price: `${money(p.current.monthly)} a month`,
  text: `Renews ${dateShort(p.renewsAt)} · ${plural(p.current.deals, "deal")} and ${plural(p.current.seats, "seat")} included · works out to about ${costPerDeal(p, used)} a deal`,
  compare: "Compare plans",
  talk: "Talk to us",
});

/** The last day of the month a date falls in, as "Oct 31". */
const monthEnd = (now: IsoDateTime) => {
  const [y, m] = [Number(now.slice(0, 4)), Number(now.slice(5, 7))];
  return `${monthName(now.slice(0, 7))} ${new Date(Date.UTC(y, m, 0)).getUTCDate()}`;
};

export function usage(p: Plan, used: number, seats: { used: number; invites: number }, now: IsoDateTime) {
  const days = p.usage.perDay;
  const today = days[days.length - 1];
  return {
    title: "This month so far",
    subtitle: `${monthName(now.slice(0, 7), "long")} 1 to ${Number(now.slice(8, 10))}`,
    warn: `Warn me at ${percent(p.warn.at)}`,
    deals: { label: "Deals analyzed", used, of: p.current.deals, hint: `On pace for about ${p.usage.pace} by ${monthEnd(now)}` },
    pages: { label: "Pages you didn't pay for", chip: "Free", value: p.usage.pagesSkipped.toLocaleString("en-US"), unit: " pages", text: "Blank pages, cover sheets and duplicates we skipped", hint: "You pay per deal, never per page" },
    seats: { label: "Team seats", used: seats.used, of: p.current.seats, hint: `${seats.invites} invite pending` },
    link: { label: "Merchant Link sessions", value: p.usage.linkSessions, unit: " this month", chip: "∞", bar: 30, hint: "Unlimited on your plan" },
    perDay: {
      label: "Deals analyzed per working day",
      // the average of the bars themselves, rounded to a whole deal
      avg: `${Math.round(days.reduce((n, d) => n + d, 0) / days.length)} avg`,
      hint: today === Math.max(...days) ? `Today ${today}, the busiest day yet` : `Today ${today}`,
      aria: `Deals analyzed per working day this month, between ${Math.min(...days)} and ${Math.max(...days)} a day`,
      days,
    },
  };
}

export const meterChip = (used: number, of: number) => `${Math.round((used / of) * 100)}%`;

export const included = {
  title: "One deal, everything in",
  text: "A deal counts once, however often it's updated. No per-page or per-check fees.",
  chip: (p: Plan, used: number) => `${costPerDeal(p, used)} a deal on ${p.current.name}`,
  items: [
    { title: "Every page", hint: "of every statement" },
    { title: "Fraud checks", hint: "edited or fake files" },
    { title: "Public records", hint: "registry, courts, sanctions" },
    { title: "Stacking Watch", hint: "until paid off" },
    { title: "Memo and disclosures", hint: "ready to send" },
  ],
};

/** The spend limit slider, in dollars. */
export const spendLimitRange = { min: 0, max: 1000, step: 100 };

export const overage = (p: Plan) => ({
  title: `If you go over ${p.current.deals}`,
  text: "You set the limit. No surprise bills.",
  price: `$${p.extraDeal.toFixed(2)}`,
  priceNote: "each extra deal",
  capLabel: "Monthly spend limit",
  used: (n: number, left: number) => ({ used: `${n} used`, left: ` · ${left} left` }),
  extraCount: (cap: number) => Math.floor(cap / p.extraDeal),
  extra: (cap: number) => (cap ? `then up to ${Math.floor(cap / p.extraDeal)} extra` : "no extra deals"),
  capText: (cap: number) => (cap ? `$${cap}` : "No extra deals"),
  note: (cap: number) => (cap ? `Up to ${Math.floor(cap / p.extraDeal)} extra deals, then new deals wait until next month` : `New deals wait once you reach ${p.current.deals}`),
  barLabel: (used: number, left: number, cap: number) => `${plural(used, "deal")} used, ${left} left${cap ? `, then up to ${Math.floor(cap / p.extraDeal)} extra` : ""}`,
});

export const channelCard = {
  title: (used: number) => `Where the ${used} came from`,
  text: "Deals analyzed this month, by channel",
  note: "Email, forms and CRM channels are coming soon.",
};

export type PlanTierView = { name: string; monthly: number; deals: string; current?: boolean; action?: string; primary?: boolean; features: boolean[] };

const tierDeals = (t: PlanTier) => `${t.deals.toLocaleString("en-US")} deals · ${plural(t.seats, "seat")}`;

export const plans = {
  title: "Plans",
  text: "Switch any time. Changes apply from your next bill.",
  periodLabel: "Billing period",
  period: [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly · save 15%" },
  ],
  perMonth: " / month",
  current: "Current",
  yourPlan: "Your plan",
  notIncluded: " (not included)",
  features: ["Deal workspace and memos", "Stacking Watch", "Policy simulator", "API and webhooks", "Live policy tests"],
  /** cheaper plans to switch to, the current one, then bigger ones to upgrade to */
  tiers: (p: Plan): PlanTierView[] => [
    ...p.otherTiers.below.map((t) => ({ name: t.name, monthly: t.monthly, deals: tierDeals(t), action: "Switch", features: t.features })),
    { name: p.current.name, monthly: p.current.monthly, deals: tierDeals(p.current), current: true, features: p.current.features },
    ...p.otherTiers.above.map((t) => ({ name: t.name, monthly: t.monthly, deals: tierDeals(t), action: "Upgrade", primary: true, features: t.features })),
  ],
};

export const invoices = {
  title: "Invoices",
  all: "All invoices",
  rows: (p: Plan) => p.invoices.map((i) => ({ month: `${monthName(i.month, "long")} ${i.month.slice(0, 4)}`, amount: money(i.amount), status: i.paid ? "Paid" : "Due" })),
  pdf: "PDF",
};

export const payment = (p: Plan) => ({
  title: "Payment",
  card: `•••• ${p.payment.last4}`,
  cardNote: `${p.payment.kind} · expires ${p.payment.expires}`,
  billingEmail: `Invoices go to ${p.payment.billingEmail}`,
  update: "Update payment",
});

export const planSections = { overage: "Overage and usage by channel", billing: "Billing" };
