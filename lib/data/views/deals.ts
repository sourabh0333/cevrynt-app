import "server-only";
import type { Deal, DealCondition, DealListItem, DealOwner, DealQueueStats, DealQueueSummary, Id, IsoDateTime, TeamMember, WorkloadRow } from "@/lib/data/types";
import { getNow } from "../clock";
import { getDeal, getDealConditions, getQueueStats, getQueueSummary, listDeals } from "../deals";
import { getCurrentUser, listTeam } from "../team";

/*
 * Page-shaped joins over the deal records (DATA-PLAN.md, section 2):
 * each deal gets its owner's name and initials from the team, and
 * Submissions gets the team workload from the same team records.
 */

const ownerOf = (m: TeamMember): DealOwner => ({ id: m.id, initials: m.initials, name: m.name });

const withOwner = (deal: Deal, team: TeamMember[]): DealListItem => {
  const m = deal.ownerId ? team.find((x) => x.id === deal.ownerId) : undefined;
  return { ...deal, owner: m ? ownerOf(m) : null };
};

export type SubmissionsData = {
  deals: DealListItem[];
  summary: DealQueueSummary;
  stats: DealQueueStats;
  /** underwriters who take deals, in team order: Maya 7, Ari 9, Jordan 6, Priya 3 */
  workload: WorkloadRow[];
  /** the signed-in underwriter, for "Mine" and quick assign */
  me: DealOwner | null;
  /** deals on my desk today (the "Mine" view) */
  mine: number;
  now: IsoDateTime;
};

/** Everything Submissions shows, loaded in parallel. */
export async function submissionsView(): Promise<SubmissionsData> {
  const [deals, summary, stats, team, me, now] = await Promise.all([listDeals(), getQueueSummary(), getQueueStats(), listTeam(), getCurrentUser(), getNow()]);
  const workload = team
    .filter((m) => m.openDeals !== null)
    .map((m) => ({ ...ownerOf(m), open: m.openDeals ?? 0, capacity: m.dailyCapacity, overdue: summary.overdueByOwner[m.id] ?? 0 }));
  return {
    deals: deals.map((d) => withOwner(d, team)),
    summary,
    stats,
    workload,
    me: me ? ownerOf(me) : null,
    mine: me?.openDeals ?? 0,
    now,
  };
}

export type DealFrameData = {
  deal: DealListItem;
  /** the deal's conditions, which the tab bar's Conditions count follows */
  conditions: DealCondition[];
  now: IsoDateTime;
};

/** The deal frame (header and tabs) for one deal; null when there is no such deal. */
export async function dealFrameView(id: Id): Promise<DealFrameData | null> {
  const [deal, conditions, team, now] = await Promise.all([getDeal(id), getDealConditions(id), listTeam(), getNow()]);
  return deal ? { deal: withOwner(deal, team), conditions: conditions?.items ?? [], now } : null;
}
