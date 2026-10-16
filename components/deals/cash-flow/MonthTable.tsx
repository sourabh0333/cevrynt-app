import { Card } from "@/components/ui/Card";
import { monthTable, type MonthRow } from "@/lib/sample-data/deal-cash-flow";

// Flexible columns instead of the design's 860px minimum, so the table never
// scrolls sideways (layout rule 3). The quieter columns hide on narrow screens.
const grid = "grid grid-cols-[150px_repeat(7,minmax(0,1fr))] items-center gap-2.5 max-[1180px]:grid-cols-[110px_repeat(5,minmax(0,1fr))] max-[860px]:grid-cols-[100px_repeat(3,minmax(0,1fr))]";
const hideMd = "max-[1180px]:hidden";
const hideSm = "max-[860px]:hidden";
const num = "truncate text-right font-heading tabular-nums tracking-[-0.03em]";

/** Column order matches `monthTable.columns`; the hidden-at classes thin it out. */
const cells: { key: keyof MonthRow; hide?: string; strong?: boolean }[] = [
  { key: "deposits" },
  { key: "trueRevenue", strong: true },
  { key: "withdrawals", hide: hideMd },
  { key: "debt", hide: hideMd },
  { key: "avgBalance", hide: hideSm },
  { key: "lowest" },
  { key: "nsfs" },
];

function Row({ row, total = false }: { row: MonthRow; total?: boolean }) {
  const bg = total ? "bg-teal text-white" : row.warn ? "bg-amber-tint" : "bg-tile";
  return (
    <div className={`${grid} rounded-[16px] px-3.5 py-3 text-[13.5px] ${bg}`}>
      <b className="flex min-w-0 flex-wrap items-center gap-1.5">
        {row.month}
        {row.tag ? (
          <span className="whitespace-nowrap rounded-pill bg-card px-[7px] py-0.5 text-[10.5px] font-semibold text-amber-deep">{row.tag}</span>
        ) : null}
      </b>
      {cells.map((c) => {
        const lowWarn = c.key === "lowest" && row.warn && !total;
        const cls = [
          num,
          c.hide ?? "",
          total && c.strong ? "text-mint" : "",
          lowWarn ? "font-semibold text-amber-deep" : "",
        ].join(" ");
        return c.strong ? (
          <b key={c.key} className={cls}>{row[c.key]}</b>
        ) : (
          <span key={c.key} className={cls}>{row[c.key]}</span>
        );
      })}
    </div>
  );
}

/**
 * "Month by month" from design/Deal-CashFlow.html: one row per statement
 * month and a teal average row. August carries the "$12K excluded" chip and
 * its lowest balance in amber. No horizontal scroll, no hover.
 */
export function MonthTable() {
  const { columns, rows, average } = monthTable;
  const hides = ["", "", "", hideMd, hideMd, hideSm, "", ""];
  return (
    <Card as="section" aria-labelledby="h-month" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-month" className="m-0 font-heading text-[20px] font-semibold">{monthTable.title}</h2>
          <div className="mt-[3px] text-label text-hint">{monthTable.hint}</div>
        </div>
        <button type="button" className="h-9 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-ink">
          {monthTable.exportLabel}
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${grid} px-3.5 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {columns.map((c, i) => (
            <span key={c} className={`${i ? "text-right" : ""} truncate ${hides[i]}`}>{c}</span>
          ))}
        </div>
        {rows.map((r) => (
          <Row key={r.month} row={r} />
        ))}
        <Row row={average} total />
      </div>
    </Card>
  );
}
