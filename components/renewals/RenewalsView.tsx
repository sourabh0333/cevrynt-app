"use client";

import { useState } from "react";
import { PageActions } from "@/components/shell/PageActions";
import { hero, radar, renewalMerchants, renewalsHeader } from "@/lib/sample-data/renewals";
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
 * The loyalty price and broker points come from Pricing (props).
 */
export function RenewalsView({ loyaltyDiscount, brokerPoints }: { loyaltyDiscount: number; brokerPoints: { newDeal: number; renewal: number } }) {
  const [s, setS] = useState<RenewalState>({ sel: radar.startSelected, amounts: {}, sent: {}, forgive: {} });
  const sentCount = hero.journey.sentBase + renewalMerchants.filter((m) => s.sent[m.ini] && m.status === "ready").length;

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{renewalsHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{renewalsHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <RenewalsHero sentCount={sentCount} />
      <RadarRow
        s={s}
        loyaltyDiscount={loyaltyDiscount}
        onPick={(sel) => setS((x) => ({ ...x, sel }))}
        onAmount={(ini, amount) => setS((x) => ({ ...x, amounts: { ...x.amounts, [ini]: amount } }))}
        onSend={(ini) => setS((x) => ({ ...x, sent: { ...x.sent, [ini]: true } }))}
        onForgive={(ini) => setS((x) => ({ ...x, forgive: { ...x.forgive, [ini]: !x.forgive[ini] } }))}
      />
      <ReadyCards s={s} onPick={(sel) => setS((x) => ({ ...x, sel }))} />
      <section aria-label="Automatic outreach and broker pay" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <OutreachCard />
        <BrokerPayCard points={brokerPoints} />
      </section>
      <BottomPanel loyaltyDiscount={loyaltyDiscount} />
    </>
  );
}
