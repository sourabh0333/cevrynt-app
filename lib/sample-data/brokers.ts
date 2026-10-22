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

/** "$1.06M" → 1060, "$390K" → 390, for sorting by funded volume */
export const volumeNumber = (v: string) => parseFloat(v.replace(/[$MK,]/g, "")) * (v.includes("M") ? 1000 : 1);
