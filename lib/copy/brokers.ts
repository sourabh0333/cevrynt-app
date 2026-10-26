/**
 * Interface wording for Brokers (design/Brokers.html and its prototype).
 * The brokers, their Stacking Watch fraud flags, today's funded deals and
 * the book come from the data layer (brokersView); this file words them.
 * Commission uses Pricing's broker points (or a broker's own lower rate),
 * the same points Offers & funding uses for today's commissions.
 */
import type { Broker, IsoDateTime, Money, Pricing } from "@/lib/data/types";
import type { BrokerRow, BrokersData } from "@/lib/data/views/brokers";
import { clockTime, dateShort, money, moneyCompact, moneyK, moneyShort, percent, plural, weekdayShort } from "@/lib/format";

const millions1 = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LONG_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type Tier = "top" | "good" | "watch" | "paused";
export const tierLabel: Record<Tier, string> = { top: "Top partner", good: "Good standing", watch: "On watch", paused: "Paused" };
export const tierOf = (score: number, paused = false): Tier => (paused ? "paused" : score >= 85 ? "top" : score >= 65 ? "good" : "watch");

/** A broker's points on a new deal: their own agreed rate, or Pricing's. */
export const pointsFor = (b: Broker, points: Pricing["brokerPoints"]) => b.commission.newDealPoints ?? points.newDeal;

/** What a broker is owed this pay period: earlier deals, today's at their points, less any clawback. */
export function commissionOf(b: Broker, d: Pick<BrokersData, "fundedToday" | "book" | "pricing">) {
  const today = d.fundedToday.filter((f) => f.brokerId === b.id);
  const todayAmount = today.reduce((n, f) => n + (f.amount * (f.renewal ? d.pricing.brokerPoints.renewal : pointsFor(b, d.pricing.brokerPoints))) / 100, 0);
  const clawback = d.book.clawbacks.filter((c) => c.brokerId === b.id).reduce((n, c) => n + c.amount, 0);
  const gross = b.earned.amount + todayAmount;
  return { deals: b.earned.deals + today.length, gross, clawback, owed: Math.max(0, gross - clawback) };
}

export const onWatchCount = (brokers: Broker[]) => brokers.filter((b) => tierOf(b.score) === "watch").length;

export const brokersHeader = {
  title: "Brokers",
  line: (active: number, watch: number) => `${active} active brokers · ${watch} on watch`,
};

export type SummaryTone = "mint" | "grey" | "cream" | "red";

export function brokerSummary(d: BrokersData): { label: string; value: string; note: string; tone: SummaryTone }[] {
  const owed = d.brokers.reduce((n, b) => n + commissionOf(b, d).owed, 0);
  return [
    { label: "Funded through brokers", value: millions1(d.book.fundedThroughBrokers), note: `This quarter · ${percent(d.book.shareOfFunding)} of all funding`, tone: "mint" },
    { label: "Average fund rate", value: percent(d.book.avgFundRate), note: "Submissions that get funded", tone: "grey" },
    { label: "Complete on first send", value: percent(d.book.completeFirstSend), note: "No stips needed at intake", tone: "grey" },
    { label: "Commission owed", value: moneyK(owed), note: `Paid every ${LONG_WEEKDAYS[d.book.payoutWeekday]}`, tone: "cream" },
    { label: "On watch", value: String(onWatchCount(d.brokers)), note: "Rising fraud flags", tone: "red" },
  ];
}

export type BrokerSort = "score" | "vol" | "flags";
/** the note box tone: g good (mint), n neutral (grey), r risk (red) */
export type BrokerTone = "g" | "n" | "r";
const noteTone: Record<Broker["note"]["tone"], BrokerTone> = { good: "g", neutral: "n", risk: "r" };

/** A broker as the scorecards and the detail show it. */
export type BrokerView = {
  id: string;
  ini: string;
  name: string;
  contact: string;
  g: [string, string];
  score: number;
  sent: number;
  funded: number;
  complete: number;
  flags: number;
  vol: string;
  volume: Money;
  late: string;
  reply: string;
  points: string;
  owed: string;
  weeks: number[];
  why: { reason: string; count: number; fraud: boolean }[];
  rights: string;
  note: string;
  t: BrokerTone;
};

export const brokerView = (b: BrokerRow, d: Pick<BrokersData, "fundedToday" | "book" | "pricing">): BrokerView => ({
  id: b.id,
  ini: b.initials,
  name: b.name,
  contact: `${b.contact.name} · ${b.contact.email}`,
  g: b.colors,
  score: b.score,
  sent: b.submitted,
  funded: b.funded,
  complete: Math.round(b.completeFirstSend * 100),
  flags: b.flags.length,
  vol: moneyCompact(b.fundedVolume),
  volume: b.fundedVolume,
  late: `${Math.round(b.paidLate * 1000) / 10}%`,
  reply: `${b.stipReplyHours}h`,
  points: `${pointsFor(b, d.pricing.brokerPoints)} pts${b.commission.onRenewals ? `, ${d.pricing.brokerPoints.renewal} on renewals` : ""}`,
  owed: money(commissionOf(b, d).owed),
  weeks: b.weeklySubmissions,
  why: b.declineReasons.map((r) => ({ reason: r.reason, count: r.count, fraud: !!r.fraud })),
  rights: b.renewalRightsMonths ? `Keeps renewals for ${plural(b.renewalRightsMonths, "month")}` : "None while on watch",
  note: b.note.text,
  t: noteTone[b.note.tone],
});

export const scorecards = {
  title: "Broker scorecards",
  subtitle: "Last 90 days · click a broker for detail",
  sortLabel: "Sort by",
  sorts: [
    { key: "score", label: "Score" },
    { key: "vol", label: "Funded" },
    { key: "flags", label: "Flags" },
  ] as { key: BrokerSort; label: string }[],
  columns: ["Broker", "Score", "Fund rate", "Complete", "Fraud flags", "Funded"],
};

/** The broker the detail opens on: the one that most needs a look. */
export const startSelected = (list: BrokerView[]) => (list.find((b) => tierOf(b.score) === "watch") ?? list[0])?.id ?? "";

export const profile = {
  tiles: { score: "Score", late: "Paid late", reply: "Stip reply" },
  weeks: "Submissions per week",
  weeksLabel: (name: string) => `Submissions per week for ${name} over the last 8 weeks`,
  why: "Why their deals don't fund",
  commission: "Commission",
  owed: "Owed now",
  rights: "Renewal rights",
  message: "Message broker",
  pause: "Pause",
  resume: "Resume",
};

const nameOf = (d: BrokersData, id: string) => d.brokers.find((b) => b.id === id)?.name ?? "";

export const ownership = {
  title: "Same merchant, two brokers",
  subtitle: "Your rule: the first complete file owns the deal for 30 days",
  chip: (n: number) => `${n} this week`,
  winnerChip: "Owns the deal",
  vs: "vs",
  cases: (d: BrokersData) =>
    d.book.ownership.map((c) => ({
      merchant: c.merchant,
      winner: { name: nameOf(d, c.winner.brokerId), sub: `Complete at ${clockTime(c.winner.completeAt)}` },
      other:
        c.other.outcome === "told"
          ? { name: nameOf(d, c.other.brokerId), tag: "Told politely", sub: `Sent ${clockTime(c.other.sentAt)}` }
          : { name: nameOf(d, c.other.brokerId), tag: "Incomplete", sub: `Missing ${c.other.missing}` },
    })),
};

/** The next payout day on or after today. */
const nextPayout = (now: IsoDateTime, weekday: number) => {
  const ahead = (weekday - WEEKDAYS.indexOf(weekdayShort(now)) + 7) % 7;
  return new Date(Date.parse(now) + ahead * 86_400_000).toISOString();
};
const ledger = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function payout(d: BrokersData) {
  const all = d.brokers.map((b) => commissionOf(b, d));
  const gross = all.reduce((n, c) => n + c.gross, 0);
  const net = all.reduce((n, c) => n + c.owed, 0);
  const day = nextPayout(d.now, d.book.payoutWeekday);
  return {
    title: `Payout · ${weekdayShort(day)} ${dateShort(day)}`,
    chip: "Ready",
    amount: money(net),
    sub: `to ${plural(all.filter((c) => c.owed > 0).length, "broker")} by ACH`,
    lines: [
      { label: `Commission, ${plural(all.reduce((n, c) => n + c.deals, 0), "deal")}`, value: ledger(gross) },
      ...d.book.clawbacks.map((c) => ({ label: `Clawback, ${c.reason}`, value: `−${ledger(c.amount)}`, clawback: true })),
    ] as { label: string; value: string; clawback?: boolean }[],
    net: { label: "Net", value: ledger(net) },
    cta: "Review statements",
  };
}

export type CheckState = "ok" | "wait" | "bad";
export type ApplicantResult = "approve" | "waiting" | "decline";

export const applicants = {
  title: "Brokers asking to join",
  subtitle: "Three checks before anyone can send you deals",
  chip: (n: number) => plural(n, "application"),
  columns: ["Applicant", "Background", "Registered", "References", "Result"],
  checkLabel: { ok: "Passed", wait: "Waiting", bad: "Problem found" } as Record<CheckState, string>,
  resultLabel: { approve: "Approve", waiting: "Waiting", decline: "Decline" } as Record<ApplicantResult, string>,
  rows: (d: BrokersData) =>
    d.book.applicants.map((a) => ({ name: a.name, sub: "appliedAt" in a.note ? `Applied ${dateShort(a.note.appliedAt)}` : a.note.text, checks: a.checks, result: a.result })),
};

export const paperwork = {
  title: "Paperwork on file",
  chip: (d: BrokersData) => `${d.book.paperwork.reduce((n, p) => n + (d.book.active - p.have), 0)} to fix`,
  items: (d: BrokersData) => d.book.paperwork.map((p) => ({ label: p.label, have: p.have, total: d.book.active })),
  note: "Some states now require broker registration, for example Texas from Dec 31, 2026.",
};

/** The range bars' scales: amounts up to $200K, monthly revenue up to $100K. */
const AMOUNT_SCALE = 200_000;
const REVENUE_SCALE = 100_000;

export const appetite = {
  chip: "Sent to brokers every Monday",
  title: "What we fund this week",
  text: "Built from your policy, so brokers send deals you can say yes to.",
  industries: (d: BrokersData) => d.book.appetiteIndustries.map((name) => ({ name, out: d.policy.restrictedIndustries.includes(name) })),
  /** left / right are the gaps at each end of the range bar, in % */
  ranges: ({ policy: p }: BrokersData) => [
    { label: "Amount", value: `${moneyShort(p.limits.minAmount)} – ${moneyShort(p.limits.maxAmount)}`, left: (p.limits.minAmount / AMOUNT_SCALE) * 100, right: ((AMOUNT_SCALE - p.limits.maxAmount) / AMOUNT_SCALE) * 100 },
    { label: "Monthly revenue", value: `${moneyShort(p.minMonthlyRevenue)} and up`, left: (p.minMonthlyRevenue / REVENUE_SCALE) * 100, right: 0 },
  ],
  facts: ({ policy: p }: BrokersData) => [
    { label: "In business", value: `${plural(p.minBusinessMonths, "month")}+` },
    { label: "Open positions", value: `Up to ${p.maxPositions}` },
  ],
  notFunded: "Not funded: ",
};

export const portal = {
  title: "Broker portal",
  chip: "Coming soon",
  text: "Brokers will submit deals, answer stips and see status themselves, instead of emailing your team.",
  items: ["Live status on every deal they sent", "Upload stips straight into the deal", "Their own scorecard and payouts"],
  cta: { label: "Join early access", href: "/whats-coming" },
};

export const brokersSections = { glance: "Brokers at a glance", ownership: "Deal ownership and payout", applicants: "New brokers and paperwork", appetite: "What we fund and the broker portal" };
