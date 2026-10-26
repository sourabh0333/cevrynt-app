import { Suspense, type ReactNode } from "react";
import { FunderProvider } from "@/components/public/FunderContext";
import { publicFunder } from "@/lib/data/views/public";

/**
 * Public, merchant-facing pages (Merchant Link, the application form).
 * Outside the (app) group: no sidebar, no Ask Cevrynt. The root <body>
 * doesn't scroll (the app's content panel does), so these pages scroll here.
 * The funder they're branded as is the workspace record, loaded once here
 * so the "not found" and error pages carry it too.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="scrollbar-thin h-dvh overflow-y-auto bg-page">
      <Suspense fallback={null}>
        <Funder>{children}</Funder>
      </Suspense>
    </div>
  );
}

async function Funder({ children }: { children: ReactNode }) {
  const funder = await publicFunder().catch(() => null);
  return <FunderProvider funder={funder}>{children}</FunderProvider>;
}
