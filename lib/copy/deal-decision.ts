/**
 * Interface wording for the deal Decision & memo tab
 * (design/Deal-Decision.html). Cevrynt's suggestion, the memo and any
 * recorded decision come from the data layer (decisionTabView); offer
 * figures come from lib/offer-math, and every limit quoted here (the
 * approval line, the debt limit, the policy's rule values) comes from the
 * shared policy.
 */
import type { DealCashFlow, DealPosition, DecisionOutcome } from "@/lib/data/types";
import type { DecisionTabData } from "@/lib/data/views/deal-tabs";
import { dateShort, money, moneyK, moneyShort, percent, plural, timeOfDay } from "@/lib/format";
import type { OfferFigures } from "@/lib/offer-math";
import { accountLabel } from "./deal-offer";

export type Outcome = DecisionOutcome;

const firstName = (name: string) => name.split(" ")[0];
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const outcomes: { key: Outcome; label: string; sub: string; dot: string }[] = [
  { key: "approve", label: "Approve", sub: "As offered", dot: "bg-teal" },
  { key: "conditions", label: "Approve with conditions", sub: "Extra terms", dot: "bg-teal-soft" },
  { key: "counter", label: "Counter-offer", sub: "Different terms", dot: "bg-amber" },
  { key: "decline", label: "Decline", sub: "With reasons", dot: "bg-red" },
];

/** Who the offer or notice goes to: the broker's short name and the owner's first name. */
type Parties = { broker: string; owner: string; validHours: number; openItems: number };

export const decisionCard = {
  title: "Your decision",
  subtitle: (amount: number) => `Cevrynt recommends approving ${money(amount)}. The decision is yours.`,
  chip: { recorded: "Recorded", open: "Not recorded yet" },
  outcomeGroup: "Outcome",
  amount: { label: "Amount", link: "Change in offer builder", none: "—" },
  terms: {
    label: "Terms",
    none: "No offer",
    noneSub: "Broker gets the reasons below",
    line: (factor: number, term: number) => `${factor.toFixed(2)} factor · ${plural(term, "month")}`,
    sub: (f: OfferFigures, bank: DealCashFlow["bank"]) => `${f.payment} ${f.per} from ${accountLabel(bank)}`,
  },
  counter: {
    title: "Counter-offer terms",
    fields: { amount: "Amount", factor: "Factor", term: "Term" },
    term: (months: number) => `${plural(months, "month")}`,
    note: "The broker can accept, or send their own counter. It shows in Offer history.",
  },
  conditions: {
    title: "Extra conditions for this approval",
    options: (funder: string | null) =>
      [
        ...(funder ? [{ key: "payoff", label: `Pay off ${funder.split(" ")[0]} at funding` }] : []),
        { key: "weekly", label: "Switch to weekly payments" },
        { key: "bank", label: "Require live bank connection" },
        { key: "cog", label: "Add a second guarantor" },
      ] as { key: string; label: string }[],
    start: { payoff: true } as Record<string, boolean>,
    note: "Chosen conditions are added to the Conditions & stips tab and the contract.",
  },
  decline: {
    title: "Decline notice preview",
    notice: (merchant: string, id: string, reasons: string) =>
      `We're unable to fund ${merchant} (${id}) at this time. Main reasons: ${reasons}. We're happy to look again if anything changes.`,
    none: "none selected yet",
    alsoMerchant: "Also send to the merchant through Merchant Link",
  },
  reasons: {
    title: { approve: "Main reasons", decline: "Reasons for declining (sent to the broker)" },
    approve: (years: number) => [
      { key: "revenue", label: "Strong revenue" },
      { key: "clean", label: "Clean bank history" },
      { key: "debt", label: "Low debt load" },
      { key: "tenure", label: `${plural(years, "year")} in business` },
      { key: "verified", label: "Owner verified" },
      { key: "other", label: "Other" },
    ],
    decline: [
      { key: "revenue_low", label: "Revenue too low" },
      { key: "nsf", label: "Too many NSFs" },
      { key: "fraud", label: "Fraud signals" },
      { key: "mismatch", label: "Identity or address mismatch" },
      { key: "debt", label: "Too much existing debt" },
      { key: "docs", label: "Missing documents" },
      { key: "other", label: "Other" },
    ],
  },
  note: { label: "Note for the file", placeholder: "Why you decided this way, in a sentence or two" },
  differs: "This differs from Cevrynt's recommendation. Please add a note so the reason is on record.",
  next: {
    title: "What happens now",
    steps: (out: Outcome, p: Parties): string[] => {
      const to = `${p.broker} and ${firstName(p.owner)}`;
      return {
        approve: [`Offer goes to ${to}, valid for ${plural(p.validHours, "hour")}`, `Conditions & stips keeps track of the ${p.openItems} open items`, "Stacking Watch keeps checking until funding"],
        conditions: [`Offer with your extra conditions goes to ${to}`, "New conditions are added to Conditions & stips", "Stacking Watch keeps checking until funding"],
        counter: [`Counter-offer goes to ${p.broker} for a response`, "Offer history shows every round", "The deal stays in your queue until they reply"],
        decline: [`Decline notice goes to ${p.broker} with the reasons`, "The deal moves to closed, and can be reopened if new documents arrive", "Stacking Watch stops for this merchant"],
      }[out];
    },
  },
  foot: {
    recorded: (me: string, time: string) => `Recorded by ${me} at ${time}. Undo within 10 minutes.`,
    ready: "Saved with your name, time and reasons.",
    pick: "Pick at least one reason first.",
  },
  label: (out: Outcome, amount: string, counter: string) =>
    ({ approve: `Approve ${amount}`, conditions: `Approve ${amount} with conditions`, counter: `Counter at ${counter}`, decline: "Decline" })[out],
  record: { prefix: "Record: ", undo: "Undo" },
};

export type PolicyRow = { label: string; value: string; met: boolean };

/** The policy check: each rule worded from the policy's own values, and this deal's figure for it. */
export function policyRows(d: Pick<DecisionTabData, "policy" | "facts" | "positions">, amount: number, share: number): PolicyRow[] {
  const { policy: p, facts: f } = d;
  const multiple = f.revenue ? amount / f.revenue : 0;
  const stated = f.revenue ? f.statedRevenue / f.revenue : 0;
  return [
    { label: `Time in business, ${plural(p.minBusinessMonths, "month")} or more`, value: plural(f.years, "year"), met: f.years * 12 >= p.minBusinessMonths },
    { label: "Industry on approved list", value: f.industry, met: f.industryAllowed },
    { label: `Debt payments under ${percent(p.maxDebtShare)} of revenue`, value: percent(share), met: share <= p.maxDebtShare },
    { label: `NSFs under ${p.maxNsfsPerMonth} a month`, value: String(f.nsfMax), met: f.nsfMax <= p.maxNsfsPerMonth },
    { label: `Amount under ${p.maxRevenueMultiple}× monthly revenue`, value: `${multiple.toFixed(2)}×`, met: multiple <= p.maxRevenueMultiple },
    { label: `Stated revenue within ${percent(p.statedRevenueFlag)} of verified`, value: percent(stated), met: stated <= p.statedRevenueFlag },
    { label: `No more than ${p.maxPositions} open positions`, value: String(d.positions.length), met: d.positions.length <= p.maxPositions },
    { label: "Owner clear on sanctions lists", value: f.ownerClear ? "Clear" : "Not clear", met: f.ownerClear },
  ];
}

export const policyCheck = {
  title: "Policy check",
  chip: (met: number, total: number) => `${met} of ${total} met`,
  intro: (version: number) => `Your underwriting policy, version ${version}, applied to this deal.`,
  passed: "Passed",
  notMet: "Not met",
  link: { label: "Open policy", href: "/settings/policy" },
};

const counts = ["No", "One", "Two", "Three", "Four", "Five"];

/** The memo's debt sentence: the advances found and what they leave. */
const advancesLine = (positions: DealPosition[]) => {
  if (!positions.length) return "No existing advances.";
  const daily = positions.reduce((s, p) => s + p.dailyPayment, 0);
  const left = positions.reduce((s, p) => s + p.estBalance, 0);
  const all = positions.every((p) => p.disclosed) ? "disclosed " : "";
  const who = positions.map((p) => p.funder).join(" and ");
  const n = counts[positions.length] ?? String(positions.length);
  return `${n} ${all}${positions.length === 1 ? "advance" : "advances"} with ${who} at ${money(daily)} a day, about ${moneyShort(left)} left.`;
};

export type MemoSection = { id: string; nav: string; title: string };

export const memo = {
  title: "Credit memo",
  subtitle: "Written from this deal's checks. Every figure links back to its evidence.",
  actions: { rewrite: "Rewrite", share: "Share link", download: "Download PDF" },
  nav: {
    caption: "Sections",
    label: "Memo sections",
    version: (version: number, at: string, note: string) => `Version ${version} · updated ${timeOfDay(at)} ${note}`,
  },
  doc: {
    caption: "Credit memo",
    ref: (funder: string, at: string) => `${funder} · ${dateShort(at)}, ${at.slice(0, 4)}`,
    tiles: { recommended: "Recommended", score: "Score", revenue: "True revenue", share: "Debt share", fraud: "Fraud risk" },
    revenue: (n: number) => moneyK(n),
    fraud: (risk: string) => capital(risk),
    footer: (reviewer: string) => `Prepared by Cevrynt from the deal's checks. Reviewed by ${reviewer}.`,
  },
  sections: [
    { id: "m1", nav: "Summary", title: "Summary" },
    { id: "m2", nav: "The business", title: "The business" },
    { id: "m3", nav: "Cash flow", title: "Cash flow" },
    { id: "m4", nav: "Debt and positions", title: "Debt and positions" },
    { id: "m5", nav: "Risks", title: "Risks and how they are handled" },
    { id: "m6", nav: "Recommendation", title: "Recommendation" },
    { id: "m7", nav: "Exceptions", title: "Exceptions and overrides" },
  ] as MemoSection[],
  /** the Summary section, split around its bold recommendation */
  summary: (x: { merchant: string; requested: number; f: OfferFigures; factor: number; term: number; score: number; risk: string; met: number; total: number }) => ({
    before: `${x.merchant} asks for ${money(x.requested)}. We recommend `,
    bold: `approving ${x.f.amount}`,
    after: ` at a ${x.factor.toFixed(2)} factor over ${plural(x.term, "month")} (${x.f.payment} ${x.f.per}). Score ${x.score}, fraud risk ${x.risk}, ${
      x.met === x.total ? "all policy rules met" : `${x.met} of ${x.total} policy rules met`
    }.`,
  }),
  debt: (positions: DealPosition[], f: OfferFigures, maxShare: number) =>
    `${advancesLine(positions)} After our offer, all debt payments take ${f.share} of revenue against a ${percent(maxShare)} limit.`,
  recommendation: (f: OfferFigures, factor: number, term: number, freq: "daily" | "weekly", bank: DealCashFlow["bank"], open: string[]) =>
    `Approve ${f.amount}, ${factor.toFixed(2)} factor, ${plural(term, "month")}, ${freq} ACH from ${accountLabel(bank)}. Conditions: ${[...open.map(lowerFirst), "final checks before funding"].join(", ")}.`,
};

export const signOff = {
  title: "Who signs off",
  intro: "Set by your team's approval limits.",
  role: { underwriter: (limit: number) => `Underwriter · up to ${moneyShort(limit)}`, senior: (limit: number) => `Senior · above ${moneyShort(limit)} or waivers` },
  status: { signed: "Signed", waiting: "Waiting", notNeeded: "Not needed" },
  note: (amount: number, limit: number, me: string, senior: string) =>
    amount <= limit
      ? `${money(amount)} is within ${firstName(me)}'s limit, so one sign-off is enough.`
      : `${money(amount)} is above ${firstName(me)}'s limit, so ${firstName(senior)} signs too.`,
};

export const decisionRecord = {
  title: "Decision record",
  subtitle: "What the system suggested and what a person decided, kept for audits",
  link: { label: "Export record", href: "#" },
  suggested: {
    caption: "Cevrynt suggested",
    title: (amount: number) => `Approve ${money(amount)}`,
    meta: (score: number, version: number, at: string) => `Score ${score} · policy v${version} · ${timeOfDay(at)}`,
    why: "Based on cash flow, debt load, integrity checks and business verification.",
  },
  person: {
    caption: "Person decided",
    waiting: { title: (me: string) => `Waiting for ${firstName(me)}`, sub: "No decision recorded yet", why: "The record fills in when a decision is made." },
    sub: (me: string, time: string) => `${me} · ${time}`,
    agrees: "Agrees with the suggestion.",
    differs: "Differs from the suggestion. Reason saved in the note.",
  },
};

export const decisionSections = { decision: "Your decision and the policy check", signOff: "Who signs off and the decision record" };
