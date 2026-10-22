import { ProgressBar } from "@/components/ui/ProgressBar";
import { merchantStats, type MerchantStatTone } from "@/lib/sample-data/merchants";

const tone: Record<MerchantStatTone, { box: string; label: string; note: string }> = {
  mint: { box: "border border-mint-border bg-mint-card", label: "text-muted", note: "text-muted" },
  grey: { box: "bg-card", label: "text-hint", note: "text-hint" },
  cream: { box: "bg-cream", label: "text-amber-mute", note: "text-amber-deep" },
  red: { box: "bg-red-bg", label: "text-red-text", note: "text-red-text" },
  stone: { box: "bg-card-stone", label: "text-grey-text", note: "text-grey-text" },
};

/** "Portfolio at a glance" from design/Merchants.html: five stat tiles. The on-time bar grows in once. */
export function StatsRow() {
  return (
    <section aria-label="Portfolio at a glance" className="grid grid-cols-5 gap-3.5 max-[1100px]:grid-cols-3 max-[640px]:grid-cols-2">
      {merchantStats.map((s) => {
        const t = tone[s.tone];
        return (
          <article key={s.label} className={`box-border flex min-w-0 flex-col gap-2 rounded-[28px] p-5 text-ink ${t.box}`}>
            <span className={`text-label ${t.label}`}>{s.label}</span>
            <b className="font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{s.value}</b>
            {s.bar !== undefined ? <ProgressBar value={s.bar} height={6} track="line" delay={0.1} /> : null}
            {s.note ? <span className={`text-label ${t.note} ${s.noteStrong ? "font-semibold" : ""}`}>{s.note}</span> : null}
          </article>
        );
      })}
    </section>
  );
}
