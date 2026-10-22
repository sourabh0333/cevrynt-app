import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { biggestBalances, ownerGroups } from "@/lib/sample-data/merchants";

type Delay = CSSProperties & { "--delay"?: string };

/** "Biggest balances" from design/Merchants.html: the top three with bars that grow in, and the concentration check. */
export function BiggestBalancesCard() {
  return (
    <Card as="article" aria-labelledby="h-top" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-top" className="m-0 font-heading text-[20px] font-semibold">{biggestBalances.title}</h2>
          <div className="mt-[3px] text-label text-hint">{biggestBalances.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{biggestBalances.chip}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {biggestBalances.rows.map((r, i) => {
          const style: Delay = { width: `${r.percent}%`, "--delay": `${0.1 + i * 0.08}s` };
          return (
            <div key={r.name} className="grid grid-cols-[30px_minmax(0,1fr)_90px_70px] items-center gap-3 rounded-tile bg-tile px-3 py-2.5">
              <b className="font-mono text-label text-hint">{String(i + 1).padStart(2, "0")}</b>
              <span className="min-w-0">
                <b className="block truncate text-body-sm">{r.name}</b>
                <span className="mt-[5px] block h-[5px] rounded-[3px] bg-line">
                  <span className="anim-grow-x block h-[5px] rounded-[3px] bg-teal" style={style} />
                </span>
              </span>
              <b className="text-right font-heading font-semibold tabular-nums tracking-[-0.03em]">{r.balance}</b>
              <span className="text-right text-label text-hint">{r.share}</span>
            </div>
          );
        })}
      </div>
      <span className="text-label text-muted">{biggestBalances.note}</span>
    </Card>
  );
}

const fill = { sand: "text-sand-text", blue: "bg-blue-bg text-blue-text" };
const sandGradient = { background: "linear-gradient(140deg, #E8C9A1, #C99A6B)" };

/** "Same owner, several businesses": the owner groups on the sand card. */
export function OwnerGroupsCard() {
  return (
    <article aria-labelledby="h-own" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <h2 id="h-own" className="m-0 font-heading text-[19px] font-semibold">{ownerGroups.title}</h2>
      <span className="text-[12.5px] text-grey-text">{ownerGroups.intro}</span>
      {ownerGroups.owners.map((o) => (
        <div key={o.name} className="flex items-center gap-2.5 rounded-[16px] bg-white/75 p-3">
          <span className={`grid h-9 w-9 flex-none place-items-center rounded-[12px] text-label-sm font-bold ${fill[o.fill]}`} style={o.fill === "sand" ? sandGradient : undefined}>
            {o.ini}
          </span>
          <span className="min-w-0 flex-1">
            <b className="block text-body-sm">{o.name}</b>
            <span className="block truncate text-[11.5px] text-muted">{o.businesses}</span>
          </span>
          <b className="text-label">{o.count}</b>
        </div>
      ))}
      <Link href={ownerGroups.link.href} className="mt-auto text-[12.5px] font-semibold text-teal-deep no-underline">
        {ownerGroups.link.label}
      </Link>
    </article>
  );
}
