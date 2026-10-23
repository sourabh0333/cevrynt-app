import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";

const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";

/**
 * Workspace while its details load: static grey blocks in the shape of the
 * header card, Company, Brand, the money flow, Notifications and the row of
 * three cards, at the heights the real ones take (1440 wide), so nothing
 * jumps when the content fades in.
 */
export function WorkspaceSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[110px] rounded-card-lg" />

      <div className="box-border flex h-[239px] flex-col gap-3 overflow-hidden rounded-card-lg bg-card p-5">
        <SkeletonOn className="h-[22px] w-28 rounded-[8px]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonOn key={i} className="h-[42px] rounded-[12px]" />
          ))}
        </div>
      </div>

      <div className="@container box-border flex h-[277px] gap-[18px] overflow-hidden rounded-card-lg border border-line bg-tile p-5">
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-3">
          <Skeleton className="h-[22px] w-24 rounded-[8px]" />
          <Skeleton className="h-10 w-48 rounded-tile" />
          <Skeleton className="mt-auto h-[60px] rounded-[16px]" />
        </div>
        <div className="grid min-w-0 flex-[3_1_480px] grid-cols-3 gap-2.5 @max-[640px]:hidden">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-full rounded-tile-lg" />
          ))}
        </div>
      </div>

      <div className="box-border flex h-[476px] flex-col gap-4 overflow-hidden rounded-card-lg bg-card p-[22px]">
        <SkeletonOn className="h-12 w-72 max-w-full rounded-[10px]" />
        <div className="grid grid-cols-[minmax(0,1fr)_110px_minmax(0,1.2fr)_110px_minmax(0,1fr)] gap-2">
          <SkeletonOn className="h-[235px] rounded-[22px]" />
          <span />
          <SkeletonOn className="h-[235px] rounded-[22px]" />
          <span />
          <SkeletonOn className="h-[235px] rounded-[22px]" />
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-panel-border pt-3.5">
          {[0, 1, 2].map((i) => (
            <SkeletonOn key={i} className="h-[72px] rounded-[18px]" />
          ))}
        </div>
      </div>

      <div className="box-border flex h-[436px] flex-col gap-3 overflow-hidden rounded-card-lg border border-line bg-tile p-5">
        <div className="flex h-[43px] flex-col justify-center gap-2">
          <Skeleton className="h-[22px] w-36 rounded-[8px]" />
          <Skeleton className="h-3.5 w-80 max-w-full rounded-[6px]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-[17px]" />
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-[42px] rounded-tile" />
          ))}
        </div>
      </div>

      <div className="@container">
        <div className={row3}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[267px] rounded-card-lg" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
