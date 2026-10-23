/**
 * Public, merchant-facing pages (Merchant Link, the application form).
 * Outside the (app) group: no sidebar, no Ask Cevrynt. The root <body>
 * doesn't scroll (the app's content panel does), so these pages scroll here.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="scrollbar-thin h-dvh overflow-y-auto bg-page">{children}</div>;
}
