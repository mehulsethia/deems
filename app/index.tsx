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
    hasApps: p.picked.length > 0,
    totalMinutes: p.totalMinutes,
    talkingMinutes: p.talkingMinutes,
  });
  return <Redirect href={route as Href} />;
}
