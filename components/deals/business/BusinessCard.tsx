import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { business } from "@/lib/sample-data/deal-business";

/**
 * "The business" from design/Deal-Business.html: the registry status chip,
 * the teal name tile with years in business, and the nine detail tiles
 * (policy, EIN and ownership results on light mint). No hover.
 */
export function BusinessCard() {
  return (
    <Card as="article" aria-labelledby="h-reg" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="h-reg" className="m-0 font-heading text-[20px] font-semibold">{business.title}</h2>
          <div className="mt-[3px] text-label text-hint">
            {business.source}
            <Link href={business.registryLink.href} className="font-semibold text-teal no-underline">
              {business.registryLink.label}
            </Link>
          </div>
        </div>
        <span className="inline-flex items-center gap-[7px] rounded-pill bg-mint-bg px-3 py-1.5 text-label font-semibold text-teal-dark">
          <span className="h-[7px] w-[7px] rounded-full bg-teal" />
          {business.chip}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-[22px] bg-teal p-4 text-white">
        <span
          className="grid h-14 w-14 flex-none place-items-center rounded-[18px] font-heading text-[19px] font-bold text-teal-dark"
          style={{ background: "linear-gradient(140deg, #3FA58C, #8FD9C3)" }}
        >
          {business.initials}
        </span>
        <span className="min-w-0 flex-[1_1_200px]">
          <b className="block font-heading text-[21px] font-semibold">{business.name}</b>
          <span className="text-[12.5px] text-cap-on-teal">{business.entity}</span>
        </span>
        <span className="text-right">
          <span className="block text-[11.5px] text-cap-on-teal">{business.ageLabel}</span>
          <b className="font-heading text-[26px] font-semibold tabular-nums tracking-[-0.03em]">{business.age}</b>
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        {business.tiles.map((t) => (
          <span key={t.label} className={`rounded-[16px] px-3.5 py-3 ${t.policy ? "bg-mint-light" : "bg-tile"}`}>
            <span className={`text-[11.5px] ${t.policy ? "text-teal-deep" : "text-hint"}`}>{t.label}</span>
            <b className={`mt-0.5 block text-body ${t.policy ? "text-teal-dark" : ""}`}>
              {t.value}
              {t.code ? <span className="font-mono text-label-sm font-normal text-hint"> {t.code}</span> : null}
            </b>
          </span>
        ))}
      </div>
    </Card>
  );
}
