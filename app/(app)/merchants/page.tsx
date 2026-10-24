import { Suspense } from "react";
import { MerchantsSkeleton } from "@/components/merchants/MerchantsSkeleton";
import { MerchantsView } from "@/components/merchants/MerchantsView";
import { Arrive } from "@/components/ui/Skeleton";
import { merchantsView } from "@/lib/data/views/merchants";

export const metadata = { title: "Merchants · Cevrynt" };

/**
 * Merchants, from design/Merchants.html and its prototype. The server
 * loads the directory, each merchant's advance, the funded book and who is
 * ready to renew through the data layer; the client keeps the filter,
 * search and the selected merchant.
 */
export default function MerchantsPage() {
  return (
    <Suspense fallback={<MerchantsSkeleton />}>
      <MerchantsData />
    </Suspense>
  );
}

async function MerchantsData() {
  const data = await merchantsView();
  return (
    <Arrive>
      <MerchantsView data={data} />
    </Arrive>
  );
}
