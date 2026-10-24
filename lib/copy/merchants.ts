/**
 * Interface wording for Merchants (design/Merchants.html and its
 * prototype). The rows, the book and the balances come from the data layer
 * (merchantsView); this file words them: the deal counts, balances, repaid
 * bars and history lines read from each merchant's advance, the stat tiles
 * from the funded book, and the concentration checks against the policy.
 */
import type { FundedBook, IsoDateTime, MerchantBook, MerchantEvent, Money, Policy, Relationship } from "@/lib/data/types";
import type { MerchantRow } from "@/lib/data/views/merchants";
import { clockTime, dayLabel, money, moneyK, moneyShort, percent, plural } from "@/lib/format";
import { activeCount } from "./funded";

const millions1 = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;
const paidShare = (a: { paid: number; payback: number }) => Math.round((a.paid / a.payback) * 100);

export const merchantsHeader = {
  title: "Merchants",
  line: (total: number, active: number) => `${total} businesses · ${active} with an active advance`,
};

export type MerchantStatTone = "mint" | "grey" | "cream" | "red" | "stone";
export type MerchantStat = { label: string; value: string; note?: string; bar?: number; tone: MerchantStatTone; noteStrong?: boolean };

/** The five tiles at the top: the funded book, who is ready to renew, the watch list and repeat merchants. */
export function merchantStats(x: { book: MerchantBook; funded: Pick<FundedBook, "counts" | "outstanding">; readyCount: number; renewalLine: number }): MerchantStat[] {
  const active = activeCount(x.funded);
  const onTime = (active - x.funded.counts.late) / active;
  return [
    { label: "Active advances", value: String(active), note: `${millions1(x.funded.outstanding)} still to collect`, tone: "mint" },
    { label: "Paying on time", value: percent(onTime), bar: Math.round(onTime * 100), tone: "grey" },
    { label: "Ready to renew", value: String(x.readyCount), note: `Paid ${x.renewalLine}% or more, performing well`, tone: "cream", noteStrong: true },
    { label: "On watch", value: String(x.book.onWatch), note: "Late payments or stacking alerts", tone: "red" },
    { label: "Come back for more", value: percent(x.book.repeat.secondAdvance), note: "Of merchants take a 2nd advance", tone: "stone" },
  ];
}

export const relationships: Record<Relationship, string> = {
  active: "Active advance",
  renew: "Ready to renew",
  review: "In review",
  watch: "On watch",
  declined: "Declined",
  new: "Just funded",
};

export type Segment = "all" | Relationship | "blocked";

export const segments = (x: { book: MerchantBook; active: number; readyCount: number }): { key: Segment; label: string; count: number }[] => [
  { key: "all", label: "All", count: x.book.total },
  { key: "active", label: "Active advance", count: x.active },
  { key: "renew", label: "Ready to renew", count: x.readyCount },
  { key: "watch", label: "On watch", count: x.book.onWatch },
  { key: "review", label: "In review", count: x.book.inReview },
  { key: "declined", label: "Declined", count: x.book.declined },
  { key: "blocked", label: "Blocked", count: x.book.blocked },
];

export type HistoryTone = "g" | "d" | "a" | "r";
const historyTone: Record<MerchantEvent["tone"], HistoryTone> = { good: "g", done: "d", open: "a", risk: "r" };

/** A merchant as the list and the preview show it. */
export type MerchantView = {
  id: string;
  ini: string;
  g: [string, string];
  name: string;
  industry: string;
  state: string;
  rel: Relationship;
  deals: string;
  balance: string;
  /** share of the current advance repaid, 0–100 */
  paid: number;
  /** health score; 0 means not scored */
  health: number;
  last: string;
  owner: string;
  funded: string;
  note: string;
  history: { title: string; detail: string; year: string; tone: HistoryTone }[];
};

/** "3 · 2 funded", "1 · funded", "1 · in review", "1 · declined". */
function dealsLine(r: MerchantRow) {
  const funded = r.listing.pastAdvances + (r.advance ? 1 : 0);
  const total = funded + (r.listing.openDeal ? 1 : 0);
  if (funded === total) return `${total} · funded`;
  if (funded) return `${total} · ${funded} funded`;
  return `${total} · ${r.listing.openDeal === "declined" ? "declined" : "in review"}`;
}

export const merchantView = (r: MerchantRow, now: IsoDateTime): MerchantView => {
  const { merchant: m, listing: p, advance: a } = r;
  const fundedTotal = p.fundedBefore + (a?.amount ?? 0);
  return {
    id: m.id,
    ini: m.initials,
    g: m.colors,
    name: m.name,
    industry: m.industry,
    state: p.state,
    rel: r.relationship,
    deals: dealsLine(r),
    balance: a ? moneyK(a.payback - a.paid) : "—",
    // with no live advance, a paid-off one shows as a full bar
    paid: a ? paidShare(a) : p.pastAdvances ? 100 : 0,
    health: m.health ?? 0,
    last: p.lastActivity.kind === "update" ? `${dayLabel(p.lastActivity.at, now)}, ${clockTime(p.lastActivity.at)}` : p.lastActivity.text,
    owner: p.owner,
    funded: fundedTotal ? moneyShort(fundedTotal) : "$0",
    note: p.note,
    history: p.history.map((h) =>
      "kind" in h
        ? {
            title: `Current advance, ${a ? paidShare(a) : 0}% paid`,
            detail: [a ? money(a.amount) : "", h.withFactor && a ? `${(a.payback / a.amount).toFixed(2)} factor` : "", h.via ?? ""].filter(Boolean).join(" · "),
            year: a ? a.fundedAt.slice(0, 4) : "",
            tone: "g" as const,
          }
        : { title: h.title, detail: h.detail, year: String(h.year), tone: historyTone[h.tone] },
    ),
  };
};

/** "Active advance" also shows the just-funded and ready-to-renew merchants, as in the prototype. */
export const inSegment = (m: MerchantView, seg: Segment) =>
  seg === "all" || m.rel === seg || (seg === "active" && (m.rel === "new" || m.rel === "renew"));

export const merchantList = {
  title: "All merchants",
  search: { label: "Search merchants", placeholder: "Business, owner, EIN or phone" },
  showLabel: "Show",
  columns: ["Merchant", "Relationship", "Deals", "Balance left", "Health", "Last activity"],
  showing: (n: number, total: number) => `Showing ${n} of ${total}`,
  export: "Export",
  empty: "No merchants match.",
  blocked: {
    title: (n: number) => `${plural(n, "merchant")} ${n === 1 ? "is" : "are"} blocked`,
    text: "Blocked for confirmed fraud. New applications from them, their owners or bank accounts are stopped at intake.",
  },
};

export const preview = {
  labels: { funded: "Funded with you", health: "Health", owner: "owner" },
  open: "Open profile",
  newDeal: "New deal",
  newDealHref: "/intake",
  history: "History with you",
  outOf: " / 100",
  none: "—",
};

const sliceColors = ["teal-ink", "sand", "teal", "teal-soft", "mint"] as const;
export type SliceColor = (typeof sliceColors)[number];

export const byIndustry = {
  title: "By industry",
  subtitle: "Share of money still to collect",
  total: (outstanding: Money) => millions1(outstanding),
  slices: (book: MerchantBook) =>
    book.industries.map((s, i) => ({ label: s.label, percent: Math.round(s.share * 100), color: sliceColors[Math.min(i, sliceColors.length - 1)] as SliceColor })),
  limit: (book: MerchantBook, c: Policy["concentration"]) => {
    const largest = Math.max(...book.industries.map((s) => s.share));
    return { label: `Largest industry vs your ${percent(c.industryMax)} limit`, result: `${percent(largest)}, ${largest <= c.industryMax ? "OK" : "over"}` };
  },
};

const stateColors = ["teal-ink", "teal", "teal-mid", "teal-soft", "mint"] as const;
export type StateColor = (typeof stateColors)[number];

export const byState = {
  title: "By state",
  subtitle: "Where active merchants are",
  chip: (active: number) => `${active} active`,
  states: (book: MerchantBook) => {
    const most = Math.max(...book.states.map((s) => s.active));
    return book.states.map((s, i) => ({ code: s.code, name: s.name, count: s.active, percent: Math.round((s.active / most) * 100), color: stateColors[Math.min(i, stateColors.length - 1)] as StateColor }));
  },
  note: { label: "Disclosure template", result: "Follows each state" },
};

export const repeatMerchants = {
  title: "Repeat merchants",
  subtitle: "First advance vs coming back",
  chip: (r: MerchantBook["repeat"]) => `${Math.round(r.lateFirst / r.lateRepeat)}× better`,
  first: (r: MerchantBook["repeat"]) => ({ label: ["Late payments", "first advance"], value: percent(r.lateFirst, 1) }),
  repeat: (r: MerchantBook["repeat"]) => ({ label: ["Late payments", "repeat merchant"], value: percent(r.lateRepeat, 1), barPercent: Math.round((r.lateRepeat / r.lateFirst) * 100) }),
  facts: (r: MerchantBook["repeat"]) => [
    { value: percent(r.secondAdvance), label: "take a 2nd advance" },
    { value: `${r.sizeMultiple}×`, label: "larger 2nd advance" },
  ],
  cta: { label: (ready: number) => `Open Renewals · ${ready} ready`, href: "/renewals" },
};

export const biggestBalances = {
  title: "Biggest balances",
  subtitle: "Where most of your money is, so no single merchant can hurt the book",
  /** how much of the book the five largest balances hold */
  chip: (balances: { left: Money }[], outstanding: Money) => `Top 5 = ${percent(balances.slice(0, 5).reduce((n, b) => n + b.left, 0) / outstanding)} of book`,
  rows: (balances: { name: string; left: Money }[], outstanding: Money) =>
    balances.slice(0, 3).map((b) => ({ name: b.name, balance: moneyK(b.left), share: percent(b.left / outstanding, 1), percent: Math.round((b.left / balances[0].left) * 100) })),
  note: (balances: { left: Money }[], outstanding: Money, c: Policy["concentration"]) => {
    const over = balances.filter((b) => b.left / outstanding > c.merchantMax).length;
    return over ? `${plural(over, "merchant")} above your ${percent(c.merchantMax)} limit per business.` : `No merchant is above your ${percent(c.merchantMax)} limit per business.`;
  },
};

const ownerFills = ["sand", "blue"] as const;

export const ownerGroups = {
  title: "Same owner, several businesses",
  intro: "Owners count once for risk, however many companies they run.",
  owners: (book: MerchantBook) =>
    book.ownerGroups.map((o, i) => ({ ini: o.initials, name: o.owner, businesses: o.businesses.join(", "), count: o.businesses.length, fill: ownerFills[i % ownerFills.length] })),
  link: { label: (n: number) => `See all ${n} owner groups`, href: "#" },
};

export const merchantsSections = { stats: "Portfolio at a glance", mix: "Portfolio mix", concentration: "Concentration and owner groups" };
