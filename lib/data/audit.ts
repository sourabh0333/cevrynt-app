import "server-only";
import type { AuditEntry, AuditLog } from "@/lib/data/types";
import { source } from "./source";

/** Audit log entries, newest first. */
export async function listAuditEntries(): Promise<AuditEntry[]> {
  return source.audit.listEntries();
}

/** The log as a whole: today's counts, the seal check, the person filter, instant alerts and legal holds. */
export async function getAuditLog(): Promise<AuditLog> {
  return source.audit.getLog();
}
