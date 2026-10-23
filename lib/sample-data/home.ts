/**
 * Sample data for the Home page, copied from design/Main.html
 * (design/prototypes/Main.dc.html has no script, so the finished page is
 * the whole spec). Real API calls replace this later behind the same types.
 */
import type { ChipColor } from "@/components/ui/Chip";

export type HomeHeader = {
  greeting: string;
  queueLine: string;
  queueHref: string;
  searchPlaceholder: string;
  unreadNotifications: number;
};

export type GlanceTone = "red" | "white";
export type GlanceItem = {
  id: string;
  href: string;
  tone: GlanceTone;
  lead:
    | { kind: "number"; value: string }
    | { kind: "ring"; percent: number; label: string }
    | { kind: "tag"; value: string };
  title: string;
  note: string;
  /** optional emphasised tail on the note, e.g. "2 returned" */
  noteTail?: string;
};

export type HeroDeal = {
  id: string;
  href: string;
  merchant: string;
  requested: string;
  stage: string;
  stats: { label: string; value: string }[];
  /** 400 × 120 view box */
  chart: { line: string; area: string; dot: { x: number; y: number } };
};

export type DecisionSegment = {
  label: string;
  percent: number;
  color: "teal" | "amber" | "red";
};
export type Decisions = { total: number; segments: DecisionSegment[] };

export type QueueTone = "light" | "amber" | "blue" | "red" | "grey" | "purple";
export type QueueItem = {
  id: string;
  href: string;
  initials: string;
  tone: QueueTone;
  merchant: string;
  status: string;
  statusColor: ChipColor;
  amount: string;
  time: string;
  decided: boolean;
};
export type Queue = {
  onTimePercent: number;
  targetPercent: number;
  items: QueueItem[];
};

export type CalendarAvatar = { initials: string; fill: "sand" | "mint" };
export type CalendarEvent = {
  id: string;
  href: string;
  title: string;
  /** 1-based day column (Mon = 1) and how many days it spans */
  day: number;
  span: number;
  /** 1-based hour row (9:00 = 1) */
  hour: number;
  tone: "teal" | "amber" | "mint";
  avatars: CalendarAvatar[];
  /** stagger index for the entrance */
  order: number;
};
export type WeekCalendar = {
  title: string;
  days: { label: string; today?: boolean }[];
  hours: string[];
  now: { day: number; hour: number };
  events: CalendarEvent[];
};

export type KeyNumbers = {
  submissions: { value: string; change: string; changeNote: string; scale: [string, string, string] };
  offers: { value: string; expiring: string; expiringNote: string; href: string };
  stacking: { value: string; lead: string; leadNote: string; href: string };
  funded: { value: string; change: string; changeNote: string };
  renewals: {
    value: string;
    note: string;
    href: string;
    /** 220 × 180 view box */
    bars: { x: number; y: number; h: number }[];
    line: string;
    sun: { x: number; y: number; r: number };
  };
};

export type PipelineStage = {
  label: string;
  value: string;
  percent: number;
  note: string;
  color: "ink" | "teal" | "mint";
  final?: boolean;
};
export type Pipeline = {
  subtitle: string;
  ranges: { value: string; label: string }[];
  range: string;
  stages: PipelineStage[];
};

export type SpeedMetric = {
  label: string;
  aside: string;
  asideTone: "good" | "slow";
  value: string;
  bar?: number;
  note?: string;
};
export type Speed = { subtitle: string; metrics: SpeedMetric[] };

export type StipItem = {
  id: string;
  title: string;
  detail: string;
  status: string;
  statusColor: ChipColor;
};
export type Stips = { count: number; subtitle: string; items: StipItem[] };

export type BrokerRow = {
  id: string;
  href: string;
  name: string;
  sent: number;
  funded: number;
  flags: number;
};
export type Brokers = { subtitle: string; href: string; rows: BrokerRow[] };

export type ActivityKind = "stacking" | "check" | "upload" | "message";
export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  when: string;
};
export type Activity = { href: string; items: ActivityItem[] };

export type ComingSoon = { tag: string; title: string; text: string; href: string };

export type HomeData = {
  header: HomeHeader;
  hero: HeroDeal;
  decisions: Decisions;
  queue: Queue;
  calendar: WeekCalendar;
  glance: GlanceItem[];
  keyNumbers: KeyNumbers;
  pipeline: Pipeline;
  speed: Speed;
  stips: Stips;
  brokers: Brokers;
  activity: Activity;
  coming: ComingSoon;
};

export const homeData: HomeData = {
  header: {
    greeting: "Good morning, Maya",
    queueLine: "7 deals in your queue · open submissions",
    queueHref: "/submissions",
    searchPlaceholder: "Search deals, merchants, pages",
    unreadNotifications: 4,
  },

  hero: {
    id: "APP-7H2K4Q",
    href: "/deals/APP-7H2K4Q",
    merchant: "Harbor Street Bakery LLC",
    requested: "$45,000 requested",
    stage: "Ready for decision",
    stats: [
      { label: "True revenue", value: "$61.4K/mo" },
      { label: "Positions", value: "1 disclosed" },
      { label: "Score", value: "88" },
    ],
    chart: {
      line: "M0 100 C40 92 60 66 95 72 S150 38 190 52 S250 20 290 34 S350 10 400 16",
      area: "M0 100 C40 92 60 66 95 72 S150 38 190 52 S250 20 290 34 S350 10 400 16 L400 120 L0 120Z",
      dot: { x: 290, y: 34 },
    },
  },

  decisions: {
    total: 14,
    segments: [
      { label: "Approved", percent: 57, color: "teal" },
      { label: "Countered", percent: 14, color: "amber" },
      { label: "Declined", percent: 29, color: "red" },
    ],
  },

  queue: {
    onTimePercent: 68,
    targetPercent: 75,
    items: [
      { id: "APP-7H2K4Q", href: "/deals/APP-7H2K4Q", initials: "HB", tone: "light", merchant: "Harbor Street Bakery LLC", status: "Ready for decision", statusColor: "green", amount: "$45K", time: "9:40", decided: true },
      { id: "APP-3QW8LP", href: "/deals/APP-3QW8LP", initials: "NH", tone: "amber", merchant: "Northline HVAC Services", status: "Needs stips", statusColor: "amber", amount: "$120K", time: "10:15", decided: true },
      { id: "APP-RN4D2C", href: "/deals/APP-RN4D2C", initials: "CD", tone: "blue", merchant: "Coastal Dental Group", status: "Renewal", statusColor: "blue", amount: "$80K", time: "10:50", decided: false },
      { id: "APP-9K2M7R", href: "/deals/APP-9K2M7R", initials: "MA", tone: "red", merchant: "Mesa Auto Repair", status: "Integrity flag", statusColor: "red", amount: "$35K", time: "11:30", decided: false },
      { id: "APP-5TY6UB", href: "/deals/APP-5TY6UB", initials: "BC", tone: "grey", merchant: "Brightside Cleaning Co", status: "New", statusColor: "grey", amount: "$25K", time: "12:05", decided: false },
      { id: "APP-8PL2MN", href: "/deals/APP-8PL2MN", initials: "PF", tone: "purple", merchant: "Pinecrest Fitness Studio", status: "Ready for decision", statusColor: "green", amount: "$60K", time: "12:40", decided: false },
      { id: "APP-2GL7RT", href: "/deals/APP-2GL7RT", initials: "GL", tone: "light", merchant: "Golden Lotus Restaurant", status: "New", statusColor: "grey", amount: "$30K", time: "13:10", decided: false },
    ],
  },

  calendar: {
    title: "Week of Oct 12",
    days: [
      { label: "Mon 12", today: true },
      { label: "Tue 13" },
      { label: "Wed 14" },
      { label: "Thu 15" },
      { label: "Fri 16" },
      { label: "Sat 17" },
      { label: "Sun 18" },
    ],
    hours: ["9:00", "10:00", "11:00", "12:00", "1:00"],
    now: { day: 1, hour: 1 },
    events: [
      { id: "renewal", href: "/renewals", title: "Renewal window · Coastal Dental", day: 4, span: 3, hour: 1, tone: "mint", avatars: [{ initials: "CD", fill: "sand" }], order: 0 },
      { id: "call", href: "/deals/APP-7H2K4Q", title: "Funding call · Harbor Street", day: 4, span: 3, hour: 2, tone: "teal", avatars: [{ initials: "HB", fill: "sand" }, { initials: "MC", fill: "mint" }], order: 1 },
      { id: "broker", href: "/brokers", title: "Broker review · Apex Funding", day: 5, span: 3, hour: 3, tone: "teal", avatars: [{ initials: "AP", fill: "sand" }, { initials: "MC", fill: "mint" }], order: 2 },
      { id: "offer", href: "/offers", title: "Offer expires · Northline HVAC", day: 2, span: 3, hour: 4, tone: "amber", avatars: [{ initials: "NH", fill: "sand" }], order: 3 },
    ],
  },

  glance: [
    { id: "tasks", href: "/tasks", tone: "red", lead: { kind: "number", value: "2" }, title: "Tasks due within the hour", note: "Lakeshore UCC filing · Mesa Auto Repair review" },
    { id: "collected", href: "/funded", tone: "white", lead: { kind: "ring", percent: 85, label: "85%" }, title: "$24.1K of $28.4K collected today", note: "7 pending · ", noteTail: "2 returned" },
    { id: "policy", href: "/settings/policy", tone: "white", lead: { kind: "tag", value: "v4" }, title: "Policy change waiting", note: "Debt share 65% → 70% · needs Priya" },
  ],

  keyNumbers: {
    submissions: { value: "23", change: "+22%", changeNote: "vs last Monday", scale: ["0", "Avg 14", "25"] },
    offers: { value: "6", expiring: "2", expiringNote: "expire today", href: "/offers" },
    stacking: { value: "3", lead: "New", leadNote: "since 8:00 am", href: "/stacking" },
    funded: { value: "$1.24M", change: "+12%", changeNote: "vs September" },
    renewals: {
      value: "9",
      note: "This week",
      href: "/renewals",
      bars: [
        { x: 18, y: 70, h: 90 },
        { x: 58, y: 50, h: 110 },
        { x: 98, y: 82, h: 78 },
        { x: 138, y: 62, h: 98 },
      ],
      line: "M14 86 L64 64 L114 92 L156 70 L206 52",
      sun: { x: 172, y: 38, r: 22 },
    },
  },

  pipeline: {
    subtitle: "From submission to funded, Oct 12 – 18",
    ranges: [
      { value: "week", label: "This week" },
      { value: "month", label: "Month" },
      { value: "quarter", label: "Quarter" },
    ],
    range: "week",
    stages: [
      { label: "Submitted", value: "86", percent: 100, note: "100% of intake", color: "ink" },
      { label: "Fit policy", value: "54", percent: 63, note: "63% · 32 auto-declined", color: "ink" },
      { label: "Approved", value: "22", percent: 26, note: "41% of reviewed", color: "teal" },
      { label: "Offer accepted", value: "14", percent: 16, note: "64% of approved", color: "teal" },
      { label: "Funded", value: "11", percent: 13, note: "13% pull-through", color: "mint", final: true },
    ],
  },

  speed: {
    subtitle: "Medians for your team, last 30 days",
    metrics: [
      { label: "Submission to decision", aside: "Target 4h", asideTone: "good", value: "3h 12m", bar: 80 },
      { label: "Approval to funded", aside: "Slower than target", asideTone: "slow", value: "2.6 days", note: "Most delay is open stips and unsigned contracts." },
    ],
  },

  stips: {
    count: 5,
    subtitle: "Items blocking funding",
    items: [
      { id: "s1", title: "Voided check", detail: "Northline HVAC · from merchant · 2 days", status: "Overdue", statusColor: "amber" },
      { id: "s2", title: "Landlord letter", detail: "Pinecrest Fitness · from broker · 1 day", status: "Requested", statusColor: "grey" },
      { id: "s3", title: "Landlord letter", detail: "Harbor Street Bakery · from broker · due Wed", status: "Sent", statusColor: "blue" },
    ],
  },

  brokers: {
    subtitle: "This month, by deals funded",
    href: "/brokers",
    rows: [
      { id: "apex", href: "/brokers", name: "Apex Funding Partners", sent: 24, funded: 9, flags: 0 },
      { id: "summit", href: "/brokers", name: "Summit Capital ISO", sent: 19, funded: 6, flags: 1 },
      { id: "keystone", href: "/brokers", name: "Keystone Brokerage", sent: 12, funded: 4, flags: 0 },
      { id: "bluerock", href: "/brokers", name: "BlueRock Advisors", sent: 15, funded: 2, flags: 3 },
    ],
  },

  activity: {
    href: "/tasks",
    items: [
      { id: "a1", kind: "stacking", title: "New UCC filing", detail: " on Mesa Auto Repair, found by Stacking Watch", when: "12 min ago" },
      { id: "a2", kind: "check", title: "Integrity reviewed", detail: " Harbor Street Bakery, catering transfer explained · by Maya Chen", when: "34 min ago" },
      { id: "a3", kind: "upload", title: "Documents received", detail: " Brightside Cleaning uploaded 3 statements via Merchant Link", when: "1 hr ago" },
      { id: "a4", kind: "message", title: "Broker message", detail: " Apex Funding Partners replied on Coastal Dental Group", when: "2 hr ago" },
    ],
  },

  coming: {
    tag: "Coming soon",
    title: "Reconciliation Desk",
    text: "Track merchant reconciliation requests, calculate the adjustment from bank data, and prove every deadline was met.",
    href: "/whats-coming",
  },
};
