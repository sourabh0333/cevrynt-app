import type { DataSource } from "@/lib/data/types";
import { roadmapFeatures } from "./roadmap";

/**
 * The sample data source: today's sample records, returned as if they came
 * from the backend. Copies are returned so callers can never change the
 * shared records.
 */
export const sampleSource: DataSource = {
  roadmap: {
    async listFeatures() {
      return roadmapFeatures.map((f) => ({ ...f, outcomes: [...f.outcomes] }));
    },
  },
};
