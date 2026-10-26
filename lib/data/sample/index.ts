import type { DataSource } from "@/lib/data/types";
import { advances, fundedBook } from "./advances";
import { brokerBook, brokers } from "./brokers";
import { SAMPLE_NOW } from "./clock";
import { harborActivity, harborBusiness, harborCashFlow, harborConditions, harborDecision, harborIntegrity, harborOffer, harborPositions, harborSummary } from "./deal-tabs";
import { deals, queueStats, queueSummary } from "./deals";
import { activityEvents, calendarEvents, stips } from "./desk";
import { fundingDesk, fundingQueue, fundingSummary, pipelineOffers, releases } from "./funding";
import { auditEntries, auditLog } from "./audit";
import { bulkIntake, intakeChannelSettings, intakeSummary, manualDraft, packageIntake } from "./intake";
import { plan } from "./plan";
import { apiKeys, securitySettings, signIns } from "./security";
import { merchantBook, merchantListings, merchants } from "./merchants";
import { policy, pricing } from "./policy";
import { renewalCandidates, renewalSettings, renewalSummary } from "./renewals";
import { reportSnapshots, reportsBook } from "./reports";
import { roadmapFeatures } from "./roadmap";
import { stackingAlerts, stackingSummary } from "./stacking";
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
  funding: {
    async listPipeline() {
      return structuredClone(pipelineOffers);
    },
    async listQueue() {
      return structuredClone(fundingQueue);
    },
    async listReleases() {
      return structuredClone(releases);
    },
    async getDesk() {
      return structuredClone(fundingDesk);
    },
    async getSummary() {
      return structuredClone(fundingSummary);
    },
  },
  advances: {
    async list() {
      return structuredClone(advances);
    },
    async getBook() {
      return structuredClone(fundedBook);
    },
  },
  merchants: {
    async list() {
      return structuredClone(merchants);
    },
    async listListings() {
      return structuredClone(merchantListings);
    },
    async getBook() {
      return structuredClone(merchantBook);
    },
  },
  renewals: {
    async listCandidates() {
      return structuredClone(renewalCandidates);
    },
    async getSettings() {
      return structuredClone(renewalSettings);
    },
    async getSummary() {
      return structuredClone(renewalSummary);
    },
  },
  stacking: {
    async listAlerts() {
      return structuredClone(stackingAlerts);
    },
    async getSummary() {
      return structuredClone(stackingSummary);
    },
  },
  brokers: {
    async list() {
      return structuredClone(brokers);
    },
    async getBook() {
      return structuredClone(brokerBook);
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
    async getIntakeChannels() {
      return structuredClone(intakeChannelSettings);
    },
    async getPlan() {
      return structuredClone(plan);
    },
    async getSecurity() {
      return structuredClone(securitySettings);
    },
    async listSignIns() {
      return structuredClone(signIns);
    },
    async listApiKeys() {
      return structuredClone(apiKeys);
    },
  },
  audit: {
    async listEntries() {
      return structuredClone(auditEntries);
    },
    async getLog() {
      return structuredClone(auditLog);
    },
  },
  desk: {
    async listStips() {
      return structuredClone(stips);
    },
    async listCalendar() {
      return structuredClone(calendarEvents);
    },
    async listActivity() {
      return structuredClone(activityEvents);
    },
  },
  reports: {
    async listSnapshots() {
      return structuredClone(reportSnapshots);
    },
    async getBook() {
      return structuredClone(reportsBook);
    },
  },
};
