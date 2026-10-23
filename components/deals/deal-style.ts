import type { ChipColor } from "@/components/ui/Chip";
import type { DealRisk, DealStatus } from "@/lib/data/types";

/*
 * How deals are colored, shared by Submissions and the deal header. Colors
 * are not data (DATA-PLAN.md, section 1): they're keyed by status, risk,
 * deadline level or deal id here, from design/Submissions.html.
 */

export const statusChip: Record<DealStatus, ChipColor> = { new: "grey", docs: "amber", review: "blue", ready: "green", offer: "purple" };
export const statusDot: Record<DealStatus | "all", string> = {
  all: "bg-mint",
  new: "bg-grey-dot",
  docs: "bg-amber",
  review: "bg-blue",
  ready: "bg-teal",
  offer: "bg-purple",
};

export const riskChip = (risk: DealRisk | null): ChipColor => (risk === "low" ? "green" : risk === "medium" ? "amber" : risk === "high" ? "red" : "grey");

/** Deadline text and bar colors by level: fine, getting close, overdue, paused. */
export const deadlineStyle: { text: string; bar: string }[] = [
  { text: "text-ink", bar: "bg-teal" },
  { text: "text-amber-deep", bar: "bg-amber" },
  { text: "text-coral-text", bar: "bg-red" },
  { text: "text-hint", bar: "bg-line-dashed" },
];

/** Score ring color, as the prototype draws it. */
export const scoreColor = (score: number): "teal" | "amber" | "red" => (score < 65 ? "red" : score < 80 ? "amber" : "teal");

/** The two gradient stops of each deal's 40px tile in the queue. */
const tile: Record<string, [string, string]> = {
  "APP-7H2K4Q": ["#0E6B5C", "#3FA58C"],
  "APP-RN4D2C": ["#24588A", "#4F86BD"],
  "APP-9K2M7R": ["#A3341F", "#C2412D"],
  "APP-0SP4PD": ["#57418A", "#8670B8"],
  "APP-2GL7RT": ["#0A5E50", "#2F8F7A"],
  "APP-3QW8LP": ["#A85C0B", "#D98A2B"],
  "APP-5TY6UB": ["#3E4A46", "#6B7873"],
  "APP-6RB3LO": ["#4D6B2E", "#7FA05A"],
  "APP-4OD8VD": ["#8A5A2B", "#B98552"],
  "APP-1TS5PC": ["#2C5F73", "#5A90A6"],
  "APP-8PL2MN": ["#6B4FA0", "#9C86C9"],
  "APP-7CK2CF": ["#7A4A2A", "#B07A52"],
};
const fallback: [string, string] = ["#3E4A46", "#6B7873"];

export const dealTile = (id: string) => tile[id] ?? fallback;

/** The deal header's 64px tile: Harbor Street's lighter mint from the design, the queue colors for the rest. */
export const dealHeaderTile = (id: string): [string, string] => (id === "APP-7H2K4Q" ? ["#3FA58C", "#8FD9C3"] : dealTile(id));
