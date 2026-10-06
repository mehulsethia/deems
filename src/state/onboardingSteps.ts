/** Ordered onboarding steps (files under app/(onboarding), then the paywall). Pure, no React. */
export const ONBOARDING_STEPS = [
  'welcome',
  'usage',
  'calculating',
  'projection',
  'comparison',
  'what-stays',
  'connect',
  'login',
  'setup',
  'reveal',
  'paywall',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const isOnboardingStep = (s: string | null | undefined): s is OnboardingStep =>
  !!s && (ONBOARDING_STEPS as readonly string[]).includes(s);

export const stepIndex = (s: OnboardingStep) => ONBOARDING_STEPS.indexOf(s);

export const routeForStep = (s: OnboardingStep): string =>
  s === 'paywall' ? '/paywall' : `/(onboarding)/${s}`;
