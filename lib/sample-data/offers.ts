/**
 * Sample data for the Offers & funding page, copied from
 * design/prototypes/Offers.dc.html (look: design/Offers.html).
 * Real API calls replace this later behind the same types.
 */

export const offersHeader = {
  title: "Offers & funding",
  line: "14 deals between yes and money sent · 2 offers expire today",
};

export type StatTone = "mint" | "cream" | "grey" | "stone" | "mintLight";

export const offerStats: {
  label: string;
  value: string;
  unit?: string;
  note: string;
  tone: StatTone;
  noteTone?: "good" | "warn";
  bar?: number;
}[] = [
  { label: "Ready to fund", value: "$85K", note: "2 deals · next ACH cut-off 2:00 pm", tone: "mint" },
  { label: "Offers out", value: "6", note: "2 expire today", tone: "cream", noteTone: "warn" },
  { label: "Contracts out", value: "4", note: "Waiting on signatures", tone: "grey" },
  { label: "Offer to funded", value: "2.6", unit: " days", note: "Median, last 30 days", tone: "stone" },
  { label: "Capital left today", value: "$1.1M", note: "of a $1.5M daily limit", tone: "grey", bar: 73 },
  { label: "Funded this month", value: "$1.24M", note: "+12% vs September", tone: "mintLight", noteTone: "good" },
];

export type StageKey = "sent" | "acc" | "contract" | "checks" | "funded";
export type ChipTone = "red" | "amber" | "blue" | "green" | "grey";

export type PipelineDeal = {
  name: string;
  ini: string;
  /** avatar gradient, two stops */
  g: [string, string];
  broker: string;
  /** thousands, for the stage total */
  amtK: number;
  note: string;
  tone: ChipTone;
  mine: boolean;
};

export type Stage = {
  key: StageKey;
  title: string;
  /** colour token name for the dot, ring and bar */
  color: "amber" | "blue" | "purple" | "teal" | "teal-ink";
  /** deals in the stage; the list shows the first few */
  total: number;
  hint: string;
  action: string;
  cards: PipelineDeal[];
};

export const pipeline = {
  title: "From offer to funded",
  subtitle: "Every approved deal, by where it is now",
  search: { label: "Search offers", placeholder: "Merchant or broker" },
  views: [
    { key: "all", label: "Everyone" },
    { key: "mine", label: "Mine" },
  ] as { key: "all" | "mine"; label: string }[],
  /** the stage bar is a share of the largest stage */
  barOf: 6,
  more: (n: number) => `+ ${n} more · View all`,
  empty: "None of yours in this stage.",
  stages: [
    {
      key: "sent",
      title: "Offer sent",
      color: "amber",
      total: 6,
      hint: "Waiting for the merchant to accept",
      action: "Nudge broker",
      cards: [
        { name: "Northline HVAC Services", ini: "NH", g: ["#A85C0B", "#D98A2B"], broker: "Summit Capital ISO", amtK: 95, note: "Expires 5 pm", tone: "red", mine: true },
        { name: "Pinecrest Fitness Studio", ini: "PF", g: ["#6B4FA0", "#9C86C9"], broker: "Keystone Brokerage", amtK: 55, note: "Expires 6 pm", tone: "red", mine: false },
        { name: "Tri-State Plumbing Co", ini: "TP", g: ["#2C5F73", "#5A90A6"], broker: "Keystone Brokerage", amtK: 110, note: "Countered", tone: "amber", mine: false },
      ],
    },
    {
      key: "acc",
      title: "Accepted",
      color: "blue",
      total: 3,
      hint: "Contract goes out next",
      action: "Send contract",
      cards: [
        { name: "Coastal Dental Group", ini: "CD", g: ["#24588A", "#4F86BD"], broker: "Apex Funding Partners", amtK: 80, note: "Renewal", tone: "blue", mine: true },
        { name: "Golden Gate Laundromat", ini: "GG", g: ["#4D6B2E", "#7FA05A"], broker: "BlueRock Advisors", amtK: 30, note: "Contract today", tone: "grey", mine: false },
      ],
    },
    {
      key: "contract",
      title: "Contract out",
      color: "purple",
      total: 4,
      hint: "Waiting for signatures",
      action: "Remind to sign",
      cards: [
        { name: "Summit Roofing LLC", ini: "SR", g: ["#7A4A2A", "#B07A52"], broker: "Apex Funding Partners", amtK: 90, note: "1 of 2 signed", tone: "amber", mine: true },
        { name: "Maple Leaf Dental", ini: "ML", g: ["#A3341F", "#D06A52"], broker: "Summit Capital ISO", amtK: 120, note: "Viewed, not signed", tone: "grey", mine: false },
      ],
    },
    {
      key: "checks",
      title: "Signed, final steps",
      color: "teal",
      total: 2,
      hint: "Last checks, then two-person release",
      action: "Go to funding",
      cards: [
        { name: "Copperline Electric", ini: "CE", g: ["#0E6B5C", "#3FA58C"], broker: "Apex Funding Partners", amtK: 45, note: "Ready to fund", tone: "green", mine: true },
        { name: "Old Mill Brewery", ini: "OM", g: ["#3E4A46", "#6B7873"], broker: "Summit Capital ISO", amtK: 40, note: "Ready to fund", tone: "green", mine: false },
      ],
    },
    {
      key: "funded",
      title: "Funded today",
      color: "teal-ink",
      total: 2,
      hint: "Money sent today",
      action: "View receipt",
      cards: [
        { name: "Bayview Nail Spa", ini: "BN", g: ["#57418A", "#8670B8"], broker: "Summit Capital ISO", amtK: 25, note: "Sent 9:15", tone: "green", mine: false },
        { name: "Cedar Street Pharmacy", ini: "CS", g: ["#0A5E50", "#2F8F7A"], broker: "Apex Funding Partners", amtK: 60, note: "Sent 11:02", tone: "green", mine: true },
      ],
    },
  ] as Stage[],
};

export type QueueDeal = {
  key: string;
  name: string;
  id: string;
  ini: string;
  g: [string, string];
  amount: number;
  net: number;
  netNote: string;
  bank: string;
  method: string;
  /** what the final check found */
  check: string;
  ok: boolean;
};

export const fundingQueue = {
  title: "Funding queue",
  subtitle: "Approved, signed and checked. Pick what to send.",
  cutoff: "ACH by 2:00 pm · wire by 4:00 pm",
  columns: ["", "Merchant", "Advance → they get", "Pays out to", "Status"],
  /** ticked when the page opens */
  start: ["a", "b"],
  deals: [
    { key: "a", name: "Copperline Electric", id: "APP-3CE8LQ", ini: "CE", g: ["#0E6B5C", "#3FA58C"], amount: 45000, net: 44100, netNote: "2% fee taken", bank: "Wells Fargo ••2210", method: "ACH, same day", check: "All clear", ok: true },
    { key: "b", name: "Old Mill Brewery", id: "APP-8OM2BW", ini: "OM", g: ["#3E4A46", "#6B7873"], amount: 40000, net: 30500, netNote: "$9,500 wired to the prior funder", bank: "TD Bank ••5530", method: "Wire, plus payoff wire", check: "All clear", ok: true },
    { key: "c", name: "Lakeshore Auto Body", id: "APP-6LA4AB", ini: "LA", g: ["#24588A", "#4F86BD"], amount: 60000, net: 60000, netNote: "No fee", bank: "Chase ••0918", method: "ACH, same day", check: "New UCC filing", ok: false },
  ] as QueueDeal[],
  status: { ready: "All clear · ready", pending: "Awaiting release", sent: "Sent", hold: (check: string) => `${check} · on hold` },
  summary: {
    caption: "Ready to send",
    selected: (n: number) => `${n} deals selected`,
    note: {
      ready: "A second person must release every payment. Undo within 5 minutes.",
      pending: "Waiting for a second person to release the money.",
      sent: "Released by Priya Shah. References appear in Money sent today.",
    },
    release: "Release as Priya",
    fund: (n: number) => `Fund ${n} deal${n === 1 ? "" : "s"}`,
    cancel: "Cancel",
    done: "Done",
    /** how long a release can be undone, in seconds */
    undoWindow: 5 * 60,
    undo: (clock: string) => `Undo · ${clock}`,
    closed: "Sent. References appear in Money sent today.",
  },
};
