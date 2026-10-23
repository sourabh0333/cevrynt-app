/**
 * Interface wording for Settings → Team & roles (design/Settings-Team.html).
 * The people, invites and access review come from the data layer
 * (lib/data/team); this file holds what people read around them. Lines that
 * mention a limit or a count are functions, so they print the same figures
 * the data gives.
 */
import type { OutsideAccess, Role } from "@/lib/data/types";
import { moneyShort, plural } from "@/lib/format";

/** The policy's approval lines, in dollars. */
export type ApprovalLimits = { seniorAbove: number; seniorLimit: number; maxAmount: number };

export const roleNames: Record<Role, string> = {
  underwriter: "Underwriter",
  senior: "Senior underwriter",
  funding: "Funding",
  collections: "Collections",
  admin: "Admin",
};
/** Short names for the permissions grid headings. */
export const roleShort: Record<Role, string> = { underwriter: "Underwriter", senior: "Senior", funding: "Funding", collections: "Collections", admin: "Admin" };
export const roleOrder: Role[] = ["underwriter", "senior", "funding", "collections", "admin"];

export const teamHeader = {
  title: "Team & roles",
  text: "Who can see, decide and send money. Big decisions always need a second person.",
  invite: "Invite someone",
  people: (n: number) => plural(n, "person", "people"),
};

export const peopleCard = {
  title: "People",
  subtitle: (people: number, invites: number) => `${plural(people, "person", "people")} · ${plural(invites, "invite")} waiting`,
  columns: ["Person", "Role", "Can approve", "Today", "2-step login", "Status"],
  loadText: (n: number, capacity: number) => `${n} of ${capacity} deals`,
  mfa: { on: "On", off: "Off" },
  status: { working: "Working", away: "Away" },
  noLimit: "—",
  inviteSent: (days: number) => (days <= 0 ? "Invite sent today" : days === 1 ? "Invite sent yesterday" : `Invite sent ${days} days ago`),
  resend: "Resend",
};

export const limitText = (n: number | null) => (n === null ? peopleCard.noLimit : moneyShort(n));

/** y = can, l = can within a limit, n = can't, in roleOrder. */
export type Perm = "y" | "l" | "n";
export const permissions = {
  title: "What each role can do",
  subtitle: "Click a role to highlight it",
  add: "+ New role",
  markLabel: { y: "Yes", l: "Within a limit", n: "No" } as Record<Perm, string>,
  rows: (limits: ApprovalLimits) =>
    [
      ["See deals and documents", "yyyyy"],
      ["Make decisions", "lyynn"],
      [`Approve over ${moneyShort(limits.seniorAbove)}`, "nynnn"],
      ["Waive conditions", "nlnnn"],
      ["Propose policy changes", "yynny"],
      ["Approve policy changes", "nynnn"],
      ["Release money", "nnlnn"],
      ["Edit pricing", "nynny"],
      ["Set up payment plans", "nnnyn"],
      ["See profit and margins", "nynny"],
      ["Export data", "nynny"],
      ["Manage team and billing", "nnnny"],
    ].map(([label, code]) => ({ label, marks: code.split("") as Perm[] })),
};

const k = moneyShort;
export const ladder = {
  title: "Who approves what",
  steps: (l: ApprovalLimits): { range: string; who: string; outside?: boolean }[] => [
    { range: `Up to ${k(l.seniorAbove)}`, who: "Any underwriter" },
    { range: `${k(l.seniorAbove)} – ${k(l.seniorLimit)}`, who: "Senior underwriter" },
    { range: `${k(l.seniorLimit)} – ${k(l.maxAmount)}`, who: "Senior plus a second approver" },
    { range: `Over ${k(l.maxAmount)}`, who: "Outside policy", outside: true },
  ],
};

export const twoPeople = {
  title: "Always two people",
  text: "No one can do these alone, including admins",
  items: ["Releasing money", "Changing the policy", "Waiving a condition", "Approving a policy exception"],
};

export const sharing = {
  title: "How deals are shared",
  rows: ({ capacity, seniorLimit, senior }: { capacity: number; seniorLimit: number; senior: string }) => [
    { label: "Assign by", value: "Most room today" },
    { label: "Daily capacity", value: `${capacity} deals each` },
    { label: `Over ${k(seniorLimit)}`, value: `Straight to ${senior}` },
    { label: "When someone is away", value: "Backup takes over" },
  ],
};

export const outside = {
  title: "People outside your team",
  text: "They only see what's meant for them",
  rows: (a: OutsideAccess): { title: string; hint: string; soon?: string; count?: number }[] => [
    { title: "Brokers", hint: "Broker portal coming soon", soon: "Soon" },
    { title: "Capital partners", hint: "Read-only portfolio reports", count: a.capitalPartners },
    { title: "Outside counsel", hint: "Disclosure templates only", count: a.outsideCounsel },
  ],
};

export const accessReview = {
  title: "Access review",
  /** days past the due date; Security shows the same chip in its "to fix" list */
  chip: (daysLate: number) => `${plural(daysLate, "day")} late`,
  text: "Every quarter, an admin confirms each person still needs their access. Auditors and capital partners ask for this.",
  lastDone: { label: "Last done", value: (date: string, by: string) => `${date}, ${by}` },
  wasDue: "Was due",
  cta: "Start review",
};

export const leaving = {
  title: "When someone leaves",
  text: "One click does all of this, in order",
  steps: ["Their open deals move to a teammate", "Access ends everywhere at once", "Their decisions stay on record"],
};

/** "Priya" from "Priya Shah" */
export const firstName = (name: string) => name.split(" ")[0];
