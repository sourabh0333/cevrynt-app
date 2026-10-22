/**
 * Sample data for Settings → Security, copied from
 * design/prototypes/Settings-Security.dc.html (look: design/Settings-Security.html).
 * Who has 2-step login comes from Team & roles, and the access review from
 * the same card there, so the pages always agree. Real API calls replace this.
 */
import type { ProtectionKey, ScoreBand } from "@/lib/security-score";
import { accessReview, people } from "@/lib/sample-data/team";

export const securityHeader = {
  title: "Security",
  text: "Sign-in, access and how your data is protected",
  band: { strong: "Strong", fair: "Could be stronger", weak: "Weak" } as Record<ScoreBand, string>,
  ringLabel: (score: number) => `Security score ${score} of 100`,
};

const noMfa = people.filter((p) => !p.mfa);
const first = (name: string) => name.split(" ")[0];

/** The "to fix" list: everyone without 2-step login (from Team & roles), then the overdue access review. */
export const toFix = [
  ...noMfa.map((p) => ({
    key: `mfa-${p.ini}`,
    title: `${p.name} has no 2-step login`,
    text: "Required for everyone, but he joined before the rule",
    action: `Remind ${first(p.name)}`,
  })),
  { key: "review", title: `Access review is ${accessReview.chip}`, text: "Confirm everyone still needs their access", action: accessReview.cta },
];
export const toFixTitle = `${toFix.length} to fix`;

export type Toggle = { key: string; title: string; hint: string; on: boolean };

export const signingIn = {
  title: "Signing in",
  text: "How your team gets in",
  toggles: [
    { key: "mfa", title: "2-step login for everyone", hint: "Code app, passkey or text", on: true },
    { key: "sso", title: "Sign in with Google Workspace", hint: "Your company accounts, one password", on: true },
    { key: "idle", title: "Sign out after 30 minutes idle", hint: "Shorter on shared computers", on: true },
    { key: "newdev", title: "Alert on a new device or country", hint: "Email the person and admins", on: true },
  ] as (Toggle & { key: ProtectionKey })[],
};

export const protectingData = {
  title: "Protecting data",
  text: "What people can take out of Cevrynt",
  toggles: [
    { key: "ip", title: "Only from approved networks", hint: "Office and company VPN", on: false },
    { key: "watermark", title: "Name stamped on downloaded PDFs", hint: "Every memo and statement export", on: true },
    { key: "mask", title: "Hide bank and tax numbers", hint: "Show only the last 4 digits", on: true },
    { key: "bulk", title: "Bulk exports need an admin", hint: "Single files are fine", on: true },
  ] as (Toggle & { key: ProtectionKey })[],
};

export type SignInResult = "ok" | "blocked" | "nomfa";

const mfaOf = (name: string) => people.find((p) => p.name === name)?.mfa ?? true;
const result = (name: string, blocked = false): SignInResult => (blocked ? "blocked" : mfaOf(name) ? "ok" : "nomfa");

export const signIns = {
  title: "Recent sign-ins",
  subtitle: "Today",
  sessions: "9 active sessions",
  signOutAll: "Sign everyone out",
  audit: { label: "Full audit log", href: "/settings/audit" },
  columns: ["Person", "Device", "Where", "Time", "Result"],
  resultLabel: { ok: "Signed in", blocked: "Blocked", nomfa: "No 2-step" } as Record<SignInResult, string>,
  rows: [
    { person: "Maya Chen", device: "Chrome · Mac", where: "Boston, MA", time: "10:42", result: result("Maya Chen") },
    { person: "Priya Shah", device: "Safari · iPhone", where: "Boston, MA", time: "10:31", result: result("Priya Shah") },
    { person: "Unknown", device: "Chrome · Windows", where: "Lagos, Nigeria", time: "09:17", result: result("Unknown", true) },
    { person: "Leo Park", device: "Edge · Windows", where: "Quincy, MA", time: "08:55", result: result("Leo Park") },
  ],
  note: "The blocked attempt used Ari Kaplan's email with a wrong code. Ari has been told and asked to change his password.",
};

export const outsideUsers = {
  title: "Brokers and merchants",
  text: "People outside your team who log in",
  toggles: [
    { key: "brokerMfa", title: "2-step login for brokers", hint: "Ready for when the broker portal launches", on: true },
    { key: "otp", title: "One-time code on Merchant Link", hint: "Sent to the owner’s phone before any upload", on: true },
    { key: "single", title: "Merchant Link expires after use", hint: "A finished link can’t be opened again", on: true },
  ] as Toggle[],
};

export const supportAccess = {
  title: "Cevrynt support access",
  text: "Our team can't see your data unless you allow it",
  off: { title: "Not allowed", hint: "Grant 24 hours when you ask for help", action: "Allow 24 hours" },
  on: { title: "Allowed until tomorrow 10:45", hint: "Every view is logged in the audit log", action: "End now" },
  contact: { label: "Security contact", value: "security@ridgelinecap.com" },
  report: { label: "Something looks wrong?", action: "Report a security problem" },
};

export const alwaysOn = {
  title: "Always on",
  items: ["Encrypted when stored and when sent", "Kept in the United States", "Backed up daily, kept 35 days", "Every file virus-scanned"],
};

export const apiKeys = {
  title: "API keys",
  rows: [
    { label: "Live keys", value: "1" },
    { label: "Oldest key", value: "7 months" },
  ],
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
