import { Button } from "@/components/ui/Button";
import type { ComingSoon } from "@/lib/copy/home";

/** The mint "Coming soon" card from design/Main.html, linking to What's coming. */
export function ComingSoonCard({ data }: { data: ComingSoon }) {
  return (
    <article
      aria-labelledby="h-soon"
      className="flex flex-col gap-3 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink"
    >
      <span className="inline-flex items-center gap-[7px] self-start rounded-pill border border-white/20 bg-teal/7 px-[11px] py-1.5 text-[11.5px] font-semibold">
        {data.tag}
      </span>
      <h2 id="h-soon" className="m-0 font-heading text-[24px] leading-[1.15] font-semibold">
        {data.title}
      </h2>
      <p className="m-0 text-body-sm text-muted">{data.text}</p>
      <Button href={data.href} glow className="mt-auto self-start">
        See what&apos;s coming
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Button>
    </article>
  );
}
