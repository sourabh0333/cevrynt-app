import "server-only";
import type { Deal, DealBusiness, DealCashFlow, DealConditions, DealIntegrity, DealPositions, DealQueueStats, DealQueueSummary, DealSummary, Id } from "@/lib/data/types";
import { source } from "./source";

/** The open queue, in the order Submissions lists it. */
export async function listDeals(): Promise<Deal[]> {
  return source.deals.list();
}

/** One deal by its public id ("APP-7H2K4Q"); null when there is no such deal. */
export async function getDeal(id: Id): Promise<Deal | null> {
  return source.deals.get(id);
}

/** Counts across the whole open queue: by status, past deadline, unassigned. */
export async function getQueueSummary(): Promise<DealQueueSummary> {
  return source.deals.getQueueSummary();
}

/** Median waits per status and today's closed deals. */
export async function getQueueStats(): Promise<DealQueueStats> {
  return source.deals.getQueueStats();
}

/** The Summary tab's analysis for one deal: score, recommendation, findings, timeline. */
export async function getDealSummary(id: Id): Promise<DealSummary | null> {
  return source.deals.getSummary(id);
}

/** The Cash flow tab's figures for one deal: statements, months, weeks, sources, transactions. */
export async function getDealCashFlow(id: Id): Promise<DealCashFlow | null> {
  return source.deals.getCashFlow(id);
}

/** The Positions & debt tab's findings for one deal: positions, stacking, stated vs found. */
export async function getDealPositions(id: Id): Promise<DealPositions | null> {
  return source.deals.getPositions(id);
}

/** The Integrity tab's checks for one deal: documents, evidence, patterns, signals. */
export async function getDealIntegrity(id: Id): Promise<DealIntegrity | null> {
  return source.deals.getIntegrity(id);
}

/** The Business & owners tab's records for one deal: registry, location, owners, public records. */
export async function getDealBusiness(id: Id): Promise<DealBusiness | null> {
  return source.deals.getBusiness(id);
}

/** The Conditions & stips tab's conditions for one deal, with terms and final checks. */
export async function getDealConditions(id: Id): Promise<DealConditions | null> {
  return source.deals.getConditions(id);
}
