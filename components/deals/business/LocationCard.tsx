import type { CSSProperties } from "react";
import { locationCopy as t } from "@/lib/copy/deal-business";
import type { DealBusiness } from "@/lib/data/types";
import { MaybeLink } from "@/components/ui/ComingSoon";

/** The stylised street map behind the pin. Decorative only. */
function MapArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 170" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="320" height="170" fill="#EFE9DC" />
      <path d="M0 120 C60 108 110 132 170 116 S270 96 320 104 L320 170 L0 170Z" fill="#CFE3EA" />
      <g stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round">
        <path d="M-10 60 L330 40" />
        <path d="M90 -10 L120 180" />
        <path d="M220 -10 L200 180" />
      </g>
      <g stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".9">
        <path d="M-10 92 L330 78" />
        <path d="M160 -10 L165 110" />
      </g>
      <g fill="#E2DACA">
        <rect x="20" y="8" width="56" height="34" rx="6" />
        <rect x="132" y="6" width="70" height="26" rx="6" />
        <rect x="236" y="4" width="70" height="28" rx="6" />
        <rect x="20" y="70" width="58" height="16" rx="4" />
        <rect x="236" y="56" width="74" height="16" rx="4" />
      </g>
    </svg>
  );
}

/**
 * "Location" from design/Deal-Business.html: the sand card with the map,
 * the address pin (pops in once), the three confirmation rows and the
 * street view link. No hover.
 */
export function LocationCard({ address }: { address: DealBusiness["address"] }) {
  const rows = t.rows(address);
  const pinStyle: CSSProperties & { "--delay"?: string } = { "--delay": "0.3s" };
  return (
    <article aria-labelledby="h-loc" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-loc" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{t.chip(address)}</span>
      </div>
      <div role="img" aria-label={t.mapLabel(address.street)} className="relative h-[170px] overflow-hidden rounded-tile-lg bg-[#F1ECE1]">
        <MapArt />
        <span className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-full">
          <span className="anim-pop flex origin-bottom flex-col items-center" style={pinStyle}>
            <span className="whitespace-nowrap rounded-pill bg-teal px-2.5 py-1.5 text-label-sm font-semibold text-white">{address.street}</span>
            <span className="h-2.5 w-0.5 bg-ink" />
            <span className="box-border h-3.5 w-3.5 rounded-full border-[3px] border-white bg-teal shadow-[0_0_0_6px_rgba(14,107,92,.25)]" />
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {rows.map((r) => (
          <span key={r.label} className="flex justify-between gap-2 rounded-[12px] bg-white/70 px-3 py-[9px]">
            <span>{r.label}</span>
            <b className={r.good ? "text-teal-deep" : ""}>{r.value}</b>
          </span>
        ))}
      </div>
      <MaybeLink href={t.link.href} layout="mt-auto self-start" className="text-[12.5px] font-semibold text-teal-deep no-underline">
        {t.link.label}
      </MaybeLink>
    </article>
  );
}
