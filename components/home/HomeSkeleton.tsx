import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const grid300 = "grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5";

/**
 * Home while it loads: the header tools, then static grey blocks in the
 * shape of the greeting, the next deal, decisions, queue and calendar, the
 * three glance tiles, the five key numbers, the pipeline, the speed, stips
 * and brokers cards, and activity beside what's coming, at the heights the
 * real ones take (1440 wide), so nothing jumps when the content fades in.
 */
export function HomeSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1.5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-[32px] w-[314px] max-w-full rounded-[8px]" />
          <Skeleton className="mt-2.5 h-[17px] w-[314px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <section className={grid300}>
        <Skeleton className="h-[319px] rounded-card-lg" />
        <Skeleton className="h-[319px] rounded-card-lg" />
        <Skeleton className="rounded-card-lg [grid-row:span_2] max-[760px]:h-[644px] max-[760px]:[grid-row:auto]" />
        <Skeleton className="h-[312px] rounded-card-lg [grid-column:span_2] max-[760px]:[grid-column:auto]" />
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[89px] rounded-card" />
        ))}
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[176px] rounded-card-lg" />
        ))}
      </section>
      <Skeleton className="h-[214px] rounded-card-lg" />
      <section className={grid300}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[341px] rounded-card-lg" />
        ))}
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
        <Skeleton className="h-[302px] rounded-card-lg" />
        <Skeleton className="h-[302px] rounded-card-lg" />
      </section>
    </SkeletonPage>
  );
}
