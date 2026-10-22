import { PageActions } from "@/components/shell/PageActions";
import { stackingHeader } from "@/lib/sample-data/stacking";
import { AlertsView } from "./AlertsView";
import { ConnectionsCard, CoverageCard, MonthCard, RulesCard } from "./BottomRows";
import { SummaryRow } from "./SummaryRow";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * Stacking Watch from design/Stacking.html: the header, the summary row,
 * the alerts beside their detail, the connections map beside this month's
 * outcomes, and the automatic rules beside coverage.
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
      <section aria-label="Hidden connections and this month" className={row}>
        <ConnectionsCard />
        <MonthCard />
      </section>
      <section aria-label="Automatic rules and coverage" className={row}>
        <RulesCard />
        <CoverageCard />
      </section>
    </>
  );
}
