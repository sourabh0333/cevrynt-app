import Link from "next/link";
import { Tick } from "@/components/deals/integrity/Tick";
import { policyCheck as t, type PolicyRow } from "@/lib/copy/deal-decision";

/**
 * "Policy check" from design/Deal-Decision.html: the policy's rules, worded
 * from its own values, each with this deal's figure. The debt share comes
 * from the shared offer math. A rule not met shows on amber.
 */
export function PolicyCard({ rules, version }: { rules: PolicyRow[]; version: number }) {
  const met = rules.filter((r) => r.met).length;
  return (
    <article aria-labelledby="h-pol" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-pol" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{t.chip(met, rules.length)}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{t.intro(version)}</span>
      <div className="flex flex-col gap-1.5">
        {rules.map((r) => (
          <div key={r.label} className={`flex items-center gap-2.5 rounded-tile ${r.met ? "bg-white/75" : "bg-amber-tint"} px-3 py-2.5`}>
            {r.met ? (
              <Tick />
            ) : (
              <span aria-label={t.notMet} className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-amber text-label font-bold text-white">
                !
              </span>
            )}
            <span className="min-w-0 flex-1 text-[12.5px]">{r.label}</span>
            <b className="whitespace-nowrap text-[12.5px]">{r.value}</b>
          </div>
        ))}
      </div>
      <Link href={t.link.href} className="mt-auto text-[12.5px] font-semibold text-teal-deep no-underline">
        {t.link.label}
      </Link>
    </article>
  );
}
