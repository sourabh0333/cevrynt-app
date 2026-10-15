import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Brokers } from "@/lib/sample-data/home";

const cols = "grid grid-cols-[minmax(0,1fr)_54px_54px_60px] gap-2";
const flagColor = (n: number) => (n === 0 ? "text-teal" : n < 3 ? "text-amber-text" : "text-coral-text");

/** "Top brokers" from design/Main.html: the deeper card with a four-column table. */
export function BrokersCard({ data }: { data: Brokers }) {
  return (
    <article aria-labelledby="h-brk" className="flex flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <SectionHeader
        title="Top brokers"
        titleId="h-brk"
        subtitle={data.subtitle}
        className="items-start"
        action={
          <Link
            href={data.href}
            className="rounded-pill bg-card px-3 py-[7px] text-cap font-semibold uppercase text-ink no-underline"
          >
            All brokers
          </Link>
        }
      />
      <div className={`${cols} px-3 text-cap font-semibold uppercase text-hint`}>
        <span>Broker</span>
        <span className="text-right">Sent</span>
        <span className="text-right">Funded</span>
        <span className="text-right">Flags</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.rows.map((r) => (
          <Link
            key={r.id}
            href={r.href}
            className={`${cols} items-center rounded-[16px] bg-white/65 px-3 py-2.5 text-ink no-underline`}
          >
            <b className="truncate text-body-sm">{r.name}</b>
            <span className="text-right font-heading tabular-nums tracking-[-0.03em]">{r.sent}</span>
            <span className="text-right font-heading font-semibold tabular-nums tracking-[-0.03em]">{r.funded}</span>
            <span className={`text-right text-label font-semibold ${flagColor(r.flags)}`}>{r.flags}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
