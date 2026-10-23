import "server-only";
import type {
  DealBusiness,
  DealCashFlow,
  DealChecks,
  DealCondition,
  DealConditions,
  DealActivity,
  DealDeadline,
  DealDecision,
  DealIntegrity,
  DealOffer,
  DealPosition,
  Pricing,
  DealPositions,
  DealSummary,
  Id,
  IsoDateTime,
  Money,
  Policy,
  YearMonth,
} from "@/lib/data/types";
import { daysBetween } from "@/lib/format";
import { dealFiguresFrom, offerPolicyFrom, type DealFigures, type OfferInput, type OfferPolicy } from "@/lib/offer-math";
import { getNow } from "../clock";
import {
  getDeal,
  getDealActivity,
  getDealBusiness,
  getDealCashFlow,
  getDealConditions,
  getDealDecision,
  getDealIntegrity,
  getDealOffer,
  getDealPositions,
  getDealSummary,
} from "../deals";
import { getPolicy, getPricing, getWorkspace } from "../settings";
import { getCurrentUser, listTeam } from "../team";

/**
 * Everything the Summary, Cash flow and Positions tabs show for one deal,
 * loaded in parallel: the three tab records, the policy lines they quote,
 * and the deal's figures and recommended offer for the shared offer math.
 */
export type DealTabsData = {
  id: Id;
  now: IsoDateTime;
  /** where each stored check stands (the deal's own record) */
  checks: DealChecks;
  /** the deal's conditions, which the conditions check is worked out from */
  conditions: DealCondition[];
  summary: DealSummary;
  cashFlow: DealCashFlow;
  positions: DealPositions;
  policy: Pick<Policy, "maxDebtShare" | "limits" | "scoreWeights" | "scoreBands">;
  /** the deal's figures for computeOffer: revenue, existing payments, card sales, commission */
  figures: DealFigures;
  /** the policy's debt limit and approval line, with the deal's own range */
  offerPolicy: OfferPolicy;
  /** the recommended offer, as the offer math takes it */
  recommended: OfferInput;
};

/** The three tabs' data for one deal; null when there is no such deal (the layout shows "There's no deal …"). */
export async function dealTabsView(id: Id): Promise<DealTabsData | null> {
  const [deal, summary, cashFlow, positions, conditions, offer, policy, pricing, now] = await Promise.all([
    getDeal(id),
    getDealSummary(id),
    getDealCashFlow(id),
    getDealPositions(id),
    getDealConditions(id),
    getDealOffer(id),
    getPolicy(),
    getPricing(),
    getNow(),
  ]);
  if (!deal || !summary || !cashFlow || !positions) return null;
  const r = summary.recommendation;
  return {
    id: deal.id,
    now,
    checks: deal.checks,
    conditions: conditions?.items ?? [],
    summary,
    cashFlow,
    positions,
    policy: { maxDebtShare: policy.maxDebtShare, limits: policy.limits, scoreWeights: policy.scoreWeights, scoreBands: policy.scoreBands },
    figures: dealFiguresFrom(cashFlow, positions, pricing.brokerPoints.newDeal),
    offerPolicy: offerPolicyFrom(policy, offer?.range),
    recommended: { amount: r.amount, factor: r.factor, term: r.termMonths, freq: "daily", fee: 0, method: "ach", payoff: false },
  };
}

/* ---------- Integrity ---------- */

export type IntegrityTabData = {
  id: Id;
  integrity: DealIntegrity;
  /** the statements' account, for the evidence page header */
  bank: DealCashFlow["bank"];
  /** pages per statement month, for "p. 3 of 7" */
  pages: Record<YearMonth, number>;
  linesRead: number;
  /** the related-business transfer the "Jump before applying" check links to */
  relatedTransfer: Money | null;
  /** the integrity part of the score, out of the policy's weight for it */
  score: { points: number; outOf: number };
  /** the main owner, who is sent the bank link */
  owner: { name: string; possessive: string } | null;
  /** the signed-in underwriter, who signs off the review */
  reviewer: string;
};

/** The Integrity tab for one deal; null when there is no such deal. */
export async function integrityTabView(id: Id): Promise<IntegrityTabData | null> {
  const [deal, integrity, cashFlow, summary, business, policy, me] = await Promise.all([
    getDeal(id),
    getDealIntegrity(id),
    getDealCashFlow(id),
    getDealSummary(id),
    getDealBusiness(id),
    getPolicy(),
    getCurrentUser(),
  ]);
  if (!deal || !integrity || !cashFlow || !summary) return null;
  const owner = business?.owners[0];
  return {
    id: deal.id,
    integrity,
    bank: cashFlow.bank,
    pages: Object.fromEntries(cashFlow.months.map((m) => [m.month, m.pages])),
    linesRead: cashFlow.linesRead,
    relatedTransfer: cashFlow.setAside.find((s) => s.kind === "related")?.amount ?? null,
    score: {
      points: summary.score.parts.find((p) => p.part === "integrity")?.points ?? 0,
      outOf: policy.scoreWeights.find((w) => w.part === "integrity")?.points ?? 0,
    },
    owner: owner ? { name: owner.name, possessive: owner.possessive } : null,
    reviewer: me?.name ?? "",
  };
}

/* ---------- Business & owners ---------- */

export type BusinessTabData = {
  id: Id;
  now: IsoDateTime;
  business: DealBusiness;
  /** the industry isn't on the policy's restricted list */
  industryAllowed: boolean;
};

/** The Business & owners tab for one deal; null when there is no such deal. */
export async function businessTabView(id: Id): Promise<BusinessTabData | null> {
  const [deal, business, policy, now] = await Promise.all([getDeal(id), getDealBusiness(id), getPolicy(), getNow()]);
  if (!deal || !business) return null;
  const restricted = policy.restrictedIndustries.map((i) => i.toLowerCase());
  return { id: deal.id, now, business, industryAllowed: !restricted.includes(business.industry.label.toLowerCase()) };
}

/* ---------- Conditions & stips ---------- */

export type ConditionsTabData = {
  id: Id;
  now: IsoDateTime;
  conditions: DealConditions;
  /** the merchant and the broker's company, for the request message */
  merchantName: string;
  brokerName: string | null;
  /** the amount the conditions are set for (the recommended offer) */
  amount: Money;
  /** the business address the landlord letter is about */
  street: string;
  /** the signed-in underwriter: on "us" cards and signing the message */
  me: { name: string; initials: string };
  /** the senior underwriter who approves waived items */
  senior: string;
  /** the funder, signing the merchant's message */
  funder: string;
};

/** The Conditions & stips tab for one deal; null when there is no such deal. */
export async function conditionsTabView(id: Id): Promise<ConditionsTabData | null> {
  const [deal, conditions, summary, business, me, team, workspace, now] = await Promise.all([
    getDeal(id),
    getDealConditions(id),
    getDealSummary(id),
    getDealBusiness(id),
    getCurrentUser(),
    listTeam(),
    getWorkspace(),
    getNow(),
  ]);
  if (!deal || !conditions || !summary) return null;
  return {
    id: deal.id,
    now,
    conditions,
    merchantName: deal.merchantName,
    brokerName: deal.brokerName,
    amount: summary.recommendation.amount,
    street: business?.address.street ?? "",
    me: { name: me?.name ?? "", initials: me?.initials ?? "" },
    senior: team.find((m) => m.role === "senior")?.name ?? "",
    funder: workspace.name,
  };
}

/* ---------- Offer & disclosures ---------- */

type Person = { name: string; initials: string };
const personOf = (m: { name: string; initials: string } | null | undefined): Person => ({ name: m?.name ?? "", initials: m?.initials ?? "" });

/** The existing advance an offer can pay off: the first open position and every position's balance. */
const payoffOf = (positions: DealPosition[]) => (positions.length ? { funder: positions[0].funder, balance: positions.reduce((s, p) => s + p.estBalance, 0) } : null);

export type OfferTabData = {
  id: Id;
  figures: DealFigures;
  offerPolicy: OfferPolicy;
  recommended: OfferInput;
  offer: DealOffer;
  /** Pricing's early payoff table */
  earlyPayoff: Pricing["earlyPayoff"];
  /** the lowest score of the pricing band the deal's score is in (80 for "score 80+") */
  scoreBandFrom: number | null;
  /** the account payments are taken from */
  bank: DealCashFlow["bank"];
  /** the existing advance the offer can pay off */
  payoff: { funder: string; balance: Money } | null;
  /** the business's state, whose disclosure template applies */
  state: string;
  /** the main owner, who gets the early payoff discount */
  owner: { name: string; subject: string } | null;
  workspace: string;
  /** the senior underwriter who approves offers above the line */
  senior: string;
};

/** The Offer & disclosures tab for one deal; null when there is no such deal. */
export async function offerTabView(id: Id): Promise<OfferTabData | null> {
  const [tabs, offer, business, pricing, workspace, team] = await Promise.all([
    dealTabsView(id),
    getDealOffer(id),
    getDealBusiness(id),
    getPricing(),
    getWorkspace(),
    listTeam(),
  ]);
  if (!tabs || !offer) return null;
  const score = tabs.summary.score.total;
  const band = pricing.grid.find((b) => score >= b.minScore && (b.maxScore === null || score <= b.maxScore));
  const owner = business?.owners[0];
  return {
    id: tabs.id,
    figures: tabs.figures,
    offerPolicy: tabs.offerPolicy,
    recommended: tabs.recommended,
    offer,
    earlyPayoff: pricing.earlyPayoff,
    scoreBandFrom: band?.minScore ?? null,
    bank: tabs.cashFlow.bank,
    payoff: payoffOf(tabs.positions.positions),
    state: business?.registry.state ?? "",
    owner: owner ? { name: owner.name, subject: owner.subject } : null,
    workspace: workspace.name,
    senior: team.find((m) => m.role === "senior")?.name ?? "",
  };
}

/* ---------- Decision & memo ---------- */

export type DecisionTabData = {
  id: Id;
  merchantName: string;
  figures: DealFigures;
  offerPolicy: OfferPolicy;
  recommended: OfferInput;
  /** what the broker asked for, and Cevrynt's suggestion */
  requested: Money;
  score: number;
  /** the fraud risk from the Integrity checks */
  risk: DealIntegrity["risk"];
  decision: DealDecision;
  bank: DealCashFlow["bank"];
  positions: DealPosition[];
  /** conditions not met yet, in order (the memo's recommendation lists them) */
  openConditions: string[];
  /** the broker's short name and the main owner, who the offer or notice goes to */
  broker: string;
  owner: string;
  /** how long a sent offer stays open */
  validHours: number;
  /** what the policy check measures this deal on */
  facts: {
    years: number;
    industry: string;
    industryAllowed: boolean;
    /** most NSFs in any statement month */
    nsfMax: number;
    /** true monthly revenue, and what the merchant stated */
    revenue: Money;
    statedRevenue: Money;
    ownerClear: boolean;
  };
  policy: Pick<Policy, "version" | "limits" | "minBusinessMonths" | "maxDebtShare" | "maxNsfsPerMonth" | "maxRevenueMultiple" | "statedRevenueFlag" | "maxPositions">;
  /** the funder, on the memo */
  funder: string;
  /** the signed-in underwriter, and the senior who signs above their limit */
  me: Person;
  senior: Person;
};

/** The Decision & memo tab for one deal; null when there is no such deal. */
export async function decisionTabView(id: Id): Promise<DecisionTabData | null> {
  const [tabs, deal, decision, integrity, business, conditions, offer, policy, me, team, workspace] = await Promise.all([
    dealTabsView(id),
    getDeal(id),
    getDealDecision(id),
    getDealIntegrity(id),
    getDealBusiness(id),
    getDealConditions(id),
    getDealOffer(id),
    getPolicy(),
    getCurrentUser(),
    listTeam(),
    getWorkspace(),
  ]);
  if (!tabs || !deal || !decision) return null;
  const formed = business?.registry.formedAt;
  const years = formed ? Math.floor(daysBetween(formed, tabs.now) / 365.25) : 0;
  const industry = deal.profile?.industry ?? business?.industry.label ?? "";
  const restricted = policy.restrictedIndustries.map((i) => i.toLowerCase());
  return {
    id: deal.id,
    merchantName: deal.merchantName,
    figures: tabs.figures,
    offerPolicy: tabs.offerPolicy,
    recommended: tabs.recommended,
    requested: tabs.summary.recommendation.requested,
    score: tabs.summary.score.total,
    risk: integrity?.risk ?? "low",
    decision,
    bank: tabs.cashFlow.bank,
    positions: tabs.positions.positions,
    openConditions: (conditions?.items ?? []).filter((c) => c.status !== "done").map((c) => c.title),
    broker: conditions?.parties.broker.name ?? deal.brokerName ?? "",
    owner: business?.owners[0]?.name ?? "",
    validHours: offer?.validHours ?? 0,
    facts: {
      years,
      industry,
      industryAllowed: !restricted.includes((business?.industry.label ?? industry).toLowerCase()),
      nsfMax: Math.max(0, ...tabs.cashFlow.months.map((m) => m.nsfs)),
      revenue: tabs.figures.revenue,
      statedRevenue: tabs.summary.statedRevenue,
      ownerClear: (business?.owners ?? []).every((o) => o.identityVerified),
    },
    policy: {
      version: policy.version,
      limits: policy.limits,
      minBusinessMonths: policy.minBusinessMonths,
      maxDebtShare: policy.maxDebtShare,
      maxNsfsPerMonth: policy.maxNsfsPerMonth,
      maxRevenueMultiple: policy.maxRevenueMultiple,
      statedRevenueFlag: policy.statedRevenueFlag,
      maxPositions: policy.maxPositions,
    },
    funder: workspace.name,
    me: personOf(me),
    senior: personOf(team.find((m) => m.role === "senior")),
  };
}

/* ---------- Activity ---------- */

export type ActivityTabData = {
  id: Id;
  now: IsoDateTime;
  activity: DealActivity;
  receivedAt: IsoDateTime;
  deadline: DealDeadline;
  me: Person;
  /** the team members following the deal, and the ones suggested for @mentions */
  followers: Person[];
  mentions: Person[];
};

/** The Activity tab for one deal; null when there is no such deal. */
export async function activityTabView(id: Id): Promise<ActivityTabData | null> {
  const [deal, activity, me, team, now] = await Promise.all([getDeal(id), getDealActivity(id), getCurrentUser(), listTeam(), getNow()]);
  if (!deal || !activity) return null;
  const members = (ids: Id[]) => ids.map((x) => team.find((m) => m.id === x)).filter((m) => m !== undefined).map(personOf);
  return {
    id: deal.id,
    now,
    activity,
    receivedAt: deal.receivedAt,
    deadline: deal.deadline,
    me: personOf(me),
    followers: members(activity.followerIds),
    mentions: members(activity.mentionIds),
  };
}
