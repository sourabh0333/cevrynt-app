/**
 * Sample data for Settings → Policy, copied from
 * design/prototypes/Settings.dc.html (look: design/Settings.html).
 * Real API calls replace this later behind the same types.
 */
import type { SimInput, SimTile, SimVerdict } from "@/lib/policy-sim";

export const policyHeader = {
  live: "Live · version 3",
  title: "Underwriting policy",
  text: "11 rules, written in plain language. Every deal is checked against them, and every decision shows which rule passed or failed.",
  upload: "Upload policy file",
  published: "Published",
  publishNext: "Publish as version 4",
};

export type RuleOutcome = "decline" | "review" | "flag";
export type SliderKey = keyof SimInput;

/** A rule sentence: plain text, a fixed green value, or a green value tied to a simulator slider. */
export type RulePart = string | { value: string } | { slider: SliderKey };

export type PolicyRule = { id: string; parts: RulePart[]; outcome: RuleOutcome; on: boolean };

export const outcomeLabel: Record<RuleOutcome, string> = { decline: "Decline", review: "Review", flag: "Flag" };

export const rulesCard = {
  title: "Rules",
  subtitle: "Green values can be changed. What happens when a rule fails is on the right.",
  add: "+ Add rule",
  count: (n: number) => `${n} rules`,
};

export const ruleGroups: { title: string; rules: PolicyRule[] }[] = [
  {
    title: "Who can apply",
    rules: [
      { id: "age", parts: ["Business is at least ", { value: "6 months" }, " old"], outcome: "decline", on: true },
      { id: "industry", parts: ["Industry is not on the restricted list (", { value: "7 industries" }, ")"], outcome: "decline", on: true },
      { id: "kyc", parts: ["Owner clears identity and sanctions checks"], outcome: "decline", on: true },
    ],
  },
  {
    title: "Cash flow",
    rules: [
      { id: "revenue", parts: ["True revenue is at least ", { slider: "minRev" }, " a month"], outcome: "decline", on: true },
      { id: "nsf", parts: ["No more than ", { value: "8" }, " NSFs in any month"], outcome: "review", on: true },
      { id: "negdays", parts: ["More than ", { value: "3" }, " negative days in a month"], outcome: "flag", on: true },
    ],
  },
  {
    title: "Debt and stacking",
    rules: [
      { id: "positions", parts: ["No more than ", { slider: "maxPos" }, " open positions"], outcome: "decline", on: true },
      { id: "debt", parts: ["All debt payments under ", { slider: "debt" }, " of revenue"], outcome: "decline", on: true },
    ],
  },
  {
    title: "Amount and approval",
    rules: [
      { id: "amount", parts: ["Offer up to ", { value: "1.5×" }, " monthly true revenue, between ", { value: "$10K" }, " and ", { value: "$150K" }], outcome: "review", on: true },
      { id: "stated", parts: ["Stated revenue more than ", { value: "150%" }, " of verified"], outcome: "flag", on: true },
      { id: "senior", parts: ["Deals over ", { value: "$45K" }, " need a senior underwriter"], outcome: "review", on: true },
    ],
  },
];

/** How each slider value reads, in the simulator and in the rule's green chip. */
export const sliderText: Record<SliderKey, (v: number) => string> = {
  maxPos: (v) => String(v),
  debt: (v) => `${v}%`,
  minRev: (v) => `$${v}K`,
};

export const simulator = {
  chip: "Policy simulator",
  title: "Try a change first",
  subtitle: "Replays the last 90 days of deals with your new rules",
  sliders: [
    { key: "maxPos", label: "Max open positions" },
    { key: "debt", label: "Max debt share of revenue" },
    { key: "minRev", label: "Min monthly revenue" },
  ] as { key: SliderKey; label: string }[],
  tileLabel: {
    approvals: "Approvals a month",
    late: "Late payments",
    funded: "Funded a month",
    profit: "Profit a month",
  } as Record<SimTile["key"], string>,
  verdict: {
    current: "This is your current policy. Move a slider to see what would change.",
    risky: "More deals, but late payments go above your 3% target. Not recommended.",
    safer: "Safer, but you would fund less. Worth it if losses are a concern.",
    better: "More deals and late payments stay under 3%. Worth trying.",
  } as Record<SimVerdict, string>,
  reset: "Back to current policy",
};
