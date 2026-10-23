import type { NotificationRule, Workspace } from "@/lib/data/types";

/**
 * Sample workspace records, copied from
 * design/prototypes/Settings-Workspace.dc.html. Pages get them through
 * lib/data/settings. The decision target lives only here; Submissions reads
 * it from this file until that page moves to the data layer.
 */
export const workspace: Workspace = {
  id: "ws_ridgeline",
  name: "Ridgeline Capital",
  initials: "RC",
  legalName: "Ridgeline Capital LLC",
  address: "100 Federal St, Boston, MA 02110",
  timeZone: "America/New_York",
  emailFrom: "offers@ridgelinecap.com",
  emailVerified: true,
  supportPhone: "(617) 555-0190",
  brandColor: "#0E6B5C",
  decisionTargetHours: 4,
  hours: {
    firstDay: 1,
    lastDay: 5,
    opens: "08:00",
    closes: "18:00",
    pauseNights: true,
    pauseWeekends: true,
    holidayCalendar: "US federal",
    holidaysPerYear: 11,
  },
  data: {
    storedIn: "United States",
    keptYears: 7,
    maskIds: true,
    declinedDeletedYears: 2,
    openRequests: 0,
  },
  fundingAccount: { bank: "Eastern Bank", last4: "4102", verified: true },
  collectionsAccount: { bank: "Eastern Bank", last4: "4119", verified: true },
  signerId: "usr_priya",
  webAddresses: [
    { kind: "apply", host: "apply.ridgeline.com", live: false },
    { kind: "link", host: "link.ridgeline.com", live: true },
    { kind: "brokers", host: "brokers.ridgeline.com", live: false },
  ],
};

const on = (app: boolean, email: boolean, text: boolean) => ({ app, email, text });

/** Team defaults, in the order the Notifications card lists them. */
export const notificationRules: NotificationRule[] = [
  { event: "stacking", urgent: true, channels: on(true, true, true) },
  { event: "returned", urgent: true, channels: on(true, true, false) },
  { event: "assigned", urgent: false, channels: on(true, true, false) },
  { event: "deadline", urgent: true, channels: on(true, false, true) },
  { event: "offerExpires", urgent: false, channels: on(true, true, false) },
  { event: "brokerReplied", urgent: false, channels: on(true, false, false) },
  { event: "weeklyReport", urgent: false, channels: on(false, true, false) },
];
