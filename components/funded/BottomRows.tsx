import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { payingOffCopy as payingOff, recoveryCopy as recovery, returnsCopy as returns } from "@/lib/copy/funded";
import type { FundedBook } from "@/lib/data/types";

type Delay = CSSProperties & { "--delay"?: string };

const stageTone = {
  red: { box: "border border-red-light/30 bg-red-light/12", n: "text-coral-text", count: "" },
  plain: { box: "bg-teal/7", n: "text-muted", count: "" },
  mint: { box: "border border-mint/30 bg-mint/14", n: "text-teal-deep", count: "text-teal-deep" },
  dashed: { box: "border border-dashed border-white/20 bg-teal/7", n: "text-muted", count: "" },
};

/** "Getting deals back on track": the five recovery stages, staggering in, and the payment-plan note. */
export function RecoveryCard({ book }: { book: FundedBook }) {
  return (
    <article
      aria-labelledby="h-recov"
      className="col-span-2 box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-[22px] text-ink max-[980px]:col-span-1"
    >
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-recov" className="m-0 font-heading text-[20px] font-semibold">{recovery.title}</h2>
          <span className="text-label text-muted">{recovery.subtitle}</span>
        </div>
        <Link href={recovery.link.href} className="text-label font-semibold text-teal-deep no-underline">
          {recovery.link.label}
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-2 max-[760px]:grid-cols-3 max-[480px]:grid-cols-2">
        {recovery.stages(book).map((s, i) => {
          const t = stageTone[s.tone];
          const style: Delay = { "--delay": `${0.1 + i * 0.08}s` };
          return (
            <div key={s.n} className={`anim-rise rounded-[18px] p-3.5 ${t.box}`} style={style}>
              <span className={`font-mono text-[10.5px] ${t.n}`}>{s.n}</span>
              <b className="mt-1 block text-body-sm">{s.label}</b>
              <b className={`block font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em] ${t.count}`}>{s.count}</b>
              <span className="text-[11.5px] text-muted">{s.note}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2.5 rounded-[16px] bg-teal/7 px-3.5 py-3 text-[12.5px] text-muted">
        <span className="h-2 w-2 flex-none rounded-full bg-mint" />
        {recovery.note}
      </div>
    </article>
  );
}

/** "Returns this year": collected per dollar, loss rate, write-offs and clawbacks. */
export function ReturnsCard({ book }: { book: FundedBook }) {
  return (
    <Card as="article" aria-labelledby="h-perf" className="gap-2.5">
      <div>
        <h2 id="h-perf" className="m-0 font-heading text-[19px] font-semibold">{returns.title}</h2>
        <span className="text-label text-hint">{returns.subtitle}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {returns.tiles(book).map((t) => (
          <span key={t.label} className={`rounded-[16px] p-3 ${t.good ? "bg-mint-light" : "bg-tile"}`}>
            <span className={`text-label-sm ${t.good ? "text-teal-deep" : "text-hint"}`}>{t.label}</span>
            <b className={`block font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em] ${t.good ? "text-teal-dark" : ""}`}>{t.value}</b>
          </span>
        ))}
      </div>
      <span className="mt-auto text-[11.5px] text-hint">{returns.note}</span>
    </Card>
  );
}

/** "Paying off in the next 30 days": the cream strip with the merchant chips and the Renewals button. */
export function PayingOffStrip({ book }: { book: FundedBook }) {
  return (
    <section aria-labelledby="h-soon" className="flex flex-wrap items-center gap-[18px] rounded-card-lg bg-cream p-[22px] text-ink">
      <div className="flex-[1_1_240px]">
        <h2 id="h-soon" className="m-0 font-heading text-[20px] font-semibold">{payingOff.title}</h2>
        <span className="text-[12.5px] text-amber-mute">{payingOff.text(book)}</span>
      </div>
      <div className="flex flex-[2_1_380px] flex-wrap gap-1.5">
        {payingOff.chips(book).map((m) => (
          <span key={m.name} className="inline-flex items-center gap-2 rounded-pill bg-white/80 py-2 pr-3 pl-2 text-[12.5px]">
            <span
              className="grid h-[26px] w-[26px] place-items-center rounded-[9px] text-[10px] font-bold text-white"
              style={{ background: `linear-gradient(140deg, ${m.g[0]}, ${m.g[1]})` }}
            >
              {m.ini}
            </span>
            {m.name}
            {m.when ? <b>{m.when}</b> : null}
          </span>
        ))}
      </div>
      <Button href={payingOff.cta.href} className="h-11">
        {payingOff.cta.label}
      </Button>
    </section>
  );
}
