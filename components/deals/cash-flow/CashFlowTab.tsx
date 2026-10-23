import type { DealTabsData } from "@/lib/data/views/deal-tabs";
import { MonthTable } from "./MonthTable";
import { RevenueMathCard } from "./RevenueMathCard";
import { RoomToPayCard } from "./RoomToPayCard";
import { BusiestDaysCard, CardSalesCard, SourcesCard } from "./SourcesRow";
import { StatementsCard } from "./StatementsCard";
import { TransactionsList } from "./TransactionsList";
import { WeeklyCashCard } from "./WeeklyCashCard";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Cash flow tab from design/Deal-CashFlow.html, for the deal in `data`
 * (from the data layer).
 * Row 1: deposits-to-revenue breakdown (two columns) and Statements.
 * Row 2: Month by month.
 * Row 3: Room to pay and the weekly cash chart (two columns).
 * Row 4: Where money comes from, Card sales, Busiest days.
 * Row 5: Transactions.
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function CashFlowTab({ data }: { data: DealTabsData }) {
  const cf = data.cashFlow;
  return (
    <>
      <section aria-label="Revenue breakdown and statements" className={row}>
        <RevenueMathCard cashFlow={cf} />
        <StatementsCard cashFlow={cf} />
      </section>

      <MonthTable cashFlow={cf} />

      <section aria-label="Room to pay and weekly cash" className={row}>
        <RoomToPayCard data={data} />
        <WeeklyCashCard cashFlow={cf} />
      </section>

      <section aria-label="Sources, card sales and busiest days" className={row}>
        <SourcesCard cashFlow={cf} />
        <CardSalesCard cashFlow={cf} />
        <BusiestDaysCard cashFlow={cf} />
      </section>

      <TransactionsList cashFlow={cf} />
    </>
  );
}
