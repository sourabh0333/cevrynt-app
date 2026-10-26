import Link from "next/link";
import type { CSSProperties } from "react";
import { atRisk, comingUp, readyRules, renewalsSections } from "@/lib/copy/renewals";
import type { RenewalsData } from "@/lib/data/views/renewals";
import { MaybeLink } from "@/components/ui/ComingSoon";

type RingVars = CSSProperties & { "--p"?: string; "--delay"?: string };
const title = "m-0 font-heading text-[17px] font-semibold";

const riskTone = {
  red: { ring: "var(--color-coral-text)", icon: "text-coral-text", chip: "bg-red-bg text-coral-text", bar: "bg-red" },
  amber: { ring: "var(--color-amber-deep)", icon: "text-amber-deep", chip: "bg-amber-bg text-amber-deep", bar: "bg-amber" },
  soft: { ring: "var(--color-amber-deep)", icon: "text-amber-deep", chip: "bg-amber-tint text-amber-deep", bar: "bg-amber-light" },
};

function RiskIcon({ kind }: { kind: "card" | "doc" | "eye" }) {
  const common = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (kind === "card")
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  if (kind === "doc")
    return (
      <svg {...common}>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4M10 13h5M10 17h5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * The bottom panel of design/Renewals.html: one white panel split into
 * three equal columns. Who counts as ready, Might go elsewhere (the
 * value-at-risk bar grows, the risk rings sweep) and Coming up (bars
 * toward the 50% line grow). No hover.
 */
export function BottomPanel({ data }: { data: RenewalsData }) {
  const { rules } = data.settings;
  const risks = atRisk.merchants(data.atRisk);
  const upcoming = comingUp.merchants(data.comingUp, rules.paid);
  return (
    <section
      aria-label={renewalsSections.bottom}
      className="grid grid-cols-3 items-stretch rounded-card-lg border border-line bg-tile p-2 text-ink max-[900px]:grid-cols-1"
    >
      <div className="flex flex-col gap-1 rounded-card bg-card p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            <h2 id="h-rules" className={title}>{readyRules.title}</h2>
            <span className="text-label text-hint">{readyRules.subtitle}</span>
          </div>
          <Link href={readyRules.link.href} className="whitespace-nowrap text-label font-semibold text-teal no-underline">
            {readyRules.link.label}
          </Link>
        </div>
        {readyRules.rules(rules).map((r) => (
          <div key={r.label} className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-line-strong py-2.5">
            <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-teal text-label-sm font-bold text-white">✓</span>
            <span className="text-[12.5px] text-grey-text">{r.label}</span>
            <b className="font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em]">{r.value}</b>
          </div>
        ))}
        <div className="mt-auto flex items-center justify-between gap-2 rounded-tile bg-teal px-3 py-2.5 text-label text-white">
          <span>{readyRules.loyalty.label}</span>
          <b className="text-mint">{readyRules.loyalty.value(data.pricing.loyaltyDiscount)}</b>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-x border-line p-4 max-[900px]:border-x-0 max-[900px]:border-y">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id="h-risk" className={title}>{atRisk.title}</h2>
            <span className="text-label text-hint">{atRisk.subtitle}</span>
          </div>
          <span className="text-right">
            <b className="block font-heading text-[20px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-coral-text">{atRisk.total(data.atRisk)}</b>
            <span className="text-[11.5px] text-hint">{atRisk.totalLabel}</span>
          </span>
        </div>
        <div role="img" aria-label={atRisk.barLabel(data.atRisk)} className="anim-grow-x flex h-2 gap-0.5 overflow-hidden rounded-[4px]" style={{ "--delay": "0.2s" } as RingVars}>
          {risks.map((m) => (
            <span key={m.name} className={riskTone[m.tone].bar} style={{ flex: m.k }} />
          ))}
        </div>
        {risks.map((m, i) => {
          const tone = riskTone[m.tone];
          const ring: RingVars = { "--p": `${m.likelihood}%`, "--delay": `${0.3 + i * 0.1}s`, background: `conic-gradient(${tone.ring} var(--p), var(--color-line-faint) 0)` };
          return (
            <div key={m.name} className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[16px] bg-card p-2.5">
              <span role="img" aria-label={atRisk.likely(m.likelihood)} className="anim-conic grid h-11 w-11 place-items-center rounded-full" style={ring}>
                <span className={`grid h-[34px] w-[34px] place-items-center rounded-full bg-tile ${tone.icon}`}>
                  <RiskIcon kind={m.icon} />
                </span>
              </span>
              <span className="min-w-0">
                <b className="block text-body-sm leading-[1.25]">{m.name}</b>
                <span className="block text-[11.5px] leading-[1.3] text-hint">{m.sign}</span>
                <span className={`mt-[5px] inline-block whitespace-nowrap rounded-pill px-2 py-0.5 text-[10.5px] font-bold ${tone.chip}`}>
                  {m.likelihood}% · {m.when}
                </span>
              </span>
              <b className="self-start font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em]">{m.amount}</b>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-0.5 p-4">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div>
            <h2 id="h-up" className={title}>{comingUp.title}</h2>
            <span className="text-label text-hint">{comingUp.subtitle(rules.paid)}</span>
          </div>
          <b className="font-heading text-[20px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{data.summary.comingUp.count}</b>
        </div>
        {upcoming.map((m, i) => (
          <div key={m.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1 border-b border-line-faint py-[9px]">
            <b className="truncate text-body-sm">{m.name}</b>
            <span className={`whitespace-nowrap text-[11.5px] font-semibold ${m.slow ? "text-amber-deep" : "text-teal-deep"}`}>{m.when}</span>
            <span className="col-span-full h-[5px] rounded-[3px] bg-line">
              <span className={`anim-grow-x block h-[5px] rounded-[3px] ${m.slow ? "bg-amber-stripe" : "bg-teal-soft"}`} style={{ width: `${m.percent}%`, "--delay": `${0.2 + i * 0.08}s` } as RingVars} />
            </span>
          </div>
        ))}
        <MaybeLink href={comingUp.link.href} layout="mt-auto pt-2.5 self-start" className="text-label font-semibold text-teal no-underline">
          {comingUp.link.label(data.summary.comingUp.count)}
        </MaybeLink>
      </div>
    </section>
  );
}
