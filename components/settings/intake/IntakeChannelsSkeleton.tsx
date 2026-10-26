import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Intake channels while it loads: static grey blocks in the shape of the
 * header card, the channel tabs with Merchant Link, the channel results and
 * the steps every deal goes through, at the heights the real ones take
 * (1440 wide), so nothing jumps when the content fades in.
 */
export function IntakeChannelsSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[168px] rounded-card-lg" />
      <Skeleton className="h-[437px] rounded-card-lg" />
      <Skeleton className="h-[248px] rounded-card-lg" />
      <Skeleton className="h-[203px] rounded-card-lg" />
    </SkeletonPage>
  );
}
