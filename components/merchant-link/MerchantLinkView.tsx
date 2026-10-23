"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Ring } from "@/components/ui/Ring";
import {
  application,
  funder,
  helpCard as hc,
  languages,
  linkFooter,
  linkSteps,
  merchant,
  minutesLeft,
  privacy,
  startOpen,
  stepPanels as sp,
  ui,
  type Lang,
  type LinkStep,
} from "@/lib/sample-data/merchant-link";

const chipTone = {
  done: "bg-mint-bg text-teal-dark",
  optional: "bg-blue-bg text-blue-text",
  next: "bg-teal text-white",
  todo: "bg-card text-grey-text",
};

function MessageIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );
}

/**
 * The merchant-facing Merchant Link page from design/Merchant-Link.html and
 * its prototype: branded as the funder, no app chrome. Tapping a step opens
 * it; finishing one opens the next. The credit-check step only signs once
 * "I agree" is ticked. When every required step is done the headline turns
 * to "All done, Elena!". English / Español switches the texts the prototype
 * translates. Below 900px it is one column with a compact header and a fixed
 * bottom bar ("Continue: next step" and a round message button).
 */
export function MerchantLinkView() {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState<string | null>(startOpen);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const t = ui[lang];
  const isDone = (s: LinkStep) => s.done || !!done[s.key];
  const doneCount = linkSteps.filter(isDone).length;
  const total = linkSteps.length;
  const requiredLeft = linkSteps.filter((s) => !s.optional && !isDone(s)).length;
  const firstOpen = linkSteps.find((s) => !isDone(s)) ?? null;
  const finished = requiredLeft === 0;

  const complete = (s: LinkStep) => {
    if (s.kind === "consent" && !agree) return;
    setDone((d) => ({ ...d, [s.key]: true }));
    const next = linkSteps.find((x) => !isDone(x) && x.key !== s.key);
    setOpen(next ? next.key : null);
  };

  const goNext = () => {
    if (!firstOpen) return;
    setOpen(firstOpen.key);
    stepRefs.current[firstOpen.key]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div lang={lang} className="box-border flex min-h-full flex-col bg-page font-sans text-body text-ink">
      <header className="flex flex-wrap items-center justify-between gap-3 px-8 py-[18px] max-[900px]:px-4 max-[900px]:py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-teal font-heading text-body-sm font-bold text-white max-[900px]:h-8 max-[900px]:w-8">
            {funder.initials}
          </span>
          <b className="font-heading text-card-title font-semibold max-[900px]:text-[16px]">{funder.name}</b>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-[34px] items-center gap-[7px] rounded-pill bg-tile px-3 text-label font-semibold text-teal-deep max-[900px]:hidden">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-teal">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            {t.secure}
          </span>
          <div role="group" aria-label="Language" className="flex gap-0.5 rounded-pill bg-tile p-[3px]">
            {languages.map((l) => (
              <button
                key={l.value}
                type="button"
                lang={l.value}
                aria-pressed={lang === l.value}
                onClick={() => setLang(l.value)}
                className={`h-7 cursor-pointer rounded-pill border-0 px-3 text-label font-semibold ${lang === l.value ? "bg-teal text-white" : "bg-transparent text-grey-text"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto box-border flex w-full max-w-[1180px] flex-1 flex-col gap-4 px-8 pt-2 pb-10 max-[900px]:px-4 max-[900px]:pb-6">
        <section
          aria-labelledby="h-hi"
          className="flex flex-wrap items-center gap-6 rounded-[32px] border border-mint-border bg-mint-card p-7 max-[900px]:gap-4 max-[900px]:rounded-card max-[900px]:p-5"
        >
          <Ring value={(doneCount / total) * 100} size={112} stroke={11} color="teal" track="tile" ariaLabel={`${doneCount} of ${total} steps done`}>
            <span className="text-center">
              <b className="block font-heading text-[28px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-ink">
                {doneCount}/{total}
              </b>
              <span className="text-label-sm text-grey-text">{t.done}</span>
            </span>
          </Ring>
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5" aria-live="polite">
            <h1 id="h-hi" className="m-0 font-heading text-page-title leading-[1.1] font-semibold max-[900px]:text-[24px]">
              {finished ? t.headline.finished : t.headline.working}
            </h1>
            <span className="text-body text-grey-text">{finished ? t.finished : t.subline(requiredLeft)}</span>
          </div>
          <div className="flex min-w-[200px] flex-col gap-1.5 rounded-tile-lg bg-tile px-4 py-3.5 max-[900px]:min-w-0 max-[900px]:flex-1">
            <span className="text-label text-hint">{t.left}</span>
            <b className="font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em]">{minutesLeft(requiredLeft)}</b>
            <span className="text-label text-hint">{t.saved}</span>
          </div>
        </section>

        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start gap-4 max-[900px]:grid-cols-1">
          <section aria-labelledby="h-steps" className="flex min-w-0 flex-col gap-2 rounded-card-lg bg-tile p-3.5">
            <h2 id="h-steps" className="sr-only">
              Steps
            </h2>
            {linkSteps.map((s, i) => {
              const d = isDone(s);
              const on = open === s.key;
              const next = !d && firstOpen?.key === s.key;
              const status = d ? "done" : s.optional ? "optional" : next ? "next" : "todo";
              return (
                <div
                  key={s.key}
                  ref={(el) => {
                    stepRefs.current[s.key] = el;
                  }}
                  className={`scroll-mt-4 rounded-[22px] ${on ? "bg-field shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]" : ""}`}
                >
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`step-${s.key}`}
                    onClick={() => setOpen(on ? null : s.key)}
                    className="flex w-full cursor-pointer items-center gap-3.5 border-0 bg-transparent px-4 py-3.5 text-left text-ink max-[900px]:gap-3 max-[900px]:px-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 flex-none place-items-center rounded-full text-body font-bold ${d ? "bg-teal text-white" : next ? "bg-tile text-teal shadow-[inset_0_0_0_2px_var(--color-teal)]" : "bg-card text-hint"}`}
                    >
                      {d ? "✓" : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-[15px]">{s.title[lang]}</b>
                      <span className="text-label text-hint">{s.sub}</span>
                    </span>
                    <span className={`flex-none rounded-pill px-2.5 py-1 text-label-sm font-bold ${chipTone[status]}`}>{t.status[status]}</span>
                  </button>
                  {on ? (
                    <div id={`step-${s.key}`} className="flex flex-col gap-3 pr-4 pb-4 pl-[66px] max-[900px]:pl-4">
                      {d ? (
                        <span className="text-body-sm text-teal-deep">{s.note ?? sp.doneNote}</span>
                      ) : s.kind === "consent" ? (
                        <div className="flex flex-col gap-2.5">
                          <div className="scrollbar-thin max-h-[92px] overflow-auto rounded-[16px] bg-card p-3.5 text-[12.5px] text-grey-text">{sp.consent.text}</div>
                          <label className="flex cursor-pointer items-center gap-2.5 text-body-sm">
                            <input type="checkbox" checked={agree} onChange={() => setAgree((a) => !a)} className="m-0 h-5 w-5 flex-none cursor-pointer accent-teal" />
                            {sp.consent.agree}
                          </label>
                          <button
                            type="button"
                            disabled={!agree}
                            onClick={() => complete(s)}
                            className={`h-11 self-start rounded-pill border-0 px-5 text-body-sm font-semibold ${agree ? "cursor-pointer bg-teal text-white" : "cursor-not-allowed bg-line text-hint-soft"}`}
                          >
                            {sp.consent.sign}
                          </button>
                        </div>
                      ) : s.kind === "upload" ? (
                        <div className="flex flex-col gap-2.5">
                          <span className="text-body-sm text-grey-text">{sp.upload.text}</span>
                          <button
                            type="button"
                            onClick={() => complete(s)}
                            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-tile-lg border-[1.5px] border-dashed border-line-dashed bg-field p-[22px] text-ink"
                          >
                            <span className="grid h-11 w-11 place-items-center rounded-tile bg-mint-bg">
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-teal">
                                <path d="M12 15V3M7 8l5-5 5 5M5 21h14" />
                              </svg>
                            </span>
                            <b className="text-[13.5px]">{sp.upload.drop}</b>
                            <span className="text-label text-hint">{sp.upload.hint}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          <span className="text-body-sm text-grey-text">{sp.bank.text}</span>
                          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
                            {sp.bank.banks.map((b) => (
                              <button key={b} type="button" onClick={() => complete(s)} className="h-[54px] cursor-pointer rounded-[16px] border border-line bg-tile text-body-sm font-semibold text-ink">
                                {b}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => complete(s)}
                              className="h-[54px] cursor-pointer rounded-[16px] border border-dashed border-line-dashed bg-transparent text-body-sm font-semibold text-ink"
                            >
                              {sp.bank.find}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>

          <aside className="flex min-w-0 flex-col gap-4">
            <article aria-labelledby="h-app" className="flex flex-col gap-3 rounded-[28px] bg-tile p-5">
              <h2 id="h-app" className="m-0 font-heading text-card-title font-semibold">{t.yourApp}</h2>
              <div className="rounded-[18px] bg-card p-3.5">
                <span className="text-label text-hint">{merchant.business}</span>
                <b className="block font-heading text-[26px] font-semibold tabular-nums tracking-[-0.03em]">{merchant.requested}</b>
                <span className="text-label text-hint">{t.requested}</span>
              </div>
              <ol className="m-0 flex list-none flex-col p-0">
                {application.timeline.map((a) => (
                  <li key={a.title} className="grid grid-cols-[14px_1fr] gap-2.5 py-1.5">
                    <span
                      aria-hidden="true"
                      className={`mt-1 box-border h-3 w-3 rounded-full ${a.state === "later" ? "border-2 border-line-dashed" : a.state === "now" ? "bg-teal shadow-[0_0_0_4px_rgba(14,107,92,.18)]" : "bg-teal"}`}
                    />
                    <span className={`text-body-sm ${a.state === "later" ? "text-hint" : ""}`}>
                      <b>{a.title}</b>
                      <span className="block text-label text-hint">{a.hint}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </article>

            <article aria-labelledby="h-help" className="flex flex-col gap-2.5 rounded-[28px] bg-tile p-5">
              <h2 id="h-help" className="m-0 font-heading text-card-title font-semibold">{t.help}</h2>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-sand text-label font-bold">
                  {hc.person.initials}
                </span>
                <span className="min-w-0">
                  <b className="block text-body">{hc.person.name}</b>
                  <span className="text-label text-hint">{hc.person.role}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <a href="#" className="grid h-10 place-items-center rounded-pill bg-teal text-[12.5px] font-semibold text-white no-underline">
                  {hc.message}
                </a>
                <a href={`tel:${hc.phone.replace(/[^\d]/g, "")}`} className="grid h-10 place-items-center rounded-pill bg-card text-[12.5px] font-semibold text-ink no-underline">
                  {hc.phone}
                </a>
              </div>
              <span className="text-label text-hint">{hc.broker}</span>
            </article>

            <article className="flex flex-col gap-2 rounded-[28px] bg-card p-[18px]">
              <span className="flex items-start gap-2.5 text-[12.5px]">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none stroke-teal">
                  <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
                </svg>
                <span>
                  <b>{privacy.lead}</b> {privacy.text}
                </span>
              </span>
              <span className="text-label text-hint">{privacy.sent}</span>
            </article>
          </aside>
        </div>
      </main>

      <footer className="flex flex-wrap justify-between gap-3 border-t border-line-strong px-8 py-[18px] text-label text-hint max-[900px]:px-4 max-[900px]:pb-28">
        <span>{funder.legal}</span>
        <span className="flex flex-wrap gap-4">
          <a href="#" className="text-hint no-underline">
            {linkFooter.privacy}
          </a>
          <a href="#" className="text-hint no-underline">
            {linkFooter.terms}
          </a>
          <span className="inline-flex items-center gap-1.5">
            {linkFooter.powered}
            <Image src="/brand/cevrynt-mark-solid.png" alt="" width={15} height={14} className="h-3.5 w-auto" />
            {linkFooter.brand}
          </span>
        </span>
      </footer>

      {/* Phones: a fixed bar with the next step and a round message button. */}
      <div className="fixed inset-x-0 bottom-0 z-10 hidden items-center gap-2.5 border-t border-line-strong bg-tile/95 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur max-[900px]:flex">
        {firstOpen ? (
          <button
            type="button"
            onClick={goNext}
            className="h-12 min-w-0 flex-1 cursor-pointer truncate rounded-pill border-0 bg-teal px-5 text-body-sm font-semibold text-white"
          >
            {t.continueTo(firstOpen.title[lang])}
          </button>
        ) : (
          <span className="flex h-12 min-w-0 flex-1 items-center justify-center truncate rounded-pill bg-mint-bg px-5 text-body-sm font-semibold text-teal-dark">
            {t.headline.finished}
          </span>
        )}
        <a href="#" aria-label={hc.messageAria} className="grid h-12 w-12 flex-none place-items-center rounded-full bg-card text-teal no-underline">
          <MessageIcon />
        </a>
      </div>
    </div>
  );
}
