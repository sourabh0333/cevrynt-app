/**
 * Interface wording for the deal Positions & debt tab
 * (design/Deal-Positions.html). The positions, stacking checks and stated
 * vs found rows come from the data layer (dealTabsView); the debt shares
 * and the keep-both vs pay-off figures come from the shared offer math,
 * measured against the policy's debt limit.
 */
import type { DealPosition, DealPositions } from "@/lib/data/types";
import { ordinal, partOfMonth } from "@/lib/deal-figures";
import { money, moneyK, monthName, percent, plural } from "@/lib/format";

/** "Kingsway" from "Kingsway Capital" */
export const shortFunder = (funder: string) => funder.split(" ")[0];
/** "KC" */
export const funderInitials = (funder: string) =>
  funder
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** "mid-November" mid-sentence */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** "Mid-November" */
export const payoffLabel = (iso: string) => `${partOfMonth(iso)}-${monthName(iso.slice(0, 7), "long")}`;

const shareText = (share: number) => `${(share * 100).toFixed(1)}% of revenue`;
const policyMax = (maxShare: number) => `Policy max ${percent(maxShare)}`;

export const glanceCopy = {
  today: {
    title: "Debt payments today",
    chip: (share: number) => (share < 0.2 ? "Light" : share < 0.4 ? "Moderate" : "Heavy"),
    unit: "/mo",
    share: shareText,
    max: policyMax,
  },
  found: {
    title: "Positions found",
    chip: (undisclosed: number) => (undisclosed ? `${undisclosed} not disclosed` : "All disclosed"),
    mca: "Merchant cash advance",
    loans: "Other loans",
    note: (stated: number, found: number) =>
      `The application listed ${plural(stated, "advance")}. ${stated === found ? "The statements agree." : `The statements show ${found}.`}`,
  },
  after: {
    title: "After our offer",
    chip: (position: number) => `${ordinal(position)} position`,
    unit: "/mo",
    share: (share: number) => `${percent(share)} of revenue`,
    max: policyMax,
  },
};

export const positionCopy = {
  kind: { mca: "Merchant cash advance", loan: "Loan" } as Record<DealPosition["kind"], string>,
  knownFunder: "Known funder",
  disclosed: "Disclosed",
  notDisclosed: "Not disclosed",
  shownAs: "Shown on statements as ",
  actions: { payoff: "Request payoff letter", debits: (n: number) => `See all ${n} debits` },
  facts: {
    payment: { label: "Payment", suffix: "daily" },
    perMonth: "Per month",
    started: { label: "Started", ucc: "UCC filed" },
    balance: "Est. balance left",
    payoff: "Est. paid off",
    original: "Est. original advance",
  },
  started: (iso: string) => `${monthName(iso.slice(0, 7))} ${iso.slice(0, 4)}`,
  original: (n: number) => `~${moneyK(n)}`,
  estimateNote: (factor: number, funder: string) =>
    `Balance and payoff are estimates from the payment amount, the UCC date and a typical ${factor.toFixed(2)} factor. A payoff letter from ${shortFunder(funder)} confirms the real figure.`,
  history: {
    title: "Payment history",
    range: (from: string, to: string) => `· every business day, ${monthName(from.slice(0, 7))} – ${monthName(to.slice(0, 7))}`,
    legend: { paid: "Paid", holiday: "Bank holiday", bounced: "Bounced" },
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    aria: (debits: number, payment: number, from: string, to: string, bounced: number) =>
      `${plural(debits, "payment")} of ${money(payment)} from ${monthName(from.slice(0, 7), "long")} to ${monthName(to.slice(0, 7), "long")}, ${bounced ? `${bounced} bounced` : "none bounced"}`,
    tally: (paid: number, bounced: number) => `${paid} paid · ${bounced} bounced`,
  },
};

export const stackingCopy = {
  title: "Stacking check",
  chip: (signs: number) => (signs ? plural(signs, "sign") : "No signs"),
  intro: "Signs that the merchant took other advances recently.",
  waiting: "Waiting",
  clear: "Clear",
  cta: { label: "Keep watching after funding", href: "/stacking" },
};

export const statedVsFoundCopy = {
  title: "What the merchant told you vs what we found",
  subtitle: "From the signed application, checked against the statements and public records",
  chip: (matched: number, total: number) => `${matched} of ${total} match`,
  columns: ["Question", "Application says", "We found", "Result"],
  result: { match: "Match", close: "Close", mismatch: "Mismatch" } as Record<DealPositions["statedVsFound"][number]["result"], string>,
};

export const howWeLookedCopy = {
  title: "How we looked",
  intro: "Every payee taking money out on a regular schedule was checked to see if it could be a hidden advance.",
  aria: (advance: number, total: number) => `${advance} of ${total} recurring payees is an advance`,
  link: "See all recurring payments",
};

export const scenarioCopy = {
  title: "Second position or payoff?",
  subtitle: (funder: string) => `Compare funding next to ${shortFunder(funder)} with paying ${shortFunder(funder)} off from this advance`,
  label: "Scenario",
  options: (funder: string) => [
    { value: "keep" as const, label: "Keep both" },
    { value: "pay" as const, label: `Pay off ${shortFunder(funder)}` },
  ],
  labels: { cash: "Cash to merchant", daily: "Daily payments", share: "Share of revenue", position: "Your position" },
  keep: {
    cashNote: "All of the advance",
    dailyNote: (existing: number, funder: string, ours: number) => `${money(existing)} ${shortFunder(funder)} + ${money(ours)} ours`,
    positionNote: (funder: string) => `${shortFunder(funder)} is paid first`,
    verdict: (within: boolean, funder: string, payoffAt: string, ours: number) =>
      `${within ? "Works within policy." : "Goes over the policy's debt limit."} ${shortFunder(funder)} ends in ${lowerFirst(payoffLabel(payoffAt))}, after which only your ${money(ours)} remains.`,
  },
  pay: {
    cashNote: (balance: number, funder: string) => `${money(balance)} goes to ${shortFunder(funder)}`,
    dailyNote: "Only your payment",
    positionNote: "No other advance ahead of you",
    verdict: (balance: number, funder: string) =>
      `Safer for you and lighter for the merchant, but they receive ${money(balance)} less. Needs a payoff letter from ${shortFunder(funder)}.`,
  },
  cta: "Use in offer builder",
};

export const otherDebtCopy = {
  title: "Other debt checked",
  none: "None found",
  found: (n: number) => `${n} found`,
  intro: "Payments that would count toward affordability.",
  result: (found: boolean) => (found ? "Found" : "None"),
  note: (autopay: number) => `Business card autopay of ${money(autopay)} a month is treated as a normal expense, not debt.`,
};
