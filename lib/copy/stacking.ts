/**
 * Interface wording for Stacking Watch (design/Stacking.html and its
 * prototype). The alerts, joined to their deals and advances, and the
 * summary come from the data layer (stackingView); this file words them:
 * the counts, the stage of each deal, when it was seen and the automatic
 * step. The sidebar badge counts new alerts with the same function.
 */
import type { AlertKind, AlertSeverity, AutoRule, IsoDateTime, StackingAlert, StackingSummary } from "@/lib/data/types";
import type { AlertRow, AlertStage } from "@/lib/data/views/stacking";
import { daysBetween, moneyShort, monthName, percent, timeOfDay } from "@/lib/format";

const numberWords = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const inWords = (n: number) => numberWords[n] ?? String(n);

/** Open alerts Stacking Watch raised today: the header's "new" and the sidebar badge. */
export const newToday = (alerts: Pick<StackingAlert, "seenAt" | "status">[], now: IsoDateTime) =>
  alerts.filter((a) => a.status === "open" && daysBetween(a.seenAt, now) === 0).length;

/** Merchants watched: those with a live bank connection plus those on filings and credit only. */
const watchedCount = (s: StackingSummary) => s.watched.full + s.watched.partial;

export const stackingHeader = {
  title: "Stacking Watch",
  line: (fresh: number, s: StackingSummary) => `${fresh} new alert${fresh === 1 ? "" : "s"} · watching ${watchedCount(s)} merchants every day`,
};

export const summaryCopy = {
  chip: "Watching now",
  title: (s: StackingSummary) => `$${s.month.stopped.amount.toLocaleString("en-US")} kept safe this month`,
  text: (s: StackingSummary) =>
    `${inWords(s.month.stopped.count)} deal${s.month.stopped.count === 1 ? " was" : "s were"} stopped before funding because the merchant took another advance.`,
  tiles: (fresh: number, open: number, s: StackingSummary) => [
    { value: String(fresh), label: "New today" },
    { value: String(open), label: "Open" },
    { value: String(s.month.stopped.count), label: "Fundings stopped" },
    { value: String(watchedCount(s)), label: "Merchants watched" },
  ],
};

export const signals = {
  title: "What we watch",
  chip: "Daily",
  items: ["UCC filings", "New funder debits", "Funding deposits", "Credit inquiries", "Duplicate applications", "Bank account changes"],
};

export type AlertTab = "all" | AlertSeverity | "done";
export type StageKey = AlertStage["key"];

export const severityLabel: Record<AlertSeverity, string> = { high: "High", medium: "Medium" };
export const stageLabel: Record<StageKey, string> = { review: "In review", fund: "Ready to fund", funded: "Funded", renew: "Renewal" };

/** The letter on each alert's icon. */
export const kindGlyph: Record<AlertKind, string> = { ucc: "U", debit: "$", bank: "B", duplicate: "D", inquiry: "C" };

/** How a finding reads where an alert holds something up, e.g. the Offers queue's "New UCC filing · on hold". */
export const kindFinding: Record<AlertKind, string> = {
  ucc: "New UCC filing",
  debit: "New advance from another funder",
  bank: "Bank account changed",
  duplicate: "Shared bank account",
  inquiry: "Credit check by another funder",
};

/** Alerts that count as a broker's fraud flag: everything but a credit check. */
export const isFraudFlag = (a: Pick<StackingAlert, "kind">) => a.kind !== "inquiry";

/** "Ready to fund, $60K", "In review, $35K asked", "Funded, 18% repaid", "Renewal ready, $70K". */
export function stageLine(s: AlertStage) {
  switch (s.key) {
    case "fund":
      return `Ready to fund, ${moneyShort(s.amount)}`;
    case "review":
      return `In review, ${moneyShort(s.asked)} asked`;
    case "funded":
      return `Funded, ${percent(s.repaid)} repaid`;
    case "renew":
      return `Renewal ready, ${moneyShort(s.amount)}`;
  }
}

/** "Today 08:12", "Yesterday 16:40", "2 days ago". */
export function seenLabel(at: IsoDateTime, now: IsoDateTime) {
  const days = daysBetween(at, now);
  if (days === 0) return `Today ${timeOfDay(at)}`;
  if (days === 1) return `Yesterday ${timeOfDay(at)}`;
  return `${days} days ago`;
}

export const alertTabs: { key: AlertTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "done", label: "Reviewed" },
];

export const alertsList = {
  title: "Alerts",
  showLabel: "Show",
  columns: ["Severity", "Merchant", "What happened", "Seen", "Deal"],
  empty: "Nothing here yet.",
};

/** what Cevrynt did on its own when the signal came in, by deal stage */
export const autoStep: Record<StageKey, [string, string]> = {
  fund: ["Funding held automatically", "Nothing can be sent until someone reviews"],
  review: ["Added to the deal review", "Shown on the Integrity tab"],
  funded: ["Collections team notified", "Payments watched more closely"],
  renew: ["Renewal offer paused", "Until this alert is reviewed"],
};

export const detail = {
  evidence: "Evidence",
  suggest: "What we suggest",
  timeline: "What happened",
  found: { title: "Signal found", by: " · by Stacking Watch" },
  review: {
    open: ["Waiting for your review", "Use the button below when done"],
    done: ["Reviewed", "Marked reviewed just now"],
  },
  status: { open: "open", done: "reviewed" },
  reopen: "Reopen alert",
  openDeal: "Open deal",
};

const phoneParts = (p: string) => [p.slice(0, 3), p.slice(3, 6), p.slice(6)];

/** "Hidden connections": the alert that links two businesses, with its deal from Submissions. */
export function connectionsCopy(a: AlertRow) {
  const c = a.connection!;
  const [area, mid, end] = phoneParts(c.phone);
  const dealLine = a.stage.key === "review" ? `${a.stage.dealId} · ${stageLabel.review.toLowerCase()}` : stageLine(a.stage);
  return {
    title: "Hidden connections",
    subtitle: "Two applications that look unrelated share a bank account and a phone number",
    chip: "Needs review",
    mapLabel: `${a.merchant} and ${c.other.name} share bank account ending ${c.account} and phone ${area}-${mid}-${end}. Both list different owners.`,
    left: [
      { title: a.merchant, sub: dealLine, tone: "mint" },
      { title: `Owner: ${c.owners.here}`, sub: `Listed on ${c.labels.here}`, tone: "grey" },
    ] as { title: string; sub: string; tone: "mint" | "grey" | "amber" }[],
    right: [
      { title: c.other.shortName, sub: `Funded in ${monthName(c.other.fundedMonth, "long")} · ${c.other.broker}`, tone: "amber" },
      { title: `Owner: ${c.owners.other}`, sub: `Listed on ${c.labels.other}`, tone: "grey" },
    ] as { title: string; sub: string; tone: "mint" | "grey" | "amber" }[],
    shared: { caption: "SHARED", account: `Account ••${c.account}`, phone: `(${area}) ${mid}-${end}` },
    note: "One business may be borrowing again under a second name. Ask for the second company's statements before deciding.",
  };
}

export const thisMonth = {
  title: "This month",
  rows: (s: StackingSummary) =>
    [
      { label: "Alerts raised", value: String(s.month.raised) },
      { label: "Real stacking found", value: String(s.month.real) },
      { label: "Funding stopped in time", value: `${s.month.stopped.count} · ${moneyShort(s.month.stopped.amount)}`, good: true },
      { label: "False alarms", value: String(s.month.falseAlarms) },
    ] as { label: string; value: string; good?: boolean }[],
  soon: { chip: "Coming soon", title: "Cross-funder network", text: "See a merchant applying at other funders the same week, before any filing shows up." },
};

const ruleWords: Record<AutoRule, { title: string; sub: string }> = {
  hold: { title: "Hold funding on a high alert", sub: "Deals ready to fund stop until someone reviews" },
  notify: { title: "Tell the underwriter right away", sub: "In Cevrynt and by email" },
  broker: { title: "Let the broker know", sub: "For deals they sent, without private details" },
  pause: { title: "Pause renewal offers", sub: "For merchants with an open alert" },
  renew: { title: "Speed up renewals at risk", sub: "Send the offer when another funder checks credit" },
};

export const autoRules = {
  title: "What happens automatically",
  subtitle: "Turn rules on or off. Every automatic step is logged on the deal.",
  count: (on: number, total: number) => `${on} of ${total} on`,
  rules: (s: StackingSummary) => s.rules.map((r) => ({ key: r.key, on: r.on, ...ruleWords[r.key] })),
};

export const coverage = {
  title: "How well we can see",
  chip: (s: StackingSummary) => percent(s.watched.full / watchedCount(s)),
  text: "New funder debits only show up for merchants with a live bank connection.",
  full: "Full watch, bank connected",
  partial: "Filings and credit only",
  barLabel: (s: StackingSummary) => `${s.watched.full} merchants on full watch, ${s.watched.partial} on filings and credit only`,
  cta: (s: StackingSummary) => `Ask ${s.watched.partial} merchants to connect`,
};

export const stackingSections = { glance: "Stacking Watch at a glance", connections: "Hidden connections and this month", rules: "Automatic rules and coverage" };
