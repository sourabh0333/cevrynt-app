"use server";

import type { IsoDateTime } from "@/lib/data/types";
import { getNow } from "../clock";

/**
 * The app's clock, for what the browser records ("Recorded by Maya Chen at
 * 10:45"): the same getNow every page reads, so the sample clock in sample
 * mode and real time with the backend. A Server Action, so client
 * components can ask for it at the moment something is recorded.
 */
export async function currentTime(): Promise<IsoDateTime> {
  return getNow();
}
