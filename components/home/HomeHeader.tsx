import Link from "next/link";
import { PageActions } from "@/components/shell/PageActions";
import type { HomeHeader as HomeHeaderData } from "@/lib/sample-data/home";

/** Page header from design/Main.html: greeting, queue link, and the page actions. */
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
      <PageActions unread={data.unreadNotifications} />
    </header>
  );
}
