/**
 * Interface wording for Settings → Workspace (design/Settings-Workspace.html).
 * The workspace record and notification defaults come from the data layer
 * (lib/data/settings); this file holds the labels, and turns plain values
 * (hours, years, account numbers) into the lines people read.
 */
import type { BankAccount, NotificationChannel, NotificationEvent, WebAddressKind, Workspace } from "@/lib/data/types";
import { plural } from "@/lib/format";

export const workspaceHeader = {
  text: "Your company details, brand, working hours and notifications",
  upload: "Upload logo",
};

const timeZoneNames: Record<string, string> = {
  "America/New_York": "Eastern (New York)",
  "America/Chicago": "Central (Chicago)",
  "America/Denver": "Mountain (Denver)",
  "America/Los_Angeles": "Pacific (Los Angeles)",
};

export const company = {
  title: "Company",
  fields: (ws: Workspace): { label: string; value: string; mono?: boolean }[] => [
    { label: "Legal name", value: ws.legalName },
    { label: "Shown to merchants as", value: ws.name },
    { label: "Address", value: ws.address },
    { label: "Time zone", value: timeZoneNames[ws.timeZone] ?? ws.timeZone },
    { label: "Sends email from", value: ws.emailFrom, mono: true },
    { label: "Support phone", value: ws.supportPhone },
  ],
  verified: "Email domain verified, so offers don't land in spam",
};

export const brand = {
  title: "Brand",
  subtitle: "One color, used everywhere merchants and brokers see you",
  colorCap: "Color",
  logoCap: "Logo",
  drop: "Drop your logo here",
  dropHint: "SVG or PNG, square works best",
  /** sample screens in the previews, not workspace data */
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
  verified: "Verified",
  account: (a: BankAccount) => `${a.bank} ••${a.last4}`,
  out: { cap: "Out", title: "Funding account", note: "ACH and wire" },
  sent: "Advance sent",
  contract: { cap: "Contract", chip: "E-signed", entityNote: "Contracting entity", signerText: "signs for you", signerHint: "Audit trail kept on every contract", add: "+ Add another entity" },
  payments: "Daily payments",
  in: { cap: "In", title: "Collections account", note: "Daily debits land here" },
};

export const webAddresses = {
  title: "Your web addresses",
  hint: "Merchants see your name, not ours",
  labels: { apply: "Application forms", link: "Merchant Link", brokers: "Broker portal" } as Record<WebAddressKind, string>,
  live: "Live",
  soon: "Coming soon",
};

export const notifications = {
  title: "Notifications",
  subtitle: "Team defaults. Each person can turn things down, but not off for urgent alerts.",
  when: "When",
  urgent: "Urgent",
  /** column order; word is used in each switch's label ("… by email") */
  channels: [
    { key: "app", label: "In Cevrynt", word: "app" },
    { key: "email", label: "Email", word: "email" },
    { key: "text", label: "Text", word: "text" },
  ] as { key: NotificationChannel; label: string; word: string }[],
  events: {
    stacking: "Stacking alert on a deal",
    returned: "Payment returned",
    assigned: "Deal assigned to me",
    deadline: "Decision deadline in 30 min",
    offerExpires: "Offer expires today",
    brokerReplied: "Broker replied",
    weeklyReport: "Weekly report ready",
  } as Record<NotificationEvent, string>,
};

const dayNames = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** "08:00" → "8:00" */
const clock = (hhmm: string) => hhmm.replace(/^0(\d)/, "$1");

export const workingHours = {
  title: "Working hours",
  rows: ({ hours: h, decisionTargetHours }: Workspace) => {
    const pauses = [h.pauseNights && "nights", h.pauseWeekends && "weekends"].filter(Boolean).join(", ");
    return [
      { label: "Open", value: `${dayNames[h.firstDay]} – ${dayNames[h.lastDay]}, ${clock(h.opens)} – ${clock(h.closes)}` },
      { label: "Decision target", value: plural(decisionTargetHours, "working hour") },
      { label: "Deadlines pause", value: pauses ? pauses[0].toUpperCase() + pauses.slice(1) : "Never" },
      { label: "Bank holidays", value: `${h.holidayCalendar}, ${h.holidaysPerYear} a year` },
    ];
  },
};

export const dataDocs = {
  title: "Data and documents",
  rows: ({ data: d }: Workspace) => [
    { label: "Stored in", value: d.storedIn },
    { label: "Kept for", value: `${plural(d.keptYears, "year")} after the deal ends` },
    { label: "Bank and tax IDs", value: d.maskIds ? "Hidden except last 4" : "Shown in full" },
    { label: "Declined deals", value: `Deleted after ${plural(d.declinedDeletedYears, "year")}` },
  ],
};

export const yourData = {
  title: "Your data, your way",
  text: "Download everything at any time, or handle a merchant's request to see or delete their data.",
  export: "Export all data",
  requests: (open: number) => `Merchant data requests · ${open} open`,
};
