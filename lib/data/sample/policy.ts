import type { Policy, Pricing } from "@/lib/data/types";

/**
 * Sample policy and pricing records, copied from
 * design/prototypes/Settings.dc.html and Settings-Pricing.dc.html. Pages get
 * them through lib/data/settings (getPolicy, getPricing). These are the one
 * place the shared numbers live: the $10K – $150K range and the $45K / $100K
 * approval lines, the 65% debt limit, the factor grid, the early payoff
 * tiers, the loyalty price and the broker points.
 *
 * The pure calculation modules (lib/offer-math, lib/policy-sim) take these
 * values as their sample defaults, so their tests run on exactly what the
 * pages show. Pages always pass the values they loaded from the data layer.
 */
export const policy: Policy = {
  version: 3,
  limits: { minAmount: 10000, seniorAbove: 45000, seniorLimit: 100000, maxAmount: 150000 },
  minBusinessMonths: 6,
  minMonthlyRevenue: 15000,
  maxNsfsPerMonth: 8,
  negativeDaysFlag: 3,
  maxPositions: 2,
  maxDebtShare: 0.65,
  maxRevenueMultiple: 1.5,
  statedRevenueFlag: 1.5,
  restrictedIndustries: ["Trucking", "Cannabis", "Firearms", "Gambling", "Adult", "Debt collection", "Auto sales"],
  approvedIndustries: ["Restaurant", "Café", "Cafe", "Dental", "HVAC", "Cleaning", "Fitness", "Auto", "Plumbing", "Retail", "Florist", "Towing", "Medical", "Salon"],
  requiredStatementMonths: 4,
  concentration: { industryMax: 0.4, merchantMax: 0.03 },
  rules: [
    { id: "age", outcome: "decline", on: true },
    { id: "industry", outcome: "decline", on: true },
    { id: "kyc", outcome: "decline", on: true },
    { id: "revenue", outcome: "decline", on: true },
    { id: "nsf", outcome: "review", on: true },
    { id: "negdays", outcome: "flag", on: true },
    { id: "positions", outcome: "decline", on: true },
    { id: "debt", outcome: "decline", on: true },
    { id: "amount", outcome: "review", on: true },
    { id: "stated", outcome: "flag", on: true },
    { id: "senior", outcome: "review", on: true },
  ],
  scoreWeights: [
    { part: "cashFlow", points: 25 },
    { part: "debt", points: 20 },
    { part: "integrity", points: 20 },
    { part: "business", points: 15 },
    { part: "policyFit", points: 20 },
  ],
  scoreBands: { declineBelow: 55, approvalFrom: 70 },
  exceptions: [
    { reason: "3 positions allowed, strong cash flow", byId: "usr_priya" },
    { reason: "5 months in business, prior owner", byId: "usr_priya" },
    { reason: "$12K revenue, seasonal low", byId: "usr_priya" },
  ],
  exceptionRate: 0.04,
  exceptionWatch: 0.1,
  draft: { version: 4, title: "Allow 70% debt share", byId: "usr_maya", approverId: "usr_priya", proposedAt: "2026-10-13T10:20:00-04:00", change: { maxDebtShare: 0.7 } },
  liveTest: {
    name: "70% debt share",
    day: 12,
    days: 30,
    testShare: 0.2,
    approvalRate: { current: 0.41, test: 0.44 },
    earlyLate: { current: 0.026, test: 0.027 },
    dealsInTest: 19,
  },
  versions: [
    { version: 3, title: "Senior sign-off above $45K", byId: "usr_priya", at: "2026-09-02T10:00:00-04:00", live: true },
    { version: 2, title: "Revenue minimum raised to $15K", byId: "usr_priya", at: "2026-06-14T10:00:00-04:00", live: false },
    { version: 1, title: "First policy", byId: null, at: "2026-03-03T10:00:00-05:00", live: false },
  ],
};

export const pricing: Pricing = {
  terms: [4, 6, 8],
  grid: [
    { minScore: 90, maxScore: null, factors: [1.26, 1.28, 1.32] },
    { minScore: 80, maxScore: 89, factors: [1.28, 1.32, 1.36] },
    { minScore: 70, maxScore: 79, factors: [1.34, 1.38, 1.42] },
  ],
  loyaltyDiscount: 0.04,
  secondPositionAdd: 0.02,
  weeklyAdd: 0.01,
  originationFee: { min: 0, max: 0.03 },
  maxDailyHold: 0.2,
  firstPaymentBusinessDays: 2,
  collectBy: ["ach", "split"],
  brokerPoints: { newDeal: 8, renewal: 5 },
  earlyPayoff: [
    { days: 30, factor: 1.2 },
    { days: 60, factor: 1.24 },
    { days: 90, factor: 1.28 },
  ],
  industryAdjustments: [
    { industry: "Dental and medical", delta: -0.02 },
    { industry: "Professional services", delta: -0.01 },
    { industry: "Retail and food", delta: 0 },
    { industry: "Construction and trades", delta: 0.02 },
    { industry: "Auto repair", delta: 0.03 },
  ],
  sizing: [
    { minScore: 90, maxScore: null, multiple: 1.5 },
    { minScore: 80, maxScore: 89, multiple: 1.25 },
    { minScore: 70, maxScore: 79, multiple: 1.0 },
  ],
  guardrails: { brokerUpsellPoints: 2, minMarginPercent: 18 },
  disclosures: [
    { states: "New York", template: "NY sales-based financing", apr: "shown", counselReviewAt: "2026-08-15T12:00:00-04:00", status: "active" },
    { states: "California", template: "CA sales-based financing", apr: "shown", counselReviewAt: "2026-08-15T12:00:00-04:00", status: "active" },
    { states: "Connecticut", template: "CT commercial financing", apr: { from: "2027-07-01T12:00:00-04:00" }, counselReviewAt: "2026-09-15T12:00:00-04:00", status: "update" },
    { states: "Texas", template: "Registration only", apr: "not-needed", counselReviewAt: "2026-09-15T12:00:00-04:00", status: "register" },
    { states: "Maine, NH, MA, VT", template: "Standard cost summary", apr: "shown", counselReviewAt: "2026-07-15T12:00:00-04:00", status: "active" },
  ],
  forgiveUnearnedFees: true,
  showBrokerPay: true,
};
