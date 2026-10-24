"use client";

import { useState } from "react";
import { PageActions } from "@/components/shell/PageActions";
import { renewalMerchant, renewalsHeader, renewalsSections } from "@/lib/copy/renewals";
import type { RenewalsData } from "@/lib/data/views/renewals";
import { BottomPanel } from "./BottomPanel";
import { BrokerPayCard, OutreachCard } from "./OutreachRow";
import { RadarRow, type RenewalState } from "./RadarRow";
import { ReadyCards } from "./ReadyCards";
import { RenewalsHero } from "./RenewalsHero";

/**
 * Renewals from design/Renewals.html: the header, the hero, the radar
 * beside the offer panel, the ready cards, outreach beside broker pay,
 * and the bottom panel. The selection, amounts, sent offers and forgiven
 * fees live here so the hero, radar, cards and panel all follow them.
 * The candidates, the pipeline and the saved rules come from the data
 * layer (props); the loyalty price and broker points from Pricing.
 */
export function RenewalsView({ data }: { data: RenewalsData }) {
  const merchants = data.candidates.map(renewalMerchant);
  const { loyaltyDiscount, brokerPoints } = data.pricing;
  const [s, setS] = useState<RenewalState>({ sel: merchants[0]?.id ?? "", amounts: {}, sent: {}, forgive: {} });
  const sentCount = data.summary.offersOut + merchants.filter((m) => s.sent[m.id] && m.status === "ready").length;

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{renewalsHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{renewalsHeader.line(data.readyCount)}</span>
        </div>
        <PageActions />
      </header>
      <RenewalsHero data={data} sentCount={sentCount} />
      <RadarRow
        merchants={merchants}
        renewalLine={data.settings.rules.paid}
        s={s}
        loyaltyDiscount={loyaltyDiscount}
        onPick={(sel) => setS((x) => ({ ...x, sel }))}
        onAmount={(id, amount) => setS((x) => ({ ...x, amounts: { ...x.amounts, [id]: amount } }))}
        onSend={(id) => setS((x) => ({ ...x, sent: { ...x.sent, [id]: true } }))}
        onForgive={(id) => setS((x) => ({ ...x, forgive: { ...x.forgive, [id]: !x.forgive[id] } }))}
      />
      <ReadyCards merchants={merchants} s={s} onPick={(sel) => setS((x) => ({ ...x, sel }))} />
      <section aria-label={renewalsSections.outreach} className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <OutreachCard data={data} />
        <BrokerPayCard points={brokerPoints} summary={data.summary} />
      </section>
      <BottomPanel data={data} />
    </>
  );
}
