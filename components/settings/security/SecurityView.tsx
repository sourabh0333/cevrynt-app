"use client";

import Link from "next/link";
import { useState } from "react";
import { Ring } from "@/components/ui/Ring";
import { scoreBand, securityScore, type ProtectionKey } from "@/lib/security-score";
import {
  alwaysOn,
  apiKeys,
  auditors,
  outsideUsers,
  protectingData,
  securityHeader as sh,
  securitySections,
  signIns as si,
  signingIn,
  supportAccess as sa,
  toFix as toFixFor,
  toFixTitle,
  type SignInResult,
  type Toggle,
} from "@/lib/copy/security";
import type { SecurityData } from "@/lib/data/views/settings";
import { TickBox } from "@/components/ui/TickBox";

const resultChip: Record<SignInResult, string> = {
  ok: "bg-mint-bg text-teal-dark",
  blocked: "bg-red-bg text-red-text",
  nomfa: "bg-amber-bg text-amber-text",
};

/*
 * Design: minmax(130px,1fr) minmax(150px,1.2fr) minmax(120px,1fr) 80px 100px
 * with a 640px minimum and sideways scroll. Here the columns flex; as the
 * table narrows "Device", then "Where", then "Time" hide. "Result" never
 * hides (container queries on the card).
 */
const scols =
  "grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_80px_100px] items-center gap-3 @max-[620px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_80px_100px] @max-[620px]:[&>:nth-child(2)]:hidden @max-[480px]:grid-cols-[minmax(0,1fr)_64px_96px] @max-[480px]:[&>:nth-child(3)]:hidden @max-[360px]:grid-cols-[minmax(0,1fr)_96px] @max-[360px]:[&>:nth-child(4)]:hidden";

const duo = "grid grid-cols-2 gap-1 @max-[700px]:grid-cols-1";
const h2sm = "m-0 font-heading text-card-title-sm font-semibold";

function SwitchRow({ t, on, onChange }: { t: Toggle; on: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px]">
      <span className="min-w-0">
        <b className="block">{t.title}</b>
        <span className="text-[11.5px] text-hint">{t.hint}</span>
      </span>
      <TickBox checked={on} onChange={onChange} className="m-0 h-5 w-5 flex-none cursor-pointer accent-teal" />
    </label>
  );
}

/**
 * Settings → Security from design/Settings-Security.html and its prototype.
 * The score ring updates live as the eight protections are switched on or
 * off (lib/security-score.ts). Who lacks 2-step login comes from Team &
 * roles, so Leo's "Off" there and here always agree. Support access can be
 * allowed for 24 hours and ended. No hover. The settings, today's sign-ins
 * (the ones the Audit log shows), the team and the API keys come from the
 * data layer.
 */
export function SecurityView({ data }: { data: SecurityData }) {
  const groups = [
    { title: signingIn.title, text: signingIn.text, toggles: signingIn.toggles(data.settings) },
    { title: protectingData.title, text: protectingData.text, toggles: protectingData.toggles(data.settings) },
  ];
  const outside = outsideUsers.toggles(data.settings);
  const toFix = toFixFor(data.noMfa, data.accessReview, data.now);
  const rows = si.rows(data.signIns);
  const note = si.note(data.signIns);
  const contact = sa.contact(data.settings);
  const all = [...groups.flatMap((g) => g.toggles), ...outside];
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(all.map((t) => [t.key, t.on])));
  const [support, setSupport] = useState(data.settings.supportUntil !== null);
  const flip = (k: string) => () => setOn((x) => ({ ...x, [k]: !x[k] }));

  const score = securityScore(on as Partial<Record<ProtectionKey, boolean>>);
  const band = scoreBand(score);
  const s = support ? sa.on(data.now) : sa.off;

  return (
    <div className="@container flex flex-col gap-3.5">
      <section aria-labelledby="h-sec" className={`${duo} box-border min-w-0 rounded-card-lg border border-line bg-tile p-2 text-ink`}>
        <div className="flex min-w-0 items-center gap-[18px] rounded-card bg-mint-card p-5">
          <Ring value={score} size={92} stroke={9} color="teal" track="tile" ariaLabel={sh.ringLabel(score)} aria-live="polite">
            <b className="font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em] text-ink">{score}</b>
          </Ring>
          <div className="flex min-w-0 flex-col gap-1">
            <span
              className={`self-start rounded-pill px-[11px] py-1 text-[11.5px] font-semibold ${band === "strong" ? "bg-tile text-teal-deep" : band === "fair" ? "bg-amber-bg text-amber-text" : "bg-red-bg text-red-text"}`}
            >
              {sh.band[band]}
            </span>
            <h2 id="h-sec" className="m-0 font-heading text-[22px] font-semibold">{sh.title}</h2>
            <span className="text-[12.5px] text-grey-text">{sh.text}</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-card bg-red-bg p-3.5">
          <b className="px-1 py-0.5 text-[13.5px]">{toFixTitle(toFix.length)}</b>
          {toFix.map((f) => (
            <div key={f.key} className="flex items-center gap-3 rounded-[16px] bg-white/85 px-3.5 py-3">
              <span aria-hidden="true" className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[10px] bg-red font-bold text-white">
                !
              </span>
              <span className="min-w-0 flex-1 text-[12.5px]">
                <b className="block">{f.title}</b>
                <span className="text-red-deep">{f.text}</span>
              </span>
              <button type="button" className="h-[34px] flex-none cursor-pointer whitespace-nowrap rounded-pill border-0 bg-teal px-3 text-label font-semibold text-white">
                {f.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={securitySections.access} className={`${duo} box-border min-w-0 rounded-card-lg bg-card p-2 text-ink`}>
        {groups.map((g, i) => (
          <div key={g.title} className={`flex min-w-0 flex-col gap-2 p-3.5 ${i ? "border-l border-line-strong @max-[700px]:border-l-0" : ""}`}>
            <div className="px-1 pt-0.5 pb-1">
              <h2 className={h2sm}>{g.title}</h2>
              <span className="text-label text-hint">{g.text}</span>
            </div>
            {g.toggles.map((t) => (
              <SwitchRow key={t.key} t={t} on={!!on[t.key]} onChange={flip(t.key)} />
            ))}
          </div>
        ))}
      </section>

      <section aria-labelledby="h-si" className="@container box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-line bg-tile p-5 text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-si" className="m-0 font-heading text-card-title font-semibold">{si.title}</h2>
            <span className="text-label text-hint">{si.subtitle}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-card px-[11px] py-[5px] text-[11.5px] font-semibold">{si.sessions(data.settings.activeSessions)}</span>
            <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-red-bg px-3 text-label font-semibold text-red-text">
              {si.signOutAll}
            </button>
            <Link href={si.audit.href} className="text-label font-semibold text-teal no-underline">
              {si.audit.label}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 rounded-tile-lg bg-card p-2">
          <div className={`${scols} px-3.5 pt-1 pb-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
            {si.columns.map((c) => (
              <span key={c} className="truncate">
                {c}
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.id} className={`${scols} rounded-[16px] bg-tile px-3.5 py-[11px] text-[12.5px]`}>
              <b className="truncate">{r.person}</b>
              <span className="truncate">{r.device}</span>
              <span className="truncate text-muted">{r.where}</span>
              <span className="font-mono text-[11.5px] text-hint">{r.time}</span>
              <span className={`justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-bold ${resultChip[r.result]}`}>{si.resultLabel[r.result]}</span>
            </div>
          ))}
        </div>
        {note ? (
          <span className="flex items-center gap-2.5 rounded-tile bg-red-bg px-3 py-2.5 text-label text-red-deep">
            <span className="h-2 w-2 flex-none rounded-full bg-red" />
            {note}
          </span>
        ) : null}
      </section>

      <section aria-label={securitySections.outside} className={`${duo} box-border min-w-0 rounded-card-lg bg-card p-2 text-ink`}>
        <div className="flex min-w-0 flex-col gap-2 p-3.5">
          <div className="px-1 pt-0.5 pb-1">
            <h2 className={h2sm}>{outsideUsers.title}</h2>
            <span className="text-label text-hint">{outsideUsers.text}</span>
          </div>
          {outside.map((t) => (
            <SwitchRow key={t.key} t={t} on={!!on[t.key]} onChange={flip(t.key)} />
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-2 border-l border-line-strong p-3.5 @max-[700px]:border-l-0">
          <div className="px-1 pt-0.5 pb-1">
            <h2 className={h2sm}>{sa.title}</h2>
            <span className="text-label text-hint">{sa.text}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-[16px] bg-tile p-3.5" aria-live="polite">
            <span className="min-w-0 text-[12.5px]">
              <b className="block">{s.title}</b>
              <span className="text-[11.5px] text-hint">{s.hint}</span>
            </span>
            <button
              type="button"
              aria-pressed={support}
              onClick={() => setSupport((v) => !v)}
              className={`h-9 cursor-pointer rounded-pill border-0 px-3.5 text-label font-semibold ${support ? "bg-red-bg text-red-text" : "bg-teal text-white"}`}
            >
              {s.action}
            </button>
          </div>
          <span className="flex flex-wrap justify-between gap-2 rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px]">
            <span>{contact.label}</span>
            <b className="font-mono text-label font-medium">{contact.value}</b>
          </span>
          <span className="flex flex-wrap items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px]">
            <span>{sa.report.label}</span>
            <span className="font-semibold text-teal">{sa.report.action}</span>
          </span>
        </div>
      </section>

      <section aria-label={securitySections.data} className="box-border grid min-w-0 grid-cols-3 gap-1 rounded-card-lg border border-line bg-tile p-2 text-ink @max-[700px]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-2 rounded-card bg-card p-4">
          <h2 className={h2sm}>{alwaysOn.title}</h2>
          {alwaysOn.items.map((a) => (
            <span key={a} className="text-[12.5px]">
              {a}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-2 border-l border-line p-4 @max-[700px]:border-l-0">
          <h2 className={h2sm}>{apiKeys.title}</h2>
          {apiKeys.rows(data.apiKeys, data.now).map((r) => (
            <span key={r.label} className="flex justify-between gap-2 rounded-tile bg-card px-3 py-2.5 text-[12.5px]">
              <span>{r.label}</span>
              <b>{r.value}</b>
            </span>
          ))}
          <Link href={apiKeys.link.href} className="text-label font-semibold text-teal no-underline">
            {apiKeys.link.label}
          </Link>
        </div>
        <div className="flex min-w-0 flex-col gap-2 border-l border-line p-4 @max-[700px]:border-l-0">
          <h2 className={h2sm}>{auditors.title}</h2>
          <span className="text-label text-hint">{auditors.text}</span>
          {auditors.rows.map((r) => (
            <span key={r.label} className="flex justify-between gap-2 rounded-tile bg-card px-3 py-2.5 text-[12.5px]">
              <span>{r.label}</span>
              <span className="font-semibold text-teal">{r.action}</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
