import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Queue, QueueTone } from "@/lib/sample-data/home";

const tile: Record<QueueTone, string> = {
  light: "bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] border border-[#E3EFEA] text-ink",
  amber: "bg-[linear-gradient(140deg,#A85C0B,#D98A2B)] text-white",
  blue: "bg-[linear-gradient(140deg,#24588A,#4F86BD)] text-white",
  red: "bg-[linear-gradient(140deg,#A3341F,#C2412D)] text-white",
  grey: "bg-[linear-gradient(140deg,#3E4A46,#6B7873)] text-white",
  purple: "bg-[linear-gradient(140deg,#57418A,#8670B8)] text-white",
};

/**
 * "My queue" from design/Main.html: the darker card with the on-time bar
 * and a list of deals, oldest first, with a check for those decided today.
 */
export function QueueCard({ data }: { data: Queue }) {
  return (
    <article
      aria-labelledby="h-q"
      className="box-border flex flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink [grid-row:span_2] max-[760px]:[grid-row:auto]"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 id="h-q" className="m-0 font-heading text-card-title-lg font-semibold">
            My queue
          </h2>
          <div className="mt-[3px] text-label text-hint">Oldest first · checked = decided today</div>
        </div>
        <div className="text-right">
          <span className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
            {data.onTimePercent}%
          </span>
          <div className="mt-1 text-cap font-semibold uppercase text-hint">On time today</div>
        </div>
      </div>

      <div>
        <ProgressBar value={data.onTimePercent} height={6} color="teal" track="ink" />
        <div className="mt-1.5 flex justify-between text-[10px] font-semibold tracking-[0.08em] uppercase text-hint">
          <span>0%</span>
          <span>Target {data.targetPercent}%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {data.items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="grid grid-cols-[52px_minmax(0,1fr)_30px] items-center gap-3 rounded-[18px] bg-white/65 py-[7px] pr-2 pl-[7px] text-ink no-underline"
          >
            <span
              className={`grid h-[52px] w-[52px] place-items-center rounded-tile font-heading text-[15px] font-semibold ${tile[item.tone]}`}
            >
              {item.initials}
            </span>
            <span className="min-w-0">
              <b className="block truncate text-body-sm">{item.merchant}</b>
              <span className="mt-0.5 flex items-center gap-2 text-[11.5px] text-hint">
                <Chip size="sm" color={item.statusColor} className="px-2 py-0.5 text-[10.5px]">
                  {item.status}
                </Chip>
                {item.amount} · {item.time}
              </span>
            </span>
            {item.decided ? (
              <span aria-label="Decided" className="grid h-7 w-7 place-items-center rounded-full bg-ink">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5 9-10" />
                </svg>
              </span>
            ) : (
              <span aria-label="Not decided yet" className="box-border h-7 w-7 rounded-full border-[1.5px] border-ink/30" />
            )}
          </Link>
        ))}
      </div>
    </article>
  );
}
