import "server-only";
import type { IsoDateTime } from "@/lib/data/types";
import { source } from "./source";

/** "Now" for relative wording ("12 days late"). Fixed in the sample world. */
export async function getNow(): Promise<IsoDateTime> {
  return source.clock.now();
}
