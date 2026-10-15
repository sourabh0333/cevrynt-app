import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Activity, ActivityKind } from "@/lib/sample-data/home";

const look: Record<ActivityKind, { bg: string; stroke: string; path: string }> = {
  stacking: { bg: "bg-red-bg", stroke: "stroke-coral-text", path: "M12 2l8 4-8 4-8-4zM4 12l8 4 8-4" },
  check: { bg: "bg-mint-bg", stroke: "stroke-teal", path: "M5 12l5 5 9-10" },
  upload: { bg: "bg-blue-bg", stroke: "stroke-blue-deep", path: "M12 15V3M7 8l5-5 5 5M5 21h14" },
  message: { bg: "bg-amber-bg", stroke: "stroke-amber-text", path: "M4 4h16v12H7l-3 3z" },
};

/** "Recent activity" from design/Main.html: icon tile, text, time, hairlines between rows. */
export function ActivityCard({ data }: { data: Activity }) {
  return (
    <article
      aria-labelledby="h-act"
      className="flex flex-col gap-2.5 rounded-card-lg bg-card p-5 text-ink [grid-column:span_2] max-[760px]:[grid-column:auto]"
    >
      <SectionHeader title="Recent activity" titleId="h-act" link={{ label: "View all", href: data.href }} />
      <div className="flex flex-col">
        {data.items.map((item, i) => {
          const l = look[item.kind];
          const last = i === data.items.length - 1;
          return (
            <div
              key={item.id}
              className={`grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 py-2.5 ${
                last ? "" : "border-b border-line"
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-[12px] ${l.bg}`}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={l.stroke}>
                  <path d={l.path} />
                </svg>
              </span>
              <span className="min-w-0 text-body-sm">
                <b>{item.title}</b>
                <span className="text-hint">{item.detail}</span>
              </span>
              <span className="text-[11.5px] whitespace-nowrap text-hint">{item.when}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
