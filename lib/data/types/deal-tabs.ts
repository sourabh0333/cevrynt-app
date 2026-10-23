import type { IsoDateTime, Money } from "./common";
import type { ScorePart } from "./policy";

/*
 * What the deal tabs show, one record per deal and tab (DATA-PLAN.md, step
 * 7). Plain values only: dollars, ISO dates, "2026-06" months, counts and
 * shares; the tabs format them and work out percentages and averages.
 * Findings worded by the analysis (a finding's title, a check's note) are
 * data; labels and headings are in lib/copy.
 */

/** A statement month, "2026-06". */
export type YearMonth = string;

/** Where one check stands: clear, needs a look, or a number of open items. */
export type CheckState = { state: "ok" } | { state: "warn" } | { state: "open"; count: number };

/** The deal's checks, shown on the Summary and as the dots in the tab bar. */
export type DealChecks = Record<"cashFlow" | "positions" | "integrity" | "business" | "conditions" | "stacking", CheckState & { note: string }>;

/* ---------- Summary ---------- */

export type DealSummary = {
  score: {
    total: number;
    /** points per part; each part's maximum is the policy's weight */
    parts: { part: ScorePart; points: number }[];
    /** the part that holds the score back */
    holdsBack: ScorePart;
  };
  recommendation: {
    decision: "approve" | "counter" | "decline";
    /** what the broker asked for, as the recommendation was made against it */
    requested: Money;
    amount: Money;
    factor: number;
    termMonths: number;
    /** why it differs from the request, finishing "… below request because …" */
    reason: string;
  };
  /** month-over-month growth of true revenue, 0.031 */
  revenueGrowth: number;
  /** revenue the merchant stated on the application */
  statedRevenue: Money;
  balanceTrend: "steady" | "rising" | "falling";
  /** the findings that need a look; each opens the tab that explains it */
  findings: { title: string; detail: string; tone: "amber" | "red"; tab: "integrity" | "conditions" | "cash-flow" | "positions" | "business" }[];
  /** what was checked and found clear */
  clear: string[];
  timeline: { at: IsoDateTime; text: string; kind: "done" | "attention" | "upcoming" }[];
  /** suggested questions for Ask about this deal */
  prompts: string[];
};

/* ---------- Cash flow ---------- */

export type SetAsideKind = "related" | "transfer" | "refund";

export type StatementMonth = {
  month: YearMonth;
  pages: number;
  deposits: Money;
  trueRevenue: Money;
  withdrawals: Money;
  debtPayments: Money;
  avgBalance: Money;
  lowestBalance: Money;
  nsfs: number;
  daysBelowZero: number;
};

export type TxCategory = "sales" | "cash" | "apps" | "wholesale" | "transfer" | "related" | "mca" | "payroll" | "vendor" | "rent";
export type TxKind = "in" | "out" | "debt";

export type Transaction = {
  at: IsoDateTime;
  description: string;
  note: string;
  category: TxCategory;
  /** signed: money in is positive */
  amount: number;
  balance: Money;
  /** statement page */
  page: number;
  kind: TxKind;
  flagged: boolean;
};

export type DealCashFlow = {
  bank: { name: string; last4: string; holder: string; holderMatches: boolean };
  months: StatementMonth[];
  linesRead: number;
  linesToReview: number;
  balancesMatch: boolean;
  /** money set aside before scoring */
  setAside: { kind: SetAsideKind; amount: Money; count: number; at?: IsoDateTime }[];
  loanProceeds: Money;
  /** true revenue per business day, from the statements */
  revenuePerBusinessDay: Money;
  /** the lowest end-of-day balance and when */
  lowestBalance: { amount: Money; at: IsoDateTime; after: string };
  avgDailyBalance: Money;
  /** end-of-day balance, one per day of the statement period */
  dailyBalances: number[];
  /** money in and out per week, in dollars; `related` marks the week with the related-business transfer */
  weeks: { in: number; out: number; related?: boolean }[];
  biggestWeeklyDrop: Money;
  cashCushionDays: number;
  sources: { label: string; share: number; customer?: boolean }[];
  cardSales: { processor: string; months: { month: YearMonth; amount: Money }[]; perDay: Money; splitPossible: boolean };
  /** average deposits by weekday, Mon–Sun, as a share of the busiest */
  weekdays: number[];
  weekendShare: number;
  transactions: Transaction[];
  /** counts across the whole file (the list shows a page of it) */
  transactionCounts: { all: number; in: number; out: number; debt: number; flagged: number };
};

/* ---------- Positions & debt ---------- */

export type DealPosition = {
  funder: string;
  kind: "mca" | "loan";
  knownFunder: boolean;
  disclosed: boolean;
  /** how the debit reads on the statements */
  descriptor: string;
  dailyPayment: Money;
  /** debits seen per month on the statements */
  perMonth: Money;
  startedAt: IsoDateTime;
  uccFiled: boolean;
  estBalance: Money;
  estPayoffAt: IsoDateTime;
  estOriginal: Money;
  /** the factor the estimates assume */
  estFactor: number;
  history: { from: IsoDateTime; to: IsoDateTime; holidays: string[]; bounced: string[] };
  patterns: string[];
};

export type DealPositions = {
  positions: DealPosition[];
  otherLoans: number;
  /** open advances the application listed */
  statedAdvances: number;
  /** signs of new advances found; the checks behind them follow */
  stackingSigns: number;
  stacking: { label: string; detail?: string; result: string; done: boolean }[];
  statedVsFound: { question: string; stated: string; found: string; result: "match" | "close" | "mismatch"; numeric?: boolean }[];
  recurringPayees: { label: string; count: number; advance?: boolean }[];
  otherDebt: { category: string; found: boolean }[];
  cardAutopay: Money;
};
