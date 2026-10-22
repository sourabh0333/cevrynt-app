/**
 * Sample data for Settings → Workspace, copied from
 * design/prototypes/Settings-Workspace.dc.html (look: design/Settings-Workspace.html).
 * The decision target comes from Submissions so the two pages always agree.
 * Real API calls replace this later behind the same types.
 */
import { DECISION_TARGET_HOURS } from "@/lib/sample-data/submissions";

export const workspaceHeader = {
  initials: "RC",
  name: "Ridgeline Capital",
  text: "Your company details, brand, working hours and notifications",
  upload: "Upload logo",
};

export const company = {
  title: "Company",
  fields: [
    { label: "Legal name", value: "Ridgeline Capital LLC" },
    { label: "Shown to merchants as", value: "Ridgeline Capital" },
    { label: "Address", value: "100 Federal St, Boston, MA 02110" },
    { label: "Time zone", value: "Eastern (New York)" },
    { label: "Sends email from", value: "offers@ridgelinecap.com", mono: true },
    { label: "Support phone", value: "(617) 555-0190" },
  ] as { label: string; value: string; mono?: boolean }[],
  verified: "Email domain verified, so offers don't land in spam",
};

/**
 * The funder's own brand colors for what merchants and brokers see. These
 * are the customer's choices, not Cevrynt tokens: picking one recolors the
 * three previews only, never the app itself.
 */
export const brandColors = [
  { name: "Teal", hex: "#0E6B5C" },
  { name: "Navy", hex: "#1F4C78" },
  { name: "Plum", hex: "#57418A" },
  { name: "Graphite", hex: "#2F3B37" },
];

export const brand = {
  title: "Brand",
  subtitle: "One color, used everywhere merchants and brokers see you",
  colorCap: "Color",
  logoCap: "Logo",
  drop: "Drop your logo here",
  dropHint: "SVG or PNG, square works best",
  previews: {
    link: { cap: "Merchant Link", greeting: "Hi Elena, 2 steps left.", progress: 60, cta: "Continue" },
    email: { cap: "Offer email", text: "Your offer of $40,000 is ready to review.", cta: "View offer" },
    memo: { cap: "PDF memo", id: "APP-7H2K4Q", title: "Credit memo", lines: [90, 70, 80] },
  },
};

export const moneyFlow = {
  title: "How money and contracts flow",
  subtitle: "Your accounts and the company that signs every deal",
  chip: "Changes need 2 people and a 24-hour wait",
  out: { cap: "Out", chip: "Verified", title: "Funding account", account: "Eastern Bank ••4102", note: "ACH and wire" },
  sent: "Advance sent",
  contract: { cap: "Contract", chip: "E-signed", entity: "Ridgeline Capital LLC", entityNote: "Contracting entity", signer: { ini: "PS", name: "Priya Shah", text: "signs for you", hint: "Audit trail kept on every contract" }, add: "+ Add another entity" },
  payments: "Daily payments",
  in: { cap: "In", chip: "Verified", title: "Collections account", account: "Eastern Bank ••4119", note: "Daily debits land here" },
};

export const webAddresses = {
  title: "Your web addresses",
  hint: "Merchants see your name, not ours",
  items: [
    { label: "Application forms", host: "apply.ridgeline.com", live: false },
    { label: "Merchant Link", host: "link.ridgeline.com", live: true },
    { label: "Broker portal", host: "brokers.ridgeline.com", live: false },
  ],
  live: "Live",
  soon: "Coming soon",
};

export const notificationChannels = ["In Cevrynt", "Email", "Text"];
const channelWords = ["app", "email", "text"];
export const channelWord = (i: number) => channelWords[i];

export const notifications = {
  title: "Notifications",
  subtitle: "Team defaults. Each person can turn things down, but not off for urgent alerts.",
  when: "When",
  urgent: "Urgent",
  /** defaults per channel, in notificationChannels order */
  events: [
    { label: "Stacking alert on a deal", urgent: true, on: [true, true, true] },
    { label: "Payment returned", urgent: true, on: [true, true, false] },
    { label: "Deal assigned to me", urgent: false, on: [true, true, false] },
    { label: "Decision deadline in 30 min", urgent: true, on: [true, false, true] },
    { label: "Offer expires today", urgent: false, on: [true, true, false] },
    { label: "Broker replied", urgent: false, on: [true, false, false] },
    { label: "Weekly report ready", urgent: false, on: [false, true, false] },
  ],
};

export const workingHours = {
  title: "Working hours",
  rows: [
    { label: "Open", value: "Mon – Fri, 8:00 – 18:00" },
    { label: "Decision target", value: `${DECISION_TARGET_HOURS} working hours` },
    { label: "Deadlines pause", value: "Nights, weekends" },
    { label: "Bank holidays", value: "US federal, 11 a year" },
  ],
};

export const dataDocs = {
  title: "Data and documents",
  rows: [
    { label: "Stored in", value: "United States" },
    { label: "Kept for", value: "7 years after the deal ends" },
    { label: "Bank and tax IDs", value: "Hidden except last 4" },
    { label: "Declined deals", value: "Deleted after 2 years" },
  ],
};

export const yourData = {
  title: "Your data, your way",
  text: "Download everything at any time, or handle a merchant's request to see or delete their data.",
  export: "Export all data",
  requests: "Merchant data requests · 0 open",
};
