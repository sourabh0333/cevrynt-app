/**
 * Sample data for the Offer & disclosures tab, copied from
 * design/prototypes/Deal-Offer.dc.html (look: design/Deal-Offer.html).
 * The numbers themselves come from lib/offer-math.ts.
 */
import type { CollectFrom, Frequency, OfferInput } from "@/lib/offer-math";

export const builder = {
  title: "Offer builder",
  subtitle: "Change any number. Everything else updates, and your policy limits are checked live.",
  reset: "Reset to recommended",
  amount: { label: "Amount", min: 30000, max: 48000, step: 1000, floor: "Floor $30K", recommended: "Recommended $40K", ceiling: "Ceiling $48K" },
  factor: { label: "Factor rate", options: [1.28, 1.32, 1.36, 1.4] },
  term: { label: "Term", group: "Term in months", options: [4, 5, 6, 7, 8] },
  freq: {
    label: "Payments",
    group: "Payment frequency",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
    ] as { value: Frequency; label: string }[],
  },
  fee: {
    label: "Origination fee",
    options: [
      { value: 0, label: "None" },
      { value: 0.02, label: "2%" },
      { value: 0.03, label: "3%" },
    ],
  },
  method: {
    label: "Collect from",
    group: "Collect payments from",
    options: [
      { value: "ach", label: "Bank account" },
      { value: "split", label: "Card sales" },
    ] as { value: CollectFrom; label: string }[],
  },
  payoff: { label: "Pay off Kingsway", note: "~$9,400 from this advance" },
  rules: {
    debtShare: { label: (share: string) => `Debt share ${share}`, note: "Limit 65% of revenue" },
    ceiling: { label: "Amount within ceiling", note: "Up to $48K for this deal" },
    factor: { label: "Factor in range", note: "1.28 – 1.40 for score 80+" },
    approval: { ok: "Your approval limit", warn: "Needs senior sign-off", note: "You can approve up to $45K" },
  },
};

export const merchantPays = {
  title: "The merchant pays",
  verdict: { ok: "Within policy", over: "Over limit" },
  per: { daily: "a business day", weekly: "a week" },
  count: { daily: (n: number) => `${n} business-day payments`, weekly: (n: number) => `${n} weekly payments` },
  total: "total",
  collect: { ach: "Taken from Chase ••7712 by ACH", split: (share: string) => `Taken from card sales: about ${share} of each day` },
  share: { label: "All debt payments vs revenue", zero: "0%", max: "Policy max 65%" },
  tiles: { net: "Cash to merchant", apr: "Estimated APR", commission: "Broker commission", margin: "Your margin" },
  renew: (month: number) => `Renewal possible once half is repaid, around month ${month}.`,
  cta: "Use this offer",
};

export type Preset = {
  name: string;
  tag: string;
  why: string;
  offer: Partial<OfferInput>;
};

export const presets = {
  title: "Three ways to offer it",
  subtitle: "Pick one to load it into the builder",
  tiles: { amount: "Amount", daily: "Daily", share: "Of revenue" },
  items: [
    { name: "Recommended", tag: "Best balance", why: "Second position next to Kingsway, well inside your limits.", offer: { amount: 40000, factor: 1.32, term: 6, freq: "daily", payoff: false } },
    { name: "Lower payment", tag: "Easier on cash flow", why: "Same amount over 8 months. Smaller daily payment, slightly more total cost.", offer: { amount: 40000, factor: 1.36, term: 8, freq: "daily", payoff: false } },
    { name: "Pay off Kingsway", tag: "You go first", why: "Clears the existing advance, leaving you in first position.", offer: { amount: 40000, factor: 1.32, term: 6, freq: "daily", payoff: true } },
  ] as Preset[],
};
