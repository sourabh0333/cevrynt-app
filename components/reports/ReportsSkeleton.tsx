import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { reportsHeader } from "@/lib/copy/reports";

/**
 * Reports while it loads: the real title, line and header tools, then
 * static grey blocks in the shape of the period switch, the scoreboard,
 * the funnel beside the monthly chart, declines, unit economics, the team
 * and saved reports, at the heights the real ones take (1440 wide), so
 * nothing jumps when the content fades in.
 */
export function ReportsSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{reportsHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{reportsHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Skeleton className="h-[42px] w-[377px] max-w-full rounded-pill" />
        <Skeleton className="h-[40px] w-[195px] rounded-pill" />
      </div>
      <Skeleton className="h-[236px] rounded-[28px]" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
        <Skeleton className="h-[458px] rounded-card-lg" />
        <Skeleton className="h-[458px] rounded-card-lg" />
      </div>
      {[674, 432, 372].map((h) => (
        <Skeleton key={h} className="rounded-card-lg" style={{ height: h }} />
      ))}
      <div className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <Skeleton className="h-[314px] rounded-card-lg" />
        <Skeleton className="col-span-2 h-[314px] rounded-card-lg max-[980px]:col-span-1" />
      </div>
    </SkeletonPage>
  );
}
