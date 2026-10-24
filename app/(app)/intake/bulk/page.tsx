import { Suspense } from "react";
import { BulkSkeleton } from "@/components/intake/IntakeSkeletons";
import { BulkUpload } from "@/components/intake/BulkUpload";
import { Arrive } from "@/components/ui/Skeleton";
import { bulkView } from "@/lib/data/views/intake";

export const metadata = { title: "Bulk folder ZIP · Cevrynt" };

/**
 * Bulk folder ZIP, from design/Intake-Bulk.html. The server loads the
 * uploaded ZIP, one row per folder, and today's earlier batch through the
 * data layer.
 */
export default function BulkPage() {
  return (
    <Suspense fallback={<BulkSkeleton />}>
      <BulkData />
    </Suspense>
  );
}

async function BulkData() {
  const data = await bulkView();
  return (
    <Arrive>
      <BulkUpload data={data} />
    </Arrive>
  );
}
