import { PageActions } from "@/components/shell/PageActions";
import { brokersHeader } from "@/lib/sample-data/brokers";
import { ScorecardsView } from "./ScorecardsView";
import { SummaryTiles } from "./SummaryTiles";

/**
 * Brokers from design/Brokers.html. This step holds the header, the five
 * summary tiles and the scorecards beside the broker detail. The ownership,
 * payout, applications, paperwork, what-we-fund and portal rows come in the
 * next step.
 */
export function BrokersView() {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{brokersHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{brokersHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <SummaryTiles />
      <ScorecardsView />
    </>
  );
}
