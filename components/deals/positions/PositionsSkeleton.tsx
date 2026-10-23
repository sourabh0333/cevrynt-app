import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Positions & debt tab while the deal's positions load: static grey
 * blocks in the shape of the three glance tiles, the position beside the
 * stacking check, stated vs found beside how we looked, and the payoff
 * scenario beside other debt, at the heights the real ones take (1440
 * wide), so nothing jumps when the content fades in.
 */
export function PositionsSkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[169px] rounded-card-lg" />
        ))}
      </div>
      {[558, 338, 355].map((h) => (
        <div key={h} className={row}>
          <Skeleton className={`rounded-card-lg ${span2}`} style={{ height: h }} />
          <Skeleton className="rounded-card-lg" style={{ height: h }} />
        </div>
      ))}
    </SkeletonPage>
  );
}
