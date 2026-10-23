/**
 * Interface wording for Settings → Pricing & disclosures
 * (design/Settings-Pricing.html and its prototype). The prices themselves
 * (grid, adjustments, early payoff, loyalty, broker points, sizing,
 * disclosures) come from the data layer (getPricing); this file turns them
 * into what people read.
 */
import type { DisclosureStatus, Policy, Pricing, StateDisclosure } from "@/lib/data/types";
import { money, moneyShort, monthYear, percent, plural } from "@/lib/format";

export const pricingHeader = {
  title: "Pricing & disclosures",
  text: "How every offer is priced, and what each merchant is shown before they sign. The offer builder and renewals use these settings.",
  saved: "All changes saved",
};

/** "90 and up", "80 – 89" */
export const bandLabel = (minScore: number, maxScore: number | null) => (maxScore === null ? `${minScore} and up` : `${minScore} – ${maxScore}`);

export const factorGrid = {
  title: "Factor rates",
  subtitle: "By underwriting score and term. Click a rate to see an example.",
  edit: "Edit grid",
  termLabel: (m: number) => `${m} months`,
  /** the top band, the bottom (approval line) band, and the ones between */
  bandSub: (i: number, count: number) => (i === 0 ? "Lowest risk" : i === count - 1 ? "Approval line" : "Most deals"),
  /** row-column of the rate selected when the page opens: 80 – 89 at 6 months */
  start: "1-1",
  note: (lowest: number) => `Below ${lowest} there is no standard price. Each deal is priced by a senior underwriter.`,
};

/** The prototype's six shades, cheapest to most expensive. */
export const rateTone = (f: number) => (f < 1.3 ? 0 : f < 1.33 ? 1 : f < 1.36 ? 2 : f < 1.39 ? 3 : f < 1.41 ? 4 : 5);

export const example = {
  amount: 40000,
  chip: (amount: number) => `Example: ${money(amount)}`,
  title: (band: string, term: number, factor: number) => `Score ${band}, ${term} months, factor ${factor.toFixed(2)}`,
  tiles: { payback: "Merchant repays", daily: "Daily payment", apr: "Estimated APR", margin: "Your margin" },
  note: (points: number) => `After ${points} points broker commission. This is the price the offer builder starts from.`,
};

/** "−0.04", "+0.02", "±0.00" */
export const signedFactor = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toFixed(2);

export type Tone = "good" | "cost" | "flat";
export const toneOf = (v: number): Tone => (v < 0 ? "good" : v > 0 ? "cost" : "flat");

export const adjustments = {
  title: "Adjustments",
  rows: (p: Pricing): { label: string; delta?: number; text?: string }[] => [
    { label: "Renewal (loyalty)", delta: -p.loyaltyDiscount },
    { label: "Second position", delta: p.secondPositionAdd },
    { label: "Weekly instead of daily", delta: p.weeklyAdd },
    { label: "Origination fee", text: `${Math.round(p.originationFee.min * 100)} – ${percent(p.originationFee.max)}` },
  ],
};

const collectWords = { ach: "ACH", split: "card split" };

export const limits = {
  title: "Limits and payments",
  rows: (p: Pricing) => [
    { label: "Most of daily sales taken", value: percent(p.maxDailyHold) },
    { label: "First payment", value: plural(p.firstPaymentBusinessDays, "business day") },
    { label: "Collect by", value: p.collectBy.map((c) => collectWords[c]).join(" or ") },
    { label: "Broker commission cap", value: `${p.brokerPoints.newDeal} / ${p.brokerPoints.renewal} pts` },
  ],
};

export const earlyPayoffCard = {
  title: "Early payoff discount",
  text: "Factor used if everything is paid off early",
  dayLabel: (d: number) => `${d} days`,
};

export const industryAdjustments = {
  title: "Industry adjustments",
  edit: "Edit",
  text: "Added to the grid rate, based on how each industry has paid you",
};

export const sizing = {
  title: "How much to offer",
  text: "Most you'll offer, as a multiple of monthly true revenue",
  multipleLabel: (m: number) => `${m % 1 === 0 ? m.toFixed(1) : String(m)}×`,
  note: (p: Pick<Policy, "limits" | "maxDebtShare">) =>
    `Still capped by the policy's ${moneyShort(p.limits.minAmount)} to ${moneyShort(p.limits.maxAmount)} range and the ${percent(p.maxDebtShare)} debt limit.`,
};

export const guardrails = {
  title: "Guardrails",
  upsell: {
    label: "Broker can raise the rate by",
    aria: "Maximum broker upsell",
    hint: "Extra points go to the broker and are shown on the disclosure",
    none: "Not allowed",
    min: 0,
    max: 6,
    step: 1,
  },
  floor: {
    label: "Lowest margin you'll accept",
    aria: "Minimum margin",
    hint: "Offers below this need a senior sign-off",
    min: 10,
    max: 30,
    step: 2,
  },
  highest: "Highest factor any merchant can see:",
};

export const disclosures = {
  title: "Disclosure templates by state",
  subtitle: "Chosen automatically from the merchant's state when an offer is sent",
  add: "+ Add state",
  columns: ["State", "Template", "Estimated APR", "Counsel review", "Status"],
  statusLabel: { active: "Active", update: "Update due", register: "Register by Dec 31" } as Record<DisclosureStatus, string>,
  apr: (a: StateDisclosure["apr"]) => (a === "shown" ? "Shown" : a === "not-needed" ? "Not needed" : `From ${monthYear(a.from)}`),
  review: (d: StateDisclosure) => monthYear(d.counselReviewAt),
  toggles: [
    { key: "forgive", title: "Forgive unearned fees on renewals", hint: "So renewals never include unpaid fees from the last advance" },
    { key: "brokerPay", title: "Show broker pay on every disclosure", hint: "Even where a state doesn't require it" },
  ] as { key: "forgive" | "brokerPay"; title: string; hint: string }[],
  note: "State rules change often. Keep templates reviewed by your counsel; Cevrynt flags any template older than 12 months.",
};
