/**
 * Interface wording for Settings › Security (design/Settings-Security.html
 * and its prototype). The protections, today's sign-ins, who lacks 2-step
 * login, the access review and the API keys come from the data layer
 * (securityView). A sign-in's "No 2-step" result is read from the person's
 * team record, and the Audit log words the same blocked attempt.
 */
import type { AccessReview, ApiKey, IsoDateTime, OutsideKey, ProtectionKey, SecuritySettings, TeamMember } from "@/lib/data/types";
import type { SignInRow } from "@/lib/data/views/settings";
import type { ScoreBand } from "@/lib/security-score";
import { daysBetween, plural, timeOfDay } from "@/lib/format";
import { accessReview as reviewCopy, firstName } from "./team";

export const securityHeader = {
  title: "Security",
  text: "Sign-in, access and how your data is protected",
  band: { strong: "Strong", fair: "Could be stronger", weak: "Weak" } as Record<ScoreBand, string>,
  ringLabel: (score: number) => `Security score ${score} of 100`,
};

/** The "to fix" list: everyone without 2-step login, then the access review if it's late. */
export function toFix(noMfa: TeamMember[], review: AccessReview, now: IsoDateTime) {
  const late = daysBetween(review.dueAt, now);
  return [
    ...noMfa.map((p) => ({
      key: `mfa-${p.initials}`,
      title: `${p.name} has no 2-step login`,
      text: "Required for everyone, but he joined before the rule",
      action: `Remind ${firstName(p.name)}`,
    })),
    ...(late > 0 ? [{ key: "review", title: `Access review is ${reviewCopy.chip(late)}`, text: "Confirm everyone still needs their access", action: reviewCopy.cta }] : []),
  ];
}
export const toFixTitle = (n: number) => `${n} to fix`;

export type Toggle<K extends string = string> = { key: K; title: string; hint: string; on: boolean };

const protectionWords: Record<ProtectionKey, { title: string; hint: string }> = {
  mfa: { title: "2-step login for everyone", hint: "Code app, passkey or text" },
  sso: { title: "Sign in with Google Workspace", hint: "Your company accounts, one password" },
  idle: { title: "Sign out after 30 minutes idle", hint: "Shorter on shared computers" },
  newdev: { title: "Alert on a new device or country", hint: "Email the person and admins" },
  ip: { title: "Only from approved networks", hint: "Office and company VPN" },
  watermark: { title: "Name stamped on downloaded PDFs", hint: "Every memo and statement export" },
  mask: { title: "Hide bank and tax numbers", hint: "Show only the last 4 digits" },
  bulk: { title: "Bulk exports need an admin", hint: "Single files are fine" },
};
const outsideWords: Record<OutsideKey, { title: string; hint: string }> = {
  brokerMfa: { title: "2-step login for brokers", hint: "Ready for when the broker portal launches" },
  otp: { title: "One-time code on Merchant Link", hint: "Sent to the owner’s phone before any upload" },
  single: { title: "Merchant Link expires after use", hint: "A finished link can’t be opened again" },
};
const toggles = <K extends string>(keys: K[], words: Record<K, { title: string; hint: string }>, on: Record<K, boolean>): Toggle<K>[] =>
  keys.map((key) => ({ key, ...words[key], on: on[key] }));

export const signingIn = {
  title: "Signing in",
  text: "How your team gets in",
  toggles: (s: SecuritySettings) => toggles<ProtectionKey>(["mfa", "sso", "idle", "newdev"], protectionWords, s.protections),
};

export const protectingData = {
  title: "Protecting data",
  text: "What people can take out of Cevrynt",
  toggles: (s: SecuritySettings) => toggles<ProtectionKey>(["ip", "watermark", "mask", "bulk"], protectionWords, s.protections),
};

export const outsideUsers = {
  title: "Brokers and merchants",
  text: "People outside your team who log in",
  toggles: (s: SecuritySettings) => toggles<OutsideKey>(["brokerMfa", "otp", "single"], outsideWords, s.outside),
};

export type SignInResult = "ok" | "blocked" | "nomfa";

/** Blocked, or signed in with or without 2-step login, as the person's team record says. */
export const signInResult = (s: SignInRow): SignInResult => (s.blocked ? "blocked" : s.person?.mfa === false ? "nomfa" : "ok");

export const signIns = {
  title: "Recent sign-ins",
  subtitle: "Today",
  sessions: (n: number) => plural(n, "active session"),
  signOutAll: "Sign everyone out",
  audit: { label: "Full audit log", href: "/settings/audit" },
  columns: ["Person", "Device", "Where", "Time", "Result"],
  resultLabel: { ok: "Signed in", blocked: "Blocked", nomfa: "No 2-step" } as Record<SignInResult, string>,
  rows: (list: SignInRow[]) =>
    list.map((s) => ({ id: s.id, person: s.person?.name ?? "Unknown", device: s.device, where: s.place, time: timeOfDay(s.at), result: signInResult(s) })),
  /** what happened with today's blocked attempt */
  note: (list: SignInRow[]) => {
    const b = list.find((s) => s.blocked && s.account);
    if (!b?.account) return null;
    const first = firstName(b.account.name);
    return `The blocked attempt used ${b.account.name}'s email with a wrong code. ${first} has been told and asked to change his password.`;
  },
};

export const supportAccess = {
  title: "Cevrynt support access",
  text: "Our team can't see your data unless you allow it",
  off: { title: "Not allowed", hint: "Grant 24 hours when you ask for help", action: "Allow 24 hours" },
  on: (now: IsoDateTime) => ({ title: `Allowed until tomorrow ${timeOfDay(now)}`, hint: "Every view is logged in the audit log", action: "End now" }),
  contact: (s: SecuritySettings) => ({ label: "Security contact", value: s.contactEmail }),
  report: { label: "Something looks wrong?", action: "Report a security problem" },
};

export const alwaysOn = {
  title: "Always on",
  items: ["Encrypted when stored and when sent", "Kept in the United States", "Backed up daily, kept 35 days", "Every file virus-scanned"],
};

/** Whole months from one date to a later one: Mar 3 → Oct 13 is 7. */
const monthsBetween = (from: IsoDateTime, to: IsoDateTime) => {
  const months = (Number(to.slice(0, 4)) - Number(from.slice(0, 4))) * 12 + Number(to.slice(5, 7)) - Number(from.slice(5, 7));
  return Number(to.slice(8, 10)) >= Number(from.slice(8, 10)) ? months : months - 1;
};

export const apiKeys = {
  title: "API keys",
  rows: (keys: ApiKey[], now: IsoDateTime) => {
    const live = keys.filter((k) => k.live);
    const oldest = live.map((k) => k.createdAt).sort()[0];
    return [
      { label: "Live keys", value: String(live.length) },
      { label: "Oldest key", value: oldest ? plural(monthsBetween(oldest, now), "month") : "None" },
    ];
  },
  link: { label: "Manage in Intake channels", href: "/settings/intake" },
};

export const auditors = {
  title: "For your auditors",
  text: "Documents capital partners and auditors ask for",
  rows: [
    { label: "Security report", action: "Request" },
    { label: "Data processing terms", action: "Download" },
  ],
};

export const securitySections = { access: "Sign-in and access", outside: "Outside users and support access", data: "How data is protected" };
