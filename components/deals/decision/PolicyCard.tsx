import Link from "next/link";
import { Tick } from "@/components/deals/integrity/Tick";
import { computeOffer, percent, recommendedOffer } from "@/lib/offer-math";
import { policyCheck as t } from "@/lib/sample-data/deal-decision";

/** "Policy check" from design/Deal-Decision.html: eight rules, all met. The debt share comes from the shared math. */
export function PolicyCard() {
  const share = percent(computeOffer(recommendedOffer).share);
  return (
    <article aria-labelledby="h-pol" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-pol" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{t.chip}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{t.intro}</span>
      <div className="flex flex-col gap-1.5">
        {t.rules.map((r) => (
          <div key={r.label} className="flex items-center gap-2.5 rounded-tile bg-white/75 px-3 py-2.5">
            <Tick />
            <span className="min-w-0 flex-1 text-[12.5px]">{r.label}</span>
            <b className="whitespace-nowrap text-[12.5px]">{r.value === "share" ? share : r.value}</b>
          </div>
        ))}
      </div>
      <Link href={t.link.href} className="mt-auto text-[12.5px] font-semibold text-teal-deep no-underline">
        {t.link.label}
      </Link>
    </article>
  );
}
