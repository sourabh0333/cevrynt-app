import { PageActions } from "@/components/shell/PageActions";
import { stackingHeader } from "@/lib/sample-data/stacking";
import { AlertsView } from "./AlertsView";
import { SummaryRow } from "./SummaryRow";

/**
 * Stacking Watch from design/Stacking.html. This step holds the header,
 * the summary row and the alerts beside their detail. The connections
 * map, outcomes, rules and coverage rows come in the next step.
 */
export function StackingView() {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{stackingHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{stackingHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <SummaryRow />
      <AlertsView />
    </>
  );
}
