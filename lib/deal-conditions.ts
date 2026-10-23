/**
 * The logic of a deal's conditions (design/prototypes/Deal-Conditions.dc.html),
 * shared by the Conditions tab, the tab bar's count and the Summary's check
 * card, so all three follow the same conditions. Pure, no React. The two
 * edit maps are what the underwriter did on the page (marked done, waived
 * with a reason); saving them is out of scope until writes exist.
 */
import type { DealCondition } from "@/lib/data/types";

/** Conditions marked done on the page. */
export type Got = Partial<Record<string, boolean>>;
/** Conditions waived on the page, with the reason given. */
export type Waived = Partial<Record<string, string>>;

export type ConditionStatus = "wait" | "booked" | "done" | "waived";

export const statusOf = (it: DealCondition, got: Got = {}, waived: Waived = {}): ConditionStatus =>
  it.status === "done" || got[it.id] ? "done" : waived[it.id] ? "waived" : it.status;

/** Met means done or waived. */
export const isMet = (s: ConditionStatus) => s === "done" || s === "waived";

/** Conditions still waiting on someone (not booked, done or waived): the tab bar's count. */
export const waitingConditions = (items: DealCondition[], got: Got = {}, waived: Waived = {}) => items.filter((it) => statusOf(it, got, waived) === "wait");
