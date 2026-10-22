/**
 * Sample data for Settings → Renewal rules, copied from
 * design/prototypes/Settings-Renewals.dc.html (look: design/Settings-Renewals.html).
 * Real API calls replace this later behind the same types. No "@/" runtime
 * imports here, so lib/renewal-rules.test.ts can load the merchant list.
 */
import type { ReadinessMerchant } from "../renewal-rules.ts";

const m = (name: string, paid: number, daysSinceReturn: number, rev: number, health: number, stacking = false): ReadinessMerchant => ({
  name,
  paid,
  daysSinceReturn,
  rev,
  health,
  stacking,
});

/** Merchants with a live advance, in the order the "Ready with these rules" list shows them. */
export const readinessMerchants: ReadinessMerchant[] = [
  m("Harborview Bistro", 81, 999, 109, 94),
  m("Coastal Dental Group", 72, 999, 118, 92),
  m("Pine Ridge Vet Clinic", 58, 999, 112, 92),
  m("Lighthouse Coffee Co", 67, 999, 106, 88),
  m("Oakview Deli", 64, 999, 104, 88),
  m("Northgate Fitness", 55, 120, 103, 81),
  m("Bluebird Bakery", 52, 75, 98, 76),
  m("Maple Ridge Florist", 61, 999, 95, 79),
  m("Summit Pet Supply", 53, 60, 92, 77),
  m("Seaside Yoga Studio", 45, 999, 107, 85),
  m("Maple St Barbers", 42, 999, 101, 83),
  m("Kestrel Plumbing", 48, 3, 78, 61),
  m("Westfield Auto Group", 21, 2, 91, 58),
  m("Bayside Hardware", 39, 999, 99, 80),
];

export const renewalRulesHeader = {
  title: "Renewal rules",
  text: "Who counts as ready to renew, what they're offered and when you reach out. The Renewals page uses these.",
  open: { label: "Open Renewals", href: "/renewals" },
};

export const whoIsReady = {
  title: "Who counts as ready",
  subtitle: "A merchant must meet every rule. Move a slider to see who would qualify.",
  sliders: [
    { key: "paid", label: "Repaid at least" },
    { key: "ret", label: "No returned payments in" },
    { key: "rev", label: "Revenue now vs at funding" },
    { key: "score", label: "Health score at least" },
  ] as { key: "paid" | "ret" | "rev" | "score"; label: string }[],
  text: {
    paid: (v: number) => `${v}%`,
    ret: (v: number) => (v ? `${v} days` : "Any time"),
    rev: (v: number) => `${v}%`,
    score: (v: number) => String(v),
  },
  noStack: { title: "No new advances from other funders", hint: "Checked by Stacking Watch" },
  funnelTitle: "How the rules narrow it down",
  funnelHint: "Live, as you move the sliders",
};

export const readyPanel = {
  title: "Ready with these rules",
  of: (ready: number, pool: number) => `${ready} of ${pool} merchants who are at least 30% repaid`,
  ready: "Ready",
  listSize: 8,
  change: {
    same: "Same as your current rules.",
    more: (n: number) => `${n} more than today. Check their late-payment risk before saving.`,
    fewer: (n: number) => `${n} fewer than today. Safer, but fewer renewals.`,
  },
};

export const offered = {
  title: "What they're offered",
  subtitle: "The starting point for every renewal offer",
  link: { label: "Pricing settings", href: "/settings/pricing" },
};

export const approval = {
  auto: {
    title: "Approve automatically",
    text: "Clean renewals skip the queue",
    aria: "Approve renewals automatically",
    capLabel: "Up to",
    capHint: "Only when every rule passes and no new alerts appear",
    cap: { min: 10, max: 80, step: 5, start: 50 },
    note: (n: number, ready: number) => `About ${n} of today’s ${ready} would go straight to an offer`,
    off: "Every renewal goes to an underwriter",
  },
  checks: {
    title: "Checked again first",
    text: "Before any renewal offer goes out",
    items: [
      { title: "Fresh bank data", hint: "Last 30 days of activity" },
      { title: "Stacking and filings", hint: "New UCCs, funder debits, inquiries" },
      { title: "Business still active", hint: "State registry" },
      { title: "Credit refreshed", hint: "If older than 6 months" },
    ],
  },
  limits: {
    title: "Limits",
    text: "Healthy renewals for the merchant",
    rows: [
      { label: "Offer valid for", value: "7 days" },
      { label: "Time between renewals", value: "90+ days" },
      { label: "Renewals in a row", value: "Review after 3" },
      { label: "New cash to merchant", value: "At least 30%" },
    ],
  },
};

export const reachOut = {
  title: "When to reach out",
  subtitle: "Each step fires when the merchant has repaid this much of the advance",
  add: "+ Add step",
  trackLabel: "Outreach at 40, 50, 65 and 90 percent repaid",
  ends: { start: "Funded", line: "Renewal line, 50%", end: "Paid off" },
  /** the renewal line on the track, % repaid */
  line: 50,
  steps: [
    { at: 40, title: "Heads-up that renewal is coming", who: "Broker", via: "By email", on: true },
    { at: 50, title: "Pre-approved offer, one tap to accept", who: "Merchant", via: "Email and text", on: true },
    { at: 65, title: "Personal call if no reply", who: "Underwriter", via: "Task in Cevrynt", on: true },
    { at: 90, title: "Last chance before the advance ends", who: "Merchant", via: "By email", on: true },
  ],
};

export const neverOffer = {
  title: "Never offer a renewal when",
  subtitle: "These always win over the rules above",
  items: [
    { title: "A stacking alert is open", hint: "Until someone reviews it" },
    { title: "On a payment plan", hint: "Or in collections" },
    { title: "A reconciliation is pending", hint: "Sales dropped recently" },
  ],
};
