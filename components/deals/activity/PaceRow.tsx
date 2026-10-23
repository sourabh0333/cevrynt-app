import { duration, paceCopy as t } from "@/lib/copy/deal-activity";
import { hoursAndMinutes } from "@/lib/copy/deal";
import type { DealActivity, DealDeadline } from "@/lib/data/types";

const tone = {
  mint: "border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]",
  grey: "bg-card",
  sand: "bg-card-deep",
};

/**
 * "Deal pace" from design/Deal-Activity.html: four tiles from the deal's
 * stages, queue time, people and deadline. The event count follows the
 * timeline.
 */
export function PaceRow({ activity, deadline, eventsToday }: { activity: DealActivity; deadline: DealDeadline; eventsToday: number }) {
  const machine = activity.stages.filter((s) => s.stage === "reading" || s.stage === "checks").reduce((n, s) => n + s.seconds, 0);
  const tiles: { label: string; value: string | number; note: string; tone: keyof typeof tone }[] = [
    { label: t.analysis.label, value: duration(machine), note: t.analysis.note, tone: "mint" },
    { label: t.queue.label, value: hoursAndMinutes(activity.queuedMinutes), note: t.queue.note(deadline), tone: "grey" },
    { label: t.people.label, value: activity.people.length, note: t.people.note(activity.people), tone: "sand" },
    { label: t.events.label, value: eventsToday, note: t.events.note, tone: "grey" },
  ];
  return (
    <section aria-label={t.label} className="grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
      {tiles.map((p) => (
        <div key={p.label} className={`box-border rounded-[26px] p-[18px] text-ink ${tone[p.tone]}`}>
          <span className={`text-label ${p.tone === "grey" ? "text-hint" : "text-muted"}`}>{p.label}</span>
          <b className="block font-heading text-[26px] leading-[1.1] font-semibold tabular-nums tracking-[-0.03em]">{p.value}</b>
          <span className={`text-[11.5px] ${p.tone === "mint" ? "text-teal-deep" : p.tone === "grey" ? "text-hint" : "text-muted"}`}>{p.note}</span>
        </div>
      ))}
    </section>
  );
}
