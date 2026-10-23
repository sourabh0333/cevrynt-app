/**
 * Conventions every data type follows (DATA-PLAN.md, section 1):
 * money is a plain number of US dollars, dates are ISO 8601 strings, ids
 * are strings, and records point at each other by id. Sentences people
 * read are not data; they live in lib/copy and the components.
 */

/** US dollars, e.g. 45000. Format with money / moneyShort from lib/format. */
export type Money = number;

/** An ISO 8601 date-time, e.g. "2026-10-14T08:12:00-04:00". Format with lib/format. */
export type IsoDateTime = string;

/** A record id. Deals keep their public form ("APP-7H2K4Q"); others are opaque. */
export type Id = string;
