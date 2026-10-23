"use client";

import { usePathname } from "next/navigation";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { checkDot, dealTabHref, dealTabs, dealTabsLabel, tabCheck } from "@/lib/copy/deal";
import type { DealChecks } from "@/lib/data/types";

/**
 * The nine deal tabs from design/Deal-Summary.html. Each is a link to its
 * route; the one matching the current path is solid teal. Cash flow's and
 * Positions' dots show the deal's own checks.
 */
export function DealTabs({ dealId, checks }: { dealId: string; checks: DealChecks }) {
  const pathname = usePathname();
  const base = `/deals/${dealId}`;
  const current =
    dealTabs.find((t) => t.path !== "" && pathname.startsWith(base + t.path))?.key ?? "summary";

  const items: TabItem[] = dealTabs.map((t) => {
    const check = tabCheck[t.key];
    return {
      value: t.key,
      label: t.label,
      href: dealTabHref(dealId, t),
      dot: check ? checkDot(checks[check]) : t.dot,
      count: t.count,
      countColor: t.count !== undefined ? "amber" : undefined,
    };
  });

  return <Tabs items={items} value={current} label={dealTabsLabel} />;
}
