import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeOffer,
  disclosureFor,
  earlyPayoff,
  estimateApr,
  formatOffer,
  money,
  moneyShort,
  percent,
  recommendedOffer,
  renewalOffer,
  type OfferInput,
} from "./offer-math.ts";

// The expected figures are the ones design/Deal-Offer.html shows for each case.

describe("computeOffer, recommended ($40,000 at 1.32 over 6 months, daily)", () => {
  const r = computeOffer(recommendedOffer);

  it("pays back $52,800 in 126 business-day payments of $419", () => {
    assert.equal(r.payback, 52800);
    assert.equal(r.count, 126);
    assert.equal(money(r.payment), "$419");
  });

  it("keeps all debt at 25% of revenue, within the 65% policy", () => {
    assert.equal(percent(r.share), "25%");
    assert.equal(r.withinPolicy, true);
    assert.deepEqual(r.rules, { debtShare: true, ceiling: true, factor: true, approval: true });
    assert.equal(r.needsSenior, false);
  });

  it("estimates about 116% APR", () => {
    assert.equal(Math.round(r.apr), 116);
  });

  it("sends $40,000, pays $3,200 commission and keeps a $9,600 margin", () => {
    assert.equal(r.net, 40000);
    assert.equal(r.commission, 3200);
    assert.equal(money(r.margin), "$9,600");
  });

  it("allows a renewal around month 3", () => {
    assert.equal(r.renewMonth, 3);
  });
});

describe("computeOffer, the other presets", () => {
  it("lower payment: 1.36 over 8 months gives $324 a day at 22%", () => {
    const r = computeOffer({ ...recommendedOffer, factor: 1.36, term: 8 });
    assert.equal(money(r.daily), "$324");
    assert.equal(percent(r.share), "22%");
  });

  it("paying off Kingsway drops the share to 15% and the cash to $30,600", () => {
    const r = computeOffer({ ...recommendedOffer, payoff: true });
    assert.equal(percent(r.share), "15%");
    assert.equal(r.net, 30600);
  });
});

describe("computeOffer, the other controls", () => {
  it("weekly payments: 26 payments of $2,031", () => {
    const r = computeOffer({ ...recommendedOffer, freq: "weekly" });
    assert.equal(r.count, 26);
    assert.equal(money(r.payment), "$2,031");
  });

  it("a 2% fee comes off the cash and adds to the margin", () => {
    const r = computeOffer({ ...recommendedOffer, fee: 0.02 });
    assert.equal(r.feeAmount, 800);
    assert.equal(r.net, 39200);
    assert.equal(money(r.margin), "$10,400");
  });

  it("card sales: $419 a day is about 32% of each day's card sales", () => {
    const r = computeOffer({ ...recommendedOffer, method: "split" });
    assert.equal(percent(r.cardShare), "32%");
  });

  it("$48,000 is within the ceiling but needs senior sign-off", () => {
    const r = computeOffer({ ...recommendedOffer, amount: 48000 });
    assert.equal(r.rules.ceiling, true);
    assert.equal(r.rules.approval, false);
    assert.equal(r.needsSenior, true);
  });

  it("flags the debt share once it passes 65% of revenue", () => {
    const heavy: OfferInput = { ...recommendedOffer, amount: 48000, factor: 1.4, term: 4 };
    const r = computeOffer(heavy, { ...{ revenue: 20000, existingMonthly: 6185, existingBalance: 9400, commission: 0.08, cardMonthly: 28200 } });
    assert.equal(r.withinPolicy, false);
  });
});

describe("earlyPayoff", () => {
  it("lists the three discount tiers and the full term for the recommended offer", () => {
    const tiers = earlyPayoff(recommendedOffer);
    assert.deepEqual(
      tiers.map((t) => [t.days, money(t.total), money(t.saves)]),
      [
        [30, "$48,000", "$4,800"],
        [60, "$49,600", "$3,200"],
        [90, "$51,200", "$1,600"],
        [null, "$52,800", "$0"],
      ],
    );
  });

  it("never charges more than the offer's own factor", () => {
    const tiers = earlyPayoff({ ...recommendedOffer, factor: 1.28 });
    assert.equal(tiers[2].factor, 1.28);
    assert.equal(tiers[2].saves, 0);
  });
});

describe("the disclosure shows the builder's figures", () => {
  const cases: [string, OfferInput][] = [
    ["recommended", recommendedOffer],
    ["lower payment", { ...recommendedOffer, factor: 1.36, term: 8 }],
    ["pay off Kingsway", { ...recommendedOffer, payoff: true }],
    ["weekly with a 3% fee", { ...recommendedOffer, freq: "weekly", fee: 0.03 }],
    ["$48K over 4 months on card sales", { ...recommendedOffer, amount: 48000, term: 4, method: "split" }],
  ];

  for (const [name, input] of cases) {
    it(`${name}: every disclosure figure equals the builder's`, () => {
      const builder = formatOffer(input, computeOffer(input));
      const disclosure = disclosureFor(input);
      assert.deepEqual(disclosure.figures, builder);
    });
  }

  it("recommended: prints the design's disclosure text", () => {
    const d = disclosureFor(recommendedOffer);
    assert.equal(d.figures.amount, "$40,000");
    assert.equal(d.figures.net, "$40,000");
    assert.equal(d.figures.charge, "$12,800");
    assert.equal(d.figures.payback, "$52,800");
    assert.equal(d.figures.apr, "116%");
    assert.equal(d.figures.term, "6 months");
    assert.equal(d.figures.count, "126 business-day payments");
    assert.equal(`${d.figures.payment} ${d.figures.per}`, "$419 a business day");
    assert.equal(d.figures.hold, "15%");
    assert.equal(d.feeLine, "No origination fee.");
    assert.equal(d.figures.commission, "$3,200");
    assert.equal(d.payoffLine, null);
    assert.equal(d.needsSenior, false);
  });

  it("a 2% fee and a payoff add their lines, and $48K needs a senior", () => {
    const d = disclosureFor({ ...recommendedOffer, amount: 48000, fee: 0.02, payoff: true });
    assert.equal(d.feeLine, "An origination fee of $960 is taken from the amount before it is sent.");
    assert.match(d.payoffLine ?? "", /\$9,400 of the amount pays off/);
    assert.equal(d.figures.net, "$37,640");
    assert.equal(d.needsSenior, true);
  });
});

describe("renewalOffer (design/Renewals.html, Harborview Bistro)", () => {
  const r = renewalOffer({ amount: 55000, baseFactor: 1.32, left: 9900, paid: 81, currentFactor: 1.3 });

  it("takes 0.04 off the base factor for loyalty", () => {
    assert.equal(r.loyaltyFactor, 1.28);
  });

  it("splits $55,000 into the $9,900 payoff and $45,100 new cash, 82% of it", () => {
    assert.equal(r.cash, 45100);
    assert.equal(Math.round(r.cashPercent), 82);
  });

  it("prices the daily payment through the shared offer math: $559 a day", () => {
    assert.equal(money(r.daily), "$559");
  });

  it("finds $2,285 of unearned fee inside the unpaid balance", () => {
    assert.equal(money(r.unearnedFee), "$2,285");
  });

  it("gives no cash or payment for a merchant that is not ready", () => {
    const n = renewalOffer({ amount: 0, baseFactor: 1.37, left: 31200, paid: 48, currentFactor: 1.3 });
    assert.equal(n.cash, 0);
    assert.equal(n.daily, 0);
  });
});

describe("helpers", () => {
  it("estimateApr matches a plain loan check", () => {
    // 12 monthly payments of $88.85 on $1,000 is about 12% APR.
    assert.equal(Math.round(estimateApr(1000, 88.85, 12, 12)), 12);
  });

  it("formats money and shares", () => {
    assert.equal(money(52800), "$52,800");
    assert.equal(moneyShort(40000), "$40K");
    assert.equal(moneyShort(9400), "$9.4K");
    assert.equal(percent(0.254), "25%");
  });
});
