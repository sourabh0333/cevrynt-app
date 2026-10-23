import "server-only";
import type { AccessReview, Invite, OutsideAccess, TeamMember } from "@/lib/data/types";
import { source } from "./source";

/** Everyone on the team, in the order Team & roles lists them. */
export async function listTeam(): Promise<TeamMember[]> {
  return source.team.listMembers();
}

/** The signed-in person ("Maya Chen" in the sample); null if they're no longer on the team. */
export async function getCurrentUser(): Promise<TeamMember | null> {
  const [id, team] = await Promise.all([source.team.getCurrentUserId(), listTeam()]);
  return team.find((m) => m.id === id) ?? null;
}

/** Invites sent and not yet accepted. */
export async function listInvites(): Promise<Invite[]> {
  return source.team.listInvites();
}

export async function getAccessReview(): Promise<AccessReview> {
  return source.team.getAccessReview();
}

export async function getOutsideAccess(): Promise<OutsideAccess> {
  return source.team.getOutsideAccess();
}
