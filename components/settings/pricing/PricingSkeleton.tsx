import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";

const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";

/**
 * Pricing & disclosures while it loads: static grey blocks in the shape of
 * the header card, the factor grid beside its example, the two rows of
 * three cards and the disclosure table, at the heights the real ones take
 * (1440 wide), so nothing jumps when the content fades in.
 */
export function PricingSkeleton() {
  return (
    <SkeletonPage>
      <Skeleton className="h-[163px] rounded-card-lg" />

      <div className="flex flex-wrap items-stretch gap-3.5">
        <div className="box-border flex h-[322px] min-w-0 flex-[999_1_440px] flex-col gap-3 overflow-hidden rounded-card-lg bg-card p-5">
          <div className="flex flex-col gap-2">
            <SkeletonOn className="h-[22px] w-32 rounded-[8px]" />
            <SkeletonOn className="h-3.5 w-3/4 rounded-[6px]" />
          </div>
          <div className="grid grid-cols-[110px_repeat(3,minmax(0,1fr))] gap-1.5">
            <span className="h-4" />
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-4" />
            ))}
            {Array.from({ length: 3 }, (_, r) => (
              <div key={r} className="contents">
                <SkeletonOn className="h-[54px] rounded-tile" />
                {[0, 1, 2].map((c) => (
                  <SkeletonOn key={c} className="h-[54px] rounded-tile" />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="box-border flex h-[322px] min-w-0 flex-[1_1_280px] flex-col gap-2.5 overflow-hidden rounded-card-lg border border-line bg-tile p-5">
          <Skeleton className="h-5 w-28 rounded-pill" />
          <Skeleton className="h-12 w-full rounded-[8px]" />
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[62px] rounded-tile" />
            ))}
          </div>
        </div>
      </div>

      <div className="@container flex flex-col gap-3.5">
        <div className={row3}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[249px] rounded-card-lg" />
          ))}
        </div>
        <div className={row3}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[332px] rounded-card-lg" />
          ))}
        </div>
        <div className="box-border flex h-[463px] flex-col gap-3 overflow-hidden rounded-card-lg bg-card p-[22px]">
          <div className="flex flex-col gap-2">
            <SkeletonOn className="h-[22px] w-64 max-w-full rounded-[8px]" />
            <SkeletonOn className="h-3.5 w-80 max-w-full rounded-[6px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4" />
            {Array.from({ length: 5 }, (_, i) => (
              <SkeletonOn key={i} className="h-[41px] rounded-[16px]" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SkeletonOn className="h-[58px] rounded-[16px]" />
            <SkeletonOn className="h-[58px] rounded-[16px]" />
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
