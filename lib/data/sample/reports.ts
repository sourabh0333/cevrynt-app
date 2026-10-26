import type { ReportsBook, ReportSnapshot } from "@/lib/data/types";

/**
 * Sample report records, copied from design/prototypes/Reports.dc.html
 * (look: design/Reports.html). A snapshot keeps only what no other record
 * has (its funnel, decision time and the period before); this month's
 * funding, the loss rate, broker points and cost per deal come from
 * Offers & funding, Funded deals, Pricing and Plan & usage. Pages get
 * these through lib/data/reports.
 */
export const reportSnapshots: ReportSnapshot[] = [
  {
    period: "week",
    funded: 310_000,
    funnel: { submitted: 86, fitPolicy: 54, reviewed: 54, approved: 22, accepted: 14, funded: 11 },
    decisionMinutes: 192,
    prev: { funded: 287_000, dealsFunded: 9, approvalRate: 0.41, pullThrough: 0.12, decisionMinutes: 212, lossRate: null },
    trends: [[3, 4, 3.5, 5, 6], [2, 3, 3, 4, 5], [5, 5, 5, 5, 5], [4, 4, 5, 5, 5], [6, 5, 5, 4, 3], [5, 5, 5, 5, 5]],
  },
  {
    period: "month",
    funded: null,
    funnel: { submitted: 312, fitPolicy: 196, reviewed: 168, approved: 69, accepted: 52, funded: 41 },
    decisionMinutes: 192,
    prev: { funded: null, dealsFunded: 35, approvalRate: 0.39, pullThrough: 0.13, decisionMinutes: 227, lossRate: null },
    trends: [[3, 3.5, 4, 4.6, 6], [3, 3.4, 4, 4.5, 5.5], [3.6, 3.8, 4, 4.4, 4.6], [4, 4.3, 4, 4.2, 4.2], [6, 5.5, 5, 4.4, 3.8], [5.2, 5, 4.8, 4.6, 4.5]],
  },
  {
    period: "quarter",
    funded: 3_280_000,
    funnel: { submitted: 862, fitPolicy: 540, reviewed: 470, approved: 193, accepted: 140, funded: 112 },
    decisionMinutes: 210,
    prev: { funded: 2_780_000, dealsFunded: 98, approvalRate: 0.38, pullThrough: 0.12, decisionMinutes: 260, lossRate: 0.025 },
    trends: [[2, 3, 3.6, 4.4, 6], [2, 3, 3.8, 4.4, 5.6], [3, 3.5, 4, 4.4, 4.8], [3.5, 3.8, 4, 4.3, 4.6], [6.4, 5.6, 5, 4.4, 3.6], [5.6, 5.2, 5, 4.6, 4.4]],
  },
  {
    period: "year",
    funded: 9_600_000,
    funnel: { submitted: 2817, fitPolicy: 1760, reviewed: 1300, approved: 507, accepted: 400, funded: 338 },
    decisionMinutes: 245,
    prev: { funded: 7_330_000, dealsFunded: 267, approvalRate: 0.35, pullThrough: 0.1, decisionMinutes: 345, lossRate: 0.027 },
    trends: [[1, 2, 3, 4.5, 6], [1.5, 2.5, 3.4, 4.6, 6], [3, 3.4, 3.8, 4.2, 4.8], [3, 3.6, 4, 4.4, 4.8], [6.6, 5.8, 5, 4.2, 3.4], [6, 5.4, 5, 4.6, 4.2]],
  },
];

export const reportsBook: ReportsBook = {
  rules: [
    { rule: "revenue", declined: 31, latePassed: 0.02, verdict: "working" },
    { rule: "positions", declined: 24, latePassed: 0.046, verdict: "tighten", simulate: 1 },
    { rule: "integrity", declined: 14, latePassed: 0.009, verdict: "working" },
    { rule: "age", declined: 12, latePassed: 0.031, verdict: "watch", simulate: 9 },
    { rule: "industry", declined: 10, latePassed: 0.022, verdict: "working" },
    { rule: "debt", declined: 8, latePassed: 0.014, verdict: "loosen" },
  ],
  unit: { averageDeal: 30_200, averageFactor: 1.32, averageTermMonths: 6.4, lossCents: 3, costCents: 1 },
  team: [
    { memberId: "usr_maya", decided: 112, medianMinutes: 170, approved: 0.44, agrees: 0.91, late: 0.018 },
    { memberId: "usr_ari", decided: 98, medianMinutes: 220, approved: 0.38, agrees: 0.84, late: 0.029 },
    { memberId: "usr_jordan", decided: 87, medianMinutes: 185, approved: 0.43, agrees: 0.88, late: 0.02 },
    { memberId: "usr_priya", decided: 41, medianMinutes: 130, approved: 0.36, agrees: 0.93, late: 0.012 },
  ],
};
