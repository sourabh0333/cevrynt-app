/**
 * Sample data for Settings → Plan & usage, copied from
 * design/prototypes/Settings-Plan.dc.html (look: design/Settings-Plan.html).
 * COST_PER_DEAL is the one place the "$5.20 a deal" lives; Reports reads it
 * too. Channel counts come from Intake channels and seats from Team & roles,
 * so the pages agree. Real API calls replace this later.
 */
import { teamInvites, teamMembers } from "@/lib/data/sample/team";
import { channelPerformance } from "@/lib/sample-data/intake-channels";

/** What one deal costs on the current plan, in dollars. Shown here and in Reports. */
export const COST_PER_DEAL = 5.2;
export const costPerDeal = `$${COST_PER_DEAL.toFixed(2)}`;

export const currentPlan = {
  name: "Growth",
  monthly: 1490,
  includedDeals: 400,
  seats: 10,
  renews: "Nov 1",
  extraDeal: 4.5,
};

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export const planHeader = {
  chip: `${currentPlan.name} plan`,
  price: `${usd(currentPlan.monthly)} a month`,
  text: `Renews ${currentPlan.renews} · ${currentPlan.includedDeals} deals and ${currentPlan.seats} seats included · works out to about ${costPerDeal} a deal`,
  compare: "Compare plans",
  talk: "Talk to us",
};

/** Live channels only (Intake channels); email, forms and CRM are coming soon. */
export const usageByChannel = channelPerformance.rows.map((r) => ({ channel: r.channel, deals: r.deals }));
export const dealsUsed = usageByChannel.reduce((s, r) => s + r.deals, 0);

export const usage = {
  title: "This month so far",
  subtitle: "October 1 to 13",
  warn: "Warn me at 80%",
  deals: { label: "Deals analyzed", used: dealsUsed, of: currentPlan.includedDeals, hint: "On pace for about 380 by Oct 31" },
  pages: { label: "Pages you didn't pay for", chip: "Free", value: "1,840", unit: " pages", text: "Blank pages, cover sheets and duplicates we skipped", hint: "You pay per deal, never per page" },
  seats: { label: "Team seats", used: teamMembers.length, of: currentPlan.seats, hint: `${teamInvites.length} invite pending` },
  link: { label: "Merchant Link sessions", value: 118, unit: " this month", chip: "∞", bar: 30, hint: "Unlimited on your plan" },
  perDay: {
    label: "Deals analyzed per working day",
    avg: "11 avg",
    hint: "Today 15, the busiest day yet",
    aria: "Deals analyzed per working day this month, between 3 and 15 a day",
    /** deals per working day, oldest first; the last bar is today */
    days: [8, 11, 9, 12, 14, 6, 3, 10, 13, 12, 11, 15],
  },
};

export const included = {
  title: "One deal, everything in",
  text: "A deal counts once, however often it's updated. No per-page or per-check fees.",
  chip: `${costPerDeal} a deal on ${currentPlan.name}`,
  items: [
    { title: "Every page", hint: "of every statement" },
    { title: "Fraud checks", hint: "edited or fake files" },
    { title: "Public records", hint: "registry, courts, sanctions" },
    { title: "Stacking Watch", hint: "until paid off" },
    { title: "Memo and disclosures", hint: "ready to send" },
  ],
};

export const overage = {
  title: `If you go over ${currentPlan.includedDeals}`,
  text: "You set the limit. No surprise bills.",
  price: `$${currentPlan.extraDeal.toFixed(2)}`,
  priceNote: "each extra deal",
  capLabel: "Monthly spend limit",
  cap: { min: 0, max: 1000, step: 100, start: 500 },
  used: (n: number, left: number) => ({ used: `${n} used`, left: ` · ${left} left` }),
  extra: (cap: number) => (cap ? `then up to ${Math.floor(cap / currentPlan.extraDeal)} extra` : "no extra deals"),
  capText: (cap: number) => (cap ? `$${cap}` : "No extra deals"),
  note: (cap: number) =>
    cap ? `Up to ${Math.floor(cap / currentPlan.extraDeal)} extra deals, then new deals wait until next month` : `New deals wait once you reach ${currentPlan.includedDeals}`,
};

export const channelCard = {
  title: `Where the ${dealsUsed} came from`,
  text: "Deals analyzed this month, by channel",
  note: "Email, forms and CRM channels are coming soon.",
};

export type PlanTier = { name: string; monthly: number; deals: string; current?: boolean; action?: string; primary?: boolean; features: boolean[] };

export const plans = {
  title: "Plans",
  text: "Switch any time. Changes apply from your next bill.",
  period: [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly · save 15%" },
  ],
  yearlyDiscount: 0.15,
  perMonth: " / month",
  current: "Current",
  yourPlan: "Your plan",
  features: ["Deal workspace and memos", "Stacking Watch", "Policy simulator", "API and webhooks", "Live policy tests"],
  tiers: [
    { name: "Starter", monthly: 590, deals: "150 deals · 3 seats", action: "Switch", features: [true, true, false, false, false] },
    { name: currentPlan.name, monthly: currentPlan.monthly, deals: `${currentPlan.includedDeals} deals · ${currentPlan.seats} seats`, current: true, features: [true, true, true, true, false] },
    { name: "Scale", monthly: 3200, deals: "1,200 deals · 25 seats", action: "Upgrade", primary: true, features: [true, true, true, true, true] },
  ] as PlanTier[],
};

export const invoices = {
  title: "Invoices",
  all: "All invoices",
  rows: [
    { month: "October 2026", amount: usd(currentPlan.monthly), status: "Paid" },
    { month: "September 2026", amount: usd(currentPlan.monthly), status: "Paid" },
    { month: "August 2026", amount: usd(currentPlan.monthly), status: "Paid" },
  ],
  pdf: "PDF",
};

export const payment = {
  title: "Payment",
  card: "•••• 4242",
  cardNote: "Business card · expires 08/28",
  billingEmail: "Invoices go to billing@ridgelinecap.com",
  update: "Update payment",
};
