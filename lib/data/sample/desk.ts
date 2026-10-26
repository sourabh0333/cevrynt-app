import type { ActivityEvent, CalendarEvent, Stip } from "@/lib/data/types";

/**
 * Sample desk records from design/Main.html: stips the team is waiting on,
 * this week's calendar and recent activity. Each points at its deal,
 * condition, offer, alert or audit entry, so names, amounts and times come
 * from those records. Pages get these through lib/data/desk.
 */

const at = (date: string, time: string) => `${date}T${time}:00-04:00`;

export const stips: Stip[] = [
  { id: "st-nh", dealId: "APP-3QW8LP", kind: "request", title: "Voided check", from: "merchant", requestedAt: at("2026-10-11", "10:00"), dueAt: at("2026-10-12", "17:00"), sent: true },
  { id: "st-pf", dealId: "APP-8PL2MN", kind: "request", title: "Landlord letter", from: "broker", requestedAt: at("2026-10-12", "15:00"), dueAt: at("2026-10-16", "17:00"), sent: false },
  { id: "st-hb", dealId: "APP-7H2K4Q", kind: "condition", conditionId: "landlord" },
  { id: "st-ck1", dealId: "APP-7CK2CF", kind: "request", title: "Bank statements", from: "merchant", requestedAt: at("2026-10-13", "09:20"), dueAt: null, sent: true },
  { id: "st-ck2", dealId: "APP-7CK2CF", kind: "request", title: "Owner ID", from: "merchant", requestedAt: at("2026-10-13", "09:20"), dueAt: null, sent: true },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "cal-renewal", withMe: false, kind: "renewal-window", advanceId: "adv-cd", startsAt: at("2026-10-15", "09:00") },
  { id: "cal-call", withMe: true, kind: "funding-call", dealId: "APP-7H2K4Q", conditionId: "call" },
  { id: "cal-broker", withMe: true, kind: "broker-review", brokerId: "br-apex", at: at("2026-10-16", "11:00") },
  { id: "cal-offer", withMe: false, kind: "offer-expiry", offerId: "of-nh" },
];

export const activityEvents: ActivityEvent[] = [
  { id: "act-alert", kind: "alert", alertId: "al-ma" },
  { id: "act-review", kind: "audit", entryId: "e4", summary: "catering transfer explained" },
  { id: "act-upload", kind: "upload", dealId: "APP-5TY6UB", files: 3, channel: "merchant-link", at: at("2026-10-13", "09:45") },
  { id: "act-message", kind: "broker-message", brokerId: "br-apex", dealId: "APP-RN4D2C", at: at("2026-10-13", "08:45") },
];
