/** Pure trial-timeline maths. "Today" is day 0; billing starts on day `trialDays`. */

/** The reminder lands two days before billing. */
export const REMIND_DAYS_BEFORE = 2;

export interface TrialTimeline {
  /** Day the reminder fires, or null for trials too short to need one. */
  reminderDay: number | null;
  billingDay: number;
}

export function trialTimeline(trialDays: number): TrialTimeline {
  const billingDay = Math.max(0, Math.floor(trialDays));
  const reminderDay = billingDay - REMIND_DAYS_BEFORE;
  return { reminderDay: reminderDay >= 1 ? reminderDay : null, billingDay };
}

export function addDays(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  d.setDate(d.getDate() + days);
  return d;
}
