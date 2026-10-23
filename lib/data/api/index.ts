import type { DataSource } from "@/lib/data/types";

/**
 * The real backend source. Not connected yet: each area will call our API
 * here, with the same signatures as the sample source. Until then every
 * call fails loudly instead of returning made-up data. The clock is the one
 * thing that is already real.
 */
const notConnected = (area: string) => async (): Promise<never> => {
  throw new Error(`The ${area} data isn't connected to the backend yet. Set CEVRYNT_DATA_SOURCE=sample.`);
};

export const apiSource: DataSource = {
  clock: {
    async now() {
      return new Date().toISOString();
    },
  },
  roadmap: { listFeatures: notConnected("roadmap") },
  deals: {
    list: notConnected("deals"),
    get: notConnected("deals"),
    getQueueSummary: notConnected("deals"),
    getQueueStats: notConnected("deals"),
  },
  team: {
    getCurrentUserId: notConnected("team"),
    listMembers: notConnected("team"),
    listInvites: notConnected("team"),
    getAccessReview: notConnected("team"),
    getOutsideAccess: notConnected("team"),
  },
  settings: {
    getWorkspace: notConnected("workspace"),
    listNotificationRules: notConnected("workspace"),
    getPolicy: notConnected("policy"),
    getPricing: notConnected("pricing"),
  },
};
