import { boardCopy, runwayCopy as r } from "@/lib/copy/deal-conditions";
import type { DealCondition, IsoDateTime } from "@/lib/data/types";
import { isMet, statusOf, waitingConditions, type ConditionStatus, type Got, type Waived } from "@/lib/deal-conditions";
import { daysBetween, timeOfDay } from "@/lib/format";

export type StepState = "done" | "now" | "next";
export type Step = { n: string; title: string; sub: string; state: StepState };

/** What an open condition's runway step says before it's met: "Due Oct 14", "Thursday 10:00", "After the offer". */
const pendingSub = (it: DealCondition) => {
  if (it.status === "booked" && it.bookedAt) return boardCopy.meta(it)[1];
  if (it.dueAt) return r.steps.due(it.dueAt);
  return boardCopy.meta(it)[1];
};

const metSub = (it: DealCondition, s: ConditionStatus) =>
  s === "waived" ? r.steps.waived : it.action === "received" ? r.steps.received : it.action === "signed" ? r.steps.contract.done : r.steps.call;

/**
 * Everything the runway and the board show, worked out from the deal's
 * conditions and the two edit maps (the prototype's logic). The road to
 * funding starts with the documents already cleared, then each open
 * condition in order (your approval comes just before the contract is
 * signed), and ends with the funding itself.
 */
export function deriveConditions(items: DealCondition[], got: Got, waived: Waived, now: IsoDateTime) {
  const withStatus = items.map((it) => ({ item: it, status: statusOf(it, got, waived) }));
  const open = withStatus.filter(({ item }) => item.status !== "done");
  const done = withStatus
    .filter(({ status }) => status === "done")
    .map(({ item }) => ({ title: item.title, time: item.status === "done" && item.doneAt ? timeOfDay(item.doneAt) : null }));
  const doneCount = done.length;
  const waivedCount = withStatus.filter(({ status }) => status === "waived").length;
  const metCount = doneCount + waivedCount;
  const total = items.length;
  const allMet = metCount === total;
  const clearedToday = items.filter((it) => it.status === "done" && it.doneAt && daysBetween(it.doneAt, now) === 0).length;

  const raw: [string, string, boolean][] = [[r.steps.documents.title, r.steps.documents.sub(clearedToday), true]];
  for (const { item, status } of open) {
    const met = isMet(status);
    if (item.action === "signed") {
      raw.push([r.steps.approval.title, met ? r.steps.approval.done : r.steps.approval.open, met]);
      raw.push([r.steps.contract.title, met ? metSub(item, status) : pendingSub(item), met]);
    } else {
      raw.push([item.title, met ? metSub(item, status) : pendingSub(item), met]);
    }
  }
  raw.push([r.steps.funded.title, allMet ? r.steps.funded.met : r.steps.funded.open, false]);

  const firstOpen = raw.findIndex((s) => !s[2]);
  const steps: Step[] = raw.map((s, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: s[0],
    sub: s[1],
    state: s[2] ? "done" : i === firstOpen ? "now" : "next",
  }));
  const nowStep = steps.find((s) => s.state === "now");

  return {
    open,
    done,
    doneCount,
    waivedCount,
    metCount,
    total,
    leftCount: total - metCount,
    /** conditions still waiting on someone: the tab bar's count */
    waitingCount: waitingConditions(items, got, waived).length,
    allMet,
    hasWaived: waivedCount > 0,
    steps,
    nowStep,
  };
}

export type Derived = ReturnType<typeof deriveConditions>;
