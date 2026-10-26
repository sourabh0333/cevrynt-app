import "server-only";
import type { ApiKey, IntakeChannelSettings, NotificationRule, Plan, Policy, Pricing, SecuritySettings, SignIn, Workspace } from "@/lib/data/types";
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

/** How Merchant Link is set up. */
export async function getIntakeChannels(): Promise<IntakeChannelSettings> {
  return source.settings.getIntakeChannels();
}

/** The plan: price, what's included, the spend limit, usage this month, other plans, invoices and payment. */
export async function getPlan(): Promise<Plan> {
  return source.settings.getPlan();
}

/** The workspace's protections, outside users' sign-in rules and support access. */
export async function getSecurity(): Promise<SecuritySettings> {
  return source.settings.getSecurity();
}

/** Today's sign-ins, newest first. Security and the Audit log read the same ones. */
export async function listSignIns(): Promise<SignIn[]> {
  return source.settings.listSignIns();
}

/** The workspace's API keys. */
export async function listApiKeys(): Promise<ApiKey[]> {
  return source.settings.listApiKeys();
}
