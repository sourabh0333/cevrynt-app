import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { merchantsHeader } from "@/lib/copy/merchants";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * Merchants while it loads: the real title and header tools, then static
 * grey blocks in the shape of the five tiles, the list beside its preview
 * column, the portfolio mix and the concentration row, at the heights the
 * real ones take (1440 wide), so nothing jumps when the content fades in.
 */
export function MerchantsSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{merchantsHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[307px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <div className="grid grid-cols-5 gap-3.5 max-[1100px]:grid-cols-3 max-[640px]:grid-cols-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[133px] rounded-[28px]" />
        ))}
      </div>
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[581px] min-w-0 flex-[999_1_640px] rounded-card-lg" />
        <Skeleton className="h-[581px] min-w-0 max-w-full flex-[1_1_320px] rounded-card-lg" />
      </div>
      <div className={row}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[356px] rounded-card-lg" />
        ))}
      </div>
      <div className={row}>
        <Skeleton className="col-span-2 h-[290px] rounded-card-lg max-[980px]:col-span-1" />
        <Skeleton className="h-[290px] rounded-card-lg" />
      </div>
    </SkeletonPage>
  );
}
