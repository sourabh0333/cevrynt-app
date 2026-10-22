/**
 * Sample data for the Integrity tab, copied from
 * design/prototypes/Deal-Integrity.dc.html (look: design/Deal-Integrity.html).
 * Real API calls replace this later behind the same types.
 */

export const verdict = {
  score: 16,
  outOf: 20,
  risk: "Fraud risk: low",
  title: "No signs of edited or fake documents",
  text: "Every statement matches Chase's real layout and its numbers add up. Points are held back only for one related-business transfer, already left out of revenue.",
};

export const whatWasChecked = {
  title: "What was checked",
  tiles: [
    { value: "7", label: "documents" },
    { value: "1,284", label: "lines verified" },
    { value: "1", label: "to review", attention: true },
  ] as { value: string; label: string; attention?: boolean }[],
  note: "Checked in 41 seconds when the package arrived.",
};

/** One test result per column: passed, or a dash when the test does not apply. */
export type DocTest = "pass" | "na";

export type DocumentCheck = {
  name: string;
  detail: string;
  tests: [DocTest, DocTest, DocTest, DocTest, DocTest];
};

export const documentChecks = {
  title: "Document checks",
  subtitle: "Each file is tested five ways. A dash means the test doesn't apply to that file.",
  chip: "All passed",
  columns: ["Document", "No edits", "Real layout", "Math adds up", "File history", "Not AI-made"],
  rows: [
    { name: "June statement", detail: "Chase ••7712 · 6 pages", tests: ["pass", "pass", "pass", "pass", "pass"] },
    { name: "July statement", detail: "Chase ••7712 · 5 pages", tests: ["pass", "pass", "pass", "pass", "pass"] },
    { name: "August statement", detail: "Chase ••7712 · 7 pages", tests: ["pass", "pass", "pass", "pass", "pass"] },
    { name: "September statement", detail: "Chase ••7712 · 7 pages", tests: ["pass", "pass", "pass", "pass", "pass"] },
    { name: "Signed application", detail: "PDF · e-signed", tests: ["pass", "na", "na", "pass", "pass"] },
    { name: "Owner photo ID", detail: "Maine driver licence", tests: ["pass", "pass", "na", "pass", "pass"] },
    { name: "Voided check", detail: "Phone photo", tests: ["pass", "pass", "na", "na", "pass"] },
  ] as DocumentCheck[],
};

export type EvidenceTone = "amber" | "grey" | "mint";

export type StatementLine = { date: string; desc: string; amount: string; balance: string };

export type EvidenceItem = {
  title: string;
  /** dot colour in the switcher and the colour of the highlighted line */
  tone: "amber" | "grey";
  page: string;
  /** index of the highlighted line */
  highlight: number;
  line: number;
  count: number;
  tag: { text: string; tone: EvidenceTone };
  why: string;
  impactLabel: string;
  impact: string;
  lines: StatementLine[];
};

const line = (l: [string, string, string, string]): StatementLine => ({ date: l[0], desc: l[1], amount: l[2], balance: l[3] });

export const evidence = {
  title: "Evidence",
  subtitle: "The exact line on the statement, for each item",
  switcherLabel: "Choose an item",
  statement: {
    bank: "Chase Business Complete",
    account: "Account ••7712 · Harbor Street Bakery LLC",
    section: "Transactions",
    columns: ["DATE", "DESCRIPTION", "AMOUNT", "BALANCE"],
    footer: "Matches the bank's own total",
  },
  actions: { open: "Open page", note: "Add note" },
  items: [
    {
      title: "Related-business transfer",
      tone: "amber",
      page: "Aug 2026 · p. 3 of 7",
      highlight: 2,
      line: 12,
      count: 41,
      tag: { text: "Left out of revenue", tone: "amber" },
      why: "Sent by Harbor Street Catering, which has the same owner. Real money, but not sales.",
      impactLabel: "Effect on true revenue",
      impact: "−$12,000",
      lines: [
        line(["08/13", "SQUARE INC DEPOSIT", "+1,042.10", "6,388.40"]),
        line(["08/14", "COUNTER DEPOSIT", "+1,880.00", "8,268.40"]),
        line(["08/14", "TRANSFER FROM HARBOR ST CATERING", "+12,000.00", "20,268.40"]),
        line(["08/14", "KINGSWAY CAPITAL ACH DEBIT", "-285.00", "19,983.40"]),
        line(["08/15", "SYSCO PORTLAND", "-1,526.00", "18,457.40"]),
        line(["08/15", "DOORDASH PAYOUT", "+1,964.30", "20,421.70"]),
      ],
    },
    {
      title: "Owner savings transfer",
      tone: "grey",
      page: "Jul 2026 · p. 3 of 5",
      highlight: 1,
      line: 18,
      count: 38,
      tag: { text: "Left out of revenue", tone: "grey" },
      why: "Moved from the owner’s own savings account. Normal for a small business.",
      impactLabel: "Effect on true revenue",
      impact: "−$2,500",
      lines: [
        line(["07/17", "SQUARE INC DEPOSIT", "+1,210.40", "9,920.15"]),
        line(["07/18", "ONLINE TRANSFER FROM ••4410", "+2,500.00", "12,420.15"]),
        line(["07/18", "KINGSWAY CAPITAL ACH DEBIT", "-285.00", "12,135.15"]),
        line(["07/18", "CENTRAL MAINE POWER", "-505.00", "11,630.15"]),
        line(["07/19", "COUNTER DEPOSIT", "+1,540.00", "13,170.15"]),
        line(["07/20", "SQUARE INC DEPOSIT", "+1,398.60", "14,568.75"]),
      ],
    },
    {
      title: "Lowest balance day",
      tone: "grey",
      page: "Aug 2026 · p. 1 of 7",
      highlight: 1,
      line: 4,
      count: 44,
      tag: { text: "No action needed", tone: "mint" },
      why: "The balance dipped after payroll but never went below zero and recovered within a day.",
      impactLabel: "Lowest balance",
      impact: "$1,208",
      lines: [
        line(["08/01", "SQUARE INC DEPOSIT", "+986.20", "9,628.00"]),
        line(["08/02", "GUSTO PAYROLL", "-8,420.00", "1,208.00"]),
        line(["08/03", "COUNTER DEPOSIT", "+2,310.00", "3,518.00"]),
        line(["08/03", "KINGSWAY CAPITAL ACH DEBIT", "-285.00", "3,233.00"]),
        line(["08/04", "SQUARE INC DEPOSIT", "+1,402.80", "4,635.80"]),
        line(["08/04", "DOORDASH PAYOUT", "+2,011.45", "6,647.25"]),
      ],
    },
  ] as EvidenceItem[],
};

export type PatternCheck = {
  label: string;
  detail: string;
  result: string;
  status: "clear" | "explained";
  /** the round-dollar meter: share found, where the flag sits, and the scale end */
  meter?: { percent: number; flagAt: number; max: number; flagLabel: string };
  link?: { label: string; href: string };
};

export const patternChecks = {
  title: "Pattern checks",
  help: { label: "How they work", href: "#" },
  summary: {
    clear: 5,
    total: 6,
    title: "5 clear, 1 explained",
    subtitle: "Habits that often come with fraud",
  },
  checks: [
    {
      label: "Round-dollar deposits",
      detail: "Deposits in even amounts",
      result: "3%",
      status: "clear",
      meter: { percent: 3, flagAt: 15, max: 25, flagLabel: "Flag at 15%" },
    },
    { label: "Cash just under $10K", detail: "Avoiding bank reporting", result: "None", status: "clear" },
    { label: "Duplicate deposits", detail: "Same amount, same day, twice", result: "None", status: "clear" },
    { label: "In and straight out", detail: "Money passing through in a day", result: "None", status: "clear" },
    { label: "Holiday deposits", detail: "Deposits when banks are closed", result: "None", status: "clear" },
    {
      label: "Jump before applying",
      detail: "Revenue spike right before",
      result: "Explained",
      status: "explained",
      link: { label: "See the $12,000 transfer", href: "/deals/APP-7H2K4Q/cash-flow#transactions" },
    },
  ] as PatternCheck[],
};

export const applicationSignals = {
  title: "Application signals",
  subtitle: "How the application reached you, and who sent it",
  chip: "Nothing unusual",
  signals: [
    { label: "Email matches business", detail: "elena@harborstreetbakery.com, same domain as the website" },
    { label: "Real phone line", detail: "Business landline in Portland, ME, not an internet number" },
    { label: "Signed from Maine", detail: "E-signature location matches the business state" },
    { label: "Trusted broker", detail: "Apex Funding Partners · 24 deals, 0 fraud flags this month" },
    { label: "Files not reused", detail: "None of these 7 files appear in any other deal in Cevrynt" },
  ],
};

export const liveBank = {
  chip: "Not done yet",
  title: "Compare with live bank data",
  text: "When Elena connects her bank, every statement line is matched against the bank's own record. Any line changed in the PDF shows up straight away.",
  send: "Send bank link to Elena",
  skip: "Skip for this deal",
};

export const review = {
  title: "Your review",
  chip: { open: "Needs your sign-off", done: "Done" },
  check: {
    label: "I've looked at the related-business transfer",
    detail: "Harbor Street Catering has the same owner. Leaving it out of revenue is the right call.",
  },
  note: { label: "Note for the file", placeholder: "Anything the next reviewer should know" },
  hint: "Saved to the deal's activity with your name and time.",
  reviewer: "Maya Chen",
  button: { open: "Mark integrity reviewed", done: "Reviewed by Maya Chen" },
};
