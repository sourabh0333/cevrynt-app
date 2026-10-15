"use client";

import Link from "next/link";
import { useState } from "react";
import { PageActions } from "@/components/shell/PageActions";
import { Ring } from "@/components/ui/Ring";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import {
  doneEarlier,
  taskFilters,
  taskGroups,
  tasks,
  waitingOnOthers,
  type Task,
  type TaskType,
} from "@/lib/sample-data/tasks";
import { TaskRow, agendaCols } from "./TaskRow";

const typeDot: Record<TaskType, "blue" | "red" | "amber" | "purple" | "grey" | "teal"> = {
  decision: "blue",
  alert: "red",
  review: "amber",
  call: "purple",
  docs: "grey",
  renewal: "teal",
};

/**
 * My tasks, from design/Tasks.html with the logic of Tasks.dc.html.
 * State: the type filter, the expanded task, and which tasks are ticked.
 * Everything else (counts, ring, groups, Do this first, Done today) is
 * derived from those. Mine / Team, Add task, snooze, hand-off and notes
 * are drawn but get their behavior in a later step.
 */
export function TasksView() {
  const [tab, setTab] = useState<TaskType | "all">("all");
  const [selected, setSelected] = useState<string | null>("lake");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const isDone = (t: Task) => !!done[t.id];
  const open = tasks.filter((t) => !isDone(t));
  const nUrgent = open.filter((t) => t.when === "now").length;
  const nToday = open.filter((t) => t.when === "today").length;
  const nWeek = open.filter((t) => t.when === "week").length;
  const ticked = tasks.filter(isDone);
  const nAll = doneEarlier.length + tasks.length;
  const nDone = Math.min(nAll, doneEarlier.length + ticked.length);

  const top = open.find((t) => t.when === "now") ?? open[0] ?? tasks[0];
  const topDone = isDone(top);

  const visible = tasks.filter((t) => tab === "all" || t.type === tab);
  const groups = taskGroups
    .map((g, gi) => ({ ...g, gi, items: visible.filter((t) => t.when === g.when) }))
    .filter((g) => g.items.length);

  const filterItems: TabItem[] = taskFilters.map((f) => ({
    value: f.value,
    label: f.label,
    dot: f.value === "all" ? "ink" : typeDot[f.value],
    count: f.value === "all" ? open.length : open.filter((t) => t.type === f.value).length,
  }));

  const doneList = [
    ...ticked.map((t) => ({ title: t.title, time: "now" })),
    ...doneEarlier,
  ].slice(0, 5);

  const toggleDone = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            My tasks
          </h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">
            {open.length} to do · {nUrgent} due within the hour
          </span>
        </div>
        <PageActions />
      </header>

      {/* Do this first + the day */}
      <section
        aria-label="Your day"
        className="grid grid-cols-2 gap-1 rounded-card-lg border border-line bg-tile p-2 max-[900px]:grid-cols-1"
      >
        <div className="flex flex-col gap-2.5 rounded-card bg-mint-card p-[22px] text-ink">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill bg-tile px-[11px] py-1 text-[11.5px] font-bold text-red-text">
            <span className="h-[7px] w-[7px] rounded-full bg-red" />
            Do this first · {top.due}
          </span>
          <h2 className="m-0 font-heading text-[24px] leading-[1.15] font-semibold">{top.title}</h2>
          <span className="text-body-sm text-grey-text">{top.why}</span>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link
              href={top.href}
              className="inline-flex h-11 items-center rounded-pill bg-teal px-5 text-body-sm font-semibold text-white no-underline"
            >
              {top.action}
            </Link>
            <button
              type="button"
              onClick={() => toggleDone(top.id)}
              className="h-11 cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink"
            >
              {topDone ? "Undo" : "Mark done"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 py-[18px] pr-[18px] pl-[22px]">
          <Ring
            value={(nDone / nAll) * 100}
            size={120}
            color="teal"
            ariaLabel={`${nDone} of ${nAll} tasks done today`}
            caption="done today"
            label={
              <>
                {nDone}
                <span className="text-[14px] text-hint">/{nAll}</span>
              </>
            }
          />
          <div className="grid flex-[1_1_180px] grid-cols-2 gap-2">
            <Count value={nUrgent} label="within the hour" tone="red" />
            <Count value={nToday} label="later today" />
            <Count value={nWeek} label="this week" />
            <Count value={waitingOnOthers.length} label="waiting on others" />
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section aria-labelledby="h-ag" className="flex flex-col gap-3 rounded-card-lg bg-card p-[18px] text-ink">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-0.5">
          <div className="min-w-0">
            <h2 id="h-ag" className="m-0 font-heading text-card-title-lg font-semibold">
              Your agenda
            </h2>
            <span className="text-label text-hint">
              {open.length} open · {nUrgent} due within the hour
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mine / Team and Add task get their behavior in a later step. */}
            <SegmentedSwitch
              label="Whose tasks"
              value="mine"
              options={[
                { value: "mine", label: "Mine" },
                { value: "team", label: "Team" },
              ]}
            />
            <button
              type="button"
              className="inline-flex h-[38px] cursor-pointer items-center gap-1.5 rounded-pill border-0 bg-teal px-4 text-[12.5px] font-semibold text-white shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
            >
              <span className="text-[16px] leading-none">+</span>Add task
            </button>
          </div>
        </div>

        <Tabs
          label="Type"
          variant="panel"
          value={tab}
          onChange={(v) => setTab(v as TaskType | "all")}
          items={filterItems}
        />

        <div className={`${agendaCols} px-4 pt-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint-soft`}>
          <span />
          <span>Task</span>
          <span>Time left</span>
          <span>Type</span>
          <span />
        </div>

        {groups.map((g) => (
          <div key={g.when} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 px-1 pt-1">
              <span className={`inline-flex h-[30px] items-center gap-2 rounded-pill py-0 pr-1.5 pl-3 text-label font-bold whitespace-nowrap ${g.pill}`}>
                <span className={`h-[7px] w-[7px] rounded-full ${g.dot}`} />
                {g.title}
                <span className="rounded-pill bg-white/80 px-[7px] py-px text-[10.5px]">{g.items.length}</span>
              </span>
              <span className="h-px flex-1 bg-line-strong" />
            </div>
            <div className="overflow-hidden rounded-[22px] bg-tile shadow-[0_10px_26px_-24px_rgba(15,21,19,.5)]">
              {g.items.map((t, idx) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  group={g}
                  done={isDone(t)}
                  open={selected === t.id}
                  first={idx === 0}
                  order={g.gi * 3 + idx}
                  onToggleDone={() => toggleDone(t.id)}
                  onToggleOpen={() => setSelected((s) => (s === t.id ? null : t.id))}
                />
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 ? (
          <div className="rounded-[22px] bg-tile p-6 text-center text-body-sm text-hint">
            Nothing here. Pick another type above.
          </div>
        ) : null}
      </section>

      {/* Waiting + done */}
      <section
        aria-label="Waiting and done"
        className="grid grid-cols-2 gap-1 rounded-card-lg border border-line bg-tile p-2 max-[900px]:grid-cols-1"
      >
        <div className="flex flex-col gap-2 p-4 text-ink">
          <div className="flex items-center justify-between">
            <h2 className="m-0 font-heading text-card-title-sm font-semibold">Waiting on others</h2>
            <span className="text-[11.5px] text-hint">A task appears when they reply</span>
          </div>
          {waitingOnOthers.map((w) => (
            <div key={w.id} className="flex items-center gap-2.5 rounded-tile bg-card px-3 py-[11px] text-[12.5px]">
              <span className={`grid h-[30px] w-[30px] flex-none place-items-center rounded-[10px] text-[10.5px] font-bold ${w.tile}`}>
                {w.initials}
              </span>
              <span className="min-w-0 flex-1">
                <b>{w.title}</b>
                <span className="block text-[11.5px] text-hint">{w.detail}</span>
              </span>
              <span className="text-label-sm font-semibold whitespace-nowrap text-muted">{w.status}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-card bg-mint-card p-4 text-ink">
          <div className="flex items-center justify-between">
            <h2 className="m-0 font-heading text-card-title-sm font-semibold">Done today</h2>
            <b className="font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-teal-deep">{nDone}</b>
          </div>
          {doneList.map((d, i) => (
            <span key={`${d.title}-${i}`} className="flex items-center gap-2.5 rounded-tile bg-white/80 px-3 py-[9px] text-[12.5px]">
              <span className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-teal text-[10px] font-bold text-white">
                ✓
              </span>
              <span className="min-w-0 flex-1 truncate">{d.title}</span>
              <span className="font-mono text-label-sm text-teal-mute">{d.time}</span>
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

function Count({ value, label, tone }: { value: number; label: string; tone?: "red" }) {
  const red = tone === "red";
  return (
    <span className={`rounded-[16px] p-3 ${red ? "bg-red-bg" : "bg-card"}`}>
      <b className={`block font-heading text-[22px] leading-none font-semibold tabular-nums tracking-[-0.03em] ${red ? "text-red-text" : "text-ink"}`}>
        {value}
      </b>
      <span className={`text-[11.5px] ${red ? "text-red-text" : "text-muted"}`}>{label}</span>
    </span>
  );
}
