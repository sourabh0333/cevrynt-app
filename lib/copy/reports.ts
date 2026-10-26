/**
 * Interface wording for Reports (design/Reports.html and its prototype).
 * Every figure is read or worked out from the records (reportsView): each
 * period's funnel and decision time, this month's funding from Offers &
 * funding, renewals from Renewals, the loss rate from Funded deals, broker
 * points from Pricing, the cost per deal from Plan & usage, and the rule
 * values and late-payment target from the policy.
 */
import type { ReportPeriod, ReportSnapshot, RulePerformance } from "@/lib/data/types";
import type { ReportsData } from "@/lib/data/views/reports";
import { moneyK, moneyShort, monthName, percent, plural } from "@/lib/format";
import { hoursAndMinutes } from "./deal";
import { monthFunding } from "./offers";

export const reportsHeader = {
  title: "Reports",
  line: "How the business is doing, in one place",
};

export type Period = ReportPeriod;

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

/** "$1.24M" or "$9.6M" from a million up, "$310K" below. */
export const fundedAmount = (n: number) => (n >= 1_000_000 ? `$${String(Number((n / 1_000_000).toFixed(2)))}M` : moneyShort(n));

const MINUS = "−";
const signed = (n: number, unit: string) => (n === 0 ? "Flat" : `${n > 0 ? "+" : MINUS}${Math.abs(n)}${unit}`);
const pts = (n: number) => (n === 0 ? "Flat" : `${n > 0 ? "+" : MINUS}${plural(Math.abs(n), "pt")}`);
const timeChange = (n: number) => (n === 0 ? "Flat" : `${n > 0 ? "+" : MINUS}${Math.abs(n) < 60 ? `${Math.abs(n)} min` : hoursAndMinutes(Math.abs(n))}`);
const whole = (share: number) => Math.round(share * 100);

/** One key number: label, value, the change pill and whether the change is good (mint) or neutral (grey). */
export type Kpi = { label: string; value: string; delta: string; good: boolean };

export const approvalRate = (s: ReportSnapshot) => s.funnel.approved / s.funnel.reviewed;
export const pullThrough = (s: ReportSnapshot) => s.funnel.funded / s.funnel.submitted;

/** The six key numbers for a period, each against the period before. */
export function kpis(s: ReportSnapshot, d: Pick<ReportsData, "funding" | "lossRate">): Kpi[] {
  const month = monthFunding(d.funding);
  const funded = s.funded ?? month.thisMonth;
  const prevFunded = s.prev.funded ?? month.lastMonth;
  const growth = Math.round((funded / prevFunded - 1) * 100);
  const deals = s.funnel.funded - s.prev.dealsFunded;
  const approval = whole(approvalRate(s)) - whole(s.prev.approvalRate);
  const pull = whole(pullThrough(s)) - whole(s.prev.pullThrough);
  const time = s.decisionMinutes - s.prev.decisionMinutes;
  const loss = s.prev.lossRate === null ? null : Math.round((d.lossRate - s.prev.lossRate) * 1000) / 10;
  return [
    { label: "Funded", value: fundedAmount(funded), delta: signed(growth, "%"), good: growth > 0 },
    { label: "Deals funded", value: String(s.funnel.funded), delta: signed(deals, ""), good: deals > 0 },
    { label: "Approval rate", value: percent(approvalRate(s)), delta: pts(approval), good: approval > 0 },
    { label: "Pull-through", value: percent(pullThrough(s)), delta: pts(pull), good: pull > 0 },
    { label: "Time to decision", value: hoursAndMinutes(s.decisionMinutes), delta: timeChange(time), good: time < 0 },
    { label: "Loss rate", value: percent(d.lossRate, 1), delta: loss === null ? "YTD" : pts(loss), good: loss !== null && loss < 0 },
  ];
}

export type FunnelTone = "teal-ink" | "teal" | "teal-mid" | "teal-soft" | "mint-mid" | "mint";

/** The drawn funnel: each step's top edge as a share of the track, darkest first. */
const funnelShape: { width: number; tone: FunnelTone }[] = [
  { width: 100, tone: "teal-ink" },
  { width: 78, tone: "teal" },
  { width: 70, tone: "teal-mid" },
  { width: 48, tone: "teal-soft" },
  { width: 40, tone: "mint-mid" },
  { width: 34, tone: "mint" },
];

export const funnel = (s: ReportSnapshot) => {
  const f = s.funnel;
  const counts = [f.submitted, f.fitPolicy, f.reviewed, f.approved, f.accepted, f.funded];
  const labels = ["Submitted", "Fit policy", "Reviewed", "Approved", "Offer accepted", "Funded"];
  return {
    title: "From submitted to funded",
    subtitle: "This month",
    endLabel: "end to end",
    kept: (pct: number) => `${pct}% kept`,
    stages: counts.map((count, i) => ({ label: labels[i], count, ...funnelShape[i] })),
    /** bottom edge of the last segment, in % of the track */
    lastBottom: 28,
    note: "Biggest drop is from reviewed to approved. The decline reasons below explain why.",
  };
};

const millions2 = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`;

/** Funded each month, with the renewals inside it, from Offers & funding and Renewals. */
export function fundedMonthly(d: Pick<ReportsData, "funding" | "renewalsByMonth">) {
  const months = d.funding.fundedByMonth.map((m) => ({
    m: monthName(m.month),
    long: monthName(m.month, "long"),
    total: m.amount / 1_000_000,
    renewals: (d.renewalsByMonth.find((r) => r.month === m.month)?.amount ?? 0) / 1_000_000,
  }));
  const [first, last] = [months[0], months[months.length - 1]];
  const best = months.reduce((a, b) => (b.total > a.total ? b : a));
  const share = (x: (typeof months)[number]) => percent(x.renewals / x.total);
  return {
    title: "Funded each month",
    subtitle: `${first.long} to ${last.long}`,
    legend: { newDeals: "New deals", renewals: "Renewals" },
    chartLabel: `Funded volume rising from ${millions2(first.total * 1_000_000)} in ${first.long} to ${millions2(last.total * 1_000_000)} in ${last.long}; renewals grow from ${moneyShort(first.renewals * 1_000_000)} to ${moneyShort(last.renewals * 1_000_000)}`,
    /** $ millions per month */
    months: months.map(({ m, total, renewals }) => ({ m, total, renewals })),
    gridlines: [0.4, 0.8, 1.2],
    tip: { month: last.long, value: fundedAmount(last.total * 1_000_000) },
    facts: [
      { label: `Growth since ${first.m}`, value: `+${Math.round((last.total / first.total - 1) * 100)}%`, good: true },
      { label: "Renewal share", value: `${share(first)} → ${share(last)}` },
      { label: "Best month", value: best.long },
    ] as { label: string; value: string; good?: boolean }[],
  };
}

export type RuleTone = "teal-ink" | "teal" | "red" | "teal-soft" | "mint" | "stone-mid";
export type Verdict = RulePerformance["verdict"];

const ruleLook: Record<RulePerformance["rule"], { reason: string; tone: RuleTone }> = {
  revenue: { reason: "Revenue below minimum", tone: "teal-ink" },
  positions: { reason: "Too many positions", tone: "teal" },
  integrity: { reason: "Fraud or edited documents", tone: "red" },
  age: { reason: "Too young a business", tone: "teal-soft" },
  industry: { reason: "Restricted industry", tone: "mint" },
  debt: { reason: "Other, incl. debt load", tone: "stone-mid" },
};

const viewDeals = { label: "View deals", href: "/submissions" };

/** Declines this month, each traced to its rule, worded with the live policy's values. */
export function declines(month: ReportSnapshot, d: Pick<ReportsData, "book" | "policy">) {
  const p = d.policy;
  const target = Math.round(p.latePaymentTarget * 100);
  const ruleText: Record<RulePerformance["rule"], string> = {
    revenue: `Revenue at least ${moneyShort(p.minMonthlyRevenue)} a month`,
    positions: `No more than ${p.maxPositions} open positions`,
    integrity: "Integrity checks pass",
    age: `At least ${plural(p.minBusinessMonths, "month")} in business`,
    industry: "Industry not restricted",
    debt: `Debt under ${percent(p.maxDebtShare)} of revenue`,
  };
  const action = (r: RulePerformance) => {
    if (r.rule === "positions" && r.simulate !== undefined) return { label: `Simulate ${plural(r.simulate, "position")}`, href: "/settings/policy" };
    if (r.rule === "age" && r.simulate !== undefined) return { label: `Simulate ${plural(r.simulate, "month")}`, href: "/settings/policy" };
    if (r.rule === "debt" && p.draftDebtShare !== null) return { label: `Simulate ${percent(p.draftDebtShare)}`, href: "/settings/policy" };
    return viewDeals;
  };
  return {
    title: "Declines and the rules behind them",
    subtitle: "Each decline traced to the rule that caused it, and how well that rule protects you",
    /** reviewed this month but not approved */
    total: month.funnel.reviewed - month.funnel.approved,
    totalLabel: "declines this month",
    shareLabel: "Share of declines by reason",
    columns: ["Rule", "Deals it declined", `Late payments on deals it passed · target ${target}%`, "Verdict", ""],
    /** the late-payment track runs from 0 to this % */
    trackMax: 6,
    target,
    verdictLabel: { working: "Working", tighten: "Tighten", watch: "Watch", loosen: "Could loosen" } as Record<Verdict, string>,
    rules: d.book.rules.map((r) => ({
      rule: ruleText[r.rule],
      ...ruleLook[r.rule],
      count: r.declined,
      late: Math.round(r.latePassed * 1000) / 10,
      verdict: r.verdict,
      action: action(r),
    })),
    note: "Right of the black line means the rule lets through deals that pay late more often than you want.",
  };
}

export type UnitTone = "ink" | "red-bar" | "red" | "grey-dot" | "teal";

const cents = (n: number) => plural(n, "cent");

/** What every $1 funded earns: the average factor back, less Pricing's broker points, losses and costs. */
export function unitEconomics(d: Pick<ReportsData, "book" | "brokerPoints" | "costPerDeal">) {
  const u = d.book.unit;
  const back = Math.round(u.averageFactor * 100);
  const profit = back - 100 - d.brokerPoints - u.lossCents - u.costCents;
  return {
    title: "What every $1 funded earns",
    subtitle: "Deals finished this year, after commission, losses and costs",
    chip: `${profit}¢ kept per $1`,
    lead: "For every $1 you fund",
    back: `$${u.averageFactor.toFixed(2)}`,
    backNote: "comes back, and you keep",
    keep: `${profit}¢`,
    keepNote: "profit",
    brackets: { principal: "Principal returned", fees: `Fees, ${back - 100}¢` },
    barLabel: `Of $${u.averageFactor.toFixed(2)} repaid: $1.00 principal, ${cents(d.brokerPoints)} commission, ${cents(u.lossCents)} losses, ${cents(u.costCents)} costs, ${cents(profit)} profit`,
    shareNote: (pct: number) => `${pct}% of what comes back`,
    /** cents out of every dollar-and-fees that comes back */
    parts: [
      { label: "Your money back", value: "$1.00", cents: 100, tone: "ink", inBar: "$1.00" },
      { label: "Broker commission", value: `${MINUS}${d.brokerPoints}¢`, cents: d.brokerPoints, tone: "red-bar" },
      { label: "Losses", value: `${MINUS}${u.lossCents}¢`, cents: u.lossCents, tone: "red" },
      { label: "Costs", value: `${MINUS}${u.costCents}¢`, cents: u.costCents, tone: "grey-dot" },
      { label: "Kept as profit", value: `${profit}¢`, cents: profit, tone: "teal", inBar: `${profit}¢`, highlight: true },
    ] as { label: string; value: string; cents: number; tone: UnitTone; inBar?: string; highlight?: boolean }[],
    facts: [
      { label: "Average deal", value: moneyK(u.averageDeal) },
      { label: "Average factor", value: u.averageFactor.toFixed(2) },
      { label: "Average term", value: `${plural(u.averageTermMonths, "month")}` },
      { label: "Cevrynt cost per deal", value: d.costPerDeal },
    ],
  };
}

/** Each person's avatar color on the team table, as the design draws them. */
const avatarOf: Record<string, "sand" | "mint" | "blue"> = { usr_maya: "sand", usr_ari: "sand", usr_jordan: "mint", usr_priya: "blue" };

/** The underwriters' quarter; the highest late rate is marked. */
export function team(d: Pick<ReportsData, "book" | "team">) {
  const highest = Math.max(...d.book.team.map((t) => t.late));
  return {
    title: "Underwriting team",
    subtitle: 'This quarter · "Agrees with Cevrynt" shows how often the person\'s decision matched the suggestion',
    columns: ["Underwriter", "Decided", "Avg time", "Approved", "Agrees with Cevrynt", "Late later"],
    rows: d.book.team.map((t) => {
      const m = d.team.find((x) => x.id === t.memberId);
      return {
        ini: m?.initials ?? "",
        name: m?.name ?? "",
        avatar: avatarOf[t.memberId] ?? "sand",
        decided: t.decided,
        time: hoursAndMinutes(t.medianMinutes),
        approved: percent(t.approved),
        agrees: whole(t.agrees),
        late: percent(t.late, 1),
        lateHigh: t.late === highest,
      };
    }),
  };
}

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
