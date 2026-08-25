export interface YearMonth {
  year: number;
  month: number; // 1-12
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function monthKey({ year, month }: YearMonth): string {
  return `${year}-${pad2(month)}`;
}

export function monthLabel({ year, month }: YearMonth): string {
  return `${year}년 ${month}월`;
}

export function prevMonth({ year, month }: YearMonth): YearMonth {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

export function nextMonth({ year, month }: YearMonth): YearMonth {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

export function isSameMonth(a: YearMonth, b: YearMonth): boolean {
  return a.year === b.year && a.month === b.month;
}

/** Monotonic index (year*12+month) safe for arithmetic comparison across any year. */
export function ymIndex({ year, month }: YearMonth): number {
  return year * 12 + month;
}

export function compareYm(a: YearMonth, b: YearMonth): number {
  return ymIndex(a) - ymIndex(b);
}

export function isBeforeOrEqual(a: YearMonth, b: YearMonth): boolean {
  return compareYm(a, b) <= 0;
}

export function isAfter(a: YearMonth, b: YearMonth): boolean {
  return compareYm(a, b) > 0;
}

/** Number of months between two YearMonths (b - a), can be negative. */
export function monthsBetween(a: YearMonth, b: YearMonth): number {
  return ymIndex(b) - ymIndex(a);
}

/** Last `count` months ending at (and including) `ym`, oldest first. */
export function recentMonths(ym: YearMonth, count: number): YearMonth[] {
  const result: YearMonth[] = [];
  let cursor = ym;
  for (let i = 0; i < count; i++) {
    result.unshift(cursor);
    cursor = prevMonth(cursor);
  }
  return result;
}

export function currentYearMonth(): YearMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
