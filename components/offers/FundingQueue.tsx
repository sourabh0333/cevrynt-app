"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/offer-math";
import { fundingQueue as t } from "@/lib/sample-data/offers";

/** ready → pending (Fund) → sent (Release as Priya) → closed (Done, after the undo window or by hand). */
type Step = "ready" | "pending" | "sent" | "closed";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Design .fq2: tick, merchant, advance → net, payout, status. The payout
// column hides on narrow screens so nothing scrolls sideways.
const grid = "grid grid-cols-[18px_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_172px] items-center gap-3.5 max-[760px]:grid-cols-[18px_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)] max-[760px]:[&>:nth-child(4)]:hidden";
const ell = "block truncate";

/**
 * "Funding queue" from design/Offers.html and its prototype: the compact
 * list on the left (scrolls after three deals; the on-hold deal cannot be
 * ticked) and the "Ready to send" summary on the right. Fund moves the
 * ticked deals to awaiting release; "Release as Priya" is the second
 * person. For five minutes after the release an "Undo · m:ss" button
 * returns the deals to awaiting release; once it runs out they stay
 * sent. Done only closes the message. No hover.
 */
export function FundingQueue() {
  const [sel, setSel] = useState<Record<string, boolean>>(Object.fromEntries(t.start.map((k) => [k, true])));
  const [step, setStep] = useState<Step>("ready");
  const [left, setLeft] = useState(t.summary.undoWindow);
  const sent = step === "sent" || step === "closed";
  const pending = step === "pending";
  const canUndo = step === "sent" && left > 0;

  // The undo countdown: one tick a second while a release can still be undone.
  useEffect(() => {
    if (step !== "sent" || left <= 0) return;
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, left]);

  const picked = t.deals.filter((d) => d.ok && sel[d.key]);
  const total = picked.reduce((a, d) => a + d.net, 0);

  const toggle = (k: string) => {
    if (step !== "ready") return;
    setSel((s) => ({ ...s, [k]: !s[k] }));
  };
  const fund = () => {
    if (step === "ready" && picked.length) setStep("pending");
    else if (step === "pending") setStep("ready");
  };
  const release = () => {
    setLeft(t.summary.undoWindow);
    setStep("sent");
  };
  const undo = () => {
    if (canUndo) setStep("pending");
  };
  const close = () => setStep("closed");

  const note = step === "closed" ? t.summary.closed : t.summary.note[step];

  return (
    <article
      aria-labelledby="h-fq"
      className="grid grid-cols-[minmax(0,1fr)_270px] items-stretch gap-1.5 rounded-card-lg border border-line bg-tile p-2 text-ink max-[900px]:grid-cols-1"
    >
      <div className="flex min-w-0 flex-col gap-2.5 pt-3.5 pr-3 pb-3 pl-3.5">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-fq" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
            <div className="mt-0.5 text-label text-hint">{t.subtitle}</div>
          </div>
          <span className="rounded-pill bg-amber-tint px-2.5 py-1 text-label-sm font-semibold text-amber-deep">{t.cutoff}</span>
        </div>
        <div className={`${grid} px-2.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint-soft`}>
          {t.columns.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
        <div className="scrollbar-thin max-h-[196px] overflow-y-auto border-t border-line-faint">
          {t.deals.map((d) => {
            const on = d.ok && !!sel[d.key];
            const isSent = sent && on;
            const waiting = pending && on;
            const status = !d.ok ? t.status.hold(d.check) : isSent ? t.status.sent : waiting ? t.status.pending : t.status.ready;
            const chipClass = !d.ok
              ? "bg-red-bg text-red-text"
              : isSent
                ? "bg-mint-bg text-teal-dark"
                : waiting
                  ? "bg-blue-bg text-blue-text"
                  : "bg-mint-light text-teal-dark";
            const dot = !d.ok ? "bg-red" : waiting ? "bg-blue" : "bg-teal";
            return (
              <label
                key={d.key}
                className={`${grid} border-b border-card p-2.5 ${d.ok ? (on ? "bg-mint-faint" : "bg-tile") : "bg-cream-faint"} ${d.ok && step === "ready" ? "cursor-pointer" : "cursor-default"}`}
              >
                <input
                  type="checkbox"
                  aria-label={`Select ${d.name}`}
                  checked={on}
                  disabled={!d.ok || step !== "ready"}
                  onChange={() => toggle(d.key)}
                  className="m-0 h-[17px] w-[17px] accent-teal"
                />
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[11px] text-label-sm font-bold text-white"
                    style={{ background: `linear-gradient(140deg, ${d.g[0]}, ${d.g[1]})` }}
                  >
                    {d.ini}
                  </span>
                  <span className="min-w-0">
                    <b className={`${ell} text-[13.5px]`}>{d.name}</b>
                    <span className={`${ell} font-mono text-[11.5px] text-hint`}>{d.id}</span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className={`${ell} text-[13.5px]`}>
                    <b className="font-heading font-semibold tabular-nums tracking-[-0.03em]">{money(d.amount)}</b>
                    <span className="text-grey-dot"> → </span>
                    <b className="font-heading font-semibold tabular-nums tracking-[-0.03em] text-teal-deep">{money(d.net)}</b>
                  </span>
                  <span className={`${ell} text-[11.5px] text-hint`}>{d.netNote}</span>
                </span>
                <span className="min-w-0">
                  <b className={`${ell} text-body-sm font-semibold`}>{d.bank}</b>
                  <span className={`${ell} text-[11.5px] text-hint`}>{d.method}</span>
                </span>
                <span className={`box-border inline-flex max-w-full items-center gap-1.5 justify-self-start overflow-hidden rounded-pill px-2.5 py-[5px] text-[11.5px] font-semibold whitespace-nowrap ${chipClass}`}>
                  <span className={`h-1.5 w-1.5 flex-none rounded-full ${dot}`} />
                  <span className="truncate">{status}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <aside
        aria-label="Send summary"
        className="flex flex-col gap-3 rounded-card bg-[linear-gradient(160deg,var(--color-teal),var(--color-teal-ink))] p-[18px] text-white"
        aria-live="polite"
      >
        <span className="text-label-sm font-semibold tracking-[0.08em] uppercase text-mint">{t.summary.caption}</span>
        <b className="font-heading text-[32px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{money(total)}</b>
        <span className="text-[12.5px] text-mint-soft">{t.summary.selected(picked.length)}</span>
        <div className="flex flex-col gap-1.5 border-t border-b border-white/14 py-2.5">
          {picked.map((d) => (
            <span key={d.key} className="flex justify-between gap-2.5 text-[12.5px]">
              <span className="truncate text-white/85">{d.name}</span>
              <b className="font-heading font-semibold tabular-nums tracking-[-0.03em]">{money(d.net)}</b>
            </span>
          ))}
        </div>
        <span className="text-[11.5px] text-white/65">{note}</span>
        <div className="mt-auto flex flex-col gap-1.5">
          {pending ? (
            <button type="button" onClick={release} className="h-10 cursor-pointer rounded-pill border-0 bg-tile text-[12.5px] font-semibold text-ink">
              {t.summary.release}
            </button>
          ) : null}
          {canUndo ? (
            <button type="button" onClick={undo} className="h-10 cursor-pointer rounded-pill border-0 bg-tile font-mono text-[12.5px] font-semibold text-ink tabular-nums">
              {t.summary.undo(clock(left))}
            </button>
          ) : null}
          {step === "closed" ? null : (
            <button
              type="button"
              aria-disabled={step === "ready" && picked.length === 0}
              onClick={sent ? close : fund}
              className={`h-[42px] w-full rounded-pill border-0 px-[18px] text-body-sm font-semibold ${
                step !== "ready" ? "cursor-pointer bg-white/14 text-white" : picked.length ? "cursor-pointer bg-mint text-teal-dark" : "bg-white/10 text-white/65"
              }`}
            >
              {sent ? t.summary.done : pending ? t.summary.cancel : t.summary.fund(picked.length)}
            </button>
          )}
        </div>
      </aside>
    </article>
  );
}
