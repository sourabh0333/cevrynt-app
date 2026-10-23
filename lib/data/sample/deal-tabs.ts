import type { DealBusiness, DealCashFlow, DealChecks, DealConditions, DealIntegrity, DealPositions, DealSummary, StatementLine } from "@/lib/data/types";

/**
 * Sample deal-tab records for Harbor Street Bakery LLC (APP-7H2K4Q), copied
 * from design/prototypes/Deal-Summary.dc.html, Deal-CashFlow.dc.html and
 * Deal-Positions.dc.html. Pages get them through lib/data/deals.
 *
 * The designs only cover Harbor Street, so the sample source shows these
 * same records on the other sample deals' tabs too (as the app did before
 * the data layer); each deal gets its own once there is sample data for it.
 */

export const harborChecks: DealChecks = {
  cashFlow: { state: "ok", note: "Revenue growing 3% a month. No NSFs." },
  positions: { state: "ok", note: "Kingsway Capital, $285 daily. Disclosed." },
  integrity: { state: "warn", note: "No edits found. One related-party deposit." },
  business: { state: "ok", note: "Active in Maine registry. Owner verified." },
  stacking: { state: "ok", note: "Watching. No new filings or debits." },
};

export const harborSummary: DealSummary = {
  score: {
    total: 88,
    parts: [
      { part: "cashFlow", points: 24 },
      { part: "debt", points: 18 },
      { part: "integrity", points: 16 },
      { part: "business", points: 15 },
      { part: "policyFit", points: 15 },
    ],
    holdsBack: "integrity",
  },
  recommendation: {
    decision: "approve",
    requested: 45000,
    amount: 40000,
    factor: 1.32,
    termMonths: 6,
    reason: "because the August deposit from a related business is excluded.",
  },
  revenueGrowth: 0.031,
  statedRevenue: 64000,
  balanceTrend: "steady",
  findings: [
    { title: "$12,000 deposit from a related business", detail: "Aug 14 from Harbor Street Catering, same owner. Left out of true revenue.", tone: "amber", tab: "integrity" },
    { title: "Landlord letter not received", detail: "Required by policy before funding. Requested from the broker today.", tone: "amber", tab: "conditions" },
  ],
  clear: ["Statements reconcile", "Owner ID verified", "No sanctions match", "No new UCC filings", "Position disclosed"],
  timeline: [
    { at: "2026-10-13T09:40:00-04:00", text: "Package from Apex Funding Partners uploaded", kind: "done" },
    { at: "2026-10-13T09:41:00-04:00", text: "Fit check passed, analysis complete", kind: "done" },
    { at: "2026-10-13T09:42:00-04:00", text: "Assigned to Maya Chen", kind: "done" },
    { at: "2026-10-13T10:05:00-04:00", text: "Landlord letter requested from broker", kind: "attention" },
    { at: "2026-10-15T10:00:00-04:00", text: "Funding call booked for Thursday", kind: "upcoming" },
  ],
  prompts: ["Why $40K and not $45K?", "Can they afford a second position?", "Draft the landlord letter request"],
};

/**
 * End-of-day balances, June 1 to September 30 (122 days), from the
 * prototype's series: around $9.8K with the payroll dip to $1.2K on day 62
 * (August 2).
 */
function balances() {
  const vals: number[] = [];
  for (let d = 0; d < 122; d++) {
    let v = 9800 + 3400 * Math.sin((2 * Math.PI * d) / 14) + 1300 * Math.sin((2 * Math.PI * d) / 5.3 + 1) + 900 * Math.sin((2 * Math.PI * d) / 31);
    v -= 8200 * Math.exp(-Math.pow((d - 62) / 2.4, 2));
    vals.push(Math.max(v, 1200));
  }
  vals[62] = 1200;
  return vals;
}

/** Money in and out over 17 weeks, from the prototype's series (week 8 has the $12K transfer, week 11 a heavy payroll). */
function weeks() {
  const out: { in: number; out: number; related?: boolean }[] = [];
  for (let i = 0; i < 17; i++) {
    let vin = 14.2 + 1.1 * Math.sin(i * 0.9) + i * 0.08;
    let vout = 14.6 + 1.3 * Math.sin(i * 1.3 + 2) + i * 0.05;
    if (i === 10) vout += 3.4;
    if (i === 7) {
      vin += 12;
      vout += 1.2;
    }
    out.push(i === 7 ? { in: vin * 1000, out: vout * 1000, related: true } : { in: vin * 1000, out: vout * 1000 });
  }
  return out;
}

export const harborCashFlow: DealCashFlow = {
  bank: { name: "Chase Business", last4: "7712", holder: "Harbor Street Bakery LLC", holderMatches: true },
  months: [
    { month: "2026-06", pages: 6, deposits: 61000, trueRevenue: 58200, withdrawals: 57400, debtPayments: 6000, avgBalance: 9100, lowestBalance: 3400, nsfs: 0, daysBelowZero: 0 },
    { month: "2026-07", pages: 5, deposits: 63400, trueRevenue: 60100, withdrawals: 59900, debtPayments: 6300, avgBalance: 10200, lowestBalance: 4100, nsfs: 0, daysBelowZero: 0 },
    { month: "2026-08", pages: 7, deposits: 78100, trueRevenue: 63500, withdrawals: 74000, debtPayments: 6000, avgBalance: 8900, lowestBalance: 1200, nsfs: 0, daysBelowZero: 0 },
    { month: "2026-09", pages: 7, deposits: 67300, trueRevenue: 63800, withdrawals: 64900, debtPayments: 6000, avgBalance: 11000, lowestBalance: 5600, nsfs: 0, daysBelowZero: 0 },
  ],
  linesRead: 1284,
  linesToReview: 0,
  balancesMatch: true,
  setAside: [
    { kind: "related", amount: 12000, count: 1, at: "2026-08-14T12:00:00-04:00" },
    { kind: "transfer", amount: 9600, count: 6 },
    { kind: "refund", amount: 2600, count: 4 },
  ],
  loanProceeds: 0,
  revenuePerBusinessDay: 2830,
  lowestBalance: { amount: 1200, at: "2026-08-02T12:00:00-04:00", after: "payroll" },
  avgDailyBalance: 9800,
  dailyBalances: balances(),
  weeks: weeks(),
  biggestWeeklyDrop: 3900,
  cashCushionDays: 3.5,
  sources: [
    { label: "Card sales · Square", share: 46 },
    { label: "Cash deposits", share: 21 },
    { label: "Delivery apps · DoorDash", share: 12 },
    { label: "Bayside Café Group (wholesale)", share: 9, customer: true },
    { label: "Delivery apps · Uber Eats", share: 5 },
    { label: "Other", share: 7 },
  ],
  cardSales: {
    processor: "Square",
    months: [
      { month: "2026-06", amount: 26800 },
      { month: "2026-07", amount: 27500 },
      { month: "2026-08", amount: 29100 },
      { month: "2026-09", amount: 29400 },
    ],
    perDay: 930,
    splitPossible: true,
  },
  weekdays: [0.52, 0.58, 0.61, 0.66, 0.84, 1, 0.72],
  weekendShare: 0.38,
  transactions: [
    { at: "2026-09-30T12:00:00-04:00", description: "SQUARE INC DEPOSIT", note: "Card settlement", category: "sales", amount: 1184.2, balance: 13920, page: 7, kind: "in", flagged: false },
    { at: "2026-09-30T12:00:00-04:00", description: "KINGSWAY CAPITAL ACH DEBIT", note: "Existing advance · disclosed", category: "mca", amount: -285, balance: 12736, page: 7, kind: "debt", flagged: false },
    { at: "2026-09-29T12:00:00-04:00", description: "DOORDASH PAYOUT", note: "Weekly payout", category: "apps", amount: 2140.55, balance: 13021, page: 7, kind: "in", flagged: false },
    { at: "2026-09-29T12:00:00-04:00", description: "SYSCO PORTLAND", note: "Ingredients", category: "vendor", amount: -3412.8, balance: 10880, page: 7, kind: "out", flagged: false },
    { at: "2026-09-26T12:00:00-04:00", description: "COUNTER DEPOSIT", note: "Cash", category: "cash", amount: 2650, balance: 14293, page: 6, kind: "in", flagged: false },
    { at: "2026-09-15T12:00:00-04:00", description: "BAYSIDE CAFE GROUP ACH", note: "Wholesale invoice", category: "wholesale", amount: 4980, balance: 15102, page: 4, kind: "in", flagged: false },
    { at: "2026-09-01T12:00:00-04:00", description: "COMMERCIAL ST PROPERTIES", note: "Monthly rent", category: "rent", amount: -4600, balance: 9455, page: 1, kind: "out", flagged: false },
    { at: "2026-08-14T12:00:00-04:00", description: "TRANSFER FROM HARBOR ST CATERING", note: "Same owner · left out of true revenue", category: "related", amount: 12000, balance: 20268, page: 3, kind: "in", flagged: true },
    { at: "2026-08-02T12:00:00-04:00", description: "GUSTO PAYROLL", note: "Lowest balance of the period follows", category: "payroll", amount: -8420, balance: 1208, page: 1, kind: "out", flagged: true },
    { at: "2026-07-18T12:00:00-04:00", description: "ONLINE TRANSFER FROM ••4410", note: "Owner savings · left out of true revenue", category: "transfer", amount: 2500, balance: 11630, page: 3, kind: "in", flagged: true },
  ],
  transactionCounts: { all: 1284, in: 597, out: 601, debt: 85, flagged: 3 },
};

export const harborPositions: DealPositions = {
  positions: [
    {
      funder: "Kingsway Capital",
      kind: "mca",
      knownFunder: true,
      disclosed: true,
      descriptor: "KINGSWAY CAPITAL ACH DEBIT",
      dailyPayment: 285,
      perMonth: 6000,
      startedAt: "2026-02-10T12:00:00-05:00",
      uccFiled: true,
      estBalance: 9400,
      estPayoffAt: "2026-11-16T12:00:00-05:00",
      estOriginal: 36700,
      estFactor: 1.35,
      history: { from: "2026-06-01", to: "2026-09-30", holidays: ["2026-06-19", "2026-07-03", "2026-09-07"], bounced: [] },
      patterns: ["Same amount every time", "No renewal or top-up seen"],
    },
  ],
  otherLoans: 0,
  statedAdvances: 1,
  stackingSigns: 0,
  stacking: [
    { label: "New funder debits, last 60 days", result: "None", done: true },
    { label: "Funding deposits received", result: "None", done: true },
    { label: "UCC filings", detail: "Maine SOS · Feb 2026 · all receivables", result: "1, Kingsway", done: true },
    { label: "Other open deals in Cevrynt", result: "None", done: true },
    { label: "Credit inquiries", result: "Waiting on consent", done: false },
  ],
  statedVsFound: [
    { question: "Open advances", stated: "1", found: "1", result: "match" },
    { question: "Funder", stated: "Kingsway Capital", found: "Kingsway Capital", result: "match" },
    { question: "Payment", stated: "$285 daily", found: "$285 daily", result: "match", numeric: true },
    { question: "Balance left", stated: "About $10K", found: "~$9.4K est.", result: "close", numeric: true },
  ],
  recurringPayees: [
    { label: "Advance (Kingsway)", count: 1, advance: true },
    { label: "Payroll, rent, utilities", count: 5 },
    { label: "Suppliers", count: 6 },
    { label: "Insurance, software", count: 2 },
  ],
  otherDebt: ["Bank loans", "Lines of credit", "Equipment leases", "Vehicle loans", "SBA loans", "Buy now, pay later"].map((category) => ({ category, found: false })),
  cardAutopay: 1140,
};

/* ---------- Integrity, Business & owners, Conditions (design/Deal-Integrity, -Business, -Conditions) ---------- */

const allPass = { edits: "pass", layout: "pass", math: "pass", history: "pass", ai: "pass" } as const;
const ln = (date: string, description: string, amount: number, balance: number): StatementLine => ({ date, description, amount, balance });

export const harborIntegrity: DealIntegrity = {
  risk: "low",
  headline: "No signs of edited or fake documents",
  summary: "Every statement matches Chase's real layout and its numbers add up. Points are held back only for one related-business transfer, already left out of revenue.",
  checkSeconds: 41,
  documents: [
    { name: "June statement", detail: "Chase ••7712 · 6 pages", tests: allPass },
    { name: "July statement", detail: "Chase ••7712 · 5 pages", tests: allPass },
    { name: "August statement", detail: "Chase ••7712 · 7 pages", tests: allPass },
    { name: "September statement", detail: "Chase ••7712 · 7 pages", tests: allPass },
    { name: "Signed application", detail: "PDF · e-signed", tests: { ...allPass, layout: "na", math: "na" } },
    { name: "Owner photo ID", detail: "Maine driver licence", tests: { ...allPass, math: "na" } },
    { name: "Voided check", detail: "Phone photo", tests: { ...allPass, math: "na", history: "na" } },
  ],
  statementProduct: "Chase Business Complete",
  evidence: [
    {
      title: "Related-business transfer",
      needsReview: true,
      month: "2026-08",
      page: 3,
      line: 12,
      lineCount: 41,
      highlight: 2,
      outcome: "excluded",
      why: "Sent by Harbor Street Catering, which has the same owner. Real money, but not sales.",
      impact: { kind: "revenue", amount: -12000 },
      lines: [
        ln("2026-08-13", "SQUARE INC DEPOSIT", 1042.1, 6388.4),
        ln("2026-08-14", "COUNTER DEPOSIT", 1880, 8268.4),
        ln("2026-08-14", "TRANSFER FROM HARBOR ST CATERING", 12000, 20268.4),
        ln("2026-08-14", "KINGSWAY CAPITAL ACH DEBIT", -285, 19983.4),
        ln("2026-08-15", "SYSCO PORTLAND", -1526, 18457.4),
        ln("2026-08-15", "DOORDASH PAYOUT", 1964.3, 20421.7),
      ],
    },
    {
      title: "Owner savings transfer",
      needsReview: false,
      month: "2026-07",
      page: 3,
      line: 18,
      lineCount: 38,
      highlight: 1,
      outcome: "excluded",
      why: "Moved from the owner’s own savings account. Normal for a small business.",
      impact: { kind: "revenue", amount: -2500 },
      lines: [
        ln("2026-07-17", "SQUARE INC DEPOSIT", 1210.4, 9920.15),
        ln("2026-07-18", "ONLINE TRANSFER FROM ••4410", 2500, 12420.15),
        ln("2026-07-18", "KINGSWAY CAPITAL ACH DEBIT", -285, 12135.15),
        ln("2026-07-18", "CENTRAL MAINE POWER", -505, 11630.15),
        ln("2026-07-19", "COUNTER DEPOSIT", 1540, 13170.15),
        ln("2026-07-20", "SQUARE INC DEPOSIT", 1398.6, 14568.75),
      ],
    },
    {
      title: "Lowest balance day",
      needsReview: false,
      month: "2026-08",
      page: 1,
      line: 4,
      lineCount: 44,
      highlight: 1,
      outcome: "none",
      why: "The balance dipped after payroll but never went below zero and recovered within a day.",
      impact: { kind: "lowest", amount: 1208 },
      lines: [
        ln("2026-08-01", "SQUARE INC DEPOSIT", 986.2, 9628),
        ln("2026-08-02", "GUSTO PAYROLL", -8420, 1208),
        ln("2026-08-03", "COUNTER DEPOSIT", 2310, 3518),
        ln("2026-08-03", "KINGSWAY CAPITAL ACH DEBIT", -285, 3233),
        ln("2026-08-04", "SQUARE INC DEPOSIT", 1402.8, 4635.8),
        ln("2026-08-04", "DOORDASH PAYOUT", 2011.45, 6647.25),
      ],
    },
  ],
  patterns: {
    roundDollar: { share: 0.03, flagAt: 0.15, scaleMax: 0.25 },
    cashUnder10k: 0,
    duplicates: 0,
    passThrough: 0,
    holidayDeposits: 0,
    jumpBeforeApplying: "explained",
  },
  signals: [
    { label: "Email matches business", detail: "elena@harborstreetbakery.com, same domain as the website" },
    { label: "Real phone line", detail: "Business landline in Portland, ME, not an internet number" },
    { label: "Signed from Maine", detail: "E-signature location matches the business state" },
    { label: "Trusted broker", detail: "Apex Funding Partners · 24 deals, 0 fraud flags this month" },
    { label: "Files not reused", detail: "None of these 7 files appear in any other deal in Cevrynt" },
  ],
  liveBankConnected: false,
  review: { subject: "related-business transfer", detail: "Harbor Street Catering has the same owner. Leaving it out of revenue is the right call." },
};

const consent = { value: "Waiting on consent", match: false };
const ok = (value: string) => ({ value, match: true });
const none = (value: string) => ({ value, match: false });

export const harborBusiness: DealBusiness = {
  registry: {
    state: "Maine",
    checkedAt: "2026-10-12T12:00:00-04:00",
    active: true,
    goodStanding: true,
    legalName: "Harbor Street Bakery LLC",
    entityType: "Limited liability company",
    charter: "20160412DC",
    formedAt: "2016-04-12T12:00:00-04:00",
    agent: "Elena Brooks",
    lastAnnualReport: { month: "2026-05", onTime: true },
    ownershipChanges: 0,
  },
  industry: { label: "Retail bakery", naics: "311811" },
  licence: { label: "Food licence", activeUntil: "2027-06" },
  einMatches: true,
  tradeName: "Harbor Street",
  address: { street: "418 Commercial St", kind: "retail", sourcesAgree: 4, sources: 4 },
  crossCheck: [
    { fact: "Legal name", cells: [ok("Harbor Street Bakery LLC"), ok("Harbor Street Bakery LLC"), ok("Harbor Street Bakery LLC"), ok("Harbor Street Bakery"), consent] },
    { fact: "Address", cells: [ok("418 Commercial St"), ok("418 Commercial St"), ok("418 Commercial St"), ok("418 Commercial St"), consent] },
    { fact: "Owner", cells: [ok("Elena Brooks"), ok("Elena Brooks, member"), none("—"), ok("Elena Brooks"), consent] },
    { fact: "EIN", cells: [ok("••-•••7740"), none("Not listed"), none("—"), none("—"), consent] },
    { fact: "Phone", cells: [ok("(207) 555-0164"), none("—"), none("—"), ok("(207) 555-0164"), consent] },
    { fact: "Started", cells: [ok("2016"), ok("Apr 2016"), none("Statements from 2026 only"), ok("Reviews since 2016"), consent] },
  ],
  owners: [
    {
      name: "Elena Brooks",
      share: 100,
      email: "elena@harborstreetbakery.com",
      phone: "(207) 555-0188",
      identityVerified: true,
      guarantor: true,
      possessive: "her",
      checks: [
        { label: "Photo ID", detail: "Maine licence, genuine, not expired", done: true },
        { label: "Selfie match", detail: "Live selfie matches the ID photo", done: true },
        { label: "Sanctions lists", detail: "No match on OFAC or other lists", done: true },
        { label: "Home address", detail: "Matches ID and public records", done: true },
        { label: "Listed on registry", detail: "Member and registered agent", done: true },
        { label: "Credit report", detail: "Waiting on her consent", done: false },
      ],
    },
  ],
  related: { name: "Harbor Street Catering LLC", since: 2021, openDeals: 0, note: "The source of the $12,000 August transfer." },
  publicRecords: [
    { kind: "ucc", count: 1, detail: "Kingsway, Feb 2026" },
    { kind: "taxLiens", count: 0 },
    { kind: "judgments", count: 0 },
    { kind: "court", count: 0 },
    { kind: "bankruptcies", count: 0 },
    { kind: "funderSuits", count: 0 },
  ],
  recordsCheckedAt: "2026-10-12T12:00:00-04:00",
  online: {
    strength: "strong",
    website: "harborstreetbakery.com",
    since: 2016,
    rating: 4.7,
    reviews: 312,
    hours: "Tue – Sun, 6am – 3pm",
    hoursNote: "Weekend peak matches deposits",
    recent: "Reviews this week",
    recentNote: "Open and trading today",
  },
};

export const harborConditions: DealConditions = {
  items: [
    { id: "landlord", title: "Landlord letter", detail: "Lease at 418 Commercial St is current and rent is paid", party: "broker", status: "wait", action: "received", dueAt: "2026-10-14T17:00:00-04:00", acceptsFile: true },
    { id: "contract", title: "Signed contract", detail: "Agreement, personal guarantee, payment authorization and cost disclosure", party: "merchant", status: "wait", action: "signed", withOffer: true },
    { id: "call", title: "Funding call", detail: "Short recorded call to confirm the terms with Elena", party: "us", status: "booked", action: "done", bookedAt: "2026-10-15T10:00:00-04:00" },
    { id: "stmts", title: "Bank statements", detail: "4 months, read and checked", party: "auto", status: "done", action: "done", doneAt: "2026-10-13T09:41:00-04:00" },
    { id: "app", title: "Signed application", detail: "E-signed by Elena", party: "merchant", status: "done", action: "done", doneAt: "2026-10-13T09:41:00-04:00" },
    { id: "id", title: "Photo ID and selfie", detail: "Through Merchant Link", party: "merchant", status: "done", action: "done", doneAt: "2026-10-13T09:58:00-04:00" },
    { id: "void", title: "Voided check", detail: "Matches account ••7712", party: "merchant", status: "done", action: "done", doneAt: "2026-10-13T09:58:00-04:00" },
    { id: "kyc", title: "Identity and sanctions", detail: "Clear on every list", party: "auto", status: "done", action: "done", doneAt: "2026-10-13T09:59:00-04:00" },
  ],
  parties: {
    broker: { name: "Apex Funding", initials: "AP", contact: "Dana Ruiz" },
    merchant: { name: "Elena Brooks", initials: "EB" },
  },
  terms: [
    "No new advances or loans until this one is repaid",
    "Keep the Chase ••7712 account open for payments",
    "Payments start 2 business days after funding",
  ],
  finalChecks: ["New UCC filings", "New funder activity", "Bank account open", "Registry active", "Last 5 days of activity", "Payout account ••7712"],
  lastFullCheckAt: "2026-10-13T09:59:00-04:00",
  recommended: [
    { label: "Credit report consent", status: "sent" },
    { label: "Live bank connection", status: "not-sent" },
    { label: "Kingsway payoff letter", status: "if-paying-off" },
  ],
};
