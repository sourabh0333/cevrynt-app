import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";

const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";
const span2 = "col-span-2 @max-[700px]:col-span-1";

/**
 * Policy while it loads: static grey blocks in the shape of the header
 * card, the rules beside the simulator, and the three rows of cards under
 * them, at the heights the real ones take (1440 wide), so nothing jumps
 * when the content fades in.
 */
export function PolicySkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[194px] rounded-card-lg" />

      <div className="@container">
        <div className="flex flex-wrap items-start gap-3.5">
          <div className="box-border flex h-[939px] min-w-0 flex-[999_1_460px] flex-col gap-3.5 overflow-hidden rounded-card-lg bg-card p-5">
            <div className="flex flex-col gap-2 pb-1">
              <SkeletonOn className="h-[22px] w-20 rounded-[8px]" />
              <SkeletonOn className="h-3.5 w-3/4 rounded-[6px]" />
            </div>
            {[3, 3, 2, 3].map((n, g) => (
              <div key={g} className="flex flex-col gap-1.5">
                <div className="flex h-[26px] items-end px-1">
                  <SkeletonOn className="h-3.5 w-32 rounded-[6px]" />
                </div>
                {Array.from({ length: n }, (_, i) => (
                  <SkeletonOn key={i} className="h-[52px] rounded-[16px]" />
                ))}
              </div>
            ))}
          </div>

          <div className="box-border flex h-[614px] min-w-0 max-w-full flex-[1_1_320px] flex-col gap-3.5 self-start overflow-hidden rounded-card-lg border border-line bg-tile p-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-28 rounded-pill" />
              <Skeleton className="h-[22px] w-40 rounded-[8px]" />
              <Skeleton className="h-3.5 w-full rounded-[6px]" />
            </div>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[38px] rounded-[10px]" />
            ))}
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[86px] rounded-[16px]" />
              ))}
            </div>
            <Skeleton className="h-[60px] rounded-[16px]" />
            <Skeleton className="h-10 rounded-pill" />
          </div>
        </div>
      </div>

      <div className="@container flex flex-col gap-3.5">
        <div className={row3}>
          <Skeleton className="h-[377px] rounded-card-lg" />
          <Skeleton className={`h-[377px] rounded-card-lg ${span2}`} />
        </div>
        <div className={row3}>
          <Skeleton className={`h-[327px] rounded-card-lg ${span2}`} />
          <Skeleton className="h-[327px] rounded-card-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3.5 @max-[520px]:grid-cols-1">
          <Skeleton className="h-[257px] rounded-card-lg" />
          <Skeleton className="h-[257px] rounded-card-lg" />
        </div>
      </div>
    </SkeletonPage>
  );
}
