import type { AccessReview, Invite, OutsideAccess, TeamMember } from "@/lib/data/types";
import { policyLimits } from "@/lib/sample-data/policy";

/**
 * Sample team records, copied from design/prototypes/Settings-Team.dc.html.
 * Pages get them through lib/data/team. These are the one place the
 * underwriter workloads (7 / 9 / 6 / 3) and who lacks 2-step login live;
 * Submissions, Security, Plan & usage and the Audit log read them here
 * until their own pages move to the data layer. Approval limits come from
 * the policy limits, so the Offer, Policy and Team pages agree.
 */
const DAILY_CAPACITY = 10;
const uw = { approvalLimit: policyLimits.seniorAbove, todayNote: null, dailyCapacity: DAILY_CAPACITY, mfa: true, away: false };
const other = { approvalLimit: null, openDeals: null, dailyCapacity: DAILY_CAPACITY, mfa: true, away: false };

export const teamMembers: TeamMember[] = [
  { ...uw, id: "usr_maya", name: "Maya Chen", initials: "MC", email: "maya@ridgelinecap.com", role: "underwriter", openDeals: 7 },
  { ...uw, id: "usr_ari", name: "Ari Kaplan", initials: "AK", email: "ari@ridgelinecap.com", role: "underwriter", openDeals: 9 },
  { ...uw, id: "usr_jordan", name: "Jordan Reyes", initials: "JR", email: "jordan@ridgelinecap.com", role: "underwriter", openDeals: 6 },
  { ...uw, id: "usr_priya", name: "Priya Shah", initials: "PS", email: "priya@ridgelinecap.com", role: "senior", approvalLimit: policyLimits.seniorLimit, openDeals: 3 },
  { ...other, id: "usr_sam", name: "Sam Lee", initials: "SL", email: "sam@ridgelinecap.com", role: "funding", todayNote: "2 payouts" },
  { ...other, id: "usr_leo", name: "Leo Park", initials: "LP", email: "leo@ridgelinecap.com", role: "collections", todayNote: "5 deals behind", mfa: false },
  { ...other, id: "usr_nina", name: "Nina Ortiz", initials: "NO", email: "nina@ridgelinecap.com", role: "admin", todayNote: "Setup" },
];

export const teamInvites: Invite[] = [
  { id: "inv_kim", name: "Kim Tran", initials: "KT", email: "kim@ridgelinecap.com", role: "underwriter", approvalLimit: policyLimits.seniorAbove, sentAt: "2026-10-11T09:20:00-04:00" },
];

/** Due Oct 1 and still open on the sample day, Oct 13: 12 days late. */
export const accessReview: AccessReview = {
  lastDoneAt: "2026-07-01T11:00:00-04:00",
  lastDoneBy: "usr_nina",
  dueAt: "2026-10-01T09:00:00-04:00",
};

export const outsideAccess: OutsideAccess = { capitalPartners: 2, outsideCounsel: 1 };

/** The signed-in user in the sample world. */
export const CURRENT_USER_ID = "usr_maya";
