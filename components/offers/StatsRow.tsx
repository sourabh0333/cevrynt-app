import { ProgressBar } from "@/components/ui/ProgressBar";
import { offersSections, type StatTile, type StatTone } from "@/lib/copy/offers";

const tone: Record<StatTone, { box: string; label: string; note: string }> = {
  mint: { box: "border border-mint-border bg-mint-card", label: "text-muted", note: "text-muted" },
  cream: { box: "bg-cream", label: "text-amber-mute", note: "text-amber-deep font-semibold" },
  grey: { box: "bg-card", label: "text-hint", note: "text-hint" },
  stone: { box: "bg-card-stone", label: "text-grey-text", note: "text-grey-text" },
  mintLight: { box: "border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]", label: "text-muted", note: "text-teal-deep" },
};

/** "At a glance" from design/Offers.html: six stat tiles. The capital bar grows in once. */
export function StatsRow({ stats: offerStats }: { stats: StatTile[] }) {
  return (
    <section aria-label={offersSections.stats} className="grid grid-cols-6 gap-3.5 max-[1180px]:grid-cols-3 max-[640px]:grid-cols-2">
      {offerStats.map((s, i) => {
        const t = tone[s.tone];
        return (
          <article key={s.label} className={`box-border flex min-w-0 flex-col gap-2 rounded-[28px] p-5 text-ink ${t.box}`}>
            <span className={`text-label ${t.label}`}>{s.label}</span>
            <b className="font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
              {s.value}
              {s.unit ? <span className="text-[16px]">{s.unit}</span> : null}
            </b>
            {s.bar !== undefined ? <ProgressBar value={s.bar} height={6} track="line" delay={0.1 + i * 0.05} /> : null}
            <span className={`text-label ${s.noteTone === "good" ? "text-teal-deep" : t.note}`}>{s.note}</span>
          </article>
        );
      })}
    </section>
  );
}
