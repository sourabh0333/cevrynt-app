/**
 * Interface wording for Settings → Policy (design/Settings.html and its
 * prototype). The policy itself (limits, rule values, weights, versions,
 * the draft and the live test) comes from the data layer (getPolicy); this
 * file turns those values into the sentences people read.
 */
import type { Policy, PolicyDraft, PolicyVersion, RuleId, RuleOutcome, ScorePart } from "@/lib/data/types";
import { moneyShort, percent, plural } from "@/lib/format";
import type { SimInput, SimTile, SimVerdict } from "@/lib/policy-sim";

export const policyHeader = {
  live: (version: number) => `Live · version ${version}`,
  title: "Underwriting policy",
  text: (rules: number) => `${plural(rules, "rule")}, written in plain language. Every deal is checked against them, and every decision shows which rule passed or failed.`,
  upload: "Upload policy file",
  published: "Published",
  publishNext: (version: number) => `Publish as version ${version}`,
};

export type SliderKey = keyof SimInput;

/** A rule sentence: plain text, a fixed green value, or a green value tied to a simulator slider. */
export type RulePart = string | { value: string } | { slider: SliderKey };

export const outcomeLabel: Record<RuleOutcome, string> = { decline: "Decline", review: "Review", flag: "Flag" };

export const rulesCard = {
  title: "Rules",
  subtitle: "Green values can be changed. What happens when a rule fails is on the right.",
  add: "+ Add rule",
  count: (n: number) => `${plural(n, "rule")}`,
};

export const ruleGroups: { title: string; ids: RuleId[] }[] = [
  { title: "Who can apply", ids: ["age", "industry", "kyc"] },
  { title: "Cash flow", ids: ["revenue", "nsf", "negdays"] },
  { title: "Debt and stacking", ids: ["positions", "debt"] },
  { title: "Amount and approval", ids: ["amount", "stated", "senior"] },
];

/** Each rule's sentence, with the policy's values in the green chips. */
export const ruleParts: Record<RuleId, (p: Policy) => RulePart[]> = {
  age: (p) => ["Business is at least ", { value: plural(p.minBusinessMonths, "month") }, " old"],
  industry: (p) => ["Industry is not on the restricted list (", { value: plural(p.restrictedIndustries.length, "industry", "industries") }, ")"],
  kyc: () => ["Owner clears identity and sanctions checks"],
  revenue: () => ["True revenue is at least ", { slider: "minRev" }, " a month"],
  nsf: (p) => ["No more than ", { value: String(p.maxNsfsPerMonth) }, " NSFs in any month"],
  negdays: (p) => ["More than ", { value: String(p.negativeDaysFlag) }, " negative days in a month"],
  positions: () => ["No more than ", { slider: "maxPos" }, " open positions"],
  debt: () => ["All debt payments under ", { slider: "debt" }, " of revenue"],
  amount: (p) => [
    "Offer up to ",
    { value: `${p.maxRevenueMultiple}×` },
    " monthly true revenue, between ",
    { value: moneyShort(p.limits.minAmount) },
    " and ",
    { value: moneyShort(p.limits.maxAmount) },
  ],
  stated: (p) => ["Stated revenue more than ", { value: percent(p.statedRevenueFlag) }, " of verified"],
  senior: (p) => ["Deals over ", { value: moneyShort(p.limits.seniorAbove) }, " need a senior underwriter"],
};

/** How each slider value reads, in the simulator and in the rule's green chip. */
export const sliderText: Record<SliderKey, (v: number) => string> = {
  maxPos: (v) => String(v),
  debt: (v) => `${v}%`,
  minRev: (v) => `$${v}K`,
};

/** The whole sentence as plain text, for a rule switch's label. */
export const ruleSentence = (parts: RulePart[], sim: SimInput) =>
  parts.map((x) => (typeof x === "string" ? x : "value" in x ? x.value : sliderText[x.slider](sim[x.slider]))).join("");

export const goLive = {
  title: "How a change goes live",
  chip: "Needs 2 people",
  steps: [
    { title: "Propose", text: "Change a rule, write why, test it in the simulator" },
    { title: "Approve", text: "A second person with policy rights signs off" },
    { title: "Schedule", text: "Pick a start date. Deals already in review keep the old rules." },
  ],
  waitingLabel: "Waiting now:",
  waiting: (d: PolicyDraft, by: string, approver: string) => `v${d.version} draft by ${by}, "${d.title}" · needs ${approver}`,
};

export const liveTest = {
  title: "Test on live deals",
  subtitle: "Run a new version on a share of new deals, side by side with today's policy",
  chip: (day: number, days: number) => `Day ${day} of ${days}`,
  splitAria: (current: number, test: number) => `${current}% of deals on the current policy, ${test}% on the test`,
  splitLabel: {
    current: (share: number, version: number) => `${share}% of deals · current v${version}`,
    test: (share: number, name: string) => `${share}% · test "${name}"`,
  },
  results: { approval: "Approval rate", late: "Early late payments", deals: "Deals in test" },
  note: "Too early to call. Results firm up once the first payments come in.",
};

export type WeightTone = "teal" | "teal-mid" | "amber" | "mint-deep" | "teal-ink";

export const scoreWeights = {
  title: "How the underwriting score is built",
  subtitle: "100 points, split across five parts. Shown on every deal's Summary.",
  adjust: "Adjust weights",
  unit: "pts",
  parts: {
    cashFlow: { label: "Cash flow", tone: "teal" },
    debt: { label: "Debt load", tone: "teal-mid" },
    integrity: { label: "Integrity", tone: "amber" },
    business: { label: "Business & owners", tone: "mint-deep" },
    policyFit: { label: "Policy fit", tone: "teal-ink" },
  } as Record<ScorePart, { label: string; tone: WeightTone }>,
  bands: ({ declineBelow, approvalFrom }: Policy["scoreBands"]): { range: string; text: string; tone: "red" | "amber" | "green" }[] => [
    { range: `Under ${declineBelow}`, text: "Suggest decline", tone: "red" },
    { range: `${declineBelow} – ${approvalFrom - 1}`, text: "Review closely", tone: "amber" },
    { range: `${approvalFrom} and up`, text: "Approval line", tone: "green" },
  ],
};

export const exceptions = {
  title: "Exceptions this month",
  text: "Deals approved even though a rule failed. Each needs a senior sign-off and a reason.",
  note: (rate: number, watch: number) => `Exception rate ${percent(rate)} of approvals. Watch if it climbs above ${percent(watch)}.`,
};

export const restricted = {
  title: "Restricted industries",
  edit: "Edit",
  note: "Applications in these industries are declined at intake, with the reason sent to the broker.",
};

export const versions = {
  title: "Version history",
  tag: (v: PolicyVersion) => `v${v.version}`,
  /** "Priya Shah · Sep 2 · live", or "Imported from PDF · Mar 3" */
  sub: (v: PolicyVersion, by: string | null, date: string) => `${by ?? "Imported from PDF"} · ${date}${v.live ? " · live" : ""}`,
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
