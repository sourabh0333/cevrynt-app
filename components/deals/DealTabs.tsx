"use client";

import { usePathname } from "next/navigation";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { dealTabHref, dealTabs } from "@/lib/sample-data/deal";

/**
 * The nine deal tabs from design/Deal-Summary.html. Each is a link to its
 * route; the one matching the current path is solid teal.
 */
export function DealTabs({ dealId }: { dealId: string }) {
  const pathname = usePathname();
  const base = `/deals/${dealId}`;
  const current =
    dealTabs.find((t) => t.path !== "" && pathname.startsWith(base + t.path))?.key ?? "summary";

  const items: TabItem[] = dealTabs.map((t) => ({
    value: t.key,
    label: t.label,
    href: dealTabHref(dealId, t),
    dot: t.dot,
    count: t.count,
    countColor: t.count !== undefined ? "amber" : undefined,
  }));

  return <Tabs items={items} value={current} label="Deal sections" />;
}
