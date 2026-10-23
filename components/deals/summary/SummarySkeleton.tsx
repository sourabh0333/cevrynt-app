import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Summary tab while the deal's analysis loads: static grey blocks in
 * the shape of the score, key numbers and recommendation, the chart beside
 * What needs a look, the checks beside the timeline, and the Ask strip, at
 * the heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */
export function SummarySkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[321px] rounded-card-lg" />
        ))}
      </div>
      {[441, 272].map((h) => (
        <div key={h} className={row}>
          <Skeleton className={`rounded-card-lg ${span2}`} style={{ height: h }} />
          <Skeleton className="rounded-card-lg" style={{ height: h }} />
        </div>
      ))}
      <Skeleton className="h-[81px] rounded-card-lg" />
    </SkeletonPage>
  );
}
