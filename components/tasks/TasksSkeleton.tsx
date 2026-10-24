import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { tasksCopy as c } from "@/lib/copy/tasks";

/**
 * My tasks while the tasks load: the real title and header tools, then
 * static grey blocks in the shape of the day panel, the agenda and the
 * waiting and done panel, at the heights the real ones take (1440 wide),
 * so nothing jumps when the content fades in.
 */
export function TasksSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{c.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[260px] max-w-full rounded-[6px]" />
        </div>
        <PageActions />
      </header>
      <Skeleton className="h-[226px] rounded-card-lg" />
      <Skeleton className="h-[969px] rounded-card-lg" />
      <Skeleton className="h-[297px] rounded-card-lg" />
    </SkeletonPage>
  );
}
