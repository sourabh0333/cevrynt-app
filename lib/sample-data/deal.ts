/**
 * Sample data for the deal workspace frame shared by all nine deal tabs,
 * copied from design/prototypes/Deal-Summary.dc.html (look:
 * design/Deal-Summary.html). Real API calls replace this later behind the
 * same types.
 */
import { deals, statusInfo, type DealStatus } from "./submissions";

export type DealHeader = {
  id: string;
  name: string;
  initials: string;
  /** two gradient stops for the 64px tile */
  gradient: [string, string];
  status: DealStatus;
  /** "Bakery · Portland, ME · since 2016 · Owner Elena Brooks" */
  about: string;
  merchantNote: { label: string; href: string };
  score: number | null;
  requested: string;
  recommended: string;
  broker: string;
  underwriter: string;
  decisionDue: { label: string; percent: number };
};

export const dealActions = {
  secondary: ["Request documents", "Decline"],
  primary: "Make a decision",
};

/** The main sample deal, Harbor Street Bakery LLC. */
export const harborStreet: DealHeader = {
  id: "APP-7H2K4Q",
  name: "Harbor Street Bakery LLC",
  initials: "HB",
  gradient: ["#3FA58C", "#8FD9C3"],
  status: "ready",
  about: "Bakery · Portland, ME · since 2016 · Owner Elena Brooks",
  merchantNote: { label: "First deal with you · see merchant", href: "/merchants" },
  score: 88,
  requested: "$45,000",
  recommended: "$40,000",
  broker: "Apex Funding Partners",
  underwriter: "Maya Chen",
  decisionDue: { label: "In 1h 10m", percent: 70 },
};

/**
 * Header data for a deal id. Harbor Street has the full design data; the
 * other deals from the Submissions queue reuse what that list knows about
 * them so every "Open deal" link lands on a real frame. Unknown ids
 * return null (the page shows a 404).
 */
export function getDealHeader(id: string): DealHeader | null {
  if (id === harborStreet.id) return harborStreet;
  const row = deals.find((d) => d.id === id);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    gradient: row.gradient,
    status: row.status,
    about: `${row.broker} · received ${row.received}`,
    merchantNote: { label: "See merchant", href: "/merchants" },
    score: row.score,
    requested: row.requested,
    recommended: row.recommended.replace(/^.*?rec\. /i, ""),
    broker: row.broker,
    underwriter: row.owner?.name ?? "Not assigned yet",
    decisionDue: { label: row.sla, percent: row.slaPercent },
  };
}

export const dealStatusLabel = (status: DealStatus) => statusInfo[status].label;

/** The nine tabs, in design order. `path` is appended to /deals/[id]. */
export type DealTabKey =
  | "summary"
  | "cash-flow"
  | "positions"
  | "integrity"
  | "business"
  | "conditions"
  | "offer"
  | "decision"
  | "activity";

export type DealTab = {
  key: DealTabKey;
  label: string;
  path: string;
  /** small status dot after the label */
  dot?: "teal" | "amber";
  /** open items count after the label */
  count?: number;
  /** browser tab title */
  title: string;
};

export const dealTabs: DealTab[] = [
  { key: "summary", label: "Summary", path: "", title: "Deal summary" },
  { key: "cash-flow", label: "Cash flow", path: "/cash-flow", dot: "teal", title: "Deal cash flow" },
  { key: "positions", label: "Positions & debt", path: "/positions", dot: "teal", title: "Deal positions and debt" },
  { key: "integrity", label: "Integrity", path: "/integrity", dot: "amber", title: "Deal integrity" },
  { key: "business", label: "Business & owners", path: "/business", dot: "teal", title: "Deal business and owners" },
  { key: "conditions", label: "Conditions & stips", path: "/conditions", count: 2, title: "Deal conditions and stips" },
  { key: "offer", label: "Offer & disclosures", path: "/offer", title: "Deal offer and disclosures" },
  { key: "decision", label: "Decision & memo", path: "/decision", title: "Deal decision and memo" },
  { key: "activity", label: "Activity", path: "/activity", title: "Deal activity" },
];

export const dealTabHref = (id: string, tab: DealTab) => `/deals/${id}${tab.path}`;

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
