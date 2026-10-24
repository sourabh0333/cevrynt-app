import { brokersSections, brokerSummary, type SummaryTone } from "@/lib/copy/brokers";
import type { BrokersData } from "@/lib/data/views/brokers";

const tone: Record<SummaryTone, { card: string; label: string; note: string }> = {
  mint: { card: "bg-mint-card border border-mint-border", label: "text-grey-text", note: "font-semibold text-teal-deep" },
  grey: { card: "bg-card", label: "text-hint", note: "text-hint" },
  cream: { card: "bg-cream", label: "text-amber-mute", note: "font-semibold text-amber-deep" },
  red: { card: "bg-red-bg", label: "text-red-text", note: "text-red-text" },
};

/** The five summary tiles at the top of design/Brokers.html. */
export function SummaryTiles({ data }: { data: BrokersData }) {
  return (
    <section aria-label={brokersSections.glance} className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
      {brokerSummary(data).map((s) => {
        const t = tone[s.tone];
        return (
          <article key={s.label} className={`box-border flex flex-col gap-1.5 rounded-[28px] p-5 text-ink ${t.card}`}>
            <span className={`text-label ${t.label}`}>{s.label}</span>
            <b className="font-heading text-[30px] leading-[1.05] font-semibold tabular-nums tracking-[-0.03em]">{s.value}</b>
            <span className={`text-label ${t.note}`}>{s.note}</span>
          </article>
        );
      })}
    </section>
  );
}
