/**
 * Sample data for the Conditions & stips tab, copied from
 * design/prototypes/Deal-Conditions.dc.html (look: design/Deal-Conditions.html).
 * Real API calls replace this later behind the same types.
 */

export type ConditionKey = "landlord" | "contract" | "call" | "stmts" | "app" | "id" | "void" | "kyc";
export type Party = "broker" | "merchant" | "us" | "auto";
export type ConditionBase = "wait" | "booked" | "done";
export type ConditionStatus = ConditionBase | "waived";

export type ConditionItem = {
  key: ConditionKey;
  title: string;
  detail: string;
  /** initials shown on the card */
  who: string;
  party: Party;
  base: ConditionBase;
  /** the primary button on an open card */
  action?: string;
  /** the second tile on an open card: label and value */
  meta?: [string, string];
  /** the time it was done, for items done before the page opened */
  time?: string;
  /** shows the "drop the file here" zone */
  drop?: boolean;
};

export const conditionsTotal = 8;

export const conditionItems: ConditionItem[] = [
  { key: "landlord", title: "Landlord letter", detail: "Lease at 418 Commercial St is current and rent is paid", who: "AP", party: "broker", base: "wait", action: "Mark received", meta: ["Due", "Wed, Oct 14"], drop: true },
  { key: "contract", title: "Signed contract", detail: "Agreement, personal guarantee, payment authorization and cost disclosure", who: "EB", party: "merchant", base: "wait", action: "Mark signed", meta: ["Sent", "After the offer"] },
  { key: "call", title: "Funding call", detail: "Short recorded call to confirm the terms with Elena", who: "MC", party: "us", base: "booked", action: "Mark done", meta: ["Booked", "Thursday 10:00"] },
  { key: "stmts", title: "Bank statements", detail: "4 months, read and checked", who: "Auto", party: "auto", base: "done", time: "09:41" },
  { key: "app", title: "Signed application", detail: "E-signed by Elena", who: "EB", party: "merchant", base: "done", time: "09:41" },
  { key: "id", title: "Photo ID and selfie", detail: "Through Merchant Link", who: "EB", party: "merchant", base: "done", time: "09:58" },
  { key: "void", title: "Voided check", detail: "Matches account ••7712", who: "EB", party: "merchant", base: "done", time: "09:58" },
  { key: "kyc", title: "Identity and sanctions", detail: "Clear on every list", who: "Auto", party: "auto", base: "done", time: "09:59" },
];

export const partyName: Record<Party, string> = { broker: "Apex Funding", merchant: "Elena Brooks", us: "You", auto: "Automatic" };

export const runway = {
  title: "Road to funding",
  hold: { chip: "Funding on hold", cta: "Remind everyone" },
  met: { chip: "All conditions met", cta: "Send to funding" },
  headline: { met: "Ready to fund", left: (n: number) => `${n} more before funding` },
  subline: {
    met: "Every condition is met. Final checks run before money is sent.",
    left: "Approve any time. Money goes out only when every condition is met or waived.",
  },
  counts: { done: "Done", waived: "Waived", left: "Left" },
  next: (title: string) => `Next: ${title}`,
  allDone: "All steps complete",
};

export const board = {
  title: "Still needed",
  subtitle: "Required by your policy for a $40K deal",
  add: "+ Add condition",
  drop: "Drop the file here, or it arrives by email",
  waive: { button: "Waive", prompt: "Why is this not needed?", placeholder: "Short reason for the file", confirm: "Confirm waive", cancel: "Cancel", reasonLabel: "Reason" },
  undo: "Undo",
  waivedNote: "Waived items need a senior underwriter to approve before funding. Priya Shah has been asked.",
  doneToday: "Done today",
  now: "now",
  history: { label: "See history", href: "/deals/APP-7H2K4Q/activity" },
};

export const terms = {
  title: "Terms of approval",
  chip: "3 set",
  intro: "Rules the merchant agrees to, written into the contract.",
  items: [
    "No new advances or loans until this one is repaid",
    "Keep the Chase ••7712 account open for payments",
    "Payments start 2 business days after funding",
  ],
  add: "+ Add a term",
};

export const finalChecks = {
  title: "Final checks",
  chip: "Automatic",
  intro: "Run again in the hour before money is sent. Anything new stops the funding.",
  items: ["New UCC filings", "New funder activity", "Bank account open", "Registry active", "Last 5 days of activity", "Payout account ••7712"],
  last: "Last full check: today 09:59",
};

export const recommended = {
  title: "Recommended",
  chip: "Not required",
  intro: "Not needed to fund, but they make the file stronger.",
  items: [
    { label: "Credit report consent", status: "Sent", sent: true },
    { label: "Live bank connection", status: "Not sent" },
    { label: "Kingsway payoff letter", status: "If paying off" },
  ] as { label: string; status: string; sent?: boolean }[],
  link: { label: "See what your policy requires", href: "/settings/policy" },
};

export type Recipient = "broker" | "merchant";

export const composer = {
  title: "Ask for what's missing",
  subtitle: "One message, written for you",
  sendTo: "Send to",
  askingFor: "Asking for",
  asks: [
    { label: "Landlord letter", on: true },
    { label: "+ Credit consent" },
    { label: "+ Bank connection" },
  ] as { label: string; on?: boolean }[],
  recipients: [
    { key: "broker", initials: "AP", label: "Broker", sub: "Dana Ruiz · by email", to: "Dana Ruiz, Apex Funding Partners" },
    { key: "merchant", initials: "EB", label: "Merchant", sub: "Elena Brooks · Merchant Link", to: "Elena Brooks, through Merchant Link" },
  ] as { key: Recipient; initials: string; label: string; sub: string; to: string }[],
  preview: "Preview",
  messages: {
    broker:
      "Hi Dana,\n\nHarbor Street Bakery (APP-7H2K4Q) looks good so far. To fund, we still need a landlord letter for 418 Commercial St confirming the lease is current and rent is paid.\n\nCould you send it by Wednesday, Oct 14?\n\nThanks,\nMaya",
    merchant:
      "Hi Elena,\n\nThanks for your application. One more thing helps us move faster: a letter from your landlord confirming your lease at 418 Commercial St is current.\n\nYou can upload it with the secure link below.\n\nMaya, Ridgeline Capital",
  } as Record<Recipient, string>,
  reminder: "Reminds every 24 hours until it arrives · ",
  seeLink: { label: "See what Elena sees", href: "/m/demo" },
  edit: "Edit",
  send: "Send request",
};
