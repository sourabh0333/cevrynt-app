/**
 * Sample data for the Funded deals page, copied from
 * design/prototypes/Funded.dc.html (look: design/Funded.html).
 * Real API calls replace this later behind the same types.
 */

export const fundedHeader = {
  title: "Funded deals",
  line: "86 advances being repaid · $4.9M still to collect",
};

export const today = {
  title: "Today's payments",
  subtitle: "Daily and weekly debits due today across your book",
  chip: "Settles by 5:00 pm",
  collectedLabel: "Collected so far",
  collected: "$24.1K",
  expected: "of $28.4K expected · 81 payments",
  /** bar segments in hundreds of dollars: cleared, pending, returned */
  segments: { cleared: 241, pending: 34, returned: 9 },
  tiles: [
    { label: "Cleared", value: "72", tone: "cleared" },
    { label: "Still pending", value: "7", tone: "pending" },
    { label: "Returned", value: "2 · $870", tone: "returned" },
  ] as { label: string; value: string; tone: "cleared" | "pending" | "returned" }[],
};

export const fundedStats = [
  { label: "Collected in October", value: "$287K", note: "98% of schedule", tone: "grey", noteTone: "good" },
  { label: "On time", value: "94%", note: "81 of 86 deals", tone: "grey" },
  { label: "Behind on payments", value: "5", note: "$118K at risk", tone: "red" },
  { label: "Paid off this month", value: "11", note: "6 renewed with you", tone: "cream", noteTone: "warn" },
] as { label: string; value: string; note: string; tone: "grey" | "red" | "cream"; noteTone?: "good" | "warn" }[];

export type PayStatus = "ok" | "slow" | "late" | "soon" | "new";
/** one character per payment: c cleared, r returned, s slow, n not yet due */
export type PayMark = "c" | "r" | "s" | "n";
export type FlagTone = "g" | "a" | "r" | "n";

export type FundedDeal = {
  ini: string;
  g: [string, string];
  name: string;
  funded: string;
  when: string;
  broker: string;
  paid: number;
  left: string;
  pay: string;
  hist: string;
  rev: string;
  status: PayStatus;
  payoff: string;
  /** daily revenue as a share of the level at funding */
  trend: number[];
  flag: string;
  flagTone: FlagTone;
  action: string;
};

export const statuses: Record<PayStatus, string> = { ok: "On time", slow: "Slow", late: "Behind", soon: "Almost paid", new: "Just funded" };

export const bookSegments: { key: PayStatus | "all"; label: string; count: number; dot: string; onDot?: string }[] = [
  { key: "all", label: "All", count: 86, dot: "bg-ink", onDot: "bg-mint" },
  { key: "ok", label: "On time", count: 70, dot: "bg-teal" },
  { key: "slow", label: "Slow", count: 6, dot: "bg-amber" },
  { key: "late", label: "Behind", count: 5, dot: "bg-red" },
  { key: "soon", label: "Almost paid", count: 5, dot: "bg-blue" },
];

export const book = {
  title: "Your book",
  search: { label: "Search funded deals", placeholder: "Merchant or APP ID" },
  columns: ["Merchant", "Repaid", "Payment", "Last 10 payments", "Revenue now", "Status"],
  left: (amount: string) => `${amount} left`,
  empty: "No deals match.",
  startSelected: "KP",
};

export const detail = {
  funded: (amount: string, when: string, broker: string) => `${amount} funded ${when} · ${broker}`,
  labels: { left: "Left to collect", payoff: "Expected payoff", chart: "Daily revenue since funding" },
  trend: {
    down: "Below the level at funding (dashed line).",
    up: "Above the level at funding (dashed line).",
    flat: "Close to the level at funding (dashed line).",
    label: (name: string) => `Daily revenue compared with the level at funding for ${name}`,
  },
  open: "Open",
};

export const warnings = {
  title: "Early warnings",
  subtitle: "Spotted before a payment is missed",
  chip: "4 new",
  items: [
    { who: "Granite State Builders", what: "took a new advance", detail: "Funder deposit $35K seen yesterday", tone: "red", href: "/stacking" },
    { who: "Kestrel Plumbing", what: "deposits down 22%", detail: "Last 3 weeks vs funding month", tone: "amber", href: "#book" },
    { who: "Westfield Auto Group", what: "balance below $500", detail: "3 of the last 5 days", tone: "amber", href: "#book" },
    { who: "Rivera Landscaping", what: "changed bank account", detail: "Payments now going to a new account", tone: "red", href: "#book" },
  ] as { who: string; what: string; detail: string; tone: "red" | "amber"; href: string }[],
};

export const vintages = {
  title: "How each month's deals perform",
  subtitle: "Share collected so far, by month funded",
  months: [
    { label: "May", percent: 96, color: "teal-ink" },
    { label: "Jun", percent: 81, color: "teal" },
    { label: "Jul", percent: 62, color: "teal-mid" },
    { label: "Aug", percent: 44, color: "teal-soft" },
    { label: "Sep", percent: 22, color: "mint" },
  ] as { label: string; percent: number; color: "teal-ink" | "teal" | "teal-mid" | "teal-soft" | "mint" }[],
  note: { label: "Every month is at or ahead of plan", result: "On track" },
};

export const reconciliation = {
  title: "Reconciliation requests",
  subtitle: "Merchants asking to pay less because sales fell",
  chip: "Coming soon",
  request: { name: "Kestrel Plumbing", detail: "Asked yesterday · sales down 22%", days: "4 days", daysLabel: "to respond" },
  note: "Soon: Cevrynt works out the fair new payment from bank data and keeps proof that you replied on time.",
  cta: { label: "See what's coming", href: "/whats-coming" },
};

export const forecast = {
  title: "Money coming in",
  subtitle: "Expected collections for the next 6 weeks, from the payment schedules",
  legend: { expected: "Expected", atRisk: "At risk" },
  chartLabel: "Expected weekly collections falling from $142K to $118K over six weeks as advances pay off, with $4K to $7K a week at risk",
  /** column heights in px from the design's 150px chart */
  weeks: [
    { label: "Oct 13", value: "$142K", bar: 130, cap: 12 },
    { label: "Oct 20", value: "$139K", bar: 124, cap: 15 },
    { label: "Oct 27", value: "$137K", bar: 122, cap: 15 },
    { label: "Nov 3", value: "$131K", bar: 113, cap: 18 },
    { label: "Nov 10", value: "$126K", bar: 108, cap: 18 },
    { label: "Nov 17", value: "$118K", bar: 97, cap: 21 },
  ],
  tiles: [
    { label: "Next 6 weeks", value: "$793K" },
    { label: "At risk", value: "$33K", warn: true },
    { label: "Why it falls", value: "Advances paying off", small: true },
  ] as { label: string; value: string; warn?: boolean; small?: boolean }[],
};

export const returnedPayments = {
  title: "Returned payments",
  subtitle: "This week, with what happens next",
  chip: "7 · $3.1K",
  items: [
    { name: "Westfield Auto Group", detail: "$628 · not enough money", status: "Retry Thu", tone: "amber" },
    { name: "Kestrel Plumbing", detail: "$412 · not enough money", status: "Retry cleared", tone: "green" },
    { name: "Rivera Landscaping", detail: "$458 · payment blocked by merchant", status: "Needs a call", tone: "red" },
  ] as { name: string; detail: string; status: string; tone: "amber" | "green" | "red" }[],
  note: "Retries follow bank rules: no more than two tries per payment.",
};

export const recovery = {
  title: "Getting deals back on track",
  subtitle: "Deals behind on payments, by step",
  link: { label: "Open collections", href: "/funded#book" },
  stages: [
    { n: "01", label: "Behind", count: "2", note: "$46K", tone: "red" },
    { n: "02", label: "Contacted", count: "1", note: "$31K", tone: "plain" },
    { n: "03", label: "Payment plan", count: "2", note: "$41K", tone: "plain" },
    { n: "04", label: "Back on track", count: "4", note: "this quarter", tone: "mint" },
    { n: "05", label: "Written off", count: "1", note: "$22K this year", tone: "dashed" },
  ] as { n: string; label: string; count: string; note: string; tone: "red" | "plain" | "mint" | "dashed" }[],
  note: "Payment plans lower the daily amount for a set time. Every change is logged and the merchant signs it.",
};

export const returns = {
  title: "Returns this year",
  subtitle: "On deals that have finished",
  tiles: [
    { label: "Collected per $1 funded", value: "$1.27", good: true },
    { label: "Loss rate", value: "2.1%" },
    { label: "Written off", value: "$46K" },
    { label: "Commission clawed back", value: "$3.2K" },
  ] as { label: string; value: string; good?: boolean }[],
  note: "Clawbacks: brokers return commission when a deal fails early.",
};

export const payingOff = {
  title: "Paying off in the next 30 days",
  text: "7 merchants, $210K of advances ending. The best time to offer a renewal is before they finish.",
  merchants: [
    { ini: "CD", g: ["#24588A", "#4F86BD"], name: "Coastal Dental", when: "Nov" },
    { ini: "OD", g: ["#8A5A2B", "#B98552"], name: "Oakview Deli", when: "Dec" },
    { ini: "+5", g: ["#57418A", "#8670B8"], name: "5 more" },
  ] as { ini: string; g: [string, string]; name: string; when?: string }[],
  cta: { label: "Go to Renewals", href: "/renewals" },
};

export const fundedDeals: FundedDeal[] = [
  { ini: "CD", g: ["#24588A", "#4F86BD"], name: "Coastal Dental Group", funded: "$70K", when: "Apr 2026", broker: "Apex Funding", paid: 72, left: "$25.5K", pay: "$430/day", hist: "cccccccccc", rev: "+18%", status: "soon", payoff: "Late November", trend: [1, 1.02, 1.05, 1.08, 1.12, 1.15, 1.18], flag: "Ready to renew. $80K renewal already accepted.", flagTone: "g", action: "Open renewal" },
  { ini: "KP", g: ["#2C5F73", "#5A90A6"], name: "Kestrel Plumbing", funded: "$45K", when: "Jul 2026", broker: "Keystone", paid: 48, left: "$31.2K", pay: "$412/day", hist: "ccccccrccs", rev: "−22%", status: "slow", payoff: "Late January", trend: [1, 1.03, 0.98, 0.95, 0.88, 0.82, 0.78], flag: "Deposits down 22% and one payment returned this week. A reconciliation request came in yesterday.", flagTone: "a", action: "Call the merchant" },
  { ini: "WA", g: ["#4D6B2E", "#7FA05A"], name: "Westfield Auto Group", funded: "$70K", when: "Aug 2026", broker: "Summit Capital", paid: 21, left: "$72.6K", pay: "$628/day", hist: "cccrcrccrr", rev: "−9%", status: "late", payoff: "At risk", trend: [1, 0.98, 0.96, 0.93, 0.92, 0.91, 0.91], flag: "Three returned payments in the last 10. Balance below $500 on 3 of 5 days.", flagTone: "r", action: "Start a payment plan" },
  { ini: "OD", g: ["#8A5A2B", "#B98552"], name: "Oakview Deli", funded: "$30K", when: "May 2026", broker: "Apex Funding", paid: 64, left: "$14.3K", pay: "$305/day", hist: "cccccccccc", rev: "+4%", status: "ok", payoff: "Early December", trend: [1, 1.01, 0.99, 1.02, 1.03, 1.04, 1.04], flag: "Steady. Renewal offer sent last week.", flagTone: "g", action: "Open renewal" },
  { ini: "GS", g: ["#7A4A2A", "#B07A52"], name: "Granite State Builders", funded: "$62K", when: "Sep 2026", broker: "BlueRock", paid: 18, left: "$68.1K", pay: "$525/day", hist: "cccccccccc", rev: "+2%", status: "late", payoff: "Watch", trend: [1, 1.01, 1.0, 1.02, 1.01, 1.02, 1.02], flag: "A new $35K advance from another funder landed yesterday. Payments still clearing, but debt load has doubled.", flagTone: "r", action: "Review stacking" },
  { ini: "CS", g: ["#0A5E50", "#2F8F7A"], name: "Cedar Street Pharmacy", funded: "$60K", when: "today", broker: "Apex Funding", paid: 0, left: "$79.2K", pay: "$629/day", hist: "nnnnnnnnnn", rev: "—", status: "new", payoff: "April 2027", trend: [1, 1, 1, 1, 1, 1, 1], flag: "First payment on Wednesday.", flagTone: "n", action: "View schedule" },
];

/**
 * The revenue chart's geometry from the prototype: a 280×70 box, seven
 * points, the level at funding (1.0) as the dashed baseline.
 */
export function trendPaths(trend: number[]) {
  const X = (i: number) => 6 + i * (268 / 6);
  const Y = (v: number) => 64 - ((v - 0.7) / 0.55) * 56;
  const pts = trend.map((v, i) => `${X(i).toFixed(1)} ${Y(v).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  const last = trend[trend.length - 1];
  return {
    line,
    area: `${line} L${X(trend.length - 1).toFixed(1)} 70 L${X(0).toFixed(1)} 70 Z`,
    baseY: Y(1).toFixed(1),
    direction: last < 0.97 ? "down" : last > 1.03 ? "up" : "flat",
  } as const;
}
