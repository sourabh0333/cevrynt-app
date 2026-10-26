import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Stips } from "@/lib/copy/home";

/** "Waiting on stips" from design/Main.html: count, three items, Send reminders. */
export function StipsCard({ data }: { data: Stips }) {
  return (
    <article aria-labelledby="h-stips" className="flex flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
      <SectionHeader
        title="Waiting on stips"
        titleId="h-stips"
        subtitle={data.subtitle}
        className="items-start"
        action={
          <span className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
            {data.count}
          </span>
        }
      />
      <div className="flex flex-col gap-2">
        {data.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-[16px] bg-tile px-3 py-2.5">
            <span className="min-w-0 flex-1">
              <b className="block truncate text-body-sm">{item.title}</b>
              <span className="text-[11.5px] text-hint">{item.detail}</span>
            </span>
            <Chip size="sm" color={item.statusColor} className="text-[10.5px]">
              {item.status}
            </Chip>
          </div>
        ))}
      </div>
      <Link
        href="/submissions"
        className="mt-auto grid h-10 place-items-center rounded-pill bg-teal text-[12.5px] font-semibold text-white no-underline"
      >
        Send reminders
      </Link>
    </article>
  );
}
