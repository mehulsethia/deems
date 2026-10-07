/**
 * Launch prices. The App Store and Google Play charge the real amounts (local currency elsewhere);
 * these must match what's set in App Store Connect and the Play Console.
 */
export type Region = 'IN' | 'default';

export const PRICES: Record<Region, { currency: string; locale: string; monthly: number; yearly: number }> = {
  default: { currency: 'USD', locale: 'en-US', monthly: 3.99, yearly: 14.99 },
  IN: { currency: 'INR', locale: 'en-IN', monthly: 299, yearly: 999 },
};

/** Free trial on the yearly plan, in days. */
export const TRIAL_DAYS = 7;

export function money(amount: number, region: Region): string {
  const p = PRICES[region];
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(p.locale, {
    style: 'currency',
    currency: p.currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface PlanSummary {
  monthly: string;
  yearly: string;
  yearlyPerMonth: string;
  /** Yearly vs twelve monthly payments. */
  savePercent: number;
  saveAmount: string;
}

export function planSummary(region: Region): PlanSummary {
  const p = PRICES[region];
  const twelve = p.monthly * 12;
  return {
    monthly: money(p.monthly, region),
    yearly: money(p.yearly, region),
    yearlyPerMonth: money(Math.round((p.yearly / 12) * 100) / 100, region),
    savePercent: Math.round((1 - p.yearly / twelve) * 100),
    saveAmount: money(Math.round((twelve - p.yearly) * 100) / 100, region),
  };
}

/** Best guess from the browser: Indian time zone or an -IN language. */
export function detectRegion(): Region {
  if (typeof window === 'undefined') return 'default';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'IN';
    if ((navigator.languages ?? [navigator.language]).some((l) => /-IN$/i.test(l))) return 'IN';
  } catch {}
  return 'default';
}
