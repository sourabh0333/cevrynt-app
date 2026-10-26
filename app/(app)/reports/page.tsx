import { Suspense } from "react";
import { ReportsSkeleton } from "@/components/reports/ReportsSkeleton";
import { ReportsView } from "@/components/reports/ReportsView";
import { Arrive } from "@/components/ui/Skeleton";
import { reportsView } from "@/lib/data/views/reports";

export const metadata = { title: "Reports · Cevrynt" };

/**
 * Reports, from design/Reports.html and its prototype. The server loads
 * the period snapshots, the monthly funding and renewals, the funded book,
 * the policy, Pricing's broker points, the plan's cost per deal and the
 * team through the data layer; the client keeps the chosen period.
 */
export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsData />
    </Suspense>
  );
}

async function ReportsData() {
  const data = await reportsView();
  return (
    <Arrive>
      <ReportsView data={data} />
    </Arrive>
  );
}
