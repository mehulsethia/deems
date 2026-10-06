import Purchases, { LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';
import { customerStateFrom, mapPackages } from './plans';
import type { CustomerState, PaymentsProvider, Plan, PurchaseResult } from './types';

/** RevenueCat-backed provider: Apple/Google in-app purchase, receipts validated by RevenueCat. No backend of ours. */
export function createRevenueCatProvider(apiKey: string): PaymentsProvider {
  let configured = false;
  const packages = new Map<string, PurchasesPackage>();

  const ensure = () => {
    if (configured) return;
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN);
    Purchases.configure({ apiKey });
    configured = true;
  };

  const loadPackages = async (): Promise<PurchasesPackage[]> => {
    ensure();
    const offerings = await Purchases.getOfferings();
    const available = offerings.current?.availablePackages ?? [];
    packages.clear();
    for (const p of available) packages.set(p.identifier, p);
    return available;
  };

  return {
    mode: 'live',

    async getPlans(): Promise<Plan[]> {
      return mapPackages(await loadPackages());
    },

    async getState(): Promise<CustomerState> {
      ensure();
      return customerStateFrom(await Purchases.getCustomerInfo());
    },

    async purchase(planId: string): Promise<PurchaseResult> {
      ensure();
      if (!packages.has(planId)) await loadPackages();
      const pkg = packages.get(planId);
      if (!pkg) throw new Error('That plan is no longer available.');
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        return { state: customerStateFrom(customerInfo), cancelled: false };
      } catch (e) {
        if ((e as { userCancelled?: boolean }).userCancelled) {
          return { state: customerStateFrom(await Purchases.getCustomerInfo()), cancelled: true };
        }
        throw e;
      }
    },

    async restore(): Promise<CustomerState> {
      ensure();
      return customerStateFrom(await Purchases.restorePurchases());
    },

    onChange(listener) {
      ensure();
      const handler = (info: Parameters<typeof customerStateFrom>[0]) => listener(customerStateFrom(info));
      Purchases.addCustomerInfoUpdateListener(handler);
      return () => {
        Purchases.removeCustomerInfoUpdateListener(handler);
      };
    },
  };
}
