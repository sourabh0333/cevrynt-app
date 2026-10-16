import Link from "next/link";

/**
 * The action cluster at the top right of internal pages (design/Main.html,
 * Tasks.html): search, notifications, New intake. Search and the bell are
 * static for now.
 */
export function PageActions({
  unread = 4,
  newIntake = true,
  compact = false,
}: {
  unread?: number;
  /** Intake pages drop the New intake button. */
  newIntake?: boolean;
  /** Deal pages (design/Deal-Summary.html): 42px controls and a short "Search". */
  compact?: boolean;
}) {
  const size = compact ? "h-[42px]" : "h-11";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={`flex ${size} ${compact ? "min-w-[220px]" : "min-w-[260px]"} cursor-pointer items-center gap-2.5 rounded-tile border-0 bg-card pr-2 pl-3.5 text-body-sm text-hint`}
      >
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        {compact ? "Search" : "Search deals, merchants, pages"}
        <span className="ml-auto rounded-[8px] bg-tile px-[7px] py-[3px] font-mono text-label-sm">⌘K</span>
      </button>

      <button
        type="button"
        aria-label={`Notifications, ${unread} unread`}
        className={`relative grid ${size} ${compact ? "w-[42px]" : "w-11"} cursor-pointer place-items-center rounded-tile border-0 bg-card text-ink`}
      >
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
        </svg>
        <span className="absolute top-2.5 right-[11px] h-2 w-2 rounded-full border-2 border-tile bg-red" />
      </button>

      {newIntake ? (
        <Link
          href="/intake"
          className="inline-flex h-11 items-center gap-2 rounded-tile bg-teal px-[18px] text-body-sm font-semibold text-white no-underline"
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New intake
        </Link>
      ) : null}
    </div>
  );
}
