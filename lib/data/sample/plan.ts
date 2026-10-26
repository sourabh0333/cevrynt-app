import type { Plan } from "@/lib/data/types";

/**
 * Sample plan, copied from design/prototypes/Settings-Plan.dc.html (look:
 * design/Settings-Plan.html). The deals used this month are Intake's
 * monthly channel counts and the seats are the team, so neither is here.
 * Pages get this through lib/data/settings.
 */
export const plan: Plan = {
  current: { name: "Growth", monthly: 1490, deals: 400, seats: 10, features: [true, true, true, true, false] },
  renewsAt: "2026-11-01T00:00:00-04:00",
  extraDeal: 4.5,
  spendLimit: 500,
  warn: { on: true, at: 0.8 },
  yearlyDiscount: 0.15,
  usage: {
    pagesSkipped: 1840,
    linkSessions: 118,
    perDay: [8, 11, 9, 12, 14, 6, 3, 10, 13, 12, 11, 15],
    pace: 380,
  },
  otherTiers: {
    below: [{ name: "Starter", monthly: 590, deals: 150, seats: 3, features: [true, true, false, false, false] }],
    above: [{ name: "Scale", monthly: 3200, deals: 1200, seats: 25, features: [true, true, true, true, true] }],
  },
  invoices: [
    { month: "2026-10", amount: 1490, paid: true },
    { month: "2026-09", amount: 1490, paid: true },
    { month: "2026-08", amount: 1490, paid: true },
  ],
  payment: { last4: "4242", kind: "Business card", expires: "08/28", billingEmail: "billing@ridgelinecap.com" },
};
