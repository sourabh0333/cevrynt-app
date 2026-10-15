/**
 * Sample data for the Intake hub, copied from design/Intake.html
 * (design/prototypes/Intake.dc.html has no script). Real API calls replace
 * this later behind the same types.
 */
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
  line: "23 deals arrived today · see recent",
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

export const manualSteps = ["1 · Company & owner", "2 · Request", "3 · Documents", "4 · Review"];
export const packageTypes = [".zip", ".pdf", ".xls", ".csv", ".eml"];
export const bulkTree = {
  file: "deals_oct12.zip",
  folders: ["├ Harbor Street Bakery/", "├ Golden Lotus Restaurant/", "└ Mesa Auto Repair/"],
};

export const fitCheck = {
  title: "Every package is checked in seconds",
  subtitle: "Whichever way a deal arrives, the same three checks run before it reaches your queue.",
  policyHref: "/settings/policy",
  steps: [
    { n: "01", title: "Read and sort", text: "Statements, application, ID and other files are recognised and named." },
    { n: "02", title: "Check completeness", text: "Months covered, missing pages, and the stips your policy requires." },
    { n: "03", title: "Check fit", text: "Industry, time in business, revenue and existing positions against your rules." },
  ],
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
  roadmapHref: "/whats-coming",
  cards: [
    { id: "email", title: "Email forwarding", text: "Brokers email packages to your own address and they become deals.", tag: "Coming next", links: [{ label: "Join early access", href: "/whats-coming" }] },
    { id: "forms", title: "Public forms", text: "A branded application link for brokers and merchants.", tag: "Coming soon", links: [{ label: "Preview the form", href: "/apply" }, { label: "Join early access", href: "/whats-coming", quiet: true }] },
    { id: "api", title: "CRM, LOS or API", text: "Deals flow in from your CRM, and decisions flow back.", tag: "Coming later", links: [{ label: "Join early access", href: "/whats-coming" }] },
  ] as ChannelCard[],
};

export const todayByChannel = {
  title: "Today by channel",
  subtitle: "23 deals since midnight",
  total: 23,
  rows: [
    { label: "Single package", count: 11, percent: 48 },
    { label: "Bulk ZIP", count: 7, percent: 30 },
    { label: "Manual lead", count: 3, percent: 13 },
    { label: "Merchant Link", count: 2, percent: 9 },
  ],
};

export type IntakeRow = {
  id: string;
  href: string;
  merchant: string;
  channel: string;
  time: string;
  fit: "fits" | "needs" | "declined";
  fitText: string;
  assigned: string | null;
};

export const recentIntakes: IntakeRow[] = [
  { id: "r1", href: "/submissions", merchant: "Golden Lotus Restaurant", channel: "Single package", time: "13:10", fit: "fits", fitText: "Fits policy", assigned: "Maya Chen" },
  { id: "r2", href: "/submissions", merchant: "Brightside Cleaning Co", channel: "Merchant Link", time: "12:05", fit: "needs", fitText: "Needs documents · July statement missing", assigned: "Maya Chen" },
  { id: "r3", href: "/submissions", merchant: "Tri-County Towing", channel: "Bulk ZIP", time: "11:48", fit: "declined", fitText: "Declined · under 6 months in business", assigned: null },
  { id: "r4", href: "/submissions", merchant: "Pinecrest Fitness Studio", channel: "Bulk ZIP", time: "11:02", fit: "fits", fitText: "Fits policy", assigned: "Jordan Reyes" },
  { id: "r5", href: "/submissions", merchant: "Lakeside Florist", channel: "Single package", time: "10:37", fit: "declined", fitText: "Declined · revenue below policy minimum", assigned: null },
  { id: "r6", href: "/submissions", merchant: "Northline HVAC Services", channel: "Manual lead", time: "09:20", fit: "fits", fitText: "Fits policy", assigned: "Maya Chen" },
];
