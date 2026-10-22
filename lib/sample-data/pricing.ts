/**
 * Sample data for Settings → Pricing & disclosures, copied from
 * design/prototypes/Settings-Pricing.dc.html (look: design/Settings-Pricing.html).
 * The loyalty discount and the early payoff tiers are not copied here: they
 * come from lib/offer-math.ts, the same table the Offer tab and Renewals use.
 * Real API calls replace this later behind the same types.
 */
import { earlyPayoffTiers, LOYALTY_DISCOUNT } from "@/lib/offer-math";

export const pricingHeader = {
  title: "Pricing & disclosures",
  text: "How every offer is priced, and what each merchant is shown before they sign. The offer builder and renewals use these settings.",
  saved: "All changes saved",
};

/** Months, in grid column order. */
export const gridTerms = [4, 6, 8];

export type ScoreBand = { band: string; sub: string; factors: number[] };

export const factorGrid = {
  title: "Factor rates",
  subtitle: "By underwriting score and term. Click a rate to see an example.",
  edit: "Edit grid",
  termLabel: (m: number) => `${m} months`,
  bands: [
    { band: "90 and up", sub: "Lowest risk", factors: [1.26, 1.28, 1.32] },
    { band: "80 – 89", sub: "Most deals", factors: [1.28, 1.32, 1.36] },
    { band: "70 – 79", sub: "Approval line", factors: [1.34, 1.38, 1.42] },
  ] as ScoreBand[],
  /** row-column of the rate selected when the page opens: 80 – 89 at 6 months */
  start: "1-1",
  note: "Below 70 there is no standard price. Each deal is priced by a senior underwriter.",
};

/** The prototype's six shades, cheapest to most expensive. */
export const rateTone = (f: number) => (f < 1.3 ? 0 : f < 1.33 ? 1 : f < 1.36 ? 2 : f < 1.39 ? 3 : f < 1.41 ? 4 : 5);

export const example = {
  chip: "Example: $40,000",
  amount: 40000,
  title: (band: string, term: number, factor: number) => `Score ${band}, ${term} months, factor ${factor.toFixed(2)}`,
  tiles: { payback: "Merchant repays", daily: "Daily payment", apr: "Estimated APR", margin: "Your margin" },
  note: "After 8 points broker commission. This is the price the offer builder starts from.",
};

/** "−0.04", "+0.02", "±0.00" */
export const signedFactor = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toFixed(2);

export type Tone = "good" | "cost" | "flat";
export const toneOf = (v: number): Tone => (v < 0 ? "good" : v > 0 ? "cost" : "flat");

export const adjustments = {
  title: "Adjustments",
  rows: [
    { label: "Renewal (loyalty)", delta: -LOYALTY_DISCOUNT },
    { label: "Second position", delta: 0.02 },
    { label: "Weekly instead of daily", delta: 0.01 },
    { label: "Origination fee", text: "0 – 3%" },
  ] as { label: string; delta?: number; text?: string }[],
};

export const limits = {
  title: "Limits and payments",
  rows: [
    { label: "Most of daily sales taken", value: "20%" },
    { label: "First payment", value: "2 business days" },
    { label: "Collect by", value: "ACH or card split" },
    { label: "Broker commission cap", value: "8 / 5 pts" },
  ],
};

export const earlyPayoffCard = {
  title: "Early payoff discount",
  text: "Factor used if everything is paid off early",
  tiers: earlyPayoffTiers,
  dayLabel: (d: number) => `${d} days`,
};

export const industryAdjustments = {
  title: "Industry adjustments",
  edit: "Edit",
  text: "Added to the grid rate, based on how each industry has paid you",
  rows: [
    { label: "Dental and medical", delta: -0.02 },
    { label: "Professional services", delta: -0.01 },
    { label: "Retail and food", delta: 0 },
    { label: "Construction and trades", delta: 0.02 },
    { label: "Auto repair", delta: 0.03 },
  ],
};

export const sizing = {
  title: "How much to offer",
  text: "Most you'll offer, as a multiple of monthly true revenue",
  rows: [
    { band: "90 and up", multiple: 1.5 },
    { band: "80 – 89", multiple: 1.25 },
    { band: "70 – 79", multiple: 1.0 },
  ],
  multipleLabel: (m: number) => `${m % 1 === 0 ? m.toFixed(1) : String(m)}×`,
  note: "Still capped by the policy's $10K to $150K range and the 65% debt limit.",
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
    start: 2,
  },
  floor: {
    label: "Lowest margin you'll accept",
    aria: "Minimum margin",
    hint: "Offers below this need a senior sign-off",
    min: 10,
    max: 30,
    step: 2,
    start: 18,
  },
  highest: "Highest factor any merchant can see:",
};

export type DisclosureStatus = "active" | "update" | "register";

export const disclosures = {
  title: "Disclosure templates by state",
  subtitle: "Chosen automatically from the merchant's state when an offer is sent",
  add: "+ Add state",
  columns: ["State", "Template", "Estimated APR", "Counsel review", "Status"],
  statusLabel: { active: "Active", update: "Update due", register: "Register by Dec 31" } as Record<DisclosureStatus, string>,
  rows: [
    { state: "New York", template: "NY sales-based financing", apr: "Shown", review: "Aug 2026", status: "active" },
    { state: "California", template: "CA sales-based financing", apr: "Shown", review: "Aug 2026", status: "active" },
    { state: "Connecticut", template: "CT commercial financing", apr: "From Jul 2027", review: "Sep 2026", status: "update" },
    { state: "Texas", template: "Registration only", apr: "Not needed", review: "Sep 2026", status: "register" },
    { state: "Maine, NH, MA, VT", template: "Standard cost summary", apr: "Shown", review: "Jul 2026", status: "active" },
  ] as { state: string; template: string; apr: string; review: string; status: DisclosureStatus }[],
  toggles: [
    { key: "forgive", title: "Forgive unearned fees on renewals", hint: "So renewals never include unpaid fees from the last advance", on: true },
    { key: "brokerPay", title: "Show broker pay on every disclosure", hint: "Even where a state doesn't require it", on: true },
  ],
  note: "State rules change often. Keep templates reviewed by your counsel; Cevrynt flags any template older than 12 months.",
};
