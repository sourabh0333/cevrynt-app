import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { fundedHeader } from "@/lib/copy/funded";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * Funded deals while it loads: the real title and header tools, then
 * static grey blocks in the shape of today's payments beside the four
 * tiles, the book beside its detail panel, the three rows of cards and
 * the paying-off strip, at the heights the real ones take (1440 wide), so
 * nothing jumps when the content fades in.
 */
export function FundedSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{fundedHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[380px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <div className={row}>
        <Skeleton className={`h-[281px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[281px] rounded-card-lg" />
      </div>
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[426px] min-w-0 flex-[999_1_640px] rounded-card-lg" />
        <Skeleton className="h-[426px] min-w-0 max-w-full flex-[1_1_320px] rounded-card-lg" />
      </div>
      <div className={row}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[355px] rounded-card-lg" />
        ))}
      </div>
      <div className={row}>
        <Skeleton className={`h-[409px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[409px] rounded-card-lg" />
      </div>
      <div className={row}>
        <Skeleton className={`h-[291px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[291px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[114px] rounded-card-lg" />
    </SkeletonPage>
  );
}
