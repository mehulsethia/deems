import { connectedPlatforms } from './platforms';
import { normalisePicked } from './platformMeta';
import { storage } from './storage';
import type { PlatformId } from '@/rules/types';

/**
 * Local app state only: onboarding position, the picked apps and the two time answers.
 * Credentials, cookies and message content are never read or stored here.
 */
export const KEYS = {
  onboardingStep: 'onboardingStep',
  onboardingComplete: 'onboardingComplete',
  pickedApps: 'pickedApps',
  totalMinutes: 'totalMinutes',
  talkingMinutes: 'talkingMinutes',
} as const;

function readPicked(): PlatformId[] {
  try {
    const raw = storage.getString(KEYS.pickedApps);
    return raw ? normalisePicked(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function readProgress() {
  return {
    /** Signed in to at least one platform. */
    signedIn: connectedPlatforms().length > 0,
    onboardingComplete: storage.getBoolean(KEYS.onboardingComplete) ?? false,
    step: storage.getString(KEYS.onboardingStep) ?? null,
    picked: readPicked(),
    totalMinutes: storage.getNumber(KEYS.totalMinutes) ?? null,
    talkingMinutes: storage.getNumber(KEYS.talkingMinutes) ?? null,
  };
}

export const markOnboardingComplete = () => storage.set(KEYS.onboardingComplete, true);
export const saveStep = (step: string) => storage.set(KEYS.onboardingStep, step);
export const savePicked = (ids: readonly PlatformId[]) => storage.set(KEYS.pickedApps, JSON.stringify(normalisePicked(ids)));
export const saveTotal = (minutes: number) => storage.set(KEYS.totalMinutes, minutes);
export const saveTalking = (minutes: number) => storage.set(KEYS.talkingMinutes, minutes);
export const clearProgress = () => storage.clearAll();
