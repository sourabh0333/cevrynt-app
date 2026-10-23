"use client";

import Link from "next/link";
import { useState, type DragEvent } from "react";
import { Tick } from "@/components/deals/integrity/Tick";
import { dealTabHref } from "@/lib/copy/deal";
import { boardCopy as board, partyCopy, partyName } from "@/lib/copy/deal-conditions";
import type { ConditionParty, DealConditions, Id } from "@/lib/data/types";
import type { ConditionStatus, Waived } from "@/lib/deal-conditions";
import type { Derived } from "./derive";

const avatar: Record<ConditionParty, string> = {
  broker: "bg-blue-bg text-blue-text",
  merchant: "text-sand-text",
  us: "bg-teal text-white",
  auto: "bg-mint-bg text-teal-dark",
};
const merchantFill = { background: "linear-gradient(140deg, #E8C9A1, #C99A6B)" };

const chip: Record<ConditionStatus, string> = {
  done: "bg-mint-bg text-teal-dark",
  waived: "bg-amber-bg text-amber-text",
  booked: "bg-blue-bg text-blue-text",
  wait: "bg-amber-tint text-amber-deep",
};

type Props = {
  id: Id;
  d: Derived & { reasons: Waived };
  parties: DealConditions["parties"];
  /** the signed-in underwriter's initials, on "us" cards */
  myInitials: string;
  /** the senior underwriter who approves waived items */
  senior: string;
  /** the amount the conditions are set for */
  amount: number;
  onToggle: (id: string) => void;
  onWaive: (id: string, reason: string) => void;
};

/**
 * "Still needed" from design/Deal-Conditions.html and its prototype: the
 * open condition cards, the note once something is waived, and the strip
 * of items done today. Marking a card done (or dropping a file on one that
 * takes a file) moves it to the strip and updates the runway; Undo brings
 * it back. Waiving asks for a short reason and then notes that the senior
 * underwriter must approve it. No hover.
 */
export function ConditionsBoard({ id, d, parties, myInitials, senior, amount, onToggle, onWaive }: Props) {
  const [waiving, setWaiving] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [over, setOver] = useState<string | null>(null);

  const initials: Record<ConditionParty, string> = {
    broker: parties.broker.initials,
    merchant: parties.merchant.initials,
    us: myInitials,
    auto: partyCopy.auto.initials,
  };

  const startWaive = (k: string) => {
    setWaiving(k);
    setReason("");
  };
  const confirmWaive = () => {
    if (!waiving || !reason.trim()) return;
    onWaive(waiving, reason.trim());
    setWaiving(null);
    setReason("");
  };
  const drop = (e: DragEvent, k: string) => {
    e.preventDefault();
    setOver(null);
    onToggle(k);
  };

  return (
    <section aria-labelledby="h-open" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2.5 px-1 pt-1">
        <div>
          <h2 id="h-open" className="m-0 font-heading text-[22px] font-semibold">{board.title}</h2>
          <div className="mt-[3px] text-label text-hint">{board.subtitle(amount)}</div>
        </div>
        <button type="button" className="h-[38px] cursor-pointer rounded-pill border-0 bg-card px-3.5 text-label font-semibold text-ink">
          {board.add}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        {d.open.map(({ item: it, status }) => {
          const isDone = status === "done";
          const isWaived = status === "waived";
          const isWaiving = waiving === it.id;
          const meta = board.meta(it);
          return (
            <article
              key={it.id}
              className={`flex flex-col gap-3.5 rounded-[26px] p-[18px] text-ink ${isDone ? "bg-mint-light shadow-[inset_0_0_0_1.5px_var(--color-mint)]" : "bg-card"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`grid h-10 w-10 flex-none place-items-center rounded-[11px] text-[10.5px] font-bold ${avatar[it.party]}`}
                  style={it.party === "merchant" ? merchantFill : undefined}
                >
                  {initials[it.party]}
                </span>
                <span className={`whitespace-nowrap rounded-pill px-2.5 py-1 text-label-sm font-semibold ${chip[status]}`}>{board.chip[status]}</span>
              </div>
              <div>
                <b className="block font-heading text-[18px] font-semibold">{it.title}</b>
                <span className="mt-1 block text-[12.5px] text-muted">{it.detail}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <span className="rounded-[12px] bg-tile px-[11px] py-[9px]">
                  <span className="block text-[10.5px] text-hint">{board.from}</span>
                  <b className="text-[12.5px]">{partyName(it.party, parties)}</b>
                </span>
                <span className="min-w-0 rounded-[12px] bg-tile px-[11px] py-[9px]">
                  <span className="block text-[10.5px] text-hint">{isWaived ? board.waive.reasonLabel : meta[0]}</span>
                  <b className="block truncate text-[12.5px]">{isWaived ? d.reasons[it.id] : meta[1]}</b>
                </span>
              </div>
              {it.acceptsFile && !isDone && !isWaived ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOver(it.id);
                  }}
                  onDragLeave={() => setOver(null)}
                  onDrop={(e) => drop(e, it.id)}
                  className={`rounded-tile border-[1.5px] border-dashed p-2.5 text-center text-[11.5px] ${over === it.id ? "border-teal bg-mint-light text-teal-dark" : "border-line-dash-soft text-hint"}`}
                >
                  {board.drop}
                </div>
              ) : null}
              {isWaiving ? (
                <div className="mt-auto flex flex-col gap-1.5">
                  <label htmlFor={`waive-${it.id}`} className="text-label font-semibold text-grey-text">
                    {board.waive.prompt}
                  </label>
                  <input
                    id={`waive-${it.id}`}
                    value={reason}
                    autoFocus
                    onChange={(e) => setReason(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmWaive();
                      if (e.key === "Escape") setWaiving(null);
                    }}
                    placeholder={board.waive.placeholder}
                    className="box-border h-10 min-w-0 rounded-tile border border-line-soft bg-tile px-3 text-body-sm text-ink outline-none placeholder:text-hint focus:outline-2 focus:outline-offset-1 focus:outline-teal"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      aria-disabled={!reason.trim()}
                      onClick={confirmWaive}
                      className={`h-10 flex-1 rounded-pill border-0 px-3.5 text-[12.5px] font-semibold ${reason.trim() ? "cursor-pointer bg-teal text-white" : "bg-line text-hint-soft"}`}
                    >
                      {board.waive.confirm}
                    </button>
                    <button type="button" onClick={() => setWaiving(null)} className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-grey-text">
                      {board.waive.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-auto flex gap-1.5">
                  {!isWaived ? (
                    <button
                      type="button"
                      onClick={() => onToggle(it.id)}
                      className={`h-10 flex-1 cursor-pointer rounded-pill border-0 px-3.5 text-[12.5px] font-semibold ${isDone ? "bg-card text-ink" : "bg-teal text-white"}`}
                    >
                      {isDone ? board.undo : board.action[it.action]}
                    </button>
                  ) : null}
                  {!isDone && !isWaived && it.status !== "booked" ? (
                    <button type="button" onClick={() => startWaive(it.id)} className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-grey-text">
                      {board.waive.button}
                    </button>
                  ) : null}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {d.hasWaived ? (
        <div className="flex items-center gap-2.5 rounded-[16px] bg-amber-tint px-3.5 py-3 text-[12.5px] text-amber-mute">
          <span className="h-2 w-2 flex-none rounded-full bg-amber" />
          {board.waivedNote(senior)}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3.5 rounded-[26px] bg-card px-[18px] py-4 text-ink">
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-body-sm font-semibold">
          <span className="h-[9px] w-[9px] rounded-full bg-teal" />
          {board.doneToday} · {d.doneCount}
        </span>
        <div className="flex flex-1 flex-wrap gap-1.5" aria-live="polite">
          {d.done.map((x) => (
            <span key={x.title} className="inline-flex items-center gap-2 rounded-pill bg-mint-light py-1.5 pr-3 pl-1.5 text-label">
              <Tick />
              <b className="text-teal-dark">{x.title}</b>
              <span className="font-mono text-[10.5px] text-teal-mute">{x.time ?? board.now}</span>
            </span>
          ))}
        </div>
        <Link href={dealTabHref(id, { path: "/activity" })} className="whitespace-nowrap text-label font-semibold text-teal-deep no-underline">
          {board.history}
        </Link>
      </div>
    </section>
  );
}
