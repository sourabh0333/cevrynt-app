import { pace } from "@/lib/sample-data/deal-activity";

const tone = {
  mint: "border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]",
  grey: "bg-card",
  sand: "bg-card-deep",
};

/** "Deal pace" from design/Deal-Activity.html: four tiles. The event count follows the timeline. */
export function PaceRow({ eventCount }: { eventCount: number }) {
  return (
    <section aria-label="Deal pace" className="grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
      {pace.map((p) => (
        <div key={p.label} className={`box-border rounded-[26px] p-[18px] text-ink ${tone[p.tone]}`}>
          <span className={`text-label ${p.tone === "grey" ? "text-hint" : "text-muted"}`}>{p.label}</span>
          <b className="block font-heading text-[26px] leading-[1.1] font-semibold tabular-nums tracking-[-0.03em]">{p.value === "count" ? eventCount : p.value}</b>
          <span className={`text-[11.5px] ${p.tone === "mint" ? "text-teal-deep" : p.tone === "grey" ? "text-hint" : "text-muted"}`}>{p.note}</span>
        </div>
      ))}
    </section>
  );
}
