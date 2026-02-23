import type { DateRange, DailyValue, TrendStats } from '../types/report.js';

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

export function getReportDate(overrideDate?: string): string {
  if (overrideDate) return overrideDate;
  return formatDate(new Date());
}

export function get30DayRange(endDate: string): DateRange {
  const end = parseDate(endDate);
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  return { start: formatDate(start), end: endDate };
}

export function get1YearRange(endDate: string): DateRange {
  const end = parseDate(endDate);
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() + 1);
  return { start: formatDate(start), end: endDate };
}

export function chunkDateRange(range: DateRange, chunkDays: number): DateRange[] {
  const chunks: DateRange[] = [];
  const end = parseDate(range.end);
  let current = parseDate(range.start);

  while (current <= end) {
    const chunkEnd = new Date(current);
    chunkEnd.setDate(chunkEnd.getDate() + chunkDays - 1);
    if (chunkEnd > end) {
      chunks.push({ start: formatDate(current), end: formatDate(end) });
    } else {
      chunks.push({ start: formatDate(current), end: formatDate(chunkEnd) });
    }
    current = new Date(chunkEnd);
    current.setDate(current.getDate() + 1);
  }

  return chunks;
}

export function daysBetween(start: string, end: string): number {
  const s = parseDate(start);
  const e = parseDate(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function eachDay(range: DateRange): string[] {
  const days: string[] = [];
  const end = parseDate(range.end);
  const current = parseDate(range.start);
  while (current <= end) {
    days.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function computeTrendStats(values: DailyValue[]): TrendStats {
  if (values.length === 0) {
    return { average: 0, min: 0, max: 0, trend: 'stable', percentChange: 0 };
  }

  const nums = values.map((v) => v.value).filter((n) => !isNaN(n) && n !== 0);
  if (nums.length === 0) {
    return { average: 0, min: 0, max: 0, trend: 'stable', percentChange: 0 };
  }

  const average = nums.reduce((a, b) => a + b, 0) / nums.length;
  const min = Math.min(...nums);
  const max = Math.max(...nums);

  // Compare first third vs last third for trend
  const third = Math.max(1, Math.floor(nums.length / 3));
  const firstThird = nums.slice(0, third);
  const lastThird = nums.slice(-third);
  const firstAvg = firstThird.reduce((a, b) => a + b, 0) / firstThird.length;
  const lastAvg = lastThird.reduce((a, b) => a + b, 0) / lastThird.length;

  const percentChange = firstAvg === 0 ? 0 : ((lastAvg - firstAvg) / firstAvg) * 100;

  let trend: TrendStats['trend'] = 'stable';
  if (Math.abs(percentChange) > 5) {
    trend = percentChange > 0 ? 'improving' : 'declining';
  }

  return {
    average: Math.round(average * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    trend,
    percentChange: Math.round(percentChange * 10) / 10,
  };
}

export function formatShortDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMonthYear(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function weeklyAverage(values: DailyValue[]): DailyValue[] {
  if (values.length === 0) return [];

  const weeks: DailyValue[] = [];
  for (let i = 0; i < values.length; i += 7) {
    const chunk = values.slice(i, i + 7);
    const validValues = chunk.filter((v) => v.value !== 0);
    if (validValues.length > 0) {
      const avg = validValues.reduce((a, b) => a + b.value, 0) / validValues.length;
      weeks.push({ date: chunk[0].date, value: Math.round(avg * 100) / 100 });
    }
  }
  return weeks;
}
