"use client";

import { usePathname } from "next/navigation";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { dealTabHref, dealTabs, dealTabsLabel, tabCheck, tabMark } from "@/lib/copy/deal";
import type { CheckState, DealCheckSet } from "@/lib/data/types";
import { useLiveWaiting } from "./DealLive";

/**
 * The nine deal tabs from design/Deal-Summary.html. Each is a link to its
 * route; the one matching the current path is solid teal. The dots and the
 * Conditions count show the deal's own checks; while the Conditions tab is
 * open, its count follows the conditions on the page.
 */
export function DealTabs({ dealId, checks }: { dealId: string; checks: DealCheckSet }) {
  const pathname = usePathname();
  const live = useLiveWaiting();
  const base = `/deals/${dealId}`;
  const current =
    dealTabs.find((t) => t.path !== "" && pathname.startsWith(base + t.path))?.key ?? "summary";

  const state = (key: keyof DealCheckSet): CheckState =>
    key === "conditions" && live !== null ? (live ? { state: "open", count: live } : { state: "ok" }) : checks[key];

  const items: TabItem[] = dealTabs.map((t) => {
    const check = tabCheck[t.key];
    const mark = check ? tabMark(state(check)) : {};
    return {
      value: t.key,
      label: t.label,
      href: dealTabHref(dealId, t),
      dot: mark.dot,
      count: mark.count,
      countColor: mark.count !== undefined ? "amber" : undefined,
    };
  });

  return <Tabs items={items} value={current} label={dealTabsLabel} />;
}
