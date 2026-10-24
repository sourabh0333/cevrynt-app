import { PageActions } from "@/components/shell/PageActions";
import { newToday, stackingHeader, stackingSections } from "@/lib/copy/stacking";
import type { StackingData } from "@/lib/data/views/stacking";
import { AlertsView } from "./AlertsView";
import { ConnectionsCard, CoverageCard, MonthCard, RulesCard } from "./BottomRows";
import { SummaryRow } from "./SummaryRow";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * Stacking Watch from design/Stacking.html: the header, the summary row,
 * the alerts beside their detail, the connections map beside this month's
 * outcomes, and the automatic rules beside coverage. The alerts, joined to
 * their deals and advances, and the summary come from the data layer.
 */
export function StackingView({ data }: { data: StackingData }) {
  const fresh = newToday(data.alerts, data.now);
  const linked = data.alerts.find((a) => a.connection);
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{stackingHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{stackingHeader.line(fresh, data.summary)}</span>
        </div>
        <PageActions />
      </header>
      <SummaryRow fresh={fresh} open={data.openCount} summary={data.summary} />
      <AlertsView alerts={data.alerts} now={data.now} />
      <section aria-label={stackingSections.connections} className={row}>
        {linked ? <ConnectionsCard alert={linked} /> : null}
        <MonthCard summary={data.summary} />
      </section>
      <section aria-label={stackingSections.rules} className={row}>
        <RulesCard summary={data.summary} />
        <CoverageCard summary={data.summary} />
      </section>
    </>
  );
}
