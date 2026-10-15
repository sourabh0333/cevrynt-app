import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { taskTypes, type Task, type TaskGroupInfo } from "@/lib/sample-data/tasks";

/** Column layout shared by the caption row and every task row (design .agcols). */
export const agendaCols =
  "grid grid-cols-[24px_minmax(0,1.7fr)_minmax(120px,1fr)_96px_34px] items-center gap-3.5 max-[700px]:grid-cols-[24px_minmax(0,1fr)_34px] max-[700px]:[&>:nth-child(3)]:hidden max-[700px]:[&>:nth-child(4)]:hidden";

type Props = {
  task: Task;
  group: TaskGroupInfo;
  done: boolean;
  open: boolean;
  first: boolean;
  /** stagger index for the time-left bar */
  order: number;
  onToggleDone: () => void;
  onToggleOpen: () => void;
};

export function TaskRow({ task, group, done, open, first, order, onToggleDone, onToggleOpen }: Props) {
  const t = taskTypes[task.type];
  return (
    <div
      className={`${first ? "" : "border-t border-line-faint"} ${open ? "bg-tile-selected" : ""} ${
        done ? "opacity-55" : ""
      }`}
    >
      <div className={`${agendaCols} px-4 py-3`}>
        <button
          type="button"
          onClick={onToggleDone}
          aria-pressed={done}
          aria-label={`Mark ${task.title} done`}
          className={`grid h-6 w-6 cursor-pointer place-items-center rounded-[8px] text-label font-bold ${
            done ? "border-0 bg-teal text-white" : "border-2 border-line-dashed bg-tile text-transparent"
          }`}
        >
          ✓
        </button>

        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={open}
          className="flex min-w-0 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-ink"
        >
          <span className={`grid h-10 w-10 flex-none place-items-center rounded-[13px] text-label-sm font-bold ${t.bg} ${t.text}`}>
            {t.initials}
          </span>
          <span className="min-w-0">
            <b className={`block truncate text-body ${done ? "line-through" : ""}`}>{task.title}</b>
            <span className="block truncate text-label text-hint">{task.deal}</span>
          </span>
        </button>

        <span className="flex min-w-0 flex-col gap-[5px]">
          <span className={`text-label font-bold whitespace-nowrap ${group.due}`}>{task.due}</span>
          <ProgressBar value={task.urgency} height={6} color={group.bar} track="faint" delay={0.25 + order * 0.08} />
        </span>

        <span className={`justify-self-start rounded-pill px-2.5 py-1 text-label-sm font-bold ${t.bg} ${t.text}`}>
          {t.label}
        </span>

        <Link
          href={task.href}
          aria-label="Open"
          className="grid h-[34px] w-[34px] place-items-center justify-self-end rounded-[12px] bg-ink text-white"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      {open ? (
        <div className="mr-4 mb-3.5 ml-[70px] grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3.5 rounded-[16px] bg-card p-3.5">
          <span className="text-[12.5px] text-grey-text">{task.why}</span>
          <div className="flex flex-col gap-1.5">
            {task.prep.map((p) => (
              <span key={p} className="flex items-center gap-2 text-label">
                <span className="grid h-4 w-4 flex-none place-items-center rounded-full bg-mint-bg text-[9px] font-bold text-teal-dark">
                  ✓
                </span>
                {p}
              </span>
            ))}
          </div>
          <div className="col-span-full flex flex-wrap gap-1.5 border-t border-line-strong pt-2.5">
            {/* Snooze, hand-off and notes get their behavior in a later step. */}
            <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold">
              Snooze 1 hour
            </button>
            <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold">
              Hand to a teammate
            </button>
            <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold">
              Add a note
            </button>
            <span className="ml-auto self-center text-[11.5px] text-hint">{t.source}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
