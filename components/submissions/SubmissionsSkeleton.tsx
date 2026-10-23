import Link from "next/link";
import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonOn, SkeletonPage } from "@/components/ui/Skeleton";
import { submissionsHeader } from "@/lib/copy/submissions";

/**
 * Submissions while the queue loads: the real title and header tools, then
 * static grey blocks in the shape of the six status cards, the toolbar and
 * filters, the queue beside its preview, and the three cards under them, at
 * the heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */
export function SubmissionsSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{submissionsHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[265px] max-w-full rounded-[6px]" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={submissionsHeader.archived.href} className="inline-flex h-11 items-center gap-2 rounded-tile bg-card px-4 text-body-sm font-semibold text-ink no-underline">
            {submissionsHeader.archived.label}
          </Link>
          <PageActions />
        </div>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-[128px] rounded-[26px]" />
        ))}
      </div>

      <div className="flex h-[42px] flex-wrap items-center justify-between gap-2.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[42px] w-[240px] rounded-pill" />
          {[96, 72, 104, 136].map((w) => (
            <Skeleton key={w} className="h-9 rounded-pill" style={{ width: w }} />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-[42px] w-[96px] rounded-tile" />
          <Skeleton className="h-[42px] w-[120px] rounded-tile" />
        </div>
      </div>

      <Skeleton className="h-[54px] rounded-tile-lg" />

      <div className="flex flex-wrap items-stretch gap-3.5">
        <div className="box-border flex h-[655px] min-w-0 flex-[999_1_640px] flex-col gap-2 overflow-hidden rounded-card-lg bg-card px-4 py-[18px]">
          <div className="h-[30px]" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 9 }, (_, i) => (
              <SkeletonOn key={i} className="h-[58px] rounded-[18px]" />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5">
          <Skeleton className="h-[339px] rounded-card-lg" />
          <Skeleton className="h-[302px] rounded-card-lg" />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[357px] rounded-card-lg" />
        ))}
      </div>

      <div className="h-4" />
    </SkeletonPage>
  );
}
