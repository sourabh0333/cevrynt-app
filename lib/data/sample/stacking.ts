import type { StackingAlert, StackingSummary } from "@/lib/data/types";

/**
 * Sample Stacking Watch records, copied from design/prototypes/Stacking.dc.html
 * (look: design/Stacking.html). Each alert points at its deal, queued
 * funding or advance, so the merchant and stage come from those records.
 * The page lists the last week's alerts; older ones still count as open
 * alerts and as broker fraud flags. Pages get these through lib/data/stacking.
 */

const at = (date: string, time = "12:00") => `${date}T${time}:00-04:00`;

export const stackingAlerts: StackingAlert[] = [
  {
    id: "al-la", severity: "high", kind: "ucc", target: { kind: "funding", fundingId: "c" }, seenAt: at("2026-10-13", "08:12"),
    summary: "New UCC filing by another funder",
    facts: [["Secured party", "Northpoint Funding LLC"], ["Filed", "Oct 11, 2026 · Massachusetts"], ["Collateral", "All receivables"], ["Not on application", "Yes"]],
    advice: "Funding is on hold. Ask the merchant about the new advance and recheck the payment they can afford before sending money.",
    action: "Keep funding on hold", status: "open",
  },
  {
    id: "al-gs", severity: "high", kind: "debit", target: { kind: "advance", advanceId: "adv-gs" }, seenAt: at("2026-10-13", "07:40"),
    summary: "Received $35,000 from another funder",
    facts: [["Deposit", "$35,000 from NPF Capital"], ["New daily debit", "$410 from Oct 13"], ["Debt share now", "47% of revenue"], ["Your contract", "No new advances clause"]],
    advice: "They broke the no-new-advances term. Call the merchant and the broker, and watch the next five payments closely.",
    action: "Call merchant", status: "open",
  },
  {
    id: "al-ma", severity: "high", kind: "ucc", target: { kind: "deal", dealId: "APP-9K2M7R" }, seenAt: at("2026-10-13", "09:28"),
    summary: "New UCC filing, not disclosed",
    facts: [["Secured party", "Desert Sun Capital"], ["Filed", "Oct 11, 2026 · Arizona"], ["On application", "No"], ["Also", "Statement does not reconcile"]],
    advice: "Two warning signs on one deal. Decline, or ask for the new funder’s contract and fresh statements first.",
    action: "Send to decision", status: "open",
  },
  {
    id: "al-rl", severity: "high", kind: "bank", target: { kind: "book", merchant: "Rivera Landscaping", repaid: 0.34 }, seenAt: at("2026-10-11", "14:05"),
    summary: "Changed the bank account we debit",
    facts: [["Old account", "Chase ••2208, still open"], ["New account", "Bank not on file"], ["Payments since", "1 blocked"], ["Notice to you", "None"]],
    advice: "Moving accounts before missing payments is a common pattern. Ask for the new account and a signed payment authorization.",
    action: "Request new authorization", status: "open",
  },
  {
    id: "al-sp", severity: "medium", kind: "duplicate", target: { kind: "deal", dealId: "APP-0SP4PD" }, seenAt: at("2026-10-11", "16:30"),
    summary: "Shares a bank account with a funded merchant",
    facts: [["Shared account", "••3391"], ["Shared phone", "(207) 555-0127"], ["Other business", "Bright Smile Kids, funded March"], ["Owners", "Different names, same surname"]],
    advice: "May be the same business under a second name. See the connections map below and ask for both companies’ statements.",
    action: "Ask for statements", status: "open",
    connection: {
      account: "3391",
      phone: "2075550127",
      labels: { here: "Sunrise", other: "Bright Smile" },
      owners: { here: "R. Patel", other: "S. Patel" },
      other: { name: "Bright Smile Kids Dental", shortName: "Bright Smile Kids", fundedMonth: "2026-03", broker: "Keystone" },
    },
  },
  {
    id: "al-pr", severity: "medium", kind: "inquiry", target: { kind: "advance", advanceId: "adv-pr" }, seenAt: at("2026-10-11", "11:20"),
    summary: "Credit check by another funder",
    facts: [["Inquiry by", "A funder, name withheld by bureau"], ["Date", "Oct 10, 2026"], ["New debits", "None yet"], ["Renewal", "Ready, not yet offered"]],
    advice: "They may be shopping. Send the renewal offer today before another funder does.",
    action: "Send renewal offer", status: "open",
  },
  {
    id: "al-ms", severity: "medium", kind: "inquiry", target: { kind: "advance", advanceId: "adv-ms" }, seenAt: at("2026-10-04", "10:10"),
    summary: "Credit check by another funder",
    facts: [["Inquiry by", "A funder, name withheld by bureau"], ["Date", "Oct 3, 2026"], ["New debits", "None yet"]],
    advice: "Watch for a new funder debit in the next two weeks.",
    action: "Keep watching", status: "open",
  },
  {
    id: "al-wa", severity: "medium", kind: "bank", target: { kind: "advance", advanceId: "adv-wa" }, seenAt: at("2026-08-20", "09:05"),
    summary: "Changed the bank account we debit",
    facts: [["Old account", "Citizens ••4471, closed"], ["New account", "TD Bank ••0386"], ["Authorization", "Signed Aug 21"]],
    advice: "Explained by the merchant and the broker. A new payment authorization is on file.",
    action: "Close alert", status: "reviewed",
  },
];

export const stackingSummary: StackingSummary = {
  watched: { full: 61, partial: 33 },
  month: { raised: 21, real: 9, stopped: { count: 2, amount: 85000 }, falseAlarms: 5 },
  rules: [
    { key: "hold", on: true },
    { key: "notify", on: true },
    { key: "broker", on: true },
    { key: "pause", on: false },
    { key: "renew", on: true },
  ],
};
