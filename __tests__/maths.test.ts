import {
  breakdown,
  clampTalking,
  clampTotal,
  formatDaysCaps,
  formatDuration,
  formatReadout,
  skipsYear,
  snap,
  spokenDuration,
  TOTAL_RANGE,
} from '../src/onboarding/maths';

describe('breakdown', () => {
  it('splits the total into talking and everything else', () => {
    expect(breakdown(180, 10)).toEqual({ total: 180, talking: 10, other: 170, percent: 94, days: 43 });
  });

  it('computes days as floor(other * 365 / 60 / 24)', () => {
    // 360 min * 365 / 1440 = 91.25
    expect(breakdown(360, 0).days).toBe(91);
    // 350 min * 365 / 1440 = 88.7
    expect(breakdown(360, 10).days).toBe(88);
    // 4 min * 365 / 1440 = 1.01
    expect(breakdown(15, 11).days).toBe(1);
    expect(breakdown(15, 15).days).toBe(0);
  });

  it('rounds the percent', () => {
    expect(breakdown(180, 10).percent).toBe(94); // 94.4
    expect(breakdown(60, 25).percent).toBe(58); // 58.3
    expect(breakdown(60, 30).percent).toBe(50);
    expect(breakdown(60, 0).percent).toBe(100);
  });

  it('clamps talking to the total', () => {
    expect(breakdown(60, 90)).toMatchObject({ talking: 60, other: 0, percent: 0, days: 0 });
    expect(breakdown(60, -5)).toMatchObject({ talking: 0, other: 60 });
  });

  it('never produces NaN', () => {
    const b = breakdown(0, 0);
    expect(b).toEqual({ total: 0, talking: 0, other: 0, percent: 0, days: 0 });
    expect(breakdown(Number.NaN, Number.NaN).percent).toBe(0);
  });
});

describe('skipsYear', () => {
  it('skips when other is under 30 minutes', () => {
    expect(skipsYear(breakdown(45, 20))).toBe(true); // other 25
    expect(skipsYear(breakdown(30, 0))).toBe(false); // other 30
    expect(skipsYear(breakdown(180, 10))).toBe(false);
  });

  it('means days is never 0 on the screens that show it', () => {
    expect(breakdown(30, 0).days).toBeGreaterThan(0);
  });
});

describe('formatDuration', () => {
  it('matches the house format', () => {
    expect(formatDuration(350)).toBe('5 h 50 min');
    expect(formatDuration(10)).toBe('10 min');
    expect(formatDuration(120)).toBe('2 h');
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(60)).toBe('1 h');
  });
});

describe('formatReadout', () => {
  it('pads minutes once there are hours', () => {
    expect(formatReadout(360)).toBe('6 h 00 min');
    expect(formatReadout(195)).toBe('3 h 15 min');
    expect(formatReadout(45)).toBe('45 min');
  });
});

describe('formatDaysCaps', () => {
  it('never shows 0 days', () => {
    expect(formatDaysCaps(0)).toBeNull();
    expect(formatDaysCaps(1)).toBe('1 DAY');
    expect(formatDaysCaps(43)).toBe('43 DAYS');
  });
});

describe('ranges', () => {
  it('snaps the total to 15-minute steps between 15 min and 12 h', () => {
    expect(clampTotal(0)).toBe(15);
    expect(clampTotal(800)).toBe(720);
    expect(clampTotal(187)).toBe(180);
    expect(clampTotal(188)).toBe(195);
    expect(clampTotal(TOTAL_RANGE.initial)).toBe(180);
  });

  it('snaps to a step inside the range', () => {
    expect(snap(12, 5, 0, 30)).toBe(10);
    expect(snap(13, 5, 0, 30)).toBe(15);
    expect(snap(99, 5, 0, 30)).toBe(30);
  });

  it('caps talking at the total', () => {
    expect(clampTalking(90, 60)).toBe(60);
    expect(clampTalking(10, 15)).toBe(10);
  });
});

describe('spokenDuration', () => {
  it('reads naturally', () => {
    expect(spokenDuration(170)).toBe('2 hours 50 minutes');
    expect(spokenDuration(60)).toBe('1 hour');
    expect(spokenDuration(1)).toBe('1 minute');
    expect(spokenDuration(0)).toBe('0 minutes');
  });
});
