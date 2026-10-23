/**
 * Shared formatting: the data layer returns plain numbers (dollars) and ISO
 * 8601 dates; components turn them into what people read here. Pure, no
 * React. Tested in lib/format.test.ts.
 *
 * Times show in the workspace's zone (Eastern, Ridgeline Capital) unless a
 * zone is passed.
 */

export const WORKSPACE_TIME_ZONE = "America/New_York";

/** "$40,000" */
export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/** "$40K", "$9.4K" */
export const moneyShort = (n: number) => "$" + (n / 1000).toFixed(n % 1000 ? 1 : 0) + "K";

/** "$61.4K", "$74.0K", "$118K": one decimal under $100K, as the queue shows revenue and balances. */
export const moneyK = (n: number) => "$" + (n / 1000).toFixed(n < 100_000 ? 1 : 0) + "K";

/** "$269.8K": always one decimal, for totals shown next to the monthly figures. */
export const moneyK1 = (n: number) => "$" + (n / 1000).toFixed(1) + "K";

/** "$1.24M" for amounts of a million and up, otherwise like moneyShort. */
export const moneyCompact = (n: number) => (Math.abs(n) >= 1_000_000 ? "$" + (n / 1_000_000).toFixed(2) + "M" : moneyShort(n));

/** "25%" from a fraction (0.254); "2.6%" with one decimal place. */
export const percent = (fraction: number, digits = 0) => (digits ? (fraction * 100).toFixed(digits) : Math.round(fraction * 100)) + "%";

/** "1 step", "3 steps" */
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const parts = (iso: string, timeZone: string) => {
  const p = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso));
  const get = (t: Intl.DateTimeFormatPartTypes) => p.find((x) => x.type === t)?.value ?? "";
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
};

/** "08:12", 24-hour, as the designs show times. */
export function timeOfDay(iso: string, timeZone = WORKSPACE_TIME_ZONE) {
  const p = parts(iso, timeZone);
  return `${p.hour}:${p.minute}`;
}

/** "Oct 14" */
export function dateShort(iso: string, timeZone = WORKSPACE_TIME_ZONE) {
  const p = parts(iso, timeZone);
  return `${p.month} ${p.day}`;
}

/** Calendar days from one date to a later one in the workspace's zone: Oct 1 → Oct 13 is 12. */
export function daysBetween(fromIso: string, toIso: string, timeZone = WORKSPACE_TIME_ZONE) {
  const day = (s: string) => {
    const p = parts(s, timeZone);
    return Date.UTC(Number(p.year), new Date(`${p.month} 1, 2000`).getMonth(), Number(p.day));
  };
  return Math.round((day(toIso) - day(fromIso)) / 86_400_000);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** A statement month "2026-06" as "Jun" or "June". */
export const monthName = (yearMonth: string, length: "short" | "long" = "short") => {
  const name = MONTHS[Number(yearMonth.slice(5, 7)) - 1] ?? "";
  return length === "short" ? name.slice(0, 3) : name;
};

/** "August 2" */
export function dateLong(iso: string, timeZone = WORKSPACE_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-US", { timeZone, month: "long", day: "numeric" }).format(new Date(iso));
}

/** "Thu" */
export function weekdayShort(iso: string, timeZone = WORKSPACE_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(new Date(iso));
}

/** "Aug 2026" */
export function monthYear(iso: string, timeZone = WORKSPACE_TIME_ZONE) {
  const p = parts(iso, timeZone);
  return `${p.month} ${p.year}`;
}

/** "Today", "Yesterday" or "Oct 14", counted in the workspace's zone. */
export function dayLabel(iso: string, now: string, timeZone = WORKSPACE_TIME_ZONE) {
  const diff = daysBetween(iso, now, timeZone);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return dateShort(iso, timeZone);
}

/** "Today 08:12", "Yesterday 16:40", "Oct 14 09:15" */
export const dayAndTime = (iso: string, now: string, timeZone = WORKSPACE_TIME_ZONE) => `${dayLabel(iso, now, timeZone)} ${timeOfDay(iso, timeZone)}`;
