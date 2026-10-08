import { signedInKey } from './platformKeys';
import { storage } from './storage';
import type { PlatformId } from '@/rules/types';

const ACTIVE_KEY = 'activePlatform';
const IDS: readonly PlatformId[] = ['instagram', 'threads', 'messenger'];

export const isSignedInTo = (id: PlatformId): boolean => storage.getBoolean(signedInKey(id)) ?? false;
export const markSignedInTo = (id: PlatformId) => storage.set(signedInKey(id), true);
export const markSignedOutOf = (id: PlatformId) => storage.remove(signedInKey(id));

export const connectedPlatforms = (): PlatformId[] => IDS.filter(isSignedInTo);

/** The stored platform if signed in to it, else the first connected one, else Instagram. */
export function getActivePlatform(): PlatformId {
  const v = storage.getString(ACTIVE_KEY);
  const stored = IDS.find((i) => i === v);
  if (stored && isSignedInTo(stored)) return stored;
  return connectedPlatforms()[0] ?? stored ?? 'instagram';
}
export const setActivePlatform = (id: PlatformId) => storage.set(ACTIVE_KEY, id);
