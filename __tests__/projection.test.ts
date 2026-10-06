import {
  comparison,
  formatDuration,
  formatMinutes,
  projection,
  sanitize,
  scrollingYears,
  scrollMinutesPerDay,
  toDuration,
} from '../src/onboarding/projection';

describe('scrollMinutesPerDay', () => {
  it('subtracts messaging from total time', () => {
    expect(scrollMinutesPerDay({ hoursPerDay: 3, messagingMinutesPerDay: 30 })).toBe(150);
  });
  it('is zero when everything is messaging', () => {
    expect(scrollMinutesPerDay({ hoursPerDay: 1, messagingMinutesPerDay: 60 })).toBe(0);
  });
  it('never goes negative when messaging exceeds total', () => {
    expect(scrollMinutesPerDay({ hoursPerDay: 1, messagingMinutesPerDay: 200 })).toBe(0);
  });
});

describe('scrollingYears', () => {
  it('matches the shown formula: scroll hours x 50 / 24', () => {
    // 2.5 h/day scrolling -> 2.5 * 50 / 24
    expect(scrollingYears({ hoursPerDay: 3, messagingMinutesPerDay: 30 })).toBeCloseTo(5.2083, 3);
  });
  it('24 hours a day of scrolling is the whole 50 years', () => {
    expect(scrollingYears({ hoursPerDay: 24, messagingMinutesPerDay: 0 })).toBeCloseTo(50, 10);
  });
  it('is zero with no scrolling', () => {
    expect(scrollingYears({ hoursPerDay: 0, messagingMinutesPerDay: 0 })).toBe(0);
  });
  it('honours a custom horizon', () => {
    expect(scrollingYears({ hoursPerDay: 12, messagingMinutesPerDay: 0 }, 10)).toBeCloseTo(5, 10);
  });
});

describe('sanitize', () => {
  it('clamps impossible and non-finite values', () => {
    expect(sanitize({ hoursPerDay: 99, messagingMinutesPerDay: -5 })).toEqual({ hoursPerDay: 24, messagingMinutesPerDay: 0 });
    expect(sanitize({ hoursPerDay: NaN, messagingMinutesPerDay: NaN })).toEqual({ hoursPerDay: 0, messagingMinutesPerDay: 0 });
  });
});

describe('toDuration / formatDuration', () => {
  it('uses years with one decimal from about a year up', () => {
    expect(toDuration(5.2083)).toEqual({ value: 5.2, unit: 'years' });
    expect(formatDuration({ value: 5.2, unit: 'years' })).toBe('5.2 years');
  });
  it('falls back to months, then days, for small numbers', () => {
    expect(toDuration(0.5)).toEqual({ value: 6, unit: 'months' });
    expect(toDuration(0.01)).toEqual({ value: 4, unit: 'days' });
  });
  it('singularises one unit', () => {
    expect(formatDuration({ value: 1, unit: 'years' })).toBe('1 year');
    expect(formatDuration({ value: 1, unit: 'months' })).toBe('1 month');
  });
});

describe('projection', () => {
  it('returns the number and a formula that states its own working', () => {
    const p = projection({ hoursPerDay: 3, messagingMinutesPerDay: 30 });
    expect(p.duration).toEqual({ value: 5.2, unit: 'years' });
    expect(p.formula).toContain('3 h/day on Instagram − 30 min messaging = 2.5 h/day scrolling');
    expect(p.formula).toContain('2.5 h × 50 years ÷ 24 h = 5.21 years');
  });
  it('reports zero scrolling honestly', () => {
    const p = projection({ hoursPerDay: 1, messagingMinutesPerDay: 60 });
    expect(p.years).toBe(0);
    expect(p.duration).toEqual({ value: 0, unit: 'days' });
  });
});

describe('comparison', () => {
  it('compares total time with messaging only', () => {
    const c = comparison({ hoursPerDay: 2, messagingMinutesPerDay: 30 });
    expect(c).toEqual({ nowMinutes: 120, messagingMinutes: 30, messagingRatio: 0.25, savedMinutesPerDay: 90 });
  });
  it('avoids dividing by zero', () => {
    expect(comparison({ hoursPerDay: 0, messagingMinutesPerDay: 0 }).messagingRatio).toBe(0);
  });
});

describe('formatMinutes', () => {
  it('formats minutes and hours', () => {
    expect(formatMinutes(45)).toBe('45 min');
    expect(formatMinutes(120)).toBe('2 h');
    expect(formatMinutes(150)).toBe('2 h 30 min');
  });
});
