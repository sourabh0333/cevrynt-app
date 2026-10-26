import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Speed } from "@/lib/copy/home";

/** "Speed" from design/Main.html: two median tiles on the light mint card. */
export function SpeedCard({ data }: { data: Speed }) {
  return (
    <article
      aria-labelledby="h-speed"
      className="flex flex-col gap-4 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <SectionHeader title="Speed" titleId="h-speed" subtitle={data.subtitle} />
      {data.metrics.map((m, i) => (
        <div key={m.label} className="rounded-tile-lg border border-teal/7 bg-teal/7 p-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-cap font-semibold uppercase text-muted">{m.label}</span>
            <span className={`text-[11.5px] ${m.asideTone === "good" ? "text-teal-deep" : "text-amber-deep"}`}>
              {m.aside}
            </span>
          </div>
          <div className="mt-1 font-heading text-[26px] font-semibold tabular-nums tracking-[-0.03em]">
            {m.value}
          </div>
          {m.bar !== undefined ? (
            <ProgressBar className="mt-2" value={m.bar} height={6} color="mint" track="teal" delay={0.2 + i * 0.1} />
          ) : null}
          {m.note ? <div className="mt-1.5 text-label text-muted">{m.note}</div> : null}
        </div>
      ))}
    </article>
  );
}
