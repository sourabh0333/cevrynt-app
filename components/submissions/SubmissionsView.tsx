"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { deadlineStyle, dealTile, riskChip, scoreColor, statusChip, statusDot } from "@/components/deals/deal-style";
import { PageActions } from "@/components/shell/PageActions";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Ring } from "@/components/ui/Ring";
import {
  brokerLabel,
  deadlineLabel,
  deadlineLevel,
  deadlinePercent,
  dealHref,
  dealStatusLabel,
  metricLabels,
  receivedLabel,
  recommendedLabel,
  riskLabel,
} from "@/lib/copy/deal";
import {
  activeFilters,
  closedCard,
  keyboardHint,
  needsALook,
  queue,
  quickPreview,
  savedViews,
  statusCards,
  submissionsHeader,
  toolbar,
  waitLabel,
  waitsCard,
  workloadCard,
  type StatusCardKey,
} from "@/lib/copy/submissions";
import type { DealListItem, DealOwner, DealQueueStats, IsoDateTime, WorkloadRow } from "@/lib/data/types";
import type { SubmissionsData } from "@/lib/data/views/deals";
import { moneyShort } from "@/lib/format";
import { TickBox } from "@/components/ui/TickBox";

/*
 * Design .qcols: check, merchant, amount, score · risk, status, deadline, owner.
 * Under 1100px the score column hides (design media query). No horizontal
 * scroll: columns flex and text truncates.
 */
const cols =
  "grid grid-cols-[24px_minmax(0,1.6fr)_84px_112px_116px_96px_28px] items-center gap-2.5 [&>*]:min-w-0 max-[1100px]:grid-cols-[24px_minmax(0,1fr)_84px_112px_96px_28px] max-[1100px]:[&>:nth-child(4)]:hidden";

const cap = "text-cap font-semibold uppercase";

/** The deal the prototype opens on. */
const START_SELECTED = "APP-9K2M7R";

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

/**
 * Submissions, from design/Submissions.html with the logic of
 * Submissions.dc.html. The deals, counts, waits and workload come from the
 * data layer (props). State: the status filter, the selected deal, the
 * search text, the ticked rows and any quick assignments. Keyboard:
 * J / K move, Enter opens, A assigns to you, X ticks; never while typing.
 */
export function SubmissionsView({ data }: { data: SubmissionsData }) {
  const { deals, summary, stats, workload, me, mine, now } = data;
  const router = useRouter();
  const [tab, setTab] = useState<StatusCardKey>("all");
  const [selected, setSelected] = useState(START_SELECTED);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [assigned, setAssigned] = useState<Record<string, DealOwner>>({});
  const headerBox = useRef<HTMLInputElement>(null);

  const cards = statusCards(summary);
  const q = search.trim().toLowerCase();
  const rows = deals.filter(
    (d) =>
      (tab === "all" || d.status === tab) &&
      (!q || [d.merchantName, d.id, brokerLabel(d), d.owner?.name ?? ""].some((s) => s.toLowerCase().includes(q))),
  );
  const sel = deals.find((d) => d.id === selected) ?? deals[0];
  const total = cards.find((c) => c.key === tab)?.count ?? deals.length;

  const checkedIds = Object.keys(checked).filter((id) => checked[id]);
  const selCount = checkedIds.length;
  const visibleChecked = rows.filter((d) => checked[d.id]).length;
  const allVisible = rows.length > 0 && visibleChecked === rows.length;

  useEffect(() => {
    if (headerBox.current) headerBox.current.indeterminate = visibleChecked > 0 && !allVisible;
  }, [visibleChecked, allVisible]);

  const toggleAllVisible = () =>
    setChecked((c) => {
      const next = { ...c };
      rows.forEach((d) => (next[d.id] = !allVisible));
      return next;
    });
  const toggle = useCallback((id: string) => setChecked((c) => ({ ...c, [id]: !c[id] })), []);
  const assignToMe = useCallback((id: string) => {
    if (me) setAssigned((a) => ({ ...a, [id]: me }));
  }, [me]);

  // Keyboard shortcuts. Never while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const key = e.key.toLowerCase();
      if (!["j", "k", "enter", "a", "x"].includes(key)) return;
      const i = rows.findIndex((d) => d.id === selected);
      if (key === "j" || key === "k") {
        if (!rows.length) return;
        const next = i < 0 ? 0 : (i + (key === "j" ? 1 : -1) + rows.length) % rows.length;
        const id = rows[next].id;
        setSelected(id);
        document.querySelector(`[data-deal-id="${id}"]`)?.scrollIntoView({ block: "nearest" });
      } else if (i >= 0) {
        const d = rows[i];
        if (key === "enter") router.push(dealHref(d.id));
        else if (key === "x") toggle(d.id);
        else if (key === "a") assignToMe(d.id);
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rows, selected, router, toggle, assignToMe]);

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            {submissionsHeader.title}
          </h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">
            {submissionsHeader.line(summary)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={submissionsHeader.archived.href} className="inline-flex h-11 items-center gap-2 rounded-tile bg-card px-4 text-body-sm font-semibold text-ink no-underline">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="4" rx="1" />
              <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
            </svg>
            {submissionsHeader.archived.label}
          </Link>
          <PageActions />
        </div>
      </header>

      {/* Status filters */}
      <nav aria-label={toolbar.filterLabel} className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {cards.map((c) => {
          const on = tab === c.key;
          const hero = c.key === "all";
          const look = on
            ? hero
              ? "bg-mint-card text-ink shadow-[inset_0_0_0_1.5px_#CDE6DE]"
              : "bg-mint-bg text-teal-dark"
            : "bg-card text-ink";
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => setTab(c.key)}
              className={`box-border flex min-h-[128px] cursor-pointer flex-col items-start gap-1.5 rounded-[26px] border-0 px-[18px] py-4 text-left ${look}`}
            >
              <span className="flex w-full items-center justify-between">
                <span className={`${cap} text-muted`}>{c.label}</span>
                <span className={`h-[9px] w-[9px] rounded-full ${statusDot[c.key]}`} />
              </span>
              <span className="font-heading text-[28px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{c.count}</span>
              <span className={`text-[11.5px] ${on ? "text-muted" : "text-hint"}`}>{c.sub}</span>
            </button>
          );
        })}
      </nav>

      {/* Toolbar */}
      <section aria-label={toolbar.toolbarLabel} className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-[42px] min-w-[240px] items-center gap-2 rounded-pill bg-card px-3.5">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-hint">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              aria-label={toolbar.searchLabel}
              placeholder={toolbar.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-body-sm text-ink outline-none placeholder:text-hint"
            />
          </label>
          <span className={`${cap} pl-1 text-hint`}>{toolbar.viewsLabel}</span>
          {savedViews(mine, summary).map((v) => (
            <button
              key={v.value}
              type="button"
              aria-pressed={view === v.value}
              onClick={() => setView(v.value)}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-pill border-0 px-3.5 text-[12.5px] font-semibold ${
                view === v.value ? "bg-teal text-white" : "bg-card text-ink"
              }`}
            >
              {v.dot ? <span className="h-[7px] w-[7px] rounded-full bg-red" /> : null}
              {v.label}
            </button>
          ))}
          <button type="button" className="h-9 cursor-pointer rounded-pill border-0 bg-transparent px-3.5 text-[12.5px] font-semibold text-teal">
            {toolbar.saveView}
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-tile border-0 bg-card px-3.5 text-[12.5px] font-semibold text-ink">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            {toolbar.filters}
          </button>
          <button type="button" className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-tile border-0 bg-card px-3.5 text-[12.5px] font-semibold text-ink">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
            </svg>
            {toolbar.sort}
          </button>
        </div>
      </section>

      {/* Active filters */}
      <section aria-label={activeFilters.label} className="flex flex-wrap items-center gap-2 rounded-tile-lg bg-card-deep px-3 py-2.5">
        <span className={`${cap} px-1 text-muted`}>{activeFilters.title}</span>
        {activeFilters.applied.map((f) => (
          <button key={f.label} type="button" className="inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-pill border-0 bg-card py-0 pr-2 pl-3 text-[12.5px] text-ink">
            <span className="text-hint">{f.label}</span>
            <b>{f.value}</b>
            <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-tile text-label">×</span>
          </button>
        ))}
        {activeFilters.more.map((f) => (
          <button key={f} type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-white/60 px-3 text-[12.5px] text-grey-text">
            {f}
          </button>
        ))}
        <span className="flex-1" />
        <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-transparent px-3 text-[12.5px] font-semibold text-teal-deep">
          {activeFilters.clear}
        </button>
      </section>

      {/* Queue + preview: both stretch; the queue scrolls inside (layout rules 1 and 2). */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-queue" className="relative flex min-w-0 flex-[999_1_640px] flex-col gap-2 rounded-card-lg bg-card px-4 py-[18px] text-ink">
          <h2 id="h-queue" className="sr-only">{queue.title}</h2>

          {selCount > 0 ? (
            <div role="toolbar" aria-label={queue.bulk.label} className="flex flex-wrap items-center gap-2.5 rounded-[16px] bg-teal px-3 py-2.5 text-white">
              <b className="text-body-sm">{queue.bulk.selected(selCount)}</b>
              <span className="flex-1" />
              {queue.bulk.actions.map((a, i) => (
                <button
                  key={a}
                  type="button"
                  className={`h-[34px] cursor-pointer rounded-pill border-0 px-3.5 text-label font-semibold ${
                    i === 0 ? "bg-card text-ink" : "bg-white/12 text-white"
                  }`}
                >
                  {a}
                </button>
              ))}
              <button type="button" onClick={() => setChecked({})} className="h-[34px] cursor-pointer rounded-pill border-0 bg-transparent px-3 text-label font-semibold text-mint">
                {queue.bulk.clear}
              </button>
            </div>
          ) : null}

          <div className="scrollbar-thin -mx-1.5 h-0 min-h-[420px] flex-[1_1_0] overflow-x-hidden overflow-y-auto px-1.5">
            <div className="flex flex-col gap-1">
              <div className={`${cols} sticky top-0 z-[2] bg-card px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
                <TickBox
                  ref={headerBox}
                  checked={allVisible}
                  onChange={toggleAllVisible}
                  aria-label={queue.selectAll}
                  className="m-0 h-[18px] w-[18px] accent-teal"
                />
                {queue.columns.map((c) => (
                  <span key={c}>{c}</span>
                ))}
                <span />
              </div>
              {rows.map((d, i) => (
                <DealRow
                  key={d.id}
                  deal={assigned[d.id] ? { ...d, owner: assigned[d.id] } : d}
                  now={now}
                  index={i}
                  selected={selected === d.id}
                  checked={!!checked[d.id]}
                  onCheck={() => toggle(d.id)}
                  onPick={() => setSelected(d.id)}
                />
              ))}
              {rows.length === 0 ? (
                <div className="rounded-[18px] bg-tile p-6 text-center text-body-sm text-hint">{queue.empty}</div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-2">
            <span className="text-label text-hint">{queue.showing(rows.length, total)}</span>
            <div className="flex gap-1.5">
              <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">{queue.previous}</button>
              <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-teal px-3 text-label font-semibold text-white">{queue.next}</button>
            </div>
          </div>
        </section>

        <aside aria-labelledby="h-prev" className="flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5">
          <Preview deal={sel} />
          <NeedsALook deal={sel} />
        </aside>
      </div>

      {/* Team, waiting time, closed today: equal heights in the row (layout rule 1). */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        <TeamWorkload rows={workload} unassigned={summary.unassigned} />
        <WhereDealsWait waits={stats.waits} />
        <ClosedToday stats={stats} />
      </section>

      <p className="m-0 text-center text-label text-hint">
        {keyboardHint.lead}{" "}
        {keyboardHint.keys.map((k, i) => (
          <span key={k.key}>
            {i ? " · " : ""}
            <kbd className="font-mono">{k.key}</kbd>
            {k.alt ? (
              <>
                {" / "}
                <kbd className="font-mono">{k.alt}</kbd>
              </>
            ) : null}{" "}
            {k.text}
          </span>
        ))}
      </p>
    </>
  );
}

function DealRow({
  deal: d,
  now,
  index,
  selected,
  checked,
  onCheck,
  onPick,
}: {
  deal: DealListItem;
  now: IsoDateTime;
  index: number;
  selected: boolean;
  checked: boolean;
  onCheck: () => void;
  onPick: () => void;
}) {
  const sla = deadlineStyle[deadlineLevel(d.deadline)];
  const [from, to] = dealTile(d.id);
  const barStyle: CSSProperties & { "--delay"?: string } = { width: `${deadlinePercent(d.deadline)}%`, "--delay": `${(0.35 + index * 0.07).toFixed(2)}s` };
  return (
    <div
      data-deal-id={d.id}
      className={`${cols} box-border w-full rounded-[18px] px-3 py-[9px] text-ink ${selected ? "bg-tile shadow-[inset_0_0_0_1.5px_#0F1513]" : ""}`}
    >
      <TickBox checked={checked} onChange={onCheck} aria-label={queue.select(d.merchantName)} className="m-0 h-[18px] w-[18px] accent-teal" />

      <button
        type="button"
        onClick={onPick}
        aria-pressed={selected}
        aria-label={queue.preview(d.merchantName)}
        className="flex min-w-0 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-ink"
      >
        <span
          className="grid h-10 w-10 flex-none place-items-center rounded-[13px] font-heading text-body-sm font-semibold text-white"
          style={{ backgroundImage: `linear-gradient(140deg, ${from}, ${to})` }}
        >
          {d.merchantInitials}
        </span>
        <span className="min-w-0">
          <b className="block truncate text-[13.5px]">{d.merchantName}</b>
          <span className="block truncate text-[11.5px] text-hint">
            <span className="font-mono">{d.id}</span> · {brokerLabel(d)} · {receivedLabel(d, now)}
          </span>
        </span>
      </button>

      <span className="min-w-0">
        <b className="block font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em]">{moneyShort(d.requested)}</b>
        <span className="text-[11.5px] text-hint">{recommendedLabel(d)}</span>
      </span>

      <span className="flex items-center gap-2">
        {d.score !== null ? (
          <Ring value={d.score} size={34} color={scoreColor(d.score)} ariaLabel={queue.scoreLabel(d.score)} delay={0.2 + index * 0.07} />
        ) : (
          <Ring value={0} size={34} color="grey" ariaLabel={queue.notScored} animate={false} label={<span className="text-hint">—</span>} />
        )}
        <Chip size="sm" color={riskChip(d.risk)}>{riskLabel(d.risk)}</Chip>
      </span>

      <Chip color={statusChip[d.status]} className="justify-self-start">{dealStatusLabel[d.status]}</Chip>

      <span className="min-w-0">
        <b className={`block text-[12.5px] font-semibold whitespace-nowrap ${sla.text}`}>{deadlineLabel(d.deadline)}</b>
        <span className="mt-[5px] block h-1 overflow-hidden rounded-[2px] bg-line">
          <span className={`anim-grow-x block h-1 rounded-[2px] ${sla.bar}`} style={barStyle} />
        </span>
      </span>

      {d.owner ? (
        <Avatar initials={d.owner.initials} name={queue.assignedTo(d.owner.name)} size={32} color="sand" className="justify-self-end" />
      ) : (
        <span
          aria-label={queue.unassigned}
          className="box-border grid h-8 w-8 place-items-center justify-self-end rounded-full border-[1.5px] border-dashed border-grey-dot text-label-sm font-bold text-hint"
        >
          +
        </span>
      )}
    </div>
  );
}

function Preview({ deal: d }: { deal: DealListItem }) {
  const m = metricLabels(d);
  const stat = (label: string, value: string) => (
    <span className="rounded-tile bg-white/10 px-3 py-2.5">
      <span className="text-[9.5px] font-semibold tracking-[0.08em] uppercase text-muted">{label}</span>
      <b className="block font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">{value}</b>
    </span>
  );
  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
      <div className="flex items-center justify-between">
        <span className={`${cap} text-muted`}>{quickPreview.cap}</span>
        <span className="rounded-pill bg-teal/7 px-[9px] py-1 font-mono text-label-sm">{d.id}</span>
      </div>
      <h2 id="h-prev" className="m-0 font-heading text-[23px] leading-[1.15] font-semibold">{d.merchantName}</h2>
      <span className="text-[12.5px] text-muted">{quickPreview.sub(brokerLabel(d), moneyShort(d.requested))}</span>
      <div className="grid grid-cols-2 gap-2">
        {stat(quickPreview.stats.revenue, m.revenue)}
        {stat(quickPreview.stats.balance, m.balance)}
        {stat(quickPreview.stats.nsfs, m.nsfs)}
        {stat(quickPreview.stats.positions, m.positions)}
      </div>
      <Link
        href={dealHref(d.id)}
        className="grid h-11 place-items-center rounded-pill bg-teal text-body-sm font-semibold text-white no-underline shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
      >
        {quickPreview.open}
      </Link>
    </article>
  );
}

function NeedsALook({ deal: d }: { deal: DealListItem }) {
  const flags = d.findings;
  return (
    // The last card stretches so both sides end on the same line (design .q-side).
    <article className="flex flex-1 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <b className="font-heading text-[17px] font-semibold">{needsALook.title}</b>
        <span className={`rounded-pill px-2.5 py-1 text-label-sm font-semibold ${flags.length ? "bg-red-bg text-red-text" : "bg-mint-bg text-teal-dark"}`}>
          {flags.length ? needsALook.found(flags.length) : needsALook.clear}
        </span>
      </div>
      {flags.length ? (
        flags.map((f) => (
          <span key={f.text} className="flex items-start gap-2.5 rounded-tile bg-white/70 px-3 py-2.5 text-[12.5px]">
            <span className={`mt-[5px] h-2 w-2 flex-none rounded-full ${f.severe ? "bg-red" : "bg-amber"}`} />
            {f.text}
          </span>
        ))
      ) : (
        <span className="flex items-start gap-2.5 rounded-tile bg-white/70 px-3 py-2.5 text-[12.5px]">
          <span className="mt-[5px] h-2 w-2 flex-none rounded-full bg-teal" />
          {d.summary}
        </span>
      )}
      <span className={`${cap} mt-1 text-hint`}>{needsALook.next}</span>
      <b className="text-[13.5px]">{d.nextStep}</b>
    </article>
  );
}

function TeamWorkload({ rows, unassigned }: { rows: WorkloadRow[]; unassigned: number }) {
  return (
    <article aria-labelledby="h-team" className="flex flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
      <div>
        <h2 id="h-team" className="m-0 font-heading text-card-title-lg font-semibold">{workloadCard.title}</h2>
        <div className="mt-[3px] text-label text-hint">{workloadCard.subtitle(rows[0]?.capacity ?? 0)}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((p, i) => (
          <div key={p.id} className="grid grid-cols-[34px_minmax(0,1fr)_44px] items-center gap-2.5">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-sand text-label-sm font-bold text-sand-text">{p.initials}</span>
            <span className="min-w-0">
              <b className="text-body-sm">{p.name}</b>
              {p.overdue ? <span className="text-label-sm font-semibold text-coral-text">{workloadCard.overdue(p.overdue)}</span> : null}
              <ProgressBar className="mt-[5px]" value={Math.round((p.open / p.capacity) * 100)} height={6} color={p.overdue ? "amber" : "teal"} track="line" delay={0.3 + i * 0.08} />
            </span>
            <b className="text-right font-heading tabular-nums tracking-[-0.03em]">{p.open}</b>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3">
        <span className="text-[12.5px]">
          <b>{workloadCard.unassigned(unassigned)}</b>
          {workloadCard.unassignedAfter}
        </span>
        <button type="button" className="h-9 cursor-pointer rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
          {workloadCard.autoAssign}
        </button>
      </div>
    </article>
  );
}

function WhereDealsWait({ waits }: { waits: DealQueueStats["waits"] }) {
  const longest = Math.max(...waits.map((w) => w.medianMinutes));
  return (
    <article aria-labelledby="h-wait" className="flex flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div>
        <h2 id="h-wait" className="m-0 font-heading text-card-title-lg font-semibold">{waitsCard.title}</h2>
        <div className="mt-[3px] text-label text-muted">{waitsCard.subtitle}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {waits.map((s, i) => {
          const warn = s.medianMinutes === longest;
          return (
            <div key={s.status}>
              <div className="flex justify-between text-[12.5px]">
                <span>{dealStatusLabel[s.status]}</span>
                <b className={warn ? "text-amber-text" : ""}>{waitLabel(s.medianMinutes)}</b>
              </div>
              <ProgressBar className="mt-[5px]" value={Math.round(s.bar * 100)} height={8} color={warn ? "amber" : "ink"} track="ink" delay={0.3 + i * 0.08} />
            </div>
          );
        })}
      </div>
      <span className="mt-auto text-[12.5px] text-grey-text">{waitsCard.note}</span>
    </article>
  );
}

function ClosedToday({ stats }: { stats: DealQueueStats }) {
  const c = stats.closedToday;
  const outcomes = [
    { label: closedCard.outcomes.approved, value: c.approved, color: "text-teal-deep" },
    { label: closedCard.outcomes.countered, value: c.countered, color: "text-amber-deep" },
    { label: closedCard.outcomes.declined, value: c.declined, color: "text-coral-text" },
  ];
  return (
    <article aria-labelledby="h-closed" className="flex flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="h-closed" className="m-0 font-heading text-card-title-lg font-semibold">{closedCard.title}</h2>
          <div className="mt-[3px] text-label text-muted">{closedCard.subtitle}</div>
        </div>
        <span className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{c.approved + c.countered + c.declined}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {outcomes.map((o) => (
          <span key={o.label} className="rounded-tile bg-teal/7 px-3 py-2.5">
            <b className={`block font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em] ${o.color}`}>{o.value}</b>
            <span className="text-[9.5px] font-semibold tracking-[0.08em] uppercase text-muted">{o.label}</span>
          </span>
        ))}
      </div>
      <span className={`${cap} mt-0.5 text-muted`}>{closedCard.reasons}</span>
      <div className="flex flex-col gap-1.5">
        {stats.declineReasons.map((r) => (
          <span key={r.reason} className="flex justify-between rounded-[12px] bg-teal/7 px-3 py-[9px] text-[12.5px]">
            <span>{r.reason}</span>
            <b>{r.count}</b>
          </span>
        ))}
      </div>
      <Link href={closedCard.link.href} className="mt-auto self-start text-[12.5px] font-semibold text-teal-deep no-underline">
        {closedCard.link.label}
      </Link>
    </article>
  );
}
