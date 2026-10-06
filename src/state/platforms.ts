import { signedInKey } from './platformKeys';
import { storage } from './storage';
import type { PlatformId } from '@/rules/types';

const ACTIVE_KEY = 'activePlatform';
const IDS: readonly PlatformId[] = ['instagram', 'messenger', 'threads'];

export const isSignedInTo = (id: PlatformId): boolean => storage.getBoolean(signedInKey(id)) ?? false;
export const markSignedInTo = (id: PlatformId) => storage.set(signedInKey(id), true);

export const connectedPlatforms = (): PlatformId[] => IDS.filter(isSignedInTo);

export function getActivePlatform(): PlatformId {
  const v = storage.getString(ACTIVE_KEY);
  const id = IDS.find((i) => i === v) ?? 'instagram';
  return isSignedInTo(id) || id === 'instagram' ? id : 'instagram';
}
export const setActivePlatform = (id: PlatformId) => storage.set(ACTIVE_KEY, id);
