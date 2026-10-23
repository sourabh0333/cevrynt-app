import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Decision & memo tab while the deal's decision loads: static grey
 * blocks in the shape of the decision card beside the policy check, the
 * credit memo, and who signs off beside the decision record, at the
 * heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */
export function DecisionSkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        <Skeleton className={`h-[625px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[625px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[1209px] rounded-card-lg" />
      <div className={row}>
        <Skeleton className="h-[280px] rounded-card-lg" />
        <Skeleton className={`h-[280px] rounded-card-lg ${span2}`} />
      </div>
    </SkeletonPage>
  );
}
