import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { provider } from './index';
import { NO_ACCESS, type CustomerState, type Plan } from './types';

interface PaymentsValue {
  mode: 'live' | 'dev';
  /** First state check finished. */
  ready: boolean;
  plans: Plan[];
  plansError: boolean;
  customer: CustomerState;
  isPro: boolean;
  busy: boolean;
  error: string | null;
  loadPlans: () => Promise<void>;
  purchase: (planId: string) => Promise<'purchased' | 'cancelled' | 'failed'>;
  restore: () => Promise<boolean>;
}

const Ctx = createContext<PaymentsValue | null>(null);

const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Please try again.');

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansError, setPlansError] = useState(false);
  const [customer, setCustomer] = useState<CustomerState>(NO_ACCESS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setPlansError(false);
    try {
      setPlans(await provider.getPlans());
    } catch {
      setPlansError(true);
    }
  }, []);

  useEffect(() => {
    let live = true;
    provider
      .getState()
      .then((s) => live && setCustomer(s))
      .catch(() => {})
      .finally(() => live && setReady(true));
    const off = provider.onChange((s) => live && setCustomer(s));
    return () => {
      live = false;
      off();
    };
  }, []);

  const purchase = useCallback(async (planId: string) => {
    setBusy(true);
    setError(null);
    try {
      const r = await provider.purchase(planId);
      setCustomer(r.state);
      return r.cancelled ? 'cancelled' : r.state.isPro ? 'purchased' : 'failed';
    } catch (e) {
      setError(message(e));
      return 'failed';
    } finally {
      setBusy(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const s = await provider.restore();
      setCustomer(s);
      if (!s.isPro) setError('No active subscription found for this account.');
      return s.isPro;
    } catch (e) {
      setError(message(e));
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo<PaymentsValue>(
    () => ({ mode: provider.mode, ready, plans, plansError, customer, isPro: customer.isPro, busy, error, loadPlans, purchase, restore }),
    [ready, plans, plansError, customer, busy, error, loadPlans, purchase, restore],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePayments(): PaymentsValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePayments must be used inside PaymentsProvider');
  return v;
}
