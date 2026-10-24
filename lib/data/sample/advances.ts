import type { Advance, FundedBook, PaymentMark } from "@/lib/data/types";

/**
 * Sample records for Funded deals, copied from
 * design/prototypes/Funded.dc.html (look: design/Funded.html). Home's
 * "collected today" tile, Merchants' balances and Renewals read the same
 * figures, so Westfield and Kestrel match everywhere. Pages get them
 * through lib/data/advances.
 */

const at = (date: string, time = "12:00") => `${date}T${time}:00-04:00`;
const marks = (s: string): PaymentMark[] => s.split("").map((c) => ({ c: "cleared", r: "returned", s: "slow", n: "upcoming" })[c] as PaymentMark);

export const advances: Advance[] = [
  {
    id: "adv-cd", merchant: "Coastal Dental Group", initials: "CD", colors: ["#24588A", "#4F86BD"], broker: "Apex Funding",
    fundedAt: at("2026-04-15"), amount: 70000, payback: 91000, paid: 65520, dailyPayment: 430, lastPayments: marks("cccccccccc"),
    revenueChange: 0.18, status: "soon", payoff: { kind: "date", month: "2026-11", part: "late" }, trend: [1, 1.02, 1.05, 1.08, 1.12, 1.15, 1.18],
    flag: { text: "Ready to renew. $80K renewal already accepted.", tone: "good" }, next: "renewal",
  },
  {
    id: "adv-kp", merchant: "Kestrel Plumbing", initials: "KP", colors: ["#2C5F73", "#5A90A6"], broker: "Keystone",
    fundedAt: at("2026-07-10"), amount: 45000, payback: 60000, paid: 28800, dailyPayment: 412, lastPayments: marks("ccccccrccs"),
    revenueChange: -0.22, status: "slow", payoff: { kind: "date", month: "2027-01", part: "late" }, trend: [1, 1.03, 0.98, 0.95, 0.88, 0.82, 0.78],
    flag: { text: "Deposits down 22% and one payment returned this week. A reconciliation request came in yesterday.", tone: "watch" }, next: "call",
  },
  {
    id: "adv-wa", merchant: "Westfield Auto Group", initials: "WA", colors: ["#4D6B2E", "#7FA05A"], broker: "Summit Capital",
    fundedAt: at("2026-08-05"), amount: 70000, payback: 91900, paid: 19300, dailyPayment: 628, lastPayments: marks("cccrcrccrr"),
    revenueChange: -0.09, status: "late", payoff: { kind: "at-risk" }, trend: [1, 0.98, 0.96, 0.93, 0.92, 0.91, 0.91],
    flag: { text: "Three returned payments in the last 10. Balance below $500 on 3 of 5 days.", tone: "risk" }, next: "plan",
  },
  {
    id: "adv-od", merchant: "Oakview Deli", initials: "OD", colors: ["#8A5A2B", "#B98552"], broker: "Apex Funding",
    fundedAt: at("2026-05-20"), amount: 30000, payback: 39600, paid: 25344, dailyPayment: 305, lastPayments: marks("cccccccccc"),
    revenueChange: 0.04, status: "ok", payoff: { kind: "date", month: "2026-12", part: "early" }, trend: [1, 1.01, 0.99, 1.02, 1.03, 1.04, 1.04],
    flag: { text: "Steady. Renewal offer sent last week.", tone: "good" }, next: "renewal",
  },
  {
    id: "adv-gs", merchant: "Granite State Builders", initials: "GS", colors: ["#7A4A2A", "#B07A52"], broker: "BlueRock",
    fundedAt: at("2026-09-08"), amount: 62000, payback: 83080, paid: 14954, dailyPayment: 525, lastPayments: marks("cccccccccc"),
    revenueChange: 0.02, status: "late", payoff: { kind: "watch" }, trend: [1, 1.01, 1.0, 1.02, 1.01, 1.02, 1.02],
    flag: { text: "A new $35K advance from another funder landed yesterday. Payments still clearing, but debt load has doubled.", tone: "risk" }, next: "stacking",
  },
  {
    id: "adv-cs", merchant: "Cedar Street Pharmacy", initials: "CS", colors: ["#0A5E50", "#2F8F7A"], broker: "Apex Funding",
    fundedAt: at("2026-10-13", "11:02"), amount: 60000, payback: 79200, paid: 0, dailyPayment: 629, lastPayments: marks("nnnnnnnnnn"),
    revenueChange: null, status: "new", payoff: { kind: "date", month: "2027-04" }, trend: [1, 1, 1, 1, 1, 1, 1],
    flag: { text: "First payment on Wednesday.", tone: "none" }, next: "schedule",
  },
];

export const fundedBook: FundedBook = {
  counts: { ok: 70, slow: 6, late: 5, soon: 5 },
  outstanding: 4_900_000,
  collectedThisMonth: 287_000,
  ofSchedule: 0.98,
  atRisk: 118_000,
  paidOffThisMonth: 11,
  renewedWithYou: 6,
  today: {
    settleBy: at("2026-10-13", "17:00"),
    cleared: { count: 72, amount: 24100 },
    pending: { count: 7, amount: 3400 },
    returned: { count: 2, amount: 870 },
  },
  warnings: [
    { merchant: "Granite State Builders", what: "took a new advance", detail: "Funder deposit $35K seen yesterday", tone: "red", opens: "stacking" },
    { merchant: "Kestrel Plumbing", what: "deposits down 22%", detail: "Last 3 weeks vs funding month", tone: "amber", opens: "book" },
    { merchant: "Westfield Auto Group", what: "balance below $500", detail: "3 of the last 5 days", tone: "amber", opens: "book" },
    { merchant: "Rivera Landscaping", what: "changed bank account", detail: "Payments now going to a new account", tone: "red", opens: "book" },
  ],
  vintages: [
    { month: "2026-05", collected: 0.96 },
    { month: "2026-06", collected: 0.81 },
    { month: "2026-07", collected: 0.62 },
    { month: "2026-08", collected: 0.44 },
    { month: "2026-09", collected: 0.22 },
  ],
  vintagesOnPlan: true,
  reconciliation: { merchant: "Kestrel Plumbing", askedAt: at("2026-10-12", "15:00"), salesChange: -0.22, respondBy: at("2026-10-17") },
  forecast: [
    { weekOf: at("2026-10-13"), expected: 142000, atRisk: 4000, height: 130 },
    { weekOf: at("2026-10-20"), expected: 139000, atRisk: 5000, height: 124 },
    { weekOf: at("2026-10-27"), expected: 137000, atRisk: 5000, height: 122 },
    { weekOf: at("2026-11-03"), expected: 131000, atRisk: 6000, height: 113 },
    { weekOf: at("2026-11-10"), expected: 126000, atRisk: 6000, height: 108 },
    { weekOf: at("2026-11-17"), expected: 118000, atRisk: 7000, height: 97 },
  ],
  returnedThisWeek: { count: 7, amount: 3100 },
  returned: [
    { merchant: "Westfield Auto Group", amount: 628, reason: "funds", next: { kind: "retry", at: at("2026-10-15") } },
    { merchant: "Kestrel Plumbing", amount: 412, reason: "funds", next: { kind: "cleared" } },
    { merchant: "Rivera Landscaping", amount: 458, reason: "blocked", next: { kind: "call" } },
  ],
  recovery: {
    behind: { count: 2, amount: 46000 },
    contacted: { count: 1, amount: 31000 },
    plan: { count: 2, amount: 41000 },
    backOnTrack: 4,
    writtenOff: { count: 1, amount: 22000 },
  },
  returns: { perDollar: 1.27, lossRate: 0.021, writtenOff: 46000, clawedBack: 3200 },
  payingOff: {
    count: 7,
    amount: 210000,
    first: [
      { merchant: "Coastal Dental", initials: "CD", colors: ["#24588A", "#4F86BD"], month: "2026-11" },
      { merchant: "Oakview Deli", initials: "OD", colors: ["#8A5A2B", "#B98552"], month: "2026-12" },
    ],
  },
};
