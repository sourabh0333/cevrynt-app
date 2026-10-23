import type { DataSource } from "@/lib/data/types";
import { SAMPLE_NOW } from "./clock";
import { roadmapFeatures } from "./roadmap";
import { accessReview, outsideAccess, teamInvites, teamMembers } from "./team";
import { notificationRules, workspace } from "./workspace";

/**
 * The sample data source: today's sample records, returned as if they came
 * from the backend. Copies are returned so callers can never change the
 * shared records.
 */
export const sampleSource: DataSource = {
  clock: {
    async now() {
      return SAMPLE_NOW;
    },
  },
  roadmap: {
    async listFeatures() {
      return roadmapFeatures.map((f) => ({ ...f, outcomes: [...f.outcomes] }));
    },
  },
  team: {
    async listMembers() {
      return teamMembers.map((m) => ({ ...m }));
    },
    async listInvites() {
      return teamInvites.map((i) => ({ ...i }));
    },
    async getAccessReview() {
      return { ...accessReview };
    },
    async getOutsideAccess() {
      return { ...outsideAccess };
    },
  },
  settings: {
    async getWorkspace() {
      return structuredClone(workspace);
    },
    async listNotificationRules() {
      return notificationRules.map((r) => ({ ...r, channels: { ...r.channels } }));
    },
  },
};
