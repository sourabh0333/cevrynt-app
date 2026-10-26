/**
 * Interface wording for Settings › Audit log (design/Settings-Audit.html
 * and its prototype). The entries come from the data layer (auditView),
 * each joined to the record it is about; this file words them from those
 * records: the release and who started and released it, the policy draft,
 * the blocked sign-in, the invite and Harbor Street's suggestion.
 */
import type { AuditCategory, AuditLog, IsoDateTime, TeamMember } from "@/lib/data/types";
import type { AuditData, AuditRow } from "@/lib/data/views/settings";
import { dateShort, dayLabel, daysBetween, money, moneyShort, timeOfDay } from "@/lib/format";
import { firstName, roleNames } from "./team";

export const categoryLabel: Record<AuditCategory, string> = {
  money: "Money",
  policy: "Policy",
  decision: "Decision",
  access: "Access",
  data: "Data",
  settings: "Settings",
};

export type Avatar = "blue" | "sand" | "red" | "cream" | "teal" | "line";
/** Who did it: a team member's initials, "C" for Cevrynt, "?" for someone unknown. */
export type AuditActor = { key: string; name: string; avatar: Avatar };

/** Each person's avatar color on the log, as the design draws them. */
const avatarOf: Record<string, Avatar> = { usr_priya: "blue", usr_maya: "sand", usr_nina: "red", usr_sam: "cream" };
const person = (m: TeamMember): AuditActor => ({ key: m.initials, name: m.name, avatar: avatarOf[m.id] ?? "line" });
export const cevrynt: AuditActor = { key: "C", name: "Cevrynt", avatar: "teal" };
const unknown: AuditActor = { key: "?", name: "Unknown", avatar: "line" };

/** An entry as the log and the detail panel show it. */
export type AuditEntryView = {
  id: string;
  at: IsoDateTime;
  time: string;
  actor: AuditActor;
  category: AuditCategory;
  what: string;
  object: string;
  where: string;
  before?: string;
  after?: string;
  note: string;
  link: { href: string; label: string };
};

const links = {
  offers: { href: "/offers", label: "Open Offers & funding" },
  policy: { href: "/settings/policy", label: "Open Policy" },
  security: { href: "/settings/security", label: "Open Security" },
  team: { href: "/settings/team", label: "Open Team & roles" },
};
const pct = (share: number) => `${Math.round(share * 100)}%`;

export function auditEntryView(r: AuditRow): AuditEntryView {
  switch (r.kind) {
    case "release": {
      const x = r.release;
      return {
        id: r.id, at: x.sentAt, time: timeOfDay(x.sentAt), actor: person(r.releasedBy), category: "money",
        what: `Released ${money(x.amount)} to ${x.merchant}`,
        object: `${x.method === "ach" ? "ACH · trace" : "Wire · ref"} …${x.reference.slice(-6)}`,
        where: r.where, before: "Awaiting release", after: "Sent",
        note: `Second person on a payment ${r.startedBy.name} started at ${timeOfDay(x.startedAt)}.`, link: links.offers,
      };
    }
    case "funding-started":
      return {
        id: r.id, at: r.release.startedAt, time: timeOfDay(r.release.startedAt), actor: person(r.startedBy), category: "money",
        what: `Started funding for ${r.release.merchant}`, object: "Funding queue", where: r.where, before: "Ready", after: "Awaiting release",
        note: `Final checks passed at ${timeOfDay(r.checksPassedAt)}.`, link: links.offers,
      };
    case "policy-proposed": {
      const [from, to] = [pct(r.currentDebtShare), pct(r.draft.change.maxDebtShare)];
      return {
        id: r.id, at: r.draft.proposedAt, time: timeOfDay(r.draft.proposedAt), actor: person(r.by), category: "policy",
        what: `Proposed policy version ${r.draft.version}`, object: `Debt share ${from} → ${to}`, where: r.where,
        before: `${from} of revenue`, after: `${to} of revenue`, note: `Waiting for ${r.approver.name} to approve. Not live yet.`, link: links.policy,
      };
    }
    case "sign-in": {
      const s = r.signIn;
      const account = s.account?.name ?? "";
      return {
        id: r.id, at: s.at, time: timeOfDay(s.at), actor: s.person ? person(s.person) : unknown, category: "access",
        what: `Blocked sign-in to ${account}’s account`, object: "Wrong 2-step code", where: s.place,
        note: `${firstName(account)} was told and asked to change his password.`, link: links.security,
      };
    }
    case "invite":
      return {
        id: r.id, at: r.at, time: timeOfDay(r.at), actor: person(r.by), category: "settings",
        what: `Invited ${r.invite.name}`, object: `${roleNames[r.invite.role]}, up to ${moneyShort(r.invite.approvalLimit ?? 0)}`, where: r.where,
        note: "Invite still open.", link: links.team,
      };
    case "suggestion":
      return {
        id: r.id, at: r.at, time: timeOfDay(r.at), actor: cevrynt, category: "decision",
        what: `Suggested approve ${money(r.deal.recommended ?? 0)}`, object: r.deal.merchantName, where: "Automatic",
        note: `Score ${r.deal.score}, policy v${r.policyVersion}, all ${r.rulesMet} rules met. A person makes the final decision.`,
        link: { href: `/deals/${r.deal.id}/decision`, label: "Open Decision & memo" },
      };
    case "event":
      return {
        id: r.id, at: r.at, time: timeOfDay(r.at), actor: person(r.actor), category: r.category,
        what: r.what, object: r.object, where: r.where, before: r.before, after: r.after, note: r.note, link: r.link,
      };
  }
}

/** Entry numbers count down from the newest; the seal is the prototype's hash-like code for that number. */
export const entryNumber = (log: AuditLog, index: number) => log.latestEntry - index;
export const sealFor = (n: number) => `sha256:${((n * 2654435761) >>> 0).toString(16)}c7e19a4b${((n * 40503) >>> 0).toString(16)}f02d`;

export const auditHeader = {
  sealed: (log: AuditLog, now: IsoDateTime) => `Sealed · checked ${dayLabel(log.sealCheckedAt, now).toLowerCase()} ${timeOfDay(log.sealCheckedAt)}`,
  title: "Audit log",
  text: "Every action by every person, kept 7 years. Entries can't be edited or deleted, by anyone.",
  export: "Export for auditors",
  monthly: "Send monthly copy",
  stats: (d: Pick<AuditData, "log" | "failedSignIns">) =>
    [
      { value: String(d.log.today.events), label: "Events today" },
      { value: String(d.log.today.moneyAndPolicy), label: "Money and policy changes" },
      { value: String(d.failedSignIns), label: "Failed sign-ins", alert: true },
      { value: String(d.log.today.exports), label: "Data exports" },
    ] as { value: string; label: string; alert?: boolean }[],
};

export const logFilters = {
  title: "Log entries",
  searchLabel: "Search the log",
  searchPlaceholder: "Search deal, merchant or setting",
  personLabel: "Person",
  everyone: "Everyone",
  /** the people offered, by initials, then Cevrynt's own steps */
  people: (people: TeamMember[]) => [...people.map(person), cevrynt],
  automatic: "Cevrynt (automatic)",
  categoryLabel: "Category",
  categories: [
    { key: "all", label: "All" },
    { key: "money", label: "Money" },
    { key: "decision", label: "Decisions" },
    { key: "policy", label: "Policy" },
    { key: "access", label: "Access" },
    { key: "data", label: "Data" },
    { key: "settings", label: "Settings" },
  ] as { key: "all" | AuditCategory; label: string }[],
  rangeLabel: "Time range",
  ranges: [
    { value: "today", label: "Today" },
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "custom", label: "Pick dates" },
  ],
  empty: "Nothing of this type today.",
};

export const entryDetail = {
  before: "BEFORE",
  after: "AFTER",
  day: (at: IsoDateTime, now: IsoDateTime) => dayLabel(at, now),
  seal: "Seal",
  sealNote: "Linked to the entry before it. Any change would break the chain.",
};

const alertWords: Record<AuditLog["instantAlerts"][number]["kind"], { title: string; hint: string }> = {
  "money-account": { title: "Money account changed", hint: "funding or collections" },
  "large-export": { title: "Large export", hint: "over 50 deals" },
  "policy-live": { title: "Policy goes live", hint: "after approval" },
  "support-access": { title: "Support access", hint: "Cevrynt team" },
};

export const instantAlerts = {
  title: "Alert admins instantly",
  sub: (log: AuditLog) => `${log.instantAlerts.length} sensitive actions`,
  items: (log: AuditLog) => log.instantAlerts.map((a) => ({ ...alertWords[a.kind], on: a.on })),
};

export const legalHolds = {
  title: "Legal holds",
  sub: "Never deleted while on hold",
  /** days on hold, counting the day it was placed */
  holds: (d: Pick<AuditData, "holds" | "now">) =>
    d.holds.map((h) => ({
      merchant: h.merchant,
      tag: `${h.id} · ${h.reason}`,
      days: daysBetween(h.placedAt, d.now) + 1,
      placedBy: firstName(h.placedBy.name),
      placedOn: dateShort(h.placedAt),
      records: h.records,
    })),
  daysLabel: "days",
  placedBy: "Placed by",
  recordsKept: "records kept",
  add: "+ Place a hold",
};

export const dealRecord = {
  title: "One deal's full record",
  text: "Every document, check, message, decision, signature and payment, in order, in one sealed file. For disputes and examiners.",
  sealed: "SEALED",
  inputLabel: "Deal or merchant",
  build: "Build",
};

export const entryLife = {
  title: "The life of a log entry",
  text: "From the moment something happens to the day it's removed",
  steps: [
    { title: "Recorded", hint: "Who, what, when, where, before and after", tone: "done" },
    { title: "Sealed", hint: "Linked to the entry before. Can't be changed", tone: "done" },
    { title: "Kept 7 years", hint: "Including automatic steps by Cevrynt", tone: "now" },
    { title: "Deleted", hint: "Unless a deal is on legal hold", tone: "later" },
  ] as { title: string; hint: string; tone: "done" | "now" | "later" }[],
};

export const auditSections = { more: "Alerts, legal holds and deal records" };
