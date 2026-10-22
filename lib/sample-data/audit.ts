/**
 * Sample data for Settings → Audit log, copied from
 * design/prototypes/Settings-Audit.dc.html (look: design/Settings-Audit.html).
 * Entries describe events shown elsewhere in the app, and read their figures
 * from that data where it exists (the funding queue, the blocked sign-in,
 * the policy draft, the team invite), so the log can't contradict them.
 * Real API calls replace this later behind the same types.
 */
import { money, moneyShort, recommendedOffer } from "@/lib/offer-math";
import { currentPolicy } from "@/lib/policy-sim";
import { pipeline } from "@/lib/sample-data/offers";
import { signIns } from "@/lib/sample-data/security";
import { invite, roleNames } from "@/lib/sample-data/team";

export type AuditCategory = "money" | "policy" | "decision" | "access" | "data" | "settings";
export type AuditActor = "PS" | "MC" | "NO" | "SL" | "C" | "?";

export const categoryLabel: Record<AuditCategory, string> = {
  money: "Money",
  policy: "Policy",
  decision: "Decision",
  access: "Access",
  data: "Data",
  settings: "Settings",
};

export const actors: Record<AuditActor, { name: string; avatar: "blue" | "sand" | "red" | "cream" | "teal" | "line" }> = {
  PS: { name: "Priya Shah", avatar: "blue" },
  MC: { name: "Maya Chen", avatar: "sand" },
  NO: { name: "Nina Ortiz", avatar: "red" },
  SL: { name: "Sam Lee", avatar: "cream" },
  C: { name: "Cevrynt", avatar: "teal" },
  "?": { name: "Unknown", avatar: "line" },
};

export type AuditEntry = {
  id: string;
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

/* Figures from the pages these events happened on: "Funded today" on Offers & funding. */
const queued = (name: string) => {
  const row = pipeline.stages.find((s) => s.key === "funded")?.cards.find((r) => r.name === name);
  return { amount: money((row?.amtK ?? 0) * 1000), time: row?.note.replace("Sent ", "").padStart(5, "0") ?? "" };
};
const cedar = queued("Cedar Street Pharmacy");
const bayview = queued("Bayview Nail Spa");
const blocked = signIns.rows.find((r) => r.result === "blocked")!;
const proposedDebt = 70;

export const auditEntries: AuditEntry[] = [
  { id: "e1", time: cedar.time, actor: "PS", category: "money", what: `Released ${cedar.amount} to Cedar Street Pharmacy`, object: "Wire · ref …000412", where: "Boston, MA", before: "Awaiting release", after: "Sent", note: "Second person on a payment Sam Lee started at 10:58.", link: { href: "/offers", label: "Open Offers & funding" } },
  { id: "e2", time: "10:58", actor: "SL", category: "money", what: "Started funding for Cedar Street Pharmacy", object: "Funding queue", where: "Boston, MA", before: "Ready", after: "Awaiting release", note: "Final checks passed at 10:57.", link: { href: "/offers", label: "Open Offers & funding" } },
  { id: "e3", time: "10:20", actor: "MC", category: "policy", what: "Proposed policy version 4", object: `Debt share ${currentPolicy.debt}% → ${proposedDebt}%`, where: "Boston, MA", before: `${currentPolicy.debt}% of revenue`, after: `${proposedDebt}% of revenue`, note: "Waiting for Priya Shah to approve. Not live yet.", link: { href: "/settings/policy", label: "Open Policy" } },
  { id: "e4", time: "10:12", actor: "MC", category: "decision", what: "Marked integrity reviewed", object: "Harbor Street Bakery LLC", where: "Boston, MA", before: "Needs sign-off", after: "Reviewed", note: "Note: catering transfer checked, same owner, left out of revenue.", link: { href: "/deals/APP-7H2K4Q/integrity", label: "Open the deal" } },
  { id: "e5", time: "09:41", actor: "C", category: "decision", what: `Suggested approve ${money(recommendedOffer.amount)}`, object: "Harbor Street Bakery LLC", where: "Automatic", note: "Score 88, policy v3, all 8 rules met. A person makes the final decision.", link: { href: "/deals/APP-7H2K4Q/decision", label: "Open Decision & memo" } },
  { id: "e6", time: "09:35", actor: "PS", category: "data", what: "Exported the October portfolio report", object: "PDF · 14 pages", where: "Boston, MA", note: "Name stamped on every page.", link: { href: "/reports", label: "Open Reports" } },
  { id: "e7", time: blocked.time, actor: "?", category: "access", what: "Blocked sign-in to Ari Kaplan’s account", object: "Wrong 2-step code", where: blocked.where, note: "Ari was told and asked to change his password.", link: { href: "/settings/security", label: "Open Security" } },
  { id: "e8", time: bayview.time, actor: "PS", category: "money", what: `Released ${bayview.amount} to Bayview Nail Spa`, object: "ACH · trace …184477", where: "Boston, MA", before: "Awaiting release", after: "Sent", note: "Second person on a payment Sam Lee started at 09:12.", link: { href: "/offers", label: "Open Offers & funding" } },
  { id: "e9", time: "08:30", actor: "NO", category: "settings", what: `Invited ${invite.name}`, object: `${roleNames[invite.role]}, up to ${moneyShort(invite.limit)}`, where: "Boston, MA", note: "Invite still open.", link: { href: "/settings/team", label: "Open Team & roles" } },
];

/** Entry numbers count down from the newest; the seal is the prototype's hash-like code for that number. */
export const LATEST_ENTRY = 48213;
export const entryNumber = (index: number) => LATEST_ENTRY - index;
export const sealFor = (n: number) => `sha256:${((n * 2654435761) >>> 0).toString(16)}c7e19a4b${((n * 40503) >>> 0).toString(16)}f02d`;

export const auditHeader = {
  sealed: "Sealed · checked today 06:00",
  title: "Audit log",
  text: "Every action by every person, kept 7 years. Entries can't be edited or deleted, by anyone.",
  export: "Export for auditors",
  monthly: "Send monthly copy",
  stats: [
    { value: "214", label: "Events today" },
    { value: "6", label: "Money and policy changes" },
    { value: String(signIns.rows.filter((r) => r.result === "blocked").length), label: "Failed sign-ins", alert: true },
    { value: "2", label: "Data exports" },
  ] as { value: string; label: string; alert?: boolean }[],
};

export const logFilters = {
  searchLabel: "Search the log",
  searchPlaceholder: "Search deal, merchant or setting",
  personLabel: "Person",
  everyone: "Everyone",
  people: ["PS", "MC", "SL", "NO", "C"] as AuditActor[],
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
  today: "Today",
  seal: "Seal",
  sealNote: "Linked to the entry before it. Any change would break the chain.",
};

export const instantAlerts = {
  title: "Alert admins instantly",
  sub: "4 sensitive actions",
  items: [
    { title: "Money account changed", hint: "funding or collections" },
    { title: "Large export", hint: "over 50 deals" },
    { title: "Policy goes live", hint: "after approval" },
    { title: "Support access", hint: "Cevrynt team" },
  ],
};

export const legalHolds = {
  title: "Legal holds",
  sub: "Never deleted while on hold",
  holds: [{ merchant: "Westfield Auto Group", tag: "HOLD-0042 · payment dispute", days: 12, placedBy: "Nina", placedOn: "Oct 2", records: 214 }],
  daysLabel: "days",
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
