import "server-only";
import type {
  Deal,
  DealQueueStats,
  FundedBook,
  FundingSummary,
  Funnel,
  IntakeSummary,
  IsoDateTime,
  PipelineOffer,
  Task,
  TeamMember,
  Workspace,
} from "@/lib/data/types";
import { daysBetween } from "@/lib/format";
import { listAuditEntries } from "../audit";
import { getFundedBook } from "../advances";
import { listBrokers } from "../brokers";
import { getNow } from "../clock";
import { getDealConditions, getQueueStats, listDeals } from "../deals";
import { listActivity, listCalendar, listStips } from "../desk";
import { getFundingSummary, listPipeline } from "../funding";
import { getIntakeSummary } from "../intake";
import { listReportSnapshots } from "../reports";
import { getPolicy, getWorkspace } from "../settings";
import { listTasks } from "../tasks";
import { getCurrentUser, listTeam } from "../team";
import { brokerFlagCounts } from "./brokers";
import { portfolio } from "./portfolio";
import { alertRows } from "./stacking";

/** A stip, with the deal it is for and, for a deal's own condition, the condition's details. */
export type StipRow = { id: string; merchant: string; title: string; from: "merchant" | "broker" | "us" | "auto"; requestedAt: IsoDateTime | null; dueAt: IsoDateTime | null; sent: boolean };

/** A calendar entry with its time and who it is about. */
export type CalendarRow = { id: string; kind: "renewal-window" | "funding-call" | "broker-review" | "offer-expiry"; at: IsoDateTime; name: string; initials: string; withMe: boolean; dealId?: string };

/** An activity entry with its time and the names it mentions. */
export type ActivityRow = { id: string; at: IsoDateTime } & (
  | { kind: "alert"; alertKind: string; merchant: string }
  | { kind: "audit"; what: string; merchant: string; summary: string; by: string }
  | { kind: "upload"; merchant: string; files: number; channel: string }
  | { kind: "broker-message"; broker: string; merchant: string }
);

export type HomeData = {
  now: IsoDateTime;
  me: TeamMember;
  /** the signed-in person's open deals */
  myDeals: Deal[];
  offers: PipelineOffer[];
  funding: FundingSummary;
  closedToday: DealQueueStats["closedToday"];
  tasks: Task[];
  policyDraft: { version: number; from: number; to: number; approver: string } | null;
  book: FundedBook;
  intake: IntakeSummary;
  newAlerts: { count: number; firstAt: IsoDateTime | null };
  renewalsReady: number;
  /** this week's funnel, and the month's median time to a decision */
  week: { funnel: Funnel };
  decisionMinutes: number;
  workspace: Pick<Workspace, "decisionTargetHours" | "onTimeTarget" | "fundTargetDays">;
  stips: StipRow[];
  brokers: { name: string; sent: number; funded: number; flags: number }[];
  activity: ActivityRow[];
  calendar: CalendarRow[];
};

/** Everything Home shows, read from the records the other pages use. */
export async function homeView(): Promise<HomeData> {
  const [me, deals, offers, funding, stats, tasks, policy, book, intake, alerts, p, snapshots, workspace, stipList, brokers, flags, activity, calendar, audit, team, now] = await Promise.all([
    getCurrentUser(),
    listDeals(),
    listPipeline(),
    getFundingSummary(),
    getQueueStats(),
    listTasks(),
    getPolicy(),
    getFundedBook(),
    getIntakeSummary(),
    alertRows(),
    portfolio(),
    listReportSnapshots(),
    getWorkspace(),
    listStips(),
    listBrokers(),
    brokerFlagCounts(),
    listActivity(),
    listCalendar(),
    listAuditEntries(),
    listTeam(),
    getNow(),
  ]);
  const deal = (id: string) => deals.find((d) => d.id === id)!;
  const member = (id: string) => team.find((m) => m.id === id);
  const conditionsOf = async (dealId: string) => (await getDealConditions(dealId))?.items ?? [];

  const newToday = alerts.rows.filter((a) => a.status === "open" && daysBetween(a.seenAt, now) === 0).sort((a, b) => a.seenAt.localeCompare(b.seenAt));
  const draft = policy.draft;

  const stips: StipRow[] = await Promise.all(
    stipList.map(async (s) => {
      const d = deal(s.dealId);
      if (s.kind === "request") return { id: s.id, merchant: d.merchantName, title: s.title, from: s.from, requestedAt: s.requestedAt, dueAt: s.dueAt, sent: s.sent };
      const c = (await conditionsOf(s.dealId)).find((x) => x.id === s.conditionId)!;
      return { id: s.id, merchant: d.merchantName, title: c.title, from: c.party, requestedAt: null, dueAt: c.dueAt ?? null, sent: true };
    }),
  );

  const calendarRows: CalendarRow[] = await Promise.all(
    calendar.map(async (e): Promise<CalendarRow> => {
      switch (e.kind) {
        case "renewal-window": {
          const a = p.advances.find((x) => x.id === e.advanceId)!;
          return { id: e.id, kind: e.kind, at: e.startsAt, name: a.merchant.name, initials: a.merchant.initials, withMe: e.withMe };
        }
        case "funding-call": {
          const d = deal(e.dealId);
          const c = (await conditionsOf(e.dealId)).find((x) => x.id === e.conditionId)!;
          return { id: e.id, kind: e.kind, at: c.bookedAt ?? "", name: d.merchantName, initials: d.merchantInitials, withMe: e.withMe, dealId: d.id };
        }
        case "broker-review": {
          const b = brokers.find((x) => x.id === e.brokerId)!;
          return { id: e.id, kind: e.kind, at: e.at, name: b.name, initials: b.initials, withMe: e.withMe };
        }
        case "offer-expiry": {
          const o = offers.find((x) => x.id === e.offerId)!;
          return { id: e.id, kind: e.kind, at: o.expiresAt ?? "", name: o.merchant, initials: o.initials, withMe: e.withMe };
        }
      }
    }),
  );

  const activityRows = activity
    .map((e): ActivityRow => {
      switch (e.kind) {
        case "alert": {
          const a = alerts.rows.find((x) => x.id === e.alertId)!;
          return { id: e.id, at: a.seenAt, kind: "alert", alertKind: a.kind, merchant: a.merchant };
        }
        case "audit": {
          const x = audit.find((y) => y.id === e.entryId)!;
          if (x.kind !== "event") throw new Error(`Audit entry ${x.id} is not a recorded event`);
          const merchant = "dealId" in x.object ? deal(x.object.dealId).merchantName : x.object.text;
          return { id: e.id, at: x.at, kind: "audit", what: x.what, merchant, summary: e.summary, by: member(x.actorId)?.name ?? "" };
        }
        case "upload":
          return { id: e.id, at: e.at, kind: "upload", merchant: deal(e.dealId).merchantName, files: e.files, channel: e.channel };
        case "broker-message":
          return { id: e.id, at: e.at, kind: "broker-message", broker: brokers.find((b) => b.id === e.brokerId)?.name ?? "", merchant: deal(e.dealId).merchantName };
      }
    })
    .sort((a, b) => b.at.localeCompare(a.at));

  return {
    now,
    me: me!,
    myDeals: deals.filter((d) => d.ownerId === me?.id),
    offers,
    funding,
    closedToday: stats.closedToday,
    tasks: tasks.filter((t) => t.assigneeId === me?.id),
    policyDraft: draft ? { version: draft.version, from: policy.maxDebtShare, to: draft.change.maxDebtShare, approver: member(draft.approverId)?.name ?? "" } : null,
    book,
    intake,
    newAlerts: { count: newToday.length, firstAt: newToday[0]?.seenAt ?? null },
    renewalsReady: p.readyIds.length,
    week: { funnel: snapshots.find((s) => s.period === "week")!.funnel },
    decisionMinutes: snapshots.find((s) => s.period === "month")!.decisionMinutes,
    workspace: { decisionTargetHours: workspace.decisionTargetHours, onTimeTarget: workspace.onTimeTarget, fundTargetDays: workspace.fundTargetDays },
    stips,
    brokers: brokers.map((b) => ({ name: b.name, sent: b.thisMonth.submitted, funded: b.thisMonth.funded, flags: flags[b.shortName] ?? 0 })),
    activity: activityRows,
    calendar: calendarRows,
  };
}
