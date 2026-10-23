import { Suspense } from "react";
import { TeamSkeleton } from "@/components/settings/team/TeamSkeleton";
import { TeamView } from "@/components/settings/team/TeamView";
import { Arrive } from "@/components/ui/Skeleton";
import { getNow } from "@/lib/data/clock";
import { getAccessReview, getOutsideAccess, listInvites, listTeam } from "@/lib/data/team";
import { policyLimits } from "@/lib/sample-data/policy";

export const metadata = { title: "Team & roles · Settings · Cevrynt" };

/**
 * Settings → Team & roles, from design/Settings-Team.html and its prototype.
 * The server loads the team through the data layer; the client view keeps
 * the Working / Away switches and the role highlight.
 */
export default function TeamPage() {
  return (
    <Suspense fallback={<TeamSkeleton />}>
      <TeamData />
    </Suspense>
  );
}

async function TeamData() {
  const [members, invites, accessReview, outsideAccess, now] = await Promise.all([
    listTeam(),
    listInvites(),
    getAccessReview(),
    getOutsideAccess(),
    getNow(),
  ]);
  // The approval lines still come from the Policy sample until Policy moves
  // to the data layer (DATA-PLAN.md, step 4).
  const { seniorAbove, seniorLimit, maxAmount } = policyLimits;
  return (
    <Arrive>
      <TeamView
        members={members}
        invites={invites}
        accessReview={accessReview}
        outsideAccess={outsideAccess}
        limits={{ seniorAbove, seniorLimit, maxAmount }}
        now={now}
      />
    </Arrive>
  );
}
