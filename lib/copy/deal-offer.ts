/**
 * Interface wording for the deal Offer & disclosures tab
 * (design/Deal-Offer.html). The deal's range, presets and offer history
 * come from the data layer (offerTabView); every figure comes from
 * lib/offer-math. This file words them, with the limits quoted from the
 * offer policy the page loads.
 */
import type { DealCashFlow, DealOffer } from "@/lib/data/types";
import type { CollectFrom, Frequency } from "@/lib/offer-math";
import { money, moneyShort, percent, timeOfDay } from "@/lib/format";

const firstWord = (s: string) => s.split(" ")[0];
const firstName = firstWord;

/** "Chase ••7712": the bank's short name and the account's last digits. */
export const accountLabel = (bank: DealCashFlow["bank"]) => `${firstWord(bank.name)} ••${bank.last4}`;

/** The factor choices across the deal's range, 0.04 apart: 1.28, 1.32, 1.36, 1.40. */
export const factorOptions = (min: number, max: number) => {
  const out: number[] = [];
  for (let f = min; f <= max + 1e-9; f += 0.04) out.push(Math.round(f * 100) / 100);
  return out;
};

export const builder = {
  title: "Offer builder",
  subtitle: "Change any number. Everything else updates, and your policy limits are checked live.",
  reset: "Reset to recommended",
  amount: {
    label: "Amount",
    step: 1000,
    floor: (n: number) => `Floor ${moneyShort(n)}`,
    recommended: (n: number) => `Recommended ${moneyShort(n)}`,
    ceiling: (n: number) => `Ceiling ${moneyShort(n)}`,
  },
  factor: { label: "Factor rate" },
  term: { label: "Term", group: "Term in months", options: [4, 5, 6, 7, 8], option: (t: number) => `${t} mo` },
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
  /** "Pay off Kingsway", "~$9,400 from this advance" */
  payoff: {
    label: (funder: string) => `Pay off ${firstWord(funder)}`,
    note: (balance: number) => `~${money(Math.round(balance / 100) * 100)} from this advance`,
  },
  rules: {
    debtShare: { label: (share: string) => `Debt share ${share}`, note: (maxShare: number) => `Limit ${percent(maxShare)} of revenue` },
    ceiling: { label: "Amount within ceiling", note: (ceiling: number) => `Up to ${moneyShort(ceiling)} for this deal` },
    factor: {
      label: "Factor in range",
      note: (min: number, max: number, bandFrom: number | null) => `${min.toFixed(2)} – ${max.toFixed(2)}${bandFrom === null ? "" : ` for score ${bandFrom}+`}`,
    },
    approval: { ok: "Your approval limit", warn: "Needs senior sign-off", note: (limit: number) => `You can approve up to ${moneyShort(limit)}` },
  },
};

export const merchantPays = {
  title: "The merchant pays",
  verdict: { ok: "Within policy", over: "Over limit" },
  total: "total",
  collect: { ach: (account: string) => `Taken from ${account} by ACH`, split: (share: string) => `Taken from card sales: about ${share} of each day` },
  share: { label: "All debt payments vs revenue", zero: "0%", max: (maxShare: number) => `Policy max ${percent(maxShare)}` },
  tiles: { net: "Cash to merchant", apr: "Estimated APR", commission: "Broker commission", margin: "Your margin" },
  renew: (month: number) => `Renewal possible once half is repaid, around month ${month}.`,
  cta: "Use this offer",
};

export const earlyPayoffCard = {
  title: "Early payoff discount",
  subtitle: (owner: { name: string; subject: string }) => `What ${firstName(owner.name)} would owe in total if ${owner.subject} pays everything off early`,
  link: { label: "Edit discount table", href: "/settings/pricing" },
  within: (days: number) => `Within ${days} days`,
  fullTerm: "Full term",
  saves: (amount: string) => `Saves ${amount}`,
  noDiscount: "No discount",
};

type OfferEvent = DealOffer["history"][number];

export const offerHistory = {
  title: "Offer history",
  eventTitle: {
    asked: (e: OfferEvent) => `Broker asked for ${money(e.amount)}`,
    recommended: (e: OfferEvent) => `Cevrynt recommended ${money(e.amount)}`,
    sent: (e: OfferEvent) => `Offer sent for ${money(e.amount)}`,
    countered: (e: OfferEvent) => `Broker countered at ${money(e.amount)}`,
  } as Record<OfferEvent["kind"], (e: OfferEvent) => string>,
  note: (e: OfferEvent) =>
    e.kind === "asked"
      ? `${e.by ?? ""} · on the application, ${timeOfDay(e.at)}`
      : e.factor !== undefined && e.termMonths !== undefined
        ? `${e.factor.toFixed(2)} factor, ${e.termMonths} months · ${timeOfDay(e.at)}`
        : timeOfDay(e.at),
  /** Cevrynt's and our own rounds are teal; the broker's are grey */
  tone: (e: OfferEvent): "grey" | "teal" => (e.kind === "asked" || e.kind === "countered" ? "grey" : "teal"),
  empty: "No offer sent yet. Counter-offers from the broker will appear here.",
};

export const disclosure = {
  title: "Cost disclosure",
  subtitle: (state: string) => `Filled in from this offer, using the disclosure template set for ${state}`,
  link: { label: "Disclosure templates", href: "/settings/pricing" },
  doc: {
    title: "Your financing offer",
    ref: (funder: string, id: string) => `${funder} · ${id}`,
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
    brokerLine: (commission: string, funder: string) => `Broker compensation of ${commission} is paid by ${funder}, not by you.`,
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
  expires: { label: "Offer expires", value: (hours: number) => `In ${hours} hours` },
  approval: {
    ok: "Within your approval limit. Sends straight away.",
    senior: (limit: number, senior: string) => `Above ${moneyShort(limit)}, so ${senior} (senior) approves before it is sent.`,
  },
  button: { ok: "Send offer", senior: "Send for senior approval" },
};

export const presetsCopy = {
  title: "Three ways to offer it",
  subtitle: "Pick one to load it into the builder",
  tiles: { amount: "Amount", daily: "Daily", share: "Of revenue" },
};

export const offerSections = {
  builder: "Offer builder and what the merchant pays",
  early: "Early payoff and offer history",
  disclosure: "Cost disclosure and sending the offer",
};
