import type { RenewalCandidate, RenewalSettings, RenewalSummary } from "@/lib/data/types";

/**
 * Sample renewal records, copied from design/prototypes/Renewals.dc.html
 * and Settings-Renewals.dc.html. A candidate adds only the renewal's own
 * figures; its repaid share, revenue, balance and health come from the
 * advance and the merchant. Who is ready comes from the saved rules
 * below, run over every advance (lib/renewal-rules.ts). Pages get these
 * through lib/data/renewals.
 */

const at = (date: string, time = "12:00") => `${date}T${time}:00-04:00`;

/** In the order the radar shows them. */
export const renewalCandidates: RenewalCandidate[] = [
  { advanceId: "adv-hv", suggested: 55000, maxOffer: 65000, baseFactor: 1.32, offer: null },
  { advanceId: "adv-pr", suggested: 70000, maxOffer: 80000, baseFactor: 1.32, offer: null },
  { advanceId: "adv-cd", suggested: 80000, maxOffer: 90000, baseFactor: 1.3, offer: "accepted" },
  { advanceId: "adv-lc", suggested: 25000, maxOffer: 30000, baseFactor: 1.34, offer: null },
  { advanceId: "adv-od", suggested: 35000, maxOffer: 40000, baseFactor: 1.32, offer: "sent" },
  { advanceId: "adv-nf", suggested: 30000, maxOffer: 35000, baseFactor: 1.34, offer: null },
  { advanceId: "adv-bb", suggested: 20000, maxOffer: 22000, baseFactor: 1.36, offer: null },
  { advanceId: "adv-sy", suggested: 20000, maxOffer: 25000, baseFactor: 1.34, offer: null },
  { advanceId: "adv-kp", suggested: 0, maxOffer: 0, baseFactor: 1.37, offer: null },
];

/** What Settings › Renewal rules has saved. With these rules 9 merchants are ready. */
export const renewalSettings: RenewalSettings = {
  rules: { paid: 50, ret: 30, rev: 90, score: 75, noStack: true },
  autoApprove: { on: true, upTo: 50000 },
  outreach: [
    { kind: "heads-up", at: 40, on: true },
    { kind: "pre-approved", at: 50, on: true },
    { kind: "call", at: 65, on: true },
    { kind: "last-chance", at: 90, on: true },
  ],
  terms: { maxRevenueMultiple: 1.25, brokerKeepsMonths: 12 },
  limits: { offerValidDays: 7, minDaysBetween: 90, reviewAfter: 3, minNewCash: 0.3 },
};

export const renewalSummary: RenewalSummary = {
  readyValue: 402000,
  fundedByMonth: [
    { month: "2026-05", amount: 96000 },
    { month: "2026-06", amount: 115000 },
    { month: "2026-07", amount: 128000 },
    { month: "2026-08", amount: 156000 },
    { month: "2026-09", amount: 175000 },
    { month: "2026-10", amount: 212000 },
  ],
  comingUp: {
    count: 12,
    first: [
      { advanceId: "adv-sy", reachesLineAt: at("2026-10-21") },
      { advanceId: "adv-ms", reachesLineAt: at("2026-10-28") },
      { advanceId: "adv-bh", reachesLineAt: at("2026-11-04") },
      { advanceId: "adv-kp", reachesLineAt: null },
    ],
  },
  offersOut: 3,
  accepted: { count: 2, amount: 130000 },
  renewed: { count: 14, amount: 812000 },
  outreach: { sent: 64, replied: 0.41 },
  commissionSaved: 9600,
  atRisk: [
    { advanceId: "adv-pr", signal: "credit-check", likelihood: 80, actBy: "today" },
    { advanceId: "adv-hv", signal: "payoff-letter", likelihood: 60, actBy: "week" },
    { advanceId: "adv-lc", signal: "competitor-offer", likelihood: 45, actBy: "week" },
  ],
};
