/**
 * Sample data for the Renewals page, copied from
 * design/prototypes/Renewals.dc.html (look: design/Renewals.html).
 * Renewal figures come from renewalOffer in lib/offer-math.ts. The loyalty
 * price and broker points are Pricing's (getPricing), passed in by the page.
 */
import { defaultRenewalRules as rules } from "@/lib/renewal-rules";

export const renewalsHeader = {
  title: "Renewals",
  line: "9 merchants ready · offer before they finish paying",
};

export const hero = {
  title: "New funding waiting in renewals",
  value: "$402K",
  text: "9 merchants are ready. Renewing now keeps them before another funder does.",
  chartLabel: "Renewals funded per month, rising from $96K in May to $212K in October",
  /** points on the 300×70 chart from the design */
  points: [
    [4, 62],
    [62, 54],
    [120, 48],
    [178, 36],
    [236, 28],
    [296, 12],
  ] as [number, number][],
  caption: "Renewals funded per month, May to October",
  journey: {
    title: "The renewal journey",
    note: "This quarter · 6 renewed this month",
    steps: [
      { n: "01", count: "12", label: "Coming up", tone: "dashed", flex: 12 },
      { n: "02", count: "9", label: "Ready · $402K", tone: "now", flex: 9 },
      { n: "03", count: "sent", label: "Offer sent", tone: "plain", flex: 3 },
      { n: "04", count: "2", label: "Accepted · $130K", tone: "plain", flex: 2 },
      { n: "05", count: "14", label: "Renewed · $812K", tone: "done", flex: 14 },
    ] as { n: string; count: string; label: string; tone: "dashed" | "now" | "plain" | "done"; flex: number }[],
    /** offers already sent before the page opened */
    sentBase: 3,
  },
};

export type RenewalStatus = "ready" | "sent" | "accepted" | "soon";

export type RenewalMerchant = {
  ini: string;
  g: [string, string];
  name: string;
  industry: string;
  broker: string;
  score: number;
  paid: number;
  /** revenue change since funding, percent */
  rev: number;
  /** suggested renewal; 0 when not ready */
  suggested: number;
  max: number;
  /** left to collect on the current advance */
  left: number;
  /** the factor a new customer would get; the loyalty price is 0.04 lower */
  baseFactor: number;
  /** today's daily payment */
  now: number;
  status: RenewalStatus;
};

/** the current advances were priced at 1.30 */
export const currentFactor = 1.3;

export const statusLabel: Record<RenewalStatus, string> = { ready: "Ready", sent: "Offer sent", accepted: "Accepted", soon: "Not yet" };

export const radar = {
  title: "Renewal radar",
  subtitle: "How much they've repaid, against how their business is doing. Bigger dot, bigger renewal. Click one.",
  legend: [
    { label: "Ready", dot: "bg-teal" },
    { label: "Offer sent", dot: "bg-blue" },
    { label: "Accepted", dot: "bg-mint" },
  ],
  yAxis: "Revenue since funding →",
  quadrants: {
    nurture: { title: "Growing, not ready yet", sub: "Nurture" },
    renew: { title: "Renew now", sub: "Paid half or more, revenue up" },
    early: { title: "Too early" },
    soft: { title: "Paid enough, revenue soft", sub: "Smaller renewal or wait" },
  },
  xAxis: ["30% repaid", "50%, renewal line", "Repaid →  90%"],
  dotLabel: (m: RenewalMerchant) => `${m.name}, ${m.paid}% repaid, revenue ${m.rev}%`,
  startSelected: "HB",
};

export const offerPanel = {
  stats: { repaid: "Repaid", revenue: "Revenue", score: "Score" },
  amount: { label: "Renewal amount", upTo: (max: string) => `up to ${max}`, notYet: "Not yet", step: 5000, min: 10000 },
  split: { paysOff: (left: string) => `Pays off ${left}`, newCash: (cash: string) => `${cash} new cash` },
  factor: { label: "Loyalty factor" },
  daily: { label: (now: string) => `Daily, was ${now}` },
  checks: ["✓ Fresh bank data", "✓ Stacking check", "✓ Registry active"],
  disclosure: {
    title: "Renewal disclosure",
    shown: "Shown to the merchant",
    payout: "Payout reduced to clear balance",
    fees: "Includes unpaid fees from the last advance?",
    yes: (fee: string) => `Yes, ${fee}`,
    no: "No",
    forgive: { label: "Forgive the unearned fee", note: "Loyal merchants don't pay twice" },
  },
  send: { ready: "Send renewal offer", sent: "Offer sent", accepted: "Accepted, in funding", soon: "Not ready yet" } as Record<RenewalStatus, string>,
  foot: "Built from fresh bank data. No new application needed.",
};

export const readyCards = {
  title: "Ready to renew",
  subtitle: "Best first",
  action: "Send all to brokers",
  suggested: "Suggested",
  revenue: (rev: number) => `${rev >= 0 ? "+" : "−"}${Math.abs(rev)}% revenue`,
};

export const outreach = {
  title: "Automatic outreach",
  subtitle: "Messages go out by themselves as merchants repay. You step in when they reply.",
  chip: "On",
  steps: [
    { at: "40%", via: "Broker", title: "Heads-up to broker", note: "“Your merchant is close to renewal”" },
    { at: "50%", via: "Email + text", title: "Pre-approved offer", note: "Amount ready, one tap to accept", key: true },
    { at: "65%", via: "Underwriter", title: "Personal call", note: "If they haven't answered yet" },
    { at: "90%", via: "Email", title: "Last chance", note: "Before the advance ends" },
  ] as { at: string; via: string; title: string; note: string; key?: boolean }[],
  results: [
    { label: "Sent this month", value: "64" },
    { label: "Merchants replied", value: "41%" },
    { label: "Became renewals", value: "6", good: true },
  ] as { label: string; value: string; good?: boolean }[],
};

export const brokerPay = {
  title: "Broker pay on renewals",
  subtitle: "Set once, applied to every renewal",
  /** Pricing's broker points; a renewal that comes direct pays no broker. */
  rows: (points: { newDeal: number; renewal: number }) => [
    { label: "New deal", value: `${points.newDeal} pts` },
    { label: "Renewal, same broker", value: `${points.renewal} pts` },
    { label: "Renewal, direct to you", value: "0 pts" },
  ],
  saved: { before: "Saved ", amount: "$9,600", after: " in commission this quarter on renewals" },
};

export const readyRules = {
  title: "Who counts as ready",
  subtitle: "All four must be true",
  link: { label: "Edit rules", href: "/settings/renewals" },
  rules: [
    // The same saved rules Settings › Renewal rules edits (lib/renewal-rules.ts).
    { label: "Repaid at least", value: `${rules.paid}%` },
    { label: `Returned payments in ${rules.ret} days`, value: "0" },
    { label: "Revenue vs at funding", value: `${rules.rev}%` },
    { label: "New advances elsewhere", value: "0" },
  ],
  loyalty: { label: "Loyalty price", value: (discount: number) => `−${discount.toFixed(2)} factor` },
};

export const atRisk = {
  title: "Might go elsewhere",
  subtitle: "Spotted by Stacking Watch",
  total: "$150K",
  totalLabel: "at risk",
  barLabel: "Value at risk: Pine Ridge 70K, Harborview 55K, Lighthouse 25K",
  merchants: [
    { name: "Pine Ridge Vet Clinic", sign: "Another funder checked their credit", likelihood: 80, when: "act today", amount: "$70K", k: 70, tone: "red", icon: "card" },
    { name: "Harborview Bistro", sign: "Broker asked for a payoff letter", likelihood: 60, when: "this week", amount: "$55K", k: 55, tone: "amber", icon: "doc" },
    { name: "Lighthouse Coffee Co", sign: "Opened a competitor's offer", likelihood: 45, when: "this week", amount: "$25K", k: 25, tone: "soft", icon: "eye" },
  ] as { name: string; sign: string; likelihood: number; when: string; amount: string; k: number; tone: "red" | "amber" | "soft"; icon: "card" | "doc" | "eye" }[],
};

export const comingUp = {
  title: "Coming up",
  subtitle: "Reaching the 50% line in 30 days",
  count: "12",
  merchants: [
    { name: "Seaside Yoga Studio", when: "Oct 21", percent: 90 },
    { name: "Maple St Barbers", when: "Oct 28", percent: 84 },
    { name: "Bayside Hardware", when: "Nov 4", percent: 78 },
    { name: "Kestrel Plumbing", when: "Paying slowly", percent: 70, slow: true },
  ] as { name: string; when: string; percent: number; slow?: boolean }[],
  link: { label: "See all 12", href: "#" },
};

export const renewalMerchants: RenewalMerchant[] = [
  { ini: "HB", g: ["#0A5E50", "#2F8F7A"], name: "Harborview Bistro", industry: "Restaurant", broker: "Apex Funding", score: 94, paid: 81, rev: 9, suggested: 55000, max: 65000, left: 9900, baseFactor: 1.32, now: 410, status: "ready" },
  { ini: "PR", g: ["#24588A", "#4F86BD"], name: "Pine Ridge Vet Clinic", industry: "Veterinary", broker: "Summit Capital", score: 92, paid: 58, rev: 12, suggested: 70000, max: 80000, left: 27300, baseFactor: 1.32, now: 520, status: "ready" },
  { ini: "CD", g: ["#24588A", "#4F86BD"], name: "Coastal Dental Group", industry: "Dental", broker: "Apex Funding", score: 92, paid: 72, rev: 18, suggested: 80000, max: 90000, left: 25500, baseFactor: 1.3, now: 430, status: "accepted" },
  { ini: "LC", g: ["#8A5A2B", "#B98552"], name: "Lighthouse Coffee Co", industry: "Café", broker: "Keystone", score: 88, paid: 67, rev: 6, suggested: 25000, max: 30000, left: 8700, baseFactor: 1.34, now: 215, status: "ready" },
  { ini: "OD", g: ["#8A5A2B", "#B98552"], name: "Oakview Deli", industry: "Deli", broker: "Apex Funding", score: 88, paid: 64, rev: 4, suggested: 35000, max: 40000, left: 14300, baseFactor: 1.32, now: 305, status: "sent" },
  { ini: "NF", g: ["#57418A", "#8670B8"], name: "Northgate Fitness", industry: "Gym", broker: "BlueRock", score: 81, paid: 55, rev: 3, suggested: 30000, max: 35000, left: 15800, baseFactor: 1.34, now: 280, status: "ready" },
  { ini: "BB", g: ["#7A4A2A", "#B07A52"], name: "Bluebird Bakery", industry: "Bakery", broker: "Apex Funding", score: 76, paid: 52, rev: -2, suggested: 20000, max: 22000, left: 12900, baseFactor: 1.36, now: 190, status: "ready" },
  { ini: "SY", g: ["#3E4A46", "#6B7873"], name: "Seaside Yoga Studio", industry: "Fitness", broker: "Keystone", score: 85, paid: 45, rev: 7, suggested: 20000, max: 25000, left: 16000, baseFactor: 1.34, now: 180, status: "soon" },
  { ini: "KP", g: ["#2C5F73", "#5A90A6"], name: "Kestrel Plumbing", industry: "Plumbing", broker: "Keystone", score: 61, paid: 48, rev: -22, suggested: 0, max: 0, left: 31200, baseFactor: 1.37, now: 412, status: "soon" },
];

/** Where a merchant sits on the radar: x by share repaid (30–90%), y by revenue change (±20%). */
export const radarPosition = (m: RenewalMerchant) => ({
  x: Math.max(4, Math.min(96, ((m.paid - 30) / 60) * 100)),
  y: Math.max(6, Math.min(94, 50 - (m.rev / 20) * 44)),
});

/** Dot size grows with the renewal amount; merchants with no renewal get the small dot. */
export const radarSize = (m: RenewalMerchant, amount: number) => (m.suggested ? Math.round(30 + (amount / 90000) * 36) : 26);
