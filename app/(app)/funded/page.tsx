import { Suspense } from "react";
import { FundedSkeleton } from "@/components/funded/FundedSkeleton";
import { FundedView } from "@/components/funded/FundedView";
import { Arrive } from "@/components/ui/Skeleton";
import { fundedView } from "@/lib/data/views/funding";

export const metadata = { title: "Funded deals · Cevrynt" };

/**
 * Funded deals, from design/Funded.html and its prototype. The server
 * loads the advances and the book through the data layer; the client keeps
 * the book's filter, search and the selected deal.
 */
export default function FundedPage() {
  return (
    <Suspense fallback={<FundedSkeleton />}>
      <FundedData />
    </Suspense>
  );
}

async function FundedData() {
  const data = await fundedView();
  return (
    <Arrive>
      <FundedView data={data} />
    </Arrive>
  );
}
