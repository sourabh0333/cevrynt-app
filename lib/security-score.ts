/**
 * Security score, copied from design/prototypes/Settings-Security.dc.html.
 * Each protection that is switched on adds points to a base of 20; the
 * prototype then takes 8 off and caps at 100. Pure, so `npm test` can load it.
 * Tested in lib/security-score.test.ts.
 */

import type { ProtectionKey } from "@/lib/data/types";

export type { ProtectionKey };

export const protectionPoints: Record<ProtectionKey, number> = {
  mfa: 20,
  sso: 10,
  idle: 8,
  newdev: 8,
  ip: 6,
  watermark: 8,
  mask: 12,
  bulk: 8,
};

const BASE = 20;
const OFFSET = 8;

export function securityScore(on: Partial<Record<ProtectionKey, boolean>>) {
  let score = BASE;
  (Object.keys(protectionPoints) as ProtectionKey[]).forEach((k) => {
    if (on[k]) score += protectionPoints[k];
  });
  return Math.min(100, score - OFFSET);
}

export type ScoreBand = "strong" | "fair" | "weak";
export const scoreBand = (score: number): ScoreBand => (score >= 80 ? "strong" : score >= 60 ? "fair" : "weak");
