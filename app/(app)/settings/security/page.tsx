import { Suspense } from "react";
import { SecuritySkeleton } from "@/components/settings/security/SecuritySkeleton";
import { SecurityView } from "@/components/settings/security/SecurityView";
import { Arrive } from "@/components/ui/Skeleton";
import { securityView } from "@/lib/data/views/settings";

export const metadata = { title: "Security · Settings · Cevrynt" };

/**
 * Settings → Security, from design/Settings-Security.html and its
 * prototype. The server loads the protections, today's sign-ins, the
 * team's 2-step login, the access review and the API keys through the data
 * layer; the client keeps the switches, the score and support access.
 */
export default function SecurityPage() {
  return (
    <Suspense fallback={<SecuritySkeleton />}>
      <SecurityData />
    </Suspense>
  );
}

async function SecurityData() {
  const data = await securityView();
  return (
    <Arrive>
      <SecurityView data={data} />
    </Arrive>
  );
}
