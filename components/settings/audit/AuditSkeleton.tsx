import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Audit log while it loads: static grey blocks in the shape of the header
 * beside today's counts, the log beside the entry detail, the three cards
 * under them and the life of an entry, at the heights the real ones take
 * (1440 wide), so nothing jumps when the content fades in.
 */
export function AuditSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[217px] rounded-card-lg" />
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[494px] min-w-0 flex-[999_1_460px] rounded-card-lg" />
        <Skeleton className="h-[494px] min-w-0 max-w-full flex-[1_1_300px] rounded-card-lg" />
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[284px] rounded-[28px]" />
        ))}
      </div>
      <Skeleton className="h-[204px] rounded-card-lg" />
    </SkeletonPage>
  );
}
