import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { offersHeader } from "@/lib/copy/offers";

/**
 * Offers & funding while it loads: the real title and header tools, then
 * static grey blocks in the shape of the six stat tiles, the stepper, the
 * funding queue, expiring offers beside commissions, money sent and the
 * offers that didn't fund, at the heights the real ones take (1440 wide),
 * so nothing jumps when the content fades in.
 */
export function OffersSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{offersHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[420px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <div className="grid grid-cols-6 gap-3.5 max-[1180px]:grid-cols-3 max-[640px]:grid-cols-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-[135px] rounded-[28px]" />
        ))}
      </div>
      <Skeleton className="h-[462px] rounded-card-lg" />
      <Skeleton className="h-[318px] rounded-card-lg" />
      <div className="grid grid-cols-2 gap-3.5 max-[760px]:grid-cols-1">
        <Skeleton className="h-[346px] rounded-card-lg" />
        <Skeleton className="h-[346px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[222px] rounded-card-lg" />
      <Skeleton className="h-[231px] rounded-card-lg" />
    </SkeletonPage>
  );
}
