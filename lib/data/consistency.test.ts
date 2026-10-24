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
import { defaultRenewalRules, readiness } from "@/lib/renewal-rules";
import { estimateUpTo } from "@/lib/sample-data/apply";
import { auditHeader } from "@/lib/sample-data/audit";
import { builder, sendOffer } from "@/lib/copy/deal-offer";
import { COST_PER_DEAL, costPerDeal, dealsUsed, usage, usageByChannel } from "@/lib/sample-data/plan";
import { readinessMerchants } from "@/lib/sample-data/renewal-rules";
import { brokerPay, readyRules, renewalsHeader } from "@/lib/sample-data/renewals";
import { unitEconomics } from "@/lib/sample-data/reports";
import { signIns, toFix } from "@/lib/sample-data/security";
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
import { money, moneyK, moneyK1, percent } from "@/lib/format";
import { computeOffer, formatOffer, harborFigures, recommendedOffer } from "@/lib/offer-math";
import { channelLabel, fitLine, folderRow, bulkCopy, packageCopy, packageFitRows, todayByChannel } from "@/lib/copy/intake";
import { findDuplicate, requiredDocs, runChecks } from "@/lib/copy/intake-manual";
import { dueLabel, loadSummary, taskWhen, teamSummary, toTaskView, waitingView } from "@/lib/copy/tasks";
import { bulkView, intakeHubView, manualLeadView, packageView } from "@/lib/data/views/intake";
import { tasksView } from "@/lib/data/views/tasks";
import { advanceView, fundedHeader, fundedStats, todayCopy, todayTotals, reconciliationCopy, returnedCopy, forecastCopy } from "@/lib/copy/funded";
import { commissionsCopy, expiringToday, moneySentCopy, offerChip, offerStats, offersHeader, queueCopy } from "@/lib/copy/offers";
import { fundedView, offersView } from "@/lib/data/views/funding";
import { auditEntries } from "@/lib/sample-data/audit";
import { homeData } from "@/lib/sample-data/home";
import { biggestBalances, merchants } from "@/lib/sample-data/merchants";
import { renewalMerchants } from "@/lib/sample-data/renewals";
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
  it("today's saved rules make exactly 9 merchants ready, as the Renewals page says", () => {
    const { ready } = readiness(readinessMerchants, defaultRenewalRules);
    assert.equal(ready.length, 9);
    assert.match(renewalsHeader.line, /^9 merchants ready/);
  });
});

describe("Deals by channel and cost per deal", () => {
  it("287 deals this month, split 132 / 98 / 39 / 18 (Plan & usage, Intake channels)", () => {
    assert.equal(dealsUsed, 287);
    assert.deepEqual(usageByChannel.map((c) => c.deals), [132, 98, 39, 18]);
  });

  it("$5.20 a deal, the same on Plan & usage and Reports", () => {
    assert.equal(COST_PER_DEAL, 5.2);
    assert.equal(costPerDeal, "$5.20");
    assert.equal(unitEconomics.facts.find((f) => f.label === "Cevrynt cost per deal")?.value, "$5.20");
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
    assert.ok(toFix.some((f) => f.title === "Leo Park has no 2-step login"));
    assert.equal(signIns.rows.find((r) => r.person === "Leo Park")?.result, "nomfa");
  });

  it("7 people and 1 invite: the People card, Plan & usage seats and the Audit log agree", async () => {
    const [team, invites] = await Promise.all([listTeam(), listInvites()]);
    assert.equal(peopleCard.subtitle(team.length, invites.length), "7 people · 1 invite waiting");
    assert.equal(usage.seats.used, 7);
    assert.equal(usage.seats.hint, "1 invite pending");
    assert.equal(invites[0].name, "Kim Tran");
  });

  it("the access review is 12 days late, on Team & roles and Security", async () => {
    const [review, now] = await Promise.all([getAccessReview(), getNow()]);
    assert.equal(reviewCopy.chip(daysBetween(review.dueAt, now)), "12 days late");
    assert.ok(toFix.some((f) => f.title === "Access review is 12 days late"));
  });

  it("one failed sign-in, on Security and the Audit log", () => {
    assert.equal(signIns.rows.filter((r) => r.result === "blocked").length, 1);
    assert.equal(auditHeader.stats.find((s) => s.label === "Failed sign-ins")?.value, "1");
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
    const money = auditEntries.filter((e) => e.category === "money" && e.what.startsWith("Released"));
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
    const home = homeData.glance.find((g) => g.id === "collected")!;
    assert.equal(home.title, "$24.1K of $28.4K collected today");
    assert.equal(home.title, todayCopy.homeLine(d.book));
    assert.deepEqual([home.lead, home.note, home.noteTail], [{ kind: "ring", percent: Math.round(todayTotals(d.book).share * 100), label: "85%" }, "7 pending · ", "2 returned"]);
  });

  it("each deal's figures match Merchants, Renewals and the readiness rules", async () => {
    const d = await fundedView();
    const view = Object.fromEntries(d.advances.map((a) => [a.merchant, advanceView(a, d.now)]));
    assert.deepEqual(Object.values(view).map((v) => [v.paid, v.left, v.pay, v.rev, v.payoff]), [
      [72, "$25.5K", "$430/day", "+18%", "Late November"],
      [48, "$31.2K", "$412/day", "−22%", "Late January"],
      [21, "$72.6K", "$628/day", "−9%", "At risk"],
      [64, "$14.3K", "$305/day", "+4%", "Early December"],
      [18, "$68.1K", "$525/day", "+2%", "Watch"],
      [0, "$79.2K", "$629/day", "—", "April 2027"],
    ]);
    const kestrel = d.advances.find((a) => a.merchant === "Kestrel Plumbing")!;
    const westfield = d.advances.find((a) => a.merchant === "Westfield Auto Group")!;
    // Merchants
    const km = merchants.find((m) => m.name === "Kestrel Plumbing")!;
    assert.deepEqual([km.balance, km.paid, km.funded], [view["Kestrel Plumbing"].left, view["Kestrel Plumbing"].paid, view["Kestrel Plumbing"].funded]);
    for (const row of biggestBalances.rows) {
      const v = view[row.name];
      if (v) assert.equal(row.balance, v.left, row.name);
    }
    // Renewals
    const kr = renewalMerchants.find((m) => m.name === "Kestrel Plumbing")!;
    assert.deepEqual([kr.left, kr.now, kr.paid, kr.rev / 100], [kestrel.payback - kestrel.paid, kestrel.dailyPayment, view["Kestrel Plumbing"].paid, kestrel.revenueChange]);
    // Renewal rules' readiness inputs
    for (const a of [kestrel, westfield]) {
      const r = readinessMerchants.find((m) => m.name === a.merchant)!;
      assert.equal(r.paid, Math.round((a.paid / a.payback) * 100), a.merchant);
      assert.equal(r.rev, Math.round((1 + (a.revenueChange ?? 0)) * 100), a.merchant);
    }
    // Returned payments are a day's payment, and Kestrel's reply is due when My tasks says
    for (const r of d.book.returned) {
      const a = d.advances.find((x) => x.merchant === r.merchant);
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
