"use client";

import Link from "next/link";
import { useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { taskTypes, teammates, type Task, type TaskGroupInfo } from "@/lib/sample-data/tasks";

/** Column layout shared by the caption row and every task row (design .agcols). */
export const agendaCols =
  "grid grid-cols-[24px_minmax(0,1.7fr)_minmax(120px,1fr)_96px_34px] items-center gap-3.5 max-[700px]:grid-cols-[24px_minmax(0,1fr)_34px] max-[700px]:[&>:nth-child(3)]:hidden max-[700px]:[&>:nth-child(4)]:hidden";

const smallBtn =
  "h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink disabled:cursor-default disabled:opacity-50";

type Props = {
  task: Task;
  group: TaskGroupInfo;
  done: boolean;
  open: boolean;
  first: boolean;
  /** stagger index for the time-left bar */
  order: number;
  snoozed: boolean;
  assignee?: string;
  note?: string;
  onToggleDone: () => void;
  onToggleOpen: () => void;
  onSnooze: () => void;
  onHand: (name: string) => void;
  onNote: (text: string) => void;
};

export function TaskRow({
  task,
  group,
  done,
  open,
  first,
  order,
  snoozed,
  assignee,
  note,
  onToggleDone,
  onToggleOpen,
  onSnooze,
  onHand,
  onNote,
}: Props) {
  const t = taskTypes[task.type];
  const [picker, setPicker] = useState<"hand" | "note" | null>(null);
  const [draft, setDraft] = useState(note ?? "");
  const canSnooze = task.when === "now" && !snoozed;

  const saveNote = () => {
    onNote(draft.trim());
    setPicker(null);
  };

  return (
    <div
      data-task-id={task.id}
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
            <span className="block truncate text-label text-hint">
              {task.deal}
              {assignee ? ` · with ${assignee}` : ""}
              {snoozed ? " · snoozed 1 hour" : ""}
            </span>
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
          <span className="text-[12.5px] text-grey-text">
            {task.why}
            {note ? (
              <span className="mt-2 block rounded-[10px] bg-tile px-2.5 py-2 text-label text-ink">
                <b>Note:</b> {note}
              </span>
            ) : null}
          </span>
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

          <div className="col-span-full flex flex-wrap items-center gap-1.5 border-t border-line-strong pt-2.5">
            <button type="button" onClick={onSnooze} disabled={!canSnooze} className={smallBtn}>
              {snoozed ? "Snoozed" : "Snooze 1 hour"}
            </button>
            <button
              type="button"
              onClick={() => setPicker(picker === "hand" ? null : "hand")}
              aria-expanded={picker === "hand"}
              className={smallBtn}
            >
              {assignee ? `With ${assignee}` : "Hand to a teammate"}
            </button>
            <button
              type="button"
              onClick={() => setPicker(picker === "note" ? null : "note")}
              aria-expanded={picker === "note"}
              className={smallBtn}
            >
              {note ? "Edit note" : "Add a note"}
            </button>
            <span className="ml-auto self-center text-[11.5px] text-hint">{task.source ?? t.source}</span>
          </div>

          {picker === "hand" ? (
            <div role="group" aria-label="Hand to" className="col-span-full flex flex-wrap items-center gap-1.5">
              <span className="text-label text-hint">Hand to:</span>
              {teammates
                .filter((m) => m.name !== "Maya Chen")
                .map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => {
                      onHand(m.name);
                      setPicker(null);
                    }}
                    className={`h-8 cursor-pointer rounded-pill border-0 px-3 text-label font-semibold ${
                      assignee === m.name ? "bg-teal text-white" : "bg-tile text-ink"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              {assignee ? (
                <button
                  type="button"
                  onClick={() => {
                    onHand("");
                    setPicker(null);
                  }}
                  className="h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-hint"
                >
                  Keep it
                </button>
              ) : null}
            </div>
          ) : null}

          {picker === "note" ? (
            <div className="col-span-full flex flex-wrap items-center gap-1.5">
              <input
                aria-label="Note"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveNote();
                  if (e.key === "Escape") setPicker(null);
                }}
                placeholder="Add a note for yourself or the team"
                className="h-9 min-w-0 flex-[1_1_240px] rounded-pill border-0 bg-tile px-3 text-label-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-mint"
              />
              <button type="button" onClick={saveNote} className="h-9 cursor-pointer rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
                Save
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
