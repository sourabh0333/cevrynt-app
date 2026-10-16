import type { DealTabKey } from "@/lib/sample-data/deal";
import { dealTabs } from "@/lib/sample-data/deal";

/** Simple content placeholder until each deal tab is built in its own step. */
export function DealPlaceholder({ tab }: { tab: DealTabKey }) {
  const label = dealTabs.find((t) => t.key === tab)?.label ?? "This tab";
  return (
    <div className="rounded-card-lg bg-card p-5">
      <p className="m-0 text-body-sm text-muted">
        {label} is built in a later step of BUILD-PLAN.md.
      </p>
    </div>
  );
}
