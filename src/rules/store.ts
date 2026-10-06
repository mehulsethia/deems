import instagram from './instagram.json';
import messenger from './messenger.json';
import threads from './threads.json';
import type { PlatformId, PlatformRules } from './types';

/** Typed assignments: the build fails if a JSON file drifts from the PlatformRules shape (JSON widens `id` to string, so it is pinned here). */
const instagramPack: PlatformRules = { ...instagram, id: 'instagram' };
const messengerPack: PlatformRules = { ...messenger, id: 'messenger' };
const threadsPack: PlatformRules = { ...threads, id: 'threads' };

export const bundledPacks: Record<PlatformId, PlatformRules> = {
  instagram: instagramPack,
  messenger: messengerPack,
  threads: threadsPack,
};

export const PLATFORM_IDS: readonly PlatformId[] = ['instagram', 'messenger', 'threads'];

/** Back-compat: the Instagram pack, used by onboarding. */
export const bundledPack = instagramPack;

export function getPack(id: PlatformId): PlatformRules {
  return bundledPacks[id];
}

/** Milestone 5 layers remote packs and the MMKV cache on top of this. */
export function getActivePack(): PlatformRules {
  return getPack('instagram');
}
