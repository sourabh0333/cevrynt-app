import "server-only";
import type { Advance, FundedBook, FundingDesk, FundingSummary, IsoDateTime, PipelineOffer, QueuedFunding, Release } from "@/lib/data/types";
import { listAdvances, getFundedBook } from "../advances";
import { getNow } from "../clock";
import { getFundingDesk, getFundingQueue, getFundingSummary, listPipeline, listReleases } from "../funding";
import { getPricing } from "../settings";
import { getCurrentUser, listTeam } from "../team";

export type OffersData = {
  now: IsoDateTime;
  offers: PipelineOffer[];
  queue: QueuedFunding[];
  /** today's releases, with who released each one */
  releases: (Release & { releasedBy: string })[];
  desk: FundingDesk;
  summary: FundingSummary;
  /** the signed-in person, for "Mine" */
  meId: string;
  /** the second person who releases money (the senior underwriter) */
  releaser: string;
  /** Pricing's broker points on a new deal, for the commissions owed */
  brokerPoints: number;
};

/** Everything Offers & funding shows, loaded in parallel. */
export async function offersView(): Promise<OffersData> {
  const [offers, queue, releases, desk, summary, pricing, team, me, now] = await Promise.all([
    listPipeline(),
    getFundingQueue(),
    listReleases(),
    getFundingDesk(),
    getFundingSummary(),
    getPricing(),
    listTeam(),
    getCurrentUser(),
    getNow(),
  ]);
  const nameOf = (id: string) => team.find((m) => m.id === id)?.name ?? "";
  return {
    now,
    offers,
    queue,
    releases: releases.map((r) => ({ ...r, releasedBy: nameOf(r.releasedById) })),
    desk,
    summary,
    meId: me?.id ?? "",
    releaser: team.find((m) => m.role === "senior")?.name ?? "",
    brokerPoints: pricing.brokerPoints.newDeal,
  };
}

export type FundedData = {
  now: IsoDateTime;
  advances: Advance[];
  book: FundedBook;
};

/** Everything Funded deals shows, loaded in parallel. */
export async function fundedView(): Promise<FundedData> {
  const [advances, book, now] = await Promise.all([listAdvances(), getFundedBook(), getNow()]);
  return { now, advances, book };
}
