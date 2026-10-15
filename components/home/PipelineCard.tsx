import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { StatTile } from "@/components/ui/StatTile";
import type { Pipeline } from "@/lib/sample-data/home";

/** "Pipeline this week" from design/Main.html: five stage tiles with bars that grow in. */
export function PipelineCard({ data }: { data: Pipeline }) {
  return (
    <section
      aria-labelledby="h-pipe"
      className="flex flex-col gap-4 rounded-card-lg bg-card px-[22px] py-5 text-ink"
    >
      <SectionHeader
        title="Pipeline this week"
        titleId="h-pipe"
        subtitle={data.subtitle}
        className="flex-wrap items-end"
        action={
          <SegmentedSwitch
            label="Pipeline range"
            value={data.range}
            options={data.ranges}
            className="gap-1"
          />
        }
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
        {data.stages.map((s, i) => (
          <StatTile
            key={s.label}
            caps
            label={s.label}
            value={s.value}
            bar={{ value: s.percent, color: s.color }}
            note={s.note}
            variant={s.final ? "teal" : "white"}
            delay={i * 0.08}
          />
        ))}
      </div>
    </section>
  );
}
