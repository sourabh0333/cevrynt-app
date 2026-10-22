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
