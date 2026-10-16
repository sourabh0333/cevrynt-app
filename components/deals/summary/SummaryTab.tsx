import { KeyNumbersCard } from "./KeyNumbersCard";
import { RecommendationCard } from "./RecommendationCard";
import { RevenueChart } from "./RevenueChart";
import { ScoreCard } from "./ScoreCard";

/**
 * The Summary tab from design/Deal-Summary.html.
 * Row A: score, key numbers, recommendation (a fixed 3-column grid that
 * stacks on narrow screens, so three cards never wrap as 2 + 1).
 * Row B: the revenue & balance chart across two columns; the third column
 * ("What needs a look") and everything below arrive in the next step.
 */
export function SummaryTab() {
  return (
    <>
      <section aria-label="Score, key numbers and recommendation" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <ScoreCard />
        <KeyNumbersCard />
        <RecommendationCard />
      </section>

      <section aria-label="Revenue and balance" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <RevenueChart />
        <div className="rounded-card-lg bg-card p-5">
          <p className="m-0 text-body-sm text-muted">What needs a look is built in the next step.</p>
        </div>
      </section>
    </>
  );
}
