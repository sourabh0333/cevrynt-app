import "server-only";
import type { AlertKind, FundedBook, FundingDesk, FundingSummary, IsoDateTime, PipelineOffer, QueuedFunding, Release } from "@/lib/data/types";
import { listAdvances, getFundedBook } from "../advances";
import { getNow } from "../clock";
import { getFundingDesk, getFundingQueue, getFundingSummary, listPipeline, listReleases } from "../funding";
import { listMerchants } from "../merchants";
import { listStackingAlerts } from "../stacking";
import type { LiveAdvance } from "./portfolio";
import { getPricing } from "../settings";
import { getCurrentUser, listTeam } from "../team";

export type OffersData = {
  now: IsoDateTime;
  offers: PipelineOffer[];
  /** each with the kind of Stacking Watch alert holding it, if one is */
  queue: (QueuedFunding & { hold: AlertKind | null })[];
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
  const [offers, queue, releases, desk, summary, pricing, team, me, alerts, now] = await Promise.all([
    listPipeline(),
    getFundingQueue(),
    listReleases(),
    getFundingDesk(),
    getFundingSummary(),
    getPricing(),
    listTeam(),
    getCurrentUser(),
    listStackingAlerts(),
    getNow(),
  ]);
  const holdOf = ({ finalCheck: c }: QueuedFunding) => (c.ok ? null : (alerts.find((a) => a.id === c.alertId)?.kind ?? null));
  const nameOf = (id: string) => team.find((m) => m.id === id)?.name ?? "";
  return {
    now,
    offers,
    queue: queue.map((q) => ({ ...q, hold: holdOf(q) })),
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
  /** the book's first page, each with its merchant */
  advances: LiveAdvance[];
  book: FundedBook;
};

/** Everything Funded deals shows, loaded in parallel. */
export async function fundedView(): Promise<FundedData> {
  const [advances, merchants, book, now] = await Promise.all([listAdvances(), listMerchants(), getFundedBook(), getNow()]);
  const page = book.page.map((id) => {
    const a = advances.find((x) => x.id === id)!;
    return { ...a, merchant: merchants.find((m) => m.id === a.merchantId)! };
  });
  return { now, advances: page, book };
}
