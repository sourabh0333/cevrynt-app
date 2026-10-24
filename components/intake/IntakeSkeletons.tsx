import Link from "next/link";
import { PageActions } from "@/components/shell/PageActions";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { bulkCopy, intakeHeader, packageCopy } from "@/lib/copy/intake";
import { manualCopy } from "@/lib/copy/intake-manual";

/*
 * The four Intake pages while their data loads: the real titles, back links
 * and header tools, then static grey blocks in the shape of each page at
 * the heights the real ones take (1440 wide), so nothing jumps when the
 * content fades in.
 */

const h1 = "m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink";

function BackHeader({ back, title, children }: { back: { label: string; href: string }; title: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link href={back.href} className="inline-flex items-center gap-1.5 text-cap font-semibold uppercase text-muted no-underline">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {back.label}
        </Link>
        <h1 className={`mt-2 mb-0 ${h1.replace("m-0 ", "")}`}>{title}</h1>
      </div>
      {children}
    </header>
  );
}

/** The Intake hub. */
export function IntakeSkeleton() {
  return (
    <SkeletonPage>
      <header className="mb-1.5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={h1}>{intakeHeader.title}</h1>
          <Skeleton className="mt-2.5 h-[17px] w-[300px] max-w-full rounded-[6px]" />
        </div>
        <PageActions newIntake={false} />
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[360px] rounded-card-lg" />
        ))}
      </div>
      <Skeleton className="h-[230px] rounded-card-lg" />
      <Skeleton className="h-[273px] rounded-card-lg" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        <Skeleton className="h-[365px] rounded-card-lg" />
        <Skeleton className="h-[365px] rounded-card-lg [grid-column:span_2] max-[760px]:[grid-column:auto]" />
      </div>
    </SkeletonPage>
  );
}

/** New manual lead: the stepper, the form card and the sticky fit check beside it. */
export function ManualSkeleton() {
  return (
    <SkeletonPage>
      <BackHeader back={manualCopy.back} title={manualCopy.title}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-[17px] w-[100px] rounded-[6px]" />
          <Link href={manualCopy.saveExit.href} className="inline-flex h-11 items-center rounded-tile bg-card px-4 text-body-sm font-semibold text-ink no-underline">
            {manualCopy.saveExit.label}
          </Link>
        </div>
      </BackHeader>
      <Skeleton className="h-[71px] rounded-[22px]" />
      <div className="flex flex-wrap items-start gap-3.5">
        <Skeleton className="h-[1097px] min-w-0 flex-[999_1_520px] rounded-card-lg" />
        <div className="flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5">
          <Skeleton className="h-[495px] rounded-card-lg" />
          <Skeleton className="h-[148px] rounded-card-lg" />
        </div>
      </div>
    </SkeletonPage>
  );
}

/** Single package upload: the file strip, what was found, and the match, fit check and assign cards. */
export function PackageSkeleton() {
  return (
    <SkeletonPage>
      <BackHeader back={packageCopy.back} title={packageCopy.title}>
        <Skeleton className="h-10 w-[160px] rounded-pill" />
      </BackHeader>
      <Skeleton className="h-[76px] rounded-[26px]" />
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[866px] min-w-0 flex-[999_1_520px] rounded-card-lg" />
        <div className="flex min-w-0 max-w-full flex-[1_1_320px] flex-col gap-3.5">
          <Skeleton className="h-[301px] rounded-card-lg" />
          <Skeleton className="h-[283px] rounded-card-lg" />
          <Skeleton className="h-[253px] rounded-card-lg" />
        </div>
      </div>
    </SkeletonPage>
  );
}

/** Bulk folder ZIP: the file strip, the four summary tiles, the folder preview beside its options, and the earlier batch. */
export function BulkSkeleton() {
  return (
    <SkeletonPage>
      <BackHeader back={bulkCopy.back} title={bulkCopy.title}>
        <span className="max-w-[360px] text-[12.5px] text-hint">{bulkCopy.note}</span>
      </BackHeader>
      <Skeleton className="h-[76px] rounded-[26px]" />
      <div className="grid grid-cols-4 gap-3.5 max-[820px]:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[94px] rounded-[28px]" />
        ))}
      </div>
      <div className="flex flex-wrap items-stretch gap-3.5">
        <Skeleton className="h-[574px] min-w-0 flex-[999_1_640px] rounded-card-lg" />
        <div className="flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5">
          <Skeleton className="h-[356px] rounded-card-lg" />
          <Skeleton className="h-[204px] rounded-card-lg" />
        </div>
      </div>
      <Skeleton className="h-[171px] rounded-card-lg" />
    </SkeletonPage>
  );
}
