import type { DataSource } from "@/lib/data/types";
import { SAMPLE_NOW } from "./clock";
import { harborActivity, harborBusiness, harborCashFlow, harborConditions, harborDecision, harborIntegrity, harborOffer, harborPositions, harborSummary } from "./deal-tabs";
import { deals, queueStats, queueSummary } from "./deals";
import { bulkIntake, intakeSummary, manualDraft, packageIntake } from "./intake";
import { policy, pricing } from "./policy";
import { roadmapFeatures } from "./roadmap";
import { taskBoard, tasks } from "./tasks";
import { accessReview, CURRENT_USER_ID, outsideAccess, teamInvites, teamMembers } from "./team";
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
  deals: {
    async list() {
      return structuredClone(deals);
    },
    async get(id) {
      const deal = deals.find((d) => d.id === id);
      return deal ? structuredClone(deal) : null;
    },
    async getQueueSummary() {
      return structuredClone(queueSummary);
    },
    async getQueueStats() {
      return structuredClone(queueStats);
    },
    // Only Harbor Street is designed; every other known deal shows its tabs (see deal-tabs.ts).
    async getSummary(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborSummary) : null;
    },
    async getCashFlow(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborCashFlow) : null;
    },
    async getPositions(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborPositions) : null;
    },
    async getIntegrity(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborIntegrity) : null;
    },
    async getBusiness(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborBusiness) : null;
    },
    async getConditions(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborConditions) : null;
    },
    async getOffer(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborOffer) : null;
    },
    async getDecision(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborDecision) : null;
    },
    async getActivity(id) {
      return deals.some((d) => d.id === id) ? structuredClone(harborActivity) : null;
    },
  },
  tasks: {
    async list() {
      return structuredClone(tasks);
    },
    async getBoard() {
      return structuredClone(taskBoard);
    },
  },
  intake: {
    async getSummary() {
      return structuredClone(intakeSummary);
    },
    async getManualDraft() {
      return structuredClone(manualDraft);
    },
    async getPackage() {
      return structuredClone(packageIntake);
    },
    async getBulk() {
      return structuredClone(bulkIntake);
    },
  },
  team: {
    async getCurrentUserId() {
      return CURRENT_USER_ID;
    },
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
    async getPolicy() {
      return structuredClone(policy);
    },
    async getPricing() {
      return structuredClone(pricing);
    },
  },
};
