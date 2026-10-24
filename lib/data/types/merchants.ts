import type { Id, IsoDateTime, Money } from "./common";
import type { AvatarColors } from "./funding";

/*
 * Merchants (design/Merchants.html). A merchant is the business itself;
 * its live advance, if any, is an Advance that points back by merchantId,
 * so balances, repaid shares and revenue are read from there. Merchants,
 * Funded deals, Renewals and Renewal rules all join the same records.
 */

export type Merchant = {
  id: Id;
  name: string;
  /** the shorter name some cards use ("Pine Ridge", "Coastal Dental") */
  shortName?: string;
  initials: string;
  colors: AvatarColors;
  industry: string;
  /** Cevrynt's health score, 0–100; null before it's scored */
  health: number | null;
};

/** Where a merchant stands. With a live advance it follows the advance and the renewal rules. */
export type Relationship = "active" | "renew" | "review" | "watch" | "declined" | "new";

/** An entry in "History with you", worded by the system when it happened. */
export type MerchantEvent = { title: string; detail: string; year: number; tone: "good" | "done" | "open" | "risk" };

/** The live advance's own entry, worded from the advance itself. */
export type CurrentAdvanceEvent = {
  kind: "current";
  /** add the advance's factor to the detail */
  withFactor?: boolean;
  /** add who brought it in, as the broker signs */
  via?: string;
};

/** A merchant as the directory lists it: the profile, the deals and the history. */
export type MerchantListing = {
  merchantId: Id;
  /** two-letter state */
  state: string;
  owner: string;
  /** used only when there's no live advance */
  standing: Exclude<Relationship, "renew" | "new"> | null;
  /** advances already paid off */
  pastAdvances: number;
  /** what those paid-off advances came to */
  fundedBefore: Money;
  /** a deal still in progress */
  openDeal: "review" | "declined" | "renewal" | "contract" | null;
  lastActivity: { kind: "event"; text: string } | { kind: "update"; at: IsoDateTime };
  note: string;
  /** newest first */
  history: (MerchantEvent | CurrentAdvanceEvent)[];
};

/** The whole directory and portfolio at a glance. */
export type MerchantBook = {
  /** every business in the workspace */
  total: number;
  inReview: number;
  declined: number;
  /** blocked for confirmed fraud */
  blocked: number;
  /** late payments or stacking alerts */
  onWatch: number;
  repeat: {
    /** share of merchants who take a second advance */
    secondAdvance: number;
    /** how much larger the second advance is */
    sizeMultiple: number;
    /** share of first advances paid late, and of repeat ones */
    lateFirst: number;
    lateRepeat: number;
  };
  /** share of money still to collect, by industry, largest first */
  industries: { label: string; share: number }[];
  /** where active merchants are, most first */
  states: { code: string; name: string; active: number }[];
  ownerGroups: { owner: string; initials: string; businesses: string[] }[];
  ownerGroupCount: number;
};
