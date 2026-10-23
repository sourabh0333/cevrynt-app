import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dateShort, dayAndTime, dayLabel, daysBetween, money, moneyK, monthYear, weekdayShort, moneyCompact, moneyShort, percent, plural, timeOfDay } from "./format.ts";

describe("money and shares", () => {
  it("formats dollars the way the designs show them", () => {
    assert.equal(money(52800), "$52,800");
    assert.equal(money(418.95), "$419");
    assert.equal(moneyShort(40000), "$40K");
    assert.equal(moneyShort(9400), "$9.4K");
    assert.equal(moneyCompact(1240000), "$1.24M");
    assert.equal(moneyCompact(402000), "$402K");
    assert.equal(percent(0.254), "25%");
    assert.equal(percent(0.026, 1), "2.6%");
    assert.equal(percent(1.5), "150%");
    assert.equal(moneyK(61400), "$61.4K");
    assert.equal(moneyK(74000), "$74.0K");
    assert.equal(moneyK(118000), "$118K");
  });

  it("counts things in plain words", () => {
    assert.equal(plural(1, "step"), "1 step");
    assert.equal(plural(3, "step"), "3 steps");
    assert.equal(plural(2, "person", "people"), "2 people");
  });
});

describe("dates in the workspace's zone (Eastern)", () => {
  const now = "2026-10-14T15:00:00Z"; // 11:00 in Boston

  it("shows 24-hour times and short dates", () => {
    assert.equal(timeOfDay("2026-10-14T12:12:00Z"), "08:12");
    assert.equal(timeOfDay("2026-10-14T20:40:00Z"), "16:40");
    assert.equal(dateShort("2026-10-02T14:00:00Z"), "Oct 2");
    assert.equal(monthYear("2027-07-01T12:00:00-04:00"), "Jul 2027");
    assert.equal(weekdayShort("2026-10-15T17:00:00-04:00"), "Thu");
    // 01:30 UTC on Saturday is still Friday evening in Boston.
    assert.equal(weekdayShort("2026-10-10T01:30:00Z"), "Fri");
  });

  it("says Today and Yesterday by the workspace's calendar, not UTC", () => {
    assert.equal(dayLabel("2026-10-14T12:12:00Z", now), "Today");
    // 01:30 UTC on the 14th is still the evening of the 13th in Boston.
    assert.equal(dayLabel("2026-10-14T01:30:00Z", now), "Yesterday");
    assert.equal(dayLabel("2026-10-11T14:00:00Z", now), "Oct 11");
    assert.equal(dayAndTime("2026-10-14T12:12:00Z", now), "Today 08:12");
  });

  it("counts whole calendar days between two dates", () => {
    assert.equal(daysBetween("2026-10-01T09:00:00-04:00", "2026-10-13T10:45:00-04:00"), 12);
    assert.equal(daysBetween("2026-10-13T23:30:00-04:00", "2026-10-14T00:10:00-04:00"), 1);
    assert.equal(daysBetween("2026-10-14T08:00:00-04:00", "2026-10-14T18:00:00-04:00"), 0);
  });
});
