import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Cash flow tab while the deal's statements load: static grey blocks
 * in the shape of the revenue breakdown beside Statements, the month
 * table, Room to pay beside the weekly chart, the three source cards and
 * the transactions list, at the heights the real ones take (1440 wide),
 * so nothing jumps when the content fades in.
 */
export function CashFlowSkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        <Skeleton className={`h-[482px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[482px] rounded-card-lg" />
      </div>

      <div className="box-border flex h-[370px] flex-col gap-3.5 overflow-hidden rounded-card-lg bg-card p-[22px]">
        <div className="flex h-12 flex-col justify-center gap-2">
          <SkeletonOn className="h-[22px] w-44 rounded-[8px]" />
          <SkeletonOn className="h-3.5 w-72 max-w-full rounded-[6px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-[22px]" />
          {Array.from({ length: 5 }, (_, i) => (
            <SkeletonOn key={i} className="h-[45px] rounded-[16px]" />
          ))}
        </div>
      </div>

      <div className={row}>
        <Skeleton className="h-[422px] rounded-card-lg" />
        <Skeleton className={`h-[422px] rounded-card-lg ${span2}`} />
      </div>

      <div className={row}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[318px] rounded-card-lg" />
        ))}
      </div>

      <div className="box-border flex h-[658px] flex-col gap-3.5 overflow-hidden rounded-card-lg bg-card p-[22px]">
        <div className="flex h-12 items-center justify-between gap-2.5">
          <SkeletonOn className="h-[22px] w-36 rounded-[8px]" />
          <SkeletonOn className="h-10 w-[240px] rounded-pill" />
        </div>
        <div className="flex h-9 gap-1.5">
          {[72, 104, 108, 128, 96].map((w) => (
            <SkeletonOn key={w} className="h-9 rounded-pill" style={{ width: w }} />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-[22px]" />
          {Array.from({ length: 8 }, (_, i) => (
            <SkeletonOn key={i} className="h-[52px] rounded-tile" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
