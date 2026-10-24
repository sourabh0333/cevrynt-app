import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { renewalsHeader } from "@/lib/copy/renewals";

/**
 * Renewals while it loads: the real title and header tools, then static
 * grey blocks in the shape of the hero, the radar beside the offer panel,
 * the ready cards, outreach beside broker pay and the bottom panel, at
 * the heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */
export function RenewalsSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{renewalsHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[382px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <Skeleton className="h-[290px] rounded-[32px]" />
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[753px] min-w-0 flex-[999_1_560px] rounded-card-lg" />
        <Skeleton className="h-[753px] min-w-0 max-w-full flex-[1_1_320px] rounded-card-lg" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[54px] w-[260px] max-w-full rounded-[12px]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200.5px] rounded-[26px]" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <Skeleton className="col-span-2 h-[321px] rounded-card-lg max-[980px]:col-span-1" />
        <Skeleton className="h-[321px] rounded-card-lg" />
      </div>
      <Skeleton className="h-[369px] rounded-card-lg" />
    </SkeletonPage>
  );
}
