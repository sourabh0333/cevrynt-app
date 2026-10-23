/**
 * Sample data for the Summary tab, copied from
 * design/prototypes/Deal-Summary.dc.html (look: design/Deal-Summary.html).
 * The deal frame (header and tabs) now reads the deal from the data layer
 * (lib/data/deals, lib/copy/deal); this file keeps the tab contents until
 * the Summary tab moves too. Real API calls replace this later.
 */

/* ---------- Summary tab, top half (design/Deal-Summary.html) ---------- */

export type ScorePartColor = "teal" | "teal-mid" | "amber" | "mint-deep" | "teal-ink";

export type ScorePart = {
  label: string;
  value: number;
  max: number;
  color: ScorePartColor;
  /** the row that holds the score back */
  warn?: boolean;
};

export const scoreCard = {
  title: "Underwriting score",
  link: { label: "How it's built", href: "/settings/policy" },
  score: 88,
  band: "Strong",
  parts: [
    { label: "Cash flow", value: 24, max: 25, color: "teal" },
    { label: "Debt load", value: 18, max: 20, color: "teal-mid" },
    { label: "Integrity", value: 16, max: 20, color: "amber", warn: true },
    { label: "Business & owners", value: 15, max: 15, color: "mint-deep" },
    { label: "Policy fit", value: 15, max: 20, color: "teal-ink" },
  ] as ScorePart[],
  summary: "18 above your approval line of 70. Integrity holds it back.",
};

/** A tiny sparkline: a line path and the matching closed area path (120×24 box). */
export type Sparkline = { line: string; area: string; dot: { x: number; y: number } };

export const keyNumbers = {
  title: "Key numbers",
  range: "Jun – Sep · 4 statements",
  revenue: {
    label: "True revenue",
    chip: "+3.1%",
    value: "$61.4K",
    suffix: "/mo",
    note: "4% below stated",
    href: "/deals/APP-7H2K4Q/cash-flow",
    spark: {
      line: "M2 21 L40 17 L80 7 L118 5",
      area: "M2 21 L40 17 L80 7 L118 5 L118 24 L2 24Z",
      dot: { x: 118, y: 5 },
    } as Sparkline,
  },
  balance: {
    label: "Avg balance",
    chip: "Steady",
    value: "$9.8K",
    note: "Low $1.2K · Aug 2",
    href: "/deals/APP-7H2K4Q/cash-flow",
    spark: {
      line: "M2 11 C12 6 20 14 30 9 S48 5 56 12 S66 23 72 21 S86 8 96 9 S110 6 118 8",
      area: "M2 11 C12 6 20 14 30 9 S48 5 56 12 S66 23 72 21 S86 8 96 9 S110 6 118 8 L118 24 L2 24Z",
      dot: { x: 72, y: 21 },
    } as Sparkline,
  },
  bounced: {
    label: "Bounced",
    chip: "Clean",
    nsfs: "0",
    belowZero: "0",
    /** one block per statement month, true when clean */
    months: [true, true, true, true],
    note: "4 of 4 months clean",
    href: "/deals/APP-7H2K4Q/integrity",
  },
  debt: {
    label: "Existing debt",
    chip: "1 position",
    value: "9.8%",
    /** fill of the bar against the policy maximum */
    percent: 15,
    note: "of revenue · max 65%",
    href: "/deals/APP-7H2K4Q/positions",
  },
};

export const recommendation = {
  title: "Recommendation",
  chip: "Approve",
  amount: 40000,
  requested: 45000,
  floor: 30000,
  ceiling: 48000,
  step: 500,
  reason: "because the August deposit from a related business is excluded.",
  factor: 1.32,
  termMonths: 6,
  /** daily payments over the term (6 months × 21 business days) */
  paymentDays: 126,
  cta: { label: "Open offer builder", href: "/deals/APP-7H2K4Q/offer" },
};

export type ChartView = "rev" | "bal";

export const revenueChart = {
  title: "Revenue & balance",
  subtitle: "From 4 bank statements, June to September 2026",
  views: [
    { value: "rev", label: "Monthly revenue" },
    { value: "bal", label: "Daily balance" },
  ] as { value: ChartView; label: string }[],
  rev: {
    stats: {
      avg: { cap: "Avg true revenue", value: "$61.4K", chip: "3.1% a month" },
      stated: { cap: "Stated on application", value: "$64.0K", hint: "Verified is 4% lower" },
      leftOut: { cap: "Left out of revenue", value: "$12.0K", hint: "Related-business transfer, Aug 14" },
    },
    /** thousands of dollars per month */
    months: [
      { label: "Jun", value: 58.2, text: "$58.2K", vs: "−9% vs stated" },
      { label: "Jul", value: 60.1, text: "$60.1K", vs: "−6%" },
      { label: "Aug", value: 63.5, text: "$63.5K", vs: "−1%" },
      { label: "Sep", value: 63.8, text: "$63.8K", vs: "−0.3%" },
    ],
    stated: 64,
    statedText: "$64K",
    /** y axis labels, in thousands */
    axis: [60, 40, 20, 0],
    trend: "M80 58.7 C140 57 150 55 210 54 S300 46 340 45.8 S430 45 470 45",
    aria: "True revenue by month against $64K stated: June $58.2K, July $60.1K, August $63.5K, September $63.8K",
  },
  bal: {
    stats: {
      avg: { cap: "Avg daily balance", value: "$9.8K", chip: "Steady" },
      low: { cap: "Lowest balance", value: "$1.2K", hint: "Aug 2, after payroll" },
      below: { cap: "Days below zero", value: "0", hint: "No NSFs in 4 months" },
    },
    axis: [20, 15, 10, 5, 0],
    avg: 9800,
    avgText: "Avg $9.8K",
    lowText: "Low $1.2K · Aug 2",
    monthLabels: [
      { label: "Jun", x: 81 },
      { label: "Jul", x: 206 },
      { label: "Aug", x: 333 },
      { label: "Sep", x: 459 },
    ],
    ticks: [144, 269, 397],
    aria: "End-of-day balance from June to September, averaging $9.8K, lowest $1.2K on August 2, never below zero",
  },
};

/**
 * The daily balance series from the prototype's script: 122 days, June 1 to
 * September 30, scaled $0–$20K onto y 200–20, with the payroll dip to
 * $1.2K on day 62 (August 2).
 */
export function balanceSeries() {
  const days = 122, x0 = 20, x1 = 520, yTop = 20, yBot = 200, maxV = 20000;
  const X = (d: number) => x0 + ((x1 - x0) * d) / (days - 1);
  const Y = (v: number) => yBot - ((yBot - yTop) * v) / maxV;
  const vals: number[] = [];
  for (let d = 0; d < days; d++) {
    let v =
      9800 +
      3400 * Math.sin((2 * Math.PI * d) / 14) +
      1300 * Math.sin((2 * Math.PI * d) / 5.3 + 1) +
      900 * Math.sin((2 * Math.PI * d) / 31);
    v -= 8200 * Math.exp(-Math.pow((d - 62) / 2.4, 2));
    vals.push(Math.max(v, 1200));
  }
  vals[62] = 1200;
  const pts = vals.map((v, d) => `${X(d).toFixed(1)} ${Y(v).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  const area = `${line} L${X(days - 1).toFixed(1)} ${yBot} L${x0} ${yBot} Z`;
  return {
    line,
    area,
    avgY: Y(revenueChart.bal.avg),
    min: { x: X(62), y: Y(1200) },
  };
}

/* ---------- Summary tab, bottom half (design/Deal-Summary.html) ---------- */

export type LookItem = { title: string; detail: string; tone: "amber" | "red"; href: string };

export const whatNeedsALook = {
  title: "What needs a look",
  count: "2 items",
  items: [
    {
      title: "$12,000 deposit from a related business",
      detail: "Aug 14 from Harbor Street Catering, same owner. Left out of true revenue.",
      tone: "amber",
      href: "/deals/APP-7H2K4Q/integrity",
    },
    {
      title: "Landlord letter not received",
      detail: "Required by policy before funding. Requested from the broker today.",
      tone: "amber",
      href: "/deals/APP-7H2K4Q/conditions",
    },
  ] as LookItem[],
  clearCap: "Checked and clear",
  clear: ["Statements reconcile", "Owner ID verified", "No sanctions match", "No new UCC filings", "Position disclosed"],
};

export type CheckStatus = { kind: "ok" } | { kind: "warn" } | { kind: "count"; label: string };

export type CheckCard = { label: string; note: string; status: CheckStatus; href: string };

export const checks = {
  title: "Every check at a glance",
  hint: "Open a card for the full detail",
  cards: [
    { label: "Cash flow", note: "Revenue growing 3% a month. No NSFs.", status: { kind: "ok" }, href: "/deals/APP-7H2K4Q/cash-flow" },
    { label: "Positions & debt", note: "Kingsway Capital, $285 daily. Disclosed.", status: { kind: "ok" }, href: "/deals/APP-7H2K4Q/positions" },
    { label: "Integrity", note: "No edits found. One related-party deposit.", status: { kind: "warn" }, href: "/deals/APP-7H2K4Q/integrity" },
    { label: "Business & owners", note: "Active in Maine registry. Owner verified.", status: { kind: "ok" }, href: "/deals/APP-7H2K4Q/business" },
    { label: "Conditions & stips", note: "Landlord letter, signed contract.", status: { kind: "count", label: "2 open" }, href: "/deals/APP-7H2K4Q/conditions" },
    { label: "Stacking Watch", note: "Watching. No new filings or debits.", status: { kind: "ok" }, href: "/stacking" },
  ] as CheckCard[],
};

export type TimelineEvent = { text: string; time: string; dot: "mint" | "amber-light" | "upcoming" };

export const timeline = {
  title: "Timeline",
  link: { label: "All activity", href: "/deals/APP-7H2K4Q/activity" },
  events: [
    { text: "Package from Apex Funding Partners uploaded", time: "09:40", dot: "mint" },
    { text: "Fit check passed, analysis complete", time: "09:41", dot: "mint" },
    { text: "Assigned to Maya Chen", time: "09:42", dot: "mint" },
    { text: "Landlord letter requested from broker", time: "10:05", dot: "amber-light" },
    { text: "Funding call booked for Thursday", time: "Thu 10:00", dot: "upcoming" },
  ] as TimelineEvent[],
};

export const askDeal = {
  title: "Ask about this deal",
  hint: "Answers come from this deal's statements, checks and documents.",
  prompts: ["Why $40K and not $45K?", "Can they afford a second position?", "Draft the landlord letter request"],
};
