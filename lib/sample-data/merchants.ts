/**
 * Sample data for the Merchants page, copied from
 * design/prototypes/Merchants.dc.html (look: design/Merchants.html).
 * Real API calls replace this later behind the same types.
 */

export const merchantsHeader = {
  title: "Merchants",
  line: "312 businesses · 86 with an active advance",
};

export type MerchantStatTone = "mint" | "grey" | "cream" | "red" | "stone";

export const merchantStats: { label: string; value: string; note?: string; bar?: number; tone: MerchantStatTone; noteStrong?: boolean }[] = [
  { label: "Active advances", value: "86", note: "$4.9M still to collect", tone: "mint" },
  { label: "Paying on time", value: "94%", bar: 94, tone: "grey" },
  { label: "Ready to renew", value: "9", note: "Paid 50% or more, performing well", tone: "cream", noteStrong: true },
  { label: "On watch", value: "5", note: "Late payments or stacking alerts", tone: "red" },
  { label: "Come back for more", value: "38%", note: "Of merchants take a 2nd advance", tone: "stone" },
];

export type Relationship = "active" | "renew" | "review" | "watch" | "declined" | "new";
export type Segment = "all" | Relationship | "blocked";
export type HistoryTone = "g" | "d" | "a" | "r";

export type Merchant = {
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

export const relationships: Record<Relationship, string> = {
  active: "Active advance",
  renew: "Ready to renew",
  review: "In review",
  watch: "On watch",
  declined: "Declined",
  new: "Just funded",
};

export const segments: { key: Segment; label: string; count: number }[] = [
  { key: "all", label: "All", count: 312 },
  { key: "active", label: "Active advance", count: 86 },
  { key: "renew", label: "Ready to renew", count: 9 },
  { key: "watch", label: "On watch", count: 5 },
  { key: "review", label: "In review", count: 28 },
  { key: "declined", label: "Declined", count: 41 },
  { key: "blocked", label: "Blocked", count: 3 },
];

/** "Active advance" also shows the just-funded and ready-to-renew merchants, as in the prototype. */
export const inSegment = (m: Merchant, seg: Segment) =>
  seg === "all" || m.rel === seg || (seg === "active" && (m.rel === "new" || m.rel === "renew"));

export const merchantList = {
  title: "All merchants",
  search: { label: "Search merchants", placeholder: "Business, owner, EIN or phone" },
  columns: ["Merchant", "Relationship", "Deals", "Balance left", "Health", "Last activity"],
  total: 312,
  showing: (n: number, total: number) => `Showing ${n} of ${total}`,
  export: "Export",
  blocked: {
    title: "3 merchants are blocked",
    text: "Blocked for confirmed fraud. New applications from them, their owners or bank accounts are stopped at intake.",
  },
  startSelected: "CD",
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

export const merchants: Merchant[] = [
  {
    ini: "CD", g: ["#24588A", "#4F86BD"], name: "Coastal Dental Group", industry: "Dental", state: "ME", rel: "renew", deals: "3 · 2 funded", balance: "$25.5K", paid: 72, health: 92, last: "Renewal accepted", owner: "Dr. Ana Ruiz", funded: "$130K",
    note: "Revenue is up 18% since funding and every payment has cleared. Renewal of $80K is accepted.",
    history: [
      { title: "Renewal accepted", detail: "$80,000 · Apex Funding", year: "2026", tone: "g" },
      { title: "Current advance, 72% paid", detail: "$70,000 · 1.30 factor", year: "2026", tone: "g" },
      { title: "First advance, paid off early", detail: "$60,000 · 8 months", year: "2025", tone: "d" },
    ],
  },
  {
    ini: "HB", g: ["#0E6B5C", "#3FA58C"], name: "Harbor Street Bakery LLC", industry: "Bakery", state: "ME", rel: "review", deals: "1 · in review", balance: "—", paid: 0, health: 88, last: "Today, 10:20", owner: "Elena Brooks", funded: "$0",
    note: "First deal with you. Recommended $40,000; decision due today.",
    history: [{ title: "Application in review", detail: "$45,000 requested · Apex Funding", year: "2026", tone: "a" }],
  },
  {
    ini: "BN", g: ["#57418A", "#8670B8"], name: "Bayview Nail Spa", industry: "Nail salon", state: "ME", rel: "new", deals: "1 · funded", balance: "$33.0K", paid: 0, health: 81, last: "Funded today", owner: "Linh Tran", funded: "$25K",
    note: "Funded this morning. First payment on Wednesday.",
    history: [{ title: "Funded", detail: "$25,000 · Summit Capital ISO", year: "2026", tone: "g" }],
  },
  {
    ini: "KP", g: ["#2C5F73", "#5A90A6"], name: "Kestrel Plumbing", industry: "Plumbing", state: "MA", rel: "active", deals: "1 · funded", balance: "$31.2K", paid: 48, health: 77, last: "Paid today", owner: "Sam Okafor", funded: "$45K",
    note: "On track. Close to the halfway point, so a renewal conversation can start soon.",
    history: [{ title: "Current advance, 48% paid", detail: "$45,000 · Keystone Brokerage", year: "2026", tone: "g" }],
  },
  {
    ini: "OD", g: ["#8A5A2B", "#B98552"], name: "Oakview Deli", industry: "Deli", state: "ME", rel: "renew", deals: "2 · 1 funded", balance: "$14.3K", paid: 64, health: 88, last: "Renewal offer sent", owner: "Rosa Marino", funded: "$30K",
    note: "Revenue steady, no missed payments. Renewal offer sent last week.",
    history: [
      { title: "Renewal offer sent", detail: "$35,000", year: "2026", tone: "a" },
      { title: "Current advance, 64% paid", detail: "$30,000", year: "2026", tone: "g" },
    ],
  },
  {
    ini: "MA", g: ["#A3341F", "#C2412D"], name: "Mesa Auto Repair", industry: "Auto repair", state: "AZ", rel: "watch", deals: "1 · in review", balance: "—", paid: 0, health: 54, last: "Stacking alert", owner: "Victor Salas", funded: "$0",
    note: "New UCC filing yesterday and a statement that does not reconcile. Review before any offer.",
    history: [
      { title: "Stacking alert", detail: "New UCC filing", year: "2026", tone: "r" },
      { title: "Application in review", detail: "$35,000 · BlueRock", year: "2026", tone: "a" },
    ],
  },
  {
    ini: "SR", g: ["#7A4A2A", "#B07A52"], name: "Summit Roofing LLC", industry: "Roofing", state: "NH", rel: "active", deals: "2 · 1 funded", balance: "—", paid: 100, health: 84, last: "Contract out", owner: "Mike Dunn", funded: "$70K",
    note: "Paid off a 2025 advance on time. New $90K contract waiting on a second signature.",
    history: [
      { title: "Contract out", detail: "$90,000 · 1 of 2 signed", year: "2026", tone: "a" },
      { title: "Paid off on time", detail: "$70,000", year: "2025", tone: "d" },
    ],
  },
  {
    ini: "LF", g: ["#3E4A46", "#6B7873"], name: "Lakeside Florist", industry: "Florist", state: "VT", rel: "declined", deals: "1 · declined", balance: "—", paid: 0, health: 0, last: "Declined today", owner: "June Park", funded: "$0",
    note: "Declined: revenue below your policy minimum. Can reapply in 90 days.",
    history: [{ title: "Declined", detail: "Revenue below policy minimum", year: "2026", tone: "r" }],
  },
];
