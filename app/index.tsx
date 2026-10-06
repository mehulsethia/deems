import { Redirect, type Href } from 'expo-router';
import { readProgress } from '@/state/progress';
import { resolveStartRoute } from '@/state/resume';

/** Entry gate: inbox for a returning signed-in user, otherwise resume onboarding. */
export default function Index() {
  const p = readProgress();
  const route = resolveStartRoute({
    signedIn: p.signedIn,
    onboardingComplete: p.onboardingComplete,
    step: p.step,
    hasUsage: p.usageHours !== null && p.messagingMinutes !== null,
  });
  return <Redirect href={route as Href} />;
}
