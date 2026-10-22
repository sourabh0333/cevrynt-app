import { PageActions } from "@/components/shell/PageActions";
import { fundedHeader } from "@/lib/sample-data/funded";
import { BookView } from "./BookView";
import { TodayRow } from "./TodayRow";

/**
 * Funded deals from design/Funded.html. This step holds the header,
 * today's payments with the stat tiles, and the book beside its detail
 * panel. The warnings, vintages, reconciliation, forecast, returns,
 * recovery and paying-off rows come in later steps.
 */
export function FundedView() {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{fundedHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{fundedHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <TodayRow />
      <BookView />
    </>
  );
}
