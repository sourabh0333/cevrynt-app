import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { brokersHeader } from "@/lib/copy/brokers";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * Brokers while it loads: the real title and header tools, then static
 * grey blocks in the shape of the five tiles, the scorecards beside the
 * broker detail, and the three rows of cards under them, at the heights
 * the real ones take (1440 wide), so nothing jumps when the content fades in.
 */
export function BrokersSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{brokersHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[219px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[132px] rounded-[28px]" />
        ))}
      </div>
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[648px] min-w-0 flex-[999_1_640px] rounded-card-lg" />
        <Skeleton className="h-[648px] min-w-0 max-w-full flex-[1_1_330px] rounded-card-lg" />
      </div>
      {[304, 334, 309].map((h, i) => (
        <div key={i} className={row}>
          <Skeleton className={`rounded-card-lg ${span2}`} style={{ height: h }} />
          <Skeleton className="rounded-card-lg" style={{ height: h }} />
        </div>
      ))}
    </SkeletonPage>
  );
}
