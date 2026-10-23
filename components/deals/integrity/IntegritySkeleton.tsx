import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Integrity tab while the deal's checks load: static grey blocks in the
 * shape of the verdict beside what was checked, the document table, the
 * evidence beside the pattern checks, the application signals, and live
 * bank data beside the review, at the heights the real ones take (1440
 * wide), so nothing jumps when the content fades in.
 */
export function IntegritySkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        <Skeleton className={`h-[177px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[177px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[553px] rounded-card-lg" />
      <div className={row}>
        <Skeleton className={`h-[625px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[625px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[230px] rounded-card-lg" />
      <div className={row}>
        <Skeleton className="h-[297px] rounded-card-lg" />
        <Skeleton className={`h-[297px] rounded-card-lg ${span2}`} />
      </div>
    </SkeletonPage>
  );
}
