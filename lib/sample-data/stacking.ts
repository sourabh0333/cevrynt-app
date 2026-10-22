/**
 * Sample data for the Stacking Watch page, copied from
 * design/prototypes/Stacking.dc.html (look: design/Stacking.html).
 * Real API calls replace this later behind the same types.
 */

export const stackingHeader = {
  title: "Stacking Watch",
  line: "3 new alerts · watching 94 merchants every day",
};

export const summary = {
  chip: "Watching now",
  title: "$85,000 kept safe this month",
  text: "Two deals were stopped before funding because the merchant took another advance.",
  tiles: [
    { value: "3", label: "New today" },
    { value: "7", label: "Open" },
    { value: "2", label: "Fundings stopped" },
    { value: "94", label: "Merchants watched" },
  ],
};

export const signals = {
  title: "What we watch",
  chip: "Daily",
  items: ["UCC filings", "New funder debits", "Funding deposits", "Credit inquiries", "Duplicate applications", "Bank account changes"],
};

export type Severity = "high" | "med";
export type AlertKind = "ucc" | "debit" | "bank" | "dup" | "inq";
export type DealStage = "review" | "fund" | "funded" | "renew";
export type AlertTab = "all" | Severity | "done";

export type Alert = {
  id: string;
  severity: Severity;
  kind: AlertKind;
  glyph: string;
  name: string;
  stageKey: DealStage;
  stage: string;
  what: string;
  when: string;
  facts: [string, string][];
  advice: string;
  action: string;
};

export const severityLabel: Record<Severity, string> = { high: "High", med: "Medium" };
export const stageLabel: Record<DealStage, string> = { review: "In review", fund: "Ready to fund", funded: "Funded", renew: "Renewal" };

export const alertTabs: { key: AlertTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "med", label: "Medium" },
  { key: "done", label: "Reviewed" },
];

export const alertsList = {
  title: "Alerts",
  columns: ["Severity", "Merchant", "What happened", "Seen", "Deal"],
  empty: "Nothing here yet.",
  startSelected: "LA",
};

/** what Cevrynt did on its own when the signal came in, by deal stage */
export const autoStep: Record<DealStage, [string, string]> = {
  fund: ["Funding held automatically", "Nothing can be sent until someone reviews"],
  review: ["Added to the deal review", "Shown on the Integrity tab"],
  funded: ["Collections team notified", "Payments watched more closely"],
  renew: ["Renewal offer paused", "Until this alert is reviewed"],
};

export const detail = {
  evidence: "Evidence",
  suggest: "What we suggest",
  timeline: "What happened",
  found: { title: "Signal found", by: " · by Stacking Watch" },
  review: {
    open: ["Waiting for your review", "Use the button below when done"],
    done: ["Reviewed", "Marked reviewed just now"],
  },
  status: { open: "open", done: "reviewed" },
  reopen: "Reopen alert",
  openDeal: "Open deal",
};

export const alerts: Alert[] = [
  {
    id: "LA", severity: "high", kind: "ucc", glyph: "U", name: "Lakeshore Auto Body", stageKey: "fund", stage: "Ready to fund, $60K", what: "New UCC filing by another funder", when: "Today 08:12",
    facts: [["Secured party", "Northpoint Funding LLC"], ["Filed", "Oct 11, 2026 · Massachusetts"], ["Collateral", "All receivables"], ["Not on application", "Yes"]],
    advice: "Funding is on hold. Ask the merchant about the new advance and recheck the payment they can afford before sending money.",
    action: "Keep funding on hold",
  },
  {
    id: "GS", severity: "high", kind: "debit", glyph: "$", name: "Granite State Builders", stageKey: "funded", stage: "Funded, 18% repaid", what: "Received $35,000 from another funder", when: "Today 07:40",
    facts: [["Deposit", "$35,000 from NPF Capital"], ["New daily debit", "$410 from Oct 13"], ["Debt share now", "47% of revenue"], ["Your contract", "No new advances clause"]],
    advice: "They broke the no-new-advances term. Call the merchant and the broker, and watch the next five payments closely.",
    action: "Call merchant",
  },
  {
    id: "MA", severity: "high", kind: "ucc", glyph: "U", name: "Mesa Auto Repair", stageKey: "review", stage: "In review, $35K asked", what: "New UCC filing, not disclosed", when: "Today 09:28",
    facts: [["Secured party", "Desert Sun Capital"], ["Filed", "Oct 11, 2026 · Arizona"], ["On application", "No"], ["Also", "Statement does not reconcile"]],
    advice: "Two warning signs on one deal. Decline, or ask for the new funder’s contract and fresh statements first.",
    action: "Send to decision",
  },
  {
    id: "RL", severity: "high", kind: "bank", glyph: "B", name: "Rivera Landscaping", stageKey: "funded", stage: "Funded, 34% repaid", what: "Changed the bank account we debit", when: "2 days ago",
    facts: [["Old account", "Chase ••2208, still open"], ["New account", "Bank not on file"], ["Payments since", "1 blocked"], ["Notice to you", "None"]],
    advice: "Moving accounts before missing payments is a common pattern. Ask for the new account and a signed payment authorization.",
    action: "Request new authorization",
  },
  {
    id: "SP", severity: "med", kind: "dup", glyph: "D", name: "Sunrise Pediatric Dental", stageKey: "review", stage: "In review, $90K asked", what: "Shares a bank account with a funded merchant", when: "2 days ago",
    facts: [["Shared account", "••3391"], ["Shared phone", "(207) 555-0127"], ["Other business", "Bright Smile Kids, funded March"], ["Owners", "Different names, same surname"]],
    advice: "May be the same business under a second name. See the connections map below and ask for both companies’ statements.",
    action: "Ask for statements",
  },
  {
    id: "PR", severity: "med", kind: "inq", glyph: "C", name: "Pine Ridge Vet Clinic", stageKey: "renew", stage: "Renewal ready, $70K", what: "Credit check by another funder", when: "2 days ago",
    facts: [["Inquiry by", "A funder, name withheld by bureau"], ["Date", "Oct 10, 2026"], ["New debits", "None yet"], ["Renewal", "Ready, not yet offered"]],
    advice: "They may be shopping. Send the renewal offer today before another funder does.",
    action: "Send renewal offer",
  },
];
