/**
 * Sample data for Settings → Intake channels, copied from
 * design/prototypes/Settings-Intake.dc.html (look: design/Settings-Intake.html).
 * Only Merchant Link is live. Email forwarding, public forms and CRM / API
 * are "coming soon" previews (CLAUDE.md) and are never shown as working.
 * Real API calls replace this later behind the same types.
 */

export const channelsHeader = {
  title: "Intake channels",
  text: "How deals reach you. Today that's uploads in Intake and Merchant Link; email, forms and CRM are on the way. The same fit check runs whatever the channel.",
  chip: "1 live · 3 coming",
};

export type ChannelKey = "link" | "email" | "forms" | "api";

export const channelTabs: { key: ChannelKey; name: string; sub: string; live: boolean; soon?: string }[] = [
  { key: "link", name: "Merchant Link", sub: "Live · merchants finish online", live: true },
  { key: "email", name: "Email forwarding", sub: "Coming next", live: false, soon: "Coming next" },
  { key: "forms", name: "Public forms", sub: "Coming soon", live: false, soon: "Coming soon" },
  { key: "api", name: "CRM and API", sub: "Coming later", live: false, soon: "Coming later" },
];

export const comingBanner = {
  notYet: (name: string) => `${name} isn't available yet.`,
  preview: "This is a preview of how you'll set it up.",
  cta: { label: "Join early access", href: "/whats-coming" },
};

export type Toggle = { key: string; title: string; hint: string; on: boolean };

export const merchantLink = {
  previewCap: "What the merchant sees",
  previewLink: { label: "Open full preview", href: "/m/demo" },
  brand: { initials: "RC", name: "Ridgeline Capital" },
  greeting: "Hi Elena, a few quick steps to finish your application.",
  steps: [
    { label: "Upload statements", done: true },
    { label: "Photo ID and selfie", done: true },
    { label: "Connect your bank", done: false },
    { label: "Sign consent", done: false },
  ],
  toggles: [
    { key: "bank", title: "Ask for a live bank connection", hint: "Lets Stacking Watch see new funder debits", on: true },
    { key: "idv", title: "Photo ID with a live selfie", hint: "Checked against sanctions lists too", on: true },
    { key: "remind", title: "Remind every 24 hours", hint: "By text and email, until done", on: true },
    { key: "spanish", title: "Show in Spanish when preferred", hint: "Merchant can switch language", on: false },
  ] as Toggle[],
  expiry: { label: "Link expires after", value: "7 days" },
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
  key: { label: "API key", value: "ck_live_••••••••3f9a", hint: "Created Mar 3 · last used today", action: "New key" },
};

export const channelPerformance = {
  title: "Which channels bring the best deals",
  subtitle: "This month · deals received, and the share that got funded",
  columns: ["Channel", "", "Deals", "Funded"],
  /** live channels only */
  rows: [
    { channel: "Single package", deals: 132, funded: 36 },
    { channel: "Bulk ZIP", deals: 98, funded: 28, low: true },
    { channel: "Manual lead", deals: 39, funded: 40 },
    { channel: "Merchant Link", deals: 18, funded: 33 },
  ] as { channel: string; deals: number; funded: number; low?: boolean }[],
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
