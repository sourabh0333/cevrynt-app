"use client";

import Link from "next/link";
import { useState } from "react";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { bulkCopy, type FolderRowView as FolderRow } from "@/lib/copy/intake";

const t = bulkCopy.preview;

/*
 * Design columns: folder, business, files, statements, fit check, result.
 * No horizontal scroll (layout rule 3): columns flex, text truncates, and the
 * Files and Statements columns hide under 900px, the fit check under 700px.
 */
const cols =
  "grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_60px_90px_minmax(0,1.3fr)_150px] gap-3 max-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.3fr)_150px] max-[900px]:[&>:nth-child(3)]:hidden max-[900px]:[&>:nth-child(4)]:hidden max-[700px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_150px] max-[700px]:[&>:nth-child(5)]:hidden";

const dot = { good: "bg-teal", warn: "bg-amber", bad: "bg-red", none: "" };
const smallBtn = "h-[30px] cursor-pointer rounded-pill border-0 px-2.5 text-[11.5px] font-semibold";

function Row({ row }: { row: FolderRow }) {
  const cells = (
    <>
      <span className="truncate font-mono text-label">{row.folder}</span>
      <span className="min-w-0">
        <b className="block truncate text-body-sm">{row.business}</b>
        {row.note ? <span className="block truncate text-[11.5px] text-amber-mute">{row.note}</span> : null}
      </span>
      <span className="font-heading tabular-nums tracking-[-0.03em]">{row.files}</span>
      <span className={`text-[12.5px] ${row.statementsWarn ? "font-semibold text-amber-text" : ""}`}>{row.statements}</span>
      {row.fit.tone === "none" ? (
        <span className="truncate text-[12.5px] text-hint">{row.fit.text}</span>
      ) : (
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[12.5px]">
          <span className={`h-2 w-2 flex-none rounded-full ${dot[row.fit.tone]}`} />
          <span className="truncate">{row.fit.text}</span>
        </span>
      )}
      {row.result.kind === "chip" ? (
        <span
          className={`justify-self-end rounded-pill px-2.5 py-1 text-label-sm font-semibold ${
            row.result.label === "Ready" ? "bg-mint-bg text-teal-dark" : "bg-grey-bg text-grey-text"
          }`}
        >
          {row.result.label}
        </span>
      ) : (
        <span className="flex gap-1.5 justify-self-end">
          <button type="button" className={`${smallBtn} bg-teal text-white`}>{row.result.primary}</button>
          <button type="button" className={`${smallBtn} bg-card text-ink`}>{row.result.secondary}</button>
        </span>
      )}
    </>
  );
  const base = `${cols} items-center rounded-[16px] px-3 py-2.5 text-ink`;
  return row.attention ? (
    <div className={`${base} bg-amber-bg`}>{cells}</div>
  ) : (
    <Link href={row.href} className={`${base} bg-page no-underline`}>
      {cells}
    </Link>
  );
}

/** "Folder preview": one row per folder, with the Needs attention filter. */
export function FolderPreview({ rows: folders }: { rows: FolderRow[] }) {
  const [filter, setFilter] = useState("all");
  const attention = folders.filter((f) => f.attention);
  const rows = filter === "attention" ? attention : folders;

  return (
    <section aria-labelledby="h-prev" className="flex min-w-0 flex-[999_1_640px] flex-col gap-2.5 rounded-card-lg bg-card p-[22px] text-ink">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-prev" className="m-0 font-heading text-[21px] font-semibold">{t.title}</h2>
          <p className="mt-[3px] mb-0 text-[12.5px] text-hint">{t.subtitle}</p>
        </div>
        <SegmentedSwitch
          label={t.show}
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: t.all(folders.length) },
            { value: "attention", label: t.attention(attention.length) },
          ]}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${cols} px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          <span>{t.columns.folder}</span>
          <span>{t.columns.business}</span>
          <span>{t.columns.files}</span>
          <span>{t.columns.statements}</span>
          <span>{t.columns.fit}</span>
          <span className="text-right">{t.columns.result}</span>
        </div>
        {rows.map((r) => (
          <Row key={r.id} row={r} />
        ))}
      </div>
    </section>
  );
}
