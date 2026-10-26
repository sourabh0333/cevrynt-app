/**
 * Interface wording for Renewals (design/Renewals.html and its prototype).
 * The candidates, the pipeline and the saved rules come from the data layer
 * (renewalsView); this file words them. Each merchant's repaid share,
 * revenue, balance, daily payment and price come from its advance, and its
 * score from the merchant, so they match Funded deals, Merchants and
 * Renewal rules. Renewal figures come from renewalOffer in lib/offer-math.ts.
 */
import type { OutreachKind, RenewalRules, RenewalSettings, RenewalSummary, RiskSignal } from "@/lib/data/types";
import type { CandidateRow, RenewalsData } from "@/lib/data/views/renewals";
import { dateShort, money, moneyShort, monthName, percent, plural } from "@/lib/format";

export const renewalsHeader = {
  title: "Renewals",
  line: (ready: number) => `${plural(ready, "merchant")} ready · offer before they finish paying`,
};

/** x positions of the six months on the design's 300×70 chart */
const chartX = [4, 62, 120, 178, 236, 296];

export const hero = {
  title: "New funding waiting in renewals",
  value: (s: RenewalSummary) => moneyShort(s.readyValue),
  text: (ready: number) => `${plural(ready, "merchant")} ${ready === 1 ? "is" : "are"} ready. Renewing now keeps them before another funder does.`,
  chartLabel: (s: RenewalSummary) => {
    const [first, last] = [s.fundedByMonth[0], s.fundedByMonth[s.fundedByMonth.length - 1]];
    return `Renewals funded per month, rising from ${moneyShort(first.amount)} in ${monthName(first.month, "long")} to ${moneyShort(last.amount)} in ${monthName(last.month, "long")}`;
  },
  /** the monthly amounts on the chart: the lowest at y 62, the highest at y 12 */
  points: (s: RenewalSummary) => {
    const amounts = s.fundedByMonth.map((m) => m.amount);
    const [lo, hi] = [Math.min(...amounts), Math.max(...amounts)];
    return amounts.map((a, i) => [chartX[i] ?? 4 + i * 58, Math.round(62 - ((a - lo) / (hi - lo || 1)) * 50)] as [number, number]);
  },
  caption: (s: RenewalSummary) =>
    `Renewals funded per month, ${monthName(s.fundedByMonth[0].month, "long")} to ${monthName(s.fundedByMonth[s.fundedByMonth.length - 1].month, "long")}`,
  journey: {
    title: "The renewal journey",
    note: (renewedThisMonth: number) => `This quarter · ${renewedThisMonth} renewed this month`,
    /** "sent" counts offers out, which grow as offers go out from the panel */
    steps: (s: RenewalSummary, ready: number) =>
      [
        { n: "01", count: String(s.comingUp.count), label: "Coming up", tone: "dashed", flex: s.comingUp.count },
        { n: "02", count: String(ready), label: `Ready · ${moneyShort(s.readyValue)}`, tone: "now", flex: ready },
        { n: "03", count: "sent", label: "Offer sent", tone: "plain", flex: s.offersOut },
        { n: "04", count: String(s.accepted.count), label: `Accepted · ${moneyShort(s.accepted.amount)}`, tone: "plain", flex: s.accepted.count },
        { n: "05", count: String(s.renewed.count), label: `Renewed · ${moneyShort(s.renewed.amount)}`, tone: "done", flex: s.renewed.count },
      ] as { n: string; count: string; label: string; tone: "dashed" | "now" | "plain" | "done"; flex: number }[],
  },
};

export type RenewalStatus = "ready" | "sent" | "accepted" | "soon";

/** A merchant on the radar, as the radar, the offer panel and the cards show it. */
export type RenewalMerchant = {
  id: string;
  ini: string;
  g: [string, string];
  name: string;
  industry: string;
  broker: string;
  score: number;
  /** % repaid */
  paid: number;
  /** revenue change since funding, percent */
  rev: number;
  /** suggested renewal; 0 when it can't be priced yet */
  suggested: number;
  max: number;
  /** left to collect on the current advance */
  left: number;
  /** the factor a new customer would get; the loyalty price comes off it */
  baseFactor: number;
  /** what the current advance was priced at */
  currentFactor: number;
  /** today's daily payment */
  now: number;
  status: RenewalStatus;
};

export const renewalMerchant = ({ candidate: c, advance: a, ready }: CandidateRow): RenewalMerchant => ({
  id: a.id,
  ini: a.merchant.initials,
  g: a.merchant.colors,
  name: a.merchant.name,
  industry: a.merchant.industry,
  broker: a.broker,
  score: a.merchant.health ?? 0,
  paid: Math.round((a.paid / a.payback) * 100),
  rev: Math.round((a.revenueChange ?? 0) * 100),
  suggested: c.suggested,
  max: c.maxOffer,
  left: a.payback - a.paid,
  baseFactor: c.baseFactor,
  currentFactor: a.payback / a.amount,
  now: a.dailyPayment,
  status: c.offer ?? (ready ? "ready" : "soon"),
});

export const statusLabel: Record<RenewalStatus, string> = { ready: "Ready", sent: "Offer sent", accepted: "Accepted", soon: "Not yet" };

export const radar = {
  title: "Renewal radar",
  subtitle: "How much they've repaid, against how their business is doing. Bigger dot, bigger renewal. Click one.",
  legend: [
    { label: "Ready", dot: "bg-teal" },
    { label: "Offer sent", dot: "bg-blue" },
    { label: "Accepted", dot: "bg-mint" },
  ],
  yAxis: "Revenue since funding →",
  quadrants: {
    nurture: { title: "Growing, not ready yet", sub: "Nurture" },
    renew: { title: "Renew now", sub: "Paid half or more, revenue up" },
    early: { title: "Too early" },
    soft: { title: "Paid enough, revenue soft", sub: "Smaller renewal or wait" },
  },
  xAxis: (line: number) => ["30% repaid", `${line}%, renewal line`, "Repaid →  90%"],
  dotLabel: (m: RenewalMerchant) => `${m.name}, ${m.paid}% repaid, revenue ${m.rev}%`,
};

/** Where a merchant sits on the radar: x by share repaid (30–90%), y by revenue change (±20%). */
export const radarPosition = (m: RenewalMerchant) => ({
  x: Math.max(4, Math.min(96, ((m.paid - 30) / 60) * 100)),
  y: Math.max(6, Math.min(94, 50 - (m.rev / 20) * 44)),
});

/** Dot size grows with the renewal amount; merchants with no renewal get the small dot. */
export const radarSize = (m: RenewalMerchant, amount: number) => (m.suggested ? Math.round(30 + (amount / 90000) * 36) : 26);

export const offerPanel = {
  stats: { repaid: "Repaid", revenue: "Revenue", score: "Score" },
  amount: { label: "Renewal amount", upTo: (max: string) => `up to ${max}`, notYet: "Not yet", step: 5000, min: 10000, lower: "Lower amount", raise: "Raise amount" },
  split: { paysOff: (left: string) => `Pays off ${left}`, newCash: (cash: string) => `${cash} new cash` },
  cashLabel: (cashPercent: number) => `${Math.round(cashPercent)}% of the renewal is new cash`,
  factor: { label: "Loyalty factor" },
  daily: { label: (now: string) => `Daily, was ${now}` },
  checks: ["✓ Fresh bank data", "✓ Stacking check", "✓ Registry active"],
  disclosure: {
    title: "Renewal disclosure",
    shown: "Shown to the merchant",
    payout: "Payout reduced to clear balance",
    fees: "Includes unpaid fees from the last advance?",
    yes: (fee: string) => `Yes, ${fee}`,
    no: "No",
    forgive: { label: "Forgive the unearned fee", note: "Loyal merchants don't pay twice" },
  },
  send: { ready: "Send renewal offer", sent: "Offer sent", accepted: "Accepted, in funding", soon: "Not ready yet" } as Record<RenewalStatus, string>,
  foot: "Built from fresh bank data. No new application needed.",
};

export const readyCards = {
  title: "Ready to renew",
  subtitle: "Best first",
  action: "Send all to brokers",
  suggested: "Suggested",
  repaid: (paid: number) => `${paid}% repaid`,
  revenue: (rev: number) => `${rev >= 0 ? "+" : "−"}${Math.abs(rev)}% revenue`,
};

const outreachWords: Record<OutreachKind, { via: string; title: string; note: string }> = {
  "heads-up": { via: "Broker", title: "Heads-up to broker", note: "“Your merchant is close to renewal”" },
  "pre-approved": { via: "Email + text", title: "Pre-approved offer", note: "Amount ready, one tap to accept" },
  call: { via: "Underwriter", title: "Personal call", note: "If they haven't answered yet" },
  "last-chance": { via: "Email", title: "Last chance", note: "Before the advance ends" },
};

export const outreach = {
  title: "Automatic outreach",
  subtitle: "Messages go out by themselves as merchants repay. You step in when they reply.",
  chip: (steps: RenewalSettings["outreach"]) => (steps.some((s) => s.on) ? "On" : "Off"),
  /** the step at the renewal line is the one that sends the offer */
  steps: (steps: RenewalSettings["outreach"], rules: RenewalRules) =>
    steps.map((s) => ({ at: `${s.at}%`, ...outreachWords[s.kind], key: s.at === rules.paid })),
  results: (s: RenewalSummary, renewedThisMonth: number) =>
    [
      { label: "Sent this month", value: String(s.outreach.sent) },
      { label: "Merchants replied", value: percent(s.outreach.replied) },
      { label: "Became renewals", value: String(renewedThisMonth), good: true },
    ] as { label: string; value: string; good?: boolean }[],
};

export const brokerPay = {
  title: "Broker pay on renewals",
  subtitle: "Set once, applied to every renewal",
  /** Pricing's broker points; a renewal that comes direct pays no broker. */
  rows: (points: { newDeal: number; renewal: number }) => [
    { label: "New deal", value: `${points.newDeal} pts` },
    { label: "Renewal, same broker", value: `${points.renewal} pts` },
    { label: "Renewal, direct to you", value: "0 pts" },
  ],
  saved: { before: "Saved ", amount: (s: RenewalSummary) => money(s.commissionSaved), after: " in commission this quarter on renewals" },
};

export const readyRules = {
  title: "Who counts as ready",
  subtitle: "All four must be true",
  link: { label: "Edit rules", href: "/settings/renewals" },
  // The same saved rules Settings › Renewal rules edits.
  rules: (r: RenewalRules) => [
    { label: "Repaid at least", value: `${r.paid}%` },
    { label: `Returned payments in ${plural(r.ret, "day")}`, value: "0" },
    { label: "Revenue vs at funding", value: `${r.rev}%` },
    { label: "New advances elsewhere", value: "0" },
  ],
  loyalty: { label: "Loyalty price", value: (discount: number) => `−${discount.toFixed(2)} factor` },
};

const riskWords: Record<RiskSignal, { sign: string; icon: "card" | "doc" | "eye" }> = {
  "credit-check": { sign: "Another funder checked their credit", icon: "card" },
  "payoff-letter": { sign: "Broker asked for a payoff letter", icon: "doc" },
  "competitor-offer": { sign: "Opened a competitor's offer", icon: "eye" },
};

export const atRisk = {
  title: "Might go elsewhere",
  subtitle: "Spotted by Stacking Watch",
  total: (list: RenewalsData["atRisk"]) => moneyShort(list.reduce((n, r) => n + r.amount, 0)),
  totalLabel: "at risk",
  barLabel: (list: RenewalsData["atRisk"]) => `Value at risk: ${list.map((r) => `${r.shortName} ${r.amount / 1000}K`).join(", ")}`,
  merchants: (list: RenewalsData["atRisk"]) =>
    list.map((r) => ({
      name: r.name,
      ...riskWords[r.signal],
      likelihood: r.likelihood,
      when: r.actBy === "today" ? "act today" : "this week",
      amount: moneyShort(r.amount),
      k: r.amount / 1000,
      tone: (r.likelihood >= 70 ? "red" : r.likelihood >= 50 ? "amber" : "soft") as "red" | "amber" | "soft",
    })),
  likely: (likelihood: number) => `${likelihood}% likely to leave`,
};

export const comingUp = {
  title: "Coming up",
  subtitle: (line: number) => `Reaching the ${line}% line in 30 days`,
  /** each bar is how far a merchant is toward the renewal line */
  merchants: (list: RenewalsData["comingUp"], line: number) =>
    list.map((m) => ({
      name: m.name,
      when: m.reachesLineAt ? dateShort(m.reachesLineAt) : "Paying slowly",
      percent: Math.min(100, Math.round((m.paid / line) * 100)),
      slow: !m.reachesLineAt,
    })),
  link: { label: (n: number) => `See all ${n}`, href: "#" },
};

export const renewalsSections = { outreach: "Automatic outreach and broker pay", bottom: "Renewal rules, risks and pipeline", journey: "Merchants at each step of the renewal journey" };
