import "server-only";
import type { NotificationRule, Workspace } from "@/lib/data/types";
import { source } from "./source";

/** The funder's company details, brand, hours, accounts and web addresses. */
export async function getWorkspace(): Promise<Workspace> {
  return source.settings.getWorkspace();
}

/** The team's notification defaults, one per event. */
export async function listNotificationRules(): Promise<NotificationRule[]> {
  return source.settings.listNotificationRules();
}
