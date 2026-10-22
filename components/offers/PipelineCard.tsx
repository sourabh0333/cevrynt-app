"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { pipeline as t, type ChipTone, type Stage, type StageKey } from "@/lib/sample-data/offers";

const stageColor: Record<Stage["color"], { dot: string; bar: string; ring: string }> = {
  amber: { dot: "bg-amber", bar: "bg-amber", ring: "var(--color-amber)" },
  blue: { dot: "bg-blue", bar: "bg-blue", ring: "var(--color-blue)" },
  purple: { dot: "bg-purple", bar: "bg-purple", ring: "var(--color-purple)" },
  teal: { dot: "bg-teal", bar: "bg-teal", ring: "var(--color-teal)" },
  "teal-ink": { dot: "bg-teal-ink", bar: "bg-teal-ink", ring: "var(--color-teal-ink)" },
};

const chip: Record<ChipTone, string> = {
  red: "bg-red-bg text-red-text",
  amber: "bg-amber-bg text-amber-text",
  blue: "bg-blue-bg text-blue-text",
  green: "bg-mint-bg text-teal-dark",
  grey: "bg-tile text-grey-text",
};

type Vars = CSSProperties & { "--stage"?: string; "--delay"?: string };

// Flexible columns, text truncates: no sideways scroll (layout rule 3).
const row = "grid grid-cols-[minmax(0,1.6fr)_80px_minmax(0,1fr)_auto] items-center gap-3.5 max-[640px]:grid-cols-[minmax(0,1fr)_80px_auto] max-[640px]:[&>:nth-child(3)]:hidden";

/**
 * "From offer to funded" from design/Offers.html and its prototype: the
 * search box, the Everyone / Mine switch, the five-stage stepper and the
 * list of deals in the chosen stage with each one's next action. The
 * stage bars grow in once. No hover.
 */
export function PipelineCard() {
  const [stage, setStage] = useState<StageKey>("sent");
  const [view, setView] = useState<"all" | "mine">("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visible = (st: Stage) =>
    st.cards.filter((c) => (view === "all" || c.mine) && (!q || c.name.toLowerCase().includes(q) || c.broker.toLowerCase().includes(q)));
  const cur = t.stages.find((s) => s.key === stage) ?? t.stages[0];
  const cards = visible(cur);
  const extra = view === "all" && !q ? cur.total - cur.cards.length : 0;
  const sc = stageColor[cur.color];

  return (
    <Card as="section" aria-labelledby="h-pipe" padding={false} className="gap-3.5 p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-pipe" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-[38px] min-w-[200px] items-center gap-2 rounded-pill bg-tile px-3.5 text-hint">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              aria-label={t.search.label}
              placeholder={t.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-hint"
            />
          </label>
          <div role="group" aria-label="Show" className="flex gap-0.5 rounded-pill bg-tile p-1">
            {t.views.map((v) => {
              const on = v.key === view;
              return (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setView(v.key)}
                  className={`h-8 cursor-pointer rounded-pill border-0 px-3.5 text-label font-semibold ${on ? "bg-teal text-white" : "bg-transparent text-grey-text"}`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Stages" className="grid grid-cols-5 rounded-card bg-tile p-1.5 max-[760px]:grid-cols-2">
        {t.stages.map((st, i) => {
          const on = st.key === stage;
          const c = stageColor[st.color];
          const count = view === "all" ? st.total : st.cards.filter((x) => x.mine).length;
          const value = Math.round(st.cards.reduce((sum, x) => sum + x.amtK, 0) * (st.total / st.cards.length));
          const vars: Vars = { "--stage": c.ring, "--delay": `${0.1 + i * 0.08}s` };
          return (
            <button
              key={st.key}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setStage(st.key)}
              style={vars}
              className={`flex min-w-0 cursor-pointer flex-col gap-2 rounded-[18px] border-0 p-3.5 text-left text-ink ${on ? "bg-card shadow-[inset_0_0_0_1.5px_var(--stage)]" : "bg-transparent"}`}
            >
              <span className="flex w-full items-center justify-between gap-1.5">
                <span className="inline-flex min-w-0 items-center gap-[7px] text-[12.5px] font-semibold">
                  <span className={`h-2 w-2 flex-none rounded-full ${c.dot}`} />
                  <span className="truncate">{st.title}</span>
                </span>
                <span aria-hidden="true" className={`text-[16px] leading-none text-line-dashed ${st.key === "funded" ? "invisible" : ""}`}>
                  ›
                </span>
              </span>
              <span className="flex items-baseline gap-2">
                <b className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{count}</b>
                <span className="text-label opacity-75">${value}K</span>
              </span>
              <span className="block h-1 w-full rounded-[2px] bg-ink/7">
                <span className={`anim-grow-x block h-1 rounded-[2px] ${c.bar}`} style={{ width: `${Math.round((st.total / t.barOf) * 100)}%`, ...vars }} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-card bg-tile" aria-live="polite">
        <div className="flex items-center justify-between gap-2.5 border-b border-line-faint px-[18px] py-3.5">
          <span className="inline-flex min-w-0 items-center gap-2.5">
            <span className={`h-2.5 w-2.5 flex-none rounded-full ${sc.dot}`} />
            <b className="text-body">{cur.title}</b>
            <span className="truncate text-[11.5px] text-hint">{cur.hint}</span>
          </span>
          {extra > 0 ? <span className="whitespace-nowrap text-[11.5px] text-hint">{t.more(extra)}</span> : null}
        </div>
        {cards.map((c) => (
          <div key={c.name} className={`${row} border-b border-card px-[18px] py-3`}>
            <span className="flex min-w-0 items-center gap-3">
              <span
                className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[11px] text-label-sm font-bold text-white"
                style={{ background: `linear-gradient(140deg, ${c.g[0]}, ${c.g[1]})` }}
              >
                {c.ini}
              </span>
              <span className="min-w-0">
                <b className="block truncate text-body">{c.name}</b>
                <span className="block truncate text-[11.5px] text-hint">{c.broker}</span>
              </span>
            </span>
            <b className="font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">${c.amtK}K</b>
            <span className={`justify-self-start whitespace-nowrap rounded-pill px-2 py-[3px] text-[10.5px] font-semibold ${chip[c.tone]}`}>{c.note}</span>
            <Link
              href="#"
              className={`inline-flex h-[34px] items-center justify-self-end whitespace-nowrap rounded-pill px-3.5 text-label font-semibold no-underline ${cur.key === "checks" ? "bg-teal text-white" : "bg-card text-ink"}`}
            >
              {cur.action}
            </Link>
          </div>
        ))}
        {cards.length === 0 ? <div className="p-7 text-center text-[12.5px] text-hint">{t.empty}</div> : null}
      </div>
    </Card>
  );
}
