/**
 * Interface wording for the deal Activity tab (design/Deal-Activity.html).
 * The timeline, stages, messages and access log come from the data layer
 * (activityTabView); this file words them: times, durations, who said
 * what, and the people on the deal.
 */
import type { ActivityKind, DealActivity, DealDeadline, IsoDateTime, MessageThread } from "@/lib/data/types";
import { dateShort, dayLabel, timeOfDay, weekdayLong } from "@/lib/format";
import { deadlineLabel, hoursAndMinutes } from "./deal";

const firstName = (name: string) => name.split(" ")[0];

/** "41 sec", "16 min", "2h 32m" */
export const duration = (seconds: number) =>
  seconds < 60 ? `${seconds} sec` : seconds < 3600 ? `${Math.round(seconds / 60)} min` : hoursAndMinutes(Math.round(seconds / 60));

export const eventKinds: Record<ActivityKind, { label: string; tag: string; icon: string; mark?: string }> = {
  system: { label: "System", tag: "bg-page text-grey-text", icon: "bg-ink text-mint", mark: "C" },
  check: { label: "Check", tag: "bg-mint-bg text-teal-dark", icon: "bg-teal text-white", mark: "✓" },
  doc: { label: "Document", tag: "bg-blue-bg text-blue-text", icon: "bg-blue text-white" },
  message: { label: "Message", tag: "bg-amber-bg text-amber-text", icon: "bg-amber text-white" },
  note: { label: "Note", tag: "bg-purple-bg text-purple-text", icon: "bg-purple text-white" },
};

/** An event as the timeline shows it. */
export type TimelineEvent = { kind: ActivityKind; ini: string; title: string; detail: string; time: string; quote?: string; fresh?: boolean };

export const toTimelineEvent = (e: DealActivity["events"][number]): TimelineEvent => ({
  kind: e.kind,
  ini: eventKinds[e.kind].mark ?? e.by ?? "",
  title: e.title,
  detail: e.detail,
  time: timeOfDay(e.at),
  quote: e.quote,
});

const sideLabel = { us: "", broker: " (broker)", merchant: " (merchant)" };

export const paceCopy = {
  label: "Deal pace",
  analysis: { label: "Arrival to analysis done", note: "Fit check, scoring and memo" },
  queue: {
    label: "In your queue",
    note: (d: DealDeadline) => (d.kind === "left" ? `Decision due in ${hoursAndMinutes(d.minutes)}` : `Decision ${deadlineLabel(d).toLowerCase()}`),
  },
  people: { label: "People involved", note: (people: DealActivity["people"]) => people.map((p) => firstName(p.name) + sideLabel[p.side]).join(", ") },
  events: { label: "Events today", note: "Every action is kept" },
};

export const timelineCopy = {
  title: "Timeline",
  subtitle: "Everything that happened on this deal, newest first",
  search: "Search activity",
  exportLink: { label: "Export audit log", href: "#" },
  filterGroup: "Show",
  filters: [
    { key: "all", label: "All", dot: "bg-ink", onDot: "bg-mint" },
    { key: "check", label: "Checks", dot: "bg-teal" },
    { key: "doc", label: "Documents", dot: "bg-blue" },
    { key: "message", label: "Messages", dot: "bg-amber" },
    { key: "note", label: "Notes", dot: "bg-purple" },
    { key: "system", label: "System", dot: "bg-grey-dot" },
  ] as { key: ActivityKind | "all"; label: string; dot: string; onDot?: string }[],
  /** "Today · Tuesday, Oct 13" */
  day: (at: IsoDateTime, now: IsoDateTime) => `${dayLabel(at, now)} · ${weekdayLong(at)}, ${dateShort(at)}`,
  empty: "Nothing of this type yet.",
  /** the event a posted note becomes */
  noteEvent: (text: string, me: { name: string; initials: string }): TimelineEvent => ({
    kind: "note",
    ini: me.initials,
    title: `${firstName(me.name)} added a note`,
    detail: text,
    time: "now",
    fresh: true,
  }),
};

export const noteCopy = {
  title: "Add a note",
  intro: "Only your team sees notes. Type @ to bring someone in.",
  placeholder: "e.g. @Priya can you look at the catering transfer?",
  label: "Note",
  mention: (name: string) => `@${firstName(name)}`,
  add: "Add note",
  following: "Following this deal",
  /** the follower avatars' fills, in order */
  fills: ["bg-sand", "bg-mint-soft", "bg-cream"],
  remind: { off: "Remind me tomorrow", on: "Reminder set, tomorrow 9:00" },
};

type Message = DealActivity["threads"][MessageThread][number];

export const messagesCopy = {
  title: "Messages",
  group: "Conversation",
  tabs: [
    { key: "broker", label: "Broker" },
    { key: "merchant", label: "Merchant" },
  ] as { key: MessageThread; label: string }[],
  /** "Maya · 10:05 · delivered, opened 10:09", "Dana Ruiz · 10:20", "09:43" */
  meta: (m: Message, me: string) =>
    m.from === "system"
      ? timeOfDay(m.at)
      : m.from === "me"
        ? `${firstName(me)} · ${timeOfDay(m.at)}${m.seen ? ` · delivered, ${m.seen.kind} ${timeOfDay(m.seen.at)}` : " · delivered"}`
        : `${m.by ?? ""} · ${timeOfDay(m.at)}`,
  replyLabel: "Reply",
  replyHint: (name: string) => `Reply to ${firstName(name)}…`,
  send: "Send",
  channel: {
    broker: () => "By email. Replies land here automatically.",
    merchant: (name: string) => `Through Merchant Link. ${firstName(name)} gets a text and an email.`,
  } as Record<MessageThread, (name: string) => string>,
};

export const stageCopy: Record<DealActivity["stages"][number]["stage"], { label: string; color: string; warn?: boolean }> = {
  reading: { label: "Reading files", color: "bg-teal" },
  checks: { label: "Checks and memo", color: "bg-teal-soft" },
  uploads: { label: "Merchant uploads", color: "bg-mint" },
  waiting: { label: "Waiting for review", color: "bg-amber-light", warn: true },
};

export const timeSpentCopy = {
  title: "Where the time went",
  subtitle: (arrivedAt: IsoDateTime) => `From arrival at ${timeOfDay(arrivedAt)} until now`,
  barLabel: "Time by stage",
  /** each segment's width: its stage in minutes, at least 1 */
  flex: (seconds: number) => Math.max(1, Math.round(seconds / 60)),
  note: "The machine part took a minute. Most of the time is waiting for a person, which is normal before a decision.",
};

export const accessCopy = {
  title: "Who opened it",
  chip: "Audit",
  row: (r: DealActivity["access"][number]) => `${r.who} · ${r.action}`,
  note: "Read-only and kept for 7 years.",
};

export const activitySections = { timeline: "Timeline, notes and messages", time: "Where the time went and who opened it" };
