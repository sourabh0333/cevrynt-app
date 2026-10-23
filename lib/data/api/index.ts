import type { DataSource } from "@/lib/data/types";

/**
 * The real backend source. Not connected yet: each area will call our API
 * here, with the same signatures as the sample source. Until then every
 * call fails loudly instead of returning made-up data.
 */
const notConnected = (area: string) => async (): Promise<never> => {
  throw new Error(`The ${area} data isn't connected to the backend yet. Set CEVRYNT_DATA_SOURCE=sample.`);
};

export const apiSource: DataSource = {
  roadmap: { listFeatures: notConnected("roadmap") },
};
