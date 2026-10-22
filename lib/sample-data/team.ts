/**
 * Sample data for Settings → Team & roles, copied from
 * design/prototypes/Settings-Team.dc.html (look: design/Settings-Team.html).
 * Underwriter workloads come from the Submissions page's teamWorkload, and the
 * money limits from policyLimits (the same values the Offer and Policy pages
 * use), so the numbers can't drift. Real API calls replace this later.
 */
import { moneyShort } from "@/lib/offer-math";
import { policyLimits } from "@/lib/sample-data/policy";
import { teamWorkload } from "@/lib/sample-data/submissions";

export type RoleKey = "uw" | "sr" | "fund" | "col" | "adm";
export type AvatarTone = "sand" | "mint" | "blue" | "cream" | "purple" | "red";

export const roleNames: Record<RoleKey, string> = {
  uw: "Underwriter",
  sr: "Senior underwriter",
  fund: "Funding",
  col: "Collections",
  adm: "Admin",
};
/** Short names for the permissions grid headings. */
export const roleShort: Record<RoleKey, string> = { uw: "Underwriter", sr: "Senior", fund: "Funding", col: "Collections", adm: "Admin" };
export const roleOrder: RoleKey[] = ["uw", "sr", "fund", "col", "adm"];

export const teamHeader = {
  title: "Team & roles",
  text: "Who can see, decide and send money. Big decisions always need a second person.",
  faces: ["MC", "PS", "JR"],
  invite: "Invite someone",
};

/** Daily capacity per underwriter, also shown in "How deals are shared". */
export const DAILY_CAPACITY = 10;

const openDeals = (ini: string) => teamWorkload.people.find((p) => p.initials === ini)?.open ?? 0;

export type Person = {
  ini: string;
  name: string;
  email: string;
  role: RoleKey;
  /** what they can approve alone; null for roles that don't decide */
  limit: number | null;
  /** open deals today (underwriters), or a short note for other roles */
  load: number | string;
  mfa: boolean;
  avatar: AvatarTone;
};

export const people: Person[] = [
  { ini: "MC", name: "Maya Chen", email: "maya@ridgelinecap.com", role: "uw", limit: policyLimits.seniorAbove, load: openDeals("MC"), mfa: true, avatar: "sand" },
  { ini: "AK", name: "Ari Kaplan", email: "ari@ridgelinecap.com", role: "uw", limit: policyLimits.seniorAbove, load: openDeals("AK"), mfa: true, avatar: "sand" },
  { ini: "JR", name: "Jordan Reyes", email: "jordan@ridgelinecap.com", role: "uw", limit: policyLimits.seniorAbove, load: openDeals("JR"), mfa: true, avatar: "mint" },
  { ini: "PS", name: "Priya Shah", email: "priya@ridgelinecap.com", role: "sr", limit: policyLimits.seniorLimit, load: openDeals("PS"), mfa: true, avatar: "blue" },
  { ini: "SL", name: "Sam Lee", email: "sam@ridgelinecap.com", role: "fund", limit: null, load: "2 payouts", mfa: true, avatar: "cream" },
  { ini: "LP", name: "Leo Park", email: "leo@ridgelinecap.com", role: "col", limit: null, load: "5 deals behind", mfa: false, avatar: "purple" },
  { ini: "NO", name: "Nina Ortiz", email: "nina@ridgelinecap.com", role: "adm", limit: null, load: "Setup", mfa: true, avatar: "red" },
];

export const invite = { ini: "KT", name: "Kim Tran", email: "kim@ridgelinecap.com", role: "uw" as RoleKey, limit: policyLimits.seniorAbove, sent: "Invite sent 2 days ago", resend: "Resend" };

export const peopleCard = {
  title: "People",
  subtitle: `${people.length} people · 1 invite waiting`,
  columns: ["Person", "Role", "Can approve", "Today", "2-step login", "Status"],
  loadText: (n: number) => `${n} of ${DAILY_CAPACITY} deals`,
  mfa: { on: "On", off: "Off" },
  status: { working: "Working", away: "Away" },
  noLimit: "—",
};

export const limitText = (n: number | null) => (n === null ? peopleCard.noLimit : moneyShort(n));

/** y = can, l = can within a limit, n = can't, in roleOrder. */
export type Perm = "y" | "l" | "n";
export const permissions = {
  title: "What each role can do",
  subtitle: "Click a role to highlight it",
  add: "+ New role",
  markLabel: { y: "Yes", l: "Within a limit", n: "No" } as Record<Perm, string>,
  rows: [
    ["See deals and documents", "yyyyy"],
    ["Make decisions", "lyynn"],
    [`Approve over ${moneyShort(policyLimits.seniorAbove)}`, "nynnn"],
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
  steps: [
    { range: `Up to ${k(policyLimits.seniorAbove)}`, who: "Any underwriter" },
    { range: `${k(policyLimits.seniorAbove)} – ${k(policyLimits.seniorLimit)}`, who: "Senior underwriter" },
    { range: `${k(policyLimits.seniorLimit)} – ${k(policyLimits.maxAmount)}`, who: "Senior plus a second approver" },
    { range: `Over ${k(policyLimits.maxAmount)}`, who: "Outside policy", outside: true },
  ] as { range: string; who: string; outside?: boolean }[],
};

export const twoPeople = {
  title: "Always two people",
  text: "No one can do these alone, including admins",
  items: ["Releasing money", "Changing the policy", "Waiving a condition", "Approving a policy exception"],
};

export const sharing = {
  title: "How deals are shared",
  rows: [
    { label: "Assign by", value: "Most room today" },
    { label: "Daily capacity", value: `${DAILY_CAPACITY} deals each` },
    { label: `Over ${k(policyLimits.seniorLimit)}`, value: "Straight to Priya" },
    { label: "When someone is away", value: "Backup takes over" },
  ],
};

export const outside = {
  title: "People outside your team",
  text: "They only see what's meant for them",
  rows: [
    { title: "Brokers", hint: "Broker portal coming soon", soon: "Soon" },
    { title: "Capital partners", hint: "Read-only portfolio reports", count: 2 },
    { title: "Outside counsel", hint: "Disclosure templates only", count: 1 },
  ] as { title: string; hint: string; soon?: string; count?: number }[],
};

export const accessReview = {
  title: "Access review",
  chip: "12 days late",
  text: "Every quarter, an admin confirms each person still needs their access. Auditors and capital partners ask for this.",
  facts: [
    { label: "Last done", value: "Jul 1, Nina" },
    { label: "Was due", value: "Oct 1" },
  ],
  cta: "Start review",
};

export const leaving = {
  title: "When someone leaves",
  text: "One click does all of this, in order",
  steps: ["Their open deals move to a teammate", "Access ends everywhere at once", "Their decisions stay on record"],
};
