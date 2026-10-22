/**
 * Sample data for What's coming, copied from design/prototypes/Coming.dc.html
 * (look: design/Coming.html). The stage counters, the header line and the
 * sidebar's "10 new" note are all counted from comingFeatures, so they can't
 * drift. No imports, so the sidebar can read it cheaply.
 */

export type Lane = "now" | "next" | "later";

export type ComingFeature = {
  id: string;
  lane: Lane;
  name: string;
  short: string;
  votes: number;
  /** % built, for the progress ring */
  prog: number;
  eta: string;
  long: string;
  why: string;
  points: string[];
};

export const comingFeatures: ComingFeature[] = [
  { id: "portal", lane: "next", name: "Broker portal", short: "Brokers see status and upload stips", votes: 38, prog: 20, eta: "Early 2027",
    long: "A private space for each broker: send deals, upload stips into the right deal, see live status and their own scorecard and payouts.",
    why: 'Underwriters lose hours answering "any update?" emails. Brokers want answers without waiting.',
    points: ["Live status on every deal they sent", "Stips land straight in the deal", "Their own scorecard and commission"] },
  { id: "mail", lane: "now", name: "Email forwarding", short: "Brokers email packages, deals appear", votes: 52, prog: 60, eta: "Next release",
    long: "Every funder gets its own forwarding address. Brokers send packages the way they already do, and each email becomes a checked deal in Submissions.",
    why: "Brokers already send deals by email. It’s the fastest way to start, with no change in their habits.",
    points: ["Your own address, with approved senders", "One email with several merchants becomes several deals", "Unknown senders held for review"] },
  { id: "forms", lane: "next", name: "Public forms", short: "A branded application link", votes: 31, prog: 25, eta: "Early 2027",
    long: "An online application on your own web address, for brokers or merchants applying directly, with the fit check running as soon as it’s sent.",
    why: "Direct merchants and smaller brokers need a simple way in without emailing files.",
    points: ["Your colors and logo", "Ask for statements and consents up front", "Put it on your website with one line of code"] },
  { id: "crm", lane: "next", name: "CRM, LOS and API", short: "Deals in from your CRM, decisions back", votes: 27, prog: 10, eta: "Mid 2027",
    long: "Connect the systems you already use, including MCA CRMs, so deals flow in and decisions, offers and funding updates flow back.",
    why: "Many funders run their deal flow in a CRM. Keeping both in sync avoids typing everything twice.",
    points: ["Two-way sync with your CRM", "Webhooks for your own systems", "Field matching you control"] },
  { id: "rec", lane: "now", name: "Reconciliation Desk", short: 'Handle "my sales dropped" requests properly', votes: 41, prog: 70, eta: "Early 2027",
    long: "When a merchant asks to pay less because sales fell, Cevrynt works out the fair new payment from fresh bank data, tracks your reply deadline and keeps the proof.",
    why: "Regulators have pushed funders to run a formal reconciliation process. Today most teams do it by email and spreadsheet.",
    points: ["See every request with its deadline", "Get the fair payment worked out for you", "Keep a record that you answered on time"] },
  { id: "ai", lane: "now", name: "AI decision log", short: "A clear record of every automatic suggestion", votes: 28, prog: 55, eta: "Before 2027",
    long: "Every suggestion Cevrynt makes, the data it used and what a person decided, in one report you can hand to an examiner. The audit log already records part of this.",
    why: "New state rules on automated decisions, such as Colorado’s, start applying in 2027.",
    points: ["Export one report per deal or per month", "See where people overrode a suggestion", "Show which rules drove each suggestion"] },
  { id: "call", lane: "next", name: "Funding-call assistant", short: "Records the funding call and flags mismatches", votes: 36, prog: 20, eta: "Mid 2027",
    long: "Cevrynt listens to the funding call (with consent), writes a summary and flags anything the merchant says that doesn’t match the application or statements.",
    why: "The funding call is the last chance to catch a problem, and today nothing checks it.",
    points: ["Auto summary saved to the deal", 'Flags like "says 1 advance, statements show 2"', "Marks the call done on Conditions"] },
  { id: "mob", lane: "next", name: "Mobile approvals", short: "Approve and release money from your phone", votes: 22, prog: 15, eta: "Mid 2027",
    long: "Seniors can approve big deals, waive conditions and release payments from their phone, with the same two-person rules.",
    why: "Deals stall when the one person who can approve is away from their desk.",
    points: ["Push alert when you are needed", "Face ID before releasing money", "Full deal summary on one screen"] },
  { id: "peer", lane: "later", name: "Peer benchmarks", short: "Compare a merchant with similar funded ones", votes: 19, prog: 5, eta: "Late 2027",
    long: "See how a bakery doing $60K a month usually performs, based on similar merchants in your own book.",
    why: "Underwriters judge each deal alone. Context from similar deals makes pricing sharper.",
    points: ["Typical revenue swings for the industry", "How similar deals paid back", "Suggested price range from your history"] },
  { id: "net", lane: "later", name: "Cross-funder network", short: "See stacking before any filing shows up", votes: 47, prog: 5, eta: "2028",
    long: "Funders who join share a private signal when the same merchant applies elsewhere, so stacking is caught the same week.",
    why: "Today stacking is usually found after the fact. No shared, real-time signal exists yet.",
    points: ["Alert when a merchant applies elsewhere", "Only a signal is shared, never the deal", "Join or leave at any time"] },
];

export const featureCount = comingFeatures.length;
export const laneCount = (lane: Lane) => comingFeatures.filter((f) => f.lane === lane).length;

export const lanes: { key: Lane; title: string; when: string }[] = [
  { key: "now", title: "Building now", when: "Building now · this quarter" },
  { key: "next", title: "Up next", when: "Up next · in the next 6 months" },
  { key: "later", title: "Later", when: "Later · next year" },
];

export const comingHeader = {
  title: "What's coming",
  line: `${featureCount} features in the works · shaped by funders like you`,
};

export const comingHero = {
  chip: "Roadmap · updated Oct 1",
  title: "Built for the gaps no one else fills",
  text: "Vote for what matters to you, and join early access to try features before everyone else.",
};

export const roadmap = {
  title: "Roadmap",
  stageLabel: "Stage",
  total: `${featureCount} features in total`,
  votes: (n: number) => `${n} votes from funders`,
  /** opened on the first feature being built */
  start: { stage: "now" as Lane, feature: "mail" },
  /** features already on the early access list */
  joined: ["rec"],
};

export const spotlight = {
  why: "Why it matters",
  can: "What you'll be able to do",
  vote: (n: number) => `▲ Vote · ${n}`,
  voted: (n: number) => `▲ Voted · ${n}`,
  join: "Join early access",
  joined: "On the early access list",
};

export const shipped = {
  title: "Recently shipped",
  text: "Already in your workspace",
  items: [
    { name: "Policy simulator", hint: "test rules on past deals", when: "Sep", href: "/settings/policy" },
    { name: "Renewal radar", hint: "see every renewal at a glance", when: "Sep", href: "/renewals" },
    { name: "Broker scorecards", hint: "quality, not just volume", when: "Aug", href: "/brokers" },
  ],
};

export const ideaBox = {
  title: "Have an idea?",
  text: "Tell us what slows your team down. We read every one.",
  label: "Your idea",
  placeholder: "e.g. Let brokers see the reason a deal was countered",
  send: "Send idea",
};
