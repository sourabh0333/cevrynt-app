/**
 * The offer math, shared by the offer builder, the merchant-pays panel,
 * the preset cards and the disclosure. Copied from the prototype's script
 * in design/prototypes/Deal-Offer.dc.html so every number on the tab
 * comes from one place. Pure: no React, no formatting side effects.
 * Tested in lib/offer-math.test.ts (`npm test`).
 */

export type Frequency = "daily" | "weekly";
export type CollectFrom = "ach" | "split";

export type OfferInput = {
  /** advance amount in dollars */
  amount: number;
  /** factor rate, for example 1.32 */
  factor: number;
  /** term in months */
  term: number;
  freq: Frequency;
  /** origination fee as a fraction of the amount (0, 0.02, 0.03) */
  fee: number;
  method: CollectFrom;
  /** pay off the existing Kingsway advance from this one */
  payoff: boolean;
};

/** The deal's fixed figures the math needs (sample data for Harbor Street Bakery). */
export type DealFigures = {
  /** true monthly revenue */
  revenue: number;
  /** the existing advance's monthly payment */
  existingMonthly: number;
  /** the existing advance's balance left */
  existingBalance: number;
  /** broker commission as a fraction of the amount */
  commission: number;
  /** monthly card sales, for the "collect from card sales" split */
  cardMonthly: number;
};

export type OfferPolicy = {
  /** all debt payments as a share of revenue */
  maxShare: number;
  ceiling: number;
  floor: number;
  factorMin: number;
  factorMax: number;
  /** what the signed-in underwriter can approve alone */
  approvalLimit: number;
};

export const harborFigures: DealFigures = {
  revenue: 61400,
  existingMonthly: 6185,
  existingBalance: 9400,
  commission: 0.08,
  cardMonthly: 28200,
};

export const ridgelinePolicy: OfferPolicy = {
  maxShare: 0.65,
  ceiling: 48000,
  floor: 30000,
  factorMin: 1.28,
  factorMax: 1.4,
  approvalLimit: 45000,
};

export const recommendedOffer: OfferInput = {
  amount: 40000,
  factor: 1.32,
  term: 6,
  freq: "daily",
  fee: 0,
  method: "ach",
  payoff: false,
};

/** Business days per month used for the schedule, and the average used for monthly cost. */
const BUSINESS_DAYS_PER_MONTH = 21;
const AVG_BUSINESS_DAYS = 21.7;

export type OfferResult = {
  payback: number;
  /** business-day payments over the term */
  days: number;
  weeks: number;
  /** number of payments at the chosen frequency */
  count: number;
  /** one payment at the chosen frequency */
  payment: number;
  daily: number;
  /** this advance's cost per month */
  perMonth: number;
  /** all debt payments as a share of revenue (0–1) */
  share: number;
  /** this advance alone as a share of revenue (0–1) */
  hold: number;
  feeAmount: number;
  /** cash the merchant receives */
  net: number;
  commission: number;
  margin: number;
  /** estimated APR in percent */
  apr: number;
  /** share of each day's card sales taken, for the split method (0–1) */
  cardShare: number;
  /** the month a renewal becomes possible (half repaid) */
  renewMonth: number;
  rules: {
    debtShare: boolean;
    ceiling: boolean;
    factor: boolean;
    approval: boolean;
  };
  /** inside policy: the debt share is within the limit */
  withinPolicy: boolean;
  /** above the underwriter's own limit, so a senior must approve */
  needsSenior: boolean;
};

/**
 * Estimated APR from the payment schedule: the periodic rate that makes
 * the payments' present value equal the amount, found by bisection, then
 * scaled by the periods in a year (252 business days or 52 weeks).
 */
export function estimateApr(amount: number, payment: number, count: number, periodsPerYear: number): number {
  let lo = 1e-7;
  let hi = 0.2;
  for (let i = 0; i < 80; i++) {
    const r = (lo + hi) / 2;
    const pv = (payment * (1 - Math.pow(1 + r, -count))) / r;
    if (pv > amount) lo = r;
    else hi = r;
  }
  return ((lo + hi) / 2) * periodsPerYear * 100;
}

export function computeOffer(
  input: OfferInput,
  figures: DealFigures = harborFigures,
  policy: OfferPolicy = ridgelinePolicy,
): OfferResult {
  const payback = input.amount * input.factor;
  const days = input.term * BUSINESS_DAYS_PER_MONTH;
  const weeks = Math.round((input.term * 52) / 12);
  const daily = payback / days;
  const count = input.freq === "daily" ? days : weeks;
  const payment = payback / count;
  const perMonth = daily * AVG_BUSINESS_DAYS;
  const share = (perMonth + (input.payoff ? 0 : figures.existingMonthly)) / figures.revenue;
  const feeAmount = input.amount * input.fee;
  const net = input.amount - feeAmount - (input.payoff ? figures.existingBalance : 0);
  const commission = input.amount * figures.commission;
  const margin = payback - input.amount - commission + feeAmount;
  const apr = estimateApr(input.amount, payment, count, input.freq === "daily" ? 252 : 52);
  const cardDaily = figures.cardMonthly / AVG_BUSINESS_DAYS;

  const rules = {
    debtShare: share <= policy.maxShare,
    ceiling: input.amount <= policy.ceiling,
    factor: input.factor >= policy.factorMin && input.factor <= policy.factorMax,
    approval: input.amount <= policy.approvalLimit,
  };

  return {
    payback,
    days,
    weeks,
    count,
    payment,
    daily,
    perMonth,
    share,
    hold: perMonth / figures.revenue,
    feeAmount,
    net,
    commission,
    margin,
    apr,
    cardShare: daily / cardDaily,
    renewMonth: Math.ceil(input.term / 2),
    rules,
    withinPolicy: rules.debtShare,
    needsSenior: !rules.approval,
  };
}

/** "$40,000" */
export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/** "$40K", "$9.4K" */
export const moneyShort = (n: number) => "$" + (n / 1000).toFixed(n % 1000 ? 1 : 0) + "K";

/** "25%" */
export const percent = (fraction: number) => Math.round(fraction * 100) + "%";

export const sameOffer = (a: OfferInput, b: Partial<OfferInput>) =>
  (Object.keys(b) as (keyof OfferInput)[]).every((k) => a[k] === b[k]);
