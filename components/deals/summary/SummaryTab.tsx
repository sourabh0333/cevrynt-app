import { checkSet } from "@/lib/copy/deal-conditions";
import type { DealTabsData } from "@/lib/data/views/deal-tabs";
import { AskDealCard } from "./AskDealCard";
import { ChecksCard } from "./ChecksCard";
import { KeyNumbersCard } from "./KeyNumbersCard";
import { LookCard } from "./LookCard";
import { RecommendationCard } from "./RecommendationCard";
import { RevenueChart } from "./RevenueChart";
import { ScoreCard } from "./ScoreCard";
import { TimelineCard } from "./TimelineCard";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Summary tab from design/Deal-Summary.html, for the deal in `data`
 * (from the data layer).
 * Row A: score, key numbers, recommendation.
 * Row B: the revenue & balance chart (two columns) and What needs a look.
 * Row C: every check at a glance (two columns) and the timeline.
 * Then the Ask about this deal strip.
 * Fixed 3-column grids that stack on narrow screens, so three cards never
 * wrap as 2 + 1, and every card in a row stretches to the same height.
 */
export function SummaryTab({ data }: { data: DealTabsData }) {
  return (
    <>
      <section aria-label="Score, key numbers and recommendation" className={row}>
        <ScoreCard data={data} />
        <KeyNumbersCard data={data} />
        <RecommendationCard data={data} />
      </section>

      <section aria-label="Revenue and balance" className={row}>
        <RevenueChart summary={data.summary} cashFlow={data.cashFlow} />
        <LookCard id={data.id} summary={data.summary} />
      </section>

      <section aria-label="Checks and timeline" className={row}>
        <ChecksCard id={data.id} checks={checkSet(data.checks, data.conditions)} />
        <TimelineCard id={data.id} summary={data.summary} />
      </section>

      <AskDealCard prompts={data.summary.prompts} />
    </>
  );
}
