import { revenueCatKey } from './config';
import { devProvider } from './dev';
import { createRevenueCatProvider } from './revenuecat';
import type { PaymentsProvider } from './types';

export const provider: PaymentsProvider = revenueCatKey ? createRevenueCatProvider(revenueCatKey) : devProvider;

export * from './types';
export * from './plans';
export { LEGAL, MANAGE_SUBSCRIPTIONS_URL, STORE } from './config';
