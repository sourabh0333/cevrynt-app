import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MerchantLinkView } from "@/components/merchant-link/MerchantLinkView";
import { pageTitle } from "@/lib/copy/merchant-link";
import { merchantLinkView, publicFunder } from "@/lib/data/views/public";

/**
 * The public, merchant-facing Merchant Link page (the (public) layout gives
 * it its own scroll area and no app chrome). The token is looked up through
 * the data layer; an unknown or expired token shows the funder-branded
 * "link has expired" page (not-found.tsx).
 */
export async function generateMetadata() {
  const funder = await publicFunder();
  return { title: pageTitle(funder.name) };
}

export default function MerchantLinkPage({ params }: PageProps<"/m/[token]">) {
  return (
    <Suspense fallback={null}>
      <Token params={params} />
    </Suspense>
  );
}

async function Token({ params }: { params: PageProps<"/m/[token]">["params"] }) {
  const { token } = await params;
  const data = await merchantLinkView(token);
  if (!data) notFound();
  return <MerchantLinkView data={data} />;
}
