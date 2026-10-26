/**
 * Interface wording for the deal Cash flow tab (design/Deal-CashFlow.html).
 * The statements, months, weeks, sources and transactions come from the
 * data layer (dealTabsView); this file turns their plain values into what
 * people read.
 */
import type { SetAsideKind, TxCategory, TxKind } from "@/lib/data/types";
import { dateLong, dateShort, money, moneyK, moneyK1, moneyShort, monthName, percent, plural } from "@/lib/format";

const setAsideLabel: Record<SetAsideKind, string> = { related: "Related business", transfer: "Own transfers", refund: "Refunds" };
const setAsideAria: Record<SetAsideKind, string> = { related: "related business", transfer: "own transfers", refund: "refunds" };

export const revenueMathCopy = {
  title: "From deposits to true revenue",
  subtitle: "Money that isn't real sales is set aside before anything is scored",
  monthlyUnit: "a month",
  deposited: "Deposited",
  trueRevenue: "True revenue",
  counts: (share: number) => `${percent(share)} counts as sales`,
  barLabel: (share: number) => `True revenue · ${percent(share)}`,
  barAria: (deposited: number, counted: number, parts: { kind: SetAsideKind; share: number }[]) =>
    `Of ${moneyK1(deposited)} deposited: true revenue ${percent(counted)}, ${parts.map((p) => `${setAsideAria[p.kind]} ${p.share}%`).join(", ")}`,
  tile: {
    label: (kind: SetAsideKind) => setAsideLabel[kind],
    amount: (amount: number) => `−${moneyK(amount)}`,
    note: (kind: SetAsideKind, count: number, at?: string) =>
      kind === "related" ? `${plural(count, "transfer")}${at ? ` · ${dateShort(at)}` : ""}` : kind === "transfer" ? `${count} from owner savings` : plural(count, "card reversal"),
  },
  loanProceeds: { label: "Loan proceeds", none: "None found", found: "Counted as debt, not sales" },
  shares: {
    title: "Share counted as sales, each month",
    hint: (month: string, amount: number) => `${monthName(month, "long")} is lower because of the ${moneyShort(amount)} transfer`,
    text: (trueRevenue: number, deposits: number) => `${moneyK(trueRevenue)} of ${moneyK(deposits)}`,
  },
  transactionsHref: "#transactions",
};

export const statementsCopy = {
  title: "Statements",
  reconciled: "All reconcile",
  toCheck: (n: number) => `${plural(n, "line")} to check`,
  masked: (last4: string) => `•••• •••• ${last4}`,
  holderCap: "Account holder",
  match: "Matches application",
  noMatch: "Name differs from application",
  coverage: { label: "Coverage", value: (n: number) => `${n} of ${plural(n, "month")} · no gaps` },
  monthAria: "Reconciled",
  pages: (n: number) => `${plural(n, "page")}`,
  quality: (balancesMatch: boolean, lines: number, toReview: number) => [
    balancesMatch ? "Balances match" : "Balances don't match",
    `${lines.toLocaleString("en-US")} lines read`,
    `${plural(toReview, "line")} need review`,
  ],
  actions: { primary: "Connect bank to verify", secondary: "Add statement" },
};

export const monthTableCopy = {
  title: "Month by month",
  hint: "Every figure links to the transactions behind it",
  exportLabel: "Export CSV",
  columns: ["Month", "Deposits", "True revenue", "Withdrawals", "Debt payments", "Avg balance", "Lowest", "NSFs"],
  excluded: (amount: number) => `${moneyShort(amount)} excluded`,
  average: "Monthly avg",
};

export const roomToPayCopy = {
  title: "Room to pay",
  subtitle: "Per business day, with the recommended offer",
  perDay: "True revenue a day",
  parts: { existing: "Existing advance", offer: "Recommended offer", left: "Left for the business" },
  note: {
    before: "All payments together take ",
    strong: (share: number) => `${percent(share)} of revenue`,
    after: (maxShare: number) => `. Your policy allows up to ${percent(maxShare)}.`,
  },
};

export const weeklyCopy = {
  title: "Cash in and out, week by week",
  subtitle: (weeks: number) => `${plural(weeks, "week")} · money in above the line, money out below`,
  legend: { in: "In", out: "Out", net: "Net" },
  aria: (first: string, last: string, more: number, weeks: number, relatedAt: string, related: number) =>
    `Weekly money in and money out from ${monthName(first, "long")} to ${monthName(last, "long")}. In and out stay close, more comes in than goes out in ${more} of ${plural(weeks, "week")}. The ${dateLong(relatedAt)} week includes the ${moneyShort(related)} related-business transfer.`,
  flag: (amount: number) => `+${moneyShort(amount)} related`,
  stats: {
    more: { label: "Weeks with more in than out", value: (more: number, weeks: number) => `${more} of ${weeks}` },
    drop: { label: "Biggest weekly drop", value: (amount: number) => `−${moneyK(amount)}` },
    cushion: { label: "Cash cushion", value: (days: number) => `${plural(days, "day")}` },
  },
};

export const sourcesCopy = {
  title: "Where money comes from",
  spread: "Well spread",
  concentrated: "Concentrated",
  note: (largest: number) =>
    largest < 20
      ? `Largest single customer is ${largest}% of revenue. Losing one customer would not hurt repayment.`
      : `Largest single customer is ${largest}% of revenue. Losing them would hurt repayment.`,
};

export const cardSalesCopy = {
  title: "Card sales",
  split: "Split funding possible",
  noSplit: "Bank account only",
  unit: "/mo",
  hint: (processor: string, perDay: number) => `Settled by ${processor} every business day, about ${money(perDay)} a day`,
  aria: (months: { month: string; amount: number }[]) =>
    `Card sales by month: ${months.map((m, i) => `${monthName(m.month, "long")} ${(m.amount / 1000).toFixed(1)}${i === 0 ? " thousand" : ""}`).join(", ")}`,
  note: "Steady card volume means repayment could be taken straight from card sales instead of the bank account.",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const busiestDaysCopy = {
  title: "Busiest days",
  subtitle: "Average deposits by weekday",
  days: WEEKDAYS,
  aria: (busiest: number) => `Average deposits by weekday, ${WEEKDAYS_LONG[busiest]} the busiest`,
  note: (weekendShare: number) => `Weekends bring ${percent(weekendShare)} of deposits. Daily payments on Mondays will still clear.`,
};

export const txCategoryLabel: Record<TxCategory, string> = {
  sales: "Card sales",
  cash: "Cash deposit",
  apps: "Delivery app",
  wholesale: "Wholesale",
  transfer: "Own transfer",
  related: "Related business",
  mca: "MCA payment",
  payroll: "Payroll",
  vendor: "Supplier",
  rent: "Rent",
};

export type TxFilter = "all" | TxKind | "flag";

/** "+$1,184.20" / "−$285.00" */
export const formatAmount = (n: number) => (n < 0 ? "−$" : "+$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const transactionsCopy = {
  title: "Transactions",
  hint: (lines: number, statements: number) => `${lines.toLocaleString("en-US")} lines from ${plural(statements, "statement")}. Click any line to see it on the statement page.`,
  searchLabel: "Search transactions",
  searchPlaceholder: "Search description or amount",
  filterLabel: "Show",
  filters: [
    { key: "all", label: "All" },
    { key: "in", label: "Money in" },
    { key: "out", label: "Money out" },
    { key: "debt", label: "Debt payments" },
    { key: "flag", label: "Flagged" },
  ] as { key: TxFilter; label: string }[],
  columns: ["Date", "Description", "Category", "Amount", "Balance", "Source"],
  page: (n: number) => `p. ${n}`,
  empty: "No lines match. Try another word or filter.",
  showing: (n: number, total: string) => `Showing ${n} of ${total}`,
  actions: { export: "Export CSV", more: "Load more" },
};
