import { addDays, trialTimeline } from '../src/notifications/timeline';

describe('trialTimeline', () => {
  it('reminds on day 5 of a 7-day trial and bills on day 7', () => {
    expect(trialTimeline(7)).toEqual({ reminderDay: 5, billingDay: 7 });
  });

  it('skips the reminder for very short trials', () => {
    expect(trialTimeline(2).reminderDay).toBeNull();
    expect(trialTimeline(3).reminderDay).toBe(1);
  });

  it('adds calendar days', () => {
    expect(addDays(new Date(2026, 9, 6, 9), 7).getDate()).toBe(13);
    expect(addDays(new Date(2026, 9, 30, 9), 5).getMonth()).toBe(10);
  });
});
