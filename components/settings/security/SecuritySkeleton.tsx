import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Security while it loads: static grey blocks in the shape of the score
 * beside what to fix, the sign-in and data switches, today's sign-ins,
 * outside users beside support access, and the bottom three panels, at
 * the heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */
export function SecuritySkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[242px] rounded-card-lg" />
      <Skeleton className="h-[365px] rounded-card-lg" />
      <Skeleton className="h-[370px] rounded-card-lg" />
      <Skeleton className="h-[296px] rounded-card-lg" />
      <Skeleton className="h-[203px] rounded-card-lg" />
    </SkeletonPage>
  );
}
