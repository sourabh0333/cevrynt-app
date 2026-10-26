"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FunderBrand, PublicFooter } from "@/components/public/PublicChrome";
import type { ApplyData } from "@/lib/data/views/public";
import { money } from "@/lib/format";
import { TickBox } from "@/components/ui/TickBox";
import {
  amountSlider,
  applyBanner,
  applyHeader,
  applyHero,
  applyPrivacy,
  applySent,
  applySteps,
  bankStep,
  businessFields as bf,
  estimateUpTo,
  firstLook,
  formNav,
  fundingFields as ff,
  haveReady,
  ownerFields as of,
  signStep,
} from "@/lib/copy/apply";

/* The design's inputs: 48px, white, soft border, 14px radius, teal outline on focus. */
const inputClass =
  "box-border h-12 min-w-0 rounded-tile border border-line-soft bg-tile px-3.5 text-body text-ink outline-none placeholder:text-hint focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal";
/* Two fields side by side, stacked on narrow screens. */
const two = "grid grid-cols-2 gap-3 max-[560px]:grid-cols-1";

function Field({ id, label, children }: { id?: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {id ? (
        <label htmlFor={id} className="text-[12.5px] font-semibold text-grey-text">
          {label}
        </label>
      ) : (
        <span className="text-[12.5px] font-semibold text-grey-text">{label}</span>
      )}
      {children}
    </div>
  );
}

function TextField({ id, label, placeholder, signature }: { id: string; label: string; placeholder: string; signature?: boolean }) {
  return (
    <Field id={id} label={label}>
      <input id={id} placeholder={placeholder} className={`${inputClass} ${signature ? "font-heading text-[18px]" : ""}`} />
    </Field>
  );
}

/** Single-choice chips ("What's it for?", "Other funding"). */
function ChoiceChips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={o === value}
            onClick={() => onChange(o)}
            className={`cursor-pointer rounded-pill border-0 px-3.5 py-2 text-[12.5px] font-semibold ${o === value ? "bg-teal text-white" : "bg-card text-ink"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </Field>
  );
}

function BackArrow() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/**
 * The public application form preview from design/Apply-Form.html and its
 * prototype. Five steps (the progress parts jump between them), Back /
 * Continue, and "Send application" that only works once both permissions
 * are ticked, then the "Application sent" card. "A first look" updates with
 * the amount and monthly revenue. Below 900px it is one column with a fixed
 * bottom bar (round Back, big Continue / Send). Nothing is really sent.
 * The amount slider spans the policy's offer range, and the web address and
 * phone number are the workspace's (props, from the data layer).
 */
export function ApplyView({ data }: { data: ApplyData }) {
  const { limits } = data;
  const amountRange = { min: limits.minAmount, max: limits.maxAmount, ...amountSlider };
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(amountRange.start);
  const [rev, setRev] = useState(ff.revenue.start);
  const [purpose, setPurpose] = useState(ff.purpose.start);
  const [existing, setExisting] = useState(ff.existing.start);
  const [perms, setPerms] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const total = applySteps.length;
  const current = applySteps[step - 1];
  const canSend = signStep.permissions.every((p) => perms[p.key]);
  const last = step === total;
  const estimate = estimateUpTo(rev, limits.maxAmount);
  const fits = amount <= estimate;

  const back = () => setStep((s) => Math.max(1, s - 1));
  const next = () => {
    if (!last) setStep((s) => s + 1);
    else if (canSend) setSent(true);
  };
  const restart = () => {
    setStep(1);
    setSent(false);
    setPerms({});
  };
  const nextDisabled = last && !canSend;

  return (
    <div className="box-border flex min-h-full flex-col bg-page font-sans text-body text-ink">
      <div role="note" className="flex flex-wrap items-center justify-center gap-2.5 bg-blue-bg px-4 py-2.5 text-center text-[12.5px] text-blue-text">
        <b>{applyBanner.lead}</b> {applyBanner.text}
        <Link href={applyBanner.link.href} className="font-semibold text-blue-text underline">
          {applyBanner.link.label}
        </Link>
      </div>

      <header className="flex flex-wrap items-center justify-between gap-3 px-8 py-[18px] max-[900px]:px-4 max-[900px]:py-3">
        <FunderBrand />
        <span className="inline-flex items-center gap-1.5 text-label text-hint max-[900px]:hidden">
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-teal">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          {applyHeader.host(data.host)}
        </span>
      </header>

      <main className="mx-auto box-border flex w-full max-w-[1180px] flex-1 flex-col gap-4 px-8 pt-2 pb-10 max-[900px]:px-4 max-[900px]:pb-6">
        {sent ? (
          <section aria-labelledby="h-done" className="mx-auto my-6 flex w-full max-w-[640px] flex-col items-center gap-3.5 rounded-[32px] bg-tile p-9 text-center max-[900px]:p-6">
            <span aria-hidden="true" className="grid h-[72px] w-[72px] place-items-center rounded-full bg-teal text-[30px] font-bold text-white">
              ✓
            </span>
            <h1 id="h-done" className="m-0 font-heading text-[28px] font-semibold">{applySent.title}</h1>
            <span className="text-body text-grey-text">{applySent.text}</span>
            <ol className="m-0 grid w-full list-none grid-cols-3 gap-2 p-0 max-[480px]:grid-cols-1">
              {applySent.steps.map((s) => (
                <li key={s.title} className={`rounded-[18px] p-3.5 text-[12.5px] ${s.now ? "bg-mint-light" : "bg-card"}`}>
                  <b className="block">{s.title}</b>
                  {s.text}
                </li>
              ))}
            </ol>
            <button type="button" onClick={restart} className="h-10 cursor-pointer rounded-pill border-0 bg-card px-4 text-[12.5px] font-semibold text-ink">
              {applySent.restart}
            </button>
          </section>
        ) : (
          <>
            <section aria-labelledby="h-apply" className="flex flex-col gap-[18px] rounded-[32px] border border-mint-border bg-mint-card px-7 py-[26px] max-[900px]:rounded-card max-[900px]:p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 id="h-apply" className="m-0 font-heading text-page-title leading-[1.1] font-semibold max-[900px]:text-[24px]">{applyHero.title}</h1>
                  <span className="text-body text-grey-text">{applyHero.text}</span>
                </div>
                <span aria-live="polite" className="rounded-pill bg-tile px-3 py-1.5 text-[12.5px] font-semibold text-teal-deep">
                  {applyHero.stepOf(step, total)}
                </span>
              </div>
              <nav aria-label="Application steps" className="grid grid-cols-5 gap-1.5">
                {applySteps.map((s, i) => {
                  const n = i + 1;
                  const on = n === step;
                  const done = n < step;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      aria-current={on ? "step" : undefined}
                      onClick={() => setStep(n)}
                      className={`flex min-w-0 cursor-pointer flex-col gap-2 border-0 bg-transparent p-0 text-left ${on || done ? "text-ink" : "text-hint"}`}
                    >
                      <span className={`block h-1.5 rounded-[3px] ${done ? "bg-teal" : on ? "bg-mint" : "bg-white/90"}`} />
                      <span className="truncate text-label font-semibold">{s.label}</span>
                    </button>
                  );
                })}
              </nav>
            </section>

            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start gap-4 max-[900px]:grid-cols-1">
              <section aria-labelledby="h-step" className="flex min-w-0 flex-col gap-[18px] rounded-card-lg bg-tile p-6 max-[900px]:p-5">
                <div>
                  <h2 id="h-step" className="m-0 font-heading text-[22px] font-semibold">{current.title}</h2>
                  <span className="text-body-sm text-hint">{current.sub}</span>
                </div>

                {step === 1 ? (
                  <div className="flex flex-col gap-3">
                    <TextField id="a-name" {...bf.name} />
                    <div className={two}>
                      <Field id="a-ind" label={bf.industry.label}>
                        <select id="a-ind" className={`${inputClass} cursor-pointer`}>
                          {bf.industry.options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </Field>
                      <TextField id="a-start" {...bf.start} />
                    </div>
                    <div className={two}>
                      <TextField id="a-state" {...bf.state} />
                      <TextField id="a-ein" {...bf.ein} />
                    </div>
                  </div>
                ) : step === 2 ? (
                  <div className="flex flex-col gap-3">
                    <div className={two}>
                      <TextField id="o-name" {...of.name} />
                      <TextField id="o-own" {...of.own} />
                    </div>
                    <div className={two}>
                      <TextField id="o-mail" {...of.email} />
                      <TextField id="o-ph" {...of.phone} />
                    </div>
                    <span className="text-label text-hint">{of.note}</span>
                  </div>
                ) : step === 3 ? (
                  <div className="flex flex-col gap-3.5">
                    <Field id="f-amt" label={ff.amount.label}>
                      <input
                        id="f-amt"
                        type="range"
                        min={amountRange.min}
                        max={amountRange.max}
                        step={amountRange.step}
                        value={amount}
                        aria-valuetext={money(amount)}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full cursor-pointer accent-teal"
                      />
                      <b className="font-heading text-[26px] font-semibold tabular-nums tracking-[-0.03em]">{money(amount)}</b>
                    </Field>
                    <Field id="f-rev" label={ff.revenue.label}>
                      <select id="f-rev" value={rev} onChange={(e) => setRev(Number(e.target.value))} className={`${inputClass} cursor-pointer`}>
                        {ff.revenue.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <ChoiceChips label={ff.purpose.label} options={ff.purpose.options} value={purpose} onChange={setPurpose} />
                    <ChoiceChips label={ff.existing.label} options={ff.existing.options} value={existing} onChange={setExisting} />
                  </div>
                ) : step === 4 ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3.5 rounded-[22px] border border-mint-border bg-mint-card p-[18px]">
                      <span className="min-w-0 flex-[1_1_220px]">
                        <b className="block text-[15px]">{bankStep.connect.title}</b>
                        <span className="text-[12.5px] text-grey-text">{bankStep.connect.text}</span>
                      </span>
                      <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-teal px-[18px] text-body-sm font-semibold text-white">
                        {bankStep.connect.action}
                      </button>
                    </div>
                    <div className="flex items-center gap-2.5 text-label text-hint-soft">
                      <span className="h-px flex-1 bg-line" />
                      {bankStep.or}
                      <span className="h-px flex-1 bg-line" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 rounded-[22px] border-[1.5px] border-dashed border-line-dashed bg-field p-[22px] text-center">
                      <b className="text-body">{bankStep.upload.title}</b>
                      <span className="text-label text-hint">{bankStep.upload.hint}</span>
                      <button type="button" className="mt-1.5 h-10 cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line-soft)]">
                        {bankStep.upload.action}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {signStep.permissions.map((p) => (
                      <label key={p.key} className="flex cursor-pointer items-start gap-3 rounded-[18px] bg-card p-3.5 text-body-sm">
                        <TickBox
                          checked={!!perms[p.key]}
                          onChange={() => setPerms((x) => ({ ...x, [p.key]: !x[p.key] }))}
                          className="mt-px mb-0 ml-0 h-5 w-5 flex-none cursor-pointer accent-teal"
                        />
                        <span>
                          <b>{p.title}</b>
                          <span className="block text-label text-hint">{p.hint}</span>
                        </span>
                      </label>
                    ))}
                    <TextField id="sig" {...signStep.signature} signature />
                  </div>
                )}

                {/* On phones these move to the fixed bottom bar. */}
                <div className="flex items-center justify-between gap-2.5 border-t border-line pt-1.5 max-[900px]:hidden">
                  <button
                    type="button"
                    onClick={back}
                    className={`h-[46px] cursor-pointer rounded-pill border-0 bg-card px-[22px] text-[13.5px] font-semibold text-ink ${step === 1 ? "invisible" : ""}`}
                  >
                    {formNav.back}
                  </button>
                  <span className="text-label text-hint">{formNav.saved}</span>
                  <button
                    type="button"
                    onClick={next}
                    disabled={nextDisabled}
                    className={`h-[46px] rounded-pill border-0 px-[22px] text-[13.5px] font-semibold ${nextDisabled ? "cursor-not-allowed bg-line text-hint-soft" : "cursor-pointer bg-teal text-white"}`}
                  >
                    {last ? formNav.send : formNav.next}
                  </button>
                </div>
              </section>

              <aside className="flex min-w-0 flex-col gap-4">
                <article aria-labelledby="h-est" className="flex flex-col gap-2.5 rounded-[28px] bg-tile p-5">
                  <h2 id="h-est" className="m-0 font-heading text-card-title font-semibold">{firstLook.title}</h2>
                  <span className="text-label text-hint">{firstLook.text}</span>
                  <div className="rounded-tile-lg bg-card p-4" aria-live="polite">
                    <span className="text-label text-hint">{firstLook.upTo}</span>
                    <b className="block font-heading text-[30px] font-semibold tabular-nums tracking-[-0.03em] text-teal-deep">{money(estimate)}</b>
                    <span className="text-label text-hint">{firstLook.notOffer}</span>
                  </div>
                  <span className={`rounded-tile px-3 py-2.5 text-[12.5px] ${fits ? "bg-mint-light text-teal-dark" : "bg-amber-tint text-amber-mute"}`}>{fits ? firstLook.fits : firstLook.over}</span>
                </article>
                <article className="flex flex-col gap-2.5 rounded-[28px] bg-tile p-5">
                  <h2 className="m-0 font-heading text-card-title font-semibold">{haveReady.title}</h2>
                  <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {haveReady.items.map((h) => (
                      <li key={h} className="text-body-sm">
                        {h}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="flex flex-col gap-1.5 rounded-[28px] bg-card p-[18px]">
                  <b className="text-body-sm">{applyPrivacy.title}</b>
                  <span className="text-label text-hint">{applyPrivacy.text(data.funder.supportPhone)}</span>
                </article>
              </aside>
            </div>
          </>
        )}
      </main>

      <PublicFooter barSpace={!sent} />

      {/* Phones: round Back and a big Continue / Send application, fixed at the bottom. */}
      {sent ? null : (
        <div className="fixed inset-x-0 bottom-0 z-10 hidden items-center gap-2.5 border-t border-line-strong bg-tile/95 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur max-[900px]:flex">
          <button
            type="button"
            onClick={back}
            aria-label={formNav.back}
            className={`grid h-12 w-12 flex-none cursor-pointer place-items-center rounded-full border-0 bg-card text-ink ${step === 1 ? "invisible" : ""}`}
          >
            <BackArrow />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={nextDisabled}
            className={`h-12 min-w-0 flex-1 truncate rounded-pill border-0 px-5 text-body-sm font-semibold ${nextDisabled ? "cursor-not-allowed bg-line text-hint-soft" : "cursor-pointer bg-teal text-white"}`}
          >
            {last ? formNav.send : formNav.next}
          </button>
        </div>
      )}
    </div>
  );
}
