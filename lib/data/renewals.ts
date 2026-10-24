import "server-only";
import type { RenewalCandidate, RenewalSettings, RenewalSummary } from "@/lib/data/types";
import { source } from "./source";

/** The merchants on the renewal radar, in the order it shows them. */
export async function listRenewalCandidates(): Promise<RenewalCandidate[]> {
  return source.renewals.listCandidates();
}

/** What Settings › Renewal rules has saved: who counts as ready, auto-approve, outreach, terms and limits. */
export async function getRenewalRules(): Promise<RenewalSettings> {
  return source.renewals.getSettings();
}

/** The renewal pipeline as a whole: value ready, monthly renewals, coming up, results and risks. */
export async function getRenewalSummary(): Promise<RenewalSummary> {
  return source.renewals.getSummary();
}
