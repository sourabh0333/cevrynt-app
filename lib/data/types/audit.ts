import type { Id, IsoDateTime } from "./common";

/*
 * Settings › Audit log (design/Settings-Audit.html). An entry about
 * something another page shows points at that record: a release on
 * Offers & funding, the policy draft, a sign-in on Security, an invite on
 * Team & roles, a deal's suggestion. Its wording, people and times are
 * read from there, so the log can't contradict the pages.
 */

export type AuditCategory = "money" | "policy" | "decision" | "access" | "data" | "settings";

export type AuditEntry = { id: Id } & (
  /** a payment released by the second person */
  | { kind: "release"; releaseId: Id; where: string }
  /** the same payment, started by the first person */
  | { kind: "funding-started"; releaseId: Id; checksPassedAt: IsoDateTime; where: string }
  /** the policy draft waiting for its approver */
  | { kind: "policy-proposed"; where: string }
  | { kind: "sign-in"; signInId: Id }
  | { kind: "invite"; inviteId: Id; byId: Id; at: IsoDateTime; where: string }
  /** Cevrynt's suggested decision on a deal */
  | { kind: "suggestion"; dealId: Id; at: IsoDateTime; rulesMet: number }
  /** anything else, worded as it was recorded */
  | {
      kind: "event";
      at: IsoDateTime;
      actorId: Id;
      category: AuditCategory;
      what: string;
      /** a deal it was about (its merchant names the entry), or a description */
      object: { dealId: Id } | { text: string };
      where: string;
      before?: string;
      after?: string;
      note: string;
      link: { href: string; label: string };
    }
);

export type LegalHold = { id: string; merchantId: Id; reason: string; placedById: Id; placedAt: IsoDateTime; records: number };

export type AuditLog = {
  /** the newest entry's number; earlier ones count down */
  latestEntry: number;
  sealCheckedAt: IsoDateTime;
  today: { events: number; moneyAndPolicy: number; exports: number };
  /** whose entries the person filter offers, in order (team member ids) */
  people: Id[];
  /** the four sensitive actions that alert admins instantly */
  instantAlerts: { kind: "money-account" | "large-export" | "policy-live" | "support-access"; on: boolean }[];
  legalHolds: LegalHold[];
};
