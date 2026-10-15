import Link from "next/link";
import { Ring } from "@/components/ui/Ring";
import type { GlanceItem } from "@/lib/sample-data/home";

function Lead({ item }: { item: GlanceItem }) {
  const lead = item.lead;
  if (lead.kind === "number") {
    return (
      <span className="grid h-11 w-11 flex-none place-items-center rounded-tile bg-tile font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em] text-red-text">
        {lead.value}
      </span>
    );
  }
  if (lead.kind === "ring") {
    return (
      <Ring value={lead.percent} size={44} stroke={5} color="teal" ariaLabel={lead.label} animate={false}>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-tile font-mono text-[10px] text-ink">
          {lead.label}
        </span>
      </Ring>
    );
  }
  return (
    <span className="grid h-11 w-11 flex-none place-items-center rounded-tile bg-purple-bg text-label-sm font-bold text-purple-text">
      {lead.value}
    </span>
  );
}

/** "Today at a glance" from design/Main.html: three link cards, each to its page. */
export function GlanceStrip({ items }: { items: GlanceItem[] }) {
  return (
    <section
      aria-label="Today at a glance"
      className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5"
    >
      {items.map((item) => {
        const red = item.tone === "red";
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3.5 rounded-card px-4 py-3.5 text-ink no-underline ${
              red ? "bg-red-bg" : "border border-line bg-tile"
            }`}
          >
            <Lead item={item} />
            <span className="min-w-0 flex-1">
              <b className="block text-body">{item.title}</b>
              <span className={`text-label ${red ? "text-red-deep" : "text-hint"}`}>
                {item.note}
                {item.noteTail ? (
                  <span className="font-semibold text-coral-text">{item.noteTail}</span>
                ) : null}
              </span>
            </span>
            <span
              className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] ${
                red ? "bg-ink text-white" : "bg-card text-ink"
              }`}
            >
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        );
      })}
    </section>
  );
}
