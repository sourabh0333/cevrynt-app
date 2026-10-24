import { PageActions } from "@/components/shell/PageActions";
import { brokersHeader, brokerView, onWatchCount } from "@/lib/copy/brokers";
import type { BrokersData } from "@/lib/data/views/brokers";
import { BottomRows } from "./BottomRows";
import { ScorecardsView } from "./ScorecardsView";
import { SummaryTiles } from "./SummaryTiles";

/**
 * Brokers from design/Brokers.html: the header, the five summary tiles,
 * the scorecards beside the broker detail, then deal ownership and payout,
 * new applicants and paperwork, and what we fund beside the broker portal.
 * The brokers, their fraud flags from Stacking Watch, commission at
 * Pricing's points and the book come from the data layer.
 */
export function BrokersView({ data }: { data: BrokersData }) {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{brokersHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{brokersHeader.line(data.book.active, onWatchCount(data.brokers))}</span>
        </div>
        <PageActions />
      </header>
      <SummaryTiles data={data} />
      <ScorecardsView brokers={data.brokers.map((b) => brokerView(b, data))} />
      <BottomRows data={data} />
    </>
  );
}
