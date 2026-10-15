import Link from "next/link";
import type { HomeHeader as HomeHeaderData } from "@/lib/sample-data/home";

/** Page header from design/Main.html: greeting, queue link, search, bell, New intake. */
export function HomeHeader({ data }: { data: HomeHeaderData }) {
  return (
    <header className="mb-1.5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
          {data.greeting}
        </h1>
        <Link
          href={data.queueHref}
          className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink no-underline"
        >
          {data.queueLine}
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex h-11 min-w-[260px] cursor-pointer items-center gap-2.5 rounded-tile border-0 bg-card pr-2 pl-3.5 text-body-sm text-hint"
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          {data.searchPlaceholder}
          <span className="ml-auto rounded-[8px] bg-tile px-[7px] py-[3px] font-mono text-label-sm">⌘K</span>
        </button>

        <button
          type="button"
          aria-label={`Notifications, ${data.unreadNotifications} unread`}
          className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-tile border-0 bg-card text-ink"
        >
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-2.5 right-[11px] h-2 w-2 rounded-full border-2 border-tile bg-red" />
        </button>

        <Link
          href="/intake"
          className="inline-flex h-11 items-center gap-2 rounded-tile bg-teal px-[18px] text-body-sm font-semibold text-white no-underline"
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New intake
        </Link>
      </div>
    </header>
  );
}
