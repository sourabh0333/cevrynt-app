import "server-only";
import type {
  AccessReview,
  ApiKey,
  AuditEntry,
  AuditLog,
  Deal,
  IntakeChannelSettings,
  IntakeSummary,
  Invite,
  IsoDateTime,
  Plan,
  PolicyDraft,
  Release,
  SecuritySettings,
  SignIn,
  TeamMember,
} from "@/lib/data/types";
import { getAuditLog, listAuditEntries } from "../audit";
import { getNow } from "../clock";
import { listDeals } from "../deals";
import { listReleases } from "../funding";
import { getIntakeSummary } from "../intake";
import { listMerchants } from "../merchants";
import { getIntakeChannels, getPlan, getPolicy, getSecurity, getWorkspace, listApiKeys, listSignIns } from "../settings";
import { getAccessReview, listInvites, listTeam } from "../team";

/*
 * The Organization and Deal flow settings pages. What they share is read
 * from one record each: Intake's monthly channel counts (Intake channels,
 * Plan & usage), the team (seats, 2-step login), today's sign-ins
 * (Security, Audit log) and the API key (Security, Intake channels).
 */

export type IntakeChannelsData = {
  now: IsoDateTime;
  settings: IntakeChannelSettings;
  month: IntakeSummary["month"];
  workspace: { name: string; initials: string };
  apiKey: ApiKey | null;
};

/** Everything Settings › Intake channels shows, loaded in parallel. */
export async function intakeChannelsView(): Promise<IntakeChannelsData> {
  const [settings, summary, workspace, keys, now] = await Promise.all([getIntakeChannels(), getIntakeSummary(), getWorkspace(), listApiKeys(), getNow()]);
  return { now, settings, month: summary.month, workspace: { name: workspace.name, initials: workspace.initials }, apiKey: keys.find((k) => k.live) ?? null };
}

export type PlanData = {
  now: IsoDateTime;
  plan: Plan;
  /** deals analyzed this month, by channel */
  month: IntakeSummary["month"];
  seats: { used: number; invites: number };
};

/** Everything Settings › Plan & usage shows, loaded in parallel. */
export async function planView(): Promise<PlanData> {
  const [plan, summary, team, invites, now] = await Promise.all([getPlan(), getIntakeSummary(), listTeam(), listInvites(), getNow()]);
  return { now, plan, month: summary.month, seats: { used: team.length, invites: invites.length } };
}

/** A sign-in with who it was and, for a blocked attempt, whose account. */
export type SignInRow = SignIn & { person: TeamMember | null; account: TeamMember | null };

export type SecurityData = {
  now: IsoDateTime;
  settings: SecuritySettings;
  signIns: SignInRow[];
  /** everyone without 2-step login */
  noMfa: TeamMember[];
  accessReview: AccessReview;
  apiKeys: ApiKey[];
};

const signInRows = (signIns: SignIn[], team: TeamMember[]): SignInRow[] =>
  signIns.map((s) => ({
    ...s,
    person: team.find((m) => m.id === s.memberId) ?? null,
    account: team.find((m) => m.id === (s.accountId ?? s.memberId)) ?? null,
  }));

/** Everything Settings › Security shows, loaded in parallel. */
export async function securityView(): Promise<SecurityData> {
  const [settings, signIns, team, accessReview, apiKeys, now] = await Promise.all([getSecurity(), listSignIns(), listTeam(), getAccessReview(), listApiKeys(), getNow()]);
  return { now, settings, signIns: signInRows(signIns, team), noMfa: team.filter((m) => !m.mfa), accessReview, apiKeys };
}

/** An audit entry with the records it points at joined on. */
export type AuditRow = { id: string } & (
  | { kind: "release"; release: Release; startedBy: TeamMember; releasedBy: TeamMember; where: string }
  | { kind: "funding-started"; release: Release; startedBy: TeamMember; checksPassedAt: IsoDateTime; where: string }
  | { kind: "policy-proposed"; draft: PolicyDraft; currentDebtShare: number; by: TeamMember; approver: TeamMember; where: string }
  | { kind: "sign-in"; signIn: SignInRow }
  | { kind: "invite"; invite: Invite; by: TeamMember; at: IsoDateTime; where: string }
  | { kind: "suggestion"; deal: Deal; policyVersion: number; at: IsoDateTime; rulesMet: number }
  | (Omit<Extract<AuditEntry, { kind: "event" }>, "object" | "actorId" | "id"> & { actor: TeamMember; object: string })
);

export type AuditData = {
  now: IsoDateTime;
  rows: AuditRow[];
  log: AuditLog;
  /** whose entries the person filter offers */
  people: TeamMember[];
  /** today's blocked sign-ins, as Security lists them */
  failedSignIns: number;
  holds: (AuditLog["legalHolds"][number] & { merchant: string; placedBy: TeamMember })[];
};

/** Everything Settings › Audit log shows, loaded in parallel; each entry joined to what it is about. */
export async function auditView(): Promise<AuditData> {
  const [entries, log, releases, policy, signIns, team, invites, deals, merchants, now] = await Promise.all([
    listAuditEntries(),
    getAuditLog(),
    listReleases(),
    getPolicy(),
    listSignIns(),
    listTeam(),
    listInvites(),
    listDeals(),
    listMerchants(),
    getNow(),
  ]);
  const member = (id: string) => team.find((m) => m.id === id)!;
  const signInList = signInRows(signIns, team);
  const rows = entries.map((e): AuditRow => {
    switch (e.kind) {
      case "release": {
        const r = releases.find((x) => x.id === e.releaseId)!;
        return { id: e.id, kind: e.kind, release: r, startedBy: member(r.startedById), releasedBy: member(r.releasedById), where: e.where };
      }
      case "funding-started": {
        const r = releases.find((x) => x.id === e.releaseId)!;
        return { id: e.id, kind: e.kind, release: r, startedBy: member(r.startedById), checksPassedAt: e.checksPassedAt, where: e.where };
      }
      case "policy-proposed": {
        const draft = policy.draft!;
        return { id: e.id, kind: e.kind, draft, currentDebtShare: policy.maxDebtShare, by: member(draft.byId), approver: member(draft.approverId), where: e.where };
      }
      case "sign-in":
        return { id: e.id, kind: e.kind, signIn: signInList.find((s) => s.id === e.signInId)! };
      case "invite":
        return { id: e.id, kind: e.kind, invite: invites.find((i) => i.id === e.inviteId)!, by: member(e.byId), at: e.at, where: e.where };
      case "suggestion":
        return { id: e.id, kind: e.kind, deal: deals.find((d) => d.id === e.dealId)!, policyVersion: policy.version, at: e.at, rulesMet: e.rulesMet };
      case "event": {
        const { actorId, object, ...rest } = e;
        const text = "dealId" in object ? (deals.find((d) => d.id === object.dealId)?.merchantName ?? "") : object.text;
        return { ...rest, actor: member(actorId), object: text };
      }
    }
  });
  return {
    now,
    rows,
    log,
    people: log.people.map(member),
    failedSignIns: signIns.filter((s) => s.blocked).length,
    holds: log.legalHolds.map((h) => ({ ...h, merchant: merchants.find((m) => m.id === h.merchantId)?.name ?? "", placedBy: member(h.placedById) })),
  };
}

/** The live policy version and when it went live, for the settings menu's Policy entry. */
export async function settingsMenuView(): Promise<{ version: number; liveSince: IsoDateTime } | null> {
  const policy = await getPolicy();
  const live = policy.versions.find((v) => v.version === policy.version);
  return live ? { version: policy.version, liveSince: live.at } : null;
}
