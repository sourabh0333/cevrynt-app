import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { comingNote, comingHeader } from "@/lib/copy/coming";
import { ruleParts, ruleSentence } from "@/lib/copy/policy";
import { adjustments, limits as pricingLimits, sizing } from "@/lib/copy/pricing";
import { accessReview as reviewCopy, ladder, peopleCard } from "@/lib/copy/team";
import { workingHours } from "@/lib/copy/workspace";
import { getNow } from "@/lib/data/clock";
import { listRoadmapFeatures } from "@/lib/data/roadmap";
import { getPolicy, getPricing, getWorkspace } from "@/lib/data/settings";
import { getAccessReview, listInvites, listTeam } from "@/lib/data/team";
import { daysBetween } from "@/lib/format";
import { earlyPayoffTiers, LOYALTY_DISCOUNT, offerPolicyFrom, ridgelinePolicy } from "@/lib/offer-math";
import { currentPolicy, simInputFrom } from "@/lib/policy-sim";
import { readiness } from "@/lib/renewal-rules";
import { estimateUpTo } from "@/lib/sample-data/apply";
import { auditEntryView, auditHeader } from "@/lib/copy/audit";
import { builder, sendOffer } from "@/lib/copy/deal-offer";
import { costPerDeal, dealsUsed, planHeader, usage, usageByChannel } from "@/lib/copy/plan";
import { channelPerformance, apiPreview } from "@/lib/copy/intake-channels";
import { apiKeys as apiKeysCopy, signIns, toFix } from "@/lib/copy/security";
import { auditView, intakeChannelsView, planView, securityView } from "@/lib/data/views/settings";
import { getIntakeSummary } from "@/lib/data/intake";
import { atRisk as atRiskCopy, brokerPay, comingUp as comingUpCopy, hero, readyRules, renewalMerchant, renewalsHeader } from "@/lib/copy/renewals";
import { approval, reachOut } from "@/lib/copy/renewal-rules";
import { biggestBalances, byIndustry, merchantStats, merchantView, merchantsHeader, repeatMerchants, segments } from "@/lib/copy/merchants";
import { activeCount } from "@/lib/copy/funded";
import { merchantsView } from "@/lib/data/views/merchants";
import { renewalRulesView, renewalsView } from "@/lib/data/views/renewals";
import { navSections } from "@/lib/nav";
import { declines, fundedMonthly, funnel, kpis, team as teamRows, unitEconomics } from "@/lib/copy/reports";
import { reportsView } from "@/lib/data/views/reports";
import { portfolio } from "@/lib/data/views/portfolio";
import { getQueueSummary } from "@/lib/data/deals";
import { listTasks } from "@/lib/data/tasks";
import { getCurrentUser } from "@/lib/data/team";
import { deadlineLabel, dealHeader, metricLabels, receivedLabel, recommendedLabel } from "@/lib/copy/deal";
import { submissionsHeader, workloadCard } from "@/lib/copy/submissions";
import { getDeal, listDeals } from "@/lib/data/deals";
import { dealFrameView, submissionsView } from "@/lib/data/views/deals";
import { checkDot, dealTabs, tabMark, tabStates } from "@/lib/copy/deal";
import { duration, messagesCopy, paceCopy, timelineCopy } from "@/lib/copy/deal-activity";
import { decisionCard, memo as memoCopy, policyCheck, policyRows, signOff } from "@/lib/copy/deal-decision";
import { builder as offerBuilder, disclosure, earlyPayoffCard, factorOptions, merchantPays, offerHistory } from "@/lib/copy/deal-offer";
import { businessCopy, nameInitials, ownerCopy, publicRecordsCopy, wholeYears } from "@/lib/copy/deal-business";
import { roomToPayCopy } from "@/lib/copy/deal-cash-flow";
import { boardCopy, checkSet, composerCopy, conditionsCheck, finalChecksCopy } from "@/lib/copy/deal-conditions";
import { evidenceCopy, patternCopy } from "@/lib/copy/deal-integrity";
import { glanceCopy } from "@/lib/copy/deal-positions";
import { keyNumbersCopy, scoreCardCopy } from "@/lib/copy/deal-summary";
import { activityTabView, businessTabView, conditionsTabView, dealTabsView, decisionTabView, integrityTabView, offerTabView } from "@/lib/data/views/deal-tabs";
import { statusOf } from "@/lib/deal-conditions";
import { debtToday, existingDaily, monthAverages, ofLimit, revenueTotals, roomToPay, scenarios } from "@/lib/deal-figures";
import { money, moneyK, moneyK1, moneyShort, percent } from "@/lib/format";
import { computeOffer, formatOffer, harborFigures, recommendedOffer } from "@/lib/offer-math";
import { channelLabel, fitLine, folderRow, bulkCopy, packageCopy, packageFitRows, todayByChannel } from "@/lib/copy/intake";
import { findDuplicate, requiredDocs, runChecks } from "@/lib/copy/intake-manual";
import { dueLabel, loadSummary, taskWhen, teamSummary, toTaskView, waitingView } from "@/lib/copy/tasks";
import { bulkView, intakeHubView, manualLeadView, packageView } from "@/lib/data/views/intake";
import { tasksView } from "@/lib/data/views/tasks";
import { advanceView, fundedHeader, fundedStats, todayCopy, todayTotals, reconciliationCopy, returnedCopy, forecastCopy } from "@/lib/copy/funded";
import { commissionsCopy, expiringToday, moneySentCopy, offerChip, offerStats, offersHeader, queueCopy } from "@/lib/copy/offers";
import { fundedView, offersView } from "@/lib/data/views/funding";
import { homeCards } from "@/lib/copy/home";
import { homeView } from "@/lib/data/views/home";
import { newToday, seenLabel, stageLine, stackingHeader, summaryCopy, kindFinding } from "@/lib/copy/stacking";
import { appetite, brokerSummary, brokerView, commissionOf, onWatchCount, payout } from "@/lib/copy/brokers";
import { stackingView } from "@/lib/data/views/stacking";
import { brokersView } from "@/lib/data/views/brokers";
import { listStackingAlerts } from "@/lib/data/stacking";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/*
 * Today's cross-page facts (DATA-PLAN.md, step 0). Several pages show the
 * same number; this test pins each one so converting a page to the data
 * layer can't quietly change it. Records already behind the data layer are
 * read through it (the roadmap); the rest are read from today's sample
 * files until their page is converted, then this test switches to the
 * data-layer getter for them.
 */

describe("What's coming", () => {
  it("has 10 features: 3 building now, 5 up next, 2 later, 341 votes", async () => {
    const f = await listRoadmapFeatures();
    assert.equal(f.length, 10);
    assert.deepEqual(["now", "next", "later"].map((l) => f.filter((x) => x.lane === l).length), [3, 5, 2]);
    assert.equal(f.reduce((s, x) => s + x.votes, 0), 341);
  });

  it("the sidebar note and the page header count the same list", async () => {
    const n = (await listRoadmapFeatures()).length;
    assert.equal(comingNote(n), "10 new");
    assert.equal(comingHeader.line(n), "10 features in the works · shaped by funders like you");
  });
});

describe("Renewals", () => {
  it("the saved rules, run over every live advance, make exactly 9 merchants ready", async () => {
    const r = await renewalRulesView();
    const { pool, ready } = readiness(r.merchants, r.settings.rules, r.settings.rules);
    assert.deepEqual([pool.length, ready.length], [13, 9]);
    assert.deepEqual(ready.map((m) => m.name), [
      "Harborview Bistro", "Coastal Dental Group", "Pine Ridge Vet Clinic", "Lighthouse Coffee Co", "Oakview Deli",
      "Northgate Fitness", "Bluebird Bakery", "Maple Ridge Florist", "Summit Pet Supply",
    ]);
  });

  it("Merchants, Renewals and the sidebar all quote that same 9", async () => {
    const [m, rn] = await Promise.all([merchantsView(), renewalsView()]);
    assert.deepEqual([m.readyCount, rn.readyCount], [9, 9]);
    assert.equal(renewalsHeader.line(rn.readyCount), "9 merchants ready · offer before they finish paying");
    assert.equal(hero.text(rn.readyCount), "9 merchants are ready. Renewing now keeps them before another funder does.");
    assert.deepEqual(hero.journey.steps(rn.summary, rn.readyCount).map((s) => `${s.count} ${s.label}`), [
      "12 Coming up", "9 Ready · $402K", "sent Offer sent", "2 Accepted · $130K", "14 Renewed · $812K",
    ]);
    assert.equal(merchantStats(m).find((s) => s.label === "Ready to renew")?.value, "9");
    assert.equal(segments({ book: m.book, active: activeCount(m.funded), readyCount: m.readyCount }).find((s) => s.key === "renew")?.count, 9);
    assert.equal(repeatMerchants.cta.label(m.readyCount), "Open Renewals · 9 ready");
    // The sidebar badge and Home's key number count the same ready merchants; the nav keeps no copy of its own.
    assert.equal((await portfolio()).readyIds.length, rn.readyCount);
    assert.equal(navSections.flatMap((s) => s.items).find((i) => i.key === "renewals")?.badge, undefined);
    assert.equal(homeCards(await homeView()).keyNumbers.renewals.value, String(rn.readyCount));
  });

  it("the radar's statuses follow the saved rules; offers out and accepted come from the candidates", async () => {
    const rn = await renewalsView();
    assert.deepEqual(rn.candidates.map((c) => [renewalMerchant(c).name, renewalMerchant(c).status]), [
      ["Harborview Bistro", "ready"], ["Pine Ridge Vet Clinic", "ready"], ["Coastal Dental Group", "accepted"], ["Lighthouse Coffee Co", "ready"],
      ["Oakview Deli", "sent"], ["Northgate Fitness", "ready"], ["Bluebird Bakery", "ready"], ["Seaside Yoga Studio", "soon"], ["Kestrel Plumbing", "soon"],
    ]);
    assert.equal(atRiskCopy.total(rn.atRisk), "$150K");
    assert.equal(atRiskCopy.barLabel(rn.atRisk), "Value at risk: Pine Ridge 70K, Harborview 55K, Lighthouse 25K");
    assert.deepEqual(comingUpCopy.merchants(rn.comingUp, rn.settings.rules.paid).map((c) => [c.name, c.when, c.percent]), [
      ["Seaside Yoga Studio", "Oct 21", 90], ["Maple St Barbers", "Oct 28", 84], ["Bayside Hardware", "Nov 4", 78], ["Kestrel Plumbing", "Paying slowly", 96],
    ]);
    assert.deepEqual(hero.points(rn.summary), [[4, 62], [62, 54], [120, 48], [178, 36], [236, 28], [296, 12]]);
  });

  it("Renewal rules quotes its saved settings", async () => {
    const r = await renewalRulesView();
    assert.equal(approval.auto.note(6, 9), "About 6 of today’s 9 would go straight to an offer");
    assert.equal(r.settings.autoApprove.upTo, 50000);
    assert.deepEqual(approval.limits.rows(r.settings.limits).map((l) => l.value), ["7 days", "90+ days", "Review after 3", "At least 30%"]);
    assert.equal(reachOut.trackLabel(r.settings.outreach), "Outreach at 40, 50, 65 and 90 percent repaid");
  });
});

describe("Deals by channel and cost per deal", () => {
  it("287 deals this month, split 132 / 98 / 39 / 18: Intake's counts, read by Intake channels and Plan & usage", async () => {
    const [{ month }, ic, p] = await Promise.all([getIntakeSummary(), intakeChannelsView(), planView()]);
    assert.equal(dealsUsed(month), 287);
    assert.deepEqual(usageByChannel(p.month).map((c) => c.deals), [132, 98, 39, 18]);
    assert.deepEqual(channelPerformance.rows(ic.month).map((r) => [r.channel, r.deals, r.funded, r.low]), [
      ["Single package", 132, 36, false],
      ["Bulk ZIP", 98, 28, true],
      ["Manual lead", 39, 40, false],
      ["Merchant Link", 18, 33, false],
    ]);
  });

  it("$5.20 a deal, worked out from the plan price and the deals used, the same on Plan & usage and Reports", async () => {
    const p = await planView();
    const used = dealsUsed(p.month);
    assert.equal(costPerDeal(p.plan, used), "$5.20");
    assert.match(planHeader(p.plan, used).text, /works out to about \$5\.20 a deal$/);
    assert.equal(unitEconomics(await reportsView()).facts.find((f) => f.label === "Cevrynt cost per deal")?.value, costPerDeal(p.plan, used));
  });
});

describe("Team", () => {
  it("underwriter workloads are 7 / 9 / 6 / 3 on Submissions and Team & roles", async () => {
    const team = await listTeam();
    const byIni = (ini: string) => team.find((m) => m.initials === ini)?.openDeals;
    assert.deepEqual(["MC", "AK", "JR", "PS"].map(byIni), [7, 9, 6, 3]);
    const { workload, mine } = await submissionsView();
    assert.deepEqual(workload.map((p) => [p.initials, p.open, Math.round((p.open / p.capacity) * 100), p.overdue]), [["MC", 7, 70, 0], ["AK", 9, 90, 1], ["JR", 6, 60, 0], ["PS", 3, 30, 0]]);
    assert.equal(workloadCard.subtitle(workload[0].capacity), "Open deals per underwriter, out of a daily capacity of 10");
    // "Mine · 7" on Submissions is Maya's own workload
    assert.equal(mine, 7);
  });

  it("only Leo has no 2-step login, on Team & roles and Security", async () => {
    assert.deepEqual((await listTeam()).filter((m) => !m.mfa).map((m) => m.name), ["Leo Park"]);
    const s = await securityView();
    assert.ok(toFix(s.noMfa, s.accessReview, s.now).some((f) => f.title === "Leo Park has no 2-step login"));
    // Leo's sign-in reads "No 2-step" from his team record
    assert.equal(signIns.rows(s.signIns).find((r) => r.person === "Leo Park")?.result, "nomfa");
  });

  it("7 people and 1 invite: the People card, Plan & usage seats and the Audit log agree", async () => {
    const [team, invites, p, a] = await Promise.all([listTeam(), listInvites(), planView(), auditView()]);
    assert.equal(peopleCard.subtitle(team.length, invites.length), "7 people · 1 invite waiting");
    const u = usage(p.plan, dealsUsed(p.month), p.seats, p.now);
    assert.deepEqual([u.seats.used, u.seats.of, u.seats.hint], [7, 10, "1 invite pending"]);
    assert.equal(invites[0].name, "Kim Tran");
    const invite = a.rows.map(auditEntryView).find((e) => e.what.startsWith("Invited"))!;
    assert.deepEqual([invite.what, invite.object, invite.actor.name], ["Invited Kim Tran", "Underwriter, up to $45K", "Nina Ortiz"]);
  });

  it("the access review is 12 days late, on Team & roles and Security", async () => {
    const [review, now] = await Promise.all([getAccessReview(), getNow()]);
    assert.equal(reviewCopy.chip(daysBetween(review.dueAt, now)), "12 days late");
    const s = await securityView();
    assert.ok(toFix(s.noMfa, s.accessReview, s.now).some((f) => f.title === "Access review is 12 days late"));
  });

  it("one failed sign-in, the same record on Security and the Audit log", async () => {
    const [s, a] = await Promise.all([securityView(), auditView()]);
    const blocked = signIns.rows(s.signIns).filter((r) => r.result === "blocked");
    assert.equal(blocked.length, 1);
    assert.equal(auditHeader.stats(a).find((x) => x.label === "Failed sign-ins")?.value, String(blocked.length));
    const entry = a.rows.map(auditEntryView).find((e) => e.category === "access")!;
    assert.deepEqual([entry.time, entry.what, entry.where, entry.actor.key], [blocked[0].time, "Blocked sign-in to Ari Kaplan’s account", blocked[0].where, "?"]);
    assert.equal(signIns.note(s.signIns), "The blocked attempt used Ari Kaplan's email with a wrong code. Ari has been told and asked to change his password.");
  });

  it("one live API key, the same on Security and Intake channels", async () => {
    const [s, ic] = await Promise.all([securityView(), intakeChannelsView()]);
    assert.deepEqual(apiKeysCopy.rows(s.apiKeys, s.now).map((r) => r.value), ["1", "7 months"]);
    const key = apiPreview.key(ic.apiKey, ic.now);
    assert.deepEqual([key.value, key.hint], ["ck_live_••••••••3f9a", "Created Mar 3 · last used today"]);
  });

  it("the policy draft in the Audit log is the one on Policy, by the people on Team", async () => {
    const [a, policy] = await Promise.all([auditView(), getPolicy()]);
    const e = a.rows.map(auditEntryView).find((x) => x.category === "policy")!;
    assert.deepEqual([e.time, e.what, e.object, e.actor.name, e.note], [
      "10:20", `Proposed policy version ${policy.draft!.version}`, "Debt share 65% → 70%", "Maya Chen", "Waiting for Priya Shah to approve. Not live yet.",
    ]);
    const s = a.rows.map(auditEntryView).find((x) => x.actor.key === "C")!;
    assert.deepEqual([s.what, s.object, s.note], ["Suggested approve $40,000", "Harbor Street Bakery LLC", "Score 88, policy v3, all 8 rules met. A person makes the final decision."]);
  });
});

describe("Policy limits", () => {
  it("offers run $10K to $150K; seniors approve over $45K and alone up to $100K", async () => {
    const { limits } = await getPolicy();
    assert.deepEqual(limits, { minAmount: 10000, seniorAbove: 45000, seniorLimit: 100000, maxAmount: 150000 });
  });

  it("the Offer tab checks the policy's 65% debt limit and $45K approval line", async () => {
    const policy = await getPolicy();
    const offer = offerPolicyFrom(policy);
    assert.equal(offer.maxShare, 0.65);
    assert.equal(offer.approvalLimit, policy.limits.seniorAbove);
    // the offer math's sample default is the same record, so its tests run on what the page shows
    assert.deepEqual(ridgelinePolicy, offer);
    assert.equal(builder.rules.debtShare.note(offer.maxShare), "Limit 65% of revenue");
    assert.equal(builder.rules.approval.note(offer.approvalLimit), "You can approve up to $45K");
    assert.equal(sendOffer.approval.senior(offer.approvalLimit, "Priya Shah"), "Above $45K, so Priya Shah (senior) approves before it is sent.");
  });

  it("the Policy rules print the same limits", async () => {
    const policy = await getPolicy();
    const sim = simInputFrom(policy);
    assert.match(ruleSentence(ruleParts.amount(policy), sim), /between \$10K and \$150K/);
    assert.match(ruleSentence(ruleParts.senior(policy), sim), /over \$45K/);
    assert.equal(ruleSentence(ruleParts.debt(policy), sim), "All debt payments under 65% of revenue");
  });

  it("the simulator starts from the live policy: 2 positions, 65%, $15K", async () => {
    const sim = simInputFrom(await getPolicy());
    assert.deepEqual(sim, { maxPos: 2, debt: 65, minRev: 15 });
    assert.deepEqual(currentPolicy, sim);
  });

  it("Team & roles and Pricing quote the same lines", async () => {
    const policy = await getPolicy();
    const team = await listTeam();
    assert.deepEqual(ladder.steps(policy.limits).map((s) => s.range), ["Up to $45K", "$45K – $100K", "$100K – $150K", "Over $150K"]);
    assert.equal(team.find((m) => m.role === "senior")?.approvalLimit, policy.limits.seniorLimit);
    assert.equal(sizing.note(policy), "Still capped by the policy's $10K to $150K range and the 65% debt limit.");
  });

  it("the application form's estimate never goes above the largest offer", async () => {
    const { limits } = await getPolicy();
    assert.equal(estimateUpTo(400000, limits.maxAmount), 150000);
    assert.equal(estimateUpTo(40000, limits.maxAmount), 40000);
  });
});

describe("Pricing", () => {
  it("one loyalty price, −0.04: Pricing, Renewals and the renewal math", async () => {
    const pricing = await getPricing();
    assert.equal(pricing.loyaltyDiscount, 0.04);
    assert.equal(LOYALTY_DISCOUNT, pricing.loyaltyDiscount);
    assert.equal(adjustments.rows(pricing)[0].delta, -0.04);
    assert.equal(readyRules.loyalty.value(pricing.loyaltyDiscount), "−0.04 factor");
  });

  it("one early payoff table, 1.20 / 1.24 / 1.28: Pricing and the Offer tab", async () => {
    const { earlyPayoff } = await getPricing();
    assert.deepEqual(earlyPayoff.map((t) => [t.days, t.factor]), [[30, 1.2], [60, 1.24], [90, 1.28]]);
    assert.deepEqual(earlyPayoffTiers, earlyPayoff);
  });

  it("broker points 8 / 5: Pricing's cap and the Renewals broker pay", async () => {
    const pricing = await getPricing();
    assert.equal(pricingLimits.rows(pricing).find((r) => r.label === "Broker commission cap")?.value, "8 / 5 pts");
    assert.deepEqual(brokerPay.rows(pricing.brokerPoints).map((r) => r.value), ["8 pts", "5 pts", "0 pts"]);
  });

  it("the factor grid: 1.32 for scores 80 – 89 at 6 months, the recommended offer's factor", async () => {
    const { grid, terms } = await getPricing();
    const band = grid.find((b) => b.minScore === 80)!;
    assert.equal(band.factors[terms.indexOf(6)], 1.32);
  });
});

describe("Decision target", () => {
  it("4 working hours: a new deal on Submissions starts with 4h left, and Workspace says the same", async () => {
    const ws = await getWorkspace();
    assert.equal(ws.decisionTargetHours, 4);
    const fresh = (await listDeals()).filter((d) => d.deadline.kind === "left" && d.deadline.minutes === ws.decisionTargetHours * 60);
    assert.deepEqual(fresh.map((d) => [d.status, deadlineLabel(d.deadline)]), [["new", "4h left"]]);
    assert.equal(workingHours.rows(ws).find((r) => r.label === "Decision target")?.value, "4 working hours");
  });
});

describe("Deal tabs: Summary, Cash flow, Positions", () => {
  const harbor = async () => (await dealTabsView("APP-7H2K4Q"))!;

  it("the offer math's Harbor Street figures are worked out from its own records", async () => {
    const d = await harbor();
    assert.deepEqual(d.figures, { revenue: 61400, existingMonthly: 6185, existingBalance: 9400, commission: 0.08, cardMonthly: 28200 });
    assert.deepEqual(harborFigures, d.figures);
    assert.deepEqual(d.recommended, recommendedOffer);
  });

  it("every 65% on the three tabs is the policy's debt limit", async () => {
    const d = await harbor();
    const max = d.policy.maxDebtShare;
    assert.equal(max, 0.65);
    assert.equal(keyNumbersCopy.debt.note(max), "of revenue · max 65%");
    assert.equal(glanceCopy.today.max(max), "Policy max 65%");
    assert.equal(roomToPayCopy.note.after(max), ". Your policy allows up to 65%.");
    const today = debtToday(d.cashFlow);
    assert.deepEqual([keyNumbersCopy.debt.value(today.share), ofLimit(today.share, max)], ["9.8%", 15]);
  });

  it("the score is measured against the policy's weights and approval line", async () => {
    const d = await harbor();
    const max = Object.fromEntries(d.policy.scoreWeights.map((w) => [w.part, w.points]));
    assert.deepEqual(d.summary.score.parts.map((p) => `${p.points}/${max[p.part]}`), ["24/25", "18/20", "16/20", "15/15", "15/20"]);
    assert.equal(scoreCardCopy.summary(d.summary.score.total, d.policy.scoreBands.approvalFrom, d.summary.score.holdsBack), "18 above your approval line of 70. Integrity holds it back.");
  });

  it("room to pay and the payoff comparison come from the offer math", async () => {
    const d = await harbor();
    const offer = computeOffer(d.recommended, d.figures, d.offerPolicy);
    const room = roomToPay(d.cashFlow, existingDaily(d.positions), offer.daily);
    assert.deepEqual(room.parts.map((p) => [money(p.amount), p.share]), [["$285", 10.1], ["$419", 14.8], ["$2,126", 75.1]]);
    const { keep, pay } = scenarios(d.recommended, d.figures, d.offerPolicy);
    assert.deepEqual([money(keep.net), money(existingDaily(d.positions) + keep.daily), percent(keep.share), ofLimit(keep.share, 0.65)], ["$40,000", "$704", "25%", 38]);
    assert.deepEqual([money(pay.net), money(pay.daily), percent(pay.share), ofLimit(pay.share, 0.65)], ["$30,600", "$419", "15%", 23]);
    assert.equal(moneyK(d.figures.existingMonthly + keep.perMonth), "$15.3K");
  });

  it("the month table and totals read as the design shows them", async () => {
    const d = await harbor();
    const a = monthAverages(d.cashFlow);
    assert.deepEqual([a.deposits, a.trueRevenue, a.withdrawals, a.debtPayments, a.avgBalance, a.lowestBalance].map(moneyK), ["$67.5K", "$61.4K", "$64.1K", "$6.1K", "$9.8K", "$1.2K"]);
    const t = revenueTotals(d.cashFlow);
    assert.deepEqual([moneyK1(t.deposited), moneyK1(t.trueRevenue), percent(t.counted)], ["$269.8K", "$245.6K", "91%"]);
  });

  it("the tab bar's dots and Conditions count are the deal's own checks", async () => {
    const frame = (await dealFrameView("APP-7H2K4Q"))!;
    const checks = checkSet(frame.deal.checks, frame.conditions);
    const states = tabStates(checks, frame.progress);
    const marks = Object.fromEntries(dealTabs.map((t) => [t.key, states[t.key] ? tabMark(states[t.key]!) : {}]));
    assert.deepEqual(
      [marks["cash-flow"], marks.positions, marks.integrity, marks.business, marks.conditions, marks.summary],
      [{ dot: "teal" }, { dot: "teal" }, { dot: "amber" }, { dot: "teal" }, { count: 2 }, {}],
    );
    // Nothing sent, decided or unread yet on the sample deal, so Offer, Decision and Activity show nothing, as in the design.
    assert.deepEqual([marks.offer, marks.decision, marks.activity], [{}, {}, {}]);
    const later = tabStates(checks, { offerSent: true, decided: true, unreadMessages: 2 });
    assert.deepEqual([tabMark(later.offer!), tabMark(later.decision!), tabMark(later.activity!)], [{ dot: "teal" }, { dot: "teal" }, { count: 2 }]);
    assert.equal(checkDot({ state: "warn" }), "amber");
  });

  it("an unknown deal has no tab data", async () => {
    assert.equal(await dealTabsView("APP-NOPE"), null);
    assert.equal(await integrityTabView("APP-NOPE"), null);
    assert.equal(await businessTabView("APP-NOPE"), null);
    assert.equal(await conditionsTabView("APP-NOPE"), null);
  });
});

describe("Deal tabs: Integrity, Business & owners, Conditions", () => {
  it("the Conditions count follows the conditions: waiting ones only, not booked, done or waived", async () => {
    const d = (await conditionsTabView("APP-7H2K4Q"))!;
    const items = d.conditions.items;
    assert.deepEqual(conditionsCheck(items), { state: "open", count: 2, note: "Landlord letter, signed contract." });
    assert.deepEqual(conditionsCheck(items, { landlord: true }), { state: "open", count: 1, note: "Signed contract." });
    assert.deepEqual(conditionsCheck(items, { landlord: true }, { contract: "Signed in person" }).state, "ok");
    // The funding call is booked, so it counts as met only once marked done.
    assert.deepEqual(items.filter((it) => statusOf(it) === "booked").map((it) => it.title), ["Funding call"]);
    // The Summary's card shows the same check the tab bar counts.
    const tabs = (await dealTabsView("APP-7H2K4Q"))!;
    assert.deepEqual(checkSet(tabs.checks, tabs.conditions).conditions, conditionsCheck(items));
  });

  it("the Conditions runway and board read as the design shows them", async () => {
    const d = (await conditionsTabView("APP-7H2K4Q"))!;
    assert.equal(boardCopy.subtitle(d.amount), "Required by your policy for a $40K deal");
    assert.equal(boardCopy.waivedNote(d.senior), "Waived items need a senior underwriter to approve before funding. Priya Shah has been asked.");
    const [landlord, contract, call] = d.conditions.items;
    assert.deepEqual([boardCopy.meta(landlord), boardCopy.meta(contract), boardCopy.meta(call)], [["Due", "Wed, Oct 14"], ["Sent", "After the offer"], ["Booked", "Thursday 10:00"]]);
    assert.equal(finalChecksCopy.last(d.conditions.lastFullCheckAt, daysBetween(d.conditions.lastFullCheckAt, d.now) === 0), "Last full check: today 09:59");
  });

  it("the request message is written from the deal's own facts", async () => {
    const d = (await conditionsTabView("APP-7H2K4Q"))!;
    const facts = {
      dealName: d.merchantName,
      dealId: d.id,
      brokerCompany: d.brokerName ?? "",
      parties: d.conditions.parties,
      ask: d.conditions.items[0],
      street: d.street,
      me: d.me.name,
      funder: d.funder,
    };
    assert.equal(
      composerCopy.message("broker", facts),
      "Hi Dana,\n\nHarbor Street Bakery (APP-7H2K4Q) looks good so far. To fund, we still need a landlord letter for 418 Commercial St confirming the lease is current and rent is paid.\n\nCould you send it by Wednesday, Oct 14?\n\nThanks,\nMaya",
    );
    assert.ok(composerCopy.message("merchant", facts).endsWith("Maya, Ridgeline Capital"));
    assert.deepEqual(composerCopy.recipients(facts).map((r) => r.to), ["Dana Ruiz, Apex Funding Partners", "Elena Brooks, through Merchant Link"]);
  });

  it("Integrity: the ring is out of the policy's integrity weight; evidence reads as the statement prints it", async () => {
    const d = (await integrityTabView("APP-7H2K4Q"))!;
    const policy = await getPolicy();
    assert.deepEqual(d.score, { points: 16, outOf: policy.scoreWeights.find((w) => w.part === "integrity")!.points });
    assert.equal(d.score.outOf, 20);
    const [transfer, , lowest] = d.integrity.evidence;
    assert.equal(evidenceCopy.page(transfer, d.pages[transfer.month]), "Aug 2026 · p. 3 of 7");
    assert.deepEqual(evidenceCopy.line(transfer.lines[3]), { date: "08/14", amount: "-285.00", balance: "19,983.40" });
    assert.deepEqual([evidenceCopy.impact(transfer.impact.amount), evidenceCopy.impact(lowest.impact.amount)], ["−$12,000", "$1,208"]);
    const rows = patternCopy.rows(d.integrity.patterns);
    assert.deepEqual([rows[0].result, rows.filter((r) => r.status === "clear").length, patternCopy.jumpLink(d.relatedTransfer!)], ["3%", 5, "See the $12,000 transfer"]);
  });

  it("Business: the industry is allowed by the policy, and the tiles read as the design shows them", async () => {
    const d = (await businessTabView("APP-7H2K4Q"))!;
    assert.equal(d.industryAllowed, true);
    const policy = await getPolicy();
    assert.ok(!policy.restrictedIndustries.includes(d.business.industry.label));
    const tiles = businessCopy.tiles(d.business, d.industryAllowed).map((t) => t.value);
    assert.deepEqual(tiles, ["April 12, 2016", "Elena Brooks", "May 2026, on time", "Retail bakery", "Industry allowed", "Active to Jun 2027", "IRS name matches", "Harbor Street", "None since 2016"]);
    assert.equal(businessCopy.tiles(d.business, false)[4].value, "Industry restricted");
    assert.deepEqual([nameInitials(d.business.registry.legalName), businessCopy.age(wholeYears(d.business.registry.formedAt, d.now))], ["HB", "10 yrs"]);
    assert.equal(publicRecordsCopy.chip(d.business.publicRecords), "Clean");
    assert.equal(ownerCopy.related.text(d.business.related!), "The source of the $12,000 August transfer. Active since 2021, no open deals with you.");
  });
});

describe("Deals", () => {
  it("Submissions: 28 open, 2 past their deadline, 12 on this page", async () => {
    const { deals, summary } = await submissionsView();
    assert.equal(submissionsHeader.line(summary), "28 open deals · 2 past their deadline");
    assert.equal(deals.length, 12);
    assert.equal(Object.values(summary.byStatus).reduce((a, b) => a + b, 0), summary.open);
  });

  it("every deal link in the app opens a real deal", async () => {
    const dir = join(process.cwd(), "lib/sample-data");
    const ids = new Set(readdirSync(dir).flatMap((f) => [...readFileSync(join(dir, f), "utf8").matchAll(/\/deals\/(APP-[A-Z0-9]+)/g)].map((m) => m[1])));
    for (const d of await listDeals()) ids.add(d.id);
    for (const id of ids) assert.ok(await getDeal(id), `no deal ${id}`);
    assert.equal(await getDeal("APP-NOPE"), null);
  });

  it("the queue rows read as the design shows them", async () => {
    const { deals, now } = await submissionsView();
    const row = (id: string) => {
      const d = deals.find((x) => x.id === id)!;
      return [receivedLabel(d, now), recommendedLabel(d), deadlineLabel(d.deadline), metricLabels(d).revenue];
    };
    assert.deepEqual(row("APP-7H2K4Q"), ["09:40, uploaded", "Rec. $40K", "1h 10m left", "$61.4K/mo"]);
    assert.deepEqual(row("APP-RN4D2C"), ["yesterday, renewal", "Renewal · rec. $80K", "2h 05m left", "$118K/mo"]);
    assert.deepEqual(row("APP-0SP4PD"), ["yesterday, bulk ZIP", "Not set", "15m overdue", "$74.0K/mo"]);
    assert.deepEqual(row("APP-6RB3LO"), ["10:42 by upload", "Analysing", "3h 55m left", "Running"]);
    assert.deepEqual(row("APP-1TS5PC"), ["Fri, uploaded", "Offered $110K", "Expires Thu", "$186K/mo"]);
    assert.deepEqual(row("APP-7CK2CF"), ["09:20, manual", "Waiting on docs", "3h 50m left", "Pending"]);
  });

  it("the deal header: Harbor Street's full design figures, the queue's for the rest", async () => {
    const harbor = (await dealFrameView("APP-7H2K4Q"))!;
    assert.equal(dealHeader.about(harbor.deal, harbor.now), "Bakery · Portland, ME · since 2016 · Owner Elena Brooks");
    assert.deepEqual([dealHeader.requested(harbor.deal), dealHeader.recommended(harbor.deal), dealHeader.due(harbor.deal)], ["$45,000", "$40,000", "In 1h 10m"]);
    assert.equal(harbor.deal.owner?.name, "Maya Chen");
    const mesa = (await dealFrameView("APP-9K2M7R"))!;
    assert.equal(dealHeader.about(mesa.deal, mesa.now), "BlueRock Advisors · received 08:55 by bulk ZIP");
    assert.deepEqual([dealHeader.requested(mesa.deal), dealHeader.recommended(mesa.deal), dealHeader.due(mesa.deal)], ["$35K", "Not set", "25m left"]);
    assert.equal(await dealFrameView("APP-NOPE"), null);
  });
});

describe("Deal tabs: Offer, Decision & memo, Activity", () => {
  it("an unknown deal has none of these tabs", async () => {
    assert.equal(await offerTabView("APP-NOPE"), null);
    assert.equal(await decisionTabView("APP-NOPE"), null);
    assert.equal(await activityTabView("APP-NOPE"), null);
  });

  it("Offer: the deal's own range, figures and parties, with the policy's limits", async () => {
    const d = (await offerTabView("APP-7H2K4Q"))!;
    const policy = await getPolicy();
    assert.equal(d.offerPolicy.approvalLimit, policy.limits.seniorAbove);
    assert.deepEqual(factorOptions(d.offerPolicy.factorMin, d.offerPolicy.factorMax), [1.28, 1.32, 1.36, 1.4]);
    assert.equal(offerBuilder.rules.factor.note(d.offerPolicy.factorMin, d.offerPolicy.factorMax, d.scoreBandFrom), "1.28 – 1.40 for score 80+");
    assert.equal(offerBuilder.amount.recommended(d.recommended.amount), "Recommended $40K");
    assert.deepEqual([offerBuilder.payoff.label(d.payoff!.funder), offerBuilder.payoff.note(d.payoff!.balance)], ["Pay off Kingsway", "~$9,400 from this advance"]);
    assert.equal(merchantPays.collect.ach("Chase ••7712"), "Taken from Chase ••7712 by ACH");
    assert.equal(earlyPayoffCard.subtitle(d.owner!), "What Elena would owe in total if she pays everything off early");
    assert.deepEqual(
      d.offer.history.map((e) => [offerHistory.eventTitle[e.kind](e), offerHistory.note(e)]),
      [
        ["Broker asked for $45,000", "Apex Funding · on the application, 09:40"],
        ["Cevrynt recommended $40,000", "1.32 factor, 6 months · 09:41"],
      ],
    );
    assert.equal(disclosure.subtitle(d.state), "Filled in from this offer, using the disclosure template set for Maine");
    assert.equal(disclosure.doc.ref(d.workspace, d.id), "Ridgeline Capital · APP-7H2K4Q");
    // The deal's own figures are the ones the offer math's sample default uses, so its tests cover this page.
    assert.deepEqual(d.figures, harborFigures);
  });

  it("Decision: the policy check, sign-off and memo quote the policy's own values", async () => {
    const d = (await decisionTabView("APP-7H2K4Q"))!;
    const share = computeOffer(d.recommended, d.figures, d.offerPolicy).share;
    const rows = policyRows(d, d.recommended.amount, share);
    assert.deepEqual(
      rows.map((r) => [r.label, r.value]),
      [
        ["Time in business, 6 months or more", "10 years"],
        ["Industry on approved list", "Bakery"],
        ["Debt payments under 65% of revenue", "25%"],
        ["NSFs under 8 a month", "0"],
        ["Amount under 1.5× monthly revenue", "0.65×"],
        ["Stated revenue within 150% of verified", "104%"],
        ["No more than 2 open positions", "1"],
        ["Owner clear on sanctions lists", "Clear"],
      ],
    );
    assert.equal(policyCheck.chip(rows.filter((r) => r.met).length, rows.length), "8 of 8 met");
    // A stricter policy is quoted, and checked, as it stands.
    const strict = policyRows({ ...d, policy: { ...d.policy, maxDebtShare: 0.2 } }, d.recommended.amount, share);
    assert.deepEqual([strict[2].label, strict[2].met], ["Debt payments under 20% of revenue", false]);
    const limit = d.policy.limits.seniorAbove;
    assert.deepEqual([signOff.role.underwriter(limit), signOff.role.senior(limit)], ["Underwriter · up to $45K", "Senior · above $45K or waivers"]);
    assert.equal(signOff.note(d.recommended.amount, limit, d.me.name, d.senior.name), "$40,000 is within Maya's limit, so one sign-off is enough.");
    assert.equal(signOff.note(50000, limit, d.me.name, d.senior.name), "$50,000 is above Maya's limit, so Priya signs too.");
    const f = formatOffer(d.recommended, computeOffer(d.recommended, d.figures, d.offerPolicy));
    assert.equal(
      memoCopy.debt(d.positions, f, d.offerPolicy.maxShare),
      "One disclosed advance with Kingsway Capital at $285 a day, about $9.4K left. After our offer, all debt payments take 25% of revenue against a 65% limit.",
    );
    assert.equal(
      memoCopy.recommendation(f, d.recommended.factor, d.recommended.term, d.recommended.freq, d.bank, d.openConditions),
      "Approve $40,000, 1.32 factor, 6 months, daily ACH from Chase ••7712. Conditions: landlord letter, signed contract, funding call, final checks before funding.",
    );
    assert.deepEqual(decisionCard.next.steps("approve", { broker: d.broker, owner: d.owner, validHours: d.validHours, openItems: d.openConditions.length }), [
      "Offer goes to Apex Funding and Elena, valid for 72 hours",
      "Conditions & stips keeps track of the 3 open items",
      "Stacking Watch keeps checking until funding",
    ]);
  });

  it("Activity: stages, people and messages read as the design shows them", async () => {
    const d = (await activityTabView("APP-7H2K4Q"))!;
    const a = d.activity;
    assert.deepEqual(a.stages.map((s) => duration(s.seconds)), ["41 sec", "19 sec", "16 min", "2h 32m"]);
    assert.equal(paceCopy.people.note(a.people), "Maya, Dana (broker), Elena (merchant)");
    assert.equal(paceCopy.queue.note(d.deadline), "Decision due in 1h 10m");
    assert.deepEqual(d.mentions.map((p) => p.name), ["Priya Shah", "Jordan Reyes"]);
    assert.deepEqual(a.threads.broker.map((m) => messagesCopy.meta(m, d.me.name)), ["Maya · 10:05 · delivered, opened 10:09", "Dana Ruiz · 10:20"]);
    // The timeline's day follows the workspace clock: the sample deal's events are all today.
    assert.equal(timelineCopy.day(a.events[0].at, d.now), "Today · Tuesday, Oct 13");
  });
});

describe("My tasks", () => {
  it("due times and groups are worked out from each task's time and the workspace clock", async () => {
    const d = await tasksView();
    assert.deepEqual(d.tasks.map((t) => dueLabel(t, d.now)), ["Now", "25 min", "1h 10m", "Today", "4:00 pm", "Thu 10:00", "4 days"]);
    assert.deepEqual(d.tasks.map((t) => taskWhen(t.dueAt, d.now)), ["now", "now", "today", "today", "today", "week", "week"]);
    assert.deepEqual(d.tasks.map((t) => toTaskView(t, d.now).href), ["/stacking", "/submissions", "/deals/APP-7H2K4Q/decision", "/renewals", "/submissions", "/deals/APP-7H2K4Q/conditions", "/funded"]);
    assert.equal(toTaskView(d.tasks[2], d.now).action, "Make the decision");
  });

  it("the signed-in person's load on the Team view matches their own list", async () => {
    const d = await tasksView();
    const mine = d.team.find((m) => m.id === d.me.id)!.load;
    assert.equal(mine.open, d.tasks.length);
    assert.equal(mine.dueNow, d.tasks.filter((t) => taskWhen(t.dueAt, d.now) === "now").length);
    assert.deepEqual(d.team.map((m) => loadSummary(m.load)), ["7 open · 2 due now", "9 open · 1 overdue", "5 open", "4 open · 1 approval for you"]);
    assert.equal(teamSummary(d.team.length, d.team.reduce((n, m) => n + m.load.open, 0)), "4 people · 25 open tasks");
    assert.deepEqual(d.board.waiting.map((w) => waitingView(w).status), ["Due Wed", "Sent 9:43", "Sent 10:20"]);
    assert.deepEqual([d.quickDeals, d.quickAssignees], [["Harbor Street Bakery LLC", "Mesa Auto Repair"], ["Jordan Reyes", "Priya Shah"]]);
  });
});

describe("Intake", () => {
  it("the hub's counts add up, and declines quote the policy", async () => {
    const d = await intakeHubView();
    const total = d.today.reduce((n, c) => n + c.count, 0);
    assert.equal(total, 23);
    assert.deepEqual(d.today.map((c) => [channelLabel[c.channel], todayByChannel.percent(c.count, total)]), [["Single package", 48], ["Bulk ZIP", 30], ["Manual lead", 13], ["Merchant Link", 9]]);
    assert.deepEqual(d.recent.map((r) => fitLine(r.fit, d.policy)), [
      "Fits policy",
      "Needs documents · July statement missing",
      "Declined · under 6 months in business",
      "Fits policy",
      "Declined · revenue below policy minimum",
      "Fits policy",
    ]);
    assert.equal(fitLine({ result: "declined", rule: "age" }, { minBusinessMonths: 12 }), "Declined · under 12 months in business");
    assert.deepEqual(d.recent.map((r) => r.assignee), ["Maya Chen", "Maya Chen", null, "Jordan Reyes", null, "Maya Chen"]);
  });

  it("the manual lead's fit check runs on the policy's own values", async () => {
    const d = await manualLeadView();
    const { checks, fits } = runChecks(d.draft.lead, d.policy, d.now);
    assert.equal(fits, true);
    assert.deepEqual(checks.map((c) => [c.title, c.detail]).slice(0, 3), [
      ["Industry allowed", "Restaurants are on your approved list"],
      ["Time in business: 5 years 7 months", "Policy needs 6 months or more"],
      ["Request is 0.77× stated revenue", "Policy allows up to 1.5×"],
    ]);
    const strict = runChecks(d.draft.lead, { ...d.policy, maxRevenueMultiple: 0.5, minBusinessMonths: 72 }, d.now).checks;
    assert.deepEqual([strict[1].status, strict[1].detail, strict[2].status, strict[2].detail], ["bad", "Policy needs 72 months or more", "bad", "Policy allows up to 0.5× · $26,000 max"]);
    const restricted = runChecks({ ...d.draft.lead, business: { ...d.draft.lead.business, industry: "Auto sales lot" } }, d.policy, d.now).checks[0];
    assert.equal(restricted.status, "bad");
    assert.deepEqual(requiredDocs(d.draft, d.policy, d.now)[0], { id: "statements", title: "Bank statements, last 4 months", note: "June – September 2026", status: "partial", label: "2 of 4" });
    const mesa = findDuplicate({ ...d.draft.lead, owner: { ...d.draft.lead.owner, mobile: "(614) 555-0177" } }, d.draft.pastDeals);
    assert.equal(mesa?.dealId, "APP-9K2M7R");
    for (const p of d.draft.pastDeals) assert.ok(await getDeal(p.dealId), `no deal ${p.dealId}`);
  });

  it("the package's fit check and counts come from what was read", async () => {
    const d = await packageView();
    assert.deepEqual(packageFitRows(d.pkg, d.policy, 2026).map((r) => r.value), ["Allowed", "7 years", "All present", "Funded once, 2024"]);
    assert.equal(packageCopy.fileMeta(d.pkg), "9 files · 14.2 MB · uploaded by you at 10:42");
    assert.equal(packageCopy.matched.note(d.pkg.business, d.pkg.statements.length), "Found on the application and all four statements. Active in the Georgia registry since 2019.");
  });

  it("the bulk summary and Create card follow the folder rows", async () => {
    const d = await bulkView();
    const rows = d.bulk.folders.map((f) => folderRow(f, d.policy));
    const ready = rows.filter((r) => r.result.kind === "chip" && r.result.label === "Ready").length;
    const attention = rows.filter((r) => r.attention).length;
    assert.deepEqual([rows.length, ready, attention, rows.filter((r) => r.result.kind === "chip" && r.result.label === "Declined").length], [8, 5, 2, 1]);
    assert.deepEqual([bulkCopy.create.title(ready), bulkCopy.create.text(ready, attention), bulkCopy.create.cta(ready)], [
      "5 deals will be created",
      "2 folders still need you. You can create these 5 now and come back to the rest.",
      "Create 5 deals",
    ]);
    const bright = rows.find((r) => r.id === "bright")!;
    assert.deepEqual([bright.statements, bright.statementsWarn, bright.fit.text], ["3 of 4", true, "July missing, will be requested"]);
    assert.equal(rows.find((r) => r.id === "mesa")!.note, "Open deal already exists · APP-9K2M7R");
    assert.equal(bulkCopy.fileMeta(d.bulk), "8 folders · 51 files · 88.6 MB · uploaded by you at 14:05");
  });
});

describe("Offers & funding", () => {
  it("the tiles, chips and queue read as the design shows them", async () => {
    const d = await offersView();
    assert.equal(offersHeader.line(d.summary.inProgress, expiringToday(d.offers, d.now).length), "14 deals between yes and money sent · 2 offers expire today");
    assert.deepEqual(offerStats(d).map((s) => `${s.value}${s.unit ?? ""} | ${s.note}`), [
      "$85K | 2 deals · next ACH cut-off 2:00 pm",
      "6 | 2 expire today",
      "4 | Waiting on signatures",
      "2.6 days | Median, last 30 days",
      "$1.1M | of a $1.5M daily limit",
      "$1.24M | +12% vs September",
    ]);
    assert.deepEqual(d.offers.map((o) => offerChip(o, d.now).text), [
      "Expires 5 pm", "Expires 6 pm", "Countered", "Renewal", "Contract today", "1 of 2 signed", "Viewed, not signed", "Ready to fund", "Ready to fund", "Sent 9:15", "Sent 11:02",
    ]);
    assert.deepEqual(d.queue.map((q) => [queueCopy.net(q), queueCopy.netNote(q)]), [[44100, "2% fee taken"], [30500, "$9,500 wired to the prior funder"], [60000, "No fee"]]);
    assert.equal(queueCopy.summary.release(d.releaser), "Release as Priya");
    assert.equal(queueCopy.cutoff(d.desk), "ACH by 2:00 pm · wire by 4:00 pm");
  });

  it("commissions owed come from Pricing's broker points on today's funded deals", async () => {
    const d = await offersView();
    const rows = commissionsCopy.rows(d.offers.filter((o) => o.stage === "funded"), d.brokerPoints);
    assert.deepEqual(rows, [{ broker: "Apex Funding Partners", amount: 4800 }, { broker: "Summit Capital ISO", amount: 2000 }]);
  });

  it("Priya's releases match the funded offers and the Audit log", async () => {
    const d = await offersView();
    for (const r of d.releases) {
      const funded = d.offers.find((o) => o.stage === "funded" && o.merchant === r.merchant)!;
      assert.equal(funded.amount, r.amount);
      assert.equal(funded.sentAt, r.sentAt);
      assert.equal(r.releasedBy, "Priya Shah");
    }
    assert.deepEqual(d.releases.map((r) => moneySentCopy.ref(r, r.releasedBy)), [
      "Trace 021000020184477 · released by Priya Shah",
      "Ref 20261012MMQFMP2K000412 · released by Priya Shah",
    ]);
    const money = (await auditView()).rows.map(auditEntryView).filter((e) => e.category === "money" && e.what.startsWith("Released"));
    assert.deepEqual(money.map((e) => [e.time, e.what, e.object]), [
      ["11:02", "Released $60,000 to Cedar Street Pharmacy", "Wire · ref …000412"],
      ["09:15", "Released $25,000 to Bayview Nail Spa", "ACH · trace …184477"],
    ]);
  });
});

describe("Funded deals", () => {
  it("the header, tiles and today's payments add up, and Home's tile reads the same", async () => {
    const d = await fundedView();
    assert.equal(fundedHeader.line(d.book), "86 advances being repaid · $4.9M still to collect");
    assert.deepEqual(fundedStats(d.book, d.now).map((s) => `${s.label}: ${s.value} · ${s.note}`), [
      "Collected in October: $287K · 98% of schedule",
      "On time: 94% · 81 of 86 deals",
      "Behind on payments: 5 · $118K at risk",
      "Paid off this month: 11 · 6 renewed with you",
    ]);
    assert.equal(todayCopy.expected(d.book), "of $28.4K expected · 81 payments");
    const home = homeCards(await homeView()).glance.find((g) => g.id === "collected")!;
    assert.equal(home.title, "$24.1K of $28.4K collected today");
    assert.equal(home.title, todayCopy.homeLine(d.book));
    assert.deepEqual([home.lead, home.note, home.noteTail], [{ kind: "ring", percent: Math.round(todayTotals(d.book).share * 100), label: "85%" }, "7 pending · ", "2 returned"]);
  });

  it("each deal's figures match Merchants, Renewals and the readiness rules", async () => {
    const d = await fundedView();
    const view = Object.fromEntries(d.advances.map((a) => [a.merchant.name, advanceView(a, d.now)]));
    assert.deepEqual(Object.values(view).map((v) => [v.paid, v.left, v.pay, v.rev, v.payoff]), [
      [72, "$25.5K", "$430/day", "+18%", "Late November"],
      [48, "$31.2K", "$412/day", "−22%", "Late January"],
      [21, "$72.6K", "$628/day", "−9%", "At risk"],
      [64, "$14.3K", "$305/day", "+4%", "Early December"],
      [18, "$68.1K", "$525/day", "+2%", "Watch"],
      [0, "$79.2K", "$629/day", "—", "April 2027"],
    ]);
    const kestrel = d.advances.find((a) => a.merchant.name === "Kestrel Plumbing")!;
    const westfield = d.advances.find((a) => a.merchant.name === "Westfield Auto Group")!;
    // Merchants reads the same advance: balance, repaid share, funded amount and health
    const m = await merchantsView();
    const km = merchantView(m.rows.find((r) => r.merchant.name === "Kestrel Plumbing")!, m.now);
    assert.deepEqual([km.balance, km.paid, km.funded, km.health], [view["Kestrel Plumbing"].left, view["Kestrel Plumbing"].paid, view["Kestrel Plumbing"].funded, 61]);
    assert.deepEqual(biggestBalances.rows(m.balances, m.funded.outstanding).map((r) => [r.name, r.balance, r.share, r.percent]), [
      ["Cedar Street Pharmacy", "$79.2K", "1.6%", 100],
      ["Westfield Auto Group", "$72.6K", "1.5%", 92],
      ["Granite State Builders", "$68.1K", "1.4%", 86],
    ]);
    for (const row of biggestBalances.rows(m.balances, m.funded.outstanding)) assert.equal(row.balance, view[row.name].left, row.name);
    assert.equal(biggestBalances.chip(m.balances, m.funded.outstanding), "Top 5 = 7% of book");
    assert.equal(biggestBalances.note(m.balances, m.funded.outstanding, m.concentration), "No merchant is above your 3% limit per business.");
    assert.deepEqual(byIndustry.limit(m.book, m.concentration), { label: "Largest industry vs your 40% limit", result: "31%, OK" });
    assert.equal(merchantsHeader.line(m.book.total, activeCount(m.funded)), "312 businesses · 86 with an active advance");
    // Renewals reads it too: balance, daily payment, repaid share, revenue and score
    const kr = renewalMerchant((await renewalsView()).candidates.find((c) => c.advance.id === kestrel.id)!);
    assert.deepEqual([kr.left, kr.now, kr.paid, kr.rev / 100, kr.score], [kestrel.payback - kestrel.paid, kestrel.dailyPayment, view["Kestrel Plumbing"].paid, kestrel.revenueChange, km.health]);
    // and so do the readiness rules
    const inputs = (await renewalRulesView()).merchants;
    for (const a of [kestrel, westfield]) {
      const r = inputs.find((x) => x.id === a.id)!;
      assert.equal(r.paid, Math.round((a.paid / a.payback) * 100), a.merchant.name);
      assert.equal(r.rev, Math.round((1 + (a.revenueChange ?? 0)) * 100), a.merchant.name);
    }
    // Returned payments are a day's payment, and Kestrel's reply is due when My tasks says
    for (const r of d.book.returned) {
      const a = d.advances.find((x) => x.merchant.name === r.merchant);
      if (a) assert.equal(r.amount, a.dailyPayment, r.merchant);
    }
    assert.equal(reconciliationCopy.days(d.book.reconciliation, d.now), "4 days");
    assert.equal(reconciliationCopy.detail(d.book.reconciliation, d.now), "Asked yesterday · sales down 22%");
    assert.equal(returnedCopy.chip(d.book), "7 · $3.1K");
    assert.deepEqual(forecastCopy.tiles(d.book).map((t) => t.value), ["$793K", "$33K", "Advances paying off"]);
    const task = (await tasksView()).tasks.find((t) => t.id === "kest")!;
    assert.equal(task.dueAt, d.book.reconciliation.respondBy);
  });
});

describe("Stacking Watch and Brokers", () => {
  it("each alert reads its merchant and stage from the real deal, queued funding or advance", async () => {
    const s = await stackingView();
    assert.deepEqual(s.alerts.map((a) => [a.merchant, stageLine(a.stage), seenLabel(a.seenAt, s.now)]), [
      ["Lakeshore Auto Body", "Ready to fund, $60K", "Today 08:12"],
      ["Granite State Builders", "Funded, 18% repaid", "Today 07:40"],
      ["Mesa Auto Repair", "In review, $35K asked", "Today 09:28"],
      ["Rivera Landscaping", "Funded, 34% repaid", "2 days ago"],
      ["Sunrise Pediatric Dental", "In review, $90K asked", "2 days ago"],
      ["Pine Ridge Vet Clinic", "Renewal ready, $70K", "2 days ago"],
    ]);
    // Mesa and Sunrise are the deals Submissions lists, at the amounts they asked for
    const { deals } = await submissionsView();
    for (const a of s.alerts.filter((x) => x.target.kind === "deal")) {
      const d = deals.find((x) => x.id === (a.target as { dealId: string }).dealId)!;
      assert.deepEqual([a.merchant, a.stage.key === "review" && a.stage.asked], [d.merchantName, d.requested]);
    }
    // Granite State is the advance Funded deals lists, and its new advance makes it a stacking case for the renewal rules
    const f = await fundedView();
    const granite = f.advances.find((a) => a.merchant.name === "Granite State Builders")!;
    assert.deepEqual(s.alerts[1].target, { kind: "advance", advanceId: granite.id });
    assert.equal((await renewalRulesView()).merchants.find((m) => m.id === granite.id)?.stacking, true);
  });

  it("Lakeshore's funding is held in the Offers queue by its open alert", async () => {
    const o = await offersView();
    const lake = o.queue.find((q) => q.merchant === "Lakeshore Auto Body")!;
    assert.deepEqual(lake.finalCheck, { ok: false, alertId: "al-la" });
    assert.equal(queueCopy.status.hold(kindFinding[lake.hold!]), "New UCC filing · on hold");
    assert.deepEqual((await stackingView()).alerts[0].target, { kind: "funding", fundingId: lake.id });
  });

  it("Pine Ridge's credit check is the at-risk merchant Renewals shows first", async () => {
    const r = await renewalsView();
    assert.deepEqual(r.atRisk[0], { name: "Pine Ridge Vet Clinic", shortName: "Pine Ridge", amount: 70000, signal: "credit-check", likelihood: 80, actBy: "today" });
  });

  it("the header, the summary and the sidebar badge count the same alerts", async () => {
    const s = await stackingView();
    const fresh = newToday(s.alerts, s.now);
    assert.equal(fresh, 3);
    assert.equal(stackingHeader.line(fresh, s.summary), "3 new alerts · watching 94 merchants every day");
    assert.deepEqual(summaryCopy.tiles(fresh, s.openCount, s.summary).map((t) => t.value), ["3", "7", "2", "94"]);
    // The badge is counted from all the alerts, with the same function; the nav keeps no copy of its own.
    assert.equal(newToday(await listStackingAlerts(), s.now), fresh);
    assert.equal(navSections.flatMap((x) => x.items).find((i) => i.key === "stacking")?.badge, undefined);
    // Home's key number counts the same alerts, and says when the first one came in.
    const key = homeCards(await homeView()).keyNumbers.stacking;
    assert.deepEqual([key.value, key.leadNote], [String(fresh), "since 7:40 am"]);
  });

  it("broker fraud flags are the Stacking Watch alerts on the deals and advances they sent", async () => {
    const b = await brokersView();
    const flags = Object.fromEntries(b.brokers.map((x) => [x.name, x.flags.map((f) => f.merchant)]));
    assert.deepEqual(flags["BlueRock Advisors"], ["Granite State Builders", "Mesa Auto Repair", "Sunrise Pediatric Dental"]);
    assert.deepEqual(flags["Summit Capital ISO"], ["Westfield Auto Group"]);
    assert.deepEqual(["Apex Funding Partners", "Keystone Brokerage", "Harbor Lane Capital", "Granite Peak ISO"].map((n) => flags[n].length), [0, 0, 0, 0]);
    assert.equal(onWatchCount(b.brokers), 1);
    // Home's broker list and the Mesa task count the same flags.
    for (const r of homeCards(await homeView()).brokers.rows) assert.equal(r.flags, flags[r.name].length, r.name);
    const t = await tasksView();
    const mesa = toTaskView(t.tasks.find((x) => x.id === "mesa")!, t.now, t.brokerFlags);
    assert.ok(mesa.prep.includes(`BlueRock sent it, ${flags["BlueRock Advisors"].length} flags this quarter`));
  });

  it("commission owed uses Pricing's broker points, including today's funded deals from Offers", async () => {
    const [b, o] = await Promise.all([brokersView(), offersView()]);
    const view = Object.fromEntries(b.brokers.map((x) => [x.name, brokerView(x, b)]));
    assert.deepEqual(Object.values(view).map((v) => [v.points, v.owed]), [
      ["8 pts, 5 on renewals", "$7,400"],
      ["8 pts", "$4,600"],
      ["7 pts", "$2,200"],
      ["8 pts", "$0"],
      ["8 pts", "$0"],
      ["8 pts", "$0"],
    ]);
    // Offers' commissions on today's funded deals are part of what each broker is owed
    for (const row of commissionsCopy.rows(o.offers.filter((x) => x.stage === "funded"), o.brokerPoints)) {
      const br = b.brokers.find((x) => x.name === row.broker)!;
      assert.equal(commissionOf(br, b).gross, br.earned.amount + row.amount, row.broker);
    }
    const p = payout(b);
    assert.deepEqual([p.title, p.amount, p.sub, p.lines.map((l) => `${l.label} ${l.value}`), p.net.value], [
      "Payout · Fri Oct 16", "$14,200", "to 3 brokers by ACH", ["Commission, 7 deals 15,400.00", "Clawback, early default −1,200.00"], "14,200.00",
    ]);
    assert.equal(brokerSummary(b).find((s) => s.label === "Commission owed")?.value, "$14.2K");
  });

  it("what we fund this week is the live policy", async () => {
    const b = await brokersView();
    assert.deepEqual(appetite.ranges(b).map((r) => [r.value, r.left, r.right]), [["$10K – $150K", 5, 25], ["$15K and up", 15, 0]]);
    assert.deepEqual(appetite.facts(b).map((f) => f.value), ["6 months+", "Up to 2"]);
    assert.deepEqual(appetite.industries(b).filter((i) => i.out).map((i) => i.name), ["Trucking"]);
  });
});

describe("Home", () => {
  it("My queue is the signed-in person's open deals, oldest first, with the on-time target", async () => {
    const [h, d, me] = await Promise.all([homeView(), listDeals(), getCurrentUser()]);
    const c = homeCards(h);
    assert.deepEqual(c.queue.items.map((i) => i.id).sort(), d.filter((x) => x.ownerId === me?.id).map((x) => x.id).sort());
    assert.deepEqual(c.queue.items.map((i) => [i.merchant, i.status, i.time, i.decided]), [
      ["Northline HVAC Services", "Needs stips", "Fri", true],
      ["Coastal Dental Group", "Renewal", "Mon", false],
      ["Mesa Auto Repair", "Integrity flag", "8:55", false],
      ["Copper Kettle Café LLC", "New", "9:20", false],
      ["Harbor Street Bakery LLC", "Ready for decision", "9:40", false],
      ["Brightside Cleaning Co", "Needs stips", "12:05", false],
      ["Golden Lotus Restaurant", "In review", "13:10", false],
    ]);
    assert.deepEqual([c.queue.onTimePercent, c.queue.targetPercent], [68, 75]);
    assert.equal(c.header.queueLine, `${c.queue.items.length} deals in your queue · open submissions`);
  });

  it("the sidebar counts My tasks and Submissions from the records, as their pages do", async () => {
    const [tasks, me, s] = await Promise.all([listTasks(), getCurrentUser(), getQueueSummary()]);
    assert.deepEqual([tasks.filter((t) => t.assigneeId === me?.id).length, s.open], [7, 28]);
    for (const key of ["tasks", "submissions"]) assert.equal(navSections.flatMap((x) => x.items).find((i) => i.key === key)?.badge, undefined, key);
    assert.equal(submissionsHeader.line(s), "28 open deals · 2 past their deadline");
  });

  it("the glance strip reads the tasks due, today's collections and the waiting policy draft", async () => {
    const [h, policy] = await Promise.all([homeView(), getPolicy()]);
    const g = Object.fromEntries(homeCards(h).glance.map((x) => [x.id, x]));
    assert.deepEqual([g.tasks.lead, g.tasks.note], [{ kind: "number", value: "2" }, "Lakeshore UCC filing · Mesa Auto Repair review"]);
    assert.deepEqual(g.policy.lead, { kind: "tag", value: `v${policy.draft!.version}` });
    assert.equal(g.policy.note, `Debt share ${percent(policy.maxDebtShare)} → ${percent(policy.draft!.change.maxDebtShare)} · needs Priya`);
    assert.equal(g.policy.note, "Debt share 65% → 70% · needs Priya");
  });

  it("key numbers come from intake, Offers & funding, Stacking Watch and Renewals", async () => {
    const [h, o] = await Promise.all([homeView(), offersView()]);
    const k = homeCards(h).keyNumbers;
    const stat = (label: string) => offerStats(o).find((s) => s.label === label)!;
    assert.deepEqual([k.submissions.value, k.submissions.change, k.submissions.changeNote, k.submissions.scale[1]], ["23", "+21%", "vs last Tuesday", "Avg 14"]);
    assert.deepEqual([k.offers.value, k.offers.expiring], ["6", "2"]);
    assert.equal(k.offers.value, stat("Offers out").value);
    assert.equal(`${k.offers.expiring} expire today`, stat("Offers out").note);
    assert.deepEqual([k.funded.value, `${k.funded.change} ${k.funded.changeNote}`], ["$1.24M", "+12% vs September"]);
    assert.equal(`${k.funded.change} ${k.funded.changeNote}`, stat("Funded this month").note);
  });

  it("decisions, pipeline and speed read today's queue stats, this week's funnel and the month's median", async () => {
    const c = homeCards(await homeView());
    assert.deepEqual([c.decisions.total, c.decisions.segments.map((s) => s.percent)], [14, [57, 14, 29]]);
    assert.deepEqual(c.pipeline.stages.map((s) => [s.value, s.note]), [
      ["86", "100% of intake"], ["54", "63% · 32 auto-declined"], ["22", "41% of reviewed"], ["14", "64% of approved"], ["11", "13% pull-through"],
    ]);
    assert.equal(c.pipeline.subtitle, "From submission to funded, Oct 12 – 18");
    assert.deepEqual(c.speed.metrics.map((m) => [m.value, m.aside]), [["3h 12m", "Target 4h"], ["2.6 days", "Slower than target"]]);
  });

  it("stips, brokers, activity and the calendar name the real deals, brokers and records", async () => {
    const c = homeCards(await homeView());
    assert.equal(c.stips.count, 5);
    assert.deepEqual(c.stips.items.map((s) => [s.title, s.detail, s.status]), [
      ["Voided check", "Northline HVAC · from merchant · 2 days", "Overdue"],
      ["Landlord letter", "Pinecrest Fitness · from broker · 1 day", "Requested"],
      ["Landlord letter", "Harbor Street Bakery · from broker · due Wed", "Sent"],
    ]);
    assert.deepEqual(c.brokers.rows.map((r) => [r.name, r.sent, r.funded]), [
      ["Apex Funding Partners", 24, 9], ["Summit Capital ISO", 19, 6], ["Keystone Brokerage", 12, 4], ["BlueRock Advisors", 15, 2],
    ]);
    assert.deepEqual(c.activity.items.map((a) => [a.title, a.when]), [
      ["Integrity reviewed", "33 min ago"], ["Documents received", "1 hr ago"], ["New UCC filing", "1 hr ago"], ["Broker message", "2 hr ago"],
    ]);
    assert.deepEqual(c.calendar.events.map((e) => [e.title, e.day, e.hour, e.href]), [
      ["Renewal window · Coastal Dental", 4, 1, "/renewals"],
      ["Funding call · Harbor Street", 4, 2, "/deals/APP-7H2K4Q"],
      ["Broker review · Apex Funding", 5, 3, "/brokers"],
      ["Offer expires 5 pm · Northline HVAC", 2, 5, "/offers"],
    ]);
    assert.equal(c.calendar.days.find((d) => d.today)?.label, "Tue 13");
  });
});

describe("Reports", () => {
  it("the scoreboard's month matches Offers & funding, and the loss rate is the funded book's", async () => {
    const [r, o, f] = await Promise.all([reportsView(), offersView(), fundedView()]);
    const month = kpis(r.snapshots.find((s) => s.period === "month")!, r);
    assert.deepEqual(month.map((k) => `${k.label} ${k.value} ${k.delta}`), [
      "Funded $1.24M +12%", "Deals funded 41 +6", "Approval rate 41% +2 pts", "Pull-through 13% Flat", "Time to decision 3h 12m −35 min", "Loss rate 2.1% YTD",
    ]);
    assert.equal(offerStats(o).find((s) => s.label === "Funded this month")?.note, `${month[0].delta} vs September`);
    assert.equal(r.lossRate, f.book.returns.lossRate);
    assert.deepEqual(r.snapshots.map((s) => kpis(s, r)[0].value), ["$310K", "$1.24M", "$3.28M", "$9.6M"]);
  });

  it("the funnel and the monthly chart read the snapshots, Offers' monthly funding and Renewals' monthly renewals", async () => {
    const r = await reportsView();
    assert.deepEqual(funnel(r.snapshots.find((s) => s.period === "month")!).stages.map((s) => s.count), [312, 196, 168, 69, 52, 41]);
    const m = fundedMonthly(r);
    assert.deepEqual(m.months.map((x) => [x.m, x.total, x.renewals]), [
      ["May", 0.78, 0.096], ["Jun", 0.86, 0.115], ["Jul", 0.91, 0.128], ["Aug", 0.99, 0.156], ["Sep", 1.107, 0.175], ["Oct", 1.24, 0.212],
    ]);
    assert.deepEqual(m.facts.map((x) => x.value), ["+59%", "12% → 17%", "October"]);
  });

  it("declines quote the live policy's limits and late-payment target, and add up to reviewed minus approved", async () => {
    const [r, policy] = await Promise.all([reportsView(), getPolicy()]);
    const month = r.snapshots.find((s) => s.period === "month")!;
    const d = declines(month, r);
    assert.equal(d.total, month.funnel.reviewed - month.funnel.approved);
    assert.equal(d.total, d.rules.reduce((n, x) => n + x.count, 0));
    assert.equal(d.target, policy.latePaymentTarget * 100);
    assert.equal(d.columns[2], `Late payments on deals it passed · target ${percent(policy.latePaymentTarget)}`);
    assert.deepEqual(d.rules.map((x) => x.rule), [
      `Revenue at least ${moneyShort(policy.minMonthlyRevenue)} a month`, `No more than ${policy.maxPositions} open positions`, "Integrity checks pass",
      `At least ${policy.minBusinessMonths} months in business`, "Industry not restricted", `Debt under ${percent(policy.maxDebtShare)} of revenue`,
    ]);
    assert.deepEqual(d.rules.map((x) => x.rule), [
      "Revenue at least $15K a month", "No more than 2 open positions", "Integrity checks pass", "At least 6 months in business", "Industry not restricted", "Debt under 65% of revenue",
    ]);
    assert.equal(d.rules.find((x) => x.verdict === "loosen")?.action.label, `Simulate ${percent(policy.draft!.change.maxDebtShare)}`);
  });

  it("unit economics take commission from Pricing's broker points; the team table reads the team records", async () => {
    const [r, pricing, team] = await Promise.all([reportsView(), getPricing(), listTeam()]);
    const ue = unitEconomics(r);
    const cents = (label: string) => ue.parts.find((p) => p.label === label)!.cents;
    assert.equal(cents("Broker commission"), pricing.brokerPoints.newDeal);
    assert.equal(ue.back, "$1.32");
    assert.equal(cents("Kept as profit"), 32 - cents("Broker commission") - cents("Losses") - cents("Costs"));
    const rows = teamRows(r).rows;
    assert.deepEqual(rows.map((x) => x.name), rows.map((x) => team.find((m) => m.initials === x.ini)?.name));
    assert.deepEqual(rows.map((x) => [x.ini, x.decided, x.time, x.late, x.lateHigh]), [
      ["MC", 112, "2h 50m", "1.8%", false], ["AK", 98, "3h 40m", "2.9%", true], ["JR", 87, "3h 05m", "2.0%", false], ["PS", 41, "2h 10m", "1.2%", false],
    ]);
  });
});
