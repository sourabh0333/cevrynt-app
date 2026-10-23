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
import { builder, sendOffer } from "@/lib/sample-data/deal-offer";
import { COST_PER_DEAL, costPerDeal, dealsUsed, usage, usageByChannel } from "@/lib/sample-data/plan";
import { readinessMerchants } from "@/lib/sample-data/renewal-rules";
import { brokerPay, readyRules, renewalsHeader } from "@/lib/sample-data/renewals";
import { unitEconomics } from "@/lib/sample-data/reports";
import { signIns, toFix } from "@/lib/sample-data/security";
import { deadlineLabel, dealHeader, metricLabels, receivedLabel, recommendedLabel } from "@/lib/copy/deal";
import { submissionsHeader, workloadCard } from "@/lib/copy/submissions";
import { getDeal, listDeals } from "@/lib/data/deals";
import { dealFrameView, submissionsView } from "@/lib/data/views/deals";
import { checkDot, dealTabs, tabCheck, tabMark } from "@/lib/copy/deal";
import { businessCopy, nameInitials, ownerCopy, publicRecordsCopy, wholeYears } from "@/lib/copy/deal-business";
import { roomToPayCopy } from "@/lib/copy/deal-cash-flow";
import { boardCopy, checkSet, composerCopy, conditionsCheck, finalChecksCopy } from "@/lib/copy/deal-conditions";
import { evidenceCopy, patternCopy } from "@/lib/copy/deal-integrity";
import { glanceCopy } from "@/lib/copy/deal-positions";
import { keyNumbersCopy, scoreCardCopy } from "@/lib/copy/deal-summary";
import { businessTabView, conditionsTabView, dealTabsView, integrityTabView } from "@/lib/data/views/deal-tabs";
import { statusOf } from "@/lib/deal-conditions";
import { debtToday, existingDaily, monthAverages, ofLimit, revenueTotals, roomToPay, scenarios } from "@/lib/deal-figures";
import { money, moneyK, moneyK1, percent } from "@/lib/format";
import { computeOffer, harborFigures, recommendedOffer } from "@/lib/offer-math";
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
    assert.match(sendOffer.approval.senior(offer.approvalLimit), /^Above \$45K/);
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
    const marks = Object.fromEntries(dealTabs.map((t) => [t.key, tabCheck[t.key] ? tabMark(checks[tabCheck[t.key]!]) : {}]));
    assert.deepEqual(
      [marks["cash-flow"], marks.positions, marks.integrity, marks.business, marks.conditions, marks.summary],
      [{ dot: "teal" }, { dot: "teal" }, { dot: "amber" }, { dot: "teal" }, { count: 2 }, {}],
    );
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
