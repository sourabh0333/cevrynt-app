/**
 * Interface wording for the deal Summary tab (design/Deal-Summary.html).
 * The deal's score, recommendation, findings and timeline come from the
 * data layer (dealTabsView); this file turns them, and the policy lines
 * they're measured against, into what people read.
 */
import type { CheckKey, DealSummary, Policy, ScorePart } from "@/lib/data/types";
import { dateLong, dateShort, money, moneyK, moneyShort, monthName, percent, plural, timeOfDay, weekdayShort } from "@/lib/format";
import { scoreWeights } from "./policy";

/** "+3.1%" */
export const signedPercent1 = (x: number) => `${x >= 0 ? "+" : "−"}${(Math.abs(x) * 100).toFixed(1)}%`;

/** The score's word: Strong well above the approval line, then down to Weak. */
export function scoreBandLabel(score: number, bands: Policy["scoreBands"]) {
  if (score >= bands.approvalFrom + 10) return "Strong";
  if (score >= bands.approvalFrom) return "Good";
  if (score >= bands.declineBelow) return "Review closely";
  return "Weak";
}

export const scoreCardCopy = {
  title: "Underwriting score",
  link: { label: "How it's built", href: "/settings/policy" },
  partLabel: (part: ScorePart) => scoreWeights.parts[part].label,
  /** "18 above your approval line of 70. Integrity holds it back." */
  summary: (total: number, approvalFrom: number, holdsBack: ScorePart) => {
    const diff = total - approvalFrom;
    const where = diff >= 0 ? `${diff} above` : `${-diff} below`;
    return `${where} your approval line of ${approvalFrom}. ${scoreWeights.parts[holdsBack].label} holds it back.`;
  },
  aria: (total: number, parts: { part: ScorePart; points: number; max: number }[]) =>
    `Score ${total} of 100: ${parts.map((p) => `${scoreWeights.parts[p.part].label.toLowerCase().replace("&", "and")} ${p.points} of ${p.max}`).join(", ")}`,
};

const trendWord: Record<DealSummary["balanceTrend"], string> = { steady: "Steady", rising: "Rising", falling: "Falling" };
export const balanceTrendLabel = (t: DealSummary["balanceTrend"]) => trendWord[t];

/** "4% below stated", or above */
export const vsStated = (trueRevenue: number, stated: number) => {
  const diff = 1 - trueRevenue / stated;
  return diff >= 0 ? `${percent(diff)} below stated` : `${percent(-diff)} above stated`;
};

export const keyNumbersCopy = {
  title: "Key numbers",
  range: (months: string[]) => `${monthName(months[0])} – ${monthName(months[months.length - 1])} · ${plural(months.length, "statement")}`,
  revenue: { label: "True revenue", suffix: "/mo" },
  balance: { label: "Avg balance", low: (amount: number, at: string) => `Low ${moneyK(amount)} · ${dateShort(at)}` },
  bounced: {
    label: "Bounced",
    clean: "Clean",
    found: (n: number) => `${n} found`,
    nsfs: "NSFs",
    belowZero: "below $0",
    note: (clean: number, months: number) => `${clean} of ${months} months clean`,
  },
  debt: {
    label: "Existing debt",
    chip: (positions: number) => plural(positions, "position"),
    value: (share: number) => `${(share * 100).toFixed(1)}%`,
    note: (maxShare: number) => `of revenue · max ${percent(maxShare)}`,
  },
};

export const recommendationCopy = {
  title: "Recommendation",
  decision: { approve: "Approve", counter: "Counter", decline: "Decline" } as Record<DealSummary["recommendation"]["decision"], string>,
  note: (diff: number, reason: string) =>
    diff > 0 ? `${money(diff)} below request ${reason}` : diff === 0 ? "Matches the requested amount." : `${money(-diff)} above the request.`,
  slider: "Advance amount",
  floor: (n: number) => `Floor ${moneyShort(n)}`,
  ceiling: (n: number) => `Ceiling ${moneyShort(n)}`,
  terms: { factor: "Factor", term: "Term", daily: "Daily" },
  termValue: (months: number) => `${months} mo`,
  cta: "Open offer builder",
};

/** "−9% vs stated", "−1%", "−0.3%": whole percents, one decimal when that would round to 0. */
export const monthVsStated = (value: number, stated: number, first: boolean) => {
  const x = ((value - stated) / stated) * 100;
  const whole = Math.round(x);
  const shown = whole === 0 ? Math.abs(x).toFixed(1) : String(Math.abs(whole));
  return `${x < 0 ? "−" : "+"}${shown}%${first ? " vs stated" : ""}`;
};

export const revenueChartCopy = {
  title: "Revenue & balance",
  subtitle: (months: string[]) =>
    `From ${months.length} bank statements, ${monthName(months[0], "long")} to ${monthName(months[months.length - 1], "long")} ${months[months.length - 1].slice(0, 4)}`,
  viewsLabel: "Chart view",
  views: [
    { value: "rev", label: "Monthly revenue" },
    { value: "bal", label: "Daily balance" },
  ] as { value: "rev" | "bal"; label: string }[],
  rev: {
    avg: { cap: "Avg true revenue", chip: (growth: number) => `${(growth * 100).toFixed(1)}% a month` },
    stated: { cap: "Stated on application", hint: (trueRevenue: number, stated: number) => `Verified is ${percent(1 - trueRevenue / stated)} lower` },
    leftOut: { cap: "Left out of revenue", hint: (at: string) => `Related-business transfer, ${dateShort(at)}` },
    statedText: (stated: number) => moneyShort(stated),
    aria: (stated: number, months: { month: string; trueRevenue: number }[]) =>
      `True revenue by month against ${moneyShort(stated)} stated: ${months.map((m) => `${monthName(m.month, "long")} ${moneyK(m.trueRevenue)}`).join(", ")}`,
    legend: { bars: "True revenue", stated: (stated: number) => `Stated ${moneyShort(stated)}`, trend: "Trend" },
  },
  bal: {
    avg: { cap: "Avg daily balance" },
    low: { cap: "Lowest balance", hint: (at: string, after: string) => `${dateShort(at)}, after ${after}` },
    below: { cap: "Days below zero", hint: (months: number, nsfs: number) => (nsfs ? `${plural(nsfs, "NSF")} in ${months} months` : `No NSFs in ${months} months`) },
    avgText: (avg: number) => `Avg ${moneyK(avg)}`,
    lowText: (low: number, at: string) => `Low ${moneyK(low)} · ${dateShort(at)}`,
    aria: (first: string, last: string, avg: number, low: number, at: string, below: number) =>
      `End-of-day balance from ${monthName(first, "long")} to ${monthName(last, "long")}, averaging ${moneyK(avg)}, lowest ${moneyK(low)} on ${dateLong(at)}, ${below ? `below zero on ${plural(below, "day")}` : "never below zero"}`,
    legend: { line: "End-of-day balance", avg: (months: number) => `${months}-month average`, low: "Lowest day" },
  },
};

export const lookCopy = {
  title: "What needs a look",
  count: (n: number) => plural(n, "item"),
  clearCap: "Checked and clear",
};

export const checksCopy = {
  title: "Every check at a glance",
  hint: "Open a card for the full detail",
  order: ["cashFlow", "positions", "integrity", "business", "conditions", "stacking"] as CheckKey[],
  label: { cashFlow: "Cash flow", positions: "Positions & debt", integrity: "Integrity", business: "Business & owners", conditions: "Conditions & stips", stacking: "Stacking Watch" } as Record<CheckKey, string>,
  open: (n: number) => `${n} open`,
  ok: "Clear",
  warn: "Needs a look",
};

export const timelineCopy = {
  title: "Timeline",
  link: "All activity",
  time: (at: string, upcoming: boolean) => (upcoming ? `${weekdayShort(at)} ${timeOfDay(at)}` : timeOfDay(at)),
};

export const askDealCopy = {
  title: "Ask about this deal",
  hint: "Answers come from this deal's statements, checks and documents.",
};
