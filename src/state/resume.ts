import { breakdown, skipsYear } from '@/onboarding/maths';
import { isOnboardingStep, routeForStep, stepIndex, type OnboardingStep } from './onboardingSteps';

export interface ProgressSnapshot {
  /** Signed in to at least one platform. */
  signedIn: boolean;
  onboardingComplete: boolean;
  /** Last onboarding step the user reached, as stored. */
  step: string | null;
  /** At least one app picked on the pick-apps screen. */
  hasApps: boolean;
  totalMinutes: number | null;
  talkingMinutes: number | null;
}

export const INBOX_ROUTE = '/(main)/inbox';

const after = (step: OnboardingStep, from: OnboardingStep) => stepIndex(step) >= stepIndex(from);

/** Where the app should open: the inbox for a finished, signed-in user, otherwise where onboarding left off. */
export function resolveStartRoute(p: ProgressSnapshot): string {
  if (p.signedIn && p.onboardingComplete) return INBOX_ROUTE;

  let step: OnboardingStep = isOnboardingStep(p.step) ? p.step : 'cold-open';

  // The login sheet is a modal; reopen on the screen that launches it.
  if (step === 'login') step = 'trust';

  // Already signed in: never send them back through the earlier screens.
  if (p.signedIn) return routeForStep(after(step, 'trust') ? step : 'trust');

  // Screens that echo earlier answers cannot show without them.
  if (after(step, 'total-time') && !p.hasApps) step = 'pick-apps';
  else if (after(step, 'talking-time') && p.totalMinutes === null) step = 'total-time';
  else if (after(step, 'receipt') && p.talkingMinutes === null) step = 'talking-time';

  // Year and refund are skipped for someone who is mostly here to talk.
  if ((step === 'year' || step === 'refund') && skipsYear(breakdown(p.totalMinutes ?? 0, p.talkingMinutes ?? 0))) {
    step = 'whats-left';
  }

  return routeForStep(step);
}
