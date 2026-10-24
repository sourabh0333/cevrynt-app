/**
 * Interface wording for Settings › Renewal rules
 * (design/Settings-Renewals.html and its prototype). The saved rules,
 * auto-approve, outreach steps, terms and limits come from the data layer
 * (renewalRulesView), and the price terms from Pricing; this file words
 * them. The readiness check itself is lib/renewal-rules.ts.
 */
import type { OutreachKind, Pricing, RenewalSettings } from "@/lib/data/types";
import { percent } from "@/lib/format";
import { POOL_MIN_PAID } from "@/lib/renewal-rules";

export const renewalRulesHeader = {
  title: "Renewal rules",
  text: "Who counts as ready to renew, what they're offered and when you reach out. The Renewals page uses these.",
  open: { label: "Open Renewals", href: "/renewals" },
};

export const whoIsReady = {
  title: "Who counts as ready",
  subtitle: "A merchant must meet every rule. Move a slider to see who would qualify.",
  sliders: [
    { key: "paid", label: "Repaid at least" },
    { key: "ret", label: "No returned payments in" },
    { key: "rev", label: "Revenue now vs at funding" },
    { key: "score", label: "Health score at least" },
  ] as { key: "paid" | "ret" | "rev" | "score"; label: string }[],
  text: {
    paid: (v: number) => `${v}%`,
    ret: (v: number) => (v ? `${v} days` : "Any time"),
    rev: (v: number) => `${v}%`,
    score: (v: number) => String(v),
  },
  noStack: { title: "No new advances from other funders", hint: "Checked by Stacking Watch" },
  funnelTitle: "How the rules narrow it down",
  funnelHint: "Live, as you move the sliders",
};

export const readyPanel = {
  title: "Ready with these rules",
  of: (ready: number, pool: number) => `${ready} of ${pool} merchants who are at least ${POOL_MIN_PAID}% repaid`,
  ready: "Ready",
  listSize: 8,
  change: {
    same: "Same as your current rules.",
    more: (n: number) => `${n} more than today. Check their late-payment risk before saving.`,
    fewer: (n: number) => `${n} fewer than today. Safer, but fewer renewals.`,
  },
};

type OfferTerms = Pick<Pricing, "loyaltyDiscount" | "brokerPoints" | "forgiveUnearnedFees">;

/*
 * "What they're offered": the price terms come from Pricing, so the tiles
 * can't drift (the loyalty price, the broker points and the forgive
 * switch); the rest are the saved renewal terms.
 */
export const offered = {
  title: "What they're offered",
  subtitle: "The starting point for every renewal offer",
  link: { label: "Pricing settings", href: "/settings/pricing" },
  tiles: ({ loyaltyDiscount, brokerPoints, forgiveUnearnedFees: forgive }: OfferTerms, terms: RenewalSettings["terms"]): { label: string; value: string; note: string; hero?: boolean }[] => [
    { label: "Most you offer", value: `${terms.maxRevenueMultiple}×`, note: "of revenue right now" },
    { label: "Loyalty price", value: `−${loyaltyDiscount.toFixed(2)}`, note: "off the first factor", hero: true },
    { label: "Current balance", value: "Paid off", note: "from the renewal amount" },
    { label: "Unearned fees", value: forgive ? "Forgiven" : "Charged", note: forgive ? "no paying twice" : "included in the payoff" },
    { label: "Broker commission", value: `${brokerPoints.renewal} pts`, note: `vs ${brokerPoints.newDeal} on new deals` },
    { label: "Broker keeps renewals", value: `${terms.brokerKeepsMonths} mo`, note: "then they're yours" },
  ],
};

export const approval = {
  auto: {
    title: "Approve automatically",
    text: "Clean renewals skip the queue",
    aria: "Approve renewals automatically",
    capLabel: "Up to",
    capHint: "Only when every rule passes and no new alerts appear",
    /** the cap slider, in $K */
    cap: { min: 10, max: 80, step: 5 },
    capValue: (k: number) => `$${k}K`,
    note: (n: number, ready: number) => `About ${n} of today’s ${ready} would go straight to an offer`,
    off: "Every renewal goes to an underwriter",
  },
  checks: {
    title: "Checked again first",
    text: "Before any renewal offer goes out",
    items: [
      { title: "Fresh bank data", hint: "Last 30 days of activity" },
      { title: "Stacking and filings", hint: "New UCCs, funder debits, inquiries" },
      { title: "Business still active", hint: "State registry" },
      { title: "Credit refreshed", hint: "If older than 6 months" },
    ],
  },
  limits: {
    title: "Limits",
    text: "Healthy renewals for the merchant",
    rows: (l: RenewalSettings["limits"]) => [
      { label: "Offer valid for", value: `${l.offerValidDays} days` },
      { label: "Time between renewals", value: `${l.minDaysBetween}+ days` },
      { label: "Renewals in a row", value: `Review after ${l.reviewAfter}` },
      { label: "New cash to merchant", value: `At least ${percent(l.minNewCash)}` },
    ],
  },
};

const stepWords: Record<OutreachKind, { title: string; who: string; via: string }> = {
  "heads-up": { title: "Heads-up that renewal is coming", who: "Broker", via: "By email" },
  "pre-approved": { title: "Pre-approved offer, one tap to accept", who: "Merchant", via: "Email and text" },
  call: { title: "Personal call if no reply", who: "Underwriter", via: "Task in Cevrynt" },
  "last-chance": { title: "Last chance before the advance ends", who: "Merchant", via: "By email" },
};

/** "40, 50, 65 and 90" */
const andList = (xs: (string | number)[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const reachOut = {
  title: "When to reach out",
  subtitle: "Each step fires when the merchant has repaid this much of the advance",
  add: "+ Add step",
  trackLabel: (steps: RenewalSettings["outreach"]) => `Outreach at ${andList(steps.map((s) => s.at))} percent repaid`,
  ends: { start: "Funded", line: (paid: number) => `Renewal line, ${paid}%`, end: "Paid off" },
  steps: (steps: RenewalSettings["outreach"]) => steps.map((s) => ({ at: s.at, ...stepWords[s.kind] })),
  switchLabel: (at: number, title: string) => `${at}%: ${title}`,
};

export const neverOffer = {
  title: "Never offer a renewal when",
  subtitle: "These always win over the rules above",
  items: [
    { title: "A stacking alert is open", hint: "Until someone reviews it" },
    { title: "On a payment plan", hint: "Or in collections" },
    { title: "A reconciliation is pending", hint: "Sales dropped recently" },
  ],
};

export const renewalRulesSections = { approval: "Renewal approval, checks and limits" };
