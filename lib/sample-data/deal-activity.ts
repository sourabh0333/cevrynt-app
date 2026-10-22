/**
 * Sample data for the Activity tab, copied from
 * design/prototypes/Deal-Activity.dc.html (look: design/Deal-Activity.html).
 * Real API calls replace this later behind the same types.
 */

export type EventKind = "system" | "check" | "doc" | "message" | "note";

export type ActivityEvent = {
  kind: EventKind;
  /** initials or mark on the icon tile */
  ini: string;
  title: string;
  detail: string;
  time: string;
  quote?: string;
  /** a note added on this page: shown on the purple tint */
  fresh?: boolean;
};

export const eventKinds: Record<EventKind, { label: string; tag: string; icon: string }> = {
  system: { label: "System", tag: "bg-page text-grey-text", icon: "bg-ink text-mint" },
  check: { label: "Check", tag: "bg-mint-bg text-teal-dark", icon: "bg-teal text-white" },
  doc: { label: "Document", tag: "bg-blue-bg text-blue-text", icon: "bg-blue text-white" },
  message: { label: "Message", tag: "bg-amber-bg text-amber-text", icon: "bg-amber text-white" },
  note: { label: "Note", tag: "bg-purple-bg text-purple-text", icon: "bg-purple text-white" },
};

export const pace = [
  { label: "Arrival to analysis done", value: "1 min", note: "Fit check, scoring and memo", tone: "mint" },
  { label: "In your queue", value: "2h 50m", note: "Decision due in 1h 10m", tone: "grey" },
  { label: "People involved", value: "3", note: "Maya, Dana (broker), Elena (merchant)", tone: "sand" },
  { label: "Events today", value: "count", note: "Every action is kept", tone: "grey" },
] as { label: string; value: string; note: string; tone: "mint" | "grey" | "sand" }[];

export const timeline = {
  title: "Timeline",
  subtitle: "Everything that happened on this deal, newest first",
  search: "Search activity",
  exportLink: { label: "Export audit log", href: "#" },
  filters: [
    { key: "all", label: "All", dot: "bg-ink", onDot: "bg-mint" },
    { key: "check", label: "Checks", dot: "bg-teal" },
    { key: "doc", label: "Documents", dot: "bg-blue" },
    { key: "message", label: "Messages", dot: "bg-amber" },
    { key: "note", label: "Notes", dot: "bg-purple" },
    { key: "system", label: "System", dot: "bg-grey-dot" },
  ] as { key: EventKind | "all"; label: string; dot: string; onDot?: string }[],
  day: "Today · Monday, Oct 12",
  empty: "Nothing of this type yet.",
  events: [
    { kind: "message", ini: "DR", title: "Dana Ruiz replied", detail: "Apex Funding · by email", time: "10:20", quote: "Asked Elena, she’ll have it from the landlord tomorrow morning." },
    { kind: "note", ini: "MC", title: "Maya marked integrity reviewed", detail: "Catering transfer checked, same owner, left out of revenue", time: "10:12" },
    { kind: "message", ini: "MC", title: "Landlord letter requested", detail: "Sent to Dana Ruiz at Apex Funding, due Wed", time: "10:05" },
    { kind: "system", ini: "C", title: "Memo updated to version 2", detail: "Added the landlord letter condition", time: "10:05" },
    { kind: "check", ini: "✓", title: "Identity and sanctions clear", detail: "Photo ID, selfie match, OFAC and other lists", time: "09:59" },
    { kind: "doc", ini: "EB", title: "Elena uploaded 3 files", detail: "Photo ID, selfie and voided check through Merchant Link", time: "09:58" },
    { kind: "system", ini: "C", title: "Assigned to Maya Chen", detail: "Automatic, by team workload", time: "09:42" },
    { kind: "check", ini: "✓", title: "Analysis complete", detail: "Score 88 · fraud risk low · recommend approve $40,000", time: "09:41" },
    { kind: "check", ini: "✓", title: "Fit check passed", detail: "Industry, time in business, revenue and positions within policy", time: "09:41" },
    { kind: "doc", ini: "AP", title: "Package received", detail: "7 files from Apex Funding Partners, sorted and named", time: "09:40" },
  ] as ActivityEvent[],
  /** the event a posted note becomes */
  noteEvent: (text: string): ActivityEvent => ({ kind: "note", ini: "MC", title: "Maya added a note", detail: text, time: "now", fresh: true }),
};

export const noteCard = {
  title: "Add a note",
  intro: "Only your team sees notes. Type @ to bring someone in.",
  placeholder: "e.g. @Priya can you look at the catering transfer?",
  mentions: ["@Priya", "@Jordan"],
  add: "Add note",
  following: { label: "Following this deal", people: [{ ini: "MC", fill: "bg-sand" }, { ini: "PS", fill: "bg-mint-soft" }] },
  remind: { off: "Remind me tomorrow", on: "Reminder set, tomorrow 9:00" },
};

export type Thread = "broker" | "merchant";

export type Message = { text: string; meta: string; from: "me" | "them" | "system" };

export const messages = {
  title: "Messages",
  tabs: [
    { key: "broker", label: "Broker" },
    { key: "merchant", label: "Merchant" },
  ] as { key: Thread; label: string }[],
  threads: {
    broker: [
      { text: "Could you send a landlord letter for 418 Commercial St by Wednesday?", meta: "Maya · 10:05 · delivered, opened 10:09", from: "me" },
      { text: "Asked Elena, she’ll have it from the landlord tomorrow morning.", meta: "Dana Ruiz · 10:20", from: "them" },
    ],
    merchant: [
      { text: "Merchant Link sent to elena@harborstreetbakery.com", meta: "09:43", from: "system" },
      { text: "Uploaded my license, a selfie and a voided check.", meta: "Elena Brooks · 09:58", from: "them" },
      { text: "Thank you, Elena. Everything checks out so far.", meta: "Maya · 10:01 · delivered, read 10:02", from: "me" },
    ],
  } as Record<Thread, Message[]>,
  replyHint: { broker: "Reply to Dana…", merchant: "Reply to Elena…" } as Record<Thread, string>,
  send: "Send",
  channel: {
    broker: "By email. Replies land here automatically.",
    merchant: "Through Merchant Link. Elena gets a text and an email.",
  } as Record<Thread, string>,
};

export const timeSpent = {
  title: "Where the time went",
  subtitle: "From arrival at 09:40 until now",
  /** segment widths are the stage lengths in minutes-ish units from the prototype */
  segments: [
    { label: "Reading files", value: "41 sec", flex: 1, color: "bg-teal", dot: "bg-teal" },
    { label: "Checks and memo", value: "19 sec", flex: 1, color: "bg-teal-soft", dot: "bg-teal-soft" },
    { label: "Merchant uploads", value: "16 min", flex: 16, color: "bg-mint", dot: "bg-mint" },
    { label: "Waiting for review", value: "2h 32m", flex: 152, color: "bg-amber-light", dot: "bg-amber-light", warn: true },
  ] as { label: string; value: string; flex: number; color: string; dot: string; warn?: boolean }[],
  note: "The machine part took a minute. Most of the time is waiting for a person, which is normal before a decision.",
};

export const accessLog = {
  title: "Who opened it",
  chip: "Audit",
  rows: [
    { who: "Maya Chen · edited", time: "10:12" },
    { who: "Priya Shah · viewed", time: "10:31" },
    { who: "Shared memo link · opened by Apex", time: "10:40" },
  ],
  note: "Read-only and kept for 7 years.",
};
