import { isOnboardingStep, routeForStep, stepIndex, type OnboardingStep } from './onboardingSteps';

export interface ProgressSnapshot {
  signedIn: boolean;
  onboardingComplete: boolean;
  /** Last onboarding step the user reached, as stored. */
  step: string | null;
  /** Whether both usage answers have been saved. */
  hasUsage: boolean;
}

export const INBOX_ROUTE = '/(main)/inbox';

const NEEDS_USAGE: readonly OnboardingStep[] = ['calculating', 'projection', 'comparison'];

/** Where the app should open: the inbox for a finished, signed-in user, otherwise where onboarding left off. */
export function resolveStartRoute(p: ProgressSnapshot): string {
  if (p.signedIn && p.onboardingComplete) return INBOX_ROUTE;

  let step: OnboardingStep = isOnboardingStep(p.step) ? p.step : 'welcome';

  // The login sheet is a modal; reopen on the screen that launches it.
  if (step === 'login') step = 'connect';

  // Screens that echo the user's answers cannot show without them.
  if (NEEDS_USAGE.includes(step) && !p.hasUsage) step = 'usage';

  // Already signed in: never send them back through the sign-in screens.
  if (p.signedIn && stepIndex(step) < stepIndex('setup')) step = 'setup';

  return routeForStep(step);
}
