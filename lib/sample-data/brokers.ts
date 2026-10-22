/**
 * Sample data for the Brokers page, copied from
 * design/prototypes/Brokers.dc.html (look: design/Brokers.html).
 * Real API calls replace this later behind the same types.
 */

export const brokersHeader = {
  title: "Brokers",
  line: "24 active brokers · 1 on watch",
};

export type SummaryTone = "mint" | "grey" | "cream" | "red";

export const brokerSummary: { label: string; value: string; note: string; tone: SummaryTone }[] = [
  { label: "Funded through brokers", value: "$1.9M", note: "This quarter · 82% of all funding", tone: "mint" },
  { label: "Average fund rate", value: "31%", note: "Submissions that get funded", tone: "grey" },
  { label: "Complete on first send", value: "68%", note: "No stips needed at intake", tone: "grey" },
  { label: "Commission owed", value: "$14.2K", note: "Paid every Friday", tone: "cream" },
  { label: "On watch", value: "1", note: "Rising fraud flags", tone: "red" },
];

export type BrokerSort = "score" | "vol" | "flags";
/** the note box tone: g good (mint), n neutral (grey), r risk (red) */
export type BrokerTone = "g" | "n" | "r";

export type Broker = {
  ini: string;
  name: string;
  contact: string;
  /** the two stops of the avatar gradient */
  g: [string, string];
  score: number;
  sent: number;
  funded: number;
  complete: number;
  flags: number;
  vol: string;
  late: number;
  reply: string;
  points: string;
  owed: string;
  weeks: number[];
  why: [string, number][];
  rights: string;
  note: string;
  t: BrokerTone;
};

export const scorecards = {
  title: "Broker scorecards",
  subtitle: "Last 90 days · click a broker for detail",
  sortLabel: "Sort by",
  sorts: [
    { key: "score", label: "Score" },
    { key: "vol", label: "Funded" },
    { key: "flags", label: "Flags" },
  ] as { key: BrokerSort; label: string }[],
  columns: ["Broker", "Score", "Fund rate", "Complete", "Fraud flags", "Funded"],
  startSelected: "BR",
};

export const profile = {
  tiles: { score: "Score", late: "Paid late", reply: "Stip reply" },
  weeks: "Submissions per week",
  weeksLabel: (name: string) => `Submissions per week for ${name} over the last 8 weeks`,
  why: "Why their deals don't fund",
  commission: "Commission",
  owed: "Owed now",
  rights: "Renewal rights",
  message: "Message broker",
  pause: "Pause",
  resume: "Resume",
};

export const tierLabel = { top: "Top partner", good: "Good standing", watch: "On watch", paused: "Paused" };

export const brokers: Broker[] = [
  { ini: "AP", why: [["Revenue too low", 3], ["Too many positions", 2], ["Merchant took another offer", 4]], rights: "Keeps renewals for 12 months", g: ["#24588A", "#4F86BD"], name: "Apex Funding Partners", contact: "Dana Ruiz · dana@apexfunding.co", score: 93, sent: 71, funded: 27, complete: 84, flags: 0, vol: "$1.06M", late: 2.1, reply: "3h", points: "8 pts, 5 on renewals", owed: "$7,400", weeks: [6, 7, 5, 8, 7, 9, 8, 9], note: "Your best partner. Clean files, fast replies, merchants pay well.", t: "g" },
  { ini: "SC", why: [["Revenue too low", 6], ["Too many positions", 5], ["Missing documents", 4]], rights: "Keeps renewals for 12 months", g: ["#0A5E50", "#2F8F7A"], name: "Summit Capital ISO", contact: "Owen Hart · owen@summitiso.com", score: 81, sent: 58, funded: 17, complete: 71, flags: 1, vol: "$520K", late: 4.8, reply: "9h", points: "8 pts", owed: "$4,600", weeks: [5, 6, 6, 4, 5, 6, 7, 6], note: "Solid volume. One flagged file this quarter, explained and closed.", t: "n" },
  { ini: "KB", why: [["Revenue too low", 4], ["Merchant took another offer", 3], ["Missing documents", 2]], rights: "Keeps renewals for 12 months", g: ["#7A4A2A", "#B07A52"], name: "Keystone Brokerage", contact: "Lena Cho · lena@keystonebrokerage.com", score: 84, sent: 36, funded: 12, complete: 78, flags: 0, vol: "$390K", late: 3.2, reply: "6h", points: "7 pts", owed: "$2,200", weeks: [3, 4, 3, 4, 5, 4, 4, 5], note: "Smaller but steady. Good candidate for more volume.", t: "g" },
  { ini: "HL", why: [["Missing documents", 9], ["Revenue too low", 5], ["Too many positions", 3]], rights: "Keeps renewals for 6 months", g: ["#57418A", "#8670B8"], name: "Harbor Lane Capital", contact: "Marcus Webb · marcus@harborlane.co", score: 76, sent: 29, funded: 7, complete: 62, flags: 0, vol: "$210K", late: 5.5, reply: "14h", points: "8 pts", owed: "$0", weeks: [2, 3, 4, 3, 3, 4, 2, 3], note: "Files often arrive incomplete. Portal invite could help.", t: "n" },
  { ini: "BR", why: [["Fraud or edited statements", 3], ["Too many positions", 14], ["Missing documents", 12]], rights: "None while on watch", g: ["#A3341F", "#C2412D"], name: "BlueRock Advisors", contact: "Tyler Moss · tyler@bluerockadv.com", score: 54, sent: 45, funded: 6, complete: 49, flags: 3, vol: "$180K", late: 11.2, reply: "22h", points: "8 pts", owed: "$0", weeks: [3, 4, 5, 6, 6, 7, 8, 9], note: "Three fraud flags in 90 days, including Mesa Auto Repair and Sunrise Pediatric Dental. Volume is rising while quality falls.", t: "r" },
  { ini: "GP", why: [["Revenue too low", 5], ["Missing documents", 4], ["Too young a business", 2]], rights: "Keeps renewals for 6 months", g: ["#3E4A46", "#6B7873"], name: "Granite Peak ISO", contact: "Ava Lind · ava@granitepeak.io", score: 70, sent: 18, funded: 5, complete: 66, flags: 0, vol: "$150K", late: 6.0, reply: "11h", points: "8 pts", owed: "$0", weeks: [1, 2, 2, 3, 2, 2, 3, 3], note: "New this year. Reasonable start; check again next quarter.", t: "n" },
];

export const ownership = {
  title: "Same merchant, two brokers",
  subtitle: "Your rule: the first complete file owns the deal for 30 days",
  chip: "2 this week",
  winnerChip: "Owns the deal",
  vs: "vs",
  cases: [
    { merchant: "Riverbend Landscaping", winner: { name: "Summit Capital ISO", sub: "Complete at 10:42" }, other: { name: "Harbor Lane Capital", tag: "Told politely", sub: "Sent 12:30" } },
    { merchant: "Northgate Fitness", winner: { name: "Granite Peak ISO", sub: "Complete at 11:15" }, other: { name: "BlueRock Advisors", tag: "Incomplete", sub: "Missing statements" } },
  ],
};

export const payout = {
  title: "Payout · Fri Oct 16",
  chip: "Ready",
  amount: "$14,200",
  sub: "to 3 brokers by ACH",
  lines: [
    { label: "Commission, 7 deals", value: "15,400.00" },
    { label: "Clawback, early default", value: "−1,200.00", clawback: true },
  ] as { label: string; value: string; clawback?: boolean }[],
  net: { label: "Net", value: "14,200.00" },
  cta: "Review statements",
};

export type CheckState = "ok" | "wait" | "bad";
export type ApplicantResult = "approve" | "waiting" | "decline";

export const applicants = {
  title: "Brokers asking to join",
  subtitle: "Three checks before anyone can send you deals",
  chip: "3 applications",
  columns: ["Applicant", "Background", "Registered", "References", "Result"],
  checkLabel: { ok: "Passed", wait: "Waiting", bad: "Problem found" } as Record<CheckState, string>,
  resultLabel: { approve: "Approve", waiting: "Waiting", decline: "Decline" } as Record<ApplicantResult, string>,
  rows: [
    { name: "Coastline Business Funding", sub: "Applied Oct 6", checks: ["ok", "ok", "ok"], result: "approve" },
    { name: "Metro Merchant Partners", sub: "Applied Oct 9", checks: ["ok", "wait", "ok"], result: "waiting" },
    { name: "QuickCap Advisors", sub: "Owner linked to a blocked broker", checks: ["bad", "ok", "wait"], result: "decline" },
  ] as { name: string; sub: string; checks: [CheckState, CheckState, CheckState]; result: ApplicantResult }[],
};

export const paperwork = {
  title: "Paperwork on file",
  chip: "2 to fix",
  items: [
    { label: "Broker agreement", have: 24, total: 24 },
    { label: "Tax form W-9", have: 24, total: 24 },
    { label: "State registration", have: 22, total: 24 },
  ],
  note: "Some states now require broker registration, for example Texas from Dec 31, 2026.",
};

export const appetite = {
  chip: "Sent to brokers every Monday",
  title: "What we fund this week",
  text: "Built from your policy, so brokers send deals you can say yes to.",
  industries: [
    { name: "Restaurants", out: false },
    { name: "Dental", out: false },
    { name: "Trades", out: false },
    { name: "Trucking", out: true },
  ],
  /** left / right are the gaps at each end of the range bar, in % */
  ranges: [
    { label: "Amount", value: "$10K – $150K", left: 5, right: 25 },
    { label: "Monthly revenue", value: "$15K and up", left: 15, right: 0 },
  ],
  facts: [
    { label: "In business", value: "6 months+" },
    { label: "Open positions", value: "Up to 2" },
  ],
};

export const portal = {
  title: "Broker portal",
  chip: "Coming soon",
  text: "Brokers will submit deals, answer stips and see status themselves, instead of emailing your team.",
  items: ["Live status on every deal they sent", "Upload stips straight into the deal", "Their own scorecard and payouts"],
  cta: { label: "Join early access", href: "/whats-coming" },
};

/** "$1.06M" → 1060, "$390K" → 390, for sorting by funded volume */
export const volumeNumber = (v: string) => parseFloat(v.replace(/[$MK,]/g, "")) * (v.includes("M") ? 1000 : 1);
