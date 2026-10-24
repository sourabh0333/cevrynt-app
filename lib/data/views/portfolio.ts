import "server-only";
import type { Advance, IsoDateTime, Merchant, RenewalSettings } from "@/lib/data/types";
import { readiness, readinessOf, type ReadinessMerchant } from "@/lib/renewal-rules";
import { listAdvances } from "../advances";
import { getNow } from "../clock";
import { listMerchants } from "../merchants";
import { getRenewalRules } from "../renewals";

/** A live advance with its merchant joined on. */
export type LiveAdvance = Advance & { merchant: Merchant };

export type Portfolio = {
  now: IsoDateTime;
  merchants: Merchant[];
  /** every live advance, in the order the renewal check lists them */
  advances: LiveAdvance[];
  settings: RenewalSettings;
  /** what the renewal rules look at for each advance, in the same order */
  inputs: ReadinessMerchant[];
  /** the advances ready to renew under the saved rules */
  readyIds: string[];
};

/**
 * Every live advance joined to its merchant, and who is ready to renew
 * under the saved rules. Merchants, Funded deals, Renewals and Renewal
 * rules all start from this, so they count the same merchants.
 */
export async function portfolio(): Promise<Portfolio> {
  const [advances, merchants, settings, now] = await Promise.all([listAdvances(), listMerchants(), getRenewalRules(), getNow()]);
  const byId = new Map(merchants.map((m) => [m.id, m]));
  const live = advances.map((a) => ({ ...a, merchant: byId.get(a.merchantId)! }));
  const inputs = live.map((a) => readinessOf(a, a.merchant, now));
  const { ready } = readiness(inputs, settings.rules, settings.rules);
  return { now, merchants, advances: live, settings, inputs, readyIds: ready.map((m) => m.id) };
}
