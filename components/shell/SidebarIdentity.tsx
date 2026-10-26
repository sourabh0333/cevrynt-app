import { roleNames } from "@/lib/copy/team";
import { workspaceKind } from "@/lib/copy/workspace";
import { getWorkspace } from "@/lib/data/settings";
import { getCurrentUser } from "@/lib/data/team";
import { Icon } from "./icons";
import { fade, profileBox, switcherBox } from "./sidebar-classes";

/*
 * The sidebar's workspace switcher and profile, read from the workspace
 * record and getCurrentUser() through the data layer. Server components:
 * the shell passes them into the client sidebar, each in its own Suspense
 * whose placeholder is the same empty box, so nothing moves when the names
 * arrive. They live in the shell, so a failure here leaves the box empty
 * instead of taking down every page.
 */

export async function WorkspaceSwitcher() {
  const workspace = await getWorkspace().catch(() => null);
  if (!workspace) return <SwitcherPlaceholder />;
  return (
    <button type="button" title={workspace.name} className={switcherBox}>
      <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-teal text-[12px] font-bold text-white">{workspace.initials}</span>
      <span className={`absolute top-1/2 left-[53px] -translate-y-1/2 ${fade}`}>
        <b className="block text-body-sm">{workspace.name}</b>
        <span className="block text-[11.5px] text-muted">{workspaceKind}</span>
      </span>
      <Icon name="chevrons" size={14} strokeWidth={2} className={`absolute top-1/2 right-2.5 -translate-y-1/2 text-icon-soft ${fade}`} />
    </button>
  );
}

export function SwitcherPlaceholder() {
  return <div aria-hidden="true" className={switcherBox} />;
}

export async function Profile() {
  const me = await getCurrentUser().catch(() => null);
  if (!me) return <ProfilePlaceholder />;
  return (
    <div title={me.name} className={profileBox}>
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-[linear-gradient(140deg,#E8C9A1,#C99A6B)] text-[12.5px] font-bold text-sand-text">{me.initials}</span>
      <span className={`absolute top-1/2 left-[50px] translate-y-[1px] ${fade}`}>
        <b className="block text-body-sm">{me.name}</b>
        <span className="block text-label-sm text-muted">{roleNames[me.role]}</span>
      </span>
    </div>
  );
}

export function ProfilePlaceholder() {
  return (
    <div aria-hidden="true" className={profileBox}>
      <span className="h-9 w-9 flex-none" />
    </div>
  );
}
