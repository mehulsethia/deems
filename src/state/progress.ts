import { useMMKVBoolean, useMMKVNumber, useMMKVString } from 'react-native-mmkv';
import { storage } from './storage';

/**
 * Local app state only: a signed-in flag, onboarding position and the two usage answers.
 * Credentials, cookies and message content are never read or stored here.
 */
export const KEYS = {
  signedIn: 'signedIn',
  onboardingStep: 'onboardingStep',
  onboardingComplete: 'onboardingComplete',
  usageHours: 'usageHours',
  messagingMinutes: 'messagingMinutes',
} as const;

export function readProgress() {
  return {
    signedIn: storage.getBoolean(KEYS.signedIn) ?? false,
    onboardingComplete: storage.getBoolean(KEYS.onboardingComplete) ?? false,
    step: storage.getString(KEYS.onboardingStep) ?? null,
    usageHours: storage.getNumber(KEYS.usageHours) ?? null,
    messagingMinutes: storage.getNumber(KEYS.messagingMinutes) ?? null,
  };
}

export const markOnboardingComplete = () => storage.set(KEYS.onboardingComplete, true);
export const saveStep = (step: string) => storage.set(KEYS.onboardingStep, step);
export const saveUsage = (hours: number, messagingMinutes: number) => {
  storage.set(KEYS.usageHours, hours);
  storage.set(KEYS.messagingMinutes, messagingMinutes);
};
export const clearProgress = () => storage.clearAll();

export const useSignedIn = () => useMMKVBoolean(KEYS.signedIn, storage);
export const useUsageHours = () => useMMKVNumber(KEYS.usageHours, storage);
export const useMessagingMinutes = () => useMMKVNumber(KEYS.messagingMinutes, storage);
export const useStep = () => useMMKVString(KEYS.onboardingStep, storage);
