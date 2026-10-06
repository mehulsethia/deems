/** Pure maths behind the projection and comparison screens. No React. */

export const HORIZON_YEARS = 50;
export const MAX_HOURS_PER_DAY = 24;

export interface UsageInput {
  hoursPerDay: number;
  messagingMinutesPerDay: number;
}

export type DurationUnit = 'years' | 'months' | 'days';
export interface Duration {
  value: number;
  unit: DurationUnit;
}

const clamp = (n: number, lo: number, hi: number) => (Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo);

/** Keeps inputs inside what is physically possible; messaging cannot exceed total time. */
export function sanitize(input: UsageInput): UsageInput {
  const hoursPerDay = clamp(input.hoursPerDay, 0, MAX_HOURS_PER_DAY);
  const messagingMinutesPerDay = clamp(input.messagingMinutesPerDay, 0, hoursPerDay * 60);
  return { hoursPerDay, messagingMinutesPerDay };
}

/** Time on the app that is not messaging. */
export function scrollMinutesPerDay(input: UsageInput): number {
  const { hoursPerDay, messagingMinutesPerDay } = sanitize(input);
  return hoursPerDay * 60 - messagingMinutesPerDay;
}

/**
 * Years of continuous, round-the-clock time spent scrolling over the horizon:
 *   (scroll hours per day × 365.25 × years) ÷ (24 h × 365.25) = scroll hours/day × years ÷ 24.
 * Assumes the current pace never changes.
 */
export function scrollingYears(input: UsageInput, horizonYears = HORIZON_YEARS): number {
  return ((scrollMinutesPerDay(input) / 60) * horizonYears) / 24;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Years when a year or more, otherwise months, otherwise days, so small numbers stay honest. */
export function toDuration(years: number): Duration {
  if (years >= 0.95) return { value: round1(years), unit: 'years' };
  const months = years * 12;
  if (months >= 0.95) return { value: Math.round(months), unit: 'months' };
  return { value: Math.max(0, Math.round(years * 365.25)), unit: 'days' };
}

/** Trims trailing zeros: 2 -> "2", 2.5 -> "2.5", 2.333 -> "2.33". */
export function formatNumber(n: number): string {
  return String(Math.round(n * 100) / 100);
}

export function formatDuration(d: Duration): string {
  const unit = d.value === 1 ? d.unit.replace(/s$/, '') : d.unit;
  return `${formatNumber(d.value)} ${unit}`;
}

export interface Projection {
  scrollMinutesPerDay: number;
  years: number;
  duration: Duration;
  /** Plain-language working shown under the number. */
  formula: string;
}

export function projection(input: UsageInput): Projection {
  const clean = sanitize(input);
  const scrollMin = scrollMinutesPerDay(clean);
  const years = scrollingYears(clean);
  const duration = toDuration(years);
  const scrollHours = formatNumber(scrollMin / 60);
  const formula =
    `${formatNumber(clean.hoursPerDay)} h/day on Instagram − ${formatNumber(clean.messagingMinutesPerDay)} min messaging` +
    ` = ${scrollHours} h/day scrolling. ${scrollHours} h × ${HORIZON_YEARS} years ÷ 24 h = ${formatNumber(years)} years` +
    ` of non-stop, 24-hour days, if your pace never changes.`;
  return { scrollMinutesPerDay: scrollMin, years, duration, formula };
}

export interface ComparisonBars {
  nowMinutes: number;
  messagingMinutes: number;
  /** Messaging-only bar length relative to the "Now" bar, 0..1. */
  messagingRatio: number;
  savedMinutesPerDay: number;
}

export function comparison(input: UsageInput): ComparisonBars {
  const clean = sanitize(input);
  const nowMinutes = clean.hoursPerDay * 60;
  const messagingMinutes = clean.messagingMinutesPerDay;
  return {
    nowMinutes,
    messagingMinutes,
    messagingRatio: nowMinutes === 0 ? 0 : messagingMinutes / nowMinutes,
    savedMinutesPerDay: nowMinutes - messagingMinutes,
  };
}

export function formatMinutes(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
}
