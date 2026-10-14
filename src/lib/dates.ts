// Calendar arithmetic on plain dates written 2026-10-14, with no time zone in the way.
// "Today" is Thailand's date (see bangkokToday in visits.ts).

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const toTime = (day: string) => Date.parse(`${day}T00:00:00Z`);
const toDay = (time: number) => new Date(time).toISOString().slice(0, 10);

export const addDays = (day: string, n: number) => toDay(toTime(day) + n * MS_PER_DAY);

export const startOfMonth = (day: string) => `${day.slice(0, 8)}01`;

export function addMonths(day: string, n: number): string {
  const date = new Date(toTime(startOfMonth(day)));
  date.setUTCMonth(date.getUTCMonth() + n);
  return toDay(date.getTime());
}

export const endOfMonth = (day: string) => addDays(addMonths(day, 1), -1);

/** The Monday of the week that `day` is in. */
export function mondayOf(day: string): string {
  const weekday = new Date(toTime(day)).getUTCDay(); // 0 is Sunday
  return addDays(day, -((weekday + 6) % 7));
}

/** The first days of the `count` months ending with the month of `day`, oldest first. */
export function recentMonths(day: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addMonths(day, i - (count - 1)));
}
