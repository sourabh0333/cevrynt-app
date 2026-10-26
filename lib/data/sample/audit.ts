import type { AuditEntry, AuditLog } from "@/lib/data/types";

/**
 * Sample audit records, copied from design/prototypes/Settings-Audit.dc.html
 * (look: design/Settings-Audit.html). Entries about things other pages show
 * point at those records (today's releases, the policy draft, the blocked
 * sign-in, the invite, Harbor Street's suggestion), so their wording, people
 * and times come from there. Pages get these through lib/data/audit.
 */

const at = (time: string, day = "2026-10-13") => `${day}T${time}:00-04:00`;
const BOSTON = "Boston, MA";

/** Newest first. */
export const auditEntries: AuditEntry[] = [
  { id: "e1", kind: "release", releaseId: "rel-cs", where: BOSTON },
  { id: "e2", kind: "funding-started", releaseId: "rel-cs", checksPassedAt: at("10:57"), where: BOSTON },
  { id: "e3", kind: "policy-proposed", where: BOSTON },
  {
    id: "e4", kind: "event", at: at("10:12"), actorId: "usr_maya", category: "decision", what: "Marked integrity reviewed", object: { dealId: "APP-7H2K4Q" },
    where: BOSTON, before: "Needs sign-off", after: "Reviewed", note: "Note: catering transfer checked, same owner, left out of revenue.",
    link: { href: "/deals/APP-7H2K4Q/integrity", label: "Open the deal" },
  },
  { id: "e5", kind: "suggestion", dealId: "APP-7H2K4Q", at: at("09:41"), rulesMet: 8 },
  {
    id: "e6", kind: "event", at: at("09:35"), actorId: "usr_priya", category: "data", what: "Exported the October portfolio report", object: { text: "PDF · 14 pages" },
    where: BOSTON, note: "Name stamped on every page.", link: { href: "/reports", label: "Open Reports" },
  },
  { id: "e7", kind: "sign-in", signInId: "si-lagos" },
  { id: "e8", kind: "release", releaseId: "rel-bn", where: BOSTON },
  { id: "e9", kind: "invite", inviteId: "inv_kim", byId: "usr_nina", at: at("08:30"), where: BOSTON },
];

export const auditLog: AuditLog = {
  latestEntry: 48213,
  sealCheckedAt: at("06:00"),
  today: { events: 214, moneyAndPolicy: 6, exports: 2 },
  people: ["usr_priya", "usr_maya", "usr_sam", "usr_nina"],
  instantAlerts: [
    { kind: "money-account", on: true },
    { kind: "large-export", on: true },
    { kind: "policy-live", on: true },
    { kind: "support-access", on: true },
  ],
  legalHolds: [{ id: "HOLD-0042", merchantId: "mer-wa", reason: "payment dispute", placedById: "usr_nina", placedAt: at("12:00", "2026-10-02"), records: 214 }],
};
