/**
 * Sample data for the Cash flow tab, copied from
 * design/prototypes/Deal-CashFlow.dc.html (look: design/Deal-CashFlow.html).
 * Real API calls replace this later behind the same types.
 */

/** Striped fills for money that is set aside before scoring. */
export type SetAsideKind = "related" | "transfer" | "refund";

export type SetAsideTile = {
  kind: SetAsideKind;
  label: string;
  amount: string;
  note: string;
  href: string;
  /** the row that holds the score back */
  warn?: boolean;
};

export const revenueMath = {
  title: "From deposits to true revenue",
  subtitle: "Money that isn't real sales is set aside before anything is scored",
  monthly: { value: "$61.4K", unit: "a month" },
  deposited: "$269.8K",
  trueRevenue: "$245.6K",
  countsChip: "91% counts as sales",
  /** flex shares of the breakdown bar, in order */
  bar: {
    aria: "Of $269.8K deposited: true revenue 91%, related business 4.4%, own transfers 3.6%, refunds 1%",
    revenue: { label: "True revenue · 91%", share: 91 },
    setAside: [
      { kind: "related", share: 4.4 },
      { kind: "transfer", share: 3.6 },
      { kind: "refund", share: 1 },
    ] as { kind: SetAsideKind; share: number }[],
  },
  tiles: [
    { kind: "related", label: "Related business", amount: "−$12.0K", note: "1 transfer · Aug 14", href: "#transactions", warn: true },
    { kind: "transfer", label: "Own transfers", amount: "−$9.6K", note: "6 from owner savings", href: "#transactions" },
    { kind: "refund", label: "Refunds", amount: "−$2.6K", note: "4 card reversals", href: "#transactions" },
  ] as SetAsideTile[],
  loanProceeds: { label: "Loan proceeds", amount: "$0", note: "None found" },
  shares: {
    title: "Share counted as sales, each month",
    hint: "August is lower because of the $12K transfer",
    months: [
      { month: "June", pct: "95%", counted: 95.4, text: "$58.2K of $61.0K" },
      { month: "July", pct: "95%", counted: 94.8, text: "$60.1K of $63.4K" },
      { month: "August", pct: "81%", counted: 81.3, text: "$63.5K of $78.1K", warn: true },
      { month: "September", pct: "95%", counted: 94.8, text: "$63.8K of $67.3K" },
    ] as { month: string; pct: string; counted: number; text: string; warn?: boolean }[],
  },
};

export const statements = {
  title: "Statements",
  chip: "All reconcile",
  bank: {
    name: "Chase Business",
    masked: "•••• •••• 7712",
    holderCap: "Account holder",
    holder: "Harbor Street Bakery LLC",
    match: "Matches application",
  },
  coverage: { label: "Coverage", value: "4 of 4 months · no gaps" },
  months: [
    { label: "Jun", pages: "6 pages", href: "#transactions" },
    { label: "Jul", pages: "5 pages", href: "#transactions" },
    { label: "Aug", pages: "7 pages", href: "#transactions" },
    { label: "Sep", pages: "7 pages", href: "#transactions" },
  ],
  quality: ["Balances match", "1,284 lines read", "0 lines need review"],
  actions: { primary: "Connect bank to verify", secondary: "Add statement" },
};

export type MonthRow = {
  month: string;
  /** small chip after the month name */
  tag?: string;
  deposits: string;
  trueRevenue: string;
  withdrawals: string;
  debt: string;
  avgBalance: string;
  lowest: string;
  nsfs: string;
  /** the month with the related-business transfer */
  warn?: boolean;
};

export const monthTable = {
  title: "Month by month",
  hint: "Every figure links to the transactions behind it",
  exportLabel: "Export CSV",
  columns: ["Month", "Deposits", "True revenue", "Withdrawals", "Debt payments", "Avg balance", "Lowest", "NSFs"],
  rows: [
    { month: "June", deposits: "$61.0K", trueRevenue: "$58.2K", withdrawals: "$57.4K", debt: "$6.0K", avgBalance: "$9.1K", lowest: "$3.4K", nsfs: "0" },
    { month: "July", deposits: "$63.4K", trueRevenue: "$60.1K", withdrawals: "$59.9K", debt: "$6.3K", avgBalance: "$10.2K", lowest: "$4.1K", nsfs: "0" },
    { month: "August", tag: "$12K excluded", deposits: "$78.1K", trueRevenue: "$63.5K", withdrawals: "$74.0K", debt: "$6.0K", avgBalance: "$8.9K", lowest: "$1.2K", nsfs: "0", warn: true },
    { month: "September", deposits: "$67.3K", trueRevenue: "$63.8K", withdrawals: "$64.9K", debt: "$6.0K", avgBalance: "$11.0K", lowest: "$5.6K", nsfs: "0" },
  ] as MonthRow[],
  average: { month: "Monthly avg", deposits: "$67.5K", trueRevenue: "$61.4K", withdrawals: "$64.1K", debt: "$6.1K", avgBalance: "$9.8K", lowest: "$1.2K", nsfs: "0" } as MonthRow,
};

export const roomToPay = {
  title: "Room to pay",
  subtitle: "Per business day, with the recommended offer",
  perDay: { label: "True revenue a day", value: "$2,830" },
  /** shares of the day's revenue, in bar order */
  parts: [
    { key: "existing", label: "Existing advance", value: "$285", share: 10.1 },
    { key: "offer", label: "Recommended offer", value: "$419", share: 14.8 },
    { key: "left", label: "Left for the business", value: "$2,126", share: 75.1 },
  ] as { key: "existing" | "offer" | "left"; label: string; value: string; share: number }[],
  note: { before: "All payments together take ", strong: "25% of revenue", after: ". Your policy allows up to 65%." },
};

/* ---------- Bottom half: weekly chart, sources, card sales, days, transactions ---------- */

export const weeklyCash = {
  title: "Cash in and out, week by week",
  subtitle: "17 weeks · money in above the line, money out below",
  legend: { in: "In", out: "Out", net: "Net" },
  aria: "Weekly money in and money out from June to September. In and out stay close, more comes in than goes out in 9 of 17 weeks. The August 14 week includes the $12K related-business transfer.",
  flag: "+$12K related",
  axis: ["$25K", "$0", "$25K"],
  months: [
    { label: "June", x: 80 },
    { label: "July", x: 215 },
    { label: "August", x: 365 },
    { label: "September", x: 515 },
  ],
  stats: [
    { label: "Weeks with more in than out", value: "9 of 17" },
    { label: "Biggest weekly drop", value: "−$3.9K" },
    { label: "Cash cushion", value: "3.5 days" },
  ],
};

export type WeekBar = { x: number; in: number; out: number; netY: number; flag: boolean };

/**
 * The 17 weeks from the prototype's script: money in and out in thousands
 * (a deterministic sample), scaled so $25K is 88 units either side of the
 * baseline at y 115. Week 8 carries the $12K related-business transfer and
 * week 11 a heavy payroll week.
 */
export function weeklyBars(): WeekBar[] {
  const W = 17, x0 = 34, step = 33.4, base = 115, k = 88 / 25;
  const bars: WeekBar[] = [];
  for (let i = 0; i < W; i++) {
    let vin = 14.2 + 1.1 * Math.sin(i * 0.9) + i * 0.08;
    let vout = 14.6 + 1.3 * Math.sin(i * 1.3 + 2) + i * 0.05;
    if (i === 10) vout += 3.4;
    if (i === 7) { vin += 12; vout += 1.2; }
    const x = x0 + i * step;
    bars.push({
      x,
      in: vin * k,
      out: vout * k,
      netY: base - Math.max(-30, Math.min(30, (vin - vout) * k * 3)),
      flag: i === 7,
    });
  }
  return bars;
}
export const weekGeometry = { barWidth: 18, base: 115 };

export type SourceColor = "teal-ink" | "teal" | "teal-soft" | "amber" | "mint" | "line-dash-soft";

export const moneySources = {
  title: "Where money comes from",
  chip: "Well spread",
  sources: [
    { label: "Card sales · Square", share: 46, color: "teal-ink" },
    { label: "Cash deposits", share: 21, color: "teal" },
    { label: "Delivery apps · DoorDash", share: 12, color: "teal-soft" },
    { label: "Bayside Café Group (wholesale)", share: 9, color: "amber" },
    { label: "Delivery apps · Uber Eats", share: 5, color: "mint" },
    { label: "Other", share: 7, color: "line-dash-soft" },
  ] as { label: string; share: number; color: SourceColor }[],
  note: "Largest single customer is 9% of revenue. Losing one customer would not hurt repayment.",
};

export const cardSales = {
  title: "Card sales",
  chip: "Split funding possible",
  value: "$28.2K",
  unit: "/mo",
  hint: "Settled by Square every business day, about $930 a day",
  aria: "Card sales by month: June 26.8 thousand, July 27.5, August 29.1, September 29.4",
  /** bar heights out of 80 in the 260×110 box; the last month is teal */
  months: [
    { label: "Jun", height: 73 },
    { label: "Jul", height: 75 },
    { label: "Aug", height: 79 },
    { label: "Sep", height: 80 },
  ],
  note: "Steady card volume means repayment could be taken straight from card sales instead of the bank account.",
};

export const busiestDays = {
  title: "Busiest days",
  subtitle: "Average deposits by weekday",
  /** percent of the tallest day; weekend days use the mint fills */
  days: [
    { label: "Mon", height: 52, tone: "quiet" },
    { label: "Tue", height: 58, tone: "quiet" },
    { label: "Wed", height: 61, tone: "quiet" },
    { label: "Thu", height: 66, tone: "quiet" },
    { label: "Fri", height: 84, tone: "soft" },
    { label: "Sat", height: 100, tone: "peak" },
    { label: "Sun", height: 72, tone: "soft" },
  ] as { label: string; height: number; tone: "quiet" | "soft" | "peak" }[],
  note: "Weekends bring 38% of deposits. Daily payments on Mondays will still clear.",
};

export type TxCategory = "sales" | "cash" | "apps" | "wholesale" | "transfer" | "related" | "mca" | "payroll" | "vendor" | "rent";
export type TxKind = "in" | "out" | "debt";
export type TxFilter = "all" | TxKind | "flag";

export type Transaction = {
  date: string;
  desc: string;
  note: string;
  category: TxCategory;
  amount: number;
  balance: string;
  source: string;
  kind: TxKind;
  flag?: boolean;
};

export const txCategories: Record<TxCategory, { label: string; tone: "green" | "neutral" | "amber" | "purple" }> = {
  sales: { label: "Card sales", tone: "green" },
  cash: { label: "Cash deposit", tone: "green" },
  apps: { label: "Delivery app", tone: "green" },
  wholesale: { label: "Wholesale", tone: "green" },
  transfer: { label: "Own transfer", tone: "neutral" },
  related: { label: "Related business", tone: "amber" },
  mca: { label: "MCA payment", tone: "purple" },
  payroll: { label: "Payroll", tone: "neutral" },
  vendor: { label: "Supplier", tone: "neutral" },
  rent: { label: "Rent", tone: "neutral" },
};

export const transactions = {
  title: "Transactions",
  hint: "1,284 lines from 4 statements. Click any line to see it on the statement page.",
  searchPlaceholder: "Search description or amount",
  columns: ["Date", "Description", "Category", "Amount", "Balance", "Source"],
  filters: [
    { key: "all", label: "All", count: "1,284" },
    { key: "in", label: "Money in", count: "597" },
    { key: "out", label: "Money out", count: "601" },
    { key: "debt", label: "Debt payments", count: "85" },
    { key: "flag", label: "Flagged", count: "3" },
  ] as { key: TxFilter; label: string; count: string }[],
  rows: [
    { date: "Sep 30", desc: "SQUARE INC DEPOSIT", note: "Card settlement", category: "sales", amount: 1184.2, balance: "$13,920", source: "p. 7", kind: "in" },
    { date: "Sep 30", desc: "KINGSWAY CAPITAL ACH DEBIT", note: "Existing advance · disclosed", category: "mca", amount: -285, balance: "$12,736", source: "p. 7", kind: "debt" },
    { date: "Sep 29", desc: "DOORDASH PAYOUT", note: "Weekly payout", category: "apps", amount: 2140.55, balance: "$13,021", source: "p. 7", kind: "in" },
    { date: "Sep 29", desc: "SYSCO PORTLAND", note: "Ingredients", category: "vendor", amount: -3412.8, balance: "$10,880", source: "p. 7", kind: "out" },
    { date: "Sep 26", desc: "COUNTER DEPOSIT", note: "Cash", category: "cash", amount: 2650, balance: "$14,293", source: "p. 6", kind: "in" },
    { date: "Sep 15", desc: "BAYSIDE CAFE GROUP ACH", note: "Wholesale invoice", category: "wholesale", amount: 4980, balance: "$15,102", source: "p. 4", kind: "in" },
    { date: "Sep 1", desc: "COMMERCIAL ST PROPERTIES", note: "Monthly rent", category: "rent", amount: -4600, balance: "$9,455", source: "p. 1", kind: "out" },
    { date: "Aug 14", desc: "TRANSFER FROM HARBOR ST CATERING", note: "Same owner · left out of true revenue", category: "related", amount: 12000, balance: "$20,268", source: "p. 3", kind: "in", flag: true },
    { date: "Aug 2", desc: "GUSTO PAYROLL", note: "Lowest balance of the period follows", category: "payroll", amount: -8420, balance: "$1,208", source: "p. 1", kind: "out", flag: true },
    { date: "Jul 18", desc: "ONLINE TRANSFER FROM ••4410", note: "Owner savings · left out of true revenue", category: "transfer", amount: 2500, balance: "$11,630", source: "p. 3", kind: "in", flag: true },
  ] as Transaction[],
  actions: { export: "Export CSV", more: "Load more" },
};

/** "+$1,184.20" / "−$285.00", as the prototype formats amounts. */
export const formatAmount = (n: number) =>
  (n < 0 ? "−$" : "+$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
