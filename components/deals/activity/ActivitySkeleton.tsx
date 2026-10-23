import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Activity tab while the deal's activity loads: static grey blocks in
 * the shape of the four pace tiles, the timeline beside the note and
 * messages cards, and where the time went beside who opened it, at the
 * heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */
export function ActivitySkeleton() {
  return (
    <SkeletonPage>
      <div className="grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[107px] rounded-[26px]" />
        ))}
      </div>
      <div className={row}>
        <Skeleton className={`h-[632px] rounded-card-lg ${span2}`} />
        <div className="flex flex-col gap-3.5">
          <Skeleton className="h-[291px] rounded-card-lg" />
          <Skeleton className="h-[327px] rounded-card-lg" />
        </div>
      </div>
      <div className={row}>
        <Skeleton className={`h-[236px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[236px] rounded-card-lg" />
      </div>
    </SkeletonPage>
  );
}
