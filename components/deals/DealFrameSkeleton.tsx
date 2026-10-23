import Link from "next/link";
import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { dealHeader } from "@/lib/copy/deal";

/* The nine tab pills' widths at 1440 wide, so the bar doesn't shift when the tabs arrive. */
const tabWidths = [86, 99, 138, 92, 152, 163, 140, 132, 73];

/**
 * The deal frame while the deal loads: the breadcrumb and tools, a static
 * grey block where the header card goes, and the tab bar's pills, at the
 * heights the real ones take, so the tab content below never jumps.
 */
export function DealFrameSkeleton() {
  return (
    <SkeletonPage>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-cap font-semibold uppercase text-muted">
          <Link href={dealHeader.crumb.href} className="no-underline">{dealHeader.crumb.label}</Link>
          <span aria-hidden="true">/</span>
          <Skeleton className="h-3 w-40 rounded-[4px]" />
        </nav>
        <PageActions newIntake={false} compact />
      </div>
      <Skeleton className="h-[231px] rounded-[32px]" />
      <div className="flex h-[50px] gap-1 overflow-hidden">
        {tabWidths.map((w, i) => (
          <Skeleton key={i} className="h-[50px] flex-none rounded-pill" style={{ width: w }} />
        ))}
      </div>
    </SkeletonPage>
  );
}
