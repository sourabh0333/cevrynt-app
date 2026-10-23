/**
 * Sample data for the Offer & disclosures tab, copied from
 * design/prototypes/Deal-Offer.dc.html (look: design/Deal-Offer.html).
 * The numbers themselves come from lib/offer-math.ts; the limits quoted in
 * the notes (debt limit, approval line, the deal's range) come from the
 * offer policy the page loads, so they're functions here.
 */
import { moneyShort, percent } from "@/lib/format";
import type { CollectFrom, Frequency, OfferInput } from "@/lib/offer-math";

export const builder = {
  title: "Offer builder",
  subtitle: "Change any number. Everything else updates, and your policy limits are checked live.",
  reset: "Reset to recommended",
  amount: {
    label: "Amount",
    step: 1000,
    floor: (n: number) => `Floor ${moneyShort(n)}`,
    recommended: "Recommended $40K",
    ceiling: (n: number) => `Ceiling ${moneyShort(n)}`,
  },
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
    debtShare: { label: (share: string) => `Debt share ${share}`, note: (maxShare: number) => `Limit ${percent(maxShare)} of revenue` },
    ceiling: { label: "Amount within ceiling", note: (ceiling: number) => `Up to ${moneyShort(ceiling)} for this deal` },
    factor: { label: "Factor in range", note: (min: number, max: number) => `${min.toFixed(2)} – ${max.toFixed(2)} for score 80+` },
    approval: { ok: "Your approval limit", warn: "Needs senior sign-off", note: (limit: number) => `You can approve up to ${moneyShort(limit)}` },
  },
};

export const merchantPays = {
  title: "The merchant pays",
  verdict: { ok: "Within policy", over: "Over limit" },
  per: { daily: "a business day", weekly: "a week" },
  count: { daily: (n: number) => `${n} business-day payments`, weekly: (n: number) => `${n} weekly payments` },
  total: "total",
  collect: { ach: "Taken from Chase ••7712 by ACH", split: (share: string) => `Taken from card sales: about ${share} of each day` },
  share: { label: "All debt payments vs revenue", zero: "0%", max: (maxShare: number) => `Policy max ${percent(maxShare)}` },
  tiles: { net: "Cash to merchant", apr: "Estimated APR", commission: "Broker commission", margin: "Your margin" },
  renew: (month: number) => `Renewal possible once half is repaid, around month ${month}.`,
  cta: "Use this offer",
};

export const earlyPayoffCard = {
  title: "Early payoff discount",
  subtitle: "What Elena would owe in total if she pays everything off early",
  link: { label: "Edit discount table", href: "/settings/pricing" },
  within: (days: number) => `Within ${days} days`,
  fullTerm: "Full term",
  saves: (amount: string) => `Saves ${amount}`,
  noDiscount: "No discount",
};

export const offerHistory = {
  title: "Offer history",
  events: [
    { title: "Broker asked for $45,000", note: "Apex Funding · on the application, 09:40", tone: "grey" },
    { title: "Cevrynt recommended $40,000", note: "1.32 factor, 6 months · 09:41", tone: "teal" },
  ] as { title: string; note: string; tone: "grey" | "teal" }[],
  empty: "No offer sent yet. Counter-offers from the broker will appear here.",
};

export const disclosure = {
  title: "Cost disclosure",
  subtitle: "Filled in from this offer, using the disclosure template set for Maine",
  link: { label: "Disclosure templates", href: "/settings/pricing" },
  doc: {
    title: "Your financing offer",
    ref: "Ridgeline Capital · APP-7H2K4Q",
    labels: {
      amount: "Amount of financing",
      receive: (net: string) => `You receive ${net}`,
      charge: "Finance charge",
      total: (payback: string) => `Total to repay ${payback}`,
      apr: "Estimated annual percentage rate",
      aprNote: "Based on your sales history",
      term: "Estimated term",
      payment: "Payment",
      paymentNote: (hold: string) => `About ${hold} of sales`,
      early: "Paying early",
      earlyValue: "Discount available",
      earlyNote: "See section 4 of the agreement",
    },
    brokerLine: (commission: string) => `Broker compensation of ${commission} is paid by Ridgeline Capital, not by you.`,
    reconcileLine: "If your sales drop, you can ask us to reconcile your payments to what you actually earn.",
  },
  notice: "State rules differ and change often. Templates and the APR method are set by your compliance team in Settings and should be reviewed by counsel.",
};

export const sendOffer = {
  title: "Send the offer",
  intro: "What goes out when you press send.",
  items: [
    { kind: "PDF", label: "Offer summary" },
    { kind: "PDF", label: "Cost disclosure" },
    { kind: "SIGN", label: "Agreement, guarantee, payment authorization" },
  ],
  to: { label: "To", value: "Broker and merchant" },
  expires: { label: "Offer expires", value: "In 72 hours" },
  approval: {
    ok: "Within your approval limit. Sends straight away.",
    senior: (limit: number) => `Above ${moneyShort(limit)}, so Priya Shah (senior) approves before it is sent.`,
  },
  button: { ok: "Send offer", senior: "Send for senior approval" },
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
