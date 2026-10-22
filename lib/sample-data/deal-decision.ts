/**
 * Sample data for the Decision & memo tab, copied from
 * design/prototypes/Deal-Decision.dc.html (look: design/Deal-Decision.html).
 * Offer figures come from lib/offer-math.ts, not from here.
 */
import type { OfferFigures, OfferInput } from "@/lib/offer-math";

export type Outcome = "approve" | "conditions" | "counter" | "decline";

export const outcomes: { key: Outcome; label: string; sub: string; dot: string }[] = [
  { key: "approve", label: "Approve", sub: "As offered", dot: "bg-teal" },
  { key: "conditions", label: "Approve with conditions", sub: "Extra terms", dot: "bg-teal-soft" },
  { key: "counter", label: "Counter-offer", sub: "Different terms", dot: "bg-amber" },
  { key: "decline", label: "Decline", sub: "With reasons", dot: "bg-red" },
];

/** The counter-offer the prototype starts from. */
export const counterStart: Pick<OfferInput, "amount" | "factor" | "term"> = { amount: 35000, factor: 1.36, term: 6 };

export const decisionCard = {
  title: "Your decision",
  subtitle: "Cevrynt recommends approving $40,000. The decision is yours.",
  chip: { recorded: "Recorded", open: "Not recorded yet" },
  amount: { label: "Amount", link: { label: "Change in offer builder", href: "/deals/APP-7H2K4Q/offer" }, none: "—" },
  terms: {
    label: "Terms",
    none: "No offer",
    noneSub: "Broker gets the reasons below",
    line: (f: OfferFigures, factor: number, term: number) => `${factor.toFixed(2)} factor · ${term} months`,
    sub: (f: OfferFigures) => `${f.payment} ${f.per} from Chase ••7712`,
  },
  counter: {
    title: "Counter-offer terms",
    fields: { amount: "Amount", factor: "Factor", term: "Term" },
    note: "The broker can accept, or send their own counter. It shows in Offer history.",
  },
  conditions: {
    title: "Extra conditions for this approval",
    options: [
      { key: "payoff", label: "Pay off Kingsway at funding" },
      { key: "weekly", label: "Switch to weekly payments" },
      { key: "bank", label: "Require live bank connection" },
      { key: "cog", label: "Add a second guarantor" },
    ],
    start: { payoff: true } as Record<string, boolean>,
    note: "Chosen conditions are added to the Conditions & stips tab and the contract.",
  },
  decline: {
    title: "Decline notice preview",
    notice: (reasons: string) =>
      `We're unable to fund Harbor Street Bakery LLC (APP-7H2K4Q) at this time. Main reasons: ${reasons}. We're happy to look again if anything changes.`,
    none: "none selected yet",
    alsoMerchant: "Also send to the merchant through Merchant Link",
  },
  reasons: {
    title: { approve: "Main reasons", decline: "Reasons for declining (sent to the broker)" },
    approve: [
      { key: "revenue", label: "Strong revenue" },
      { key: "clean", label: "Clean bank history" },
      { key: "debt", label: "Low debt load" },
      { key: "tenure", label: "10 years in business" },
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
    start: { revenue: true, clean: true, debt: true } as Record<string, boolean>,
  },
  note: { label: "Note for the file", placeholder: "Why you decided this way, in a sentence or two" },
  differs: "This differs from Cevrynt's recommendation. Please add a note so the reason is on record.",
  next: {
    title: "What happens now",
    steps: {
      approve: ["Offer goes to Apex Funding and Elena, valid for 72 hours", "Conditions & stips keeps track of the 3 open items", "Stacking Watch keeps checking until funding"],
      conditions: ["Offer with your extra conditions goes to Apex Funding and Elena", "New conditions are added to Conditions & stips", "Stacking Watch keeps checking until funding"],
      counter: ["Counter-offer goes to Apex Funding for a response", "Offer history shows every round", "The deal stays in your queue until they reply"],
      decline: ["Decline notice goes to Apex Funding with the reasons", "The deal moves to closed, and can be reopened if new documents arrive", "Stacking Watch stops for this merchant"],
    } as Record<Outcome, string[]>,
  },
  foot: {
    recorded: (time: string) => `Recorded by Maya Chen at ${time}. Undo within 10 minutes.`,
    ready: "Saved with your name, time and reasons.",
    pick: "Pick at least one reason first.",
  },
  label: (out: Outcome, amount: string, counter: string) =>
    ({ approve: `Approve ${amount}`, conditions: `Approve ${amount} with conditions`, counter: `Counter at ${counter}`, decline: "Decline" })[out],
  record: { prefix: "Record: ", undo: "Undo" },
};

export const policyCheck = {
  title: "Policy check",
  chip: "8 of 8 met",
  intro: "Your underwriting policy, version 3, applied to this deal.",
  rules: [
    { label: "Time in business, 6 months or more", value: "10 years" },
    { label: "Industry on approved list", value: "Bakery" },
    { label: "Debt payments under 65% of revenue", value: "share" },
    { label: "NSFs under 8 a month", value: "0" },
    { label: "Amount under 1.5× monthly revenue", value: "0.65×" },
    { label: "Stated revenue within 150% of verified", value: "104%" },
    { label: "No more than 2 open positions", value: "1" },
    { label: "Owner clear on sanctions lists", value: "Clear" },
  ],
  link: { label: "Open policy", href: "/settings/policy" },
};

export const memo = {
  title: "Credit memo",
  subtitle: "Written from this deal's checks. Every figure links back to its evidence.",
  actions: { rewrite: "Rewrite", share: "Share link", download: "Download PDF" },
  nav: { caption: "Sections", version: "Version 2 · updated 10:05 after the landlord letter request" },
  doc: {
    caption: "Credit memo",
    merchant: "Harbor Street Bakery LLC",
    ref: ["APP-7H2K4Q", "Ridgeline Capital · Oct 12, 2026"],
    tiles: { recommended: "Recommended", score: "Score", revenue: "True revenue", share: "Debt share", fraud: "Fraud risk" },
    score: "88",
    revenue: "$61.4K",
    fraud: "Low",
    footer: "Prepared by Cevrynt from the deal's checks. Reviewed by Maya Chen.",
  },
  sections: [
    { id: "m1", nav: "Summary", title: "Summary" },
    { id: "m2", nav: "The business", title: "The business" },
    { id: "m3", nav: "Cash flow", title: "Cash flow" },
    { id: "m4", nav: "Debt and positions", title: "Debt and positions" },
    { id: "m5", nav: "Risks", title: "Risks and how they are handled" },
    { id: "m6", nav: "Recommendation", title: "Recommendation" },
    { id: "m7", nav: "Exceptions", title: "Exceptions and overrides" },
  ],
  /** section bodies; the ones with offer figures take them from the shared math */
  body: {
    m2: "Retail bakery in Portland, ME, trading since 2016, active and in good standing. Owner Elena Brooks (100%) is verified, with a clean public record. She also owns Harbor Street Catering LLC.",
    m3: "True revenue averages $61.4K a month, up 3.1% a month from June to September, with no NSFs and no days below zero. Average balance $9.8K; lowest $1.2K on Aug 2.",
    m4: (f: OfferFigures) => `One disclosed advance with Kingsway Capital at $285 a day, about $9.4K left. After our offer, all debt payments take ${f.share} of revenue against a 65% limit.`,
    m5: "A $12,000 August transfer from the owner’s catering business is left out of revenue, which is why we offer $5,000 less than requested. A landlord letter is required before funding.",
    m6: (f: OfferFigures, factor: number, term: number) =>
      `Approve ${f.amount}, ${factor.toFixed(2)} factor, ${term} months, daily ACH from Chase ••7712. Conditions: landlord letter, signed contract, funding call, final checks before funding.`,
    m7: "No policy exceptions are needed and no conditions have been waived. If either changes, it is listed here with who approved it.",
  },
};

export const signOff = {
  title: "Who signs off",
  intro: "Set by your team's approval limits.",
  people: [
    { initials: "MC", name: "Maya Chen", role: "Underwriter · up to $45K", me: true },
    { initials: "PS", name: "Priya Shah", role: "Senior · above $45K or waivers" },
  ],
  status: { signed: "Signed", waiting: "Waiting", notNeeded: "Not needed" },
  note: (amount: string) => `${amount} is within Maya's limit, so one sign-off is enough.`,
};

export const decisionRecord = {
  title: "Decision record",
  subtitle: "What the system suggested and what a person decided, kept for audits",
  link: { label: "Export record", href: "#" },
  suggested: {
    caption: "Cevrynt suggested",
    title: (amount: string) => `Approve ${amount}`,
    meta: "Score 88 · policy v3 · 09:41",
    why: "Based on cash flow, debt load, integrity checks and business verification.",
  },
  person: {
    caption: "Person decided",
    waiting: { title: "Waiting for Maya", sub: "No decision recorded yet", why: "The record fills in when a decision is made." },
    sub: (time: string) => `Maya Chen · ${time}`,
    agrees: "Agrees with the suggestion.",
    differs: "Differs from the suggestion. Reason saved in the note.",
  },
};
