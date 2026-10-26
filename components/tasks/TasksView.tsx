"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { PageActions } from "@/components/shell/PageActions";
import { Ring } from "@/components/ui/Ring";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import {
  digestStorageKey,
  fromYou,
  loadSummary,
  quickAdd,
  shortMerchant,
  taskFilters,
  taskGroups,
  tasksCopy as c,
  teamSummary,
  toTaskView,
  waitingView,
  type TaskView as Task,
  type TaskWhen,
} from "@/lib/copy/tasks";
import type { TaskType } from "@/lib/data/types";
import type { TasksData } from "@/lib/data/views/tasks";
import { timeOfDay } from "@/lib/format";
import { TaskRow, agendaCols } from "./TaskRow";

const typeDot: Record<TaskType, "blue" | "red" | "amber" | "purple" | "grey" | "teal" | "ink"> = {
  decision: "blue",
  alert: "red",
  review: "amber",
  call: "purple",
  docs: "grey",
  renewal: "teal",
  custom: "grey",
};

/* "Email me this list every morning at 8:00", remembered in localStorage. */
const digestListeners = new Set<() => void>();
function readDigest(): boolean {
  try {
    return localStorage.getItem(digestStorageKey) !== "off";
  } catch {
    return true;
  }
}
function writeDigest(on: boolean) {
  try {
    localStorage.setItem(digestStorageKey, on ? "on" : "off");
  } catch {}
  digestListeners.forEach((l) => l());
}
function subscribeDigest(l: () => void) {
  digestListeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    digestListeners.delete(l);
    window.removeEventListener("storage", l);
  };
}
const digestServer = () => true;

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

/**
 * My tasks, from design/Tasks.html with the logic of Tasks.dc.html, for the
 * signed-in person's tasks in `data` (from the data layer).
 * State: Mine / Team, the type filter, the expanded task, ticked tasks,
 * snoozed tasks, hand-offs, notes, added tasks and the quick-add bar.
 * Everything else is derived. Keyboard: J / K move, X done, Enter open,
 * S snooze, never while typing in a field.
 */
export function TasksView({ data }: { data: TasksData }) {
  const router = useRouter();
  const seedTasks = useMemo(() => data.tasks.map((t) => toTaskView(t, data.now, data.brokerFlags)), [data.tasks, data.now, data.brokerFlags]);
  const doneEarlier = useMemo(() => data.board.doneToday.map((d) => ({ title: d.title, time: timeOfDay(d.at) })), [data.board.doneToday]);
  const waitingOnOthers = data.board.waiting.map(waitingView);
  const dealChoices = [quickAdd.noDeal, ...data.quickDeals.map(shortMerchant)];
  const assigneeChoices = [quickAdd.me, ...data.quickAssignees];
  const teammates = data.team.map((m) => ({ name: m.name, summary: loadSummary(m.load), alert: m.load.overdue > 0 }));
  const handTo = data.team.filter((m) => m.id !== data.me.id).map((m) => m.name);
  const [who, setWho] = useState<"mine" | "team">("mine");
  const [tab, setTab] = useState<TaskType | "all">("all");
  const [selected, setSelected] = useState<string | null>(data.tasks[0]?.id ?? null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [later, setLater] = useState<Record<string, boolean>>({});
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<Task[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ text: "", deal: quickAdd.noDeal, due: "today", assignee: quickAdd.me });
  const digest = useSyncExternalStore(subscribeDigest, readDigest, digestServer);

  const tasks = [...seedTasks, ...added];
  const isDone = (t: Task) => !!done[t.id];
  const whenOf = (t: Task): TaskWhen => (later[t.id] && t.when === "now" ? "today" : t.when);

  const open = tasks.filter((t) => !isDone(t));
  const nUrgent = open.filter((t) => whenOf(t) === "now").length;
  const nToday = open.filter((t) => whenOf(t) === "today").length;
  const nWeek = open.filter((t) => whenOf(t) === "week").length;
  const ticked = tasks.filter(isDone);
  const nAll = doneEarlier.length + tasks.length;
  const nDone = Math.min(nAll, doneEarlier.length + ticked.length);

  const top = open.find((t) => whenOf(t) === "now") ?? open[0] ?? tasks[0];
  const topDone = isDone(top);

  const visible = tasks.filter((t) => tab === "all" || t.type === tab);
  const groups = taskGroups
    .map((g, gi) => ({ ...g, gi, items: visible.filter((t) => whenOf(t) === g.when) }))
    .filter((g) => g.items.length);
  const ordered = groups.flatMap((g) => g.items);

  const filterItems: TabItem[] = taskFilters.map((f) => ({
    value: f.value,
    label: f.label,
    dot: f.value === "all" ? "ink" : typeDot[f.value],
    count: f.value === "all" ? open.length : open.filter((t) => t.type === f.value).length,
  }));

  const doneList = [...ticked.map((t) => ({ title: t.title, time: c.done.now })), ...doneEarlier].slice(0, 5);

  const toggleDone = useCallback((id: string) => setDone((d) => ({ ...d, [id]: !d[id] })), []);
  const snooze = useCallback((id: string) => setLater((l) => ({ ...l, [id]: true })), []);

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.text.trim();
    if (!text) return;
    const due = quickAdd.due.find((d) => d.value === draft.due) ?? quickAdd.due[0];
    const forWhom = draft.assignee === quickAdd.me ? "" : quickAdd.forWhom(draft.assignee);
    const deal = draft.deal === quickAdd.noDeal ? quickAdd.noDealLine : draft.deal;
    const task: Task = {
      id: `new-${Date.now()}`,
      type: "custom",
      when: due.when,
      title: text,
      deal: `${deal}${forWhom}`,
      due: due.label,
      why: quickAdd.why,
      prep: [],
      href: quickAdd.href,
      action: quickAdd.action,
      urgency: due.urgency,
      source: fromYou,
    };
    setAdded((a) => [...a, task]);
    setDraft({ text: "", deal: quickAdd.noDeal, due: "today", assignee: quickAdd.me });
    setAdding(false);
    setSelected(task.id);
  };

  // Keyboard shortcuts. Never while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const key = e.key.toLowerCase();
      if (!["j", "k", "x", "enter", "s"].includes(key)) return;
      const i = ordered.findIndex((t) => t.id === selected);
      if (key === "j" || key === "k") {
        if (!ordered.length) return;
        const next = i < 0 ? 0 : (i + (key === "j" ? 1 : -1) + ordered.length) % ordered.length;
        const id = ordered[next].id;
        setSelected(id);
        document.querySelector(`[data-task-id="${id}"]`)?.scrollIntoView({ block: "nearest" });
        e.preventDefault();
        return;
      }
      const t = i >= 0 ? ordered[i] : null;
      if (!t) return;
      if (key === "x") toggleDone(t.id);
      else if (key === "enter") router.push(t.href);
      else if (key === "s" && t.when === "now") snooze(t.id);
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ordered, selected, toggleDone, snooze, router]);

  const team = who === "team";

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            {c.title}
          </h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">
            {c.headline(open.length, nUrgent)}
          </span>
        </div>
        <PageActions />
      </header>

      {/* Do this first + the day */}
      <section
        aria-label={c.day}
        className="grid grid-cols-2 gap-1 rounded-card-lg border border-line bg-tile p-2 max-[900px]:grid-cols-1"
      >
        <div className="flex flex-col gap-2.5 rounded-card bg-mint-card p-[22px] text-ink">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill bg-tile px-[11px] py-1 text-[11.5px] font-bold text-red-text">
            <span className="h-[7px] w-[7px] rounded-full bg-red" />
            {c.first(top.due)}
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
              {topDone ? c.undo : c.markDone}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 py-[18px] pr-[18px] pl-[22px]">
          <Ring
            value={(nDone / nAll) * 100}
            size={120}
            color="teal"
            ariaLabel={c.ringLabel(nDone, nAll)}
            caption={c.ringCaption}
            label={
              <>
                {nDone}
                <span className="text-[14px] text-hint">/{nAll}</span>
              </>
            }
          />
          <div className="grid flex-[1_1_180px] grid-cols-2 gap-2">
            <Count value={nUrgent} label={c.counts.now} tone="red" />
            <Count value={nToday} label={c.counts.today} />
            <Count value={nWeek} label={c.counts.week} />
            <Count value={waitingOnOthers.length} label={c.counts.waiting} />
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section aria-labelledby="h-ag" className="flex flex-col gap-3 rounded-card-lg bg-card p-[18px] text-ink">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-0.5">
          <div className="min-w-0">
            <h2 id="h-ag" className="m-0 font-heading text-card-title-lg font-semibold">
              {team ? c.agenda.team : c.agenda.mine}
            </h2>
            <span className="text-label text-hint">
              {team ? teamSummary(data.team.length, data.team.reduce((n, m) => n + m.load.open, 0)) : c.agenda.line(open.length, nUrgent)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SegmentedSwitch
              label={c.whose.label}
              value={who}
              onChange={(v) => setWho(v as "mine" | "team")}
              options={[
                { value: "mine", label: c.whose.mine },
                { value: "team", label: c.whose.team },
              ]}
            />
            <button
              type="button"
              onClick={() => setAdding((a) => !a)}
              aria-expanded={adding}
              className="inline-flex h-[38px] cursor-pointer items-center gap-1.5 rounded-pill border-0 bg-teal px-4 text-[12.5px] font-semibold text-white shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
            >
              <span className="text-[16px] leading-none">+</span>{c.add}
            </button>
          </div>
        </div>

        <Tabs
          label={c.typeLabel}
          variant="panel"
          value={tab}
          onChange={(v) => setTab(v as TaskType | "all")}
          items={filterItems}
        />

        {adding ? (
          <form
            onSubmit={addTask}
            aria-label={c.addForm.label}
            className="flex flex-wrap items-center gap-2 rounded-[18px] bg-tile p-2.5 shadow-[inset_0_0_0_1.5px_#0E6B5C]"
          >
            <input
              aria-label={c.addForm.input}
              autoFocus
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder={quickAdd.placeholder}
              className="h-10 min-w-0 flex-[1_1_260px] border-0 bg-transparent px-2.5 text-body-sm text-ink outline-none"
            />
            <Select aria-label={c.addForm.deal} value={draft.deal} onChange={(v) => setDraft({ ...draft, deal: v })} options={dealChoices.map((d) => ({ value: d, label: d }))} />
            <Select aria-label={c.addForm.due} value={draft.due} onChange={(v) => setDraft({ ...draft, due: v })} options={quickAdd.due.map((d) => ({ value: d.value, label: d.label }))} />
            <Select aria-label={c.addForm.assign} value={draft.assignee} onChange={(v) => setDraft({ ...draft, assignee: v })} options={assigneeChoices.map((a) => ({ value: a, label: a }))} />
            <button type="submit" className="h-9 cursor-pointer rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
              {c.addForm.submit}
            </button>
          </form>
        ) : null}

        {team ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
            {teammates.map((m) => (
              <span key={m.name} className={`rounded-[16px] px-3.5 py-3 text-[12.5px] ${m.alert ? "bg-red-bg" : "bg-tile"}`}>
                <b className="block">{m.name}</b>
                <span className={m.alert ? "text-label text-red-text" : "text-[11.5px] text-hint"}>{m.summary}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div className={`${agendaCols} px-4 pt-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint-soft`}>
          <span />
          <span>{c.columns.task}</span>
          <span>{c.columns.left}</span>
          <span>{c.columns.type}</span>
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
                  snoozed={!!later[t.id]}
                  assignee={assigned[t.id] || undefined}
                  note={notes[t.id] || undefined}
                  teammates={handTo}
                  onToggleDone={() => toggleDone(t.id)}
                  onToggleOpen={() => setSelected((s) => (s === t.id ? null : t.id))}
                  onSnooze={() => snooze(t.id)}
                  onHand={(name) => setAssigned((a) => ({ ...a, [t.id]: name }))}
                  onNote={(text) => setNotes((n) => ({ ...n, [t.id]: text }))}
                />
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 ? (
          <div className="rounded-[22px] bg-tile p-6 text-center text-body-sm text-hint">
            {c.empty}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 pt-1 text-label text-muted">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={digest}
              onChange={(e) => writeDigest(e.target.checked)}
              className="h-[18px] w-[18px] accent-teal"
            />
            {c.digest}
          </label>
          <span>
            Keyboard: <kbd className="font-mono">J</kbd>/<kbd className="font-mono">K</kbd> move ·{" "}
            <kbd className="font-mono">X</kbd> done · <kbd className="font-mono">Enter</kbd> open ·{" "}
            <kbd className="font-mono">S</kbd> snooze
          </span>
        </div>
      </section>

      {/* Waiting + done */}
      <section
        aria-label={c.waitingAndDone}
        className="grid grid-cols-2 gap-1 rounded-card-lg border border-line bg-tile p-2 max-[900px]:grid-cols-1"
      >
        <div className="flex flex-col gap-2 p-4 text-ink">
          <div className="flex items-center justify-between">
            <h2 className="m-0 font-heading text-card-title-sm font-semibold">{c.waiting.title}</h2>
            <span className="text-[11.5px] text-hint">{c.waiting.hint}</span>
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
            <h2 className="m-0 font-heading text-card-title-sm font-semibold">{c.done.title}</h2>
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

function Select({
  value,
  onChange,
  options,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  "aria-label": string;
}) {
  return (
    <select
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 cursor-pointer rounded-pill border-0 bg-card px-3 text-label text-ink outline-none focus-visible:ring-2 focus-visible:ring-mint"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
