import type { Id } from "./common";

export type BankAccount = { bank: string; last4: string; verified: boolean };

/** The funder's own web addresses for what merchants and brokers open. */
export type WebAddressKind = "apply" | "link" | "brokers";
export type WebAddress = { kind: WebAddressKind; host: string; live: boolean };

export type Workspace = {
  id: Id;
  /** What merchants see, e.g. "Ridgeline Capital". */
  name: string;
  initials: string;
  legalName: string;
  address: string;
  /** IANA zone, e.g. "America/New_York". */
  timeZone: string;
  emailFrom: string;
  /** The sending domain is verified, so offers don't land in spam. */
  emailVerified: boolean;
  supportPhone: string;
  /** The funder's own privacy policy and terms, linked from every merchant-facing page. */
  privacyUrl: string;
  termsUrl: string;
  /** The funder's choice, used only on merchant-facing pages. */
  brandColor: string;
  /** Working hours every new deal gets for a decision. Read by Submissions and Workspace. */
  decisionTargetHours: number;
  /** share of today's deals that should be decided in time */
  onTimeTarget: number;
  /** days from approval to money sent the team aims for */
  fundTargetDays: number;
  hours: {
    /** 1 = Monday … 7 = Sunday */
    firstDay: number;
    lastDay: number;
    /** "08:00", 24-hour */
    opens: string;
    closes: string;
    pauseNights: boolean;
    pauseWeekends: boolean;
    /** e.g. "US federal" */
    holidayCalendar: string;
    holidaysPerYear: number;
  };
  data: {
    /** e.g. "United States" */
    storedIn: string;
    keptYears: number;
    maskIds: boolean;
    declinedDeletedYears: number;
    openRequests: number;
  };
  fundingAccount: BankAccount;
  collectionsAccount: BankAccount;
  /** The team member who signs contracts for the funder. */
  signerId: Id;
  webAddresses: WebAddress[];
};

export type NotificationChannel = "app" | "email" | "text";
export type NotificationEvent = "stacking" | "returned" | "assigned" | "deadline" | "offerExpires" | "brokerReplied" | "weeklyReport";

/** A team default for one event: which channels it goes to. */
export type NotificationRule = {
  event: NotificationEvent;
  urgent: boolean;
  channels: Record<NotificationChannel, boolean>;
};
