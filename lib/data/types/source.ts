import type { RoadmapFeature } from "./roadmap";

/**
 * What a data source must provide. The sample source (lib/data/sample) and,
 * later, the API source (lib/data/api) both implement this, so pages never
 * change when an area moves to the real backend. Areas are added here one
 * at a time as pages are converted (DATA-PLAN.md, section 4).
 */
export interface DataSource {
  roadmap: {
    listFeatures(): Promise<RoadmapFeature[]>;
  };
}
