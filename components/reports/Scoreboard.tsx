"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { StatTile } from "@/components/ui/StatTile";
import { kpis as kpisFor, periodSwitch as ps, type Period } from "@/lib/copy/reports";
import type { ReportsData } from "@/lib/data/views/reports";

/**
 * The period switch with Schedule and Export PDF, and the key-number
 * scoreboard from design/Reports.html. Picking a period swaps the six
 * numbers, change pills and sparklines as in the prototype. Tiles sit
 * 3 + 3 (6 across from 1500px, 2 + 2 + 2 below 620px); Funded is mint.
 */
export function Scoreboard({ data }: { data: Pick<ReportsData, "snapshots" | "funding" | "lossRate"> }) {
  const [period, setPeriod] = useState<Period>(ps.start);
  const snapshot = data.snapshots.find((s) => s.period === period) ?? data.snapshots[0];
  const kpis = kpisFor(snapshot, data);
  const sparks = snapshot.trends;

  return (
    <>
      <section aria-label={ps.label} className="flex flex-wrap items-center justify-between gap-2.5">
        <SegmentedSwitch label={ps.label} track="grey" value={period} onChange={(v) => setPeriod(v as Period)} options={ps.options} />
        <div className="flex gap-2">
          <Button variant="secondary" className="h-10! px-4! text-[12.5px]!">
            {ps.schedule}
          </Button>
          <Button className="h-10! px-4! text-[12.5px]!">{ps.export}</Button>
        </div>
      </section>

      <section
        aria-label="Key numbers"
        aria-live="polite"
        className="grid grid-cols-3 gap-1.5 rounded-[28px] bg-card p-1.5 min-[1500px]:grid-cols-6 max-[620px]:grid-cols-2"
      >
        {kpis.map((k, i) => (
          <StatTile
            key={k.label}
            label={k.label}
            value={k.value}
            change={{ text: k.delta, tone: k.good ? "good" : "neutral" }}
            trend={sparks[i]}
            trendColor={i === 0 ? "teal" : "grey"}
            variant={i === 0 ? "mint" : "white"}
          />
        ))}
      </section>
    </>
  );
}
