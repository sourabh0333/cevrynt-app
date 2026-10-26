import { Suspense } from "react";
import { AuditSkeleton } from "@/components/settings/audit/AuditSkeleton";
import { AuditView } from "@/components/settings/audit/AuditView";
import { Arrive } from "@/components/ui/Skeleton";
import { auditView } from "@/lib/data/views/settings";

export const metadata = { title: "Audit log · Settings · Cevrynt" };

/**
 * Settings → Audit log, from design/Settings-Audit.html and its prototype.
 * The server loads the entries, each joined to the release, policy draft,
 * sign-in, invite or deal it is about through the data layer; the client
 * keeps the filters, the selected entry and the alert switches.
 */
export default function AuditPage() {
  return (
    <Suspense fallback={<AuditSkeleton />}>
      <AuditData />
    </Suspense>
  );
}

async function AuditData() {
  const data = await auditView();
  return (
    <Arrive>
      <AuditView data={data} />
    </Arrive>
  );
}
