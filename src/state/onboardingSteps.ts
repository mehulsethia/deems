/** Ordered onboarding steps (files under app/(onboarding), then the paywall). Pure, no React. */
export const ONBOARDING_STEPS = [
  'cold-open',
  'pick-apps',
  'total-time',
  'talking-time',
  'receipt',
  'year',
  'refund',
  'whats-left',
  'trust',
  'login',
  'reveal',
  'paywall',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const isOnboardingStep = (s: string | null | undefined): s is OnboardingStep =>
  !!s && (ONBOARDING_STEPS as readonly string[]).includes(s);

export const stepIndex = (s: OnboardingStep) => ONBOARDING_STEPS.indexOf(s);

export const routeForStep = (s: OnboardingStep): string =>
  s === 'paywall' ? '/paywall' : `/(onboarding)/${s}`;

/** Steps that show the progress line (the login sheet is a modal on top of trust). */
const VISIBLE: readonly OnboardingStep[] = ONBOARDING_STEPS.filter((s) => s !== 'login');

/** Progress 0..1 for the thin line at the top of each screen. */
export const progressFor = (s: OnboardingStep): number => (VISIBLE.indexOf(s) + 1) / VISIBLE.length;
