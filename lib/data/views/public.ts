import "server-only";
import type { IsoDateTime, LinkStepKey, Money, PolicyLimits, Workspace, YearMonth } from "@/lib/data/types";
import { listBrokers } from "../brokers";
import { getNow } from "../clock";
import { getDeal, getDealBusiness, getDealCashFlow, getDealConditions } from "../deals";
import { getMerchantLink } from "../public";
import { getIntakeChannels, getPolicy, getWorkspace } from "../settings";
import { listTeam } from "../team";

/** The funder as merchants see it on every public page: the workspace record. */
export type PublicFunder = Pick<Workspace, "name" | "initials" | "legalName" | "address" | "supportPhone" | "privacyUrl" | "termsUrl">;

const funderOf = (w: Workspace): PublicFunder => ({
  name: w.name,
  initials: w.initials,
  legalName: w.legalName,
  address: w.address,
  supportPhone: w.supportPhone,
  privacyUrl: w.privacyUrl,
  termsUrl: w.termsUrl,
});

/** The workspace, for the public pages' header, footer and help lines. */
export async function publicFunder(): Promise<PublicFunder> {
  return funderOf(await getWorkspace());
}

export type MerchantLinkData = {
  now: IsoDateTime;
  funder: PublicFunder;
  /** the business and what it asked for, from the deal */
  business: string;
  requested: Money;
  receivedAt: IsoDateTime;
  /** the owner the link was sent to, from Business & owners */
  owner: { name: string; email: string; phone: string };
  /** the business address, from Business & owners */
  street: string;
  /** the statement months and the account, from Cash flow */
  statementMonths: YearMonth[];
  accountLast4: string;
  /** each step, done or not, with conditions read from the deal */
  steps: { key: LinkStepKey; optional: boolean; doneAt: IsoDateTime | null }[];
  /** the deal's underwriter and its broker's contact */
  underwriter: { name: string; initials: string } | null;
  broker: { name: string; contact: string } | null;
  /** how many days a link works (Intake channels) and the days to fund (Workspace) */
  expiryDays: number;
  fundTargetDays: number;
};

/**
 * Everything the Merchant Link page shows for one token, read from the
 * link, its deal and the workspace. null when no link has the token, its
 * deal is gone, or it has expired: the page then shows "link has expired".
 */
export async function merchantLinkView(token: string): Promise<MerchantLinkData | null> {
  const [link, now, channels] = await Promise.all([getMerchantLink(token), getNow(), getIntakeChannels()]);
  if (!link) return null;
  const expiryDays = channels.merchantLink.expiryDays;
  if (Date.parse(link.sentAt) + expiryDays * 86_400_000 < Date.parse(now)) return null;

  const [deal, business, cashFlow, conditions, workspace, team, brokers] = await Promise.all([
    getDeal(link.dealId),
    getDealBusiness(link.dealId),
    getDealCashFlow(link.dealId),
    getDealConditions(link.dealId),
    getWorkspace(),
    listTeam(),
    listBrokers(),
  ]);
  if (!deal || !business || !cashFlow || !conditions) return null;
  const owner = business.owners[0];
  const underwriter = team.find((m) => m.id === deal.ownerId);
  const broker = brokers.find((b) => b.name === deal.brokerName);

  return {
    now,
    funder: funderOf(workspace),
    business: deal.merchantName,
    requested: deal.requested,
    receivedAt: deal.receivedAt,
    owner: { name: owner.name, email: owner.email, phone: owner.phone },
    street: business.address.street,
    statementMonths: cashFlow.months.map((m) => m.month),
    accountLast4: cashFlow.bank.last4,
    steps: link.steps.map((s) => {
      if ("doneAt" in s) return { key: s.key, optional: s.optional, doneAt: s.doneAt };
      const c = conditions.items.find((x) => x.id === s.conditionId);
      return { key: s.key, optional: s.optional, doneAt: c?.status === "done" ? (c.doneAt ?? null) : null };
    }),
    underwriter: underwriter ? { name: underwriter.name, initials: underwriter.initials } : null,
    broker: broker ? { name: broker.name, contact: broker.contact.name } : null,
    expiryDays,
    fundTargetDays: workspace.fundTargetDays,
  };
}

export type ApplyData = {
  funder: PublicFunder;
  /** the amount slider spans the policy's offer range */
  limits: Pick<PolicyLimits, "minAmount" | "maxAmount">;
  /** the form's own web address, from Workspace */
  host: string;
};

/** What the public application form needs: the funder, the policy's offer range and the form's address. */
export async function applyView(): Promise<ApplyData> {
  const [policy, workspace, funder] = await Promise.all([getPolicy(), getWorkspace(), publicFunder()]);
  return {
    funder,
    limits: { minAmount: policy.limits.minAmount, maxAmount: policy.limits.maxAmount },
    host: workspace.webAddresses.find((a) => a.kind === "apply")?.host ?? "",
  };
}
