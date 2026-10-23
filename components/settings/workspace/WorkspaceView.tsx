"use client";

import { useState, type CSSProperties } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Switch } from "@/components/ui/Switch";
import {
  brand,
  company,
  dataDocs,
  moneyFlow as mf,
  notifications as nt,
  webAddresses as wa,
  workingHours,
  workspaceHeader as wh,
  yourData,
} from "@/lib/copy/workspace";
import type { NotificationRule, TeamMember, Workspace } from "@/lib/data/types";

type BrandVar = CSSProperties & { "--brand"?: string };

/**
 * The brand colors a funder can pick for what merchants and brokers see.
 * These are the customer's choices, not Cevrynt tokens: picking one
 * recolors the three previews only, never the app itself. The saved choice
 * is the workspace's brandColor.
 */
const brandColors = [
  { name: "Teal", hex: "#0E6B5C" },
  { name: "Navy", hex: "#1F4C78" },
  { name: "Plum", hex: "#57418A" },
  { name: "Graphite", hex: "#2F3B37" },
];

const h2 = "m-0 font-heading text-card-title font-semibold";
const cap = "text-cap font-semibold uppercase text-hint";
const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";

/** The dashed arrow between the money-flow cards; it turns to point down when the flow stacks. */
function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1.5 @max-[720px]:flex-row @max-[720px]:py-1">
      <span className="whitespace-nowrap text-label-sm font-semibold text-muted">{label}</span>
      <svg aria-hidden="true" width="100%" height="14" viewBox="0 0 100 14" preserveAspectRatio="none" className="max-w-[120px] @max-[720px]:w-10 @max-[720px]:rotate-90">
        <line x1="0" y1="7" x2="92" y2="7" strokeWidth="2" strokeDasharray="5 4" className="stroke-teal" />
        <path d="M90 2 L99 7 L90 12" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-teal" />
      </svg>
    </div>
  );
}

/** A label / value row on a card. */
function Row({ label, value, tile }: { label: string; value: string; tile: "white" | "grey" }) {
  return (
    <span className={`flex justify-between gap-2 rounded-tile px-3 py-2.5 text-[12.5px] ${tile === "white" ? "bg-tile" : "bg-card"}`}>
      <span>{label}</span>
      <b className="text-right">{value}</b>
    </span>
  );
}

export type WorkspaceViewProps = {
  workspace: Workspace;
  notificationRules: NotificationRule[];
  /** the team member who signs contracts (workspace.signerId) */
  signer: TeamMember | null;
};

/**
 * Settings → Workspace from design/Settings-Workspace.html and its prototype.
 * The records come from the data layer (lib/data/settings) as props; the
 * decision target is the same one Submissions counts down. Picking a brand
 * color recolors the three merchant-facing previews together (through one
 * --brand variable on the preview area); the app's own colors never change.
 * The notification switches work. No hover.
 */
export function WorkspaceView({ workspace: ws, notificationRules, signer }: WorkspaceViewProps) {
  const [color, setColor] = useState(() => Math.max(0, brandColors.findIndex((c) => c.hex.toLowerCase() === ws.brandColor.toLowerCase())));
  const [notes, setNotes] = useState<boolean[][]>(() => notificationRules.map((r) => nt.channels.map((c) => r.channels[c.key])));
  const brandStyle: BrandVar = { "--brand": brandColors[color].hex };
  const p = brand.previews;

  const mark = (size: 22 | 28) => (
    <span
      className={`grid flex-none place-items-center bg-(--brand) font-bold text-white ${size === 22 ? "h-[22px] w-[22px] rounded-[7px] text-[9px]" : "h-7 w-7 rounded-[9px] text-label-sm"}`}
    >
      {ws.initials}
    </span>
  );

  return (
    <>
      <section
        aria-labelledby="h-ws"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="grid h-16 w-16 flex-none place-items-center rounded-tile-lg bg-teal-forest font-heading text-[20px] font-bold text-white">
            {ws.initials}
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="h-ws" className="m-0 font-heading text-[24px] font-semibold">{ws.name}</h2>
            <span className="text-[12.5px] text-grey-text">{wh.text}</span>
          </div>
        </div>
        <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
          {wh.upload}
        </button>
      </section>

      <section aria-labelledby="h-co" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
        <h2 id="h-co" className={h2}>{company.title}</h2>
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {company.fields(ws).map((f) => (
            <div key={f.label} className="flex min-w-0 flex-col gap-1">
              <dt className="text-[11.5px] text-hint">{f.label}</dt>
              <dd className={`m-0 truncate rounded-[12px] border border-line bg-tile px-3 py-[11px] text-body-sm ${f.mono ? "font-mono" : ""}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
        {ws.emailVerified ? (
          <span className="flex items-center gap-2 text-label text-teal-deep">
            <span className="h-2 w-2 flex-none rounded-full bg-teal" />
            {company.verified}
          </span>
        ) : null}
      </section>

      <section aria-labelledby="h-brand" className="@container box-border flex min-w-0 flex-wrap gap-[18px] rounded-card-lg border border-line bg-tile p-5 text-ink">
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-3">
          <div>
            <h2 id="h-brand" className={h2}>{brand.title}</h2>
            <span className="text-label text-hint">{brand.subtitle}</span>
          </div>
          <span className={cap}>{brand.colorCap}</span>
          <div role="radiogroup" aria-label="Brand color" className="flex flex-wrap gap-2">
            {brandColors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                role="radio"
                aria-checked={i === color}
                aria-label={c.name}
                onClick={() => setColor(i)}
                className={`box-border h-10 w-10 cursor-pointer rounded-tile border-[3px] shadow-[0_0_0_1px_var(--color-line)] ${i === color ? "border-ink" : "border-tile"}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <span className={cap}>{brand.logoCap}</span>
          <div className="flex items-center gap-2.5 rounded-[16px] border-[1.5px] border-dashed border-line-dash-soft p-3" style={brandStyle}>
            {mark(28)}
            <span className="text-label text-muted">
              {brand.drop}
              <span className="block text-[11.5px] text-hint">{brand.dropHint}</span>
            </span>
          </div>
        </div>

        {/* Only this area takes the picked color, through --brand. */}
        <div style={brandStyle} aria-live="polite" className="grid min-w-0 flex-[3_1_480px] grid-cols-3 gap-2.5 @max-[640px]:grid-cols-1">
          <div className="flex min-w-0 flex-col gap-2 rounded-tile-lg bg-card p-3.5">
            <span className={cap}>{p.link.cap}</span>
            <div className="flex flex-1 flex-col gap-2 rounded-tile bg-tile p-3">
              <div className="flex items-center gap-1.5">
                {mark(22)}
                <b className="truncate text-[11.5px]">{ws.name}</b>
              </div>
              <span className="text-[11.5px]">{p.link.greeting}</span>
              <span className="h-1.5 rounded-[3px] bg-line">
                <span className="block h-1.5 rounded-[3px] bg-(--brand)" style={{ width: `${p.link.progress}%` }} />
              </span>
              <span className="self-start rounded-pill bg-(--brand) px-3 py-[7px] text-[11.5px] font-semibold text-white">{p.link.cta}</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-2 rounded-tile-lg bg-card p-3.5">
            <span className={cap}>{p.email.cap}</span>
            <div className="flex flex-1 flex-col overflow-hidden rounded-tile bg-tile">
              <span className="truncate bg-(--brand) px-3 py-2 text-[11.5px] font-bold text-white">{ws.name}</span>
              <div className="flex flex-col gap-2 p-3">
                <span className="text-[11.5px]">{p.email.text}</span>
                <span className="self-start rounded-pill bg-(--brand) px-3 py-[7px] text-[11.5px] font-semibold text-white">{p.email.cta}</span>
              </div>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-2 rounded-tile-lg bg-card p-3.5">
            <span className={cap}>{p.memo.cap}</span>
            <div className="flex flex-1 flex-col gap-1.5 rounded-tile bg-tile p-3">
              <div className="flex items-center justify-between border-b-2 border-(--brand) pb-1.5">
                {mark(22)}
                <span className="font-mono text-[9.5px] text-hint">{p.memo.id}</span>
              </div>
              <b className="text-label">{p.memo.title}</b>
              {p.memo.lines.map((w) => (
                <span key={w} className="h-[5px] rounded-[3px] bg-line" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-flow" className="@container box-border flex min-w-0 flex-col gap-4 rounded-card-lg bg-card p-[22px] text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-flow" className="m-0 font-heading text-[19px] font-semibold">{mf.title}</h2>
            <span className="text-label text-hint">{mf.subtitle}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-tile px-[11px] py-[5px] text-[11.5px] font-semibold">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {mf.chip}
          </span>
        </div>
        {/* The design scrolls this row sideways below 760px; here it stacks top to bottom instead. */}
        <div className="grid grid-cols-[minmax(0,1fr)_110px_minmax(0,1.2fr)_110px_minmax(0,1fr)] items-stretch gap-2 @max-[720px]:grid-cols-1">
          {[
            { ...mf.out, account: ws.fundingAccount },
            { ...mf.in, account: ws.collectionsAccount },
          ].map((acc, i) => {
            const card = (
              <div key={acc.title} className="flex min-w-0 flex-col gap-2 rounded-[22px] border border-mint-border bg-mint-card p-4">
                <span className="flex items-center justify-between">
                  <span className={`${cap} text-teal-deep`}>{acc.cap}</span>
                  {acc.account.verified ? <span className="rounded-pill bg-mint-bg px-2 py-0.5 text-[10.5px] font-bold text-teal-dark">{mf.verified}</span> : null}
                </span>
                <b className="font-heading text-[16px] font-semibold">{acc.title}</b>
                <span className="font-mono text-label text-grey-text">{mf.account(acc.account)}</span>
                <span className="mt-auto text-[11.5px] text-grey-text">{acc.note}</span>
              </div>
            );
            return i === 0 ? (
              <div key="out" className="contents">
                {card}
                <FlowArrow label={mf.sent} />
                <div className="flex min-w-0 flex-col gap-2.5 rounded-[22px] bg-tile p-4 shadow-[0_16px_34px_-26px_rgba(15,21,19,.45)]">
                  <span className="flex items-center justify-between">
                    <span className={cap}>{mf.contract.cap}</span>
                    <span className="rounded-pill bg-card px-2 py-0.5 text-[10.5px] font-bold">{mf.contract.chip}</span>
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-[9px] bg-teal text-label-sm font-bold text-white">{ws.initials}</span>
                    <span className="min-w-0">
                      <b className="block truncate text-body">{ws.legalName}</b>
                      <span className="text-[11.5px] text-hint">{mf.contract.entityNote}</span>
                    </span>
                  </div>
                  {signer ? (
                    <div className="flex items-center gap-2.5 rounded-tile bg-card px-3 py-2.5">
                      <Avatar initials={signer.initials} color="blue" size={28} />
                      <span className="min-w-0 text-label">
                        <b>{signer.name}</b> {mf.contract.signerText}
                        <span className="block text-[11.5px] text-hint">{mf.contract.signerHint}</span>
                      </span>
                    </div>
                  ) : null}
                  <button type="button" className="h-8 cursor-pointer self-start rounded-pill border-0 bg-card px-3 text-[11.5px] font-semibold text-ink">
                    {mf.contract.add}
                  </button>
                </div>
                <FlowArrow label={mf.payments} />
              </div>
            ) : (
              card
            );
          })}
        </div>
        <div className="flex flex-col gap-2.5 border-t border-panel-border pt-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2.5">
            <b className="text-body">{wa.title}</b>
            <span className="text-[11.5px] text-hint">{wa.hint}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 @max-[640px]:grid-cols-1">
            {ws.webAddresses.map((w) => (
              <div key={w.host} className="flex min-w-0 flex-col gap-1.5 rounded-[18px] bg-tile p-3.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11.5px] text-hint">{wa.labels[w.kind]}</span>
                  <span className={`whitespace-nowrap rounded-pill px-2 py-0.5 text-[10.5px] font-bold ${w.live ? "bg-mint-bg text-teal-dark" : "bg-blue-bg text-blue-text"}`}>
                    {w.live ? wa.live : wa.soon}
                  </span>
                </span>
                <b className="truncate font-mono text-body-sm font-medium">{w.host}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="h-not" className="@container box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink">
        <div>
          <h2 id="h-not" className={h2}>{nt.title}</h2>
          <span className="text-label text-hint">{nt.subtitle}</span>
        </div>
        {/* Design: minmax(220px,1.8fr) repeat(3,90px) with a 600px minimum; here the switch columns narrow instead of scrolling. */}
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-[minmax(0,1.8fr)_repeat(3,90px)] items-end gap-2 px-3 pb-1 text-[10px] leading-[1.3] font-semibold tracking-[0.08em] uppercase text-hint @max-[520px]:grid-cols-[minmax(0,1fr)_repeat(3,56px)]">
            <span>{nt.when}</span>
            {nt.channels.map((c) => (
              <span key={c.key} className="min-w-0 break-words text-center">
                {c.label}
              </span>
            ))}
          </div>
          {notificationRules.map((e, r) => (
            <div
              key={e.event}
              className="grid grid-cols-[minmax(0,1.8fr)_repeat(3,90px)] items-center gap-2 rounded-tile bg-card px-3 py-2.5 text-[12.5px] @max-[520px]:grid-cols-[minmax(0,1fr)_repeat(3,56px)]"
            >
              <span className="min-w-0">
                <b>{nt.events[e.event]}</b>
                {e.urgent ? <span className="ml-2 inline-block rounded-pill bg-red-bg px-[7px] py-0.5 text-[10.5px] font-bold text-red-text">{nt.urgent}</span> : null}
              </span>
              {notes[r].map((on, c) => (
                <span key={c} className="grid place-items-center">
                  <Switch
                    checked={on}
                    onChange={(v) => setNotes((n) => n.map((row, ri) => (ri === r ? row.map((x, ci) => (ci === c ? v : x)) : row)))}
                    label={`${nt.events[e.event]} by ${nt.channels[c].word}`}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="@container">
        <section aria-label="Hours, data and export" className={row3}>
          <article aria-labelledby="h-hrs" className="box-border flex min-w-0 flex-col gap-2 rounded-card-lg bg-card p-5 text-ink">
            <h2 id="h-hrs" className={h2}>{workingHours.title}</h2>
            {workingHours.rows(ws).map((r) => (
              <Row key={r.label} label={r.label} value={r.value} tile="white" />
            ))}
          </article>
          <article aria-labelledby="h-data" className="box-border flex min-w-0 flex-col gap-2 rounded-card-lg border border-line bg-tile p-5 text-ink">
            <h2 id="h-data" className={h2}>{dataDocs.title}</h2>
            {dataDocs.rows(ws).map((r) => (
              <Row key={r.label} label={r.label} value={r.value} tile="grey" />
            ))}
          </article>
          <article aria-labelledby="h-exp" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
            <h2 id="h-exp" className={h2}>{yourData.title}</h2>
            <span className="text-[12.5px] text-grey-text">{yourData.text}</span>
            <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile text-[12.5px] font-semibold text-ink">
              {yourData.export}
            </button>
            <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-white/60 text-[12.5px] font-semibold text-ink">
              {yourData.requests(ws.data.openRequests)}
            </button>
          </article>
        </section>
      </div>
    </>
  );
}
