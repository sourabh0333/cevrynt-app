import { Suspense } from "react";
import { RenewalRulesSkeleton } from "@/components/settings/renewals/RenewalRulesSkeleton";
import { RenewalRulesView } from "@/components/settings/renewals/RenewalRulesView";
import { Arrive } from "@/components/ui/Skeleton";
import { renewalRulesView } from "@/lib/data/views/renewals";

export const metadata = { title: "Renewal rules · Settings · Cevrynt" };

/**
 * Settings → Renewal rules, from design/Settings-Renewals.html and its
 * prototype. The server loads the saved rules, every live advance as the
 * rules see it and Pricing's renewal terms through the data layer; the
 * client keeps the sliders and switches.
 */
export default function RenewalRulesPage() {
  return (
    <Suspense fallback={<RenewalRulesSkeleton />}>
      <RenewalRulesData />
    </Suspense>
  );
}

async function RenewalRulesData() {
  const data = await renewalRulesView();
  return (
    <Arrive>
      <RenewalRulesView data={data} />
    </Arrive>
  );
}
