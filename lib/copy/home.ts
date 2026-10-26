/**
 * Interface wording for Home (design/Main.html). Every figure is read or
 * worked out from the records (homeView): the signed-in person's deals and
 * tasks, today's decisions and collections, offers, alerts, the policy
 * draft, renewals ready, this week's funnel, stips, brokers, the calendar
 * and recent activity. The shapes below are what the Home cards draw.
 */
import type { ChipColor } from "@/components/ui/Chip";
import type { Deal, IsoDateTime } from "@/lib/data/types";
import type { CalendarRow, HomeData, StipRow } from "@/lib/data/views/home";
import { clock12, clockTime, dateShort, daysBetween, money, moneyK, moneyShort, monthName, percent, plural, timeOfDay, weekdayLong, weekdayShort } from "@/lib/format";
import { hoursAndMinutes } from "./deal";
import { todayCopy, todayTotals } from "./funded";
import { channelLabel } from "./intake";
import { expiringToday, monthChange, monthFunding } from "./offers";
import { fundedAmount } from "./reports";
import { kindFinding } from "./stacking";
import { taskWhen } from "./tasks";
import { firstName } from "./team";

export type HomeHeader = {
  greeting: string;
  queueLine: string;
  queueHref: string;
  searchPlaceholder: string;
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

export type HomeCards = {
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

const MINUS = "−";
/** "Harbor Street Bakery LLC" → "Harbor Street Bakery": names without their last word, as Home's lists shorten them. */
const shortName = (name: string) => name.split(" ").slice(0, -1).join(" ") || name;
/** "Harbor Street Bakery LLC" → "Harbor Street": the first two words, as calendar pills fit them. */
const pillName = (name: string) => name.split(" ").slice(0, 2).join(" ");
const hourOf = (at: IsoDateTime) => Number(timeOfDay(at).slice(0, 2));
const minutesBetween = (from: IsoDateTime, to: IsoDateTime) => Math.round((Date.parse(to) - Date.parse(from)) / 60_000);
/** Monday = 1 … Sunday = 7, in the workspace's zone. */
const weekday = (at: IsoDateTime) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(weekdayShort(at)) + 1;
const addDays = (at: IsoDateTime, days: number) => new Date(Date.parse(at) + days * 86_400_000).toISOString();

/** "Good morning", "Good afternoon" or "Good evening", by the workspace's clock. */
const partOfDay = (now: IsoDateTime) => (hourOf(now) < 12 ? "morning" : hourOf(now) < 17 ? "afternoon" : "evening");

/** The hero: the signed-in person's ready deal with the least time left. */
const nextDeal = (deals: Deal[]) =>
  deals
    .filter((d) => d.status === "ready")
    .sort((a, b) => (a.deadline.kind === "left" ? a.deadline.minutes : 1e9) - (b.deadline.kind === "left" ? b.deadline.minutes : 1e9))[0];

/** The hero's revenue line, drawn on the 400 × 120 card as the design does. */
const heroChart = {
  line: "M0 100 C40 92 60 66 95 72 S150 38 190 52 S250 20 290 34 S350 10 400 16",
  area: "M0 100 C40 92 60 66 95 72 S150 38 190 52 S250 20 290 34 S350 10 400 16 L400 120 L0 120Z",
  dot: { x: 290, y: 34 },
};

/** How a deal shows in My queue: a renewal, a flag, or where it stands. */
function queueLook(d: Deal): { status: string; statusColor: ChipColor; tone: QueueTone } {
  if (d.renewal) return { status: "Renewal", statusColor: "blue", tone: "blue" };
  if (d.findings.some((f) => f.severe)) return { status: "Integrity flag", statusColor: "red", tone: "red" };
  switch (d.status) {
    case "ready":
      return { status: "Ready for decision", statusColor: "green", tone: "light" };
    case "docs":
      return { status: "Needs stips", statusColor: "amber", tone: "amber" };
    case "offer":
      return { status: "Offer out", statusColor: "blue", tone: "purple" };
    case "review":
      return { status: "In review", statusColor: "grey", tone: "grey" };
    case "new":
      return { status: "New", statusColor: "grey", tone: "grey" };
  }
}

const calendarWords: Record<CalendarRow["kind"], { title: string; tone: CalendarEvent["tone"]; href: (r: CalendarRow) => string }> = {
  "renewal-window": { title: "Renewal window", tone: "mint", href: () => "/renewals" },
  "funding-call": { title: "Funding call", tone: "teal", href: (r) => `/deals/${r.dealId}` },
  "broker-review": { title: "Broker review", tone: "teal", href: () => "/brokers" },
  "offer-expiry": { title: "Offer expires", tone: "amber", href: () => "/offers" },
};
/** The calendar's hour rows: 9:00 to 1:00. */
const FIRST_HOUR = 9;
const calendarHours = ["9:00", "10:00", "11:00", "12:00", "1:00"];
const hourRow = (hour: number) => Math.min(calendarHours.length, Math.max(1, hour - FIRST_HOUR + 1));

/** "12 min ago", "1 hr ago". */
const ago = (at: IsoDateTime, now: IsoDateTime) => {
  const m = Math.max(0, minutesBetween(at, now));
  return m < 60 ? `${m} min ago` : `${Math.floor(m / 60)} hr ago`;
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Everything Home shows, worded from the records (homeView). */
export function homeCards(d: HomeData): HomeCards {
  const { now, me } = d;
  const hero = nextDeal(d.myDeals);
  const closed = d.closedToday.approved + d.closedToday.countered + d.closedToday.declined;
  const collected = todayTotals(d.book);
  const monday = addDays(now, 1 - weekday(now));
  const sunday = addDays(monday, 6);
  const submissionsToday = d.intake.today.reduce((n, c) => n + c.count, 0);
  const vsLastWeek = Math.round((submissionsToday / d.intake.sameDayLastWeek - 1) * 100);
  const change = monthChange(d.funding, now);
  const f = d.week.funnel;
  const pct = (n: number, of: number) => Math.round((n / of) * 100);
  const dueNow = d.tasks.filter((t) => taskWhen(t.dueAt, now) === "now");
  const targetMinutes = d.workspace.decisionTargetHours * 60;
  const isOverdue = (s: StipRow) => !!s.dueAt && s.dueAt < now && s.from !== "us";
  const stipRank = (s: StipRow) => (isOverdue(s) ? 0 : s.sent ? 2 : 1);
  // Overdue first, then requests not yet sent (oldest first), then sent ones by due date (none last).
  const order = (s: StipRow) => [stipRank(s), stipRank(s) === 2 ? (s.dueAt ?? "\uffff") : (s.requestedAt ?? "")] as const;
  const stips = [...d.stips].sort((a, b) => {
    const [x, y] = [order(a), order(b)];
    return x[0] - y[0] || (x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0);
  });

  return {
    header: {
      greeting: `Good ${partOfDay(now)}, ${firstName(me.name)}`,
      queueLine: `${d.myDeals.length} deals in your queue · open submissions`,
      queueHref: "/submissions",
      searchPlaceholder: "Search deals, merchants, pages",
    },

    hero: {
      id: hero.id,
      href: `/deals/${hero.id}`,
      merchant: hero.merchantName,
      requested: `${money(hero.requested)} requested`,
      stage: queueLook(hero).status,
      stats: [
        { label: "True revenue", value: hero.metrics.revenue === null ? "—" : `${moneyK(hero.metrics.revenue)}/mo` },
        { label: "Positions", value: hero.metrics.positions === null ? "—" : hero.metrics.positionsNote === "ours" ? `${hero.metrics.positions} ours` : `${hero.metrics.positions} disclosed` },
        { label: "Score", value: hero.score === null ? "—" : String(hero.score) },
      ],
      chart: heroChart,
    },

    decisions: {
      total: closed,
      segments: [
        { label: "Approved", percent: pct(d.closedToday.approved, closed), color: "teal" },
        { label: "Countered", percent: pct(d.closedToday.countered, closed), color: "amber" },
        { label: "Declined", percent: pct(d.closedToday.declined, closed), color: "red" },
      ],
    },

    queue: {
      onTimePercent: Math.round((me.onTimeToday ?? 0) * 100),
      targetPercent: Math.round(d.workspace.onTimeTarget * 100),
      // Oldest first; checked = decided, with an offer out.
      items: [...d.myDeals]
        .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt))
        .map((deal) => ({
          id: deal.id,
          href: `/deals/${deal.id}`,
          initials: deal.merchantInitials,
          merchant: deal.merchantName,
          ...queueLook(deal),
          amount: moneyShort(deal.requested),
          time: daysBetween(deal.receivedAt, now) === 0 ? clockTime(deal.receivedAt) : weekdayShort(deal.receivedAt),
          decided: deal.status === "offer" || d.offers.some((o) => o.merchant === deal.merchantName && o.stage === "sent"),
        })),
    },

    calendar: {
      title: `Week of ${dateShort(monday)}`,
      days: Array.from({ length: 7 }, (_, i) => {
        const day = addDays(monday, i);
        return { label: `${weekdayShort(day)} ${Number(dateShort(day).split(" ")[1])}`, ...(i + 1 === weekday(now) ? { today: true } : {}) };
      }),
      hours: calendarHours,
      now: { day: weekday(now), hour: hourRow(hourOf(now)) },
      events: d.calendar.map((r, i) => {
        const w = calendarWords[r.kind];
        const outside = hourRow(hourOf(r.at)) !== hourOf(r.at) - FIRST_HOUR + 1;
        return {
          id: r.id,
          href: w.href(r),
          // an event outside the shown hours sits on the nearest row and says its time
          title: `${w.title}${outside ? ` ${clock12(r.at).replace(":00 ", " ")}` : ""} · ${pillName(r.name)}`,
          day: weekday(r.at),
          span: 3,
          hour: hourRow(hourOf(r.at)),
          tone: w.tone,
          avatars: [{ initials: r.initials, fill: "sand" as const }, ...(r.withMe ? [{ initials: me.initials, fill: "mint" as const }] : [])],
          order: i,
        };
      }),
    },

    glance: [
      { id: "tasks", href: "/tasks", tone: "red", lead: { kind: "number", value: String(dueNow.length) }, title: "Tasks due within the hour", note: dueNow.map((t) => t.short ?? t.title).join(" · ") },
      {
        id: "collected",
        href: "/funded",
        tone: "white",
        lead: { kind: "ring", percent: Math.round(collected.share * 100), label: `${Math.round(collected.share * 100)}%` },
        title: todayCopy.homeLine(d.book),
        note: `${d.book.today.pending.count} pending · `,
        noteTail: `${d.book.today.returned.count} returned`,
      },
      ...(d.policyDraft
        ? [
            {
              id: "policy",
              href: "/settings/policy",
              tone: "white" as const,
              lead: { kind: "tag" as const, value: `v${d.policyDraft.version}` },
              title: "Policy change waiting",
              note: `Debt share ${percent(d.policyDraft.from)} → ${percent(d.policyDraft.to)} · needs ${firstName(d.policyDraft.approver)}`,
            },
          ]
        : []),
    ],

    keyNumbers: {
      submissions: {
        value: String(submissionsToday),
        change: `${vsLastWeek >= 0 ? "+" : MINUS}${Math.abs(vsLastWeek)}%`,
        changeNote: `vs last ${weekdayLong(now)}`,
        scale: ["0", `Avg ${d.intake.dailyAverage}`, "25"],
      },
      offers: { value: String(d.funding.stageTotals.sent), expiring: String(expiringToday(d.offers, now).length), expiringNote: "expire today", href: "/offers" },
      stacking: { value: String(d.newAlerts.count), lead: "New", leadNote: d.newAlerts.firstAt ? `since ${clock12(d.newAlerts.firstAt)}` : "today", href: "/stacking" },
      funded: { value: fundedAmount(monthFunding(d.funding).thisMonth), change: `${change.sign}${change.percent}`, changeNote: `vs ${change.month}` },
      renewals: {
        value: String(d.renewalsReady),
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
      subtitle: `From submission to funded, ${dateShort(monday)} – ${monthName(monday.slice(0, 7)) === monthName(sunday.slice(0, 7)) ? Number(dateShort(sunday).split(" ")[1]) : dateShort(sunday)}`,
      ranges: [
        { value: "week", label: "This week" },
        { value: "month", label: "Month" },
        { value: "quarter", label: "Quarter" },
      ],
      range: "week",
      stages: [
        { label: "Submitted", value: String(f.submitted), percent: 100, note: "100% of intake", color: "ink" },
        { label: "Fit policy", value: String(f.fitPolicy), percent: pct(f.fitPolicy, f.submitted), note: `${pct(f.fitPolicy, f.submitted)}% · ${f.submitted - f.fitPolicy} auto-declined`, color: "ink" },
        { label: "Approved", value: String(f.approved), percent: pct(f.approved, f.submitted), note: `${pct(f.approved, f.reviewed)}% of reviewed`, color: "teal" },
        { label: "Offer accepted", value: String(f.accepted), percent: pct(f.accepted, f.submitted), note: `${pct(f.accepted, f.approved)}% of approved`, color: "teal" },
        { label: "Funded", value: String(f.funded), percent: pct(f.funded, f.submitted), note: `${pct(f.funded, f.submitted)}% pull-through`, color: "mint", final: true },
      ],
    },

    speed: {
      subtitle: "Medians for your team, last 30 days",
      metrics: [
        {
          label: "Submission to decision",
          aside: `Target ${d.workspace.decisionTargetHours}h`,
          asideTone: d.decisionMinutes <= targetMinutes ? "good" : "slow",
          value: hoursAndMinutes(d.decisionMinutes),
          bar: Math.round((d.decisionMinutes / targetMinutes) * 100),
        },
        {
          label: "Approval to funded",
          aside: d.funding.medianDaysToFund > d.workspace.fundTargetDays ? "Slower than target" : "On target",
          asideTone: d.funding.medianDaysToFund > d.workspace.fundTargetDays ? "slow" : "good",
          value: `${d.funding.medianDaysToFund} days`,
          note: "Most delay is open stips and unsigned contracts.",
        },
      ],
    },

    stips: {
      count: d.stips.length,
      subtitle: "Items blocking funding",
      items: stips.slice(0, 3).map((s) => {
        const overdue = isOverdue(s);
        const since = s.requestedAt ? plural(daysBetween(s.requestedAt, now), "day") : "";
        const when = overdue || !s.sent ? since : s.dueAt ? `due ${weekdayShort(s.dueAt)}` : since;
        return {
          id: s.id,
          title: s.title,
          detail: `${shortName(s.merchant)} · from ${s.from} · ${when}`,
          status: overdue ? "Overdue" : s.sent ? "Sent" : "Requested",
          statusColor: (overdue ? "amber" : s.sent ? "blue" : "grey") as ChipColor,
        };
      }),
    },

    brokers: {
      subtitle: "This month, by deals funded",
      href: "/brokers",
      rows: [...d.brokers]
        .sort((a, b) => b.funded - a.funded)
        .slice(0, 4)
        .map((b) => ({ id: b.name, href: "/brokers", name: b.name, sent: b.sent, funded: b.funded, flags: b.flags })),
    },

    activity: {
      href: "/tasks",
      items: d.activity.map((a) => {
        const when = ago(a.at, now);
        switch (a.kind) {
          case "alert":
            return { id: a.id, kind: "stacking" as const, title: kindFinding[a.alertKind as keyof typeof kindFinding], detail: ` on ${a.merchant}, found by Stacking Watch`, when };
          case "audit":
            return { id: a.id, kind: "check" as const, title: capitalize(a.what.replace(/^Marked /, "")), detail: ` ${shortName(a.merchant)}, ${a.summary} · by ${a.by}`, when };
          case "upload":
            return { id: a.id, kind: "upload" as const, title: "Documents received", detail: ` ${shortName(a.merchant)} uploaded ${a.files} statements via ${channelLabel[a.channel as keyof typeof channelLabel]}`, when };
          case "broker-message":
            return { id: a.id, kind: "message" as const, title: "Broker message", detail: ` ${a.broker} replied on ${a.merchant}`, when };
        }
      }),
    },

    coming: {
      tag: "Coming soon",
      title: "Reconciliation Desk",
      text: "Track merchant reconciliation requests, calculate the adjustment from bank data, and prove every deadline was met.",
      href: "/whats-coming",
    },
  };
}
