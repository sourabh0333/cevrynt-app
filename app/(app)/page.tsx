// Temporary home placeholder inside the shell.
// Replaced by Home (design/Main.html) in Step 3.
export default function Home() {
  return (
    <>
      <header className="mb-1.5">
        <h1 className="font-heading text-page-title font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
          Good morning, Maya
        </h1>
        <p className="mt-2.5 text-label font-semibold uppercase tracking-[0.06em] text-ink">
          7 deals in your queue
        </p>
      </header>
      <div className="rounded-card-lg bg-card p-5">
        <p className="text-body-sm text-muted">
          The Home page is built in a later step. The shell around it is
          ready: fixed sidebar on the left, this white panel scrolls on its
          own.
        </p>
      </div>
      <div className="h-[1400px] rounded-card-lg bg-card p-5">
        <p className="text-body-sm text-hint">
          Tall block to prove the panel scrolls while the page and the
          sidebar stay put.
        </p>
      </div>
    </>
  );
}
