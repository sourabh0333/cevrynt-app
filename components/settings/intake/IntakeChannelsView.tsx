"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  apiPreview as api,
  channelPerformance as perf,
  channelsHeader as ch,
  channelTabs,
  comingBanner,
  emailPreview as em,
  everyDeal,
  formsPreview as fm,
  merchantLink as ml,
  type ChannelKey,
  type Toggle,
} from "@/lib/sample-data/intake-channels";

const cap = "text-cap font-semibold uppercase text-hint";
const smallBtn = "h-[34px] rounded-pill border-0 px-3.5 text-label font-semibold";

/** A setting row with a checkbox, like the design's labels. `preview` rows are part of a faded, inert preview. */
function ToggleRow({ t, checked, onChange }: { t: Toggle; checked?: boolean; onChange?: () => void }) {
  const preview = onChange === undefined;
  return (
    <label className={`flex items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px] ${preview ? "" : "cursor-pointer"}`}>
      <span className="min-w-0">
        <b className="block">{t.title}</b>
        <span className="text-[11.5px] text-hint">{t.hint}</span>
      </span>
      {preview ? (
        <input type="checkbox" defaultChecked={t.on} tabIndex={-1} className="m-0 h-5 w-5 flex-none accent-teal" />
      ) : (
        <input type="checkbox" checked={!!checked} onChange={onChange} className="m-0 h-5 w-5 flex-none cursor-pointer accent-teal" />
      )}
    </label>
  );
}

/** Blue "isn't available yet" banner, then the setup faded and inert so nothing in it can be clicked or focused. */
function ComingSoon({ name, soon, children }: { name: string; soon: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 rounded-[18px] bg-blue-bg px-4 py-3.5">
        <span className="rounded-pill bg-tile px-[9px] py-[3px] text-[10.5px] font-bold text-blue-text">{soon}</span>
        <span className="min-w-0 flex-[1_1_240px] text-[12.5px] text-blue-text">
          <b>{comingBanner.notYet(name)}</b> {comingBanner.preview}
        </span>
        <Button href={comingBanner.cta.href} size="sm" className="h-[34px]! text-label!">
          {comingBanner.cta.label}
        </Button>
      </div>
      <div inert aria-label={`${name} preview, not available yet`} className="pointer-events-none flex select-none flex-col gap-3 opacity-55">
        {children}
      </div>
    </div>
  );
}

function MerchantLinkPanel() {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(ml.toggles.map((t) => [t.key, t.on])));
  return (
    <div className="flex flex-wrap gap-3">
      <div className="box-border flex min-w-0 flex-[1_1_240px] flex-col gap-2.5 rounded-[22px] bg-tile p-4 shadow-[0_14px_30px_-24px_rgba(15,21,19,.5)]">
        <span className="flex items-center justify-between gap-2">
          <span className={cap}>{ml.previewCap}</span>
          <Link href={ml.previewLink.href} className="text-[11.5px] font-semibold text-teal no-underline">
            {ml.previewLink.label}
          </Link>
        </span>
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-teal-forest text-label-sm font-bold text-white">{ml.brand.initials}</span>
          <b className="text-body-sm">{ml.brand.name}</b>
        </div>
        <span className="text-[12.5px]">{ml.greeting}</span>
        <ul className="m-0 flex list-none flex-col gap-[5px] p-0 text-label">
          {ml.steps.map((s) => (
            <li key={s.label} className={`rounded-[10px] px-2.5 py-2 ${s.done ? "bg-mint-light" : "bg-card"}`}>
              {s.done ? "✓ " : ""}
              {s.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex min-w-0 flex-[2_1_300px] flex-col gap-2">
        {ml.toggles.map((t) => (
          <ToggleRow key={t.key} t={t} checked={on[t.key]} onChange={() => setOn((x) => ({ ...x, [t.key]: !x[t.key] }))} />
        ))}
        <span className="flex justify-between rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px]">
          <span>{ml.expiry.label}</span>
          <b>{ml.expiry.value}</b>
        </span>
      </div>
    </div>
  );
}

function EmailPreview() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5 rounded-[18px] bg-tile p-3.5">
        <span className="min-w-0 flex-[1_1_260px] truncate font-mono text-body-sm">{em.address}</span>
        <span className={`${smallBtn} inline-flex h-9 items-center bg-teal text-white`}>{em.copy}</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2">
        {em.toggles.map((t) => (
          <ToggleRow key={t.key} t={t} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 @max-[460px]:grid-cols-1">
        {em.tiles.map((t) => (
          <span key={t.label} className={`min-w-0 rounded-[16px] p-3 ${t.held ? "bg-amber-tint" : "bg-tile"}`}>
            <span className={`block text-label-sm ${t.held ? "text-amber-mute" : "text-hint"}`}>{t.label}</span>
            <b className={t.small ? "text-body-sm" : "font-heading text-card-title-lg tabular-nums tracking-[-0.03em]"}>{t.value}</b>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 rounded-[18px] bg-tile p-3.5">
        <span className="flex min-w-0 flex-[1_1_260px] flex-col gap-2">
          <b className="text-[12.5px]">{em.senders.title}</b>
          <span className="flex flex-wrap gap-1.5">
            {em.senders.domains.map((d) => (
              <span key={d} className="rounded-[8px] bg-card px-[9px] py-1 font-mono text-label-sm">
                {d}
              </span>
            ))}
            <span className="rounded-[8px] bg-card px-[9px] py-1 text-label-sm">{em.senders.more}</span>
          </span>
        </span>
        <span className={`${smallBtn} inline-flex h-9 items-center bg-cream text-ink`}>{em.senders.review}</span>
      </div>
      <span className="text-[11.5px] text-hint">{em.note}</span>
    </>
  );
}

function FormsPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2">
        {fm.forms.map((f) => (
          <div key={f.name} className={`rounded-[18px] bg-tile p-3.5 ${f.selected ? "shadow-[inset_0_0_0_1.5px_var(--color-teal)]" : ""}`}>
            <span className="flex items-center justify-between">
              <b className="text-[13.5px]">{f.name}</b>
              <span className="rounded-pill bg-mint-bg px-2 py-0.5 text-[10.5px] font-bold text-teal-dark">{fm.live}</span>
            </span>
            <span className="mt-1 block truncate font-mono text-[11.5px] text-hint">{f.url}</span>
            <span className="text-[11.5px] text-hint">{f.count}</span>
          </div>
        ))}
        <span className="grid h-10 place-items-center rounded-[16px] border-[1.5px] border-dashed border-line-dashed text-[12.5px] font-semibold">{fm.add}</span>
      </div>
      <div className="flex min-w-0 flex-[2_1_320px] flex-col gap-2">
        <span className={cap}>{fm.asksCap}</span>
        {fm.toggles.map((t) => (
          <ToggleRow key={t.key} t={t} />
        ))}
        <div className="flex min-w-0 flex-col gap-1.5 rounded-[16px] bg-tile px-3.5 py-3">
          <span className="flex items-center justify-between gap-2">
            <b className="text-[12.5px]">{fm.embed.title}</b>
            <span className="inline-flex h-7 items-center rounded-pill bg-card px-2.5 text-label-sm font-semibold">{fm.embed.copy}</span>
          </span>
          {/* The design scrolls this line sideways; here it ends with "…" instead. */}
          <span className="block truncate rounded-[10px] bg-ink px-2.5 py-2 font-mono text-label-sm text-mint">{fm.embed.code}</span>
          <span className="text-[11.5px] text-hint">{fm.embed.hint}</span>
        </div>
      </div>
    </div>
  );
}

function ApiPreview() {
  const failing = api.webhooks.find((w) => !w.ok);
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
        {api.crms.map((c) => (
          <div key={c.name} className={`flex min-w-0 flex-col gap-2 rounded-[18px] bg-tile p-3.5 ${c.tag ? "shadow-[inset_0_0_0_1.5px_var(--color-mint)]" : ""}`}>
            <span className="flex items-center justify-between gap-2">
              <b className="text-[13.5px]">{c.name}</b>
              {c.tag ? <span className="rounded-pill bg-mint-bg px-[7px] py-0.5 text-[10px] font-bold text-teal-dark">{c.tag}</span> : null}
            </span>
            <span className="text-[11.5px] text-hint">{c.hint}</span>
            <span className={`${smallBtn} mt-auto grid place-items-center ${c.quiet ? "bg-card text-ink" : "bg-teal text-white"}`}>{c.action}</span>
          </div>
        ))}
      </div>
      <span className={cap}>{api.webhooksCap}</span>
      <div className="flex flex-col gap-1.5">
        {api.webhooks.map((w) => (
          <div key={w.event} className="grid grid-cols-[130px_minmax(0,1fr)_90px] items-center gap-2.5 rounded-tile bg-tile px-3 py-2.5 text-label @max-[460px]:grid-cols-[minmax(0,1fr)_80px] @max-[460px]:[&>:nth-child(2)]:hidden">
            <span className="truncate font-mono text-[11.5px]">{w.event}</span>
            <span className="truncate font-mono text-[11.5px] text-hint">{w.url}</span>
            <span className={`justify-self-end rounded-pill px-2 py-0.5 text-[10.5px] font-bold ${w.ok ? "bg-mint-bg text-teal-dark" : "bg-red-bg text-red-text"}`}>
              {w.ok ? api.status.ok : api.status.bad}
            </span>
          </div>
        ))}
      </div>
      {failing ? (
        <div className="flex flex-wrap items-center gap-2.5 rounded-[16px] bg-red-bg px-3.5 py-3">
          <span className="min-w-0 flex-[1_1_220px] text-[12.5px] text-red-deep">
            <b>{api.failing.lead}</b> {api.failing.text}
          </span>
          <span className={`${smallBtn} inline-flex items-center bg-tile text-ink`}>{api.failing.log}</span>
          <span className={`${smallBtn} inline-flex items-center bg-teal text-white`}>{api.failing.retry}</span>
        </div>
      ) : null}
      <span className={cap}>{api.fieldsCap}</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-1.5 text-label">
        {api.fields.map(([a, b]) => (
          <span key={a} className="flex min-w-0 justify-between gap-2 rounded-[12px] bg-tile px-3 py-[9px]">
            <span className="truncate">{a}</span>
            <span className="font-mono text-hint">{b}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 rounded-[16px] bg-tile px-3.5 py-3">
        <span className="min-w-0 flex-[1_1_200px] text-[12.5px]">
          <b>{api.key.label}</b> <span className="font-mono text-hint">{api.key.value}</span>
          <span className="block text-[11.5px] text-hint">{api.key.hint}</span>
        </span>
        <span className={`${smallBtn} inline-flex items-center bg-card text-ink`}>{api.key.action}</span>
      </div>
    </>
  );
}

/**
 * Settings → Intake channels from design/Settings-Intake.html and its
 * prototype. Four channel tabs: Merchant Link is live and selected; its
 * preview and switches work. Email forwarding, public forms and CRM / API
 * are not live (CLAUDE.md): each shows the blue "isn't available yet"
 * banner with Join early access, and its setup below is faded and inert.
 * Then the live channels' results and the steps every new deal goes
 * through. No hover.
 */
export function IntakeChannelsView() {
  const [tab, setTab] = useState<ChannelKey>("link");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = channelTabs.find((t) => t.key === tab) ?? channelTabs[0];
  const maxDeals = Math.max(...perf.rows.map((r) => r.deals));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = channelTabs.findIndex((t) => t.key === tab);
    const n = channelTabs.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(channelTabs[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <section
        aria-labelledby="h-ic"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="h-ic" className="m-0 font-heading text-[24px] font-semibold">{ch.title}</h2>
          <span className="text-[12.5px] text-grey-text">{ch.text}</span>
        </div>
        <span className="rounded-pill bg-tile px-3 py-1.5 text-[11.5px] font-semibold text-teal-deep">{ch.chip}</span>
      </section>

      <section aria-labelledby="h-ch" className="@container box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg bg-card p-5 text-ink">
        <h2 id="h-ch" className="sr-only">Channels</h2>
        <div role="tablist" aria-label="Channels" onKeyDown={onKey} className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
          {channelTabs.map((t, i) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={on}
                aria-controls={`panel-${t.key}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(t.key)}
                className={`flex cursor-pointer flex-col items-start gap-1 rounded-[18px] border-0 p-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-mint ${on ? "bg-teal text-white" : "bg-tile text-ink"}`}
              >
                <span className="flex w-full items-center justify-between">
                  <b className="text-[13.5px]">{t.name}</b>
                  <span className={`h-[9px] w-[9px] rounded-full ${t.live ? (on ? "bg-mint" : "bg-teal") : "bg-line-dashed"}`} />
                </span>
                <span className="text-[11.5px] opacity-80">{t.sub}</span>
              </button>
            );
          })}
        </div>
        <div role="tabpanel" id={`panel-${active.key}`} aria-labelledby={`tab-${active.key}`}>
          {active.key === "link" ? (
            <MerchantLinkPanel />
          ) : (
            <ComingSoon name={active.name} soon={active.soon ?? ""}>
              {active.key === "email" ? <EmailPreview /> : active.key === "forms" ? <FormsPreview /> : <ApiPreview />}
            </ComingSoon>
          )}
        </div>
      </section>

      <section aria-labelledby="h-perf" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
        <div>
          <h2 id="h-perf" className="m-0 font-heading text-card-title font-semibold">{perf.title}</h2>
          <span className="text-label text-hint">{perf.subtitle}</span>
        </div>
        <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_64px_70px] gap-x-3 gap-y-2.5 text-[12.5px]">
          {perf.columns.map((c, i) => (
            <span key={i} className={`${cap} text-[10px] ${i >= 2 ? "text-right" : ""}`}>
              {c}
            </span>
          ))}
          {perf.rows.map((r, i) => (
            <div key={r.channel} className="col-span-4 grid grid-cols-subgrid items-center">
              <b className="truncate">{r.channel}</b>
              <ProgressBar value={(r.deals / maxDeals) * 100} height={10} track="tile" delay={0.2 + i * 0.08} aria-label={`${r.channel}: ${r.deals} deals`} />
              <span className="text-right font-heading tabular-nums tracking-[-0.03em]">{r.deals}</span>
              <b className={`text-right font-heading tabular-nums tracking-[-0.03em] ${r.low ? "text-amber-deep" : "text-teal-deep"}`}>{r.funded}%</b>
            </div>
          ))}
        </div>
        <span className="text-label text-muted">{perf.note}</span>
      </section>

      <section aria-labelledby="h-rules" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-line bg-tile p-5 text-ink">
        <h2 id="h-rules" className="m-0 font-heading text-card-title font-semibold">{everyDeal.title}</h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 p-0">
          {everyDeal.steps.map((s) => (
            <li key={s.title} className="rounded-[16px] bg-card px-3.5 py-3 text-[12.5px]">
              <b className="block">{s.title}</b>
              <span className="text-[11.5px] text-hint">{s.hint}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
