/**
 * Maths for the "years lost" calculator. Deliberately simple and stated on the page:
 * time is measured against waking hours, up to an average lifespan.
 */
export const WAKING_HOURS = 16;
export const LIFESPAN = 80;

export const DAILY = { min: 0, max: 8, step: 0.25, initial: 2.5 } as const;
export const AGE = { min: 16, max: 75, step: 1, initial: 30 } as const;

/** Years of waking life spent scrolling from `age` to LIFESPAN, at `hours` a day. */
export function yearsLost(hours: number, age: number): number {
  const remaining = Math.max(0, LIFESPAN - age);
  return (hours / WAKING_HOURS) * remaining;
}

/** Whole days a year spent scrolling at `hours` a day (24-hour days). */
export function daysPerYear(hours: number): number {
  return Math.round((hours * 365) / 24);
}

/** "2 hours 30 minutes", "45 minutes", "1 hour". */
export function formatDaily(hours: number): string {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const hs = h ? `${h} hour${h === 1 ? '' : 's'}` : '';
  const ms = m ? `${m} minutes` : '';
  return [hs, ms].filter(Boolean).join(' ') || '0 minutes';
}

export const formatYears = (y: number) => (y >= 10 ? Math.round(y).toString() : (Math.round(y * 10) / 10).toFixed(1));
