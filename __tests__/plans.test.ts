import {
  billingSummary,
  cancellationNote,
  customerStateFrom,
  formatPrice,
  mapPackage,
  mapPackages,
  trialDaysOf,
  trialEndDate,
  yearlySavingsPercent,
  type PackageLike,
} from '../src/purchases/plans';
import { NO_ACCESS, type Plan } from '../src/purchases/types';

const pkg = (over: Partial<PackageLike> & { intro?: PackageLike['product']['introPrice'] } = {}): PackageLike => ({
  identifier: '$rc_monthly',
  packageType: 'MONTHLY',
  product: {
    identifier: 'deems_monthly',
    price: 4.99,
    priceString: '$4.99',
    currencyCode: 'USD',
    introPrice: over.intro === undefined ? { price: 0, periodUnit: 'DAY', periodNumberOfUnits: 7 } : over.intro,
  },
  ...over,
});

describe('trialDaysOf', () => {
  it('reads free intro periods in days, weeks, months', () => {
    expect(trialDaysOf({ price: 0, periodUnit: 'DAY', periodNumberOfUnits: 7 })).toBe(7);
    expect(trialDaysOf({ price: 0, periodUnit: 'WEEK', periodNumberOfUnits: 1 })).toBe(7);
    expect(trialDaysOf({ price: 0, periodUnit: 'MONTH', periodNumberOfUnits: 1 })).toBe(30);
  });
  it('ignores paid intro prices and missing intros', () => {
    expect(trialDaysOf({ price: 0.99, periodUnit: 'MONTH', periodNumberOfUnits: 1 })).toBeNull();
    expect(trialDaysOf(null)).toBeNull();
    expect(trialDaysOf(undefined)).toBeNull();
  });
});

describe('mapPackage(s)', () => {
  it('maps monthly and annual packages with the store price string untouched', () => {
    expect(mapPackage(pkg())).toEqual({ id: '$rc_monthly', kind: 'monthly', priceString: '$4.99', price: 4.99, currencyCode: 'USD', trialDays: 7 });
    expect(mapPackage(pkg({ identifier: '$rc_annual', packageType: 'ANNUAL' }))?.kind).toBe('yearly');
  });
  it('drops other package types', () => {
    expect(mapPackage(pkg({ packageType: 'LIFETIME' }))).toBeNull();
  });
  it('orders yearly first', () => {
    const plans = mapPackages([pkg(), pkg({ identifier: '$rc_annual', packageType: 'ANNUAL' })]);
    expect(plans.map((p) => p.kind)).toEqual(['yearly', 'monthly']);
  });
  it('shows no trial when the user is not eligible (no intro price)', () => {
    expect(mapPackage(pkg({ intro: null }))?.trialDays).toBeNull();
  });
});

describe('customerStateFrom', () => {
  it('is pro with an active "pro" entitlement and detects trials', () => {
    const state = customerStateFrom({ entitlements: { active: { pro: { expirationDate: '2026-11-01T00:00:00Z', willRenew: true, periodType: 'TRIAL' } } } });
    expect(state).toEqual({ isPro: true, inTrial: true, expiresAt: '2026-11-01T00:00:00Z', willRenew: true });
  });
  it('has no access without the entitlement', () => {
    expect(customerStateFrom({ entitlements: { active: {} } })).toEqual(NO_ACCESS);
    expect(customerStateFrom({ entitlements: { active: { other: { expirationDate: null, willRenew: false, periodType: 'NORMAL' } } } })).toEqual(NO_ACCESS);
  });
});

describe('dates and disclosure', () => {
  const now = new Date(2026, 9, 6, 12, 0, 0); // 6 Oct 2026, local time
  const yearly: Plan = { id: 'y', kind: 'yearly', priceString: '$29.99', price: 29.99, currencyCode: 'USD', trialDays: 7 };
  const monthly: Plan = { id: 'm', kind: 'monthly', priceString: '$4.99', price: 4.99, currencyCode: 'USD', trialDays: 7 };

  it('adds trial days, across month boundaries', () => {
    expect(trialEndDate(now, 7).getDate()).toBe(13);
    expect(trialEndDate(new Date(2026, 9, 28), 7).getMonth()).toBe(10);
    expect(now.getDate()).toBe(6); // input not mutated
  });

  it('states the trial end date, then the real price and period', () => {
    const text = billingSummary(yearly, now, 'en-US');
    expect(text).toBe('Free for 7 days, until October 13, 2026. Then $29.99 per year.');
  });

  it('states charge-today for plans without a trial', () => {
    expect(billingSummary({ ...monthly, trialDays: null }, now, 'en-US')).toBe('$4.99 per month, charged today.');
  });

  it('cancellation note names the store and the date', () => {
    expect(cancellationNote(monthly, now, 'App Store', 'en-US')).toContain('Apple ID settings');
    expect(cancellationNote(monthly, now, 'App Store', 'en-US')).toContain('October 13, 2026');
    expect(cancellationNote(monthly, now, 'Google Play', 'en-US')).toContain('Play Store');
  });
});

describe('yearlySavingsPercent', () => {
  const m: Plan = { id: 'm', kind: 'monthly', priceString: '', price: 5, currencyCode: 'USD', trialDays: null };
  it('computes the real saving', () => {
    expect(yearlySavingsPercent(m, { ...m, kind: 'yearly', price: 30 })).toBe(50);
  });
  it('returns null when there is no saving or currencies differ', () => {
    expect(yearlySavingsPercent(m, { ...m, kind: 'yearly', price: 60 })).toBeNull();
    expect(yearlySavingsPercent(m, { ...m, kind: 'yearly', price: 30, currencyCode: 'INR' })).toBeNull();
  });
});

describe('formatPrice', () => {
  it('formats currency', () => {
    expect(formatPrice(2.5, 'USD', 'en-US')).toBe('$2.50');
  });
  it('falls back for unknown currency codes', () => {
    expect(formatPrice(2.5, 'not-a-code')).toContain('2.50');
  });
});
