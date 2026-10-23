import type { Id, IsoDateTime, Money } from "./common";

/** What someone does in the workspace. The names people read live in lib/copy/team. */
export type Role = "underwriter" | "senior" | "funding" | "collections" | "admin";

export type TeamMember = {
  id: Id;
  name: string;
  initials: string;
  email: string;
  role: Role;
  /** What they can approve alone, in dollars; null for roles that don't decide. */
  approvalLimit: Money | null;
  /** Deals on their desk today, for roles that decide; null for the others. Read by Submissions and Team. */
  openDeals: number | null;
  /** For roles that don't take deals: a short note on their day, e.g. "2 payouts". */
  todayNote: string | null;
  /** How many deals one person takes a day. */
  dailyCapacity: number;
  /** Has 2-step login turned on. Read by Team and Security. */
  mfa: boolean;
  away: boolean;
};

export type Invite = {
  id: Id;
  name: string;
  initials: string;
  email: string;
  role: Role;
  approvalLimit: Money | null;
  sentAt: IsoDateTime;
};

/** The quarterly check that everyone still needs their access. */
export type AccessReview = {
  lastDoneAt: IsoDateTime;
  /** a team member's id */
  lastDoneBy: Id;
  dueAt: IsoDateTime;
};

/** People outside the team with their own limited access. */
export type OutsideAccess = {
  capitalPartners: number;
  outsideCounsel: number;
};
