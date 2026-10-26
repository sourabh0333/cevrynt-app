import type { ApiKey, SecuritySettings, SignIn } from "@/lib/data/types";

/**
 * Sample security records, copied from design/prototypes/Settings-Security.dc.html
 * (look: design/Settings-Security.html). Who has 2-step login lives on the
 * team records; the Audit log reads these sign-ins and Intake channels this
 * API key. Pages get them through lib/data/settings.
 */

const at = (time: string) => `2026-10-13T${time}:00-04:00`;

export const securitySettings: SecuritySettings = {
  protections: { mfa: true, sso: true, idle: true, newdev: true, ip: false, watermark: true, mask: true, bulk: true },
  outside: { brokerMfa: true, otp: true, single: true },
  supportUntil: null,
  activeSessions: 9,
  contactEmail: "security@ridgelinecap.com",
};

/** Today's sign-ins, newest first. */
export const signIns: SignIn[] = [
  { id: "si-maya", memberId: "usr_maya", device: "Chrome · Mac", place: "Boston, MA", at: at("10:42"), blocked: false },
  { id: "si-priya", memberId: "usr_priya", device: "Safari · iPhone", place: "Boston, MA", at: at("10:31"), blocked: false },
  { id: "si-lagos", memberId: null, accountId: "usr_ari", device: "Chrome · Windows", place: "Lagos, Nigeria", at: at("09:17"), blocked: { reason: "wrong-code" } },
  { id: "si-leo", memberId: "usr_leo", device: "Edge · Windows", place: "Quincy, MA", at: at("08:55"), blocked: false },
];

export const apiKeys: ApiKey[] = [{ id: "key-live", live: true, last4: "3f9a", createdAt: "2026-03-03T10:00:00-05:00", lastUsedAt: at("09:30") }];
