export type PlanKind = 'monthly' | 'yearly';

/** A purchasable plan with store-localised pricing. Provider-agnostic. */
export interface Plan {
  id: string;
  kind: PlanKind;
  /** Localised price string from the store, e.g. "₹399.00". Always shown as-is. */
  priceString: string;
  price: number;
  currencyCode: string;
  /** Free-trial length in days, or null if this plan has no trial for this user. */
  trialDays: number | null;
}

export interface CustomerState {
  isPro: boolean;
  inTrial: boolean;
  /** ISO date the current period ends (or trial ends), if known. */
  expiresAt: string | null;
  willRenew: boolean;
}

export const NO_ACCESS: CustomerState = { isPro: false, inTrial: false, expiresAt: null, willRenew: false };

export interface PurchaseResult {
  state: CustomerState;
  cancelled: boolean;
}

/** The app talks to this; RevenueCat is one implementation, a web provider (e.g. Dodo) could be another. */
export interface PaymentsProvider {
  /** `dev` = no store keys configured: everything unlocked. */
  readonly mode: 'live' | 'dev';
  getPlans(): Promise<Plan[]>;
  getState(): Promise<CustomerState>;
  purchase(planId: string): Promise<PurchaseResult>;
  restore(): Promise<CustomerState>;
  onChange(listener: (state: CustomerState) => void): () => void;
}
