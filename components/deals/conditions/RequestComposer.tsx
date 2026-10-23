"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { composer, type Recipient } from "@/lib/sample-data/deal-conditions";

const avatarClass: Record<Recipient, string> = { broker: "bg-blue-bg text-blue-text", merchant: "text-sand-text" };
const merchantFill = { background: "linear-gradient(140deg, #E8C9A1, #C99A6B)" };

/**
 * "Ask for what's missing" from design/Deal-Conditions.html and its
 * prototype: pick the broker or the merchant and the message preview
 * changes with it. No hover.
 */
export function RequestComposer() {
  const [to, setTo] = useState<Recipient>("broker");
  const who = composer.recipients.find((r) => r.key === to) ?? composer.recipients[0];

  return (
    <section aria-labelledby="h-ask" className="flex flex-wrap gap-[18px] rounded-card-lg bg-card p-[22px] text-ink">
      <div className="flex flex-[1_1_260px] flex-col gap-3">
        <div>
          <h2 id="h-ask" className="m-0 font-heading text-[20px] font-semibold">{composer.title}</h2>
          <div className="mt-[3px] text-label text-hint">{composer.subtitle}</div>
        </div>
        <span className="text-cap font-semibold uppercase text-hint">{composer.sendTo}</span>
        <div role="group" aria-label={composer.sendTo} className="flex flex-col gap-1.5">
          {composer.recipients.map((r) => {
            const on = r.key === to;
            return (
              <button
                key={r.key}
                type="button"
                aria-pressed={on}
                onClick={() => setTo(r.key)}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-[16px] border-[1.5px] px-3 py-2.5 text-ink ${on ? "border-ink bg-card" : "border-transparent bg-tile"}`}
              >
                <span
                  className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] text-[10.5px] font-bold ${avatarClass[r.key]}`}
                  style={r.key === "merchant" ? merchantFill : undefined}
                >
                  {r.initials}
                </span>
                <span className="text-left">
                  <b className="block text-body-sm">{r.label}</b>
                  <span className="text-[11.5px] opacity-75">{r.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
        <span className="mt-1 text-cap font-semibold uppercase text-hint">{composer.askingFor}</span>
        <div className="flex flex-wrap gap-1.5">
          {composer.asks.map((a) => (
            <span key={a.label} className={`rounded-pill px-3 py-1.5 text-label ${a.on ? "bg-teal text-white" : "bg-tile"}`}>
              {a.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-[2_1_380px] flex-col gap-3 rounded-[22px] bg-tile p-[18px]">
        <div className="flex items-center justify-between gap-2 text-label text-hint">
          <span>
            To <b className="text-ink">{who.to}</b>
          </span>
          <span>{composer.preview}</span>
        </div>
        <div
          aria-live="polite"
          className="max-w-[520px] self-start whitespace-pre-line rounded-[20px_20px_20px_6px] bg-card px-[18px] py-4 text-body-sm leading-[1.6] shadow-[0_10px_28px_-20px_rgba(15,21,19,.4)]"
        >
          {composer.messages[to]}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-label text-hint">
            {composer.reminder}
            {/* Opens the merchant's page in a new tab: it has no app chrome to come back from. */}
            <Link href={composer.seeLink.href} target="_blank" rel="noopener" className="font-semibold text-teal no-underline">
              {composer.seeLink.label}
            </Link>
          </span>
          <div className="flex gap-2">
            <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-card px-4 text-[12.5px] font-semibold text-ink">
              {composer.edit}
            </button>
            <Button>{composer.send}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
