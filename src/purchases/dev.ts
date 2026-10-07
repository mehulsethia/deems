import type { CustomerState, PaymentsProvider, Plan } from './types';

const UNLOCKED: CustomerState = { isPro: true, inTrial: false, expiresAt: null, willRenew: false };

/**
 * Plans for reviewing the paywall without store keys, at the launch prices (US).
 * Real prices always come from the store: set $3.99 / $14.99 as the base price and
 * ₹299 / ₹999 for India in App Store Connect and Google Play.
 */
const PLANS: Plan[] = [
  { id: 'dev_yearly', kind: 'yearly', priceString: '$14.99', price: 14.99, currencyCode: 'USD', trialDays: 7 },
  { id: 'dev_monthly', kind: 'monthly', priceString: '$3.99', price: 3.99, currencyCode: 'USD', trialDays: null },
];

/** Used when no RevenueCat key is set: unlocks everything. */
export const devProvider: PaymentsProvider = {
  mode: 'dev',
  getPlans: async () => PLANS,
  getState: async () => UNLOCKED,
  purchase: async () => ({ state: UNLOCKED, cancelled: false }),
  restore: async () => UNLOCKED,
  onChange: () => () => {},
};
