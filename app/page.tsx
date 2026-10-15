// Temporary starter page. It only proves the tokens and fonts load.
// It is replaced by Home (design/Main.dc.html) in Step 3.
export default function Home() {
  return (
    <main className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md rounded-panel bg-panel p-8 shadow-float">
        <h1 className="font-heading text-page-title font-semibold text-ink">
          Cevrynt
        </h1>
        <p className="mt-2 text-body text-muted">
          Foundation is ready. Tokens and fonts are loaded.
        </p>
        <p className="mt-4 font-mono text-label text-hint">APP-7H2K4Q</p>
        <div className="mt-6 flex gap-2">
          <span className="rounded-pill bg-teal px-4 py-2 text-label-sm font-semibold text-white">
            Teal button
          </span>
          <span className="rounded-pill bg-mint-bg px-4 py-2 text-label-sm font-semibold text-teal-dark">
            Mint chip
          </span>
          <span className="rounded-pill bg-red-bg px-4 py-2 text-label-sm font-semibold text-red-text">
            Risk chip
          </span>
        </div>
      </div>
    </main>
  );
}
