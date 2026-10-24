import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Renewal rules while it loads: static grey blocks in the shape of the
 * header card, the rules beside the live ready list, what they're
 * offered, the approval panel, the outreach steps and the never-offer
 * card, at the heights the real ones take (1440 wide), so nothing jumps
 * when the content fades in.
 */
export function RenewalRulesSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[105px] rounded-card-lg" />
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[580px] min-w-0 flex-[999_1_420px] rounded-card-lg" />
        <Skeleton className="h-[580px] min-w-0 max-w-full flex-[1_1_300px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[305px] rounded-card-lg" />
      <Skeleton className="h-[277px] rounded-card-lg" />
      <Skeleton className="h-[330px] rounded-card-lg" />
      <Skeleton className="h-[164px] rounded-card-lg" />
    </SkeletonPage>
  );
}
