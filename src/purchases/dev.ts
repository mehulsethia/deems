import type { CustomerState, PaymentsProvider, Plan } from './types';

const UNLOCKED: CustomerState = { isPro: true, inTrial: false, expiresAt: null, willRenew: false };

/** Placeholder plans so the paywall UI can be reviewed without store keys. Prices are not real. */
const PLANS: Plan[] = [
  { id: 'dev_yearly', kind: 'yearly', priceString: '$29.99', price: 29.99, currencyCode: 'USD', trialDays: 7 },
  { id: 'dev_monthly', kind: 'monthly', priceString: '$4.99', price: 4.99, currencyCode: 'USD', trialDays: 7 },
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
