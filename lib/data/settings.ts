import "server-only";
import type { NotificationRule, Policy, Pricing, Workspace } from "@/lib/data/types";
import { source } from "./source";

/** The funder's company details, brand, hours, accounts and web addresses. */
export async function getWorkspace(): Promise<Workspace> {
  return source.settings.getWorkspace();
}

/** The team's notification defaults, one per event. */
export async function listNotificationRules(): Promise<NotificationRule[]> {
  return source.settings.listNotificationRules();
}

/**
 * The live underwriting policy: the money limits and approval lines, the
 * rule values, score weights, versions and the draft waiting for approval.
 * The one source for the limits every other page shows.
 */
export async function getPolicy(): Promise<Policy> {
  return source.settings.getPolicy();
}

/** Pricing: the factor grid, adjustments, early payoff tiers, loyalty price, broker points and disclosures. */
export async function getPricing(): Promise<Pricing> {
  return source.settings.getPricing();
}
