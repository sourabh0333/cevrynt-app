import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";

const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";

/**
 * Team & roles while the team loads: static grey blocks in the shape of the
 * header card, the People list (7 people and an invite), the permissions
 * grid and the two rows of three cards, at the heights the real ones take
 * (1440 wide), so nothing jumps when the content fades in.
 */
export function TeamSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[105px] rounded-card-lg" />

      <div className="box-border flex h-[620px] flex-col gap-2.5 overflow-hidden rounded-card-lg bg-card p-5">
        <div className="flex h-12 flex-col justify-center gap-2">
          <SkeletonOn className="h-[22px] w-24 rounded-[8px]" />
          <SkeletonOn className="h-3.5 w-48 rounded-[6px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex h-7 items-end px-3.5 pb-1">
            <SkeletonOn className="h-2.5 w-2/3 rounded-[4px]" />
          </div>
          {Array.from({ length: 7 }, (_, i) => (
            <SkeletonOn key={i} className="h-14 rounded-[16px]" />
          ))}
          <SkeletonOn className="h-[58px] rounded-[16px]" />
        </div>
      </div>

      <div className="box-border flex h-[740px] flex-col gap-3 overflow-hidden rounded-card-lg border border-line bg-tile p-5">
        <div className="flex h-12 flex-col justify-center gap-2">
          <Skeleton className="h-[22px] w-56 rounded-[8px]" />
          <Skeleton className="h-3.5 w-40 rounded-[6px]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-[38px]" />
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton key={i} className="h-[46px] rounded-[12px]" />
          ))}
        </div>
      </div>

      <div className="@container flex flex-col gap-3.5">
        <div className={row3}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[296px] rounded-card-lg" />
          ))}
        </div>
        <div className={row3}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[287px] rounded-card-lg" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
