"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { liveBankCopy, reviewCopy as t } from "@/lib/copy/deal-integrity";
import { currentTime } from "@/lib/data/actions/clock";
import type { DealIntegrity, IsoDateTime } from "@/lib/data/types";
import { clockTime } from "@/lib/format";

/**
 * "Compare with live bank data": the mint card with the solid teal send
 * button, addressed to the deal's main owner.
 */
export function LiveBankCard({ owner, connected }: { owner: { name: string; possessive: string } | null; connected: boolean }) {
  return (
    <article
      aria-labelledby="h-live"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-[22px] text-ink"
    >
      <span className="self-start rounded-pill bg-white/10 px-2.5 py-1 text-label-sm font-semibold text-muted">
        {connected ? liveBankCopy.chip.done : liveBankCopy.chip.open}
      </span>
      <h2 id="h-live" className="m-0 font-heading text-[21px] font-semibold">{liveBankCopy.title}</h2>
      {owner ? <span className="text-[12.5px] text-muted">{liveBankCopy.text(owner.name, owner.possessive)}</span> : null}
      <div className="mt-auto flex flex-wrap gap-2">
        {owner && !connected ? <Button glow>{liveBankCopy.send(owner.name)}</Button> : null}
        <button type="button" className="h-[42px] cursor-pointer whitespace-nowrap rounded-pill border border-teal/7 bg-transparent px-4 text-[12.5px] font-semibold text-ink">
          {liveBankCopy.skip}
        </button>
      </div>
    </article>
  );
}


/**
 * "Your review" from design/Deal-Integrity.html and its prototype: the
 * tick box, the note field and the sign-off button. The button only works
 * once the box is ticked; recording the review shows it as done with the
 * reviewer's name and the time.
 */
export function ReviewCard({ review, reviewer }: { review: DealIntegrity["review"]; reviewer: string }) {
  const [agreed, setAgreed] = useState(false);
  const [note, setNote] = useState("");
  // When the review was signed, by the app's clock (getNow), not the device's.
  const [signedAt, setSignedAt] = useState<IsoDateTime | null>(null);
  const signed = signedAt !== null;

  const buttonClass = signed
    ? "bg-mint-bg text-teal-dark"
    : agreed
      ? "bg-teal text-white cursor-pointer"
      : "bg-line text-hint-soft";

  return (
    <Card as="article" aria-labelledby="h-sign" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 id="h-sign" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className={`rounded-pill px-2.5 py-1 text-label-sm font-semibold ${signed ? "bg-mint-bg text-teal-dark" : "bg-amber-tint text-amber-deep"}`}>
          {signed ? t.chip.done : t.chip.open}
        </span>
      </div>
      <label className={`flex items-start gap-3 rounded-[16px] bg-tile px-3.5 py-3 ${signed ? "" : "cursor-pointer"}`}>
        <input
          type="checkbox"
          checked={agreed}
          disabled={signed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="m-0 mt-px h-5 w-5 flex-none accent-teal"
        />
        <span className="text-body-sm">
          <b>{t.check(review.subject)}</b>
          <span className="block text-label text-muted">{review.detail}</span>
        </span>
      </label>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="i-note" className="text-label font-semibold text-grey-text">
          {t.note.label}
        </label>
        <textarea
          id="i-note"
          rows={2}
          value={note}
          readOnly={signed}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.note.placeholder}
          className="box-border resize-y rounded-tile border border-line-soft bg-tile px-3.5 py-3 font-sans text-body-sm text-ink outline-none placeholder:text-hint focus:outline-2 focus:outline-offset-1 focus:outline-teal"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-label text-hint" aria-live="polite">
          {signed ? t.recorded(clockTime(signedAt), reviewer) : t.hint}
        </span>
        <button
          type="button"
          aria-disabled={!agreed || signed}
          onClick={() => {
            if (agreed && !signed) currentTime().then(setSignedAt);
          }}
          className={`h-11 whitespace-nowrap rounded-pill border-0 px-[18px] text-body-sm font-semibold ${buttonClass}`}
        >
          {signed ? t.button.done(reviewer) : t.button.open}
        </button>
      </div>
    </Card>
  );
}
