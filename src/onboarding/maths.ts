/**
 * Pure maths behind the receipt. No React.
 * Every figure comes from the user's two answers; nothing is multiplied up or projected.
 */

export const TOTAL_RANGE = { min: 15, max: 12 * 60, step: 15, initial: 3 * 60 } as const;
export const TALKING_RANGE = { min: 0, step: 5, initial: 10 } as const;

/** Below this much non-talking time a day, the year and refund screens are skipped. */
export const SKIP_BELOW_MINUTES = 30;

const finite = (n: number, fallback = 0) => (Number.isFinite(n) ? n : fallback);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, finite(n, lo)));

/** Rounds to the nearest step inside [min, max]. */
export function snap(value: number, step: number, min: number, max: number): number {
  const v = clamp(value, min, max);
  return clamp(min + Math.round((v - min) / step) * step, min, max);
}

export const clampTotal = (minutes: number) => snap(minutes, TOTAL_RANGE.step, TOTAL_RANGE.min, TOTAL_RANGE.max);

/** Talking can never exceed the total. */
export const clampTalking = (talking: number, total: number) => clamp(Math.round(finite(talking)), 0, Math.max(0, finite(total)));

export interface Breakdown {
  total: number;
  talking: number;
  other: number;
  /** Share of the total that is not talking, 0..100. */
  percent: number;
  /** Whole days a year of non-talking time. */
  days: number;
}

export function breakdown(totalMinutes: number, talkingMinutes: number): Breakdown {
  const total = Math.max(0, finite(totalMinutes));
  const talking = clampTalking(talkingMinutes, total);
  const other = total - talking;
  const percent = total > 0 ? Math.round((other / total) * 100) : 0;
  const days = Math.floor((other * 365) / 60 / 24);
  return { total, talking, other, percent, days };
}

/** Mostly here to talk already: skip the year and refund screens. */
export const skipsYear = (b: Pick<Breakdown, 'other'>) => b.other < SKIP_BELOW_MINUTES;

/** "5 h 50 min", "10 min", "2 h". */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.round(finite(minutes)));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
}

/** Slider readout: "6 h 00 min", "45 min". */
export function formatReadout(minutes: number): string {
  const m = Math.max(0, Math.round(finite(minutes)));
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`;
}

/** "43 DAYS", "1 DAY"; null for 0 so "0 days" is never shown. */
export function formatDaysCaps(days: number): string | null {
  const d = Math.floor(finite(days));
  if (d <= 0) return null;
  return `${d} ${d === 1 ? 'DAY' : 'DAYS'}`;
}

/** Spoken form of a duration for screen readers: "2 hours 50 minutes". */
export function spokenDuration(minutes: number): string {
  const m = Math.max(0, Math.round(finite(minutes)));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const hs = h ? `${h} ${h === 1 ? 'hour' : 'hours'}` : '';
  const ms = rest || !h ? `${rest} ${rest === 1 ? 'minute' : 'minutes'}` : '';
  return [hs, ms].filter(Boolean).join(' ');
}
