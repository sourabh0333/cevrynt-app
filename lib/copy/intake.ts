/**
 * Interface wording for Intake: the hub (design/Intake.html), Single
 * package upload (Intake-Single.html) and Bulk folder ZIP
 * (Intake-Bulk.html). Today's arrivals, the uploaded package and the bulk
 * folders come from the data layer (lib/data/views/intake); this file words
 * them, with policy reasons quoted from the policy's own values.
 */
import type { BulkFolder, BulkIntake, FitResult, IntakeChannel, PackageIntake, Policy, RuleId, UploadedFile } from "@/lib/data/types";
import { money, monthName, plural, timeOfDay } from "@/lib/format";

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const numberWords = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const numberWord = (n: number) => numberWords[n] ?? String(n);

export const channelLabel: Record<IntakeChannel, string> = {
  package: "Single package",
  bulk: "Bulk ZIP",
  manual: "Manual lead",
  "merchant-link": "Merchant Link",
};

type FitPolicy = Pick<Policy, "minBusinessMonths">;

/** Why a policy rule declined a deal, finishing "Declined · …". */
const declineReason: Record<RuleId, (p: FitPolicy) => string> = {
  age: (p) => `under ${plural(p.minBusinessMonths, "month")} in business`,
  industry: () => "industry on the restricted list",
  kyc: () => "owner did not clear identity checks",
  revenue: () => "revenue below policy minimum",
  nsf: () => "too many NSFs",
  negdays: () => "too many negative days",
  positions: () => "too many open positions",
  debt: () => "debt payments too high",
  amount: () => "amount outside policy",
  stated: () => "stated revenue far above verified",
  senior: () => "needs a senior underwriter",
};

const missingMonth = (m: string) => monthName(m, "long");

/** The fit check as the recent intakes list words it: "Declined · under 6 months in business". */
export function fitLine(fit: FitResult, p: FitPolicy) {
  switch (fit.result) {
    case "fits":
      return "Fits policy";
    case "needs":
      return `Needs documents · ${missingMonth(fit.missingMonth)} statement missing`;
    case "declined":
      return `Declined · ${declineReason[fit.rule](p)}`;
    case "unchecked":
      return "Not checked";
  }
}

/** The same, as a bulk folder row words it: "July missing, will be requested", "Revenue below policy minimum". */
export function folderFitLine(fit: FitResult, p: FitPolicy) {
  switch (fit.result) {
    case "fits":
      return "Fits policy";
    case "needs":
      return `${missingMonth(fit.missingMonth)} missing, will be requested`;
    case "declined":
      return capital(declineReason[fit.rule](p));
    case "unchecked":
      return "Not checked";
  }
}

/** "9 files · 14.2 MB · uploaded by you at 10:42" */
const fileMeta = (f: UploadedFile, count: string) => `${count} · ${f.sizeMb.toFixed(1)} MB · uploaded by you at ${timeOfDay(f.uploadedAt)}`;

/* ---------- The hub ---------- */

export type FlowCard = {
  id: "manual" | "package" | "bulk";
  title: string;
  text: string;
  tag: string;
  footnote: string;
  href: string;
  cta: string;
};

export const intakeHeader = {
  title: "Intake",
  line: (total: number) => `${total} deals arrived today · see recent`,
  lineHref: "#recent",
};

export const flows: FlowCard[] = [
  {
    id: "manual",
    title: "Manual lead",
    text: "Type in the business and owner, set the request, then attach documents or send the merchant a secure upload link.",
    tag: "About 3 min",
    footnote: "Best for phone and walk-in leads",
    href: "/intake/manual",
    cta: "Start",
  },
  {
    id: "package",
    title: "Single package upload",
    text: "Drop one complete deal. We sort every file, match the business and check it is complete before an underwriter opens it.",
    tag: "Most used",
    footnote: "Drag a package here, or browse",
    href: "/intake/package",
    cta: "Upload",
  },
  {
    id: "bulk",
    title: "Bulk folder ZIP",
    text: "One ZIP, one folder per deal. Preview every deal and fix problems before anything is created.",
    tag: "Many deals",
    footnote: "Each top-level folder becomes a deal",
    href: "/intake/bulk",
    cta: "Start",
  },
];

export const flowSections = "Start a deal";
export const manualStepChips = ["1 · Company & owner", "2 · Request", "3 · Documents", "4 · Review"];
export const packageTypes = [".zip", ".pdf", ".xls", ".csv", ".eml"];
/** An example of the folder layout a bulk ZIP takes. */
export const bulkTree = {
  file: "deals_oct12.zip",
  folders: ["├ Harbor Street Bakery/", "├ Golden Lotus Restaurant/", "└ Mesa Auto Repair/"],
};

export const fitCheck = {
  title: "Every package is checked in seconds",
  subtitle: "Whichever way a deal arrives, the same three checks run before it reaches your queue.",
  policy: { label: "Edit policy", href: "/settings/policy" },
  steps: [
    { n: "01", title: "Read and sort", text: "Statements, application, ID and other files are recognised and named." },
    { n: "02", title: "Check completeness", text: "Months covered, missing pages, and the stips your policy requires." },
    { n: "03", title: "Check fit", text: "Industry, time in business, revenue and existing positions against your rules." },
  ],
  outcomeCap: "Outcome",
  outcomes: [
    { dot: "bg-mint", text: "Fits policy, goes to queue" },
    { dot: "bg-amber-light", text: "Needs documents, request sent" },
    { dot: "bg-red-light", text: "Declined, reason sent to broker" },
  ],
};

export type ChannelCard = {
  id: "email" | "forms" | "api";
  title: string;
  text: string;
  tag: string;
  links: { label: string; href: string; quiet?: boolean }[];
};

export const channels = {
  title: "Deals that arrive on their own",
  subtitle: "Coming soon. Today, deals come in through the three options above.",
  roadmap: { label: "See the roadmap", href: "/whats-coming" },
  cards: [
    { id: "email", title: "Email forwarding", text: "Brokers email packages to your own address and they become deals.", tag: "Coming next", links: [{ label: "Join early access", href: "/whats-coming" }] },
    { id: "forms", title: "Public forms", text: "A branded application link for brokers and merchants.", tag: "Coming soon", links: [{ label: "Preview the form", href: "/apply" }, { label: "Join early access", href: "/whats-coming", quiet: true }] },
    { id: "api", title: "CRM, LOS or API", text: "Deals flow in from your CRM, and decisions flow back.", tag: "Coming later", links: [{ label: "Join early access", href: "/whats-coming" }] },
  ] as ChannelCard[],
};

export const todayByChannel = {
  title: "Today by channel",
  subtitle: (total: number) => `${total} deals since midnight`,
  /** a channel's share of today's deals, in whole percent */
  percent: (count: number, total: number) => (total ? Math.round((count / total) * 100) : 0),
};

export const recentIntakes = {
  title: "Recent intakes",
  link: { label: "Open submissions", href: "/submissions" },
  columns: { merchant: "Merchant", channel: "Channel", time: "Time", fit: "Fit check", assigned: "Assigned" },
  unassigned: "—",
  /** where a row opens */
  href: "/submissions",
};

/* ---------- Single package upload ---------- */

const docTitle: Record<PackageIntake["documents"][number]["kind"], string> = {
  application: "Signed application",
  id: "Owner photo ID",
  check: "Voided check",
  unreadable: "Unreadable image",
  other: "Not a deal document",
};

export const packageCopy = {
  title: "Single package upload",
  back: { label: "Back to intake", href: "/intake" },
  readIn: (seconds: number) => `Read in ${seconds} seconds`,
  uploaded: "Uploaded package",
  fileMeta: (p: PackageIntake) => fileMeta(p.file, plural(p.statements.length + p.documents.length, "file")),
  addMore: "Add more files",
  remove: "Remove",
  found: { title: "What we found", subtitle: "Every file is named by what it is. Fix anything we got wrong before you start." },
  statementsCaption: (bank: PackageIntake["bank"]) => `Bank statements · ${bank.name} ••${bank.last4}`,
  month: (m: PackageIntake["statements"][number]) => ({
    label: `${monthName(m.month, "long")} ${m.month.slice(0, 4)}`,
    note: `${plural(m.pages, "page")} · ${m.balancesMatch ? "balances match" : "balances don't match"}`,
  }),
  covered: { label: "Months covered", value: (n: number, required: number) => `${n} of ${required} required` },
  otherCaption: "Other documents",
  doc: (d: PackageIntake["documents"][number]) => ({ title: docTitle[d.kind], file: d.note ? `${d.file} · ${d.note}` : d.file }),
  read: "Read",
  action: { warn: "Replace", ignored: "Keep anyway" } as Record<"warn" | "ignored", string>,
  matched: {
    tag: "Business matched",
    note: (b: PackageIntake["business"], statements: number) =>
      `Found on the application and all ${numberWord(statements)} statements. Active in the ${b.state} registry since ${b.since}.`,
    owner: "Owner",
    ownerLine: (b: PackageIntake["business"]) => `${b.owner} · ${b.share}%`,
    requested: "Requested",
    requestedValue: (n: number) => money(n),
    change: "Not this business? Change",
  },
  fit: {
    title: "Fit check",
    verdict: { fits: "Fits policy", not: "Outside policy" },
    note: "Deeper checks (true revenue, positions, integrity) run as soon as the deal is created.",
  },
  assign: {
    sentBy: "Sent by",
    assignTo: "Assign to",
    auto: "Auto-assign (next free underwriter)",
    cta: "Create deal and start underwriting",
    href: "/submissions",
  },
};

export type FitRow = { label: string; value: string; tone: "good" | "warn" | "bad" };

/** The package's fit check, from the policy's restricted list and required statement months. */
export function packageFitRows(p: PackageIntake, policy: Pick<Policy, "restrictedIndustries" | "requiredStatementMonths">, nowYear: number): FitRow[] {
  const restricted = policy.restrictedIndustries.some((r) => p.business.industry.toLowerCase().includes(r.toLowerCase().replace(/s$/, "")));
  const years = nowYear - p.business.since;
  const has = (k: PackageIntake["documents"][number]["kind"]) => p.documents.some((d) => d.kind === k && d.state === "read");
  const complete = p.statements.length >= policy.requiredStatementMonths && has("application") && has("id") && has("check");
  const funded = p.business.funded;
  return [
    { label: "Industry", value: restricted ? "Not allowed" : "Allowed", tone: restricted ? "bad" : "good" },
    { label: "Time in business", value: plural(years, "year"), tone: "good" },
    { label: "Required documents", value: complete ? "All present" : "Some missing", tone: complete ? "good" : "warn" },
    funded
      ? { label: "Seen before", value: `Funded ${funded.count === 1 ? "once" : `${funded.count} times`}, ${funded.lastYear}`, tone: "warn" }
      : { label: "Seen before", value: "No", tone: "good" },
  ];
}

/* ---------- Bulk folder ZIP ---------- */

export type FolderRowView = {
  id: string;
  folder: string;
  business: string;
  note?: string;
  files: number;
  statements: string;
  statementsWarn: boolean;
  fit: { tone: "good" | "warn" | "bad" | "none"; text: string };
  result: { kind: "chip"; label: "Ready" | "Declined" } | { kind: "actions"; primary: string; secondary: string };
  attention: boolean;
  href: string;
};

const fitTone = { fits: "good", needs: "warn", declined: "bad", unchecked: "none" } as const;

/** A folder as its preview row shows it. Folders that match an open deal, or no business, need the person. */
export function folderRow(f: BulkFolder, policy: Pick<Policy, "minBusinessMonths" | "requiredStatementMonths">): FolderRowView {
  const attention = !!f.existingDealId || f.business === null;
  return {
    id: f.id,
    folder: f.folder,
    business: f.business ?? "No business found",
    note: f.existingDealId ? `Open deal already exists · ${f.existingDealId}` : f.note,
    files: f.files,
    statements: f.statements === null ? "—" : `${f.statements} of ${policy.requiredStatementMonths}`,
    statementsWarn: f.statements !== null && f.statements < policy.requiredStatementMonths,
    fit: { tone: fitTone[f.fit.result], text: folderFitLine(f.fit, policy) },
    result: attention
      ? { kind: "actions", primary: f.existingDealId ? "Merge" : "Pick business", secondary: "Skip" }
      : { kind: "chip", label: f.fit.result === "declined" ? "Declined" : "Ready" },
    attention,
    href: "/submissions",
  };
}

export const bulkCopy = {
  title: "Bulk folder ZIP",
  back: { label: "Back to intake", href: "/intake" },
  note: "Nothing is created until you press Create. Fix or skip any folder first.",
  uploaded: "Uploaded ZIP",
  fileMeta: (b: BulkIntake) =>
    fileMeta(b.file, `${plural(b.folders.length, "folder")} · ${plural(b.folders.reduce((n, f) => n + f.files, 0), "file")}`),
  another: "Upload a different ZIP",
  summary: { label: "Summary", folders: "Folders found", ready: "Ready to create", attention: "Need your attention", declined: "Declined by policy" },
  preview: {
    title: "Folder preview",
    subtitle: "One row per folder. Click a row to see its files.",
    show: "Show folders",
    all: (n: number) => `All ${n}`,
    attention: (n: number) => `Needs attention ${n}`,
    columns: { folder: "Folder", business: "Business matched", files: "Files", statements: "Statements", fit: "Fit check", result: "Result" },
  },
  options: {
    title: "For the whole batch",
    sentBy: "Sent by",
    assign: "Assign deals",
    assignValue: { even: "Share evenly across the team", auto: "Auto-assign (next free underwriter)" } as Record<BulkIntake["options"]["assign"], string>,
    tellBroker: "Tell the broker about declines",
    requestMissing: "Request missing documents automatically",
  },
  create: {
    cap: "Ready now",
    title: (n: number) => `${plural(n, "deal")} will be created`,
    text: (ready: number, attention: number) =>
      `${plural(attention, "folder")} still ${attention === 1 ? "needs" : "need"} you. You can create these ${ready} now and come back to the rest.`,
    cta: (n: number) => `Create ${plural(n, "deal")}`,
    href: "/submissions",
  },
  earlier: {
    title: "Earlier today",
    meta: (e: BulkIntake["earlier"]) => `${plural(e.folders, "folder")} · created ${plural(e.created, "deal")} at ${timeOfDay(e.at)}`,
    link: { label: "See all batches", href: "/submissions" },
    steps: (e: BulkIntake["earlier"]) => [
      { n: "01", label: "Uploaded" },
      { n: "02", label: `Sorted ${e.files} files` },
      { n: "03", label: `Matched ${plural(e.matched, "business", "businesses")}` },
      { n: "04", label: "Fit checked" },
      { n: "05", label: `${plural(e.created, "deal")} in queue`, done: true },
    ],
  },
};
