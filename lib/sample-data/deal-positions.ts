/**
 * Sample data for the Positions & debt tab, copied from
 * design/prototypes/Deal-Positions.dc.html (look: design/Deal-Positions.html).
 * Real API calls replace this later behind the same types.
 */

export const debtGlance = {
  today: {
    title: "Debt payments today",
    chip: "Light",
    value: "$6.0K",
    unit: "/mo",
    percent: 15,
    share: "9.8% of revenue",
    max: "Policy max 65%",
  },
  found: {
    title: "Positions found",
    chip: "All disclosed",
    counts: [
      { value: "1", label: "Merchant cash advance" },
      { value: "0", label: "Other loans" },
    ],
    note: "The application listed 1 advance. The statements agree.",
  },
  after: {
    title: "After our offer",
    chip: "2nd position",
    value: "$15.3K",
    unit: "/mo",
    percent: 38,
    share: "25% of revenue",
    max: "Policy max 65%",
  },
};

export const position = {
  initials: "KC",
  name: "Kingsway Capital",
  chips: [
    { label: "Merchant cash advance", tone: "purple" },
    { label: "Known funder", tone: "green" },
    { label: "Disclosed", tone: "green" },
  ] as { label: string; tone: "purple" | "green" }[],
  shownAs: { before: "Shown on statements as ", code: "KINGSWAY CAPITAL ACH DEBIT" },
  actions: { payoff: "Request payoff letter", debits: "See all {n} debits" },
  facts: [
    { label: "Payment", value: "$285", suffix: "daily", big: true },
    { label: "Per month", value: "$6.0K", big: true },
    { label: "Started", value: "Feb 2026", suffix: "UCC filed" },
    { label: "Est. balance left", value: "$9.4K", big: true, warn: true },
    { label: "Est. paid off", value: "Mid-November" },
    { label: "Est. original advance", value: "~$36.7K", big: true },
  ] as { label: string; value: string; suffix?: string; big?: boolean; warn?: boolean }[],
  estimateNote:
    "Balance and payoff are estimates from the payment amount, the UCC date and a typical 1.35 factor. A payoff letter from Kingsway confirms the real figure.",
  history: {
    title: "Payment history",
    range: "· every business day, Jun – Sep",
    legend: [
      { label: "Paid", color: "bg-purple" },
      { label: "Bank holiday", color: "bg-line" },
      { label: "Bounced", color: "bg-red" },
    ],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    /** bank holidays with no debit, from the prototype */
    holidays: ["2026-06-19", "2026-07-03", "2026-09-07"],
    chips: ["Same amount every time", "No renewal or top-up seen"],
  },
};

export type PaymentCell = "pad" | "paid" | "holiday" | "bounced";

/**
 * One cell per business day from June 1 to September 30, 2026, padded so
 * the first column starts on a Monday. Bank holidays carry no debit.
 */
export function paymentCells(): { cells: PaymentCell[]; debits: number } {
  const cells: PaymentCell[] = [];
  let debits = 0;
  const d = new Date(Date.UTC(2026, 5, 1));
  const end = new Date(Date.UTC(2026, 8, 30));
  const lead = (d.getUTCDay() + 6) % 7;
  for (let i = 0; i < lead && i < 5; i++) cells.push("pad");
  while (d <= end) {
    const wd = d.getUTCDay();
    if (wd >= 1 && wd <= 5) {
      const hol = position.history.holidays.includes(d.toISOString().slice(0, 10));
      if (!hol) debits++;
      cells.push(hol ? "holiday" : "paid");
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return { cells, debits };
}

export const stackingCheck = {
  title: "Stacking check",
  chip: "No signs",
  intro: "Signs that the merchant took other advances recently.",
  checks: [
    { label: "New funder debits, last 60 days", result: "None", done: true },
    { label: "Funding deposits received", result: "None", done: true },
    { label: "UCC filings", detail: "Maine SOS · Feb 2026 · all receivables", result: "1, Kingsway", done: true },
    { label: "Other open deals in Cevrynt", result: "None", done: true },
    { label: "Credit inquiries", result: "Waiting on consent", done: false },
  ] as { label: string; detail?: string; result: string; done: boolean }[],
  cta: { label: "Keep watching after funding", href: "/stacking" },
};

export const statedVsFound = {
  title: "What the merchant told you vs what we found",
  subtitle: "From the signed application, checked against the statements and public records",
  chip: "4 of 4 match",
  columns: ["Question", "Application says", "We found", "Result"],
  rows: [
    { question: "Open advances", stated: "1", found: "1", result: "Match" },
    { question: "Funder", stated: "Kingsway Capital", found: "Kingsway Capital", result: "Match" },
    { question: "Payment", stated: "$285 daily", found: "$285 daily", result: "Match", num: true },
    { question: "Balance left", stated: "About $10K", found: "~$9.4K est.", result: "Close", num: true },
  ] as { question: string; stated: string; found: string; result: "Match" | "Close"; num?: boolean }[],
};

export const howWeLooked = {
  title: "How we looked",
  total: 14,
  intro: "Every payee taking money out on a regular schedule was checked to see if it could be a hidden advance.",
  groups: [
    { label: "Advance (Kingsway)", count: 1, advance: true },
    { label: "Payroll, rent, utilities", count: 5 },
    { label: "Suppliers", count: 6 },
    { label: "Insurance, software", count: 2 },
  ] as { label: string; count: number; advance?: boolean }[],
  link: { label: "See all recurring payments", href: "/deals/APP-7H2K4Q/cash-flow#transactions" },
};

export type ScenarioKey = "keep" | "pay";

export type Scenario = {
  cash: string;
  cashNote: string;
  daily: string;
  dailyNote: string;
  share: string;
  /** width of the share bar */
  sharePercent: number;
  shareColor: "amber-light" | "mint";
  position: string;
  positionNote: string;
  verdict: string;
};

export const scenarioCard = {
  title: "Second position or payoff?",
  subtitle: "Compare funding next to Kingsway with paying Kingsway off from this advance",
  options: [
    { value: "keep", label: "Keep both" },
    { value: "pay", label: "Pay off Kingsway" },
  ] as { value: ScenarioKey; label: string }[],
  labels: { cash: "Cash to merchant", daily: "Daily payments", share: "Share of revenue", position: "Your position" },
  cta: { label: "Use in offer builder", href: "/deals/APP-7H2K4Q/offer" },
  scenarios: {
    keep: {
      cash: "$40,000",
      cashNote: "All of the advance",
      daily: "$704",
      dailyNote: "$285 Kingsway + $419 ours",
      share: "25%",
      sharePercent: 38,
      shareColor: "amber-light",
      position: "2nd",
      positionNote: "Kingsway is paid first",
      verdict: "Works within policy. Kingsway ends in mid-November, after which only your $419 remains.",
    },
    pay: {
      cash: "$30,600",
      cashNote: "$9,400 goes to Kingsway",
      daily: "$419",
      dailyNote: "Only your payment",
      share: "15%",
      sharePercent: 23,
      shareColor: "mint",
      position: "1st",
      positionNote: "No other advance ahead of you",
      verdict: "Safer for you and lighter for the merchant, but they receive $9,400 less. Needs a payoff letter from Kingsway.",
    },
  } as Record<ScenarioKey, Scenario>,
};

export const otherDebt = {
  title: "Other debt checked",
  chip: "None found",
  intro: "Payments that would count toward affordability.",
  categories: ["Bank loans", "Lines of credit", "Equipment leases", "Vehicle loans", "SBA loans", "Buy now, pay later"].map((label) => ({ label, result: "None" })),
  note: "Business card autopay of $1,140 a month is treated as a normal expense, not debt.",
};
