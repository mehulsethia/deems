/** Ordered onboarding route names (files under app/(onboarding)). Pure, no React. */
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
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
