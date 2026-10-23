import "server-only";
import type { AccessReview, Invite, OutsideAccess, TeamMember } from "@/lib/data/types";
import { source } from "./source";

/** Everyone on the team, in the order Team & roles lists them. */
export async function listTeam(): Promise<TeamMember[]> {
  return source.team.listMembers();
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
