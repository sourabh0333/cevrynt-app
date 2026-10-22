/**
 * Renewal readiness rules, copied from design/prototypes/Settings-Renewals.dc.html.
 * Settings › Renewal rules edits them live; the Renewals page shows the same
 * defaults. Pure: no React, no "@/" imports, so `npm test` can load it.
 * Tested in lib/renewal-rules.test.ts.
 */

export type RenewalRules = {
  /** repaid at least, % */
  paid: number;
  /** no returned payments in this many days (0 = any time) */
  ret: number;
  /** revenue now vs at funding, % */
  rev: number;
  /** health score at least */
  score: number;
  /** no new advances from other funders */
  noStack: boolean;
};

/** Today's saved rules. With these, 9 merchants are ready (the Renewals page count). */
export const defaultRenewalRules: RenewalRules = { paid: 50, ret: 30, rev: 90, score: 75, noStack: true };

/** Slider ranges from the design. */
export const renewalRuleRanges = {
  paid: { min: 30, max: 80, step: 5 },
  ret: { min: 0, max: 90, step: 15 },
  rev: { min: 70, max: 110, step: 5 },
  score: { min: 60, max: 90, step: 5 },
} as const;

/** Only merchants at least this far repaid are considered at all. */
export const POOL_MIN_PAID = 30;

export type ReadinessMerchant = {
  name: string;
  /** % repaid */
  paid: number;
  /** days since the last returned payment (999 = none) */
  daysSinceReturn: number;
  /** revenue now vs at funding, % */
  rev: number;
  /** health score */
  health: number;
  /** another funder advanced them */
  stacking: boolean;
};

const passes = {
  paid: (m: ReadinessMerchant, r: RenewalRules) => m.paid >= r.paid,
  ret: (m: ReadinessMerchant, r: RenewalRules) => r.ret === 0 || m.daysSinceReturn >= r.ret,
  rev: (m: ReadinessMerchant, r: RenewalRules) => m.rev >= r.rev,
  score: (m: ReadinessMerchant, r: RenewalRules) => m.health >= r.score,
  stack: (m: ReadinessMerchant, r: RenewalRules) => !r.noStack || !m.stacking,
};

export const isReady = (m: ReadinessMerchant, r: RenewalRules) =>
  passes.paid(m, r) && passes.ret(m, r) && passes.rev(m, r) && passes.score(m, r) && passes.stack(m, r);

/** The first rule a merchant fails, worded for the list ("Repaid 45%", "Returned payment", ...). */
export function notReadyReason(m: ReadinessMerchant, r: RenewalRules) {
  if (!passes.paid(m, r)) return `Repaid ${m.paid}%`;
  if (!passes.ret(m, r)) return "Returned payment";
  if (!passes.rev(m, r)) return `Revenue ${m.rev}%`;
  if (!passes.score(m, r)) return `Score ${m.health}`;
  return "Stacking alert";
}

export type FunnelStep = { label: string; count: number; drop: number };

/**
 * Everything the settings page shows for a set of rules: the pool (30%+
 * repaid), who is ready, how each rule narrows the pool in turn, and the
 * change against today's saved rules.
 */
export function readiness(merchants: ReadinessMerchant[], r: RenewalRules) {
  const pool = merchants.filter((m) => m.paid >= POOL_MIN_PAID);
  const steps: [string, (m: ReadinessMerchant) => boolean][] = [
    [`Over ${POOL_MIN_PAID}% repaid`, () => true],
    [`Repaid ${r.paid}%+`, (m) => passes.paid(m, r)],
    ["No recent returns", (m) => passes.ret(m, r)],
    [`Revenue ${r.rev}%+`, (m) => passes.rev(m, r)],
    [`Score ${r.score}+`, (m) => passes.score(m, r)],
    ["No new advances", (m) => passes.stack(m, r)],
  ];
  let left = pool;
  const funnel: FunnelStep[] = steps.map(([label, fn], i) => {
    const before = left.length;
    left = left.filter(fn);
    return { label, count: left.length, drop: i ? before - left.length : 0 };
  });
  const ready = pool.filter((m) => isReady(m, r));
  const today = pool.filter((m) => isReady(m, defaultRenewalRules)).length;
  return { pool, ready, funnel, diff: ready.length - today };
}

/** "About 6 of today's 9 would go straight to an offer", from the auto-approve amount cap in $K. */
export function autoApproveCount(readyCount: number, capK: number) {
  return Math.max(1, Math.round(readyCount * Math.min(1, capK / 80)));
}
