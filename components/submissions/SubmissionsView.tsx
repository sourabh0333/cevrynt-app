"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { PageActions } from "@/components/shell/PageActions";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Ring } from "@/components/ui/Ring";
import {
  activeFilters,
  bulkActions,
  closedToday,
  deals,
  initialSelected,
  keyboardHint,
  riskChip,
  savedViews,
  scoreColor,
  slaStyle,
  statusCards,
  statusInfo,
  submissionsHeader,
  teamWorkload,
  whereDealsWait,
  type Deal,
  type DealStatus,
} from "@/lib/sample-data/submissions";

/*
 * Design .qcols: check, merchant, amount, score · risk, status, deadline, owner.
 * Under 1100px the score column hides (design media query). No horizontal
 * scroll: columns flex and text truncates.
 */
const cols =
  "grid grid-cols-[24px_minmax(0,1.6fr)_84px_112px_116px_96px_28px] items-center gap-2.5 [&>*]:min-w-0 max-[1100px]:grid-cols-[24px_minmax(0,1fr)_84px_112px_96px_28px] max-[1100px]:[&>:nth-child(4)]:hidden";

const cap = "text-cap font-semibold uppercase";
const me = { initials: "MC", name: "Maya Chen" };

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

/**
 * Submissions, from design/Submissions.html with the logic of
 * Submissions.dc.html. State: the status filter, the selected deal, the
 * search text, the ticked rows and any quick assignments. Keyboard:
 * J / K move, Enter opens, A assigns to you, X ticks; never while typing.
 */
export function SubmissionsView() {
  const router = useRouter();
  const [tab, setTab] = useState<DealStatus | "all">("all");
  const [selected, setSelected] = useState(initialSelected);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [assigned, setAssigned] = useState<Record<string, typeof me>>({});
  const headerBox = useRef<HTMLInputElement>(null);

  const q = search.trim().toLowerCase();
  const rows = deals.filter(
    (d) =>
      (tab === "all" || d.status === tab) &&
      (!q || [d.name, d.id, d.broker, d.owner?.name ?? ""].some((s) => s.toLowerCase().includes(q))),
  );
  const sel = deals.find((d) => d.id === selected) ?? deals[0];
  const total = statusCards.find((c) => c.key === tab)?.count ?? deals.length;

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
  const assignToMe = useCallback((id: string) => setAssigned((a) => ({ ...a, [id]: me })), []);

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
        if (key === "enter") router.push(`/deals/${d.id}`);
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
            {submissionsHeader.line}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/submissions" className="inline-flex h-11 items-center gap-2 rounded-tile bg-card px-4 text-body-sm font-semibold text-ink no-underline">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="4" rx="1" />
              <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
            </svg>
            Archived
          </Link>
          <PageActions />
        </div>
      </header>

      {/* Status filters */}
      <nav aria-label="Filter by status" className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {statusCards.map((c) => {
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
                <span className={`h-[9px] w-[9px] rounded-full ${c.dot}`} />
              </span>
              <span className="font-heading text-[28px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{c.count}</span>
              <span className={`text-[11.5px] ${on ? "text-muted" : "text-hint"}`}>{c.sub}</span>
            </button>
          );
        })}
      </nav>

      {/* Toolbar */}
      <section aria-label="Search and views" className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-[42px] min-w-[240px] items-center gap-2 rounded-pill bg-card px-3.5">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-hint">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              aria-label="Search submissions"
              placeholder="Merchant, owner, APP ID or broker"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-body-sm text-ink outline-none placeholder:text-hint"
            />
          </label>
          <span className={`${cap} pl-1 text-hint`}>Views</span>
          {savedViews.map((v) => (
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
            + Save view
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-tile border-0 bg-card px-3.5 text-[12.5px] font-semibold text-ink">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filters
          </button>
          <button type="button" className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-tile border-0 bg-card px-3.5 text-[12.5px] font-semibold text-ink">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
            </svg>
            Deadline first
          </button>
        </div>
      </section>

      {/* Active filters */}
      <section aria-label="Active filters" className="flex flex-wrap items-center gap-2 rounded-tile-lg bg-card-deep px-3 py-2.5">
        <span className={`${cap} px-1 text-muted`}>Filters</span>
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
          Clear all
        </button>
      </section>

      {/* Queue + preview: both stretch; the queue scrolls inside (layout rules 1 and 2). */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-queue" className="relative flex min-w-0 flex-[999_1_640px] flex-col gap-2 rounded-card-lg bg-card px-4 py-[18px] text-ink">
          <h2 id="h-queue" className="sr-only">Deals</h2>

          {selCount > 0 ? (
            <div role="toolbar" aria-label="Bulk actions" className="flex flex-wrap items-center gap-2.5 rounded-[16px] bg-teal px-3 py-2.5 text-white">
              <b className="text-body-sm">{selCount} selected</b>
              <span className="flex-1" />
              {bulkActions.map((a, i) => (
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
                Clear
              </button>
            </div>
          ) : null}

          <div className="scrollbar-thin -mx-1.5 h-0 min-h-[420px] flex-[1_1_0] overflow-x-hidden overflow-y-auto px-1.5">
            <div className="flex flex-col gap-1">
              <div className={`${cols} sticky top-0 z-[2] bg-card px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
                <input
                  ref={headerBox}
                  type="checkbox"
                  checked={allVisible}
                  onChange={toggleAllVisible}
                  aria-label="Select all deals shown"
                  className="m-0 h-[18px] w-[18px] accent-teal"
                />
                <span>Merchant</span>
                <span>Amount</span>
                <span>Score · risk</span>
                <span>Status</span>
                <span>Deadline</span>
                <span />
              </div>
              {rows.map((d, i) => (
                <DealRow
                  key={d.id}
                  deal={assigned[d.id] ? { ...d, owner: assigned[d.id] } : d}
                  index={i}
                  selected={selected === d.id}
                  checked={!!checked[d.id]}
                  onCheck={() => toggle(d.id)}
                  onPick={() => setSelected(d.id)}
                />
              ))}
              {rows.length === 0 ? (
                <div className="rounded-[18px] bg-tile p-6 text-center text-body-sm text-hint">No deals match. Try another status or search.</div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-2">
            <span className="text-label text-hint">
              Showing {rows.length} of {total}
            </span>
            <div className="flex gap-1.5">
              <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">Previous</button>
              <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-teal px-3 text-label font-semibold text-white">Next</button>
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
        <TeamWorkload />
        <WhereDealsWait />
        <ClosedToday />
      </section>

      <p className="m-0 text-center text-label text-hint">
        Keyboard:{" "}
        {keyboardHint.map((k, i) => (
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
  index,
  selected,
  checked,
  onCheck,
  onPick,
}: {
  deal: Deal;
  index: number;
  selected: boolean;
  checked: boolean;
  onCheck: () => void;
  onPick: () => void;
}) {
  const s = statusInfo[d.status];
  const sla = slaStyle[d.slaLevel];
  const barStyle: CSSProperties & { "--delay"?: string } = { width: `${d.slaPercent}%`, "--delay": `${(0.35 + index * 0.07).toFixed(2)}s` };
  return (
    <div
      data-deal-id={d.id}
      className={`${cols} box-border w-full rounded-[18px] px-3 py-[9px] text-ink ${selected ? "bg-tile shadow-[inset_0_0_0_1.5px_#0F1513]" : ""}`}
    >
      <input type="checkbox" checked={checked} onChange={onCheck} aria-label={`Select ${d.name}`} className="m-0 h-[18px] w-[18px] accent-teal" />

      <button
        type="button"
        onClick={onPick}
        aria-pressed={selected}
        aria-label={`Preview ${d.name}`}
        className="flex min-w-0 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-ink"
      >
        <span
          className="grid h-10 w-10 flex-none place-items-center rounded-[13px] font-heading text-body-sm font-semibold text-white"
          style={{ backgroundImage: `linear-gradient(140deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
        >
          {d.initials}
        </span>
        <span className="min-w-0">
          <b className="block truncate text-[13.5px]">{d.name}</b>
          <span className="block truncate text-[11.5px] text-hint">
            <span className="font-mono">{d.id}</span> · {d.broker} · {d.received}
          </span>
        </span>
      </button>

      <span className="min-w-0">
        <b className="block font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em]">{d.requested}</b>
        <span className="text-[11.5px] text-hint">{d.recommended}</span>
      </span>

      <span className="flex items-center gap-2">
        {d.score !== null ? (
          <Ring value={d.score} size={34} color={scoreColor(d.score)} ariaLabel={`Score ${d.score}`} delay={0.2 + index * 0.07} />
        ) : (
          <Ring value={0} size={34} color="grey" ariaLabel="Not scored" animate={false} label={<span className="text-hint">—</span>} />
        )}
        <Chip size="sm" color={riskChip[d.risk]}>{d.risk}</Chip>
      </span>

      <Chip color={s.chip} className="justify-self-start">{s.label}</Chip>

      <span className="min-w-0">
        <b className={`block text-[12.5px] font-semibold whitespace-nowrap ${sla.text}`}>{d.sla}</b>
        <span className="mt-[5px] block h-1 overflow-hidden rounded-[2px] bg-line">
          <span className={`anim-grow-x block h-1 rounded-[2px] ${sla.bar}`} style={barStyle} />
        </span>
      </span>

      {d.owner ? (
        <Avatar initials={d.owner.initials} name={`Assigned to ${d.owner.name}`} size={32} color="sand" className="justify-self-end" />
      ) : (
        <span
          aria-label="Not assigned yet"
          className="box-border grid h-8 w-8 place-items-center justify-self-end rounded-full border-[1.5px] border-dashed border-grey-dot text-label-sm font-bold text-hint"
        >
          +
        </span>
      )}
    </div>
  );
}

function Preview({ deal: d }: { deal: Deal }) {
  const stat = (label: string, value: string) => (
    <span className="rounded-tile bg-white/10 px-3 py-2.5">
      <span className="text-[9.5px] font-semibold tracking-[0.08em] uppercase text-muted">{label}</span>
      <b className="block font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">{value}</b>
    </span>
  );
  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
      <div className="flex items-center justify-between">
        <span className={`${cap} text-muted`}>Quick preview</span>
        <span className="rounded-pill bg-teal/7 px-[9px] py-1 font-mono text-label-sm">{d.id}</span>
      </div>
      <h2 id="h-prev" className="m-0 font-heading text-[23px] leading-[1.15] font-semibold">{d.name}</h2>
      <span className="text-[12.5px] text-muted">
        {d.broker} · requested {d.requested}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {stat("True revenue", d.preview.revenue)}
        {stat("Avg balance", d.preview.balance)}
        {stat("NSFs · 4 mo", d.preview.nsfs)}
        {stat("Positions", d.preview.positions)}
      </div>
      <Link
        href={`/deals/${d.id}`}
        className="grid h-11 place-items-center rounded-pill bg-teal text-body-sm font-semibold text-white no-underline shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
      >
        Open deal
      </Link>
    </article>
  );
}

function NeedsALook({ deal: d }: { deal: Deal }) {
  const flags = d.preview.flags;
  return (
    // The last card stretches so both sides end on the same line (design .q-side).
    <article className="flex flex-1 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <b className="font-heading text-[17px] font-semibold">What needs a look</b>
        <span className={`rounded-pill px-2.5 py-1 text-label-sm font-semibold ${flags.length ? "bg-red-bg text-red-text" : "bg-mint-bg text-teal-dark"}`}>
          {flags.length ? `${flags.length} found` : "All clear"}
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
          {d.preview.calm}
        </span>
      )}
      <span className={`${cap} mt-1 text-hint`}>Next step</span>
      <b className="text-[13.5px]">{d.preview.next}</b>
    </article>
  );
}

function TeamWorkload() {
  return (
    <article aria-labelledby="h-team" className="flex flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
      <div>
        <h2 id="h-team" className="m-0 font-heading text-card-title-lg font-semibold">Team workload</h2>
        <div className="mt-[3px] text-label text-hint">{teamWorkload.subtitle}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {teamWorkload.people.map((p, i) => (
          <div key={p.initials} className="grid grid-cols-[34px_minmax(0,1fr)_44px] items-center gap-2.5">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-sand text-label-sm font-bold text-sand-text">{p.initials}</span>
            <span className="min-w-0">
              <b className="text-body-sm">{p.name}</b>
              {p.overdue ? <span className="text-label-sm font-semibold text-coral-text"> · {p.overdue} overdue</span> : null}
              <ProgressBar className="mt-[5px]" value={p.percent} height={6} color={p.warn ? "amber" : "teal"} track="line" delay={0.3 + i * 0.08} />
            </span>
            <b className="text-right font-heading tabular-nums tracking-[-0.03em]">{p.open}</b>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3">
        <span className="text-[12.5px]">
          <b>{teamWorkload.unassigned} unassigned</b> deals
        </span>
        <button type="button" className="h-9 cursor-pointer rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
          Auto-assign
        </button>
      </div>
    </article>
  );
}

function WhereDealsWait() {
  return (
    <article aria-labelledby="h-wait" className="flex flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div>
        <h2 id="h-wait" className="m-0 font-heading text-card-title-lg font-semibold">Where deals wait</h2>
        <div className="mt-[3px] text-label text-muted">{whereDealsWait.subtitle}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {whereDealsWait.stages.map((s, i) => (
          <div key={s.label}>
            <div className="flex justify-between text-[12.5px]">
              <span>{s.label}</span>
              <b className={s.warn ? "text-amber-text" : ""}>{s.value}</b>
            </div>
            <ProgressBar className="mt-[5px]" value={s.percent} height={8} color={s.warn ? "amber" : "ink"} track="ink" delay={0.3 + i * 0.08} />
          </div>
        ))}
      </div>
      <span className="mt-auto text-[12.5px] text-grey-text">{whereDealsWait.note}</span>
    </article>
  );
}

function ClosedToday() {
  return (
    <article aria-labelledby="h-closed" className="flex flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="h-closed" className="m-0 font-heading text-card-title-lg font-semibold">Closed today</h2>
          <div className="mt-[3px] text-label text-muted">{closedToday.subtitle}</div>
        </div>
        <span className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{closedToday.total}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {closedToday.outcomes.map((o) => (
          <span key={o.label} className="rounded-tile bg-teal/7 px-3 py-2.5">
            <b className={`block font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em] ${o.color}`}>{o.value}</b>
            <span className="text-[9.5px] font-semibold tracking-[0.08em] uppercase text-muted">{o.label}</span>
          </span>
        ))}
      </div>
      <span className={`${cap} mt-0.5 text-muted`}>Top decline reasons</span>
      <div className="flex flex-col gap-1.5">
        {closedToday.reasons.map((r) => (
          <span key={r.label} className="flex justify-between rounded-[12px] bg-teal/7 px-3 py-[9px] text-[12.5px]">
            <span>{r.label}</span>
            <b>{r.count}</b>
          </span>
        ))}
      </div>
      <Link href={closedToday.href} className="mt-auto self-start text-[12.5px] font-semibold text-teal-deep no-underline">
        See closed deals
      </Link>
    </article>
  );
}
