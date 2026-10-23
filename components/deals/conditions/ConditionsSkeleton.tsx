import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Conditions & stips tab while the deal's conditions load: static grey
 * blocks in the shape of the funding runway, the "Still needed" heading
 * with its three cards and the done strip, the three side cards and the
 * request composer, at the heights the real ones take (1440 wide), so
 * nothing jumps when the content fades in.
 */
export function ConditionsSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[403px] rounded-[32px]" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[54px] w-[320px] max-w-full rounded-tile" />
        <div className={row}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[312px] rounded-[26px]" />
          ))}
        </div>
        <Skeleton className="h-[106px] rounded-[26px]" />
      </div>
      <div className={row}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[333px] rounded-card-lg" />
        ))}
      </div>
      <Skeleton className="h-[402px] rounded-card-lg" />
    </SkeletonPage>
  );
}
