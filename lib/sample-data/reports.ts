/**
 * Sample data for the Reports page, copied from
 * design/prototypes/Reports.dc.html (look: design/Reports.html).
 * Real API calls replace this later behind the same types.
 */

export const reportsHeader = {
  title: "Reports",
  line: "How the business is doing, in one place",
};

export type Period = "week" | "month" | "quarter" | "year";

export const periodSwitch = {
  label: "Period",
  start: "month" as Period,
  options: [
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "This quarter" },
    { value: "year", label: "This year" },
  ] as { value: Period; label: string }[],
  schedule: "Schedule",
  export: "Export PDF",
};

/** One key number: label, value, the change pill and whether the change is good (mint) or neutral (grey). */
export type Kpi = { label: string; value: string; delta: string; good: boolean };

const kpi = (label: string, value: string, delta: string, good: 0 | 1): Kpi => ({ label, value, delta, good: good === 1 });

export const kpisByPeriod: Record<Period, Kpi[]> = {
  week: [kpi("Funded", "$310K", "+8%", 1), kpi("Deals funded", "11", "+2", 1), kpi("Approval rate", "41%", "Flat", 0), kpi("Pull-through", "13%", "+1 pt", 1), kpi("Time to decision", "3h 12m", "−20 min", 1), kpi("Loss rate", "2.1%", "YTD", 0)],
  month: [kpi("Funded", "$1.24M", "+12%", 1), kpi("Deals funded", "41", "+6", 1), kpi("Approval rate", "41%", "+2 pts", 1), kpi("Pull-through", "13%", "Flat", 0), kpi("Time to decision", "3h 12m", "−35 min", 1), kpi("Loss rate", "2.1%", "YTD", 0)],
  quarter: [kpi("Funded", "$3.28M", "+18%", 1), kpi("Deals funded", "112", "+14", 1), kpi("Approval rate", "41%", "+3 pts", 1), kpi("Pull-through", "13%", "+1 pt", 1), kpi("Time to decision", "3h 30m", "−50 min", 1), kpi("Loss rate", "2.1%", "−0.4 pts", 1)],
  year: [kpi("Funded", "$9.6M", "+31%", 1), kpi("Deals funded", "338", "+71", 1), kpi("Approval rate", "39%", "+4 pts", 1), kpi("Pull-through", "12%", "+2 pts", 1), kpi("Time to decision", "4h 05m", "−1h 40m", 1), kpi("Loss rate", "2.1%", "−0.6 pts", 1)],
};

/** Sparkline points per tile, in the same order as the key numbers. */
export const sparksByPeriod: Record<Period, number[][]> = {
  week: [[3, 4, 3.5, 5, 6], [2, 3, 3, 4, 5], [5, 5, 5, 5, 5], [4, 4, 5, 5, 5], [6, 5, 5, 4, 3], [5, 5, 5, 5, 5]],
  month: [[3, 3.5, 4, 4.6, 6], [3, 3.4, 4, 4.5, 5.5], [3.6, 3.8, 4, 4.4, 4.6], [4, 4.3, 4, 4.2, 4.2], [6, 5.5, 5, 4.4, 3.8], [5.2, 5, 4.8, 4.6, 4.5]],
  quarter: [[2, 3, 3.6, 4.4, 6], [2, 3, 3.8, 4.4, 5.6], [3, 3.5, 4, 4.4, 4.8], [3.5, 3.8, 4, 4.3, 4.6], [6.4, 5.6, 5, 4.4, 3.6], [5.6, 5.2, 5, 4.6, 4.4]],
  year: [[1, 2, 3, 4.5, 6], [1.5, 2.5, 3.4, 4.6, 6], [3, 3.4, 3.8, 4.2, 4.8], [3, 3.6, 4, 4.4, 4.8], [6.6, 5.8, 5, 4.2, 3.4], [6, 5.4, 5, 4.6, 4.2]],
};

export type FunnelTone = "teal-ink" | "teal" | "teal-mid" | "teal-soft" | "mint-mid" | "mint";

export const funnel = {
  title: "From submitted to funded",
  subtitle: "This month",
  endLabel: "end to end",
  kept: (pct: number) => `${pct}% kept`,
  /** width is the drawn width of the segment's top edge, in % of the track */
  stages: [
    { label: "Submitted", count: 312, width: 100, tone: "teal-ink" },
    { label: "Fit policy", count: 196, width: 78, tone: "teal" },
    { label: "Reviewed", count: 168, width: 70, tone: "teal-mid" },
    { label: "Approved", count: 69, width: 48, tone: "teal-soft" },
    { label: "Offer accepted", count: 52, width: 40, tone: "mint-mid" },
    { label: "Funded", count: 41, width: 34, tone: "mint" },
  ] as { label: string; count: number; width: number; tone: FunnelTone }[],
  /** bottom edge of the last segment, in % of the track */
  lastBottom: 28,
  note: "Biggest drop is from reviewed to approved. The decline reasons below explain why.",
};

export type RuleTone = "teal-ink" | "teal" | "red" | "teal-soft" | "mint" | "stone-mid";
export type Verdict = "working" | "tighten" | "watch" | "loosen";

export const declines = {
  title: "Declines and the rules behind them",
  subtitle: "Each decline traced to the rule that caused it, and how well that rule protects you",
  total: 99,
  totalLabel: "declines this month",
  shareLabel: "Share of declines by reason",
  columns: ["Rule", "Deals it declined", "Late payments on deals it passed · target 3%", "Verdict", ""],
  /** the late-payment track runs from 0 to this % */
  trackMax: 6,
  target: 3,
  verdictLabel: { working: "Working", tighten: "Tighten", watch: "Watch", loosen: "Could loosen" } as Record<Verdict, string>,
  rules: [
    { rule: "Revenue at least $15K a month", reason: "Revenue below minimum", count: 31, late: 2.0, tone: "teal-ink", verdict: "working", action: { label: "View deals", href: "/submissions" } },
    { rule: "No more than 2 open positions", reason: "Too many positions", count: 24, late: 4.6, tone: "teal", verdict: "tighten", action: { label: "Simulate 1 position", href: "/settings/policy" } },
    { rule: "Integrity checks pass", reason: "Fraud or edited documents", count: 14, late: 0.9, tone: "red", verdict: "working", action: { label: "View deals", href: "/submissions" } },
    { rule: "At least 6 months in business", reason: "Too young a business", count: 12, late: 3.1, tone: "teal-soft", verdict: "watch", action: { label: "Simulate 9 months", href: "/settings/policy" } },
    { rule: "Industry not restricted", reason: "Restricted industry", count: 10, late: 2.2, tone: "mint", verdict: "working", action: { label: "View deals", href: "/submissions" } },
    { rule: "Debt under 65% of revenue", reason: "Other, incl. debt load", count: 8, late: 1.4, tone: "stone-mid", verdict: "loosen", action: { label: "Simulate 70%", href: "/settings/policy" } },
  ] as { rule: string; reason: string; count: number; late: number; tone: RuleTone; verdict: Verdict; action: { label: string; href: string } }[],
  note: "Right of the black line means the rule lets through deals that pay late more often than you want.",
};

export type UnitTone = "ink" | "red-bar" | "red" | "grey-dot" | "teal";

export const unitEconomics = {
  title: "What every $1 funded earns",
  subtitle: "Deals finished this year, after commission, losses and costs",
  chip: "20¢ kept per $1",
  lead: "For every $1 you fund",
  back: "$1.32",
  backNote: "comes back, and you keep",
  keep: "20¢",
  keepNote: "profit",
  brackets: { principal: "Principal returned", fees: "Fees, 32¢" },
  barLabel: "Of $1.32 repaid: $1.00 principal, 8 cents commission, 3 cents losses, 1 cent costs, 20 cents profit",
  shareNote: (pct: number) => `${pct}% of what comes back`,
  /** cents out of every 132 that come back */
  parts: [
    { label: "Your money back", value: "$1.00", cents: 100, tone: "ink", inBar: "$1.00" },
    { label: "Broker commission", value: "−8¢", cents: 8, tone: "red-bar" },
    { label: "Losses", value: "−3¢", cents: 3, tone: "red" },
    { label: "Costs", value: "−1¢", cents: 1, tone: "grey-dot" },
    { label: "Kept as profit", value: "20¢", cents: 20, tone: "teal", inBar: "20¢", highlight: true },
  ] as { label: string; value: string; cents: number; tone: UnitTone; inBar?: string; highlight?: boolean }[],
  facts: [
    { label: "Average deal", value: "$30.2K" },
    { label: "Average factor", value: "1.32" },
    { label: "Average term", value: "6.4 months" },
    { label: "Cevrynt cost per deal", value: "$5.20" },
  ],
};

export const team = {
  title: "Underwriting team",
  subtitle: 'This quarter · "Agrees with Cevrynt" shows how often the person\'s decision matched the suggestion',
  columns: ["Underwriter", "Decided", "Avg time", "Approved", "Agrees with Cevrynt", "Late later"],
  rows: [
    { ini: "MC", name: "Maya Chen", avatar: "sand", decided: 112, time: "2h 50m", approved: "44%", agrees: 91, late: "1.8%", lateHigh: false },
    { ini: "AK", name: "Ari Kaplan", avatar: "sand", decided: 98, time: "3h 40m", approved: "38%", agrees: 84, late: "2.9%", lateHigh: true },
    { ini: "JR", name: "Jordan Reyes", avatar: "mint", decided: 87, time: "3h 05m", approved: "43%", agrees: 88, late: "2.0%", lateHigh: false },
    { ini: "PS", name: "Priya Shah", avatar: "blue", decided: 41, time: "2h 10m", approved: "36%", agrees: 93, late: "1.2%", lateHigh: false },
  ] as { ini: string; name: string; avatar: "sand" | "mint" | "blue"; decided: number; time: string; approved: string; agrees: number; late: string; lateHigh: boolean }[],
};

export const scheduled = {
  title: "Sent automatically",
  add: "+ New",
  items: [
    { day: "MON", title: "Weekly pipeline", sub: "To the leadership team · 8:00" },
    { day: "1ST", title: "Portfolio report for capital partners", sub: "Monthly · PDF" },
    { day: "FRI", title: "Broker scorecards", sub: "To each broker · their own score only" },
  ],
};

export const library = {
  title: "Report library",
  subtitle: "Ready-made reports. Open, adjust, save.",
  /** href only where the page exists today */
  items: [
    { title: "Portfolio health", sub: "Collections, late payments, losses", href: "/funded" },
    { title: "Deals by funding month", sub: "How each month's deals pay back" },
    { title: "Broker performance", sub: "Volume, quality, commission", href: "/brokers" },
    { title: "Disclosures sent", sub: "Every cost disclosure, by state" },
    { title: "Stacking and fraud", sub: "Alerts, outcomes, money saved", href: "/stacking" },
    { title: "Renewals", sub: "Who renewed and who left", href: "/renewals" },
  ] as { title: string; sub: string; href?: string }[],
};

export const fundedMonthly = {
  title: "Funded each month",
  subtitle: "May to October",
  legend: { newDeals: "New deals", renewals: "Renewals" },
  chartLabel: "Funded volume rising from $0.78M in May to $1.24M in October; renewals grow from $160K to $380K",
  /** $ millions per month */
  months: [
    { m: "May", total: 0.78, renewals: 0.16 },
    { m: "Jun", total: 0.86, renewals: 0.19 },
    { m: "Jul", total: 0.91, renewals: 0.24 },
    { m: "Aug", total: 0.99, renewals: 0.26 },
    { m: "Sep", total: 1.05, renewals: 0.3 },
    { m: "Oct", total: 1.24, renewals: 0.38 },
  ],
  gridlines: [0.4, 0.8, 1.2],
  tip: { month: "October", value: "$1.24M" },
  facts: [
    { label: "Growth since May", value: "+59%", good: true },
    { label: "Renewal share", value: "21% → 31%" },
    { label: "Best month", value: "October" },
  ] as { label: string; value: string; good?: boolean }[],
};
