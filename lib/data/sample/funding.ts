import type { FundingDesk, FundingSummary, PipelineOffer, QueuedFunding, Release } from "@/lib/data/types";

/**
 * Sample records for Offers & funding, copied from
 * design/prototypes/Offers.dc.html (look: design/Offers.html). Times are on
 * the sample day (Tuesday Oct 13). The Audit log reads the same releases,
 * so Priya's release times and amounts match on both pages. Pages get them
 * through lib/data/funding.
 */

const at = (time: string, day = 13) => `2026-10-${day}T${time}:00-04:00`;

export const pipelineOffers: PipelineOffer[] = [
  { id: "of-nh", merchant: "Northline HVAC Services", initials: "NH", colors: ["#A85C0B", "#D98A2B"], broker: "Summit Capital ISO", amount: 95000, stage: "sent", ownerId: "usr_maya", expiresAt: at("17:00") },
  { id: "of-pf", merchant: "Pinecrest Fitness Studio", initials: "PF", colors: ["#6B4FA0", "#9C86C9"], broker: "Keystone Brokerage", amount: 55000, stage: "sent", ownerId: "usr_jordan", expiresAt: at("18:00") },
  { id: "of-tp", merchant: "Tri-State Plumbing Co", initials: "TP", colors: ["#2C5F73", "#5A90A6"], broker: "Keystone Brokerage", amount: 110000, stage: "sent", ownerId: "usr_jordan", expiresAt: at("17:00", 15), countered: true },
  { id: "of-cd", merchant: "Coastal Dental Group", initials: "CD", colors: ["#24588A", "#4F86BD"], broker: "Apex Funding Partners", amount: 80000, stage: "accepted", ownerId: "usr_maya", renewal: true },
  { id: "of-gg", merchant: "Golden Gate Laundromat", initials: "GG", colors: ["#4D6B2E", "#7FA05A"], broker: "BlueRock Advisors", amount: 30000, stage: "accepted", ownerId: "usr_ari", contractDueAt: at("17:00") },
  { id: "of-sr", merchant: "Summit Roofing LLC", initials: "SR", colors: ["#7A4A2A", "#B07A52"], broker: "Apex Funding Partners", amount: 90000, stage: "contract", ownerId: "usr_maya", signatures: { signed: 1, needed: 2 } },
  { id: "of-ml", merchant: "Maple Leaf Dental", initials: "ML", colors: ["#A3341F", "#D06A52"], broker: "Summit Capital ISO", amount: 120000, stage: "contract", ownerId: "usr_ari", viewed: true },
  { id: "of-ce", merchant: "Copperline Electric", initials: "CE", colors: ["#0E6B5C", "#3FA58C"], broker: "Apex Funding Partners", amount: 45000, stage: "checks", ownerId: "usr_maya" },
  { id: "of-om", merchant: "Old Mill Brewery", initials: "OM", colors: ["#3E4A46", "#6B7873"], broker: "Summit Capital ISO", amount: 40000, stage: "checks", ownerId: "usr_jordan" },
  { id: "of-bn", merchant: "Bayview Nail Spa", initials: "BN", colors: ["#57418A", "#8670B8"], broker: "Summit Capital ISO", amount: 25000, stage: "funded", ownerId: "usr_jordan", sentAt: at("09:15") },
  { id: "of-cs", merchant: "Cedar Street Pharmacy", initials: "CS", colors: ["#0A5E50", "#2F8F7A"], broker: "Apex Funding Partners", amount: 60000, stage: "funded", ownerId: "usr_maya", sentAt: at("11:02") },
];

export const fundingQueue: QueuedFunding[] = [
  { id: "a", dealId: "APP-3CE8LQ", merchant: "Copperline Electric", initials: "CE", colors: ["#0E6B5C", "#3FA58C"], amount: 45000, fee: 0.02, payoff: 0, bank: { name: "Wells Fargo", last4: "2210" }, method: "ach", finalCheck: { ok: true } },
  { id: "b", dealId: "APP-8OM2BW", merchant: "Old Mill Brewery", initials: "OM", colors: ["#3E4A46", "#6B7873"], amount: 40000, fee: 0, payoff: 9500, bank: { name: "TD Bank", last4: "5530" }, method: "wire", finalCheck: { ok: true } },
  { id: "c", dealId: "APP-6LA4AB", merchant: "Lakeshore Auto Body", initials: "LA", colors: ["#24588A", "#4F86BD"], amount: 60000, fee: 0, payoff: 0, bank: { name: "Chase", last4: "0918" }, method: "ach", finalCheck: { ok: false, finding: "New UCC filing" } },
];

export const releases: Release[] = [
  {
    id: "rel-bn", merchant: "Bayview Nail Spa", broker: "Summit Capital ISO", amount: 25000, method: "ach",
    startedById: "usr_sam", startedAt: at("09:12"), releasedById: "usr_priya", sentAt: at("09:15"),
    reference: "021000020184477", status: "settled", firstPaymentAt: at("09:00", 14),
  },
  {
    id: "rel-cs", merchant: "Cedar Street Pharmacy", broker: "Apex Funding Partners", amount: 60000, method: "wire",
    startedById: "usr_sam", startedAt: at("10:58"), releasedById: "usr_priya", sentAt: at("11:02"),
    reference: "20261012MMQFMP2K000412", status: "confirmed", firstPaymentAt: at("09:00", 14),
  },
];

export const fundingDesk: FundingDesk = {
  achCutoff: at("14:00"),
  wireCutoff: at("16:00"),
  dailyLimit: 1_500_000,
  committedToday: 400_000,
  undoMinutes: 5,
};

export const fundingSummary: FundingSummary = {
  inProgress: 14,
  stageTotals: { sent: 6, accepted: 3, contract: 4, checks: 2, funded: 2 },
  medianDaysToFund: 2.6,
  fundedThisMonth: 1_240_000,
  fundedLastMonth: 1_107_000,
  lost: [
    { reason: "other-funder", count: 4 },
    { reason: "payment", count: 2 },
    { reason: "expired", count: 2 },
    { reason: "checks", count: 1 },
  ],
  approved: 52,
  medianMinutesToOffer: 192,
};
