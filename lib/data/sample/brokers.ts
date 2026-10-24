import type { Broker, BrokerBook } from "@/lib/data/types";

/**
 * Sample brokers, copied from design/prototypes/Brokers.dc.html (look:
 * design/Brokers.html). Fraud flags come from Stacking Watch's alerts on
 * each broker's deals and advances; commission owed adds today's funded
 * deals at Pricing's points. Pages get these through lib/data/brokers.
 */

const at = (date: string, time = "12:00") => `${date}T${time}:00-04:00`;

export const brokers: Broker[] = [
  {
    id: "br-apex", name: "Apex Funding Partners", shortName: "Apex Funding", initials: "AP", colors: ["#24588A", "#4F86BD"],
    contact: { name: "Dana Ruiz", email: "dana@apexfunding.co" }, score: 93, submitted: 71, funded: 27, fundedVolume: 1_060_000,
    completeFirstSend: 0.84, paidLate: 0.021, stipReplyHours: 3, commission: { newDealPoints: null, onRenewals: true }, renewalRightsMonths: 12,
    weeklySubmissions: [6, 7, 5, 8, 7, 9, 8, 9],
    declineReasons: [{ reason: "Revenue too low", count: 3 }, { reason: "Too many positions", count: 2 }, { reason: "Merchant took another offer", count: 4 }],
    note: { text: "Your best partner. Clean files, fast replies, merchants pay well.", tone: "good" }, earned: { deals: 1, amount: 2600 },
  },
  {
    id: "br-summit", name: "Summit Capital ISO", shortName: "Summit Capital", initials: "SC", colors: ["#0A5E50", "#2F8F7A"],
    contact: { name: "Owen Hart", email: "owen@summitiso.com" }, score: 81, submitted: 58, funded: 17, fundedVolume: 520_000,
    completeFirstSend: 0.71, paidLate: 0.048, stipReplyHours: 9, commission: { newDealPoints: null, onRenewals: false }, renewalRightsMonths: 12,
    weeklySubmissions: [5, 6, 6, 4, 5, 6, 7, 6],
    declineReasons: [{ reason: "Revenue too low", count: 6 }, { reason: "Too many positions", count: 5 }, { reason: "Missing documents", count: 4 }],
    note: { text: "Solid volume. One flagged file this quarter, explained and closed.", tone: "neutral" }, earned: { deals: 1, amount: 2600 },
  },
  {
    id: "br-keystone", name: "Keystone Brokerage", shortName: "Keystone", initials: "KB", colors: ["#7A4A2A", "#B07A52"],
    contact: { name: "Lena Cho", email: "lena@keystonebrokerage.com" }, score: 84, submitted: 36, funded: 12, fundedVolume: 390_000,
    completeFirstSend: 0.78, paidLate: 0.032, stipReplyHours: 6, commission: { newDealPoints: 7, onRenewals: false }, renewalRightsMonths: 12,
    weeklySubmissions: [3, 4, 3, 4, 5, 4, 4, 5],
    declineReasons: [{ reason: "Revenue too low", count: 4 }, { reason: "Merchant took another offer", count: 3 }, { reason: "Missing documents", count: 2 }],
    note: { text: "Smaller but steady. Good candidate for more volume.", tone: "good" }, earned: { deals: 2, amount: 2200 },
  },
  {
    id: "br-harborlane", name: "Harbor Lane Capital", shortName: "Harbor Lane", initials: "HL", colors: ["#57418A", "#8670B8"],
    contact: { name: "Marcus Webb", email: "marcus@harborlane.co" }, score: 76, submitted: 29, funded: 7, fundedVolume: 210_000,
    completeFirstSend: 0.62, paidLate: 0.055, stipReplyHours: 14, commission: { newDealPoints: null, onRenewals: false }, renewalRightsMonths: 6,
    weeklySubmissions: [2, 3, 4, 3, 3, 4, 2, 3],
    declineReasons: [{ reason: "Missing documents", count: 9 }, { reason: "Revenue too low", count: 5 }, { reason: "Too many positions", count: 3 }],
    note: { text: "Files often arrive incomplete. Portal invite could help.", tone: "neutral" }, earned: { deals: 0, amount: 0 },
  },
  {
    id: "br-bluerock", name: "BlueRock Advisors", shortName: "BlueRock", initials: "BR", colors: ["#A3341F", "#C2412D"],
    contact: { name: "Tyler Moss", email: "tyler@bluerockadv.com" }, score: 54, submitted: 45, funded: 6, fundedVolume: 180_000,
    completeFirstSend: 0.49, paidLate: 0.112, stipReplyHours: 22, commission: { newDealPoints: null, onRenewals: false }, renewalRightsMonths: null,
    weeklySubmissions: [3, 4, 5, 6, 6, 7, 8, 9],
    declineReasons: [{ reason: "Fraud or edited statements", count: 3, fraud: true }, { reason: "Too many positions", count: 14 }, { reason: "Missing documents", count: 12 }],
    note: { text: "Three fraud flags in 90 days, including Mesa Auto Repair and Sunrise Pediatric Dental. Volume is rising while quality falls.", tone: "risk" },
    earned: { deals: 1, amount: 1200 },
  },
  {
    id: "br-granitepeak", name: "Granite Peak ISO", shortName: "Granite Peak", initials: "GP", colors: ["#3E4A46", "#6B7873"],
    contact: { name: "Ava Lind", email: "ava@granitepeak.io" }, score: 70, submitted: 18, funded: 5, fundedVolume: 150_000,
    completeFirstSend: 0.66, paidLate: 0.06, stipReplyHours: 11, commission: { newDealPoints: null, onRenewals: false }, renewalRightsMonths: 6,
    weeklySubmissions: [1, 2, 2, 3, 2, 2, 3, 3],
    declineReasons: [{ reason: "Revenue too low", count: 5 }, { reason: "Missing documents", count: 4 }, { reason: "Too young a business", count: 2 }],
    note: { text: "New this year. Reasonable start; check again next quarter.", tone: "neutral" }, earned: { deals: 0, amount: 0 },
  },
];

export const brokerBook: BrokerBook = {
  active: 24,
  fundedThroughBrokers: 1_900_000,
  shareOfFunding: 0.82,
  avgFundRate: 0.31,
  completeFirstSend: 0.68,
  clawbacks: [{ brokerId: "br-bluerock", amount: 1200, reason: "early default" }],
  payoutWeekday: 5,
  ownership: [
    {
      merchant: "Riverbend Landscaping",
      winner: { brokerId: "br-summit", completeAt: at("2026-10-12", "10:42") },
      other: { brokerId: "br-harborlane", outcome: "told", sentAt: at("2026-10-12", "12:30") },
    },
    {
      merchant: "Northgate Fitness",
      winner: { brokerId: "br-granitepeak", completeAt: at("2026-10-12", "11:15") },
      other: { brokerId: "br-bluerock", outcome: "incomplete", missing: "statements" },
    },
  ],
  applicants: [
    { name: "Coastline Business Funding", note: { appliedAt: at("2026-10-06") }, checks: ["ok", "ok", "ok"], result: "approve" },
    { name: "Metro Merchant Partners", note: { appliedAt: at("2026-10-09") }, checks: ["ok", "wait", "ok"], result: "waiting" },
    { name: "QuickCap Advisors", note: { text: "Owner linked to a blocked broker" }, checks: ["bad", "ok", "wait"], result: "decline" },
  ],
  paperwork: [
    { label: "Broker agreement", have: 24 },
    { label: "Tax form W-9", have: 24 },
    { label: "State registration", have: 22 },
  ],
  appetiteIndustries: ["Restaurants", "Dental", "Trades", "Trucking"],
};
