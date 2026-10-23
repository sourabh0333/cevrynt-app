import { Suspense } from "react";
import { WorkspaceSkeleton } from "@/components/settings/workspace/WorkspaceSkeleton";
import { WorkspaceView } from "@/components/settings/workspace/WorkspaceView";
import { Arrive } from "@/components/ui/Skeleton";
import { getWorkspace, listNotificationRules } from "@/lib/data/settings";
import { listTeam } from "@/lib/data/team";

export const metadata = { title: "Workspace · Settings · Cevrynt" };

/**
 * Settings → Workspace, from design/Settings-Workspace.html and its
 * prototype. The server loads the workspace, its notification defaults and
 * the team (for the contract signer) through the data layer; the client
 * view keeps the brand picker and the notification switches.
 */
export default function WorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <WorkspaceData />
    </Suspense>
  );
}

async function WorkspaceData() {
  const [workspace, notificationRules, team] = await Promise.all([getWorkspace(), listNotificationRules(), listTeam()]);
  const signer = team.find((m) => m.id === workspace.signerId) ?? null;
  return (
    <Arrive>
      <WorkspaceView workspace={workspace} notificationRules={notificationRules} signer={signer} />
    </Arrive>
  );
}
