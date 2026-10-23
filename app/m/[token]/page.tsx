import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MerchantLinkView } from "@/components/merchant-link/MerchantLinkView";
import { DEMO_TOKEN, funder } from "@/lib/sample-data/merchant-link";

/**
 * The public, merchant-facing Merchant Link page. It sits outside the
 * (app) route group, so there is no sidebar and no Ask Cevrynt. Only the
 * sample token "demo" exists for now; real links come with the API.
 */
export const metadata = { title: `${funder.name} · Finish your application` };

export function generateStaticParams() {
  return [{ token: DEMO_TOKEN }];
}

export default function MerchantLinkPage({ params }: PageProps<"/m/[token]">) {
  return (
    // The root <body> doesn't scroll (the app panel does), so this page scrolls itself.
    <div className="scrollbar-thin h-dvh overflow-y-auto bg-page">
      <Suspense fallback={null}>
        <Token params={params} />
      </Suspense>
    </div>
  );
}

async function Token({ params }: { params: PageProps<"/m/[token]">["params"] }) {
  const { token } = await params;
  if (token !== DEMO_TOKEN) notFound();
  return <MerchantLinkView />;
}
