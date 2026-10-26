import Link from "next/link";
import type { CSSProperties } from "react";
import type { CalendarEvent, WeekCalendar as WeekCalendarData } from "@/lib/copy/home";

const pill = {
  teal: "bg-teal text-white",
  amber: "bg-amber-bg text-amber-text",
  mint: "bg-mint-bg text-teal-dark",
};
const avatarFill = { sand: "bg-sand", mint: "bg-mint-soft" };
// Avatar ring color follows the pill: ink on teal, the pill color otherwise.
const avatarRing = { teal: "border-ink", amber: "border-amber-bg", mint: "border-mint-bg" };

function Event({ ev }: { ev: CalendarEvent }) {
  const style: CSSProperties & { "--i"?: number } = {
    gridColumn: `${ev.day + 1} / span ${ev.span}`,
    gridRow: ev.hour + 1,
    "--i": ev.order,
  };
  return (
    <Link
      href={ev.href}
      style={style}
      className={`anim-cal-in box-border flex h-8 max-w-full items-center gap-2 self-center justify-self-start rounded-pill py-0 pr-1 pl-3 text-[11.5px] font-semibold whitespace-nowrap no-underline ml-2.5 ${pill[ev.tone]}`}
    >
      <span className="truncate">{ev.title}</span>
      <span className="flex">
        {ev.avatars.map((a, i) => (
          <span
            key={a.initials}
            className={`grid h-[22px] w-[22px] place-items-center rounded-full border-2 text-[8.5px] font-bold text-ink ${avatarFill[a.fill]} ${avatarRing[ev.tone]} ${i ? "-ml-1.5" : ""}`}
          >
            {a.initials}
          </span>
        ))}
      </span>
    </Link>
  );
}

/**
 * Week calendar from design/Main.html: 52px hour column plus seven days,
 * 22px header row and five 40px hour rows, dashed day lines, a red "now"
 * line that sweeps in, and event pills that slide in one after another.
 */
export function WeekCalendar({ data }: { data: WeekCalendarData }) {
  return (
    <article
      aria-labelledby="h-cal"
      className="box-border flex min-h-[290px] flex-col gap-3 rounded-card-lg bg-card p-5 text-ink [grid-column:span_2] max-[760px]:[grid-column:auto]"
    >
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-pill border-0 bg-tile px-3.5 text-label font-semibold">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Last week
        </button>
        <h2 id="h-cal" className="m-0 font-heading text-card-title-lg font-semibold">
          {data.title}
        </h2>
        <button type="button" className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-pill border-0 bg-tile px-3.5 text-label font-semibold">
          Next week
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="scrollbar-none overflow-x-auto">
        <div className="grid min-w-[620px] flex-1 grid-cols-[52px_repeat(7,minmax(0,1fr))] grid-rows-[22px_repeat(5,40px)] text-label-sm text-hint">
          <span />
          {data.days.map((d) => (
            <span
              key={d.label}
              className={`text-center text-cap font-semibold uppercase ${d.today ? "text-teal" : ""}`}
            >
              {d.label}
            </span>
          ))}
          {data.hours.map((h, i) => (
            <span key={h} style={{ gridColumn: 1, gridRow: i + 2 }}>
              {h}
            </span>
          ))}
          {data.days.map((d, i) => (
            <span
              key={`line-${d.label}`}
              style={{ gridColumn: i + 2, gridRow: "2 / span 5" }}
              className="border-l border-dashed border-line-soft"
            />
          ))}
          <span
            className="anim-cal-now h-0.5 self-center rounded-[2px] bg-red"
            style={{ gridColumn: data.now.day + 1, gridRow: data.now.hour + 1 }}
          />
          {data.events.map((ev) => (
            <Event key={ev.id} ev={ev} />
          ))}
        </div>
      </div>
    </article>
  );
}
