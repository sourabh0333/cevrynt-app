import { Card } from "@/components/ui/Card";
import type { RenewalSummary } from "@/lib/data/types";
import type { RenewalsData } from "@/lib/data/views/renewals";
import { brokerPay, outreach } from "@/lib/copy/renewals";

/** "Automatic outreach": the four trigger steps and this month's results. */
export function OutreachCard({ data }: { data: RenewalsData }) {
  const { outreach: steps, rules } = data.settings;
  return (
    <Card as="article" aria-labelledby="h-auto" padding={false} className="col-span-2 gap-3.5 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-auto" className="m-0 font-heading text-[20px] font-semibold">{outreach.title}</h2>
          <div className="mt-[3px] text-label text-hint">{outreach.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{outreach.chip(steps)}</span>
      </div>
      <div className="grid grid-cols-4 gap-2.5 max-[760px]:grid-cols-2">
        {outreach.steps(steps, rules).map((st) => (
          <div key={st.at} className={`flex flex-col gap-2 rounded-tile-lg p-3.5 ${st.key ? "bg-mint-light" : "bg-tile"}`}>
            <span className="flex items-center justify-between">
              <b className={`font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em] ${st.key ? "text-teal-deep" : ""}`}>{st.at}</b>
              <span className="rounded-pill bg-card px-2 py-0.5 text-[10.5px] font-semibold">{st.via}</span>
            </span>
            <b className="text-body-sm">{st.title}</b>
            <span className="text-[11.5px] text-hint">{st.note}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {outreach.results(data.summary, data.renewedThisMonth).map((r) => (
          <span key={r.label} className={`rounded-[16px] p-3 ${r.good ? "bg-mint-light" : "bg-tile"}`}>
            <span className={`text-[11.5px] ${r.good ? "text-teal-deep" : "text-hint"}`}>{r.label}</span>
            <b className={`block font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em] ${r.good ? "text-teal-dark" : ""}`}>{r.value}</b>
          </span>
        ))}
      </div>
    </Card>
  );
}

/** "Broker pay on renewals": the three point rates and the commission saved. */
export function BrokerPayCard({ points, summary }: { points: { newDeal: number; renewal: number }; summary: RenewalSummary }) {
  return (
    <article aria-labelledby="h-comm" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-cream p-5 text-ink">
      <div>
        <h2 id="h-comm" className="m-0 font-heading text-[19px] font-semibold">{brokerPay.title}</h2>
        <span className="text-label text-amber-mute">{brokerPay.subtitle}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {brokerPay.rows(points).map((r) => (
          <span key={r.label} className="flex items-center justify-between rounded-[16px] bg-white/75 p-3 text-[12.5px]">
            <span>{r.label}</span>
            <b className="font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{r.value}</b>
          </span>
        ))}
      </div>
      <span className="mt-auto rounded-tile bg-teal px-3 py-2.5 text-label text-white">
        {brokerPay.saved.before}
        <b className="text-mint">{brokerPay.saved.amount(summary)}</b>
        {brokerPay.saved.after}
      </span>
    </article>
  );
}
