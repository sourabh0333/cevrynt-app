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
