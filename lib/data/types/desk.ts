import type { Id, IsoDateTime } from "./common";
import type { IntakeChannel } from "./intake";

/*
 * The underwriter's desk: stips the team is waiting on, the week's
 * calendar and the activity feed. Each points at the record it is about
 * (a deal, its condition, an offer, an alert, an audit entry), so the
 * names, amounts and times on Home come from there.
 */

/** Something a deal is waiting on before it can fund. */
export type Stip = { id: Id; dealId: Id } & (
  /** one of the deal's own conditions (its title, who sends it and when it's due) */
  | { kind: "condition"; conditionId: Id }
  | { kind: "request"; title: string; from: "merchant" | "broker"; requestedAt: IsoDateTime; dueAt: IsoDateTime | null; sent: boolean }
);

/** On the team calendar this week. */
export type CalendarEvent = { id: Id; withMe: boolean } & (
  | { kind: "renewal-window"; advanceId: Id; startsAt: IsoDateTime }
  /** a deal's booked call (its time is the condition's) */
  | { kind: "funding-call"; dealId: Id; conditionId: Id }
  | { kind: "broker-review"; brokerId: Id; at: IsoDateTime }
  /** an offer's expiry (its time is the offer's) */
  | { kind: "offer-expiry"; offerId: Id }
);

/** Something that happened, for "Recent activity". */
export type ActivityEvent = { id: Id } & (
  | { kind: "alert"; alertId: Id }
  /** an audit entry, with the few words that sum it up */
  | { kind: "audit"; entryId: Id; summary: string }
  | { kind: "upload"; dealId: Id; files: number; channel: IntakeChannel; at: IsoDateTime }
  | { kind: "broker-message"; brokerId: Id; dealId: Id; at: IsoDateTime }
);
