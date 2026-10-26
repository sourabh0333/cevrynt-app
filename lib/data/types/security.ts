import type { Id, IsoDateTime } from "./common";

/*
 * Settings › Security (design/Settings-Security.html). Who has 2-step login
 * is on the team records; a sign-in only says who and how, and its result
 * ("No 2-step") is read from that person. The Audit log reads the same
 * sign-ins, and Intake channels the same API key.
 */

export type ProtectionKey = "mfa" | "sso" | "idle" | "newdev" | "ip" | "watermark" | "mask" | "bulk";
export type OutsideKey = "brokerMfa" | "otp" | "single";

export type SecuritySettings = {
  protections: Record<ProtectionKey, boolean>;
  outside: Record<OutsideKey, boolean>;
  /** Cevrynt support may look in until then; null when not allowed */
  supportUntil: IsoDateTime | null;
  activeSessions: number;
  contactEmail: string;
};

export type SignIn = {
  id: Id;
  /** who signed in; null when it wasn't one of the team */
  memberId: Id | null;
  /** whose account it was for, when that differs (a blocked attempt) */
  accountId?: Id;
  device: string;
  place: string;
  at: IsoDateTime;
  blocked: false | { reason: "wrong-code" };
};

export type ApiKey = {
  id: Id;
  live: boolean;
  last4: string;
  createdAt: IsoDateTime;
  lastUsedAt: IsoDateTime;
};
