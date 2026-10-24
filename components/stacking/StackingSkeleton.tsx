import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { stackingHeader } from "@/lib/copy/stacking";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * Stacking Watch while it loads: the real title and header tools, then
 * static grey blocks in the shape of the summary row, the alerts beside
 * their detail, the connections map beside this month, and the rules
 * beside coverage, at the heights the real ones take (1440 wide), so
 * nothing jumps when the content fades in.
 */
export function StackingSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{stackingHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[355px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <div className={row}>
        <Skeleton className={`h-[200px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[200px] rounded-card-lg" />
      </div>
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[646px] min-w-0 flex-[999_1_640px] rounded-card-lg" />
        <Skeleton className="h-[646px] min-w-0 max-w-full flex-[1_1_330px] rounded-card-lg" />
      </div>
      <div className={row}>
        <Skeleton className={`h-[404px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[404px] rounded-card-lg" />
      </div>
      <div className={row}>
        <Skeleton className={`h-[309px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[309px] rounded-card-lg" />
      </div>
    </SkeletonPage>
  );
}
