/**
 * Interface wording for Funded deals (design/Funded.html and its
 * prototype). The advances and the book come from the data layer
 * (fundedView); this file words them: amounts left, repaid shares, the
 * last ten payments, payoff months, and the cards under the book. Home's
 * "collected today" tile uses the same wording for the same figures.
 */
import type { Advance, AdvanceStatus, FundedBook, IsoDateTime, Merchant, PaymentMark } from "@/lib/data/types";
import { clock12, dayLabel, daysBetween, money, moneyK, moneyShort, monthName, monthYear, percent, plural, weekdayShort } from "@/lib/format";

const millions1 = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;
const signedPercent = (x: number) => `${x >= 0 ? "+" : "−"}${Math.round(Math.abs(x) * 100)}%`;

/** Advances being repaid, all statuses together. */
export const activeCount = (b: Pick<FundedBook, "counts">) => Object.values(b.counts).reduce((n, c) => n + c, 0);

export const fundedHeader = {
  title: "Funded deals",
  line: (b: FundedBook) => `${activeCount(b)} advances being repaid · ${millions1(b.outstanding)} still to collect`,
};

/** Today's payments: collected so far against what's expected. Home's tile reads the same. */
export const todayTotals = (b: FundedBook) => {
  const t = b.today;
  const expected = t.cleared.amount + t.pending.amount + t.returned.amount;
  return {
    collected: t.cleared.amount,
    expected,
    payments: t.cleared.count + t.pending.count + t.returned.count,
    share: t.cleared.amount / expected,
  };
};

export const todayCopy = {
  title: "Today's payments",
  subtitle: "Daily and weekly debits due today across your book",
  chip: (settleBy: IsoDateTime) => `Settles by ${clock12(settleBy)}`,
  collectedLabel: "Collected so far",
  collected: (b: FundedBook) => moneyK(todayTotals(b).collected),
  expected: (b: FundedBook) => `of ${moneyK(todayTotals(b).expected)} expected · ${todayTotals(b).payments} payments`,
  /** "$24.1K of $28.4K collected today", as Home's tile says it */
  homeLine: (b: FundedBook) => `${moneyK(todayTotals(b).collected)} of ${moneyK(todayTotals(b).expected)} collected today`,
  barLabel: "Cleared, pending and returned today",
  /** each bar segment's width, in hundreds of dollars */
  segment: (amount: number) => Math.round(amount / 100),
  tiles: (b: FundedBook) =>
    [
      { label: "Cleared", value: String(b.today.cleared.count), tone: "cleared" },
      { label: "Still pending", value: String(b.today.pending.count), tone: "pending" },
      { label: "Returned", value: `${b.today.returned.count} · ${money(b.today.returned.amount)}`, tone: "returned" },
    ] as { label: string; value: string; tone: "cleared" | "pending" | "returned" }[],
};

/** The four tiles beside today's payments. */
export const fundedStats = (b: FundedBook, now: IsoDateTime) => {
  const active = activeCount(b);
  const onTime = active - b.counts.late;
  return [
    { label: `Collected in ${monthName(now.slice(0, 7), "long")}`, value: moneyShort(b.collectedThisMonth), note: `${percent(b.ofSchedule)} of schedule`, tone: "grey", noteTone: "good" },
    { label: "On time", value: percent(onTime / active), note: `${onTime} of ${plural(active, "deal")}`, tone: "grey" },
    { label: "Behind on payments", value: String(b.counts.late), note: `${moneyShort(b.atRisk)} at risk`, tone: "red" },
    { label: "Paid off this month", value: String(b.paidOffThisMonth), note: `${b.renewedWithYou} renewed with you`, tone: "cream", noteTone: "warn" },
  ] as { label: string; value: string; note: string; tone: "grey" | "red" | "cream"; noteTone?: "good" | "warn" }[];
};

export const statuses: Record<AdvanceStatus, string> = { ok: "On time", slow: "Slow", late: "Behind", soon: "Almost paid", new: "Just funded" };

export const bookSegments = (b: FundedBook): { key: AdvanceStatus | "all"; label: string; count: number; dot: string; onDot?: string }[] => [
  { key: "all", label: "All", count: activeCount(b), dot: "bg-ink", onDot: "bg-mint" },
  { key: "ok", label: "On time", count: b.counts.ok, dot: "bg-teal" },
  { key: "slow", label: "Slow", count: b.counts.slow, dot: "bg-amber" },
  { key: "late", label: "Behind", count: b.counts.late, dot: "bg-red" },
  { key: "soon", label: "Almost paid", count: b.counts.soon, dot: "bg-blue" },
];

/** One character per payment, as the row's dots read them. */
export type PayMark = "c" | "r" | "s" | "n";
const markOf: Record<PaymentMark, PayMark> = { cleared: "c", returned: "r", slow: "s", upcoming: "n" };

const payoffPart = { early: "Early", late: "Late" };
const nextAction: Record<Advance["next"], string> = {
  renewal: "Open renewal",
  call: "Call the merchant",
  plan: "Start a payment plan",
  stacking: "Review stacking",
  schedule: "View schedule",
};
const flagTone = { good: "g", watch: "a", risk: "r", none: "n" } as const;
export type FlagTone = (typeof flagTone)[keyof typeof flagTone];

/** An advance as the book and the detail panel show it. */
export type AdvanceView = {
  id: string;
  ini: string;
  g: [string, string];
  name: string;
  funded: string;
  when: string;
  broker: string;
  paid: number;
  left: string;
  pay: string;
  hist: PayMark[];
  rev: string;
  status: AdvanceStatus;
  payoff: string;
  trend: number[];
  flag: string;
  flagTone: FlagTone;
  action: string;
};

export const advanceView = (a: Advance & { merchant: Merchant }, now: IsoDateTime): AdvanceView => ({
  id: a.id,
  ini: a.merchant.initials,
  g: a.merchant.colors,
  name: a.merchant.name,
  funded: moneyShort(a.amount),
  when: daysBetween(a.fundedAt, now) === 0 ? "today" : monthYear(a.fundedAt),
  broker: a.broker,
  paid: Math.round((a.paid / a.payback) * 100),
  left: moneyK(a.payback - a.paid),
  pay: `${money(a.dailyPayment)}/day`,
  hist: a.lastPayments.map((m) => markOf[m]),
  rev: a.revenueChange === null ? "—" : signedPercent(a.revenueChange),
  status: a.status,
  payoff:
    a.payoff.kind === "at-risk"
      ? "At risk"
      : a.payoff.kind === "watch"
        ? "Watch"
        : a.payoff.part
          ? `${payoffPart[a.payoff.part]} ${monthName(a.payoff.month, "long")}`
          : `${monthName(a.payoff.month, "long")} ${a.payoff.month.slice(0, 4)}`,
  trend: a.trend,
  flag: a.flag.text,
  flagTone: flagTone[a.flag.tone],
  action: nextAction[a.next],
});

/** The deal the detail panel opens on: the first one that needs a look. */
export const startSelected = (list: Advance[]) => (list.find((a) => a.status === "slow" || a.status === "late") ?? list[0])?.id ?? "";

export const bookCopy = {
  title: "Your book",
  search: { label: "Search funded deals", placeholder: "Merchant or APP ID" },
  showLabel: "Show",
  columns: ["Merchant", "Repaid", "Payment", "Last 10 payments", "Revenue now", "Status"],
  left: (amount: string) => `${amount} left`,
  lastPayments: (returned: number) => `Last 10 payments: ${returned} returned`,
  empty: "No deals match.",
};

export const detailCopy = {
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

export const warningsCopy = {
  title: "Early warnings",
  subtitle: "Spotted before a payment is missed",
  chip: (n: number) => `${n} new`,
  href: { stacking: "/stacking", book: "#book" } as Record<FundedBook["warnings"][number]["opens"], string>,
};

const vintageColors = ["teal-ink", "teal", "teal-mid", "teal-soft", "mint"] as const;

export const vintagesCopy = {
  title: "How each month's deals perform",
  subtitle: "Share collected so far, by month funded",
  months: (b: FundedBook) =>
    b.vintages.map((v, i) => ({ label: monthName(v.month), percent: Math.round(v.collected * 100), color: vintageColors[Math.min(i, vintageColors.length - 1)] })),
  note: (onPlan: boolean) => (onPlan ? { label: "Every month is at or ahead of plan", result: "On track" } : { label: "Some months are behind plan", result: "Behind" }),
};

export const reconciliationCopy = {
  title: "Reconciliation requests",
  subtitle: "Merchants asking to pay less because sales fell",
  chip: "Coming soon",
  detail: (r: FundedBook["reconciliation"], now: IsoDateTime) =>
    `Asked ${dayLabel(r.askedAt, now).toLowerCase()} · sales ${r.salesChange < 0 ? "down" : "up"} ${percent(Math.abs(r.salesChange))}`,
  days: (r: FundedBook["reconciliation"], now: IsoDateTime) => plural(daysBetween(now, r.respondBy), "day"),
  daysLabel: "to respond",
  note: "Soon: Cevrynt works out the fair new payment from bank data and keeps proof that you replied on time.",
  cta: { label: "See what's coming", href: "/whats-coming" },
};

export const forecastCopy = {
  title: "Money coming in",
  subtitle: "Expected collections for the next 6 weeks, from the payment schedules",
  legend: { expected: "Expected", atRisk: "At risk" },
  chartLabel: (b: FundedBook) => {
    const f = b.forecast;
    const risks = f.map((w) => w.atRisk);
    return `Expected weekly collections falling from ${moneyShort(f[0].expected)} to ${moneyShort(f[f.length - 1].expected)} over six weeks as advances pay off, with ${moneyShort(Math.min(...risks))} to ${moneyShort(Math.max(...risks))} a week at risk`;
  },
  week: (w: FundedBook["forecast"][number]) => ({ label: `${monthName(w.weekOf.slice(0, 7))} ${Number(w.weekOf.slice(8, 10))}`, value: moneyShort(w.expected), bar: w.height, cap: (w.atRisk / 1000) * 3 }),
  tiles: (b: FundedBook) =>
    [
      { label: `Next ${plural(b.forecast.length, "week")}`, value: moneyShort(b.forecast.reduce((n, w) => n + w.expected, 0)) },
      { label: "At risk", value: moneyShort(b.forecast.reduce((n, w) => n + w.atRisk, 0)), warn: true },
      { label: "Why it falls", value: "Advances paying off", small: true },
    ] as { label: string; value: string; warn?: boolean; small?: boolean }[],
};

const returnReason = { funds: "not enough money", blocked: "payment blocked by merchant" };

export const returnedCopy = {
  title: "Returned payments",
  subtitle: "This week, with what happens next",
  chip: (b: FundedBook) => `${b.returnedThisWeek.count} · ${moneyShort(b.returnedThisWeek.amount)}`,
  detail: (r: FundedBook["returned"][number]) => `${money(r.amount)} · ${returnReason[r.reason]}`,
  next: (r: FundedBook["returned"][number]): { status: string; tone: "amber" | "green" | "red" } =>
    r.next.kind === "retry"
      ? { status: `Retry ${weekdayShort(r.next.at)}`, tone: "amber" }
      : r.next.kind === "cleared"
        ? { status: "Retry cleared", tone: "green" }
        : { status: "Needs a call", tone: "red" },
  note: "Retries follow bank rules: no more than two tries per payment.",
};

export const recoveryCopy = {
  title: "Getting deals back on track",
  subtitle: "Deals behind on payments, by step",
  link: { label: "Open collections", href: "/funded#book" },
  stages: (b: FundedBook) => {
    const r = b.recovery;
    return [
      { n: "01", label: "Behind", count: String(r.behind.count), note: moneyShort(r.behind.amount), tone: "red" },
      { n: "02", label: "Contacted", count: String(r.contacted.count), note: moneyShort(r.contacted.amount), tone: "plain" },
      { n: "03", label: "Payment plan", count: String(r.plan.count), note: moneyShort(r.plan.amount), tone: "plain" },
      { n: "04", label: "Back on track", count: String(r.backOnTrack), note: "this quarter", tone: "mint" },
      { n: "05", label: "Written off", count: String(r.writtenOff.count), note: `${moneyShort(r.writtenOff.amount)} this year`, tone: "dashed" },
    ] as { n: string; label: string; count: string; note: string; tone: "red" | "plain" | "mint" | "dashed" }[];
  },
  note: "Payment plans lower the daily amount for a set time. Every change is logged and the merchant signs it.",
};

export const returnsCopy = {
  title: "Returns this year",
  subtitle: "On deals that have finished",
  tiles: (b: FundedBook) =>
    [
      { label: "Collected per $1 funded", value: `$${b.returns.perDollar.toFixed(2)}`, good: true },
      { label: "Loss rate", value: percent(b.returns.lossRate, 1) },
      { label: "Written off", value: moneyShort(b.returns.writtenOff) },
      { label: "Commission clawed back", value: moneyShort(b.returns.clawedBack) },
    ] as { label: string; value: string; good?: boolean }[],
  note: "Clawbacks: brokers return commission when a deal fails early.",
};

export const payingOffCopy = {
  title: "Paying off in the next 30 days",
  text: (b: FundedBook) => `${plural(b.payingOff.count, "merchant")}, ${moneyShort(b.payingOff.amount)} of advances ending. The best time to offer a renewal is before they finish.`,
  chips: (b: FundedBook) => {
    const more = b.payingOff.count - b.payingOff.first.length;
    return [
      ...b.payingOff.first.map((m) => ({ ini: m.initials, g: m.colors, name: m.merchant, when: monthName(m.month) as string | undefined })),
      ...(more > 0 ? [{ ini: `+${more}`, g: ["#57418A", "#8670B8"] as [string, string], name: `${more} more`, when: undefined }] : []),
    ];
  },
  cta: { label: "Go to Renewals", href: "/renewals" },
};

export const fundedSections = {
  today: "Today's payments and the book at a glance",
  warnings: "Early warnings, vintages and reconciliation",
  forecast: "Money coming in and returned payments",
  recovery: "Recovery steps and returns this year",
};
