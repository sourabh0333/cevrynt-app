/**
 * Figures the deal tabs work out from a deal's records: totals and
 * averages from the statement months, today's debt share, room to pay, and
 * the keep-both vs pay-off comparison. Pure, no React; offer figures come
 * from the shared offer math so every tab agrees with the Offer tab.
 * Tested through lib/data/consistency.test.ts.
 */
import type { DealCashFlow, DealPositions } from "@/lib/data/types";
import { computeOffer, type DealFigures, type OfferInput, type OfferPolicy } from "@/lib/offer-math";

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
/** One decimal, as the design writes shares (10.1, 4.4). */
export const oneDecimal = (n: number) => Math.round(n * 10) / 10;

/** Deposits and true revenue over the statement period, and the share that counts as sales. */
export function revenueTotals(cf: Pick<DealCashFlow, "months">) {
  const deposited = sum(cf.months.map((m) => m.deposits));
  const trueRevenue = sum(cf.months.map((m) => m.trueRevenue));
  return { deposited, trueRevenue, monthly: trueRevenue / cf.months.length, counted: trueRevenue / deposited };
}

/** The month table's average row: each column averaged and rounded to $100; the lowest balance is the period's lowest. */
export function monthAverages(cf: Pick<DealCashFlow, "months">) {
  const avg100 = (xs: number[]) => Math.round(sum(xs) / xs.length / 100) * 100;
  const ms = cf.months;
  return {
    deposits: avg100(ms.map((m) => m.deposits)),
    trueRevenue: avg100(ms.map((m) => m.trueRevenue)),
    withdrawals: avg100(ms.map((m) => m.withdrawals)),
    debtPayments: avg100(ms.map((m) => m.debtPayments)),
    avgBalance: avg100(ms.map((m) => m.avgBalance)),
    lowestBalance: Math.min(...ms.map((m) => m.lowestBalance)),
    nsfs: Math.round(sum(ms.map((m) => m.nsfs)) / ms.length),
  };
}

/** Debt payments in the latest statement month, and their share of monthly true revenue. */
export function debtToday(cf: Pick<DealCashFlow, "months">) {
  const perMonth = cf.months[cf.months.length - 1].debtPayments;
  return { perMonth, share: perMonth / revenueTotals(cf).monthly };
}

/** A share's fill against the policy's debt limit, 0–100. */
export const ofLimit = (share: number, maxShare: number) => Math.round((share / maxShare) * 100);

/** The existing advances' daily payments together. */
export const existingDaily = (p: Pick<DealPositions, "positions">) => sum(p.positions.map((x) => x.dailyPayment));

/** Room to pay per business day: the existing advance, the recommended offer and what's left, as shares of the day's revenue. */
export function roomToPay(cf: Pick<DealCashFlow, "revenuePerBusinessDay">, existing: number, offerDaily: number) {
  const perDay = cf.revenuePerBusinessDay;
  const existingShare = oneDecimal((existing / perDay) * 100);
  const offerShare = oneDecimal((offerDaily / perDay) * 100);
  return {
    perDay,
    parts: [
      { key: "existing" as const, amount: existing, share: existingShare },
      { key: "offer" as const, amount: offerDaily, share: offerShare },
      { key: "left" as const, amount: perDay - existing - offerDaily, share: oneDecimal(100 - existingShare - offerShare) },
    ],
  };
}

export type PaymentCell = "pad" | "paid" | "holiday" | "bounced";

/**
 * One cell per business day of a position's payment history, padded so the
 * first column starts on a Monday. Bank holidays carry no debit.
 */
export function paymentCells(history: { from: string; to: string; holidays: string[]; bounced: string[] }): { cells: PaymentCell[]; debits: number } {
  const cells: PaymentCell[] = [];
  let debits = 0;
  const d = new Date(`${history.from.slice(0, 10)}T00:00:00Z`);
  const end = new Date(`${history.to.slice(0, 10)}T00:00:00Z`);
  const lead = (d.getUTCDay() + 6) % 7;
  for (let i = 0; i < lead && i < 5; i++) cells.push("pad");
  while (d <= end) {
    const wd = d.getUTCDay();
    if (wd >= 1 && wd <= 5) {
      const day = d.toISOString().slice(0, 10);
      const cell: PaymentCell = history.holidays.includes(day) ? "holiday" : history.bounced.includes(day) ? "bounced" : "paid";
      if (cell === "paid") debits++;
      cells.push(cell);
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return { cells, debits };
}

/** "Mid-November": early, mid or late in the month. */
export const partOfMonth = (iso: string) => {
  const day = Number(iso.slice(8, 10));
  return day <= 10 ? "Early" : day <= 20 ? "Mid" : "Late";
};

/** "1st", "2nd", "3rd", "4th" */
export const ordinal = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;

/** The recommended offer with its figures, and the same offer paying off the existing advances. */
export function scenarios(recommended: OfferInput, figures: DealFigures, policy: OfferPolicy) {
  const keep = computeOffer({ ...recommended, payoff: false }, figures, policy);
  const pay = computeOffer({ ...recommended, payoff: true }, figures, policy);
  return { keep, pay };
}
