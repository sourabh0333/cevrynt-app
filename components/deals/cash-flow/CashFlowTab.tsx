import { MonthTable } from "./MonthTable";
import { RevenueMathCard } from "./RevenueMathCard";
import { RoomToPayCard } from "./RoomToPayCard";
import { StatementsCard } from "./StatementsCard";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Cash flow tab from design/Deal-CashFlow.html.
 * Row 1: deposits-to-revenue breakdown (two columns) and Statements.
 * Row 2: Month by month.
 * Row 3: Room to pay, next to the weekly cash chart (next step).
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function CashFlowTab() {
  return (
    <>
      <section aria-label="Revenue breakdown and statements" className={row}>
        <RevenueMathCard />
        <StatementsCard />
      </section>

      <MonthTable />

      <section aria-label="Room to pay and weekly cash" className={row}>
        <RoomToPayCard />
        <div className="col-span-2 rounded-card-lg bg-card p-5 max-[980px]:col-span-1">
          <p className="m-0 text-body-sm text-muted">Cash in and out, week by week is built in the next step.</p>
        </div>
      </section>
    </>
  );
}
