import "server-only";
import type { FundingDesk, FundingSummary, PipelineOffer, QueuedFunding, Release } from "@/lib/data/types";
import { source } from "./source";

/** Approved offers on their way to funded, in stage order. */
export async function listPipeline(): Promise<PipelineOffer[]> {
  return source.funding.listPipeline();
}

/** Deals approved, signed and checked, waiting to be funded. */
export async function getFundingQueue(): Promise<QueuedFunding[]> {
  return source.funding.listQueue();
}

/** Money sent today: who started each payment and who released it. Read by Offers & funding and the Audit log. */
export async function listReleases(): Promise<Release[]> {
  return source.funding.listReleases();
}

/** The funding desk: cut-offs, the daily capital limit and the undo window. */
export async function getFundingDesk(): Promise<FundingDesk> {
  return source.funding.getDesk();
}

/** Counts across offers: stage totals, timing, money funded and offers lost. */
export async function getFundingSummary(): Promise<FundingSummary> {
  return source.funding.getSummary();
}
