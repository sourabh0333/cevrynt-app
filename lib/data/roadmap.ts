import "server-only";
import type { RoadmapFeature } from "@/lib/data/types";
import { source } from "./source";

/** Every feature on the roadmap, in the order funders see them. */
export async function listRoadmapFeatures(): Promise<RoadmapFeature[]> {
  return source.roadmap.listFeatures();
}

/** How many features are in the works: the sidebar's "10 new" and the page header. */
export async function countRoadmapFeatures(): Promise<number> {
  return (await listRoadmapFeatures()).length;
}
