import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";
import { comingHeader as ch } from "@/lib/copy/coming";

const duo = "grid grid-cols-2 gap-1 @max-[760px]:grid-cols-1";
const panel = "box-border min-w-0 rounded-card-lg border border-line bg-tile p-2";

/**
 * What's coming while its features load: the real title and header tools,
 * then static grey blocks in the shape of the hero, the roadmap and the
 * shipped / idea panels, at the heights the real ones take (1440 wide), so
 * nothing jumps when the content fades in.
 */
export function ComingSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{ch.title}</h1>
          <Skeleton className="mt-2.5 h-4 w-[392px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>

      <div className="@container flex flex-col gap-3.5">
        <div className={`${duo} ${panel}`}>
          <Skeleton className="h-[156px] rounded-card" />
          <div className="grid content-center grid-cols-3 gap-2 p-3.5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[78px] rounded-[18px]" />
            ))}
          </div>
        </div>

        <div className={`${duo} ${panel}`}>
          <div className="flex flex-col gap-3.5 rounded-card bg-card p-[18px]">
            <SkeletonOn className="h-[42px] w-1/2 rounded-[8px]" />
            <SkeletonOn className="h-[46px] rounded-[16px]" />
            {[0, 1, 2].map((i) => (
              <SkeletonOn key={i} className="h-[68px] rounded-[18px]" />
            ))}
            <SkeletonOn className="h-5 rounded-[8px]" />
          </div>
          <div className="flex flex-col gap-3 p-[18px]">
            <Skeleton className="h-6 w-1/3 rounded-pill" />
            <Skeleton className="h-7 w-2/3 rounded-[8px]" />
            <Skeleton className="h-[60px] rounded-[12px]" />
            <Skeleton className="h-[76px] rounded-[16px]" />
            <Skeleton className="h-[84px] rounded-[12px]" />
            <Skeleton className="mt-auto h-[42px] rounded-pill" />
          </div>
        </div>

        <div className={`${duo} ${panel}`}>
          <div className="flex flex-col gap-2.5 p-4">
            <Skeleton className="h-10 w-1/2 rounded-[8px]" />
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[38px] rounded-tile" />
            ))}
          </div>
          <Skeleton className="h-[216px] rounded-card" />
        </div>
      </div>
    </SkeletonPage>
  );
}
