/**
 * Interface wording for the deal Conditions & stips tab
 * (design/Deal-Conditions.html). The conditions, terms and checks come from
 * the data layer (conditionsTabView); this file words them, and builds the
 * conditions check the tab bar and the Summary show from the conditions
 * still waiting.
 */
import type { CheckState, ConditionParty, DealCheckSet, DealChecks, DealCondition, DealConditions } from "@/lib/data/types";
import { waitingConditions, type Got, type Waived } from "@/lib/deal-conditions";
import { dateShort, moneyShort, timeOfDay, weekdayLong, weekdayShort } from "@/lib/format";

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** The conditions check: how many are still waiting, and which ("Landlord letter, signed contract."). */
export function conditionsCheck(items: DealCondition[], got: Got = {}, waived: Waived = {}): CheckState & { note: string } {
  const waiting = waitingConditions(items, got, waived);
  if (!waiting.length) return { state: "ok", note: "Nothing waiting on anyone." };
  return { state: "open", count: waiting.length, note: `${waiting.map((c, i) => (i ? lowerFirst(c.title) : c.title)).join(", ")}.` };
}

/** Every check for the Summary and the tab bar: the deal's stored ones plus the conditions one. */
export const checkSet = (checks: DealChecks, items: DealCondition[]): DealCheckSet => ({ ...checks, conditions: conditionsCheck(items) });

export const runwayCopy = {
  title: "Road to funding",
  hold: { chip: "Funding on hold", cta: "Remind everyone" },
  met: { chip: "All conditions met", cta: "Send to funding" },
  headline: { met: "Ready to fund", left: (n: number) => `${n} more before funding` },
  subline: {
    met: "Every condition is met. Final checks run before money is sent.",
    left: "Approve any time. Money goes out only when every condition is met or waived.",
  },
  counts: { done: "Done", waived: "Waived", left: "Left" },
  ringLabel: (met: number, total: number) => `${met} of ${total} conditions met`,
  stepsLabel: (done: number, total: number) => `${done} of ${total} steps done`,
  next: (title: string) => `Next: ${title}`,
  allDone: "All steps complete",
  steps: {
    documents: { title: "Documents", sub: (n: number) => `${n} cleared today` },
    approval: { title: "Your approval", done: "Approved", open: "Ready now" },
    contract: { title: "Contract signed", done: "Signed", waived: "Waived" },
    received: "Received",
    waived: "Waived",
    call: "Done",
    due: (at: string) => `Due ${dateShort(at)}`,
    funded: { title: "Funded", met: "Ready to send", open: "After final checks" },
  },
};

/** Who each party is on a card: initials and name. */
export const partyCopy = {
  us: "You",
  auto: { name: "Automatic", initials: "Auto" },
};

export const boardCopy = {
  title: "Still needed",
  subtitle: (amount: number) => `Required by your policy for a ${moneyShort(amount)} deal`,
  add: "+ Add condition",
  from: "From",
  drop: "Drop the file here, or it arrives by email",
  action: { received: "Mark received", signed: "Mark signed", done: "Mark done" } as Record<DealCondition["action"], string>,
  /** the second tile on an open card */
  meta: (c: DealCondition): [string, string] =>
    c.status === "booked" && c.bookedAt
      ? ["Booked", `${weekdayLong(c.bookedAt)} ${timeOfDay(c.bookedAt)}`]
      : c.dueAt
        ? ["Due", `${weekdayShort(c.dueAt)}, ${dateShort(c.dueAt)}`]
        : c.withOffer
          ? ["Sent", "After the offer"]
          : ["", ""],
  chip: { done: "Done", waived: "Waived", booked: "Booked", wait: "Waiting" },
  waive: { button: "Waive", prompt: "Why is this not needed?", placeholder: "Short reason for the file", confirm: "Confirm waive", cancel: "Cancel", reasonLabel: "Reason" },
  undo: "Undo",
  waivedNote: (senior: string) => `Waived items need a senior underwriter to approve before funding. ${senior} has been asked.`,
  doneToday: "Done today",
  now: "now",
  history: "See history",
};

export const partyName = (party: ConditionParty, parties: DealConditions["parties"]) =>
  party === "broker" ? parties.broker.name : party === "merchant" ? parties.merchant.name : party === "us" ? partyCopy.us : partyCopy.auto.name;

export const sideCardsLabel = "Terms, final checks and recommended items";

export const termsCopy = {
  title: "Terms of approval",
  chip: (n: number) => `${n} set`,
  intro: "Rules the merchant agrees to, written into the contract.",
  add: "+ Add a term",
};

export const finalChecksCopy = {
  title: "Final checks",
  chip: "Automatic",
  intro: "Run again in the hour before money is sent. Anything new stops the funding.",
  last: (at: string, today: boolean) => `Last full check: ${today ? "today" : dateShort(at)} ${timeOfDay(at)}`,
};

export const recommendedCopy = {
  title: "Recommended",
  chip: "Not required",
  intro: "Not needed to fund, but they make the file stronger.",
  status: { sent: "Sent", "not-sent": "Not sent", "if-paying-off": "If paying off" } as Record<DealConditions["recommended"][number]["status"], string>,
  link: { label: "See what your policy requires", href: "/settings/policy" },
};

export type Recipient = "broker" | "merchant";

const firstName = (name: string) => name.split(" ")[0];

/** What the request composer needs to write its two messages. */
export type ComposerFacts = {
  /** the deal's merchant name and id, the broker's company */
  dealName: string;
  dealId: string;
  brokerCompany: string;
  parties: DealConditions["parties"];
  /** the condition being asked for (the landlord letter) and the address it's about */
  ask: DealCondition;
  street: string;
  /** the underwriter writing, and the funder */
  me: string;
  funder: string;
};

export const composerCopy = {
  title: "Ask for what's missing",
  subtitle: "One message, written for you",
  sendTo: "Send to",
  askingFor: "Asking for",
  extras: ["+ Credit consent", "+ Bank connection"],
  recipients: (f: ComposerFacts): { key: Recipient; initials: string; label: string; sub: string; to: string }[] => [
    { key: "broker", initials: f.parties.broker.initials, label: "Broker", sub: `${f.parties.broker.contact} · by email`, to: `${f.parties.broker.contact}, ${f.brokerCompany}` },
    { key: "merchant", initials: f.parties.merchant.initials, label: "Merchant", sub: `${f.parties.merchant.name} · Merchant Link`, to: `${f.parties.merchant.name}, through Merchant Link` },
  ],
  to: "To",
  preview: "Preview",
  message: (to: Recipient, f: ComposerFacts) => {
    const shortName = f.dealName.replace(/ LLC$/, "");
    const due = f.ask.dueAt ? `${weekdayLong(f.ask.dueAt)}, ${dateShort(f.ask.dueAt)}` : "";
    return to === "broker"
      ? `Hi ${firstName(f.parties.broker.contact)},\n\n${shortName} (${f.dealId}) looks good so far. To fund, we still need a landlord letter for ${f.street} confirming the lease is current and rent is paid.\n\nCould you send it by ${due}?\n\nThanks,\n${firstName(f.me)}`
      : `Hi ${firstName(f.parties.merchant.name)},\n\nThanks for your application. One more thing helps us move faster: a letter from your landlord confirming your lease at ${f.street} is current.\n\nYou can upload it with the secure link below.\n\n${firstName(f.me)}, ${f.funder}`;
  },
  reminder: "Reminds every 24 hours until it arrives · ",
  seeLink: (merchant: string) => ({ label: `See what ${firstName(merchant)} sees`, href: "/m/demo" }),
  edit: "Edit",
  send: "Send request",
};
