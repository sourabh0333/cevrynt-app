/**
 * Interface wording for Settings › Intake channels
 * (design/Settings-Intake.html and its prototype). Merchant Link's set-up,
 * the monthly channel counts, the workspace brand and the API key come
 * from the data layer (intakeChannelsView). Email forwarding, public forms
 * and CRM / API are "coming soon" previews (CLAUDE.md): their wording here
 * is a preview, never a working setting.
 */
import type { ApiKey, IntakeChannelSettings, IntakeSummary, IsoDateTime } from "@/lib/data/types";
import { dateShort, dayLabel, plural } from "@/lib/format";
import { channelLabel } from "./intake";

export type ChannelKey = "link" | "email" | "forms" | "api";

export const channelTabs: { key: ChannelKey; name: string; sub: string; live: boolean; soon?: string }[] = [
  { key: "link", name: "Merchant Link", sub: "Live · merchants finish online", live: true },
  { key: "email", name: "Email forwarding", sub: "Coming next", live: false, soon: "Coming next" },
  { key: "forms", name: "Public forms", sub: "Coming soon", live: false, soon: "Coming soon" },
  { key: "api", name: "CRM and API", sub: "Coming later", live: false, soon: "Coming later" },
];

export const channelsHeader = {
  title: "Intake channels",
  text: "How deals reach you. Today that's uploads in Intake and Merchant Link; email, forms and CRM are on the way. The same fit check runs whatever the channel.",
  chip: `${channelTabs.filter((t) => t.live).length} live · ${channelTabs.filter((t) => !t.live).length} coming`,
  tabsLabel: "Channels",
};

export const comingBanner = {
  notYet: (name: string) => `${name} isn't available yet.`,
  preview: "This is a preview of how you'll set it up.",
  previewLabel: (name: string) => `${name} preview, not available yet`,
  cta: { label: "Join early access", href: "/whats-coming" },
};

export type Toggle = { key: string; title: string; hint: string; on: boolean };
type LinkKey = keyof Omit<IntakeChannelSettings["merchantLink"], "expiryDays">;

const linkToggles: { key: LinkKey; title: string; hint: string }[] = [
  { key: "bankConnection", title: "Ask for a live bank connection", hint: "Lets Stacking Watch see new funder debits" },
  { key: "photoId", title: "Photo ID with a live selfie", hint: "Checked against sanctions lists too" },
  { key: "reminders", title: "Remind every 24 hours", hint: "By text and email, until done" },
  { key: "spanish", title: "Show in Spanish when preferred", hint: "Merchant can switch language" },
];

export const merchantLink = {
  previewCap: "What the merchant sees",
  previewLink: { label: "Open full preview", href: "/m/demo" },
  greeting: "Hi Elena, a few quick steps to finish your application.",
  steps: [
    { label: "Upload statements", done: true },
    { label: "Photo ID and selfie", done: true },
    { label: "Connect your bank", done: false },
    { label: "Sign consent", done: false },
  ],
  /** the switches, starting from how Merchant Link is set up */
  toggles: (s: IntakeChannelSettings): Toggle[] => linkToggles.map((t) => ({ ...t, on: s.merchantLink[t.key] })),
  expiry: (s: IntakeChannelSettings) => ({ label: "Link expires after", value: `${plural(s.merchantLink.expiryDays, "day")}` }),
};

export const emailPreview = {
  address: "deals@ridgeline.intake.cevrynt.com",
  copy: "Copy address",
  toggles: [
    { key: "approved", title: "Only accept approved brokers", hint: "Unknown senders go to a holding area", on: true },
    { key: "autoreply", title: "Reply to the sender automatically", hint: "“Got it, we’ll be in touch within 4 hours”", on: true },
    { key: "links", title: "Read files in the email body too", hint: "Links to Dropbox, Google Drive and similar", on: true },
    { key: "split", title: "Split one email into several deals", hint: "When a broker sends more than one merchant", on: true },
  ] as Toggle[],
  tiles: [
    { label: "This month", value: "Preview" },
    { label: "Holding area", value: "3", held: true },
    { label: "Accepted files", value: "PDF, ZIP, XLS, CSV, EML", small: true },
  ] as { label: string; value: string; held?: boolean; small?: boolean }[],
  senders: { title: "Approved senders · 24 broker domains", domains: ["apexfunding.co", "summitiso.com", "keystonebrokerage.com"], more: "+21 more", review: "Review 3 held emails" },
  note: "Every file is virus-scanned before anyone opens it.",
};

export const formsPreview = {
  forms: [
    { name: "Broker application", url: "apply.ridgeline.com/broker", count: "6 this week", selected: true },
    { name: "Direct merchant apply", url: "apply.ridgeline.com", count: "3 this week" },
  ] as { name: string; url: string; count: string; selected?: boolean }[],
  live: "Live",
  add: "+ New form",
  asksCap: "Broker application asks for",
  toggles: [
    { key: "stmts", title: "Bank statements, last 4 months", hint: "Required to submit", on: true },
    { key: "credit", title: "Credit check consent", hint: "Signed by the owner on the form", on: true },
    { key: "tax", title: "Tax transcript consent", hint: "Optional, for larger deals", on: false },
    { key: "autocreate", title: "Create the deal as soon as it’s sent", hint: "Runs the fit check straight away", on: true },
  ] as Toggle[],
  embed: { title: "Put it on your website", copy: "Copy code", code: '<script src="https://apply.ridgeline.com/embed.js"></script>', hint: "Your colors and logo · protected against spam bots" },
};

export const apiPreview = {
  crms: [
    { name: "Salesforce", hint: "Two-way: deals in, decisions out", action: "Connect" },
    { name: "HubSpot", hint: "Two-way: deals in, decisions out", action: "Connect" },
    { name: "Centrex", hint: "Deals and statuses both ways", action: "Connect", tag: "MCA CRM" },
    { name: "Your own system", hint: "Use the API and webhooks", action: "Read the docs", quiet: true },
  ] as { name: string; hint: string; action: string; tag?: string; quiet?: boolean }[],
  webhooksCap: "Webhooks · we tell your system when",
  webhooks: [
    { event: "deal.created", url: "https://crm.ridgeline.com/hooks/cevrynt", ok: true },
    { event: "decision.made", url: "https://crm.ridgeline.com/hooks/cevrynt", ok: true },
    { event: "deal.funded", url: "https://ops.ridgeline.com/funding", ok: false },
  ],
  status: { ok: "Working", bad: "Failing" },
  failing: { lead: "deal.funded is failing.", text: "Your server timed out 3 times since 11:02. We'll keep retrying for 24 hours.", log: "See error log", retry: "Retry now" },
  fieldsCap: "Field matching with your CRM",
  fields: [
    ["Business name", "Account.Name"],
    ["Requested amount", "Opp.Amount"],
    ["Decision", "Opp.Stage"],
    ["Broker", "Opp.Partner"],
  ],
  /** the workspace's live API key, the one Security counts */
  key: (k: ApiKey | null, now: IsoDateTime) => ({
    label: "API key",
    value: k ? `ck_live_••••••••${k.last4}` : "None yet",
    hint: k ? `Created ${dateShort(k.createdAt)} · last used ${dayLabel(k.lastUsedAt, now).toLowerCase()}` : "",
    action: "New key",
  }),
};

export const channelPerformance = {
  title: "Which channels bring the best deals",
  subtitle: "This month · deals received, and the share that got funded",
  columns: ["Channel", "", "Deals", "Funded"],
  /** live channels only, from Intake's monthly counts; the lowest funded share is marked */
  rows: (month: IntakeSummary["month"]) => {
    const lowest = Math.min(...month.map((c) => c.funded));
    return month.map((c) => ({ channel: channelLabel[c.channel], deals: c.deals, funded: Math.round(c.funded * 100), low: c.funded === lowest }));
  },
  barLabel: (channel: string, deals: number) => `${channel}: ${plural(deals, "deal")}`,
  note: "Bulk ZIP deals fund less often, usually because folders arrive incomplete. Asking brokers for all four statements per folder could lift the rate.",
};

export const everyDeal = {
  title: "For every new deal",
  steps: [
    { title: "Check for duplicates", hint: "Same business, owner, phone or bank account" },
    { title: "Run the fit check", hint: "Out-of-policy deals declined with the reason" },
    { title: "Assign by workload", hint: "To the underwriter with the most room today" },
    { title: "Ask for what's missing", hint: "Through Merchant Link, with reminders" },
  ],
};
