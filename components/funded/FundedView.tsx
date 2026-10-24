import { PageActions } from "@/components/shell/PageActions";
import { advanceView, fundedHeader, fundedSections, startSelected } from "@/lib/copy/funded";
import type { FundedData } from "@/lib/data/views/funding";
import { BookView } from "./BookView";
import { PayingOffStrip, RecoveryCard, ReturnsCard } from "./BottomRows";
import { ForecastCard, ReconciliationCard, ReturnedCard, VintagesCard, WarningsCard } from "./MiddleRows";
import { TodayRow } from "./TodayRow";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * Funded deals from design/Funded.html, for the advances and book in
 * `data` (from the data layer): the header, today's payments with the stat
 * tiles, the book beside its detail panel, then early warnings, vintages
 * and reconciliation, the forecast beside returned payments, recovery
 * beside returns, and the paying-off strip.
 */
export function FundedView({ data }: { data: FundedData }) {
  const { book, now } = data;
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{fundedHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{fundedHeader.line(book)}</span>
        </div>
        <PageActions />
      </header>
      <TodayRow book={book} now={now} />
      <BookView deals={data.advances.map((a) => advanceView(a, now))} book={book} start={startSelected(data.advances)} />
      <section aria-label={fundedSections.warnings} className={row}>
        <WarningsCard book={book} />
        <VintagesCard book={book} />
        <ReconciliationCard book={book} now={now} />
      </section>
      <section aria-label={fundedSections.forecast} className={row}>
        <ForecastCard book={book} />
        <ReturnedCard book={book} />
      </section>
      <section aria-label={fundedSections.recovery} className={row}>
        <RecoveryCard book={book} />
        <ReturnsCard book={book} />
      </section>
      <PayingOffStrip book={book} />
    </>
  );
}
