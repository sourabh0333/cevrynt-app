import { Suspense } from "react";
import { PackageSkeleton } from "@/components/intake/IntakeSkeletons";
import { PackageUpload } from "@/components/intake/PackageUpload";
import { Arrive } from "@/components/ui/Skeleton";
import { packageView } from "@/lib/data/views/intake";

export const metadata = { title: "Single package upload · Cevrynt" };

/**
 * Single package upload, from design/Intake-Single.html. The server loads
 * the uploaded package and what was read from it through the data layer.
 */
export default function PackagePage() {
  return (
    <Suspense fallback={<PackageSkeleton />}>
      <PackageData />
    </Suspense>
  );
}

async function PackageData() {
  const data = await packageView();
  return (
    <Arrive>
      <PackageUpload data={data} />
    </Arrive>
  );
}
