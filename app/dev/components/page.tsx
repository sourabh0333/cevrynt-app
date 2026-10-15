import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

// Internal gallery of shared components. Grows one component per step.
export default function ComponentsPage() {
  return (
    <main className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-5xl rounded-panel border border-line-strong bg-panel p-6 shadow-float">
        <h1 className="font-heading text-page-title font-semibold text-ink">
          Components
        </h1>
        <p className="mt-1 text-body text-muted">
          Shared building blocks. Each one matches the finished pages in
          design/.
        </p>

        <section className="mt-8">
          <h2 className="font-heading text-card-title-lg font-semibold text-ink">
            Card
          </h2>
          <p className="mt-1 text-body-sm text-hint">
            Three variants: grey (default), white, mint. 20px padding, no
            hover.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card variant="grey">
              <span className="text-label-sm font-semibold uppercase tracking-[0.08em] text-hint">
                Grey
              </span>
              <h3 className="font-heading text-card-title-lg font-semibold">
                My queue
              </h3>
              <p className="text-body-sm text-muted">
                The default card on the white panel. Background #F5F3EF, 30px
                radius.
              </p>
              <div className="rounded-tile-lg bg-tile px-4 py-3.5">
                <p className="text-body-sm font-medium">Harbor Street Bakery</p>
                <p className="font-mono text-label text-hint">APP-7H2K4Q</p>
              </div>
            </Card>

            <Card variant="white">
              <span className="text-label-sm font-semibold uppercase tracking-[0.08em] text-hint">
                White
              </span>
              <h3 className="font-heading text-card-title-lg font-semibold">
                Policy check
              </h3>
              <p className="text-body-sm text-muted">
                A white card on the white panel. 24px radius with a 1px
                #ECE8E0 border so it still reads as a box.
              </p>
              <div className="rounded-tile-lg bg-card px-4 py-3.5">
                <p className="text-body-sm font-medium">8 of 8 rules met</p>
                <p className="text-label text-hint">Reviewed at 10:12</p>
              </div>
            </Card>

            <Card variant="mint">
              <span className="text-label-sm font-semibold uppercase tracking-[0.08em] text-teal-deep">
                Mint
              </span>
              <h3 className="font-heading text-card-title-lg font-semibold">
                Next deal
              </h3>
              <p className="text-body-sm text-muted">
                The highlight card. Mint gradient with a 1px #CDE6DE border, 30px
                radius.
              </p>
              <div className="rounded-tile-lg bg-tile px-4 py-3.5">
                <p className="text-body-sm font-medium">$40,000 at 1.32</p>
                <p className="text-label text-hint">6 months, $419/day</p>
              </div>
            </Card>
          </div>

          <p className="mt-3 text-label text-hint">
            Grey and mint shown as on the white panel. Below, the same three on
            the page background, as they appear outside the panel.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-card-title-lg font-semibold text-ink">
            Chip
          </h2>
          <p className="mt-1 text-body-sm text-hint">
            Six colors, two sizes, optional dot. No wrapping, no hover.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card variant="grey">
              <span className="text-label-sm font-semibold uppercase tracking-[0.08em] text-hint">
                Status (md)
              </span>
              <div className="flex flex-wrap gap-2">
                <Chip color="green">Decision ready</Chip>
                <Chip color="amber">Needs docs</Chip>
                <Chip color="red">On hold</Chip>
                <Chip color="blue">In review</Chip>
                <Chip color="purple">Offer out</Chip>
                <Chip color="grey">New</Chip>
              </div>

              <span className="mt-2 text-label-sm font-semibold uppercase tracking-[0.08em] text-hint">
                Risk and severity (sm)
              </span>
              <div className="flex flex-wrap gap-2">
                <Chip size="sm" color="green">
                  Low
                </Chip>
                <Chip size="sm" color="amber">
                  Medium
                </Chip>
                <Chip size="sm" color="red">
                  High
                </Chip>
                <Chip size="sm" color="blue">
                  In review
                </Chip>
                <Chip size="sm" color="purple">
                  Renewal
                </Chip>
                <Chip size="sm" color="grey">
                  Not scored
                </Chip>
              </div>
            </Card>

            <Card variant="grey">
              <span className="text-label-sm font-semibold uppercase tracking-[0.08em] text-hint">
                With dot
              </span>
              <div className="flex flex-wrap gap-2">
                <Chip color="red" dot>
                  Within the hour
                </Chip>
                <Chip color="blue" dot>
                  Later today
                </Chip>
                <Chip color="green" dot>
                  Renewal
                </Chip>
                <Chip color="amber" dot>
                  Review
                </Chip>
                <Chip color="purple" dot>
                  Call
                </Chip>
                <Chip color="grey" dot>
                  This week
                </Chip>
              </div>

              <span className="mt-2 text-label-sm font-semibold uppercase tracking-[0.08em] text-hint">
                Plain, on a tinted card
              </span>
              <div className="rounded-tile-lg bg-red-bg p-3.5">
                <Chip color="red" dot plain>
                  Do this first · Now
                </Chip>
              </div>
              <div className="rounded-tile-lg bg-mint-bg p-3.5">
                <Chip color="green" dot plain>
                  Ready to fund
                </Chip>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="grey">
          <p className="text-body-sm font-medium">Grey on page</p>
        </Card>
        <Card variant="white">
          <p className="text-body-sm font-medium">White on page</p>
        </Card>
        <Card variant="mint">
          <p className="text-body-sm font-medium">Mint on page</p>
        </Card>
      </div>
    </main>
  );
}
