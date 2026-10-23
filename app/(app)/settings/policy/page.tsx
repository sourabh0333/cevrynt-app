import { Suspense } from "react";
import { PolicyBottom } from "@/components/settings/policy/PolicyBottom";
import { PolicySkeleton } from "@/components/settings/policy/PolicySkeleton";
import { PolicyTop } from "@/components/settings/policy/PolicyTop";
import { Arrive } from "@/components/ui/Skeleton";
import { getPolicy } from "@/lib/data/settings";
import { listTeam } from "@/lib/data/team";

export const metadata = { title: "Policy · Settings · Cevrynt" };

/**
 * Settings → Policy, from design/Settings.html and its prototype. The
 * server loads the live policy (and the team, for who proposed and
 * published) through the data layer; the client part keeps the rule
 * switches and the simulator.
 */
export default function PolicyPage() {
  return (
    <Suspense fallback={<PolicySkeleton />}>
      <PolicyData />
    </Suspense>
  );
}

async function PolicyData() {
  const [policy, team] = await Promise.all([getPolicy(), listTeam()]);
  const names = Object.fromEntries(team.map((m) => [m.id, m.name]));
  return (
    <Arrive>
      <PolicyTop policy={policy} />
      <PolicyBottom policy={policy} names={names} />
    </Arrive>
  );
}
