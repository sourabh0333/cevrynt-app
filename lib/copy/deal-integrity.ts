/**
 * Interface wording for the deal Integrity tab (design/Deal-Integrity.html).
 * The checks, evidence and signals come from the data layer
 * (integrityTabView); this file words them and turns statement lines,
 * months and amounts into what people read.
 */
import type { DealIntegrity, DocTest, EvidenceItem, StatementLine } from "@/lib/data/types";
import { money, monthName, percent } from "@/lib/format";

const riskWords: Record<DealIntegrity["risk"], string> = { low: "low", medium: "medium", high: "high" };

export const verdictCopy = {
  risk: (risk: DealIntegrity["risk"]) => `Fraud risk: ${riskWords[risk]}`,
  of: (outOf: number) => `of ${outOf}`,
  ringLabel: (score: number, outOf: number) => `Integrity ${score} of ${outOf}`,
};

export const checkedCopy = {
  title: "What was checked",
  tiles: { documents: "documents", lines: "lines verified", review: "to review" },
  note: (seconds: number) => `Checked in ${seconds} seconds when the package arrived.`,
};

export const documentChecksCopy = {
  title: "Document checks",
  subtitle: "Each file is tested five ways. A dash means the test doesn't apply to that file.",
  chip: { pass: "All passed", fail: "Needs a look" },
  /** the five tests, in column order */
  tests: ["edits", "layout", "math", "history", "ai"] as DocTest[],
  columns: ["Document", "No edits", "Real layout", "Math adds up", "File history", "Not AI-made"],
};

/** "+1,042.10", "-285.00", as the statement prints them */
const statementNumber = (n: number) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const evidenceCopy = {
  title: "Evidence",
  subtitle: "The exact line on the statement, for each item",
  switcherLabel: "Choose an item",
  statement: {
    account: (last4: string, holder: string) => `Account ••${last4} · ${holder}`,
    section: "Transactions",
    columns: ["DATE", "DESCRIPTION", "AMOUNT", "BALANCE"],
    footer: "Matches the bank's own total",
  },
  /** "Aug 2026 · p. 3 of 7" */
  page: (it: EvidenceItem, pages: number) => `${monthName(it.month)} ${it.month.slice(0, 4)} · p. ${it.page} of ${pages}`,
  line: (l: StatementLine) => ({
    date: `${l.date.slice(5, 7)}/${l.date.slice(8, 10)}`,
    amount: (l.amount < 0 ? "-" : "+") + statementNumber(l.amount),
    balance: statementNumber(l.balance),
  }),
  lineOf: (line: number, count: number) => `Line ${line} of ${count}`,
  tag: { excluded: "Left out of revenue", none: "No action needed" } as Record<EvidenceItem["outcome"], string>,
  impactLabel: { revenue: "Effect on true revenue", lowest: "Lowest balance" } as Record<EvidenceItem["impact"]["kind"], string>,
  /** "−$12,000", "$1,208" */
  impact: (n: number) => (n < 0 ? "−" : "") + money(Math.abs(n)),
  actions: { open: "Open page", note: "Add note" },
};

type PatternRow = { label: string; detail: string; result: string; status: "clear" | "explained" };

const noneOr = (n: number) => (n ? String(n) : "None");
const jumpWords: Record<DealIntegrity["patterns"]["jumpBeforeApplying"], string> = { none: "None", explained: "Explained", found: "Found" };

export const patternCopy = {
  title: "Pattern checks",
  help: { label: "How they work", href: null },
  subtitle: "Habits that often come with fraud",
  summary: (clear: number, explained: number) => (explained ? `${clear} clear, ${explained} explained` : `${clear} clear`),
  ringLabel: (clear: number, total: number) => `${clear} of ${total} checks clear`,
  meterLabel: (share: number, flagAt: number) => `${share}% round-dollar deposits, flagged at ${flagAt}%`,
  flagAt: (flagAt: number) => `Flag at ${flagAt}%`,
  explained: "Explained",
  /** the six checks, in design order */
  rows: (p: DealIntegrity["patterns"]): PatternRow[] => [
    { label: "Round-dollar deposits", detail: "Deposits in even amounts", result: percent(p.roundDollar.share), status: p.roundDollar.share < p.roundDollar.flagAt ? "clear" : "explained" },
    { label: "Cash just under $10K", detail: "Avoiding bank reporting", result: noneOr(p.cashUnder10k), status: p.cashUnder10k ? "explained" : "clear" },
    { label: "Duplicate deposits", detail: "Same amount, same day, twice", result: noneOr(p.duplicates), status: p.duplicates ? "explained" : "clear" },
    { label: "In and straight out", detail: "Money passing through in a day", result: noneOr(p.passThrough), status: p.passThrough ? "explained" : "clear" },
    { label: "Holiday deposits", detail: "Deposits when banks are closed", result: noneOr(p.holidayDeposits), status: p.holidayDeposits ? "explained" : "clear" },
    { label: "Jump before applying", detail: "Revenue spike right before", result: jumpWords[p.jumpBeforeApplying], status: p.jumpBeforeApplying === "none" ? "clear" : "explained" },
  ],
  /** the jump check's link to the transfer that explains it */
  jumpLink: (amount: number) => `See the ${money(amount)} transfer`,
};

export const signalsCopy = {
  title: "Application signals",
  subtitle: "How the application reached you, and who sent it",
  chip: "Nothing unusual",
};

const firstName = (name: string) => name.split(" ")[0];

export const liveBankCopy = {
  chip: { open: "Not done yet", done: "Connected" },
  title: "Compare with live bank data",
  text: (owner: string, possessive: string) =>
    `When ${firstName(owner)} connects ${possessive} bank, every statement line is matched against the bank's own record. Any line changed in the PDF shows up straight away.`,
  send: (owner: string) => `Send bank link to ${firstName(owner)}`,
  skip: "Skip for this deal",
};

export const reviewCopy = {
  title: "Your review",
  chip: { open: "Needs your sign-off", done: "Done" },
  check: (subject: string) => `I've looked at the ${subject}`,
  note: { label: "Note for the file", placeholder: "Anything the next reviewer should know" },
  hint: "Saved to the deal's activity with your name and time.",
  recorded: (time: string, reviewer: string) => `Recorded at ${time} by ${reviewer}.`,
  button: { open: "Mark integrity reviewed", done: (reviewer: string) => `Reviewed by ${reviewer}` },
};

export const integritySections = { evidence: "Evidence and pattern checks", review: "Live bank data and your review", verdict: "Integrity verdict" };
