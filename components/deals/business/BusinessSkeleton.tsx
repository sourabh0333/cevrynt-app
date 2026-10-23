import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Business & owners tab while the deal's records load: static grey
 * blocks in the shape of the business beside its location, the
 * cross-check matrix, the owner beside public records, and online
 * presence, at the heights the real ones take (1440 wide), so nothing
 * jumps when the content fades in.
 */
export function BusinessSkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        <Skeleton className={`h-[427px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[427px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[390px] rounded-card-lg" />
      <div className={row}>
        <Skeleton className={`h-[443px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[443px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[200px] rounded-card-lg" />
    </SkeletonPage>
  );
}
