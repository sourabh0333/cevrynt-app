import { PageActions } from "@/components/shell/PageActions";
import { fundedHeader } from "@/lib/sample-data/funded";
import { BookView } from "./BookView";
import { ForecastCard, ReconciliationCard, ReturnedCard, VintagesCard, WarningsCard } from "./MiddleRows";
import { TodayRow } from "./TodayRow";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * Funded deals from design/Funded.html: the header, today's payments with
 * the stat tiles, the book beside its detail panel, then early warnings,
 * vintages and reconciliation, and the forecast beside returned payments.
 * The recovery, returns and paying-off rows come in the next step.
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
      <section aria-label="Early warnings, vintages and reconciliation" className={row}>
        <WarningsCard />
        <VintagesCard />
        <ReconciliationCard />
      </section>
      <section aria-label="Money coming in and returned payments" className={row}>
        <ForecastCard />
        <ReturnedCard />
      </section>
    </>
  );
}
