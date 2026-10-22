import { PageActions } from "@/components/shell/PageActions";
import { reportsHeader } from "@/lib/sample-data/reports";
import { FunnelRow } from "./FunnelRow";
import { Scoreboard } from "./Scoreboard";

/**
 * Reports from design/Reports.html. This step holds the header, the period
 * switch, the key-number scoreboard, and the funnel beside the monthly
 * chart. Declines, unit economics, team, and saved reports come next.
 */
export function ReportsView() {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{reportsHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{reportsHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <Scoreboard />
      <FunnelRow />
    </>
  );
}
