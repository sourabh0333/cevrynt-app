import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Plan & usage while it loads: static grey blocks in the shape of the plan
 * card, this month's usage, what's included, the overage and channel
 * panel, the plans and billing, at the heights the real ones take (1440
 * wide), so nothing jumps when the content fades in.
 */
export function PlanSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[136px] rounded-card-lg" />
      <Skeleton className="h-[377px] rounded-card-lg" />
      <Skeleton className="h-[222px] rounded-card-lg" />
      <Skeleton className="h-[271px] rounded-card-lg" />
      <Skeleton className="h-[408px] rounded-card-lg" />
      <Skeleton className="h-[273px] rounded-card-lg" />
    </SkeletonPage>
  );
}
