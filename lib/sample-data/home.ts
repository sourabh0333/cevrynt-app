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

export type HomeData = {
  header: HomeHeader;
  hero: HeroDeal;
  decisions: Decisions;
  queue: Queue;
  calendar: WeekCalendar;
  glance: GlanceItem[];
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
      { id: "APP-NH1", href: "/deals/APP-NH1", initials: "NH", tone: "amber", merchant: "Northline HVAC Services", status: "Needs stips", statusColor: "amber", amount: "$120K", time: "10:15", decided: true },
      { id: "APP-CD1", href: "/deals/APP-CD1", initials: "CD", tone: "blue", merchant: "Coastal Dental Group", status: "Renewal", statusColor: "blue", amount: "$80K", time: "10:50", decided: false },
      { id: "APP-MA1", href: "/deals/APP-MA1", initials: "MA", tone: "red", merchant: "Mesa Auto Repair", status: "Integrity flag", statusColor: "red", amount: "$35K", time: "11:30", decided: false },
      { id: "APP-BC1", href: "/deals/APP-BC1", initials: "BC", tone: "grey", merchant: "Brightside Cleaning Co", status: "New", statusColor: "grey", amount: "$25K", time: "12:05", decided: false },
      { id: "APP-PF1", href: "/deals/APP-PF1", initials: "PF", tone: "purple", merchant: "Pinecrest Fitness Studio", status: "Ready for decision", statusColor: "green", amount: "$60K", time: "12:40", decided: false },
      { id: "APP-GL1", href: "/deals/APP-GL1", initials: "GL", tone: "light", merchant: "Golden Lotus Restaurant", status: "New", statusColor: "grey", amount: "$30K", time: "13:10", decided: false },
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
};
