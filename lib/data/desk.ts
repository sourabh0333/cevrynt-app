import "server-only";
import type { ActivityEvent, CalendarEvent, Stip } from "@/lib/data/types";
import { source } from "./source";

/** Stips open across the team's deals. */
export async function listStips(): Promise<Stip[]> {
  return source.desk.listStips();
}

/** This week's team calendar. */
export async function listCalendar(): Promise<CalendarEvent[]> {
  return source.desk.listCalendar();
}

/** Recent things that happened, for the activity feed. */
export async function listActivity(): Promise<ActivityEvent[]> {
  return source.desk.listActivity();
}
