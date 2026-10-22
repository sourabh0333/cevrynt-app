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
