import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { money, recommendedOffer } from "@/lib/offer-math";
import { decisionRecord as rec, signOff as t } from "@/lib/sample-data/deal-decision";

const timeOf = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** "Who signs off": the approval chain. Maya's chip turns to Signed once the decision is recorded. */
export function WhoSignsOff({ recorded }: { recorded: boolean }) {
  return (
    <article
      aria-labelledby="h-chain"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <h2 id="h-chain" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
      <span className="text-[12.5px] text-muted">{t.intro}</span>
      {t.people.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5 rounded-[16px] bg-teal/7 p-3">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-sand text-label-sm font-bold text-sand-text">{p.initials}</span>
          <span className="flex-1">
            <b className="block text-body-sm">{p.name}</b>
            <span className="text-[11.5px] text-muted">{p.role}</span>
          </span>
          {p.me ? (
            <span className={`rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${recorded ? "bg-mint text-teal-dark" : "bg-amber-light/20 text-amber-deep"}`}>
              {recorded ? t.status.signed : t.status.waiting}
            </span>
          ) : (
            <span className="rounded-pill bg-white/10 px-[9px] py-[3px] text-label-sm font-semibold text-muted">{t.status.notNeeded}</span>
          )}
        </div>
      ))}
      <span className="mt-auto text-[11.5px] text-muted">{t.note(money(recommendedOffer.amount))}</span>
    </article>
  );
}

type RecordProps = { recordedAt: Date | null; label: string; agrees: boolean };

/** "Decision record": Cevrynt's suggestion beside the person's decision, and Export. */
export function DecisionRecord({ recordedAt, label, agrees }: RecordProps) {
  const done = recordedAt !== null;
  return (
    <Card as="article" aria-labelledby="h-rec2" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-rec2" className="m-0 font-heading text-[20px] font-semibold">{rec.title}</h2>
          <div className="mt-[3px] text-label text-hint">{rec.subtitle}</div>
        </div>
        <Link href={rec.link.href} className="text-label font-semibold text-teal no-underline">
          {rec.link.label}
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        <div className="flex flex-col gap-1.5 rounded-tile-lg bg-tile p-4">
          <span className="text-cap font-semibold uppercase text-hint">{rec.suggested.caption}</span>
          <b className="font-heading text-[18px] font-semibold">{rec.suggested.title(money(recommendedOffer.amount))}</b>
          <span className="text-label text-hint">{rec.suggested.meta}</span>
          <span className="text-label text-muted">{rec.suggested.why}</span>
        </div>
        <div
          aria-live="polite"
          className={`flex flex-col gap-1.5 rounded-tile-lg p-4 ${done ? "bg-mint-bg text-teal-dark" : "border-[1.5px] border-dashed border-line-dash-soft"}`}
        >
          <span className={`text-cap font-semibold uppercase ${done ? "text-teal-deep" : "text-hint"}`}>{rec.person.caption}</span>
          <b className="font-heading text-[18px] font-semibold">{done ? label : rec.person.waiting.title}</b>
          <span className="text-label opacity-80">{done ? rec.person.sub(timeOf(recordedAt)) : rec.person.waiting.sub}</span>
          <span className="text-label opacity-85">{done ? (agrees ? rec.person.agrees : rec.person.differs) : rec.person.waiting.why}</span>
        </div>
      </div>
    </Card>
  );
}
