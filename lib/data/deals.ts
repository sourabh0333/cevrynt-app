import "server-only";
import type { Deal, DealQueueStats, DealQueueSummary, Id } from "@/lib/data/types";
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
