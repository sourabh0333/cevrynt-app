"use client";

import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { autoRules, connectionsCopy, coverage, thisMonth } from "@/lib/copy/stacking";
import type { StackingSummary } from "@/lib/data/types";
import type { AlertRow } from "@/lib/data/views/stacking";
import { TickBox } from "@/components/ui/TickBox";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const nodeFill = {
  mint: { rect: "fill-mint-light stroke-mint-border", sub: "fill-muted" },
  grey: { rect: "fill-card stroke-line-strong", sub: "fill-muted" },
  amber: { rect: "fill-amber-tint stroke-amber-stripe", sub: "fill-amber-text" },
};

/** One box on the map: a rounded rect with a title and a sub line, fading in together. */
function Node({ x, y, title, sub, tone, delay }: { x: number; y: number; title: string; sub: string; tone: "mint" | "grey" | "amber"; delay: number }) {
  const f = nodeFill[tone];
  return (
    <g className="anim-cn-fade" style={d(delay)}>
      <rect x={x} y={y} width="160" height="52" rx="16" className={f.rect} />
      <text x={x + 16} y={y + 22} fontSize="12.5" fontWeight="700" className="fill-ink">
        {title}
      </text>
      <text x={x + 16} y={y + 40} fontSize="11" className={f.sub}>
        {sub}
      </text>
    </g>
  );
}

/**
 * "Hidden connections" from design/Stacking.html: the map of two
 * applications joined through a shared account and phone. In order: the
 * left nodes fade in, the grey links draw, the shared circle pops, the
 * right nodes fade in, then the red dashed links appear and keep flowing.
 * Drawn from the alert that links the two businesses, with its deal.
 */
export function ConnectionsCard({ alert }: { alert: AlertRow }) {
  const c = connectionsCopy(alert);
  return (
    <Card as="article" aria-labelledby="h-map" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-map" className="m-0 font-heading text-[20px] font-semibold">{c.title}</h2>
          <div className="mt-[3px] text-label text-hint">{c.subtitle}</div>
        </div>
        <span className="rounded-pill bg-red-bg px-2.5 py-1 text-label-sm font-semibold text-red-text">{c.chip}</span>
      </div>
      <div className="rounded-[22px] bg-tile p-2.5">
        <svg role="img" aria-label={c.mapLabel} viewBox="0 0 640 250" className="block h-[250px] w-full font-sans">
          <g strokeWidth="2" fill="none" className="stroke-line-dashed">
            <path className="anim-cn-link" pathLength={1} style={d(0.5)} d="M150 70 C230 70 250 125 320 125" />
            <path className="anim-cn-link" pathLength={1} style={d(0.65)} d="M150 180 C230 180 250 125 320 125" />
          </g>
          <g strokeWidth="2.5" fill="none" className="stroke-red">
            <path className="anim-cn-red" style={d(1.0)} d="M490 70 C410 70 390 125 320 125" />
            <path className="anim-cn-red" style={d(1.0)} d="M490 180 C410 180 390 125 320 125" />
          </g>
          <Node x={20} y={44} {...c.left[0]} delay={0.1} />
          <Node x={20} y={154} {...c.left[1]} delay={0.2} />
          <Node x={460} y={44} {...c.right[0]} delay={1.2} />
          <Node x={460} y={154} {...c.right[1]} delay={1.35} />
          <circle cx="320" cy="125" r="62" className="anim-cn-hub fill-red-bg stroke-red-light" style={d(0.75)} />
          <g className="anim-cn-fade" style={d(0.8)}>
            <text x="320" y="112" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-red-text">
              {c.shared.caption}
            </text>
            <text x="320" y="130" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-ink">
              {c.shared.account}
            </text>
            <text x="320" y="147" textAnchor="middle" fontSize="11.5" className="fill-grey-text">
              {c.shared.phone}
            </text>
          </g>
        </svg>
      </div>
      <span className="text-[12.5px] text-muted">{c.note}</span>
    </Card>
  );
}

/** "This month": the four outcome rows and the cross-funder network note. */
export function MonthCard({ summary }: { summary: StackingSummary }) {
  return (
    <article aria-labelledby="h-out" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-line bg-tile p-5 text-ink">
      <h2 id="h-out" className="m-0 font-heading text-[18px] font-semibold">{thisMonth.title}</h2>
      <div className="flex flex-col gap-1.5">
        {thisMonth.rows(summary).map((r) => (
          <span key={r.label} className={`flex items-center justify-between rounded-tile px-3 py-[11px] text-[12.5px] ${r.good ? "bg-mint-light" : "bg-card"}`}>
            <span>{r.label}</span>
            <b className={`font-heading text-[16px] font-semibold tabular-nums tracking-[-0.03em] ${r.good ? "text-teal-deep" : ""}`}>{r.value}</b>
          </span>
        ))}
      </div>
      <div className="mt-auto rounded-[16px] border border-mint-border bg-mint-card px-3.5 py-3 text-label">
        <span className="mb-1.5 inline-block rounded-pill bg-tile px-2 py-0.5 text-[10.5px] font-semibold text-teal-deep">{thisMonth.soon.chip}</span>
        <b className="block">{thisMonth.soon.title}</b>
        <span className="text-grey-text">{thisMonth.soon.text}</span>
      </div>
    </article>
  );
}

/** "What happens automatically": the five rules with working switches and the "x of 5 on" count. */
export function RulesCard({ summary }: { summary: StackingSummary }) {
  const rules = autoRules.rules(summary);
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(rules.map((r) => [r.key, r.on])));
  const count = rules.filter((r) => on[r.key]).length;
  return (
    <Card as="article" aria-labelledby="h-rules" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-rules" className="m-0 font-heading text-[20px] font-semibold">{autoRules.title}</h2>
          <div className="mt-[3px] text-label text-hint">{autoRules.subtitle}</div>
        </div>
        <span className="rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold text-grey-text" aria-live="polite">
          {autoRules.count(count, rules.length)}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-2">
        {rules.map((r) => (
          <label key={r.key} className="flex cursor-pointer items-center gap-3 rounded-[18px] bg-tile px-3.5 py-3">
            <span className="min-w-0 flex-1">
              <b className="block text-body-sm">{r.title}</b>
              <span className="text-[11.5px] text-hint">{r.sub}</span>
            </span>
            <TickBox checked={!!on[r.key]} onChange={() => setOn((x) => ({ ...x, [r.key]: !x[r.key] }))} className="m-0 h-5 w-5 flex-none accent-teal" />
          </label>
        ))}
      </div>
    </Card>
  );
}

/** "How well we can see": the coverage bar that grows in, the two counts and the connect button. */
export function CoverageCard({ summary: s }: { summary: StackingSummary }) {
  const c = coverage;
  const { full, partial } = s.watched;
  return (
    <article aria-labelledby="h-cov" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-cov" className="m-0 font-heading text-[18px] font-semibold">{c.title}</h2>
        <span className="rounded-pill bg-amber-bg px-[9px] py-[3px] text-label-sm font-semibold text-amber-text">{c.chip(s)}</span>
      </div>
      <span className="text-[12.5px] text-muted">{c.text}</span>
      <div role="img" aria-label={c.barLabel(s)} className="anim-grow-x flex h-3 gap-0.5 overflow-hidden rounded-[6px]" style={d(0.2)}>
        <span className="bg-teal" style={{ flex: full }} />
        <span className="bg-card-deep" style={{ flex: partial }} />
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        <span className="flex justify-between rounded-tile bg-card px-3 py-2.5">
          <span className="inline-flex items-center gap-2">
            <span className="h-[9px] w-[9px] rounded-[3px] bg-teal" />
            {c.full}
          </span>
          <b>{full}</b>
        </span>
        <span className="flex justify-between rounded-tile bg-card px-3 py-2.5">
          <span className="inline-flex items-center gap-2">
            <span className="h-[9px] w-[9px] rounded-[3px] bg-sand-stripe" />
            {c.partial}
          </span>
          <b>{partial}</b>
        </span>
      </div>
      <Button className="mt-auto h-[42px] w-full text-[12.5px]">{c.cta(s)}</Button>
    </article>
  );
}
