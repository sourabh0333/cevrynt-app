import type { Id, IsoDateTime } from "./common";
import type { YearMonth } from "./deal-tabs";
import type { RuleId } from "./policy";

/*
 * Intake (design/Intake.html and the three intake flows). What arrived,
 * what was read from it and how it fits the policy. Labels and headings
 * are in lib/copy/intake.
 */

export type IntakeChannel = "package" | "bulk" | "manual" | "merchant-link";

/** Where a new deal stands after the fit check. */
export type FitResult =
  | { result: "fits" }
  /** a statement month is missing and will be requested */
  | { result: "needs"; missingMonth: YearMonth }
  /** declined by a policy rule */
  | { result: "declined"; rule: RuleId }
  | { result: "unchecked" };

export type IntakeSummary = {
  /** deals since midnight, by channel */
  today: { channel: IntakeChannel; count: number }[];
  /** deals on the same weekday last week, and on an average day */
  sameDayLastWeek: number;
  dailyAverage: number;
  /** deals this month, by channel, and the share of them funded. Intake channels and Plan & usage read these. */
  month: { channel: IntakeChannel; deals: number; funded: number }[];
  recent: { id: Id; merchant: string; channel: IntakeChannel; at: IsoDateTime; fit: FitResult; assigneeId: Id | null }[];
};

/** An uploaded file's name, size and when it came in. */
export type UploadedFile = { name: string; sizeMb: number; uploadedAt: IsoDateTime };

export type PackageDocKind = "application" | "id" | "check" | "unreadable" | "other";

export type PackageIntake = {
  file: UploadedFile;
  readSeconds: number;
  bank: { name: string; last4: string };
  statements: { month: YearMonth; pages: number; balancesMatch: boolean }[];
  documents: { kind: PackageDocKind; file: string; note?: string; state: "read" | "warn" | "ignored" }[];
  business: {
    name: string;
    industry: string;
    state: string;
    /** the year it was registered */
    since: number;
    owner: string;
    share: number;
    requested: number;
    /** deals funded with this business before, and the latest year */
    funded: { count: number; lastYear: number } | null;
  };
  sentBy: string;
};

export type BulkFolder = {
  id: Id;
  folder: string;
  /** null when no business could be matched */
  business: string | null;
  files: number;
  /** statement months found; null when there's nothing to read */
  statements: number | null;
  fit: FitResult;
  /** an open deal for the same business already exists */
  existingDealId?: Id;
  /** what was found instead, when no business matched */
  note?: string;
};

export type BulkIntake = {
  file: UploadedFile;
  folders: BulkFolder[];
  options: { sentBy: string; assign: "even" | "auto"; tellBroker: boolean; requestMissing: boolean };
  /** the batch before this one today */
  earlier: { file: string; folders: number; files: number; matched: number; created: number; at: IsoDateTime };
};

/** A manual lead as the form holds it: what the person typed, as they typed it. */
export type ManualLead = {
  business: { name: string; dba: string; ein: string; industry: string; start: string; address: string; phone: string; entity: string; state: string; website: string };
  owner: { name: string; ownership: string; email: string; mobile: string; address: string };
  request: {
    amount: string;
    revenue: string;
    uses: string[];
    hasPositions: boolean;
    positions: { funder: string; payment: string; balance: string }[];
    broker: string;
    /** the person at the broker, copied on Merchant Link when asked */
    brokerContact: string;
    commission: string;
  };
  documents: { merchantLinkSent: boolean; copyBroker: boolean };
  review: { assignTo: string; priority: string };
};

export type ManualDraft = {
  lead: ManualLead;
  savedAt: IsoDateTime;
  /** what the state registry returned for a name: matched on this text */
  registry: { matches: string; state: string; activeSince: YearMonth } | null;
  /** the required documents and where each stands */
  documents: { kind: "statements" | "application" | "id" | "check"; received: number; file?: string }[];
  /** documents in the draft so far, of all expected */
  docsReceived: { received: number; total: number };
  /** past deals the duplicate check compares against */
  pastDeals: { dealId: Id; business: string; owner: string; phone: string }[];
};

/** Settings › Intake channels: how Merchant Link is set up. The other channels are coming soon. */
export type IntakeChannelSettings = {
  merchantLink: { bankConnection: boolean; photoId: boolean; reminders: boolean; spanish: boolean; expiryDays: number };
};
