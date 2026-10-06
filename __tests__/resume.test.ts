import { resolveStartRoute, type ProgressSnapshot } from '../src/state/resume';

const base: ProgressSnapshot = { signedIn: false, onboardingComplete: false, step: null, hasUsage: false };
const at = (over: Partial<ProgressSnapshot>) => resolveStartRoute({ ...base, ...over });

describe('resolveStartRoute', () => {
  it('starts at welcome for a new user', () => {
    expect(at({})).toBe('/(onboarding)/welcome');
  });

  it('sends a finished, signed-in user straight to the inbox', () => {
    expect(at({ signedIn: true, onboardingComplete: true, step: 'paywall', hasUsage: true })).toBe('/(main)/inbox');
  });

  it('resumes at the last step reached', () => {
    expect(at({ step: 'what-stays', hasUsage: true })).toBe('/(onboarding)/what-stays');
    expect(at({ step: 'usage' })).toBe('/(onboarding)/usage');
  });

  it('ignores unknown stored steps', () => {
    expect(at({ step: 'nonsense' })).toBe('/(onboarding)/welcome');
  });

  it('goes back to usage when answers are missing for screens that echo them', () => {
    for (const step of ['calculating', 'projection', 'comparison']) {
      expect(at({ step, hasUsage: false })).toBe('/(onboarding)/usage');
      expect(at({ step, hasUsage: true })).toBe(`/(onboarding)/${step}`);
    }
  });

  it('reopens the login modal from the connect screen', () => {
    expect(at({ step: 'login', hasUsage: true })).toBe('/(onboarding)/connect');
  });

  it('skips sign-in screens once already signed in', () => {
    expect(at({ signedIn: true, step: 'connect', hasUsage: true })).toBe('/(onboarding)/setup');
    expect(at({ signedIn: true, step: 'welcome' })).toBe('/(onboarding)/setup');
  });

  it('keeps later steps for a signed-in user who has not finished', () => {
    expect(at({ signedIn: true, step: 'reveal', hasUsage: true })).toBe('/(onboarding)/reveal');
    expect(at({ signedIn: true, step: 'paywall', hasUsage: true })).toBe('/paywall');
  });

  it('does not treat onboardingComplete alone as enough without a session', () => {
    expect(at({ onboardingComplete: true, step: 'paywall', hasUsage: true })).toBe('/paywall');
  });
});
