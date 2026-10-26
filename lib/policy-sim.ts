/**
 * Policy simulator math, copied from design/prototypes/Settings.dc.html.
 * Replays the last 90 days against three changed limits and returns the
 * four result tiles and the verdict exactly as the prototype computes them.
 * Real replays replace this later behind the same shape.
 *
 * The starting point and the late-payment target are the live policy's,
 * from the data layer (simInputFrom, Policy.latePaymentTarget).
 */
import type { Policy } from "@/lib/data/types";

export type SimInput = { maxPos: number; debt: number; minRev: number };
export type SimTone = "flat" | "good" | "bad";
export type SimTile = { key: "approvals" | "late" | "funded" | "profit"; value: string; delta: string; tone: SimTone };
export type SimVerdict = "current" | "risky" | "safer" | "better";

/** The simulator's three sliders for a policy: open positions, debt share in %, minimum revenue in $K. */
export const simInputFrom = (p: Pick<Policy, "maxPositions" | "maxDebtShare" | "minMonthlyRevenue">): SimInput => ({
  maxPos: p.maxPositions,
  debt: Math.round(p.maxDebtShare * 100),
  minRev: p.minMonthlyRevenue / 1000,
});

/** Today's published policy: 2 open positions, 65% debt share, $15K minimum revenue. */

/** Slider ranges from the design. */
export const simRanges = {
  maxPos: { min: 1, max: 3, step: 1 },
  debt: { min: 55, max: 75, step: 5 },
  minRev: { min: 10, max: 25, step: 5 },
} as const;

/** The late-payment target the verdict checks against, in %. */

const BASE = { approvals: 69, late: 2.6, funded: 1.24, profit: 0.248 };

/** "+11", "−0.5 pts", "±0.00M": sign, absolute value to dp places, unit. */
function signed(v: number, unit: string, dp: number) {
  return (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toFixed(dp) + unit;
}
const tone = (v: number, good: boolean): SimTone => (v === 0 ? "flat" : good ? "good" : "bad");

/**
 * Replays the last 90 days with `s` against the live policy `base`. A
 * change is risky when late payments pass the policy's target
 * (`lateTarget`, a fraction: 0.03 is 3%).
 */
export function simulatePolicy(s: SimInput, base: SimInput, lateTarget: number) {
  const dPos = s.maxPos - base.maxPos;
  const dDebt = (s.debt - base.debt) / 5;
  const dRev = (s.minRev - base.minRev) / 5;

  const approvals = BASE.approvals + dPos * (dPos < 0 ? 9 : 11) + dDebt * 2 - dRev * 6;
  const late = BASE.late + dPos * (dPos < 0 ? 0.5 : 0.9) + dDebt * 0.2 - dRev * 0.3;
  const funded = BASE.funded + dPos * (dPos < 0 ? 0.16 : 0.19) + dDebt * 0.04 - dRev * 0.11;
  const profit = funded * 0.2 * (1 - (late - BASE.late) * 0.06);

  const changed = dPos !== 0 || dDebt !== 0 || dRev !== 0;
  const risky = late > lateTarget * 100;
  const verdict: SimVerdict = !changed ? "current" : risky ? "risky" : approvals < BASE.approvals ? "safer" : "better";

  const tiles: SimTile[] = [
    { key: "approvals", value: String(Math.round(approvals)), delta: signed(approvals - BASE.approvals, "", 0), tone: tone(approvals - BASE.approvals, approvals >= BASE.approvals) },
    { key: "late", value: `${late.toFixed(1)}%`, delta: signed(late - BASE.late, " pts", 1), tone: tone(late - BASE.late, late <= BASE.late) },
    { key: "funded", value: `$${funded.toFixed(2)}M`, delta: signed(funded - BASE.funded, "M", 2), tone: tone(funded - BASE.funded, funded >= BASE.funded) },
    { key: "profit", value: `$${Math.round(profit * 1000)}K`, delta: signed(profit - BASE.profit, "M", 2), tone: tone(profit - BASE.profit, profit >= BASE.profit) },
  ];

  return { approvals, late, funded, profit, changed, risky, verdict, tiles };
}
