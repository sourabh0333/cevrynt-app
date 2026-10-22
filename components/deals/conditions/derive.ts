import {
  conditionItems,
  conditionsTotal,
  type ConditionItem,
  type ConditionKey,
  type ConditionStatus,
} from "@/lib/sample-data/deal-conditions";

/** Conditions the underwriter marked done on this page. */
export type Got = Partial<Record<ConditionKey, boolean>>;
/** Conditions waived on this page, with the reason given. */
export type Waived = Partial<Record<ConditionKey, string>>;

export type StepState = "done" | "now" | "next";
export type Step = { n: string; title: string; sub: string; state: StepState };

/** Everything the runway and the board show, worked out from the two edits maps (the prototype's logic). */
export function deriveConditions(got: Got, waived: Waived) {
  const statusOf = (it: ConditionItem): ConditionStatus =>
    it.base === "done" || got[it.key] ? "done" : waived[it.key] ? "waived" : it.base;
  const st = (k: ConditionKey) => statusOf(conditionItems.find((i) => i.key === k)!);
  const ok = (k: ConditionKey) => st(k) === "done" || st(k) === "waived";

  const open = conditionItems.filter((it) => it.base !== "done").map((it) => ({ item: it, status: statusOf(it) }));
  const done = conditionItems.filter((it) => statusOf(it) === "done").map((it) => ({ title: it.title, time: it.base === "done" ? it.time! : null }));
  const doneCount = done.length;
  const waivedCount = conditionItems.filter((it) => statusOf(it) === "waived").length;
  const metCount = doneCount + waivedCount;
  const allMet = metCount === conditionsTotal;

  const letter = ok("landlord");
  const contract = ok("contract");
  const call = ok("call");
  const raw: [string, string, boolean][] = [
    ["Documents", "5 cleared today", true],
    ["Landlord letter", letter ? (st("landlord") === "waived" ? "Waived" : "Received") : "Due Oct 14", letter],
    ["Your approval", contract ? "Approved" : "Ready now", contract],
    ["Contract signed", contract ? (st("contract") === "waived" ? "Waived" : "Signed") : "After the offer", contract],
    ["Funding call", call ? "Done" : "Thursday 10:00", call],
    ["Funded", allMet ? "Ready to send" : "After final checks", false],
  ];
  const firstOpen = raw.findIndex((r) => !r[2]);
  const steps: Step[] = raw.map((r, i) => ({
    n: `0${i + 1}`,
    title: r[0],
    sub: r[1],
    state: r[2] ? "done" : i === firstOpen ? "now" : "next",
  }));
  const nowStep = steps.find((s) => s.state === "now");

  return {
    open,
    done,
    doneCount,
    waivedCount,
    metCount,
    leftCount: conditionsTotal - metCount,
    allMet,
    hasWaived: waivedCount > 0,
    steps,
    nowStep,
  };
}

export type Derived = ReturnType<typeof deriveConditions>;
