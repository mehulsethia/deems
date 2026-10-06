/**
 * The receipt maths, identical to the app (src/onboarding/maths.ts there).
 * Every figure comes from the visitor's two answers; nothing is multiplied up or projected.
 */
export const TOTAL_RANGE = { min: 15, max: 12 * 60, step: 15, initial: 3 * 60 } as const;
export const TALKING_RANGE = { min: 0, step: 5, initial: 10 } as const;
export const SKIP_BELOW_MINUTES = 30;

const finite = (n: number, fallback = 0) => (Number.isFinite(n) ? n : fallback);

export interface Breakdown {
  total: number;
  talking: number;
  other: number;
  percent: number;
  days: number;
}

export function breakdown(totalMinutes: number, talkingMinutes: number): Breakdown {
  const total = Math.max(0, finite(totalMinutes));
  const talking = Math.min(total, Math.max(0, Math.round(finite(talkingMinutes))));
  const other = total - talking;
  const percent = total > 0 ? Math.round((other / total) * 100) : 0;
  const days = Math.floor((other * 365) / 60 / 24);
  return { total, talking, other, percent, days };
}

export const mostlyTalking = (b: Pick<Breakdown, 'other'>) => b.other < SKIP_BELOW_MINUTES;

/** "5 h 50 min", "10 min", "2 h". */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.round(finite(minutes)));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
}

/** "43 DAYS", "1 DAY"; null for 0 so "0 days" is never shown. */
export function formatDaysCaps(days: number): string | null {
  const d = Math.floor(finite(days));
  if (d <= 0) return null;
  return `${d} ${d === 1 ? 'DAY' : 'DAYS'}`;
}
