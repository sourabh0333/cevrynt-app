import "server-only";
import type { StackingAlert, StackingSummary } from "@/lib/data/types";
import { source } from "./source";

/** Every Stacking Watch alert, open and reviewed, newest kept first as the page lists them. */
export async function listStackingAlerts(): Promise<StackingAlert[]> {
  return source.stacking.listAlerts();
}

/** Coverage, this month's outcomes and the automatic rules. */
export async function getStackingSummary(): Promise<StackingSummary> {
  return source.stacking.getSummary();
}
